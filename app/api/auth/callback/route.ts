import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * OAuth Callback Handler
 * 
 * Handles the callback from Cognito after user authentication.
 * Exchanges authorization code for tokens, validates them,
 * and creates/updates the user in c3scan database.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CognitoTokenResponse {
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface CognitoIdTokenClaims {
  sub: string;  // Cognito UUID (maps to cognito_sub)
  email: string;
  email_verified: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  identities?: Array<{
    userId: string;
    providerName: string;
    providerType: string;
  }>;
  // ACC v1.0 Claims (set by pre-token generation lambda or post-auth hook)
  'custom:user_id'?: string;
  'custom:roles'?: string | string[];
  'custom:operator_id'?: string;
  'custom:location_ids'?: string | string[];
  'custom:auth_provider'?: string;
  iat: number;
  exp: number;
}

/**
 * Exchange authorization code for tokens with Cognito
 */
async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<CognitoTokenResponse> {
  const tokenUrl = `https://${process.env.COGNITO_DOMAIN}/oauth2/token`;
  
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.COGNITO_CLIENT_ID!,
    code,
    redirect_uri: redirectUri
  });
  
  // Add client secret if using confidential client
  if (process.env.COGNITO_CLIENT_SECRET) {
    params.append('client_secret', process.env.COGNITO_CLIENT_SECRET);
  }
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Token exchange failed:', error);
    throw new Error(`Token exchange failed: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Validate ID token and extract claims
 * Note: In production, also verify the token signature using JWKS
 */
function validateAndDecodeIdToken(idToken: string): CognitoIdTokenClaims {
  // Split JWT into parts
  const parts = idToken.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }
  
  // Decode payload (base64url)
  const payload = JSON.parse(
    Buffer.from(parts[1], 'base64url').toString('utf-8')
  );
  
  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new Error('Token expired');
  }
  
  // Verify audience (optional but recommended)
  if (payload.aud !== process.env.COGNITO_CLIENT_ID) {
    throw new Error('Invalid token audience');
  }
  
  return payload;
}

/**
 * Parse roles from JWT claims (handles string or array)
 */
function parseRoles(rolesClaim: string | string[] | undefined): string[] {
  if (!rolesClaim) return ['member']; // Default role
  
  if (Array.isArray(rolesClaim)) {
    return rolesClaim;
  }
  
  try {
    // Try parsing as JSON array
    const parsed = JSON.parse(rolesClaim);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Not JSON, treat as comma-separated or single value
  }
  
  return rolesClaim.split(',').map(r => r.trim()).filter(Boolean);
}

/**
 * Parse location_ids from JWT claims
 */
function parseLocationIds(locationIdsClaim: string | string[] | undefined): string[] {
  if (!locationIdsClaim) return [];
  
  if (Array.isArray(locationIdsClaim)) {
    return locationIdsClaim;
  }
  
  try {
    const parsed = JSON.parse(locationIdsClaim);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Not JSON
  }
  
  return locationIdsClaim.split(',').map(id => id.trim()).filter(Boolean);
}

/**
 * Lookup or create user in c3scan database
 * Uses new schema with ACC v1.0 claims
 */
async function syncUserWithDatabase(
  claims: CognitoIdTokenClaims,
  operatorId: string
): Promise<{ userId: string; roles: string[] }> {
  const email = claims.email.toLowerCase();
  const cognitoSub = claims.sub;
  
  // Parse roles from JWT claims (ACC v1.0: custom:roles)
  const roles = parseRoles(claims['custom:roles']);
  const locationIds = parseLocationIds(claims['custom:location_ids']);
  const authProvider = claims['custom:auth_provider'] || 
                       claims.identities?.[0]?.providerName || 
                       'Cognito';
  
  // Try to find existing user by Cognito sub
  let { data: user, error: userError } = await supabase
    .from('user_account')
    .select('user_id, email, roles, operator_id, cognito_sub')
    .eq('cognito_sub', cognitoSub)
    .single();
  
  if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows
    throw userError;
  }
  
  // If not found by Cognito sub, try by email within operator
  if (!user) {
    const { data: userByEmail, error: emailError } = await supabase
      .from('user_account')
      .select('user_id, email, roles, operator_id, cognito_sub')
      .eq('email', email)
      .eq('operator_id', operatorId)
      .single();
    
    if (emailError && emailError.code !== 'PGRST116') {
      throw emailError;
    }
    
    if (userByEmail) {
      user = userByEmail;
      
      // Update user with Cognito info if not set
      if (!userByEmail.cognito_sub) {
        await supabase
          .from('user_account')
          .update({
            cognito_sub: cognitoSub,
            auth_provider: authProvider,
            roles: JSON.stringify(roles),
            location_ids: locationIds,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userByEmail.user_id);
      }
    }
  }
  
  // Create new user if not found
  if (!user) {
    // Create user with ACC v1.0 schema
    const { data: newUser, error: createError } = await supabase
      .from('user_account')
      .insert({
        email,
        cognito_sub: cognitoSub,
        operator_id: operatorId,
        roles: JSON.stringify(roles),
        location_ids: locationIds,
        auth_provider: authProvider,
        display_name: claims.name || `${claims.given_name || ''} ${claims.family_name || ''}`.trim(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('user_id, roles')
      .single();
    
    if (createError) {
      throw createError;
    }
    
    user = newUser;
    
    // Also create user_identity record
    await supabase
      .from('user_identities')
      .insert({
        user_id: newUser.user_id,
        provider_type: authProvider.toLowerCase(),
        provider_user_id: cognitoSub,
        provider_email: email,
        is_primary: true,
        created_at: new Date().toISOString(),
        last_used_at: new Date().toISOString()
      });
    
    // Sync to user_role table for backward compatibility
    for (const role of roles) {
      await supabase
        .from('user_role')
        .insert({
          user_id: newUser.user_id,
          operator_id: operatorId,
          role_type: role,
          is_active: true,
          created_at: new Date().toISOString()
        });
    }
  }
  
  // Parse roles if stored as JSON string
  const userRoles = typeof user.roles === 'string' 
    ? JSON.parse(user.roles) 
    : user.roles || [];
  
  return { userId: user.user_id, roles: userRoles };
}

/**
 * Determine redirect path based on user roles (ACC v1.0)
 */
function getRedirectPath(roles: string[], operatorSlug: string): string {
  // Check for staff roles first
  const staffRoles = ['platform_admin', 'operator_admin', 'operator_staff', 'compliance_reviewer', 'billing_admin', 'location_staff'];
  const hasStaffRole = roles.some(role => staffRoles.includes(role));
  
  if (hasStaffRole) {
    return '/admin'; // Staff go to admin portal
  }
  
  // Default: customers go to customer portal
  return '/app/select-mailbox';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        `/login?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`
      );
    }
    
    // Validate required parameters
    if (!code) {
      return NextResponse.redirect('/login?error=no_code');
    }
    
    // TODO: Validate state parameter (CSRF protection)
    // const cookieStore = cookies();
    // const savedState = cookieStore.get('oauth_state')?.value;
    // if (!state || state !== savedState) {
    //   return NextResponse.redirect('/login?error=invalid_state');
    // }
    
    // Get operator from hostname
    const hostname = request.headers.get('host') || 'localhost';
    const protocol = hostname === 'localhost' ? 'http' : 'https';
    const redirectUri = `${protocol}://${hostname}/auth/callback`;
    
    // Get operator details
    const operatorSlug = hostname.split('.')[0].replace(/^c3scan\./, '');
    const { data: operator } = await supabase
      .from('operators')
      .select('operator_id, slug')
      .eq('slug', operatorSlug)
      .single();
    
    if (!operator) {
      return NextResponse.redirect('/login?error=operator_not_found');
    }
    
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, redirectUri);
    
    // Validate and decode ID token
    const claims = validateAndDecodeIdToken(tokens.id_token);
    
    // Verify email is verified
    if (!claims.email_verified) {
      return NextResponse.redirect('/login?error=email_not_verified');
    }
    
    // Sync user with c3scan database
    const { userId, roles } = await syncUserWithDatabase(claims, operator.operator_id);
    
    // Create c3scan session
    // Note: In production, you might want to create your own JWT
    // For now, we'll store the Cognito tokens and user info in cookies
    const sessionData = {
      userId,
      email: claims.email,
      roles,
      operatorId: operator.operator_id,
      cognitoSub: claims.sub,
      authProvider: claims.identities?.[0]?.providerName || 'Cognito',
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000)
    };
    
    // Determine redirect based on roles (ACC v1.0)
    const redirectPath = getRedirectPath(roles, operator.slug);
    
    // Create response with redirect
    const response = NextResponse.redirect(redirectPath);
    
    // Set session cookie (httpOnly, secure, sameSite)
    // Note: In production, use a proper session store (Redis, etc.)
    response.cookies.set('c3scan_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });
    
    // Clear OAuth state cookie
    response.cookies.delete('oauth_state');
    
    return response;
    
  } catch (error) {
    console.error('Auth callback error:', error);
    
    // Determine error message
    let errorMessage = 'auth_failed';
    if (error instanceof Error) {
      if (error.message.includes('Token expired')) {
        errorMessage = 'token_expired';
      } else if (error.message.includes('Invalid')) {
        errorMessage = 'invalid_token';
      }
    }
    
    return NextResponse.redirect(`/login?error=${errorMessage}`);
  }
}

/**
 * POST handler for token refresh
 * Can be used to refresh the access token using the refresh token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refresh_token } = body;
    
    if (!refresh_token) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 400 }
      );
    }
    
    // Exchange refresh token for new tokens
    const tokenUrl = `https://${process.env.COGNITO_DOMAIN}/oauth2/token`;
    
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.COGNITO_CLIENT_ID!,
      refresh_token
    });
    
    if (process.env.COGNITO_CLIENT_SECRET) {
      params.append('client_secret', process.env.COGNITO_CLIENT_SECRET);
    }
    
    const cognitoResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    
    if (!cognitoResponse.ok) {
      const error = await cognitoResponse.text();
      console.error('Token refresh failed:', error);
      return NextResponse.json(
        { error: 'Token refresh failed' },
        { status: 401 }
      );
    }
    
    const tokens = await cognitoResponse.json();
    
    return NextResponse.json({
      access_token: tokens.access_token,
      id_token: tokens.id_token,
      expires_in: tokens.expires_in
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
