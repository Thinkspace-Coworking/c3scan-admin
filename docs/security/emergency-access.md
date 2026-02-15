# Emergency Access & Break-Glass Authentication

## The Problem

When federated authentication (Google OAuth, Cognito, etc.) fails:
- OAuth provider outage (Google, AWS Cognito down)
- DNS issues preventing auth callback
- Certificate/SSL problems
- Network connectivity issues
- Configuration errors

**You CANNOT be locked out of your own system.**

---

## ❌ BAD: "Security Account" Bypass

**What NOT to do:**
- Hardcoded admin credentials in code
- "Master password" that bypasses all auth
- Direct database manipulation as routine fallback
- Shared admin credentials

**Why this is bad:**
1. Hardcoded secrets get leaked
2. No audit trail of who used the bypass
3. Cannot revoke access easily
4. Violates principle of least privilege
5. Creates permanent backdoor

---

## ✅ GOOD: Break-Glass Architecture

### Pattern 1: Emergency Admin Account (Recommended)

```
┌─────────────────────────────────────────────────────────┐
│  Regular Flow (OAuth/Cognito)                           │
│  ┌─────────┐    ┌──────────┐    ┌──────────┐           │
│  │  Admin  │───▶│  OAuth   │───▶│  System  │           │
│  └─────────┘    └──────────┘    └──────────┘           │
│                              JWT tokens                 │
└─────────────────────────────────────────────────────────┘
                           ↓ Emergency (OAuth down)
┌─────────────────────────────────────────────────────────┐
│  Break-Glass Flow                                       │
│  ┌─────────┐    ┌──────────┐    ┌──────────┐           │
│  │  Admin  │───▶│  Direct  │───▶│  System  │           │
│  │ + MFA   │    │  DB Auth │    │ (limited)│           │
│  └─────────┘    └──────────┘    └──────────┘           │
│  Hardware token or TOTP required                        │
└─────────────────────────────────────────────────────────┘
```

**Implementation:**
1. **Emergency user in database** with strong password + MFA
2. **Direct database authentication** endpoint (NOT OAuth)
3. **Highly restricted** - read-only or limited admin functions only
4. **Audit every action** with extra logging
5. **Rate limited** to prevent brute force
6. **Alerts sent** to security team when used

---

### Pattern 2: Offline Emergency Credentials

```yaml
# Emergency Access Card
Type: Hardware Security Key (YubiKey) or TOTP
Users: 2 designated super-admins
Access: Physical access required
Rotation: Every 90 days or after use
Audit: All actions logged separately
Scope: Read-only by default, write requires second approval
```

**Implementation:**
1. **Hardware tokens** (YubiKey) stored in physical safe
2. **Time-based OTP** apps on separate devices
3. **Require 2 people** to activate (dual-control)
4. **Automatically expires** after 24 hours
5. **Forces password reset** when normal auth restored

---

### Pattern 3: IP-Whitelisted Emergency Access

```
Condition: Request originates from office IP only
Auth: Certificate-based or pre-shared key + MFA
Scope: Admin dashboard access only
Duration: 4-hour sessions max
```

**Good for:** Physical presence at office during outage
**Bad for:** Remote work scenarios

---

## Recommended Implementation for c3scan

### Option A: Database-Backed Emergency Login (Preferred)

```typescript
// /api/auth/emergency-login/route.ts
// ONLY for when OAuth/Cognito is down

export async function POST(request: NextRequest) {
  // 1. Extra rate limiting
  // 2. Require email + password + TOTP code
  // 3. Verify against user_account with is_emergency_admin=true
  // 4. Generate SHORT-LIVED JWT (30 min max)
  // 5. Log to separate emergency_access_logs table
  // 6. Send alert to security team
  // 7. Restrict to read-only operations by default
}
```

