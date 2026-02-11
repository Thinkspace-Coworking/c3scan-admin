# GoPostal iOS Architecture v0.4
## Mobile API Design for C3scan Integration

**Date:** 2026-02-10  
**Spec Version:** C3scan_Design_Spec_v0.2.3  
**Status:** Draft - Pending Review

---

## Authentication & Multi-Location Logic

### Operator Resolution via Email Domain
```
peter@thinkspace.com → email_domain = "thinkspace.com"
                     → Lookup c3scan.operator WHERE email_domain = "thinkspace.com"
                     → Returns: operator_id, operator_name
```

### Location Selection
The iOS app uses `c3scan.location.location_names` to:
1. Show location picker after login (if multiple locations for operator)
2. Store selected `location_id` with each scanned mail item
3. Allow location switching from settings

---

## Two-Flow Upload System

### Flow 1: Matched Mail → `mail_items`
When OCR fuzzy matching finds a confident match:
- Creates `mail_item` record directly
- Status: `uploaded` (per spec section 4.2)
- Available immediately in admin mail list

### Flow 2: Unmatched Mail → `alias_suggestions` → `mail_items`
When no confident match found:
1. Creates `alias_suggestion` record (pending admin review)
2. Admin reviews in webapp, approves/rejects
3. On approval: record promoted to `mail_items`
4. On rejection: discarded or returned to sender

---

## Scan Results Screen Flow

```
┌─────────────────────────────────────────────────────────┐
│  SCAN RESULTS                                           │
├─────────────────────────────────────────────────────────┤
│  TOP 3 MATCHES (highest confidence)                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 1. Acme Corp (PMB 101) - 94% match    [MATCH]   │   │
│  │ 2. ACME Industries (PMB 102) - 87%    [MATCH]   │   │
│  │ 3. Acme LLC (PMB 103) - 82%           [MATCH]   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  OCR DEBUG                                              │
│  ─────────────────────────────────────────────────────  │
│  Raw text: "ACME CORP STE 100"                          │
│  Normalized: "acme corp ste 100"                        │
│  Tokens: ["acme", "corp", "ste", "100"]                 │
│                                                         │
│  [SEARCH COMPANIES]  [Return to Sender (RTS)]          │
└─────────────────────────────────────────────────────────┘
```

### Button Actions
| Button | Action |
|--------|--------|
| [MATCH] | Select this company, create `mail_item` with this `mailbox_id` |
| [SEARCH COMPANIES] | Manual search modal, queries `alias_name_normalized`, shows `mailbox_id` + `alias_name` |
| [Return to Sender (RTS)] | Discard scan, return to camera view |

---

## Data Flow Diagram

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   iOS App   │────→│  Local SQLite    │────→│  Fuzzy Matching  │
│   (Scan)    │     │  (company_cache) │     │  (9-layer algo)  │
└─────────────┘     └──────────────────┘     └────────┬─────────┘
                                                      │
                              ┌───────────────────────┼───────────────────────┐
                              │                       │                       │
                              ▼                       ▼                       ▼
                        ┌─────────┐           ┌─────────────┐         ┌──────────────┐
                        │ MATCH   │           │  NOT FOUND  │         │   MANUAL     │
                        │  >90%   │           │  (no match) │         │   SEARCH     │
                        └────┬────┘           └──────┬──────┘         └──────┬───────┘
                             │                       │                       │
                             ▼                       ▼                       ▼
                    ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
                    │ POST /mail      │    │ POST /suggestions│    │ GET /search?q=  │
                    │ (direct insert) │    │ (pending review) │    │ (pick match)    │
                    └─────────────────┘    └──────────────────┘    └─────────────────┘
                             │                       │                       │
                             ▼                       ▼                       ▼
                    ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
                    │ mail_items      │    │ alias_suggestions│    │ → POST /mail    │
                    │ (immediate)     │    │ (admin review)   │    │   (after pick)  │
                    └─────────────────┘    └──────────────────┘    └─────────────────┘
                                                      │
                                               [ADMIN APPROVES]
                                                      │
                                                      ▼
                                             ┌─────────────────┐
                                             │ → mail_items    │
                                             │   (promoted)    │
                                             └─────────────────┘
