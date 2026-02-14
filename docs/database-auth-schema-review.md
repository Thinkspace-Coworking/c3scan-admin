# Database Schema Review: Authentication Tables

**Purpose:** Align existing database schema with Admin Context Contract (ACC) v1.0 and Cognito Federated IdP requirements.

---

## **Current Schema Analysis**

### **user_account Table (Existing)**

```sql
user_account {
    uuid user_id PK                    -- c3scan internal UUID
    uuid auth_user_id                  -- External auth provider ID (Supabase)
    citext email                       -- User email (case-insensitive)
    text display_name                  -- Display name
    text user_type                     -- Type classification
    uuid operator_id FK                -- Operator scope (nullable for platform_admin?)
    boolean is_active                  -- Account status
    timestamptz created_at
    timestamptz updated_at
}
```

**Issues for ACC v1.0:**
1. ✅ Has `user_id` - maps to `custom:user_id`
2. ⚠️ `auth_user_id` - Supabase-specific, needs Cognito `sub` support
3. ⚠️ `user_type` - single value, ACC requires `roles` (array)
4. ❌ Missing `cognito_sub` - needed for Cognito federation
5. ❌ Missing `auth_provider` - track which IdP (Yardi, Google, etc.)
6. ❌ Missing `location_ids` - for location_staff scoping

### **user_role Table (Existing)**

```sql
user_role {
    uuid user_role_id PK
    uuid user_id FK
    uuid operator_id FK
    uuid location_id FK      -- Nullable for operator-wide roles
    text role_type           -- Single role per row
    boolean is_active
    timestamptz created_at
}
```

**Issues for ACC v1.0:**
1. ❌ **Normalized role storage** - ACC requires roles in JWT claims (denormalized)
2. ✅ Supports location-specific roles
3. ❌ Multiple rows per user - hard to serialize to JWT array

### **user_operators Table (Existing)**

```sql
user_operators {
    uuid id PK
    uuid user_id
    uuid operator_id FK
    text email
    text role                    -- Single role (operator_admin, staff, etc.)
    boolean is_active
    timestamptz first_login
    timestamptz last_login
    timestamptz created_at
    timestamptz updated_at
}
```

**Issues:**
1. ❌ Duplicate of user_role functionality
2. ❌ Single role only
3. ⚠️ Should be consolidated with user_role

---

## **Required Changes for ACC v1.0**

### **1. Update user_account Table**

```sql
-- Add columns for Cognito/ACC v1.0
ALTER TABLE user_account ADD COLUMN cognito_sub UUID UNIQUE;
ALTER TABLE user_account ADD COLUMN auth_provider VARCHAR(50);
ALTER TABLE user_account ADD COLUMN location_ids UUID[] DEFAULT '{}';

-- Rename/deprecate auth_user_id (Supabase) in favor of cognito_sub
-- Keep for backward compatibility during migration

-- Add index for Cognito lookups
CREATE INDEX idx_user_account_cognito_sub ON user_account(cognito_sub);

-- Update comment
COMMENT ON COLUMN user_account.cognito_sub IS 
  'Cognito user sub (UUID). NULL for non-Cognito users. Required for ACC v1.0';
```

### **2. Create User Roles View (for JWT Claims)**

```sql
-- Materialized view or function to get all roles as JSON array
CREATE OR REPLACE FUNCTION get_user_roles(p_user_id UUID)
RETURNS JSONB AS $$
BEGIN
    RETURN (
        SELECT jsonb_agg(DISTINCT ur.role_type)
        FROM user_role ur
        WHERE ur.user_id = p_user_id
        AND ur.is_active = true
    );
END;
$$ LANGUAGE plpgsql;

-- Alternative: Create a computed column or trigger-maintained column
ALTER TABLE user_account ADD COLUMN roles JSONB DEFAULT '[]';

-- Trigger to sync roles from user_role table
CREATE OR REPLACE FUNCTION sync_user_roles()
RETURNS TRIGGER AS $$
BEGIN
    -- Update denormalized roles column
    UPDATE user_account
    SET roles = get_user_roles(NEW.user_id)
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_user_roles
AFTER INSERT OR UPDATE OR DELETE ON user_role
FOR EACH ROW
EXECUTE FUNCTION sync_user_roles();
```

### **3. Create user_identities Table (NEW)**

