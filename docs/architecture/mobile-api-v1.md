# GoPostal iOS Architecture v0.5
## Employee Mobile Scanner - C3scan Integration

**Date:** 2026-02-10  
**Spec Version:** C3scan_Design_Spec_v0.2.3  
**Status:** Ready for Implementation

**⚠️ IMPORTANT:** This iOS app is for **employees only** (mailroom staff). Customers/members use the webapp at c3scan.thinkspace.com

---

## Authentication (Google OAuth + Biometric)

### Login Flow
```
┌─────────┐     Tap "Sign in with Google"      ┌─────────┐
│ iOS App │ ─────────────────────────────────→ │  Google │
│         │                                    │  OAuth  │
└─────────┘                                    └────┬────┘
      ↑                                             │
      │         { "email": "peter@thinkspace.com",  │
      │           "id_token": "..." }               │
      └─────────────────────────────────────────────┘
                          │
                          ▼
                   POST /auth/google
                   ┌─────────────────────────────────────────┐
                   │ 1. Verify Google ID token               │
                   │ 2. Extract email domain                 │
                   │ 3. Lookup operator.email_domain         │
                   │ 4. Validate user has staff role         │
                   │ 5. Issue C3scan JWT                     │
                   └─────────────────────────────────────────┘
                          │
                          ▼
                   Store in iOS Keychain:
                   - JWT token
                   - email (peter@thinkspace.com)
                   - operator_id
                   - locations[]
                   
                   Optional: Enable Face ID / Touch ID
                   for subsequent app unlocks
```

### Biometric Authentication
After first Google OAuth login, employees can enable biometric unlock:
- **Face ID** (iPhone X+) or **Touch ID** (older devices)
- Stores JWT in Secure Enclave
- Biometric unlock = decrypt JWT, no server call needed
- Settings toggle to disable/enable

### Operator Resolution
```
peter@thinkspace.com → email_domain = "thinkspace.com"
                     → Lookup c3scan.operator WHERE email_domain = "thinkspace.com"
                     → Returns: operator_id, operator_name, locations[]
```

### Settings Screen Display
Per design images in "For Ava" folder:
- **Logged in as:** peter@thinkspace.com
- **Operator:** Thinkspace
- **Location:** Thinkspace Seattle (auto-detected via GPS)
- **OCR Debug:** [Toggle ON/OFF] — Default **ON** (shows OCR details on scan results)
- **Biometric Auth:** [Toggle ON/OFF]
- **Sign Out** button

**OCR Debug Toggle:**
- **Default: ON** — Employees see OCR details for troubleshooting/search
- **Toggle OFF** — Cleaner UI, hide OCR debug info
- Rarely turned off; essential for testing and search verification

---

## Multi-Location Logic

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
│  OCR DEBUG (visible when toggle ON — default)           │
│  ─────────────────────────────────────────────────────  │
│  Raw text: "ACME CORP STE 100"                          │
│  Normalized: "acme corp ste 100"                        │
│  OCR Confidence: 95%                                    │
│  Match Confidence: 94%                                  │
│  Tokens: ["acme", "corp", "ste", "100"]                 │
│                                                         │
│  [SEARCH COMPANIES]  [Return to Sender (RTS)]          │
└─────────────────────────────────────────────────────────┘
```

**OCR Debug Display (Default ON):**
- Shows what the OCR "saw" — essential for troubleshooting
- Visible on scan results AND search screen
- Helps employees understand why certain matches appeared
- Can be hidden via Settings toggle for cleaner UI

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

The iOS app uploads images directly to Supabase Storage bucket `mail-items`, not through the API:

```
1. POST /api/mobile/v1/images/upload-url
   → Returns: { "upload_url": "https://...supabase.co/...", "storage_path": "uuid/2026/02/10/img.jpg" }

2. PUT image bytes directly to upload_url (Supabase Storage)

3. POST /api/mobile/v1/mail  
   → Body includes: { "envelope_image": "storage_path:uuid/2026/02/10/img.jpg" }
