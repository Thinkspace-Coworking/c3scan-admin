import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Combined Middleware: Operator Context + Maintenance Mode
 * 
 * 1. Maintenance Mode: Blocks customer routes when enabled
 * 2. Operator Context: Resolves effective_operator_id per ACC v1.0
 */

// Maintenance mode cache
let maintenanceCache: { isEnabled: boolean; message: string; updatedAt: number } | null = null;
const MAINTENANCE_CACHE_TTL = 30000; // 30 seconds

async function checkMaintenanceMode(): Promise<{ is_enabled: boolean; message: string }> {
  // Check cache
  if (maintenanceCache && Date.now() - maintenanceCache.updatedAt < MAINTENANCE_CACHE_TTL) {
    return { is_enabled: maintenanceCache.isEnabled, message: maintenanceCache.message };
  }
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', 'maintenance_mode')
      .single();
    
    const parsed = data?.setting_value as { is_enabled?: boolean; message?: string } | null;
    const result = {
      is_enabled: parsed?.is_enabled || false,
      message: parsed?.message || 'We are performing scheduled maintenance. Please check back soon.'
    };
    
    // Update cache
    maintenanceCache = {
      isEnabled: result.is_enabled,
      message: result.message,
      updatedAt: Date.now()
    };
    
    return result;
  } catch {
    // Fail open
    return { is_enabled: false, message: '' };
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Paths that don't require operator context (platform endpoints)
const PLATFORM_PATHS = [
  '/api/platform/',
  '/api/health',
  '/api/auth/detect-provider',
  '/api/auth/callback',
  '/api/auth/emergency-login',
  '/_next/',
  '/static/',
  '/favicon.ico',
  '/maintenance',
  '/api/admin/maintenance-mode',
];

// Paths that are publicly accessible
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/invite/',
  '/confirm-email',
  '/api/auth/',
];

interface JWTPayload {
  sub: string;  // Cognito sub
  'custom:user_id'?: string;
  'custom:roles'?: string | string[];
  'custom:operator_id'?: string;
  'custom:location_ids'?: string | string[];
  email?: string;
  exp?: number;
}

interface OperatorContext {
  userId: string;
  cognitoSub: string;
  roles: string[];
  effectiveOperatorId: string;
  locationIds?: string[];
  isPlatformAdmin: boolean;
}

/**
 * Check if path should skip operator context resolution
 */
function shouldSkipContextResolution(pathname: string): boolean {
  // Skip platform endpoints
  if (PLATFORM_PATHS.some(p => pathname.startsWith(p))) {
    return true;
  }
  
  // Skip public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return true;
  }
  
  // Skip Next.js internals
  if (pathname.startsWith('/_next/') || pathname.startsWith('/static/')) {
    return true;
  }
  
  return false;
}

/**
 * Parse roles from JWT (handles both string and array)
 */
function parseRoles(rolesClaim: string | string[] | undefined): string[] {
  if (!rolesClaim) return [];
  
  if (Array.isArray(rolesClaim)) {
    return rolesClaim;
  }
  
  // Try parsing as JSON array
  try {
    const parsed = JSON.parse(rolesClaim);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Not JSON, treat as comma-separated or single value
  }
  
  // Handle comma-separated or single role
  return rolesClaim.split(',').map(r => r.trim()).filter(Boolean);
}

/**
 * Parse location_ids from JWT
 */
function parseLocationIds(locationIdsClaim: string | string[] | undefined): string[] | undefined {
  if (!locationIdsClaim) return undefined;
  
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
 * Decode JWT without verification (for extracting claims)
 * Note: Full validation happens at API boundaries
 */
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract token from request
 */
function extractToken(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check cookie
  const cookie = request.cookies.get('c3scan_session')?.value;
  if (cookie) {
    try {
      const session = JSON.parse(cookie);
      return session.idToken || session.accessToken || null;
    } catch {
      return null;
    }
  }
  
  return null;
}

/**
 * Create error response per ACC v1.0 error contract
 */
function createErrorResponse(
  code: string,
  message: string,
  status: number = 403
): NextResponse {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        request_id: crypto.randomUUID(),
      },
    },
    { status }
  );
}

/**
 * Check if route should bypass maintenance mode (admin routes)
 */
