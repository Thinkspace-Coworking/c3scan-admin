/**
 * Audit Logging Module
 * 
 * Exports all audit logging functionality per ACC v1.0
 */

export {
  // Main logging function
  logAuditEvent,
  
  // Convenience functions
  logAuthSuccess,
  logAuthDenied,
  logPlatformAdminAccess,
  logResourceMutation,
  logPermissionDenied,
  
  // Query functions
  queryAuditLogs,
  getAuditStats,
  
  // Types
  type AuditEvent,
  type AuditEventType,
} from './audit-service';