```

---

## Local SQLite Schema (iOS)

```sql
-- Synced from Supabase via GET /aliases/sync
CREATE TABLE company_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id UUID NOT NULL,           -- From company_alias.company_id
    alias_name TEXT NOT NULL,           -- From company_alias.alias_name
    alias_name_normalized TEXT NOT NULL,-- From company_alias.alias_name_normalized
    mailbox_id UUID NOT NULL,           -- From mailbox table
    location_id UUID NOT NULL,          -- From location table
    operator_id UUID NOT NULL,          -- From operator table
    sync_timestamp INTEGER NOT NULL     -- For incremental sync
);

-- Queue for batch upload
CREATE TABLE upload_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    queue_type TEXT NOT NULL CHECK(queue_type IN ('mail_item', 'alias_suggestion')),
    payload_json TEXT NOT NULL,         -- Full JSON payload
    image_paths TEXT NOT NULL,          -- Comma-separated local image paths
    retry_count INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    uploaded_at INTEGER                 -- NULL until successful
);
```

---

## Settings (Configurable)

| Setting | Default | Description |
|---------|---------|-------------|
| `batch_upload_size` | 50 | Max items per batch upload when coming back online |
| `sync_interval_minutes` | 60 | How often to sync company aliases |
| `upload_retry_attempts` | 3 | Retry count for failed uploads |

---

## Image Upload Flow (Supabase Storage)

The iOS app uploads images directly to Supabase Storage bucket `mail-photos`, not through the API:

```
1. POST /api/mobile/v1/images/upload-url
   → Returns: { "upload_url": "https://...supabase.co/...", "storage_path": "uuid/2026/02/10/img.jpg" }

2. PUT image bytes directly to upload_url (Supabase Storage)

3. POST /api/mobile/v1/mail  
   → Body includes: { "envelope_image": "storage_path:uuid/2026/02/10/img.jpg" }
