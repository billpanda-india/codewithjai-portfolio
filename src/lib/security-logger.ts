import { supabaseAdmin } from '@/lib/supabase/client'

export type SecurityEventType = 'login_success' | 'login_failed' | 'suspicious_activity' | 'password_change' | 'session_expired'
export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical'

export async function logSecurityEvent(
  eventType: SecurityEventType,
  severity: SecuritySeverity,
  details: string,
  ipAddress?: string,
  userAgent?: string,
  username?: string
) {
  try {
    await supabaseAdmin.from('security_logs').insert({
      event_type: eventType,
      severity,
      ip_address: ipAddress || 'unknown',
      user_agent: userAgent || 'unknown',
      username,
      details,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}

export type SystemLogLevel = 'info' | 'warning' | 'error' | 'critical'
export type SystemLogCategory = 'api' | 'database' | 'email' | 'auth' | 'system'

export async function logSystemEvent(
  level: SystemLogLevel,
  category: SystemLogCategory,
  message: string,
  details?: string,
  stackTrace?: string
) {
  try {
    await supabaseAdmin.from('system_logs').insert({
      log_type: category,
      severity: level,
      level,
      category,
      message,
      details,
      stack_trace: stackTrace,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to log system event:', error)
  }
}
