# C3Scan Documentation

This folder contains all engineering and design documentation for the C3Scan platform.

## Quick Reference

| Document | Purpose |
|----------|---------|
| [specs/webapi-contract-v1.md](./specs/webapi-contract-v1.md) | **Primary API contract** - Endpoint specs, auth flows, request/response shapes |
| [architecture/auth-tenancy-contract.md](./architecture/auth-tenancy-contract.md) | **Security model** - Operator-scoped auth, JWT claims, tenancy isolation rules |
| [specs/final-decisions.md](./specs/final-decisions.md) | **Locked decisions** - 30-day grace, request types, token TTLs, compliance rules |
| [architecture/permissions-matrix.md](./architecture/permissions-matrix.md) | **Role-based access** - What each role can do per resource |

## Folder Structure

### `/api`
Machine-readable API contracts.
- `openapi-v1.yaml` - OpenAPI spec for all endpoints

### `/architecture`
System design, security models, and technical architecture.
- `auth-tenancy-contract.md` - Operator-scoped authentication & multi-tenancy rules
- `mobile-api-v1.md` - iOS scanner app architecture, SQLite schema, upload flows
- `permissions-matrix.md` - Role-based access control matrix

### `/specs`
Product specifications and design documentation.
- `design-spec-v0.2.3.md` - Functional spec with data models, status enums, workflows
- `ui-ux-spec-v1.2.md` - Visual system, components, interaction patterns
- `webapi-contract-v1.md` - Complete WebAPI contract (28 endpoints)
- `final-decisions.md` - Implementation decisions (grace period, request types, auth)

### `/implementation`
Implementation guides and reference materials.
- `api-answers.md` - Detailed answers to 28 endpoint questions (from ChatGPT review)

## Key Concepts

### Operator-Scoped Tenancy
- **Operator is derived from hostname** (e.g., `c3scan.thinkspace.com`)
- JWT tokens carry `operator_id`, `role`, and `company_ids`/`location_ids`
- No cross-operator access; 403 on token/hostname mismatch

### Roles
- `platform_admin` - Cross-operator (separate endpoints, audited)
- `operator_admin` - Full access within operator
- `operator_staff` - Cross-location within operator (filterable)
- `mailbox_manager` - Company-scoped member with management rights
- `member_user` - Company-scoped member

### Compliance Grace Period
- **30 days** from mailbox activation
- After grace expires without approval: member can view but cannot submit new requests
- Global banner shown during grace and when non-compliant

## Version Compatibility

| Doc Version | Build Spec | Notes |
|-------------|------------|-------|
| UI/UX v1.2 | Build Spec v0.2.3 | Terminology aligned (Operator, Member, Mailbox Manager) |
| WebAPI Contract v1 | - | Consolidates all 28 endpoints |

## Useful Links

- GitHub Repository: https://github.com/Thinkspace-Coworking/c3scan-admin
- Production: https://c3scan.thinkspace.com
