import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin: Maintenance Mode Management
 * 
 * GET /api/admin/maintenance-mode - Get current status
 * POST /api/admin/maintenance-mode - Toggle maintenance mode
 * 
 * Controls whether customer-facing site shows maintenance page.
 * Admin routes remain accessible.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// In-memory cache to reduce DB calls
let maintenanceCache: { isEnabled: boolean; message: string; updatedAt: number } | null = null;
const CACHE_TTL = 30000; // 30 seconds

async function getMaintenanceStatus(): Promise<{ is_enabled: boolean; message: string; updated_at: string }> {
  // Check cache first
  if (maintenanceCache && Date.now() - maintenanceCache.updatedAt < CACHE_TTL) {
    return {
      is_enabled: maintenanceCache.isEnabled,
      message: maintenanceCache.message,
      updated_at: new Date(maintenanceCache.updatedAt).toISOString()
    };
  }
  
  // Fetch from database
  const { data, error } = await supabase
    .from('system_settings')
    .select('setting_value, updated_at')
    .eq('setting_key', 'maintenance_mode')
    .single();
  
  if (error || !data) {
    // Default: maintenance mode off
    return { is_enabled: false, message: '', updated_at: new Date().toISOString() };
  }
  
  const parsed = data.setting_value as { is_enabled: boolean; message: string };
  
  // Update cache
  maintenanceCache = {
    isEnabled: parsed.is_enabled,
    message: parsed.message,
    updatedAt: Date.now()
  };
  
  return {
    is_enabled: parsed.is_enabled,
    message: parsed.message,
    updated_at: data.updated_at
  };
}

/**
 * GET - Check maintenance mode status
 */
export async function GET(request: NextRequest) {
  try {
    const operatorId = request.headers.get('X-Effective-Operator-Id');
    
    // Public endpoint - no auth required for checking status
    // (middleware will use this to show maintenance page)
    
    const status = await getMaintenanceStatus();
    
    return NextResponse.json(status);
    
  } catch (error) {
    console.error('Error fetching maintenance status:', error);
    // Fail open - assume not in maintenance mode
    return NextResponse.json({
      is_enabled: false,
      message: '',
      updated_at: new Date().toISOString()
    });
  }
}

/**
 * POST - Toggle maintenance mode (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const operatorId = request.headers.get('X-Effective-Operator-Id');
    const userId = request.headers.get('X-User-Id');
    const roles = JSON.parse(request.headers.get('X-User-Roles') || '[]');
    
    if (!operatorId || !userId) {
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    
    // Only operator_admin can toggle maintenance mode
    if (!roles.includes('operator_admin')) {
      return NextResponse.json(
        { error: { code: 'forbidden', message: 'Only operator_admin can manage maintenance mode' } },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { is_enabled, message } = body;
    
    if (typeof is_enabled !== 'boolean') {
      return NextResponse.json(
        { error: { code: 'validation_failed', message: 'is_enabled (boolean) is required' } },
        { status: 400 }
      );
    }
    
    const now = new Date().toISOString();
    
    // Upsert maintenance mode setting
    const { error: upsertError } = await supabase
      .from('system_settings')
      .upsert({
        setting_key: 'maintenance_mode',
        setting_value: {
          is_enabled,
          message: message || 'We are performing scheduled maintenance. Please check back soon.',
          enabled_by: userId,
          enabled_at: is_enabled ? now : null
        },
        updated_at: now
      }, {
        onConflict: 'setting_key'
      });
    
    if (upsertError) {
      console.error('Failed to update maintenance mode:', upsertError);
      return NextResponse.json(
        { error: { code: 'server_error', message: 'Failed to update maintenance mode' } },
        { status: 500 }
      );
    }
    
    // Clear cache
    maintenanceCache = null;
    
    // Log to audit
    await supabase.from('audit_logs').insert({
      timestamp: now,
      actor_user_id: userId,
      actor_roles: JSON.stringify(roles),
      effective_operator_id: operatorId,
      endpoint: '/api/admin/maintenance-mode',
      method: 'POST',
      event_type: is_enabled ? 'MAINTENANCE_ENABLED' : 'MAINTENANCE_DISABLED',
      resource_type: 'system_setting',
      resource_id: 'maintenance_mode',
      result: 'success',
      metadata: JSON.stringify({ message, enabled_by: userId })
    });
    
    return NextResponse.json({
      success: true,
      is_enabled,
      message: message || 'We are performing scheduled maintenance. Please check back soon.',
      enabled_at: is_enabled ? now : null,
      enabled_by: userId
    });
    
  } catch (error) {
    console.error('Error toggling maintenance mode:', error);
    return NextResponse.json(
      { error: { code: 'server_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// Export for use in middleware
export { getMaintenanceStatus };
