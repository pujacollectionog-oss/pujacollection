export type AuditEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGIN_LOCKOUT'
  | 'COUPON_CREATED'
  | 'COUPON_DELETED'
  | 'COUPON_STATUS_CHANGED'
  | 'PRODUCT_ADDED'
  | 'PRODUCT_DELETED'
  | 'STOCK_UPDATED'
  | 'ORDER_STATUS_CHANGED'
  | 'ORDER_UPDATED'
  | 'ORDER_CANCELLED'
  | 'ORDER_DELETED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  actor: string;
  ipAddress: string;
  userAgent?: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

const auditLogStore: AuditLogEntry[] = [
  {
    id: 'log-init',
    timestamp: new Date().toISOString(),
    eventType: 'LOGIN_SUCCESS',
    actor: 'admin@pujacollection.com.np',
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Server Initialization)',
    details: 'Store Owner admin security logging service initialized.',
    severity: 'INFO',
  },
];

const MAX_LOGS = 100;

export function recordAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  auditLogStore.unshift(newEntry);

  if (auditLogStore.length > MAX_LOGS) {
    auditLogStore.pop();
  }

  // Also log to Node.js server console
  const severityTag = entry.severity === 'CRITICAL' ? '🚨 [SECURITY CRITICAL]' : entry.severity === 'WARNING' ? '⚠️ [SECURITY WARNING]' : 'ℹ️ [SECURITY AUDIT]';
  console.log(`${severityTag} ${newEntry.timestamp} | ${entry.eventType} | Actor: ${entry.actor} | IP: ${entry.ipAddress} | ${entry.details}`);

  return newEntry;
}

export function getRecentAuditLogs(limit: number = 50): AuditLogEntry[] {
  return auditLogStore.slice(0, limit);
}
