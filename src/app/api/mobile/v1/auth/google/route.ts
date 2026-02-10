import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    // Generate JWT for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createUser({
      email,
      user_metadata: {
        operator_id: operator.operator_id,
        locations: locations || [],
      },
    })

    // Create a session token
    const { data: jwtData, error: jwtError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/mobile/auth/callback`,
      },
    })

    // For now, create a simple JWT payload
    const tokenPayload = {
      sub: userId,
      email,
      operator_id: operator.operator_id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    }

    // Note: In production, use a proper JWT library with signing
    const accessToken = Buffer.from(JSON.stringify(tokenPayload)).toString('base64')

    return NextResponse.json({
      access_token: accessToken,
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
      biometric_enabled: true, // iOS can enable Face ID/Touch ID
    })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}