```

This avoids base64 overhead and leverages Supabase's signed URL security.

---

## Settings Screen (Per Design Images)

```
┌─────────────────────────────────────┐
│  ⚙️ Settings                        │
├─────────────────────────────────────┤
│                                     │
│  👤 Peter Chee                      │
│  peter@thinkspace.com               │
│                                     │
│  🏢 Operator                        │
│  Thinkspace                         │
│                                     │
│  📍 Location                        │
│  [Thinkspace Seattle ▼]             │
│                                     │
│  🔄 Data Management                 │
│  [Refresh Company Cache]            │
│  Last updated: Feb 10, 10:23 AM     │
│  1,847 companies cached             │
│                                     │
│  🔒 Security                        │
│  [✓] Use Face ID                    │
│       Unlock with biometric auth    │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  [🚪 Sign Out]                      │
│                                     │
└─────────────────────────────────────┘
```

**Refresh Company Cache:**
- Force full re-download from `/aliases/sync`
- Shows progress indicator during download
- Updates "Last updated" timestamp on completion
- Displays record count (e.g., "1,847 companies cached")

---

## Required API Endpoints

### 1. Authentication
```
POST /api/mobile/v1/auth/token
Body: { "email": "peter@thinkspace.com", "password": "..." }
Response: { "access_token": "jwt", "operator_id": "uuid", "locations": [...] }
```

### 2. Sync Company Aliases (Full Sync)
```
GET /api/mobile/v1/aliases/sync?operator_id={uuid}
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
  "total_count": 1847,
  "fetched_at": "2026-02-10T20:30:00Z"
}
```

**Implementation Notes:**
- Full sync only (~10K records max, ~5-10MB)
- Download on first launch and refresh periodically (e.g., daily or on app foreground)
- **Throttling:** If response is large, server should stream JSON or iOS should handle chunked download
- **Progress UI:** Show download progress based on total_count vs received records
- **Storage:** SQLite with index on `alias_name_normalized` for fast wildcard search

### 3. Search Aliases (Two-Tier Search)

**Note:** Manual search uses **wildcard matching**, NOT fuzzy matching. Fuzzy matching is only for OCR (messy text from camera). User-typed search uses exact substring match.

**Flow:**
```
┌─────────────────────────────────────────────────────────────┐
│  User types "acme" in search box                            │
│                                                             │
│  STEP 1: Query local SQLite (Wildcard Search)               │
│  SELECT * FROM company_cache                                │
│  WHERE alias_name_normalized LIKE '%acme%'                  │
│                                                             │
│  IF results found (N > 0):                                  │
│     Display results immediately                             │
│  ELSE (0 results):                                          │
│     → Call API for real-time search                         │
│     → Show loading spinner                                  │
│     → IF API returns results: display them                  │
│     → IF API fails: show "Refresh cache in Settings"        │
└─────────────────────────────────────────────────────────────┘
```

**Local SQLite Search (Wildcard):**
- **NOT fuzzy** — exact substring match on `alias_name_normalized`
- Wildcard: `LIKE '%query%'` finds "acme" anywhere in string
- Case-insensitive: `LIKE '%acme%'` matches "Acme", "ACME", "acme"
- Instant results (no network)

**Fuzzy Matching is OCR-Only:**
| Feature | OCR Scanning | Manual Search |
|---------|--------------|---------------|
| Algorithm | 9-layer fuzzy matching | Wildcard substring |
| Input | Messy OCR text: "ACM3 C0RP" | Clean user typing: "acme" |
| Tolerance | Typos, noise, errors | Exact match |
| Use case | Camera scan | [SEARCH COMPANIES] button |

**API Fallback (if local returns 0):
```
GET /api/mobile/v1/aliases/search?q={query}&operator_id={uuid}
Response: {
  "results": [
    {
      "mailbox_id": "uuid",
      "mailbox_pmb": "101",
      "alias_name": "Acme Corp",
      "alias_name_normalized": "acme corp"
    }
  ],
  "source": "api",
  "prompt_refresh": false
}
```

**Search Results Screen (Per Design):**
```
┌─────────────────────────────────────┐
│  🔍 Search Companies                │
│  [acme                    ] [Clear] │
├─────────────────────────────────────┤
│                                     │
│  📬 15 results found                │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Acme Corporation                ││
│  │ Mailbox: 101                    ││
│  │ [Select]                        ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ ACME Industries LLC             ││
│  │ Mailbox: 102                    ││
│  │ [Select]                        ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ Acme LLC                        ││
│  │ Mailbox: 103                    ││
│  │ [Select]                        ││
│  └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

