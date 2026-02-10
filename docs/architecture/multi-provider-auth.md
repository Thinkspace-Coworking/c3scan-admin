# Multi-Provider Auth Configuration

## Overview
C3scan supports pluggable identity providers per operator. Each operator configures their preferred auth method in `operator_integration_config`.

**Important:** This multi-provider system is for the **webapp** (customers and admins logging in via browser). The **iOS scanner app** uses Google OAuth only (see [mobile-api-v1.md](mobile-api-v1.md)).

| App | Auth Method |
|-----|-------------|
| Webapp (c3scan.thinkspace.com) | Multi-provider per operator (Yardi, OfficeRnD, Google, etc.) |
| iOS Scanner App | Google OAuth only (employees) |

## Supported Providers (Webapp)

## Supported Providers

| Provider | Protocol | Use Case |
|----------|----------|----------|
| Native (Supabase) | Email/password + Magic Link | Operators without external CRM |
| Yardi Kube | OIDC | Yardi customers (Thinkspace) |
| OfficeRnD | OAuth 2.0 | OfficeRnD customers |
| Deskworks | OAuth 2.0 | Deskworks customers |
| Google Workspace | OIDC | Operators using Google SSO |
| Microsoft Entra | OIDC | Operators using Microsoft 365 |

## Database Schema

### `operator` table (ADD COLUMNS)

```sql
ALTER TABLE operator ADD COLUMN IF NOT EXISTS 
  slug VARCHAR(50) UNIQUE;           -- e.g., 'thinkspace' for thinkspace.c3scan.io

ALTER TABLE operator ADD COLUMN IF NOT EXISTS 
  custom_domain VARCHAR(255) UNIQUE;  -- e.g., 'c3scan.thinkspace.com'

ALTER TABLE operator ADD COLUMN IF NOT EXISTS 
  brand_primary_color VARCHAR(7);     -- e.g., '#0066CC' for white-label

ALTER TABLE operator ADD COLUMN IF NOT EXISTS 
  brand_logo_url TEXT;                -- White-label logo
```

### `operator_integration_config` table (NEW - to be created)

```sql
CREATE TABLE operator_integration_config (
    integration_config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES operator(operator_id),
    integration_type VARCHAR(50) NOT NULL CHECK (
        integration_type IN (
            'auth_native',
            'auth_yardi_oidc',
            'auth_officernd_oauth',
            'auth_deskworks_oauth',
            'auth_google_oidc',
            'auth_microsoft_oidc',
            'billing_stripe',
            'shipping_easypost',
            'sync_officernd',
            'sync_deskworks'
        )
    ),
    config_json JSONB NOT NULL,  -- Provider-specific config
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(operator_id, integration_type)
);
```

### Provider-Specific Config Examples

**Yardi OIDC:**
```json
{
  "issuer": "https://yardi.thinkspace.com",
  "client_id": "c3scan-app",
  "client_secret": "encrypted_secret",
  "authorization_endpoint": "https://yardi.thinkspace.com/connect/authorize",
  "token_endpoint": "https://yardi.thinkspace.com/connect/token",
  "userinfo_endpoint": "https://yardi.thinkspace.com/connect/userinfo",
  "scopes": ["openid", "email", "profile"],
  "claims_mapping": {
    "email": "email",
    "name": "name",
    "user_id": "sub"
  }
}
```

**OfficeRnD OAuth:**
```json
{
  "client_id": "c3scan_integration",
  "client_secret": "encrypted_secret",
  "authorization_endpoint": "https://app.officernd.com/oauth/authorize",
  "token_endpoint": "https://app.officernd.com/oauth/token",
  "userinfo_endpoint": "https://app.officernd.com/api/v1/users/me",
  "scopes": ["read", "write"]
}
```

**Native Supabase:**
```json
{
  "provider": "supabase",
  "allow_signup": true,
  "require_email_confirmation": true
}
```

## Auth Flow

### Step 1: Detect Provider

```typescript
// /api/auth/detect-provider
export async function detectProvider(email: string) {
  const domain = email.split('@')[1];
  
  // Find operator by email domain
  const operator = await db.query(`
    SELECT o.operator_id, o.operator_name, o.email_domain,
           ic.integration_type, ic.config_json
    FROM operator o
    LEFT JOIN integration_config ic ON o.operator_id = ic.operator_id
    WHERE o.email_domain = $1
      AND ic.integration_type LIKE 'auth_%'
      AND ic.is_enabled = true
  `, [domain]);
  
  if (!operator) {
    return { error: 'No operator found for this email domain' };
  }
  
  return {
    operator_id: operator.operator_id,
    provider_type: operator.integration_type,  // e.g., 'auth_yardi_oidc'
    config: operator.config_json
  };
}
```

### Step 2: Route to Provider

```typescript
// /api/auth/[...provider]/route.ts
export async function GET(request: Request, { params }: { params: { provider: string[] } }) {
  const providerType = params.provider[0];  // 'yardi', 'officernd', 'native'
  
  switch (providerType) {
    case 'yardi':
      return handleYardiAuth(request);
    case 'officernd':
      return handleOfficeRnDAuth(request);
    case 'native':
      return handleNativeAuth(request);
    default:
      return new Response('Unknown provider', { status: 400 });
  }
}
```

