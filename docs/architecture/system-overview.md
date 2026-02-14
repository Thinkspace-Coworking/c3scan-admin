# C3Scan Production Architecture

**Last Updated:** 2026-02-14  
**Status:** Production

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              C3Scan PLATFORM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────────┐    │
│  │  C3Scan iOS  │────────→│    Vercel    │────────→│    Supabase      │    │
│  │    (App)     │  HTTPS  │  (Next.js)   │  HTTP   │   (PostgreSQL)   │    │
│  └──────┬───────┘         └──────┬───────┘         └──────────────────┘    │
│         │                        │                                          │
│         │                        │         ┌──────────────────┐            │
│         │                        └────────→│  Supabase Storage│            │
│         │                           Images │   (mail-photos)  │            │
│         │                                  └──────────────────┘            │
│         │                                                                   │
│         └────────────────── Sentry ──────────────────┐                     │
│                        (Error Tracking)              │                     │
│                                                      ▼                     │
│                                             ┌──────────────────┐          │
│                                             │   Sentry.io      │          │
│                                             │  (Dashboard)     │          │
│                                             └──────────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. C3Scan iOS App
- **Repository:** `Thinkspace-Coworking/GoPostal` (project codename)
- **Platform:** iOS 15+
- **Language:** Swift 5
- **Key Features:**
  - OCR-based mail scanning
  - Offline-first SQLite cache
  - Batch upload queue
  - Geofenced location detection

**Error Monitoring:** Sentry Cocoa SDK (to be added)

---

### 2. Vercel (Frontend & API)
- **Project:** `c3scan-admin`
- **URL:** https://c3scan.thinkspace.com
- **Framework:** Next.js 16 (React 19)
- **Runtime:** Node.js 24.x
- **Region:** Washington, D.C. (iad1)

**API Routes:**
| Endpoint | Purpose |
|----------|---------|
| `POST /api/mobile/v1/auth/token` | Google OAuth token exchange |
| `GET /api/mobile/v1/aliases/sync` | Sync company aliases to iOS |
| `POST /api/mobile/v1/alias-suggestions` | Submit unmatched mail for review |
| `POST /api/mobile/v1/mail` | Upload scanned mail items |
| `POST /api/mobile/v1/images/upload-url` | Generate Supabase signed URLs |

**Error Monitoring:** Sentry Next.js SDK ✓ (deployed 2026-02-14)

---

### 3. Supabase (Backend)
- **Project:** c3scan-production
- **Database:** PostgreSQL 15
- **Regions:** us-east-1 (primary)

**Core Tables:**
| Table | Purpose |
|-------|---------|
| `operator` | Multi-tenant operators (Thinkspace, etc.) |
| `location` | Physical mailroom locations |
| `mailbox` | Company mailboxes (PMBs) |
| `company_alias` | Company name aliases for OCR matching |
| `mail_item` | Scanned mail records |
| `alias_suggestion` | Pending company suggestions |
| `user_account` | Operator staff accounts |

**Storage Buckets:**
- `mail-photos` - Envelope images (signed URL access)

**Error Monitoring:** Supabase Dashboard Logs (built-in)

---

## Data Flow

### Successful Mail Scan
```
1. C3Scan iOS → Camera captures image
              → OCR extracts text locally
              → Fuzzy matching against SQLite cache
              
2. Match Found → POST /api/mobile/v1/mail
              → Supabase: Insert mail_item record
              → Status: uploaded
              
3. Admin View → Real-time mail list update
```

### Unmatched Mail Scan
```
1. C3Scan iOS → No confident match found
              → User selects "Add Alias"
              → User enters company name
              
2. Submit → POST /api/mobile/v1/alias-suggestions
          → Supabase: Insert alias_suggestion (pending)
          → Supabase: Insert placeholder mail_item
          
3. Admin Review → Web dashboard shows pending suggestion
                → Admin approves/rejects
                → On approve: Promote to mail_item
```

---

## Error Monitoring Strategy

### Sentry (Application Errors)

**Vercel API Errors:**
- 500 Internal Server Errors
- Unhandled exceptions
- Database connection failures
- Authentication failures

**C3Scan iOS Errors:**
- App crashes
- Network timeouts
- JSON decoding errors
- OCR processing failures

**Setup:**
```bash
# Vercel (done)
NEXT_PUBLIC_SENTRY_DSN=https://...sentry.io/...

# iOS (pending)
# Add Sentry Cocoa SDK to Xcode project
```

### Supabase Logs (Database Errors)

**Monitored via Supabase Dashboard:**
- Database constraint violations
- Slow queries (>100ms)
- Auth failures
- Storage upload errors
- Real-time connection issues

**URL:** https://supabase.com/dashboard/project/_/logs

---

## Environment Variables

### Vercel Production
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... (server-only)
NEXT_PUBLIC_SENTRY_DSN=https://fdb571...sentry.io/...
```

### C3Scan iOS Build
```
GoogleClientID=519376782224-...
API_BASE_URL=https://c3scan.thinkspace.com/api/mobile/v1
```

---

## Deployment Checklist

### Vercel (c3scan-admin)
- [x] Environment variables configured
- [x] Sentry SDK integrated
- [x] Build passing
- [x] Custom domain: c3scan.thinkspace.com

### C3Scan iOS (pending updates)
- [ ] Add Sentry Cocoa SDK
- [ ] Configure Sentry DSN
- [ ] Test error capture
- [ ] Submit to App Store

### Supabase
- [x] Production project created
- [x] RLS policies configured
- [x] Storage bucket configured
- [ ] Monitoring alerts (optional)

---

## On-Call / Debugging

### When a 500 Error Occurs

1. **Check Sentry** (immediate):
   - https://sentry.io/issues/
   - Filter by: `environment:production`
   - Look for: `endpoint:alias-suggestions`

2. **Check Vercel Logs** (if needed):
   ```bash
   vercel logs c3scan-admin --scope=c3scan
   ```

3. **Check Supabase Logs** (if DB issue):
   - Dashboard → Logs → PostgREST
   - Filter by: `status_code >= 400`

### Common Issues

| Symptom | Check | Fix |
|---------|-------|-----|
| 500 on alias submit | Sentry for DB error | Fix constraint violation |
| iOS crashes | Sentry for stack trace | Fix nil unwrap |
| Slow API | Supabase slow query log | Add index |
| Auth failures | Supabase auth logs | Check JWT expiry |

---

## Team Access

| Service | URL | Role |
|---------|-----|------|
| Production App | https://c3scan.thinkspace.com | Admin dashboard |
| Vercel | https://vercel.com/c3scan | Deployments, logs |
| Supabase | https://supabase.com/dashboard | Database, auth |
| Sentry | https://sentry.io | Error tracking |
| GitHub | https://github.com/Thinkspace-Coworking/c3scan-admin | Source code |

---

## Naming Conventions

| Term | Meaning |
|------|---------|
| **C3Scan** | The platform/product name |
| **C3Scan iOS** | The iOS scanning app |
| **c3scan-admin** | The web admin dashboard (Next.js) |
| **GoPostal** | Legacy project codename (iOS repo) |
| **Thinkspace** | Example operator (first customer) |

---

## Future Improvements

- [ ] Add Sentry to C3Scan iOS
- [ ] Set up PagerDuty for critical errors
- [ ] Add Vercel Analytics for web perf
- [ ] Configure Supabase log drains to Sentry
- [ ] Add Datadog for infrastructure monitoring