```

This avoids base64 overhead and leverages Supabase's signed URL security.

---

## Required API Endpoints

### 1. Authentication (Google OAuth)
```
POST /api/mobile/v1/auth/token
Body: {
  "id_token": "<Google ID Token from iOS>",
  "provider": "google",
  "operator_id": "uuid"
}
Response: {
  "access_token": "jwt",
  "token_type": "Bearer",
  "expires_in": 2592000,
  "user": {
    "user_id": "uuid",
    "email": "peter@thinkspace.com",
    "display_name": "Peter Chee"
  },
  "operator": {
    "operator_id": "uuid",
    "operator_name": "Thinkspace",
    "slug": "thinkspace"
  },
  "locations": [...]
}
```

**Auth Flow:**
1. iOS app authenticates with Google Sign-In
2. Receives Google ID token
3. Sends ID token to `/auth/token`
4. Server verifies token with Google
5. Returns JWT for subsequent API calls
6. Email stored/displayed in settings screen

**Security:** No passwords stored. OAuth only.

### 2. Sync Company Aliases
```
GET /api/mobile/v1/aliases/sync?since={timestamp}&operator_id={uuid}
Response: {
  "aliases": [
    {
      "company_id": "uuid",
      "alias_name": "Acme Corp",
      "alias_name_normalized": "acme corp",
      "mailbox_id": "uuid",
      "mailbox_pmb": "101",
      "location_id": "uuid",
      "location_name": "Thinkspace Seattle"
    }
  ],
  "sync_timestamp": 1739200000
}
```

### 3. Search Aliases (Manual Override)
```
GET /api/mobile/v1/aliases/search?q={query}&operator_id={uuid}
Response: {
  "results": [
    {
      "mailbox_id": "uuid",
      "mailbox_pmb": "101",
      "alias_name": "Acme Corp",
      "confidence": 0.95
    }
  ]
}
```

### 4. Get Signed URL for Image Upload
```
POST /api/mobile/v1/images/upload-url
Body: {
  "content_type": "image/jpeg",
  "filename": "scan_20260210_160000.jpg",
  "operator_id": "uuid"
}
Response: {
  "upload_url": "https://xxxx.supabase.co/storage/v1/object/sign/mail-photos/...",
  "storage_path": "operator_uuid/2026/02/10/uuid.jpg",
  "expires_in": 300
}
-- Then iOS PUTs image bytes directly to upload_url
```

### 5. Upload Matched Mail (after image uploaded to Supabase)
```
POST /api/mobile/v1/mail
Body: {
  "operator_id": "uuid",
  "location_id": "uuid",
  "mailbox_id": "uuid",           -- From fuzzy match
  "scanned_by_email": "peter@thinkspace.com",
  "envelope_image": "storage_path:operator_uuid/2026/02/10/uuid.jpg",
  "ocr_raw_text": "ACME CORP STE 100",
  "ocr_confidence": 0.94,
  "package_type": "correspondence",
  "carrier": "USPS",              -- Optional
  "tracking_number": "...",       -- Optional
  "scanned_at": "2026-02-10T16:00:00Z",
  "image_hash": "a1b2c3d4e5f67890"  -- For future duplicate detection
}
Response: { "mail_item_id": "uuid", "status": "uploaded" }
```

### 6. Upload Alias Suggestion (No Match)
```
POST /api/mobile/v1/alias-suggestions
Body: {
  "operator_id": "uuid",
  "location_id": "uuid",
  "scanned_by_email": "peter@thinkspace.com",
  "suggested_alias_name": "Unknown Company Inc", -- User input or best guess
  "envelope_image": "storage_path:operator_uuid/2026/02/10/uuid.jpg",
  "ocr_raw_text": "UNKNOWN CO STE 500",
  "ocr_confidence": 0.45,          -- Low confidence
  "scanned_at": "2026-02-10T16:00:00Z",
  "client_scan_id": "scan_20260210_160000_abc123"
}
Response: { "suggestion_id": "uuid", "status": "pending_review" }
```

---

## Open Questions (Resolved ✓)

| Question | Answer |
|----------|--------|
| Batch size limit | 50 default, configurable in iOS settings ✓ |
| Image upload | Signed URLs to Supabase Storage bucket `mail-photos` ✓ |
| Duplicate detection | Placeholder fields added. Server-side process TBD; employee handles near-duplicates manually for now ✓ |
| `alias_suggestions` table | Already exists in Supabase ✓ |

---

## Implementation Checklist

### Phase 1: Next.js API Routes (c3scan-admin)
- [ ] `POST /api/mobile/v1/auth/token`
- [ ] `GET /api/mobile/v1/aliases/sync`
- [ ] `GET /api/mobile/v1/aliases/search`
- [ ] `POST /api/mobile/v1/images/upload-url` (generates Supabase signed URL)
- [ ] `POST /api/mobile/v1/mail`
- [ ] `POST /api/mobile/v1/mail/batch`
- [ ] `POST /api/mobile/v1/alias-suggestions`
- [ ] `GET /api/mobile/v1/locations`
- [ ] `GET /api/mobile/v1/stats`

### Phase 2: iOS App Updates (GoPostal)
- [ ] Replace `SupabaseManager` with `APIClient` (URLSession + JWT)
- [ ] Update `UploadQueueManager` to use new endpoints
- [ ] Add image upload flow (get signed URL → upload to Supabase → send storage_path)
- [ ] Implement batch upload when coming back online
- [ ] Add `alias_suggestions` flow for unmatched scans

### Phase 3: Data Migration
- [ ] Verify `alias_suggestions` table schema matches spec
- [ ] Add `image_hash` column to `mail_items` (for future duplicate detection)

---

## Next Steps

Ready to implement:
1. **Stub Next.js API routes** in `c3scan-admin/src/app/api/mobile/v1/`
2. **Update iOS** `UploadQueueManager` to use the new endpoints
