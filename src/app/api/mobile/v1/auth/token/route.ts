import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Google OAuth token verification
async function verifyGoogleToken(idToken: string): Promise<{ email: string; name: string; sub: string } | null> {
  try {
    // Verify with Google's tokeninfo endpoint
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`)
    if (!response.ok) return null
    
    const data = await response.json()
    
    // Validate required fields
    if (!data.email || !data.sub) return null
    
    // Optional: verify client_id matches your Google OAuth client
    // if (data.aud !== process.env.GOOGLE_CLIENT_ID) return null
    
    return {
      email: data.email,
      name: data.name || '',
      sub: data.sub // Google's unique user ID
    }
  } catch (error) {
    console.error('Google token verification error:', error)
    return null
  }
}

// POST /api/mobile/v1/auth/token
// Mobile auth with Google OAuth
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      id_token,      // Google ID token from iOS
      provider,      // "google"
      operator_id,   // From app config
      location_id    // Selected location
    } = body

    if (!id_token || provider !== 'google') {
      return NextResponse.json(
        { error: 'id_token and provider (google) required' },
        { status: 400 }
      )
    }

    // Verify Google token
    const googleUser = await verifyGoogleToken(id_token)
    if (!googleUser) {
      return NextResponse.json(
        { error: 'Invalid Google token' },
        { status: 401 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Look up user by email in user_account table
    const { data: userData, error: userError } = await supabase
      .from('user_account')
      .select('user_id, email, display_name, operator_id, user_type, is_active')
      .eq('email', googleUser.email.toLowerCase())
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found. Please contact your administrator.' },
        { status: 404 }
      )
    }

    if (!userData.is_active) {
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 403 }
      )
    }

    // Validate operator_id if provided
    if (operator_id && userData.operator_id !== operator_id) {
      return NextResponse.json(
        { error: 'Operator mismatch' },
        { status: 403 }
      )
    }

    // Get operator details
    const { data: operatorData, error: operatorError } = await supabase
      .from('operator')
      .select('operator_id, operator_name, slug, email_domain')
      .eq('operator_id', userData.operator_id)
      .single()

    if (operatorError || !operatorData) {
      return NextResponse.json(
        { error: 'Operator not found' },
        { status: 404 }
      )
    }

    // Get locations for this operator
    const { data: locations, error: locationsError } = await supabase
      .from('location')
      .select('location_id, location_name, property_id')
      .eq('operator_id', userData.operator_id)
      .eq('is_active', true)

    if (locationsError) {
      return NextResponse.json(
        { error: 'Failed to fetch locations' },
        { status: 500 }
      )
    }

    // Get user roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_role')
      .select('role_type, location_id')
      .eq('user_id', userData.user_id)
      .eq('is_active', true)

    if (rolesError) {
      return NextResponse.json(
        { error: 'Failed to fetch roles' },
        { status: 500 }
      )
    }

    // Generate JWT for subsequent API calls
    const tokenPayload = {
      user_id: userData.user_id,
      email: userData.email,
      name: userData.display_name || googleUser.name,
      operator_id: userData.operator_id,
      operator_name: operatorData.operator_name,
      roles: roles?.map(r => r.role_type) || ['scanner'],
      location_ids: roles?.map(r => r.location_id).filter(Boolean) || [],
      google_sub: googleUser.sub,
      iat: Date.now(),
      exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
    }

    const accessToken = Buffer.from(JSON.stringify(tokenPayload)).toString('base64')

    // Return auth response
    return NextResponse.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 30 * 24 * 60 * 60, // 30 days in seconds
      user: {
        user_id: userData.user_id,
        email: userData.email,
        display_name: userData.display_name || googleUser.name,
        user_type: userData.user_type
      },
      operator: {
        operator_id: operatorData.operator_id,
        operator_name: operatorData.operator_name,
        slug: operatorData.slug
      },
      locations: locations || []
    })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
