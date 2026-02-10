# C3scan Documentation

Single source of truth for C3scan design and architecture.

## 📁 Directory Structure

```
docs/
├── README.md                    # This file
├── api/                        # Our API specifications
│   └── openapi-v1.yaml        # Mobile API OpenAPI 3.0 spec
├── architecture/               # System architecture docs
│   └── mobile-api-v1.md       # GoPostal iOS app architecture v0.4
├── integrations/               # Third-party API documentation
│   └── yardi-kube/            # Yardi Kube integration
│       ├── api-spec.json      # OpenAPI spec
│       └── full-reference.md  # Full API reference
└── specs/                      # Design specifications
    ├── design-spec-v0.2.3.md  # Main design spec (v0.2.3 nomenclature update)
    └── ui-ux-spec-v1.2.md     # UI/UX design spec
```

## 🎯 Quick Links

| Document | Purpose | Audience |
|----------|---------|----------|
| [Mobile API Architecture](architecture/mobile-api-v1.md) | **Employee scanner app** - Google OAuth, biometric, two-flow upload | Engineers (iOS + Web) |
| [OpenAPI Spec](api/openapi-v1.yaml) | API contract for mobile ↔ backend | Engineers (Web API) |
| [Multi-Provider Auth](architecture/multi-provider-auth.md) | Webapp auth: Yardi, OfficeRnD, Google OIDC per operator | Engineers (Web) |
| [Design Spec v0.2.3](specs/design-spec-v0.2.3.md) | Full system functional spec | Whole team |
| [UI/UX Spec v1.2](specs/ui-ux-spec-v1.2.md) | Interface design guidelines | Designers + Engineers |

**Note:** iOS app is **employee-only** (mailroom staff). Customers use the webapp with multi-provider auth.

### Third-Party Integrations

| Integration | Document | Purpose |
|-------------|----------|---------|
| Yardi Kube | [API Spec](integrations/yardi-kube/api-spec.json) | Property management API (OfficeRnD/Deskworks alternative) |
| Yardi Kube | [Full Reference](integrations/yardi-kube/full-reference.md) | Complete API documentation |

## 🔄 How to Update

1. **Edit in place** - These are the canonical versions
2. **Version major changes** - Use filenames like `design-spec-v0.2.4.md` for new versions
3. **Update this README** - When adding new docs

## 👥 Team Access

- **Ava (AI Assistant)** - Read/write via file tools
- **Lana, Roger, Peter** - Git workflow via `c3scan-admin` repo

## 📝 Latest Changes

- **2026-02-10** - Version check endpoint: App checks for updates on launch, warns if outdated
- **2026-02-10** - OCR debug toggle: Default ON, shows OCR confidence + match confidence
- **2026-02-10** - RTS (Return to Sender): Discard with no system record
- **2026-02-10** - Clear Local Database: Force re-download of company aliases
- **2026-02-10** - Diagnostics: App/device info (no user-facing logs)
- **2026-02-10** - Stats dashboard: Today/week/month summaries, OCR confidence, streaks, top companies
- **2026-02-10** - Location detection: Geo-fencing (100m threshold) with manual override
- **2026-02-10** - Batch upload: 207 Multi-Status, individual inserts, admin error handling
- **2026-02-10** - Mail upload via staging table: async validation, fast response (202 Accepted)
- **2026-02-10** - Image upload: JPEG only, configurable expiration (default 60s), 5MB max
- **2026-02-10** - Added Settings screen with "Refresh Company Cache" button per design
- **2026-02-10** - Finalized mobile API: Google OAuth, biometric, full alias sync (no incremental)
- **2026-02-10** - Added `operator_integration_config` table migration
- **2026-02-10** - Added multi-provider auth + custom domains architecture
- **2026-02-10** - Added Yardi Kube integration docs (`integrations/yardi-kube/`)
- **2026-02-10** - Moved docs from workspace to `c3scan-admin/docs/`
- **2026-02-10** - Added mobile API architecture v0.5 (employee scanner)
- **2026-02-10** - Added OpenAPI 3.0 spec for mobile endpoints
