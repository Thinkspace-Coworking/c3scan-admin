import { NextRequest, NextResponse } from 'next/server';
import { getMaintenanceStatus } from './app/api/admin/maintenance-mode/route';

/**
 * Maintenance Mode Middleware
 * 
 * Blocks customer-facing routes when maintenance mode is enabled.
 * Allows admin routes and API routes to continue functioning.
 */

// Routes that should ALWAYS be accessible (even in maintenance mode)
const ALLOWED_ROUTES = [
  '/admin',           // Admin dashboard
  '/admin/',          // Admin sub-routes
  '/api/admin',       // Admin APIs
  '/api/auth',        // Auth endpoints
  '/_next',           // Next.js assets
  '/favicon',         // Favicon
  '/logo',            // Logo assets
  '/maintenance',     // Maintenance page itself
  '/api/maintenance', // Maintenance status check
];

// Check if request is for allowed route
function isAllowedRoute(pathname: string): boolean {
  return ALLOWED_ROUTES.some(route => 
    pathname.startsWith(route) || pathname === route
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Always allow these routes
  if (isAllowedRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Check if we're in a build/SSG context
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.next();
  }
  
  try {
    // Check maintenance mode status
    const maintenanceStatus = await getMaintenanceStatus();
    
    if (maintenanceStatus.is_enabled) {
      // Redirect to maintenance page
      const maintenanceUrl = new URL('/maintenance', request.url);
      maintenanceUrl.searchParams.set('message', maintenanceStatus.message);
      return NextResponse.redirect(maintenanceUrl);
    }
    
  } catch (error) {
    // Log error but don't block - fail open
    console.error('Maintenance check failed:', error);
  }
  
  // Not in maintenance mode, continue normally
  return NextResponse.next();
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