**Error State (API fails):**
```
┌─────────────────────────────────────┐
│  🔍 Search Companies                │
│  [acme                    ] [Clear] │
├─────────────────────────────────────┤
│                                     │
│  ⚠️ No matches found                │
│                                     │
│  Try refreshing your company cache  │
│  in Settings to get the latest data │
│                                     │
│  [Go to Settings]                   │
│                                     │
└─────────────────────────────────────┘
```

### 4. Get Signed URL for Image Upload
```
POST /api/mobile/v1/images/upload-url
Body: {
  "content_type": "image/jpeg",              -- JPEG only
  "filename": "scan_20260210_160000.jpg",
  "operator_id": "uuid",
  "requested_expiry_seconds": 60             -- Configurable (30-300 sec, default 60)
}
Response: {
  "upload_url": "https://xxxx.supabase.co/storage/v1/object/sign/mail-items/...",
  "storage_path": "operator_uuid/2026/02/10/scan_abc123.jpg",
  "expires_in": 60,                          -- Actual expiration (may differ from request)
  "max_file_size": 5242880                   -- 5MB limit (configurable per operator)
}
-- Then iOS PUTs image bytes directly to upload_url
```

**Image Requirements:**
- **Format:** JPEG only (`image/jpeg`)
- **Max Size:** 5MB default (configurable per operator in settings)
- **Expiration:** Configurable, default 60 seconds (fast upload, minimal exposure)
- **Naming:** Server generates UUID-based path for security

**Why short expiration?**
- Signed URL is for single use
- Minimizes window for abuse if URL is intercepted
- iOS uploads immediately after receiving URL
- If upload fails, request new URL (fast operation)

### 5. Upload Matched Mail (Async via Staging Table)

**Architecture:** Staging table for fast upload + async validation

```
┌──────────┐     POST /mail       ┌─────────────────────────────────────┐
│ iOS App  │ ───────────────────→ │ Insert into mail_item_staging       │
│          │                      │ (minimal validation, fast response) │
│          │ ←─────────────────── │ Return staging_id + accepted status │
└──────────┘                      └──────────────────┬──────────────────┘
                                                     │
                                                     ▼ (async background job)
                                            ┌──────────────────────┐
                                            │ Validation Worker    │
                                            │ - Validate mailbox   │
                                            │ - Check duplicates   │
                                            │ - Process image      │
                                            │ - Move to mail_items │
                                            └──────────────────────┘
```

**Why Staging Table?**
- **Fast response**: iOS gets immediate confirmation (< 100ms)
- **Reliable**: Uploads succeed even if validation is slow
- **Async processing**: Duplicate detection, image optimization, etc. happen later
- **Retry safety**: Can re-process from staging if validation fails

**Request:**
```
POST /api/mobile/v1/mail
Body: {
  "operator_id": "uuid",
  "location_id": "uuid",
  "mailbox_id": "uuid",              -- From fuzzy match
  "scanned_by_email": "peter@thinkspace.com",
  "envelope_image": "storage_path:operator_uuid/2026/02/10/uuid.jpg",
  "ocr_raw_text": "ACME CORP STE 100",
  "ocr_confidence": 0.94,
  "package_type": "correspondence",
  "carrier": "USPS",                 -- Optional
  "tracking_number": "...",          -- Optional
  "scanned_at": "2026-02-10T16:00:00Z",
  "image_hash": "a1b2c3d4e5f67890"     -- For duplicate detection
}
```

**Response Options Clarification:**

**Option A: Minimal (Recommended)**
```json
{
  "staging_id": "uuid",
  "status": "accepted",
  "message": "Upload received, processing in background"
}
```
- Fast response
- iOS knows upload succeeded
- Background job handles the rest

