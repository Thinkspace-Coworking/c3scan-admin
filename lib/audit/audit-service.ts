/**
 * Audit Logging Service
 * 
 * Implements ACC v1.0 Section 7: Audit Logging Requirements
 * 
 * Required logging:
 * - All platform_admin requests to operator-scoped endpoints
 * - All changes (POST/PUT/PATCH/DELETE) by operator_admin or platform_admin
 * - All auth denials (OPERATOR_CONTEXT_REQUIRED, OPERATOR_CONTEXT_CONFLICT)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export type AuditEventType = 
  | 'AUTH_SUCCESS'
  | 'AUTH_DENIED'
  | 'PLATFORM_ADMIN_ACCESS'
  | 'RESOURCE_CREATE'
  | 'RESOURCE_UPDATE'
  | 'RESOURCE_DELETE'
  | 'RESOURCE_VIEW'
  | 'PERMISSION_DENIED'
  | 'OPERATOR_CONTEXT_CONFLICT'
  | 'OPERATOR_CONTEXT_REQUIRED';

export interface AuditEvent {
  // Required fields per ACC v1.0
  timestamp: string;
  actor_user_id: string;
  actor_roles: string[];
  effective_operator_id: string;
  endpoint: string;
  method: string;
  
  // Optional fields
  event_type: AuditEventType;
  resource_type?: string;
  resource_id?: string;
  result: 'success' | 'denied' | 'error';
  error_code?: string;
  
  // Additional context
  ip_address?: string;
  user_agent?: string;
  request_id?: string;
  
  // For mutations: before/after state (optional)
  previous_state?: Record<string, unknown>;
  new_state?: Record<string, unknown>;
  
  // Additional metadata
  metadata?: Record<string, unknown>;
}

/**
 * Log an audit event
 */
export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    // Insert into Supabase audit_logs table
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        ...event,
        actor_roles: JSON.stringify(event.actor_roles),
        previous_state: event.previous_state ? JSON.stringify(event.previous_state) : null,
        new_state: event.new_state ? JSON.stringify(event.new_state) : null,
        metadata: event.metadata ? JSON.stringify(event.metadata) : null,
      });
    
    if (error) {
      console.error('Failed to write audit log:', error);
      // Don't throw - audit logging should not break the application
    }
    
    // Also log to CloudWatch for real-time monitoring
    console.log('[AUDIT]', JSON.stringify(event));
    
  } catch (err) {
    console.error('Audit logging error:', err);
    // Don't throw - audit logging should not break the application
  }
}

/**
 * Log authentication success
 */
export async function logAuthSuccess(
  userId: string,
  roles: string[],
  operatorId: string,
  authProvider: string,
  requestContext: {
    endpoint: string;
    method: string;
    ip_address?: string;
    user_agent?: string;
  }
): Promise<void> {
  await logAuditEvent({
    timestamp: new Date().toISOString(),
    actor_user_id: userId,
    actor_roles: roles,
    effective_operator_id: operatorId,
    endpoint: requestContext.endpoint,
    method: requestContext.method,
    event_type: 'AUTH_SUCCESS',
    result: 'success',
    ip_address: requestContext.ip_address,
    user_agent: requestContext.user_agent,
    metadata: {
      auth_provider: authProvider,
    },
  });
}

/**
 * Log authentication denial
 */
export async function logAuthDenied(
  userId: string | null,
  roles: string[],
  operatorId: string | null,
  errorCode: string,
  requestContext: {
    endpoint: string;
    method: string;
    ip_address?: string;
    user_agent?: string;
  }
): Promise<void> {
  const eventType: AuditEventType = 
    errorCode === 'OPERATOR_CONTEXT_CONFLICT' ? 'OPERATOR_CONTEXT_CONFLICT' :
    errorCode === 'OPERATOR_CONTEXT_REQUIRED' ? 'OPERATOR_CONTEXT_REQUIRED' :
    'AUTH_DENIED';
  
  await logAuditEvent({
    timestamp: new Date().toISOString(),
    actor_user_id: userId || 'anonymous',
    actor_roles: roles,
    effective_operator_id: operatorId || 'none',
    endpoint: requestContext.endpoint,
    method: requestContext.method,
    event_type: eventType,
    result: 'denied',
    error_code: errorCode,
    ip_address: requestContext.ip_address,
    user_agent: requestContext.user_agent,
  });
}

/**
 * Log platform admin access to operator-scoped endpoint
 * Per ACC v1.0 Section 7: Must log all platform_admin operator-scoped requests
 */
export async function logPlatformAdminAccess(
  userId: string,
  roles: string[],
  operatorId: string,
  requestContext: {
    endpoint: string;
    method: string;
    resource_type?: string;
    resource_id?: string;
    ip_address?: string;
    user_agent?: string;
  }
): Promise<void> {
  await logAuditEvent({
    timestamp: new Date().toISOString(),
    actor_user_id: userId,
    actor_roles: roles,
    effective_operator_id: operatorId,
    endpoint: requestContext.endpoint,
    method: requestContext.method,
    event_type: 'PLATFORM_ADMIN_ACCESS',
    resource_type: requestContext.resource_type,
    resource_id: requestContext.resource_id,
    result: 'success',
    ip_address: requestContext.ip_address,
    user_agent: requestContext.user_agent,
  });
}