function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') || 
         pathname.startsWith('/api/admin') ||
         pathname.startsWith('/api/auth');
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  
  // Check maintenance mode FIRST (before auth checks)
  // Allow admin routes to bypass maintenance mode
  if (!isAdminRoute(pathname) && !shouldSkipContextResolution(pathname)) {
    const maintenance = await checkMaintenanceMode();
    
    if (maintenance.is_enabled) {
      // Redirect to maintenance page
      const maintenanceUrl = new URL('/maintenance', request.url);
      if (maintenance.message) {
        maintenanceUrl.searchParams.set('message', maintenance.message);
      }
      return NextResponse.redirect(maintenanceUrl);
    }
  }
  
  // Skip context resolution for certain paths
  if (shouldSkipContextResolution(pathname)) {
    return NextResponse.next();
  }
  
  // Extract JWT
  const token = extractToken(request);
  if (!token) {
    // Not authenticated - let the request proceed to be handled by auth guards
    // This allows unauthenticated requests to reach public endpoints
    return NextResponse.next();
  }
  
  // Decode JWT to get claims
  const claims = decodeJWT(token);
  if (!claims) {
    return createErrorResponse('UNAUTHENTICATED', 'Invalid token format', 401);
  }
  
  // Check expiration
  if (claims.exp && claims.exp < Math.floor(Date.now() / 1000)) {
    return createErrorResponse('UNAUTHENTICATED', 'Token expired', 401);
  }
  
  // Parse roles
  const roles = parseRoles(claims['custom:roles']);
  const isPlatformAdmin = roles.includes('platform_admin');
  
  // ACC v1.0 Section 3: Operator Context Resolution
  let effectiveOperatorId: string | undefined;
  
  // Case 1: Token has custom:operator_id
  if (claims['custom:operator_id']) {
    effectiveOperatorId = claims['custom:operator_id'];
    
    // Check for conflict: operator-scoped token with X-Operator-Id header
    const requestedOperatorId = request.headers.get('X-Operator-Id');
    if (requestedOperatorId && requestedOperatorId !== effectiveOperatorId) {
      return createErrorResponse(
        'OPERATOR_CONTEXT_CONFLICT',
        'Operator-scoped token cannot override operator context',
        403
      );
    }
  }
  // Case 2: Platform admin (no operator_id in token)
  else if (isPlatformAdmin) {
    const requestedOperatorId = request.headers.get('X-Operator-Id');
    
    if (!requestedOperatorId) {
      return createErrorResponse(
        'OPERATOR_CONTEXT_REQUIRED',
        'Platform admin must provide X-Operator-Id header',
        403
      );
    }
    
    // Validate the operator exists
    const { data: operator, error } = await supabase
      .from('operators')
      .select('operator_id, is_active')
      .eq('operator_id', requestedOperatorId)
      .single();
    
    if (error || !operator) {
      return createErrorResponse('OPERATOR_NOT_FOUND', 'Operator not found', 404);
    }
    
    if (!operator.is_active) {
      return createErrorResponse('OPERATOR_NOT_FOUND', 'Operator is inactive', 404);
    }
    
    effectiveOperatorId = requestedOperatorId;
  }
  // Case 3: No operator context
  else {
    return createErrorResponse(
      'OPERATOR_CONTEXT_REQUIRED',
      'Operator context required but not found in token',
      403
    );
  }
  
  // Parse location_ids for location_staff
  const locationIds = parseLocationIds(claims['custom:location_ids']);
  
  // Build operator context
  const context: OperatorContext = {
    userId: claims['custom:user_id'] || claims.sub,
    cognitoSub: claims.sub,
    roles,
    effectiveOperatorId,
    locationIds,
    isPlatformAdmin,
  };
  
  // Clone request headers and add context
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('X-Effective-Operator-Id', effectiveOperatorId);
  requestHeaders.set('X-User-Id', context.userId);
  requestHeaders.set('X-User-Roles', JSON.stringify(roles));
  requestHeaders.set('X-Is-Platform-Admin', String(isPlatformAdmin));
  
  if (locationIds) {
    requestHeaders.set('X-User-Location-Ids', JSON.stringify(locationIds));
  }
  
  // Continue with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Configure middleware matcher
 */
export const config = {
  matcher: [
    // Match all API routes except auth
    '/api/:path((?!auth/).*)',
    // Match all admin routes
    '/admin/:path*',
    // Match all app routes
    '/app/:path*',
  ],
};
