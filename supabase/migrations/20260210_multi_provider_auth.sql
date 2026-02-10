-- C3scan Multi-Provider Auth & Custom Domains Migration
-- Run this in Supabase SQL Editor
-- Created: 2026-02-10

-- ============================================================================
-- 1. ALTER operator TABLE - Add custom domain and branding columns
-- ============================================================================

-- Add slug for wildcard subdomains (e.g., 'thinkspace' for thinkspace.c3scan.io)
ALTER TABLE operator 
ADD COLUMN IF NOT EXISTS slug VARCHAR(50) UNIQUE;

-- Add custom_domain for CNAME white-label (e.g., 'c3scan.thinkspace.com')
ALTER TABLE operator 
ADD COLUMN IF NOT EXISTS custom_domain VARCHAR(255) UNIQUE;

-- Add branding columns for white-label customization
ALTER TABLE operator 
ADD COLUMN IF NOT EXISTS brand_primary_color VARCHAR(7);

ALTER TABLE operator 
ADD COLUMN IF NOT EXISTS brand_logo_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN operator.slug IS 'URL-friendly identifier for wildcard subdomain (e.g., "thinkspace" for thinkspace.c3scan.io)';
COMMENT ON COLUMN operator.custom_domain IS 'Customer CNAME for white-label (e.g., "c3scan.thinkspace.com")';
COMMENT ON COLUMN operator.brand_primary_color IS 'Hex color code for white-label branding (e.g., "#0066CC")';
COMMENT ON COLUMN operator.brand_logo_url IS 'URL to operator logo for white-label branding';

-- ============================================================================
-- 2. CREATE operator_integration_config TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS operator_integration_config (
    operator_integration_config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES operator(operator_id) ON DELETE CASCADE,
    
    -- Integration type enum
    integration_type VARCHAR(50) NOT NULL CHECK (
        integration_type IN (
            -- Auth providers
            'auth_native',
            'auth_yardi_oidc',
            'auth_officernd_oauth',
            'auth_deskworks_oauth',
            'auth_google_oidc',
            'auth_microsoft_oidc',
            -- Billing integrations
            'billing_stripe',
            -- Shipping integrations
            'shipping_easypost',
            -- Data sync integrations
            'sync_officernd',
            'sync_deskworks',
            'sync_yardi'
        )
    ),
    
    -- Provider-specific configuration (encrypted at application layer)
    config_json JSONB NOT NULL DEFAULT '{}',
    
    -- Status
    is_enabled BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    
    -- One config per integration type per operator
    UNIQUE(operator_id, integration_type)
);

-- Add comments
COMMENT ON TABLE operator_integration_config IS 'Third-party integration configurations per operator (auth, billing, shipping, sync)';
COMMENT ON COLUMN operator_integration_config.config_json IS 'Encrypted JSON containing client_id, client_secret, endpoints, etc.';
COMMENT ON COLUMN operator_integration_config.integration_type IS 'Type of integration (auth_*, billing_*, shipping_*, sync_*)';

-- ============================================================================
-- 3. INDEXES for performance
-- ============================================================================

-- Fast lookup by operator
CREATE INDEX IF NOT EXISTS idx_integration_config_operator 
ON operator_integration_config(operator_id);

-- Fast lookup by integration type
CREATE INDEX IF NOT EXISTS idx_integration_config_type 
ON operator_integration_config(integration_type);

-- Fast lookup by operator + type (for auth routing)
CREATE INDEX IF NOT EXISTS idx_integration_config_operator_type 
ON operator_integration_config(operator_id, integration_type);

-- Fast lookup for enabled integrations only
CREATE INDEX IF NOT EXISTS idx_integration_config_enabled 
ON operator_integration_config(operator_id, integration_type) 
WHERE is_enabled = true;

-- Fast lookup by slug (wildcard subdomain routing)
CREATE INDEX IF NOT EXISTS idx_operator_slug 
ON operator(slug) 
WHERE slug IS NOT NULL;

-- Fast lookup by custom_domain (CNAME routing)
CREATE INDEX IF NOT EXISTS idx_operator_custom_domain 
ON operator(custom_domain) 
WHERE custom_domain IS NOT NULL;

-- ============================================================================
-- 4. TRIGGER to auto-update updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_operator_integration_config_updated_at 
ON operator_integration_config;

CREATE TRIGGER update_operator_integration_config_updated_at
    BEFORE UPDATE ON operator_integration_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE operator_integration_config ENABLE ROW LEVEL SECURITY;

-- Policy: Operators can only see their own integration configs
CREATE POLICY "Operators can view own integration configs"
ON operator_integration_config
FOR SELECT
USING (
    operator_id = current_setting('app.current_operator_id', true)::UUID
    OR current_setting('app.current_user_role', true) = 'super_admin'
);

-- Policy: Only admins can modify integration configs
CREATE POLICY "Only admins can modify integration configs"
ON operator_integration_config
FOR ALL
USING (
    current_setting('app.current_user_role', true) IN ('admin_owner', 'super_admin')
);

-- ============================================================================
-- 6. SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Uncomment and modify for your operator