### Step 3: Unified Session

Regardless of provider, all users get a **C3scan session**:

```typescript
interface C3scanSession {
  user_id: string;           // C3scan internal UUID
  external_user_id: string;  // Provider's user ID (Yardi 'sub', OfficeRnD id)
  provider: string;          // 'yardi', 'officernd', 'native'
  operator_id: string;
  email: string;
  name: string;
  role: 'location_staff' | 'mailbox_manager' | 'admin_owner';
  locations: string[];       // Array of location_ids
}
```

## Implementation Phases

### Phase 1: Native Auth (Default)
- Supabase Auth for operators without external CRM
- Email/password + Magic Link
- Works immediately for all operators

### Phase 2: Yardi OIDC (Thinkspace)
- Add `auth_yardi_oidc` integration type
- Implement OIDC flow
- Test with Thinkspace domain

### Phase 3: OfficeRnD & Deskworks
- Add `auth_officernd_oauth` type
- Add `auth_deskworks_oauth` type
- OAuth 2.0 flows (slightly different from OIDC)

### Phase 4: Self-Service Configuration
- Admin UI to configure auth provider
- Test connection button
- Domain verification

## Mobile App Impact

The iOS app doesn't need to know which provider is used:

```swift
// Same flow regardless of operator's auth provider
1. POST /api/auth/detect-provider
   Body: { "email": "peter@thinkspace.com" }
   Response: { "provider": "yardi", "auth_url": "https://..." }

2. Open Safari/WebView to auth_url (Yardi login)

3. Yardi redirects to c3scan://auth/callback?token=...

4. App extracts JWT, stores in Keychain

5. Use JWT for all subsequent API calls
```

## Pre-Config Work Checklist

### Database
- [x] Design `operator_integration_config` table
- [x] Add `slug`, `custom_domain` columns to `operator` table
- [ ] Create `operator_integration_config` table in Supabase
- [ ] Add `auth_*` types to `integration_type` enum
- [ ] Add encrypted `config_json` storage for secrets

### Auth System
- [ ] Create `/api/auth/detect-provider` endpoint
- [ ] Implement provider router `/api/auth/[...provider]/`
- [ ] Create provider-specific handlers:
  - [ ] Yardi OIDC
  - [ ] OfficeRnD OAuth
  - [ ] Deskworks OAuth
  - [ ] Native Supabase (fallback)
- [ ] Build unified session middleware

### Multi-Tenant Domains
- [ ] Configure `*.c3scan.io` wildcard DNS
- [ ] Add `cname.c3scan.io` target for custom CNAMEs
- [ ] Implement domain-to-operator middleware
- [ ] Add domain verification flow (optional)
- [ ] Set up SSL for wildcard + custom domains

## Multi-Tenant Custom Domains

Each operator can have their own branded domain:

| Operator | Wildcard Domain | Custom CNAME |
|----------|-----------------|--------------|
| Thinkspace | `thinkspace.c3scan.io` | `c3scan.thinkspace.com` |
| Blankspaces | `blankspaces.c3scan.io` | `c3scan.blankspaces.com` |
| 25N | `25n.c3scan.io` | `c3scan.25ncoworking.com` |

### DNS Setup

**For Wildcard (you control):**
```
*.c3scan.io  A/ALIAS  → Vercel/Cloudflare
```

**For Custom CNAME (customer controls):**
```
# Customer adds:
c3scan.thinkspace.com  CNAME  cname.c3scan.io.

# You verify ownership (optional):
# Customer adds TXT record:
_c3scan-verify.thinkspace.com  TXT  "verify_abc123"
```

### Next.js Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  // Determine tenant from domain
  let operatorSlug: string | null = null;
  
  if (host.endsWith('.c3scan.io')) {
    // Wildcard: thinkspace.c3scan.io
    operatorSlug = host.replace('.c3scan.io', '');
  } else if (host !== 'c3scan.io' && host !== 'www.c3scan.io') {
    // Custom domain: c3scan.thinkspace.com
    const operator = await db.query(
      'SELECT slug FROM operator WHERE custom_domain = $1',
      [host]
    );
    operatorSlug = operator?.slug;
  }
  
  if (operatorSlug) {
    const response = NextResponse.next();
    response.headers.set('x-operator-slug', operatorSlug);
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### SSL/TLS

**Wildcard:** One certificate for `*.c3scan.io` (automatic via Let's Encrypt)

**Custom CNAME:** 
- Option 1: Customer uploads their own SSL cert
- Option 2: Use Cloudflare Universal SSL (auto-issues for CNAMEs)

## Security Notes

1. **Client secrets encrypted** in `config_json` (AES-256)
2. **State parameter** required for all OAuth/OIDC flows (CSRF protection)
3. **PKCE** for mobile app OAuth flows
4. **Token refresh** handled server-side, never expose refresh tokens to client