**Option B: Full Object (Not Recommended)**
```json
{
  "mail_item_id": "uuid",
  "status": "uploaded",
  "mailbox": { "mailbox_id": "...", "pmb": "101", "name": "..." },
  "scanned_at": "2026-02-10T16:00:00Z",
  ... (20+ more fields)
}
```
- Slower (need to query joined data)
- More data over network
- Not needed for scanner app

**We recommend Option A (staging_id only)** for speed and simplicity.

**Database Schema:**
```sql
-- Staging table (new)
CREATE TABLE mail_item_staging (
  staging_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payload_json JSONB NOT NULL,         -- Full request body
  validation_status VARCHAR(20) DEFAULT 'pending',
  -- pending → processing → validated → moved | failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Background worker processes pending rows
-- On success: inserts into mail_items, deletes from staging
-- On failure: keeps in staging for retry/manual review
```

### 6. Batch Upload (Offline Queue)
```
POST /api/mobile/v1/mail/batch
Body: {
  "items": [
    {
      "client_id": "queue_item_001",
      "operator_id": "uuid",
      "location_id": "uuid",
      "mailbox_id": "uuid",
      "envelope_image": "storage_path:...",
      "ocr_raw_text": "ACME CORP",
      "scanned_at": "2026-02-10T16:00:00Z"
    },
    {
      "client_id": "queue_item_002",
      "operator_id": "uuid",
      "location_id": "uuid",
      "mailbox_id": "uuid",
      "envelope_image": "storage_path:...",
      "ocr_raw_text": "OTHER CORP",
      "scanned_at": "2026-02-10T16:05:00Z"
    }
    -- Up to 50 items
  ]
}

Response (207 Multi-Status):
{
  "summary": {
    "total": 50,
    "accepted": 47,
    "rejected": 3
  },
  "results": [
    {
      "client_id": "queue_item_001",
      "status": "accepted",
      "staging_id": "uuid"
    },
    {
      "client_id": "queue_item_002",
      "status": "accepted",
      "staging_id": "uuid"
    },
    {
      "client_id": "queue_item_003",
      "status": "rejected",
      "error": "Invalid mailbox_id",
      "error_code": "INVALID_MAILBOX"
    }
  ]
}
```

**Individual Inserts:**
- Each item processed separately
- Valid items → Inserted to staging
- Invalid items → Rejected with error details
- iOS removes accepted items from queue, keeps failed items for retry

**Error Codes for Admin Review:**
| Code | Meaning | Action |
|------|---------|--------|
| `INVALID_MAILBOX` | Mailbox not found or not in operator | Check mailbox assignment |
| `MISSING_IMAGE` | Image not found in Supabase Storage | Re-upload image |
| `PAYLOAD_TOO_LARGE` | Request body exceeded limit | Reduce data size |
| `RATE_LIMITED` | Too many requests | Retry later |

**Admin Tool Error View:**
- Failed uploads visible in Admin Tool dashboard
- Shows: client_id, error code, error message, raw payload
- Admin can: Retry, Edit & Retry, or Discard

### 7. Location Detection (Geo-fencing)

**Approach:** GPS-based auto-detection with manual override

**iOS Logic:**
```swift
// 1. Get all locations from auth response (with lat/lng)
let locations = authResponse.locations  // Thinkspace Seattle, Redmond, etc.

// 2. Get current GPS coordinates
let currentLocation = locationManager.location  // iOS CoreLocation

// 3. Find closest location within 100m threshold
let closest = locations.min { $0.distance(from: currentLocation) < $1.distance(from: currentLocation) }

if closest.distance <= 100 {
    selectedLocation = closest  // Auto-select
} else {
    selectedLocation = nil  // Require manual selection
}

// 4. Employee can override (e.g., internet down, GPS wrong)
// Show picker: "Detected: Thinkspace Seattle [Change]"
```

**Distance Calculation:**
- Haversine formula for GPS distance
- 100 meter threshold for auto-match
- Manual override always available

**Location Schema Update:**
```sql
ALTER TABLE location ADD latitude DECIMAL(10, 8);
ALTER TABLE location ADD longitude DECIMAL(11, 8);
```

**Upload Payload:**
All uploads include detected/overridden `location_id`:
```json
{
  "operator_id": "uuid",
  "location_id": "uuid",  // From geo-fencing or manual override
  "location_detected_by": "gps",  // or "manual"
  ...
}
```

