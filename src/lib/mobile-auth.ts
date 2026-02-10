import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET!

export interface AuthContext {
  userId: string
  email: string
  operatorId: string
}

/**
 * Verify JWT token from Authorization header
 */
export function verifyAuthToken(request: NextRequest): AuthContext | null {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
    
    if (!decoded.sub || !decoded.email || !decoded.operator_id) {
      return null
    }

    return {
      userId: decoded.sub,
      email: decoded.email,
      operatorId: decoded.operator_id,
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Middleware to protect mobile API routes
 */
export function withAuth(handler: (request: NextRequest, auth: AuthContext) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const auth = verifyAuthToken(request)
    
    if (!auth) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Valid authentication token required' },
        { status: 401 }
      )
    }

    return handler(request, auth)
  }
}