```sql
-- Track multiple auth identities per user (for future IdP linking)
CREATE TABLE user_identities (
    identity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_account(user_id) ON DELETE CASCADE,
    
    -- Identity provider info
    provider_type VARCHAR(50) NOT NULL,  -- 'cognito', 'yardi', 'google', 'supabase'
    provider_user_id VARCHAR(255) NOT NULL,  -- User ID from IdP
    provider_email VARCHAR(255),
    
    -- Identity metadata
    provider_data JSONB,  -- Raw claims from IdP
    is_primary BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    
    -- Constraints
    UNIQUE(provider_type, provider_user_id),
    UNIQUE(user_id, provider_type)
);

CREATE INDEX idx_user_identities_user_id ON user_identities(user_id);
CREATE INDEX idx_user_identities_provider ON user_identities(provider_type, provider_user_id);

-- Enable RLS
ALTER TABLE user_identities ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_identities_owner_only ON user_identities
    FOR ALL
    USING (user_id = auth.uid());
```

### **4. Create audit_logs Table (Already Created)**

✅ Migration: `supabase/migrations/20250214160000_create_audit_logs.sql`

---

## **JWT Claims Mapping**

| ACC v1.0 Claim | Source Table | Source Column | Notes |
|----------------|--------------|---------------|-------|
| `custom:user_id` | user_account | user_id | Primary UUID |
| `custom:roles` | user_account | roles (JSONB) | Array of role strings |
| `custom:operator_id` | user_account | operator_id | NULL for platform_admin |
| `custom:location_ids` | user_account | location_ids | Array of location UUIDs |
| `custom:auth_provider` | user_account | auth_provider | 'yardi', 'google', etc. |
| `sub` | user_account | cognito_sub | Cognito UUID |
| `email` | user_account | email | User email |

---

## **Data Migration Plan**

### **Phase 1: Add New Columns (Non-Breaking)**

```sql
-- Add nullable columns
ALTER TABLE user_account ADD COLUMN cognito_sub UUID UNIQUE;
ALTER TABLE user_account ADD COLUMN auth_provider VARCHAR(50);
ALTER TABLE user_account ADD COLUMN location_ids UUID[] DEFAULT '{}';
ALTER TABLE user_account ADD COLUMN roles JSONB DEFAULT '[]';

-- Populate roles from existing user_role data
UPDATE user_account ua
SET roles = get_user_roles(ua.user_id);
```

### **Phase 2: Migrate Existing Users to Cognito**

```sql
-- When users first log in via Cognito:
-- 1. Find user by email
-- 2. Set cognito_sub = Cognito sub claim
-- 3. Set auth_provider = 'cognito'
-- 4. Set roles from Cognito claims

-- Backfill script for existing active users:
UPDATE user_account
SET 
    auth_provider = 'supabase',  -- Existing users
    cognito_sub = gen_random_uuid()  -- Temporary, will be replaced on first Cognito login
WHERE cognito_sub IS NULL;
```

### **Phase 3: Deprecate Legacy Fields**

```sql
-- After full migration:
-- - auth_user_id can be removed (or kept for history)
-- - user_type can be removed (use roles array)
-- - user_operators table can be deprecated (use user_role)
```

---

## **RLS Policy Updates**

### **user_account RLS**

```sql
-- Existing: Users can view their own account
-- Update to allow Cognito service role

CREATE POLICY user_account_cognito_access ON user_account
    FOR ALL
    USING (
        user_id = auth.uid()
        OR 
        -- Service role for Cognito sync
        auth.jwt()->>'role' = 'service_role'
    );
```

---

## **Verification Checklist**

- [ ] Columns added to user_account
- [ ] Indexes created for performance
- [ ] user_identities table created
- [ ] Roles sync trigger working
- [ ] Audit logs table created
- [ ] RLS policies updated
- [ ] Data migration script tested
- [ ] Cognito callback route updated to use new schema
- [ ] JWT claims match ACC v1.0 spec

---

## **Files to Update**

1. **Migration:** `supabase/migrations/20250214160001_update_auth_tables.sql`
2. **Callback Route:** Update `app/api/auth/callback/route.ts` to use new columns
3. **Middleware:** Ensure `middleware.ts` reads roles correctly from JWT
4. **Documentation:** Update `docs/architecture/database-erd.md`

---

## **Next Steps**

1. Review and approve schema changes
2. Create Supabase migration
3. Update callback route to populate new fields
4. Test JWT claim generation
5. Verify ACC v1.0 compliance
