import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET!

/**
 * POST /api/mobile/v1/auth/google
 * 
 * Google OAuth authentication for employee scanner app.
 * Verifies Google ID token, resolves operator via email domain.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id_token, device_info } = body

    // Validate required fields
    if (!id_token) {
      return NextResponse.json(
        { error: 'missing_id_token', message: 'Google ID token is required' },
        { status: 400 }
      )
    }

    // Verify Google ID token
    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
    )

    if (!googleResponse.ok) {
      return NextResponse.json(
        { error: 'invalid_token', message: 'Invalid Google ID token' },
        { status: 401 }
      )
    }

    const googleData = await googleResponse.json()
    const email = googleData.email
    const name = googleData.name || ''
    const picture = googleData.picture || ''

    if (!email) {
      return NextResponse.json(
        { error: 'missing_email', message: 'Email not found in Google token' },
        { status: 401 }
      )
    }

    // Extract domain and lookup operator
    const emailDomain = email.split('@')[1]
    
    const { data: operator, error: operatorError } = await supabase
      .from('operator')
      .select('operator_id, operator_name, email_domain')
      .eq('email_domain', emailDomain)
      .single()

    if (operatorError || !operator) {
      return NextResponse.json(
        { error: 'domain_not_found', message: 'No operator found for this email domain' },
        { status: 403 }
      )
    }

    // Get locations for operator
    const { data: locations, error: locationsError } = await supabase
      .from('location')
      .select('location_id, location_name, latitude, longitude, address_line1, city, state, postal_code')
      .eq('operator_id', operator.operator_id)
      .eq('is_active', true)

    if (locationsError) {
      console.error('Failed to fetch locations:', locationsError)
    }

    // Create or update user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        name,
        picture,
        operator_id: operator.operator_id,
      },
    })

    let userId = authData?.user?.id

    // If user already exists, get their ID
    if (authError?.message?.includes('already been registered')) {
      const { data: existingUser } = await supabase.auth.admin.listUsers()
      const foundUser = existingUser?.users?.find(u => u.email === email)
      userId = foundUser?.id
    } else if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'auth_failed', message: 'Failed to create or find user' },
        { status: 500 }
      )
    }

    // Generate signed JWT
    const tokenPayload = {
      sub: userId,
      email,
      operator_id: operator.operator_id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    }

    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { algorithm: 'HS256' })
    const refreshToken = jwt.sign(
      { sub: userId, type: 'refresh', iat: Math.floor(Date.now() / 1000) },
      JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '7d' }
    )

    return NextResponse.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 86400,
      user: {
        email,
        name,
        picture,
      },
      operator: {
        operator_id: operator.operator_id,
        operator_name: operator.operator_name,
        email_domain: operator.email_domain,
      },
      locations: locations || [],
      biometric_enabled: true,
    })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}