/*
-- Example: Set up Thinkspace with Yardi OIDC
UPDATE operator 
SET 
    slug = 'thinkspace',
    custom_domain = 'c3scan.thinkspace.com',
    brand_primary_color = '#1E40AF',
    brand_logo_url = 'https://storage.c3scan.io/logos/thinkspace.png'
WHERE operator_name = 'Thinkspace';

-- Insert Yardi OIDC config (replace with actual encrypted values)
INSERT INTO operator_integration_config (
    operator_id,
    integration_type,
    config_json,
    is_enabled
)
SELECT 
    operator_id,
    'auth_yardi_oidc',
    '{
        "issuer": "https://yardi.thinkspace.com",
        "client_id": "c3scan-app",
        "authorization_endpoint": "https://yardi.thinkspace.com/connect/authorize",
        "token_endpoint": "https://yardi.thinkspace.com/connect/token",
        "userinfo_endpoint": "https://yardi.thinkspace.com/connect/userinfo",
        "scopes": ["openid", "email", "profile"],
        "claims_mapping": {
            "email": "email",
            "name": "name",
            "user_id": "sub"
        }
    }'::jsonb,
    true
FROM operator 
WHERE slug = 'thinkspace';

-- Insert Native Supabase auth as fallback
INSERT INTO operator_integration_config (
    operator_id,
    integration_type,
    config_json,
    is_enabled
)
SELECT 
    operator_id,
    'auth_native',
    '{"provider": "supabase", "allow_signup": true}'::jsonb,
    true
FROM operator 
WHERE slug = 'thinkspace';
*/

-- ============================================================================
-- 6. CREATE mail_item_staging TABLE (for async mail upload processing)
-- ============================================================================

CREATE TABLE IF NOT EXISTS mail_item_staging (
    staging_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Raw payload from mobile app
    payload_json JSONB NOT NULL,
    
    -- Processing status
    validation_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (validation_status IN ('pending', 'processing', 'validated', 'failed', 'duplicate')),
    
    -- Result tracking
    mail_item_id UUID,                    -- Populated after successful move to mail_items
    error_message TEXT,                   -- Populated if validation fails
    retry_count INTEGER DEFAULT 0,        -- For retry logic
    
    -- Metadata
    operator_id UUID NOT NULL,
    scanned_by_email VARCHAR(255) NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    last_retry_at TIMESTAMPTZ
);

-- Indexes for staging table
CREATE INDEX IF NOT EXISTS idx_mail_item_staging_status 
ON mail_item_staging(validation_status) 
WHERE validation_status IN ('pending', 'failed');

CREATE INDEX IF NOT EXISTS idx_mail_item_staging_operator 
ON mail_item_staging(operator_id, created_at);

CREATE INDEX IF NOT EXISTS idx_mail_item_staging_mail_item 
ON mail_item_staging(mail_item_id) 
WHERE mail_item_id IS NOT NULL;

-- RLS for staging table
ALTER TABLE mail_item_staging ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view own staging uploads"
ON mail_item_staging
FOR SELECT
USING (scanned_by_email = current_setting('app.current_user_email', true));

-- Comments
COMMENT ON TABLE mail_item_staging IS 'Staging area for mail uploads from mobile app. Background worker validates and moves to mail_items.';
COMMENT ON COLUMN mail_item_staging.validation_status IS 'pending → processing → validated (moved to mail_items) | failed | duplicate';

-- ============================================================================
-- 7. ALTER location TABLE - Add GPS coordinates for geo-fencing
-- ============================================================================

-- Add latitude and longitude for geo-fencing location detection
ALTER TABLE location 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);

ALTER TABLE location 
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add address fields if they don't exist (for geo-fencing verification)
ALTER TABLE location 
ADD COLUMN IF NOT EXISTS address_line1 VARCHAR(255);

ALTER TABLE location 
ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(255);

ALTER TABLE location 
ADD COLUMN IF NOT EXISTS city VARCHAR(100);

ALTER TABLE location 
ADD COLUMN IF NOT EXISTS state VARCHAR(50);

ALTER TABLE location 
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);

-- Comments
COMMENT ON COLUMN location.latitude IS 'GPS latitude for geo-fencing (e.g., 47.6062)';
COMMENT ON COLUMN location.longitude IS 'GPS longitude for geo-fencing (e.g., -122.3321)';
COMMENT ON COLUMN location.address_line1 IS 'Street address (e.g., "1416 NW 46th St")';

-- ============================================================================
-- 8. VERIFICATION QUERIES (Run these to verify setup)
-- ============================================================================

/*
-- Check operator columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'operator' 
AND column_name IN ('slug', 'custom_domain', 'brand_primary_color', 'brand_logo_url');

-- Check operator_integration_config table
SELECT * FROM operator_integration_config LIMIT 1;

-- Check mail_item_staging table
SELECT * FROM mail_item_staging LIMIT 1;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('operator', 'operator_integration_config', 'mail_item_staging');

-- Check RLS policies
SELECT policyname, permissible, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('operator_integration_config', 'mail_item_staging');
*/
