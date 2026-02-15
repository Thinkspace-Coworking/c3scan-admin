-- Migration: System Settings Table
-- 
-- Stores operator-level configuration including maintenance mode

CREATE TABLE IF NOT EXISTS system_settings (
  setting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES operator(operator_id),
  setting_key VARCHAR(100) NOT NULL,
  setting_value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES user_account(user_id),
  
  -- Ensure unique settings per operator
  UNIQUE(operator_id, setting_key)
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_system_settings_lookup 
ON system_settings(operator_id, setting_key);

-- Comments
COMMENT ON TABLE system_settings IS 
  'Operator-level system configuration. Settings are stored as JSONB for flexibility.';

COMMENT ON COLUMN system_settings.setting_key IS 
  'Unique identifier for the setting (e.g., maintenance_mode, feature_flags)';

-- Insert default maintenance mode setting (disabled by default)
INSERT INTO system_settings (setting_key, setting_value, updated_at)
VALUES (
  'maintenance_mode',
  '{"is_enabled": false, "message": "We are performing scheduled maintenance. Please check back soon."}'::jsonb,
  NOW()
)
ON CONFLICT (operator_id, setting_key) DO NOTHING;

-- Create view for active maintenance mode
CREATE OR REPLACE VIEW v_maintenance_status AS
SELECT 
  operator_id,
  setting_value->>'is_enabled' as is_enabled,
  setting_value->>'message' as message,
  setting_value->>'enabled_at' as enabled_at,
  setting_value->>'enabled_by' as enabled_by,
  updated_at
FROM system_settings
WHERE setting_key = 'maintenance_mode';