---

### 9. Employee Stats Dashboard (`GET /stats`)

**Purpose:** Show employee their scanning activity and performance

**Response includes:**
```json
{
  "employee": {
    "email": "peter@thinkspace.com",
    "name": "Peter Chee"
  },
  "summary": {
    "today": {
      "total_scanned": 47,
      "matched": 42,
      "unmatched": 5,
      "match_rate_percent": 89.4
    },
    "this_week": {
      "total_scanned": 312,
      "matched": 285,
      "unmatched": 27,
      "match_rate_percent": 91.3
    },
    "this_month": {
      "total_scanned": 1247,
      "matched": 1156,
      "unmatched": 91,
      "match_rate_percent": 92.7
    }
  },
  "details": {
    "average_ocr_confidence": 0.87,
    "top_locations": [
      { "location_name": "Thinkspace Seattle", "scan_count": 28 },
      { "location_name": "Thinkspace Redmond", "scan_count": 19 }
    ],
    "top_matched_companies": [
      { "company_name": "Acme Corp", "match_count": 15 },
      { "company_name": "TechStart Inc", "match_count": 12 }
    ],
    "hourly_distribution": [
      { "hour": 9, "count": 5 },
      { "hour": 10, "count": 8 },
      { "hour": 14, "count": 12 }
    ]
  },
  "streaks": {
    "current_day_streak": 5,
    "longest_day_streak": 12,
    "personal_best_daily": 89
  }
}
```

**iOS Dashboard UI:**
```
┌─────────────────────────────────────┐
│  📊 Today's Stats                   │
│  47 scanned | 42 matched (89%)      │
│                                     │
│  🔥 5 day streak!                   │
│                                     │
│  This Week: 312 scans               │
│  This Month: 1,247 scans            │
│                                     │
│  [View Detailed Stats →]            │
│                                     │
└─────────────────────────────────────┘
```

