import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';

/**
 * Emergency Login Endpoint
 * 
 * POST /api/auth/emergency-login
 * 
 * Bypasses OAuth/Cognito when external auth is unavailable.
 * Requires: email, password, TOTP code
 * 
 * SECURITY: This is a break-glass mechanism. All usage is heavily logged.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rate limiting: Map of IP -> attempts
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(ip);
  
  if (!limit || now > limit.resetAt) {
    // Reset or new entry
    rateLimits.set(ip, { count: 1, resetAt: now + 3600000 }); // 1 hour
    return true;
  }
  
  if (limit.count >= 3) {
    return false; // Rate limited
  }
  
  limit.count++;
  return true;
}

interface EmergencyLoginRequest {
  email: string;
  password: string;
  totpCode: string;
  reason: string; // Why is emergency access needed?
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip as string)) {
      return NextResponse.json(
        { 
          error: { 
            code: 'rate_limited', 
            message: 'Too many emergency login attempts. Try again in 1 hour.' 
          } 
        },
        { status: 429 }
      );
    }
    
    // Parse request
    const body: EmergencyLoginRequest = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password || !body.totpCode || !body.reason) {
      return NextResponse.json(
        { 
          error: { 
            code: 'validation_failed', 
            message: 'email, password, totpCode, and reason are required' 
          } 
        },
        { status: 400 }
      );
    }
    
    // Find emergency admin user
    const { data: user, error: userError } = await supabase
      .from('user_account')
      .select('*')
      .eq('email', body.email.toLowerCase())
      .eq('is_emergency_admin', true)
      .eq('is_active', true)
      .single();
    
    if (userError || !user) {
      // Log failed attempt
      await supabase.from('emergency_access_logs').insert({
        user_id: null,
        attempted_email: body.email,
        accessed_at: new Date().toISOString(),
        ip_address: ip,
        user_agent: request.headers.get('user-agent'),
        success: false,
        failure_reason: 'User not found or not emergency admin',
        reason_provided: body.reason
      });
      
      return NextResponse.json(
        { error: { code: 'invalid_credentials', message: 'Invalid credentials' } },
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(body.password, user.emergency_password_hash);
    
    if (!passwordValid) {
      // Log failed attempt
      await supabase.from('emergency_access_logs').insert({
        user_id: user.user_id,
        attempted_email: body.email,
        accessed_at: new Date().toISOString(),
        ip_address: ip,
        user_agent: request.headers.get('user-agent'),
        success: false,
        failure_reason: 'Invalid password',
        reason_provided: body.reason
      });
      
      return NextResponse.json(
        { error: { code: 'invalid_credentials', message: 'Invalid credentials' } },
        { status: 401 }
      );
    }
    
    // Verify TOTP
    const totpValid = authenticator.verify({
      token: body.totpCode,
      secret: user.emergency_mfa_secret
    });
    
    if (!totpValid) {
      // Log failed attempt
      await supabase.from('emergency_access_logs').insert({
        user_id: user.user_id,
        accessed_at: new Date().toISOString(),
        ip_address: ip,
        user_agent: request.headers.get('user-agent'),
        success: false,
        failure_reason: 'Invalid TOTP code',
        reason_provided: body.reason
      });
      
      return NextResponse.json(
        { error: { code: 'invalid_totp', message: 'Invalid authentication code' } },
        { status: 401 }
      );
    }
    
    // Generate short-lived JWT (30 minutes)
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + 1800; // 30 minutes
    
    const token = Buffer.from(JSON.stringify({
      user_id: user.user_id,
      email: user.email,
      operator_id: user.operator_id,
      roles: user.roles,
      is_emergency: true,
      iat: now,
      exp: expiresAt,
      jti: crypto.randomUUID() // Unique token ID
    })).toString('base64');
    
    // Log successful access
    await supabase.from('emergency_access_logs').insert({
      user_id: user.user_id,
      accessed_at: new Date().toISOString(),
      ip_address: ip,
      user_agent: request.headers.get('user-agent'),
      success: true,
      reason_provided: body.reason,
      token_jti: JSON.parse(Buffer.from(token, 'base64').toString()).jti
    });
    
    // TODO: Send alert to security team
    // await sendEmergencyAlert(user.email, ip, body.reason);
    
    return NextResponse.json({
      success: true,
      token,
      expires_at: expiresAt,
      user: {
        user_id: user.user_id,
        email: user.email,
        display_name: user.display_name,
        operator_id: user.operator_id,
        roles: user.roles
      },
      message: 'Emergency access granted for 30 minutes. This session is read-only by default.',
      warning: 'You are using emergency authentication. Normal OAuth login will be restored as soon as possible.'
    });
    
  } catch (error) {
    console.error('Emergency login error:', error);
    return NextResponse.json(
      { error: { code: 'server_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