**Database Setup:**
```sql
-- Add to user_account table
ALTER TABLE user_account ADD COLUMN is_emergency_admin BOOLEAN DEFAULT false;
ALTER TABLE user_account ADD COLUMN emergency_password_hash TEXT; -- bcrypt
ALTER TABLE user_account ADD COLUMN emergency_mfa_secret TEXT; -- TOTP

-- Separate audit table
CREATE TABLE emergency_access_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_account(user_id),
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  actions_taken JSONB,
  reason TEXT -- Required: why was emergency access needed?
);
```

**Security Controls:**
- Emergency password must be 20+ characters
- TOTP required (Google Authenticator, Authy, etc.)
- Max 3 attempts per hour
- Auto-logout after 30 minutes
- Read-only by default, write requires explicit elevated session
- Email/SMS alerts to Peter + security team
- Forced password reset after use

---

### Option B: AWS Console Access (If using Cognito)

If we deploy Cognito and it's down:

1. **AWS Console** → Cognito → User Pools
2. **Create user** directly in Cognito (bypasses OAuth)
3. **Set permanent password**
4. **Login with username/password** (Cognito's built-in UI)
5. **Delete temporary user** after incident

**Pros:** No code changes needed
**Cons:** Requires AWS console access, AWS-specific

---

### Option C: IP-Based Fallback

```typescript
// middleware.ts - Emergency bypass
const EMERGENCY_IPS = ['203.0.113.0/24']; // Office IP range

if (isOAuthDown() && isEmergencyIP(request.ip)) {
  // Require certificate auth or pre-shared key
  // Grant limited access
}
```

---

## What We Should Implement

### Immediate (This Week):

1. **Create emergency admin user in Supabase:**
   ```sql
   -- Run this in Supabase SQL editor
   INSERT INTO user_account (
     email, 
     display_name, 
     operator_id,
     roles,
     is_emergency_admin
   ) VALUES (
     'emergency@thinkspace.com',
     'Emergency Admin',
     (SELECT operator_id FROM operator WHERE slug = 'thinkspace'),
     '["operator_admin"]',
     true
   );
   ```

2. **Set up TOTP for emergency user**
   - Use Google Authenticator or Authy
   - Store secret in 1Password or secure vault
   - Share with Peter only

3. **Document emergency procedure:**
   ```markdown
   ## When OAuth is Down
   
   1. Navigate to: /admin/emergency-login
   2. Enter emergency credentials from 1Password
   3. Enter TOTP code from authenticator app
   4. Access is limited to read-only for 30 minutes
   5. Contact AWS/Peter to restore normal auth
   ```

### Short Term (Next Sprint):

1. Build `/api/auth/emergency-login` endpoint
2. Create emergency login UI at `/admin/emergency-login`
3. Add emergency access logs table
4. Set up alerting (email/SMS when emergency access used)
5. Implement read-only mode for emergency sessions

### Long Term:

1. Hardware security keys (YubiKey) for 2 super-admins
2. Automatic failover to backup IdP
3. Offline-capable admin app for critical functions

---

## DNS Down Scenario

If DNS is down, you have bigger problems. But for admin access:

1. **Local hosts file entry:**
   ```
   203.0.113.10    admin.thinkspace.com
   ```

2. **Direct IP access** with certificate bypass (dangerous, only for true emergency)

3. **Offline admin tool** that syncs data locally

4. **Database direct access** (psql CLI, Supabase dashboard)

---

## Summary

| Approach | Security | Convenience | Best For |
|----------|----------|-------------|----------|
| Emergency DB User + MFA | High | Medium | Primary fallback |
| AWS Console access | Medium | High | If using Cognito |
| IP whitelisting | Medium | Low | Office-only scenarios |
| Hardware tokens | Very High | Low | Maximum security |
| Direct DB access | Low | High | Last resort only |

**Recommendation:** Implement Option A (Emergency DB User with MFA) + document Option B (AWS Console) as backup.

**Never rely on:**
- Hardcoded passwords
- Shared credentials
- Disabling auth entirely
- "Secret URLs" for admin access