**Data Source:**
- Real-time: `mail_item_staging` (today's uploads)
- Historical: `mail_items` (processed/validated records)
- Aggregated on-demand or cached hourly

---

### 10. Upload Alias Suggestion (No Match → Admin Review)

**Flow:** User clicks "ADD ALIAS" button in scan results when no match found.

**iOS Request:**
```
POST /api/mobile/v1/alias-suggestions
Body: {
  "operator_id": "uuid",
  "location_id": "uuid",           // From geo-fencing
  "location_detected_by": "gps",   // "gps" or "manual"
  "scanned_by_email": "peter@thinkspace.com",
  "suggested_alias_name": "Unknown Company Inc", -- User-typed name
  "envelope_image": "storage_path:operator_uuid/2026/02/10/uuid.jpg",
  "ocr_raw_text": "UNKNOWN CO STE 500",
  "ocr_confidence": 0.45,
  "scanned_at": "2026-02-10T16:00:00Z",
  "client_scan_id": "scan_20260210_160000_abc123"
}
Response: { 
  "suggestion_id": "uuid", 
  "status": "pending_review",
  "message": "Alias suggestion submitted for admin review"
}
```

**Admin Approval Workflow:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Admin Tool - Alias Suggestions Queue                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📷 [Envelope Image]                                            │
│                                                                 │
│  Suggested Name: Unknown Company Inc                            │
│  OCR Text: "UNKNOWN CO STE 500"                                 │
│  Submitted by: peter@thinkspace.com                             │
│                                                                 │
│  [✏️ Edit Name]                                                 │
│                                                                 │
│  Assign to Mailbox: [Search dropdown ▼]                         │
│  Or Create New Company: [Company Name input]                    │
│                                                                 │
│  [✅ APPROVE]  [❌ REJECT]                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**On APPROVE:**
1. Create/update company_alias record
2. Create mail_item linked to the alias
3. Mark suggestion as approved

**On REJECT:**
1. Mark suggestion as rejected
2. Optional: Add rejection reason
3. Mail item is discarded (or can be re-routed)

---

## Open Questions (Resolved ✓)

| Question | Answer |
|----------|--------|
| Batch size limit | 50 default, configurable in iOS settings ✓ |
| Image upload | Signed URLs to Supabase Storage bucket `mail-items` ✓ |
| Duplicate detection | Placeholder fields added. Server-side process TBD; employee handles near-duplicates manually for now ✓ |
| `alias_suggestions` table | Already exists in Supabase ✓ |

---

## Implementation Checklist

### Phase 1: Next.js API Routes (c3scan-admin)
- [ ] `POST /api/mobile/v1/auth/google` (Google OAuth for employees)
- [ ] `GET /api/mobile/v1/aliases/sync` (full company cache download)
- [ ] `GET /api/mobile/v1/aliases/search` (API fallback for local search)
- [ ] `POST /api/mobile/v1/images/upload-url` (Supabase Storage signed URLs)
- [ ] `POST /api/mobile/v1/mail` (202 Accepted, staging table insert)
- [ ] `POST /api/mobile/v1/mail/batch` (207 Multi-Status, individual inserts)
- [ ] `POST /api/mobile/v1/alias-suggestions` (admin review queue)
- [ ] `GET /api/mobile/v1/stats` (employee dashboard with today/week/month)
- [ ] `GET /api/mobile/v1/version` (app version check for update warnings)

### Phase 1b: Admin Tool Views (c3scan-admin)
- [ ] Upload Error Dashboard (view failed batch uploads)
- [ ] Retry/Edit/Discard actions for failed uploads
- [ ] Staging table status monitor (pending/processing/validated/failed)
- [ ] Alias Suggestions Queue (review envelope images, approve/reject)
- [ ] Alias approval workflow (assign to existing mailbox or create new company)

### Phase 2: iOS App Updates (GoPostal)
- [ ] Replace `SupabaseManager` with `APIClient` (URLSession + JWT)
- [ ] Update `UploadQueueManager` to use new endpoints
- [ ] Add image upload flow (get signed URL → upload to Supabase → send storage_path)
- [ ] Implement batch upload when coming back online
- [ ] Add `alias_suggestions` flow for unmatched scans

### Phase 3: Database & Background Jobs
- [x] Create `operator_integration_config` table (migration ready)
- [x] Create `mail_item_staging` table (migration ready)
- [ ] Run migrations in Supabase
- [ ] Create background worker for staging validation
- [ ] Verify `alias_suggestions` table schema matches spec
- [ ] Add `image_hash` column to `mail_items` (for future duplicate detection)

## Screenshot Review - Additional Features (From iOS Settings)

### OCR Debug Toggle (Default: ON)
- **Default state:** ON (shows OCR details on scan results)
- **Settings toggle:** Employees can turn OFF for cleaner UI
- **When ON:** Display raw OCR text, normalized text, OCR confidence, match confidence, tokens
- **Rarely turned off** — essential for troubleshooting and search

### Confidence Display (Both Metrics)
Shows separately on scan results:
- **OCR Confidence:** 95% (how well text was read)
- **Match Confidence:** 94% (how well fuzzy matching found company)

### Return to Sender (RTS)
- **Behavior:** Discard completely — no system record created
- **Physical action:** Employee returns mail to sender physically
- **No tracking:** Not stored in database

### Clear Local Database
- **What it does:** Deletes SQLite `company_cache` table only
- **Effect:** Forces re-download of company aliases from `/aliases/sync`
- **UI:** Shows "Last updated: Feb 10, 10:23 AM" next to button
- **Queue protection:** Does NOT affect upload queue (unsent scans preserved)

### Email Support
- **Removed:** Not included in app per direction

### Diagnostics Section
Shows:
- **App info:** Version, build number, last sync timestamp
- **Database:** Record count (cached companies)
- **Device info:** iOS version, device model, storage usage
- **No logs:** User-facing logs not included

### Version Check
- **Check timing:** On app launch only
- **Behavior:** Warn if outdated (don't block scanning)
- **New endpoint needed:** `GET /api/mobile/v1/version`

---

## Next Steps

Ready to implement:
1. **Stub Next.js API routes** in `c3scan-admin/src/app/api/mobile/v1/`
2. **Update iOS** `UploadQueueManager` to use the new endpoints
3. **Add version check** endpoint and app launch check
