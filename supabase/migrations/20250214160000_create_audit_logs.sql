-- Migration: Create audit_logs table per ACC v1.0 Section 7
-- This table stores all audit events as required by the Admin Context Contract

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Required fields per ACC v1.0
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_user_id UUID NOT NULL,  -- References user_accounts.user_id
  actor_roles JSONB NOT NULL,   -- Array of roles at time of event
  effective_operator_id UUID NOT NULL,  -- The resolved operator context
  endpoint TEXT NOT NULL,       -- API endpoint accessed
  method TEXT NOT NULL,         -- HTTP method
  
  -- Optional fields
  event_type TEXT NOT NULL CHECK (event_type IN (
    'AUTH_SUCCESS',
    'AUTH_DENIED',
    'PLATFORM_ADMIN_ACCESS',
    'RESOURCE_CREATE',
    'RESOURCE_UPDATE',
    'RESOURCE_DELETE',
    'RESOURCE_VIEW',
    'PERMISSION_DENIED',
    'OPERATOR_CONTEXT_CONFLICT',
    'OPERATOR_CONTEXT_REQUIRED'
  )),
  resource_type TEXT,           -- Type of resource (mail_item, company, etc.)
  resource_id UUID,             -- ID of resource affected
  result TEXT NOT NULL CHECK (result IN ('success', 'denied', 'error')),
  error_code TEXT,              -- Error code if result is 'denied' or 'error'
  
  -- Additional context
  ip_address INET,              -- Client IP address
  user_agent TEXT,              -- Client user agent
  request_id UUID,              -- Request correlation ID
  
  -- For mutations: before/after state
  previous_state JSONB,         -- Previous state of resource (for updates/deletes)
  new_state JSONB,              -- New state of resource (for creates/updates)
  
  -- Additional metadata
  metadata JSONB,               -- Flexible metadata storage
  
  -- Partitioning support (for high volume)
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Indexes for common queries
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_operator_id ON audit_logs(effective_operator_id);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Composite index for common filter patterns
CREATE INDEX idx_audit_logs_operator_timestamp 
  ON audit_logs(effective_operator_id, timestamp DESC);

-- Index for platform admin audit queries
CREATE INDEX idx_audit_logs_platform_admin 
  ON audit_logs(event_type, timestamp DESC) 
  WHERE event_type = 'PLATFORM_ADMIN_ACCESS';

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see audit logs for their operator
CREATE POLICY audit_logs_tenant_isolation ON audit_logs
  FOR SELECT
  USING (
    effective_operator_id IN (
      SELECT operator_id FROM user_accounts 
      WHERE user_id = auth.uid()
    )
  );

-- Service role can insert all audit logs
CREATE POLICY audit_logs_service_insert ON audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Only platform admins can view cross-operator audit logs
CREATE POLICY audit_logs_platform_admin_all ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_accounts 
      WHERE user_id = auth.uid() 
      AND roles @> '["platform_admin"]'
    )
  );

-- Add comment documenting compliance
COMMENT ON TABLE audit_logs IS 
  'Audit logging per ACC v1.0 Section 7. Logs all platform_admin requests, mutations, and auth denials.';

-- Grant permissions
GRANT SELECT, INSERT ON audit_logs TO service_role;
GRANT USAGE, SELECT ON SEQUENCE audit_logs_id_seq TO service_role;
