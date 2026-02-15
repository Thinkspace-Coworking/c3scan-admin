-- Migration: Emergency Access (Break-Glass Authentication)
-- 
-- This migration adds support for emergency admin login when OAuth/Cognito is unavailable.
-- 
-- SECURITY NOTES:
-- - Emergency access should only be used when normal auth is down
-- - All emergency access is logged to emergency_access_logs
-- - Emergency passwords must be strong (20+ chars) and rotated regularly
-- - TOTP (Time-based One-Time Password) required for all emergency access

-- Add emergency admin columns to user_account
ALTER TABLE user_account 
ADD COLUMN IF NOT EXISTS is_emergency_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS emergency_password_hash TEXT,
ADD COLUMN IF NOT EXISTS emergency_mfa_secret TEXT,
ADD COLUMN IF NOT EXISTS emergency_last_used TIMESTAMPTZ;

-- Create index for emergency admin lookups
CREATE INDEX IF NOT EXISTS idx_user_account_emergency 
ON user_account(is_emergency_admin) 
WHERE is_emergency_admin = true;

-- Create emergency access logs table
CREATE TABLE IF NOT EXISTS emergency_access_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_account(user_id),
  attempted_email TEXT, -- For failed attempts where user not found
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  failure_reason TEXT,
  reason_provided TEXT, -- Why they needed emergency access
  actions_taken JSONB DEFAULT '[]',
  token_jti TEXT, -- JWT token ID for session tracking
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for emergency access logs
CREATE INDEX IF NOT EXISTS idx_emergency_logs_user 
ON emergency_access_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_emergency_logs_time 
ON emergency_access_logs(accessed_at DESC);

CREATE INDEX IF NOT EXISTS idx_emergency_logs_success 
ON emergency_access_logs(success);

-- View for security dashboard
CREATE OR REPLACE VIEW v_emergency_access_summary AS
SELECT 
  u.user_id,
  u.email,
  u.display_name,
  u.is_emergency_admin,
  u.emergency_last_used,
  COUNT(e.log_id) FILTER (WHERE e.success = true) as successful_accesses,
  COUNT(e.log_id) FILTER (WHERE e.success = false) as failed_attempts,
  MAX(e.accessed_at) as last_attempt_at
FROM user_account u
LEFT JOIN emergency_access_logs e ON u.user_id = e.user_id
WHERE u.is_emergency_admin = true
GROUP BY u.user_id, u.email, u.display_name, u.is_emergency_admin, u.emergency_last_used;

-- Comments for documentation
COMMENT ON TABLE emergency_access_logs IS 
  'Audit log for all emergency authentication attempts. Review regularly for security.';

COMMENT ON COLUMN user_account.is_emergency_admin IS 
  'When true, user can authenticate via emergency endpoint bypassing OAuth';

COMMENT ON COLUMN user_account.emergency_password_hash IS 
  'bcrypt hash of emergency password. Must be 20+ characters.';

COMMENT ON COLUMN user_account.emergency_mfa_secret IS 
  'TOTP secret for authenticator app (Google Authenticator, Authy, etc.)';

-- Grant access to authenticated users (for reading their own logs)
-- Note: Full access should be restricted to admin roles via RLS or application logic
