-- Migration: Update Authentication Tables for ACC v1.0 and Cognito Federated IdP
-- This migration adds the necessary columns and tables to support:
-- - Cognito OAuth integration
-- - ACC v1.0 JWT claims (roles, user_id, operator_id, location_ids)
-- - Multi-identity user tracking

-- ============================================================================
-- PART 1: Update user_account table
-- ============================================================================

-- Add Cognito-specific columns
ALTER TABLE user_account 
    ADD COLUMN IF NOT EXISTS cognito_sub UUID UNIQUE,
    ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50),
    ADD COLUMN IF NOT EXISTS location_ids UUID[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS roles JSONB DEFAULT '[]';

-- Add comments for documentation
COMMENT ON COLUMN user_account.cognito_sub IS 
    'Cognito user sub (UUID). NULL for non-Cognito users. Required for ACC v1.0 custom:user_id claim';
COMMENT ON COLUMN user_account.auth_provider IS 
    'Identity provider: cognito, yardi, google, supabase. Required for ACC v1.0 custom:auth_provider claim';
COMMENT ON COLUMN user_account.location_ids IS 
    'Array of location UUIDs for location_staff. Required for ACC v1.0 custom:location_ids claim';
COMMENT ON COLUMN user_account.roles IS 
    'JSON array of role strings. Required for ACC v1.0 custom:roles claim. Synced from user_role table.';

-- Create index for Cognito lookups
CREATE INDEX IF NOT EXISTS idx_user_account_cognito_sub 
    ON user_account(cognito_sub) 
    WHERE cognito_sub IS NOT NULL;

-- Create index for auth provider lookups
CREATE INDEX IF NOT EXISTS idx_user_account_auth_provider 
    ON user_account(auth_provider);

-- ============================================================================
-- PART 2: Create helper function for role aggregation
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_roles(p_user_id UUID)
RETURNS JSONB AS $$
BEGIN
    RETURN COALESCE(
        (
            SELECT jsonb_agg(DISTINCT ur.role_type ORDER BY ur.role_type)
            FROM user_role ur
            WHERE ur.user_id = p_user_id
            AND ur.is_active = true
        ),
        '[]'::jsonb
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_roles(UUID) IS 
    'Aggregate user roles from user_role table into JSON array for JWT claims';

-- ============================================================================
-- PART 3: Create trigger to sync roles
-- ============================================================================

CREATE OR REPLACE FUNCTION sync_user_roles()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Determine which user to sync
    IF TG_OP = 'DELETE' THEN
        v_user_id := OLD.user_id;
    ELSE
        v_user_id := NEW.user_id;
    END IF;
    
    -- Update denormalized roles column
    UPDATE user_account
    SET roles = get_user_roles(v_user_id),
        updated_at = NOW()
    WHERE user_id = v_user_id;
    
    -- Return appropriate row for trigger type
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if present
DROP TRIGGER IF EXISTS trg_sync_user_roles ON user_role;

-- Create trigger
CREATE TRIGGER trg_sync_user_roles
    AFTER INSERT OR UPDATE OR DELETE ON user_role
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_roles();

COMMENT ON TRIGGER trg_sync_user_roles ON user_role IS 
    'Automatically sync roles to user_account.roles JSONB column for JWT claim generation';

-- ============================================================================
-- PART 4: Populate existing roles
-- ============================================================================

-- Backfill roles for existing users
UPDATE user_account
SET roles = get_user_roles(user_id)
WHERE roles = '[]'::jsonb OR roles IS NULL;

-- Set default auth_provider for existing users
UPDATE user_account
SET auth_provider = 'supabase'
WHERE auth_provider IS NULL AND cognito_sub IS NULL;

-- ============================================================================
-- PART 5: Create user_identities table
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_identities (
    identity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE,
    
    -- Identity provider info
    provider_type VARCHAR(50) NOT NULL CHECK (provider_type IN (
        'cognito', 'yardi', 'google', 'supabase', 'microsoft', 'okta'
    )),
    provider_user_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255),
    
    -- Identity metadata
    provider_data JSONB DEFAULT '{}',
    is_primary BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    
    -- Constraints
    UNIQUE(provider_type, provider_user_id),
    UNIQUE(user_id, provider_type)
);

-- Create indexes
CREATE INDEX idx_user_identities_user_id ON user_identities(user_id);
CREATE INDEX idx_user_identities_provider ON user_identities(provider_type, provider_user_id);
CREATE INDEX idx_user_identities_primary ON user_identities(user_id) WHERE is_primary = true;

-- Add comments
COMMENT ON TABLE user_identities IS 
    'Track multiple auth identities per user for ACC v1.0 multi-IdP support';
COMMENT ON COLUMN user_identities.provider_type IS 
    'Identity provider: cognito, yardi, google, supabase, microsoft, okta';
COMMENT ON COLUMN user_identities.provider_user_id IS 
    'User ID from the identity provider (e.g., Cognito sub, Google sub)';

-- Enable RLS
ALTER TABLE user_identities ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only see their own identities
CREATE POLICY user_identities_owner_select ON user_identities
    FOR SELECT
    USING (user_id = auth.uid());

-- RLS: Service role can manage all identities (for auth callback)
CREATE POLICY user_identities_service_all ON user_identities
    FOR ALL
    TO service_role
    USING (true);

-- ============================================================================
-- PART 6: Update RLS policies for user_account
-- ============================================================================

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS user_account_cognito_access ON user_account;

-- Create updated policy that allows service role access
CREATE POLICY user_account_service_access ON user_account
    FOR ALL
    TO service_role
    USING (true);

-- ============================================================================
-- PART 7: Create view for JWT claims generation
-- ============================================================================

CREATE OR REPLACE VIEW v_user_jwt_claims AS
SELECT 
    ua.user_id,
    ua.email,
    ua.cognito_sub,
    ua.auth_provider,
    ua.operator_id,
    ua.location_ids,
    ua.roles,
    ua.is_active,
    -- ACC v1.0 required claims formatted
    jsonb_build_object(
        'custom:user_id', ua.user_id::text,
        'custom:roles', ua.roles,
        'custom:operator_id', CASE 
            WHEN 'platform_admin' = ANY(ARRAY(SELECT jsonb_array_elements_text(ua.roles))) 
            THEN NULL 
            ELSE ua.operator_id::text 
        END,
        'custom:location_ids', ua.location_ids,
        'custom:auth_provider', ua.auth_provider,
        'email', ua.email,
        'email_verified', true
    ) as jwt_claims
FROM user_account ua
WHERE ua.is_active = true;

COMMENT ON VIEW v_user_jwt_claims IS 
    'Pre-formatted JWT claims per ACC v1.0 spec for Cognito token generation';

-- ============================================================================
-- PART 8: Create function for Cognito user sync
-- ============================================================================

CREATE OR REPLACE FUNCTION sync_cognito_user(
    p_cognito_sub UUID,
    p_email VARCHAR,
    p_auth_provider VARCHAR,
    p_roles JSONB DEFAULT '[]'::jsonb,
    p_operator_id UUID DEFAULT NULL,
    p_location_ids UUID[] DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Try to find existing user by Cognito sub
    SELECT user_id INTO v_user_id
    FROM user_account
    WHERE cognito_sub = p_cognito_sub;
    
    -- If not found, try by email
    IF v_user_id IS NULL THEN
        SELECT user_id INTO v_user_id
        FROM user_account
        WHERE email = LOWER(p_email)
        AND (operator_id = p_operator_id OR p_operator_id IS NULL)
        LIMIT 1;
        
        -- Update with Cognito info
        IF v_user_id IS NOT NULL THEN
            UPDATE user_account
            SET cognito_sub = p_cognito_sub,
                auth_provider = p_auth_provider,
                roles = p_roles,
                location_ids = p_location_ids,
                updated_at = NOW()
            WHERE user_id = v_user_id;
        END IF;
    END IF;
    
    -- Return user_id
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION sync_cognito_user IS 
    'Sync Cognito user with c3scan database on OAuth callback';

-- ============================================================================
-- Verification
-- ============================================================================

-- Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_account'
AND column_name IN ('cognito_sub', 'auth_provider', 'location_ids', 'roles')
ORDER BY ordinal_position;

-- Verify trigger exists
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE trigger_name = 'trg_sync_user_roles';

-- Verify function exists
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name IN ('get_user_roles', 'sync_user_roles', 'sync_cognito_user');

-- Verify table exists
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'user_identities';