/**
 * Log resource mutation
 * Per ACC v1.0 Section 7: Must log all POST/PUT/PATCH/DELETE by admin roles
 */
export async function logResourceMutation(
  userId: string,
  roles: string[],
  operatorId: string,
  eventType: 'RESOURCE_CREATE' | 'RESOURCE_UPDATE' | 'RESOURCE_DELETE',
  requestContext: {
    endpoint: string;
    method: string;
    resource_type: string;
    resource_id?: string;
    ip_address?: string;
    user_agent?: string;
  },
  state?: {
    previous?: Record<string, unknown>;
    new?: Record<string, unknown>;
  }
): Promise<void> {
  await logAuditEvent({
    timestamp: new Date().toISOString(),
    actor_user_id: userId,
    actor_roles: roles,
    effective_operator_id: operatorId,
    endpoint: requestContext.endpoint,
    method: requestContext.method,
    event_type: eventType,
    resource_type: requestContext.resource_type,
    resource_id: requestContext.resource_id,
    result: 'success',
    previous_state: state?.previous,
    new_state: state?.new,
    ip_address: requestContext.ip_address,
    user_agent: requestContext.user_agent,
  });
}

/**
 * Log permission denied
 */
export async function logPermissionDenied(
  userId: string,
  roles: string[],
  operatorId: string,
  requestContext: {
    endpoint: string;
    method: string;
    resource_type?: string;
    resource_id?: string;
    ip_address?: string;
    user_agent?: string;
  }
): Promise<void> {
  await logAuditEvent({
    timestamp: new Date().toISOString(),
    actor_user_id: userId,
    actor_roles: roles,
    effective_operator_id: operatorId,
    endpoint: requestContext.endpoint,
    method: requestContext.method,
    event_type: 'PERMISSION_DENIED',
    resource_type: requestContext.resource_type,
    resource_id: requestContext.resource_id,
    result: 'denied',
    ip_address: requestContext.ip_address,
    user_agent: requestContext.user_agent,
  });
}

/**
 * Query audit logs
 */
export async function queryAuditLogs(filters: {
  actor_user_id?: string;
  effective_operator_id?: string;
  event_type?: AuditEventType;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: AuditEvent[]; count: number }> {
  let query = supabase
    .from('audit_logs')
    .select('*', { count: 'exact' });
  
  if (filters.actor_user_id) {
    query = query.eq('actor_user_id', filters.actor_user_id);
  }
  
  if (filters.effective_operator_id) {
    query = query.eq('effective_operator_id', filters.effective_operator_id);
  }
  
  if (filters.event_type) {
    query = query.eq('event_type', filters.event_type);
  }
  
  if (filters.start_date) {
    query = query.gte('timestamp', filters.start_date);
  }
  
  if (filters.end_date) {
    query = query.lte('timestamp', filters.end_date);
  }
  
  query = query.order('timestamp', { ascending: false });
  
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }
  
  const { data, error, count } = await query;
  
  if (error) {
    throw error;
  }
  
  // Parse JSON fields
  const parsedData = data?.map(row => ({
    ...row,
    actor_roles: JSON.parse(row.actor_roles || '[]'),
    previous_state: row.previous_state ? JSON.parse(row.previous_state) : undefined,
    new_state: row.new_state ? JSON.parse(row.new_state) : undefined,
    metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
  })) || [];
  
  return { data: parsedData, count: count || 0 };
}

/**
 * Get audit log statistics
 */
export async function getAuditStats(
  operatorId?: string,
  days: number = 30
): Promise<{
  total_events: number;
  events_by_type: Record<string, number>;
  top_users: Array<{ user_id: string; count: number }>;
}> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  let query = supabase
    .from('audit_logs')
    .select('event_type, actor_user_id')
    .gte('timestamp', startDate.toISOString());
  
  if (operatorId) {
    query = query.eq('effective_operator_id', operatorId);
  }
  
  const { data, error } = await query;
  
  if (error || !data) {
    return { total_events: 0, events_by_type: {}, top_users: [] };
  }
  
  // Aggregate stats
  const eventsByType: Record<string, number> = {};
  const userCounts: Record<string, number> = {};
  
  data.forEach(row => {
    eventsByType[row.event_type] = (eventsByType[row.event_type] || 0) + 1;
    userCounts[row.actor_user_id] = (userCounts[row.actor_user_id] || 0) + 1;
  });
  
  const topUsers = Object.entries(userCounts)
    .map(([user_id, count]) => ({ user_id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    total_events: data.length,
    events_by_type: eventsByType,
    top_users: topUsers,
  };
}
