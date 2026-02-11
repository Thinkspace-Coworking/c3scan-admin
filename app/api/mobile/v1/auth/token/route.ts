import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Simple password validation for mobile scanner staff
// In production, this should use a proper auth system
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Look up user by email and validate password
    // For mobile scanner staff, we use a simple password check
    // In production, integrate with your auth provider
    const { data: userData, error: userError } = await supabase
      .from('user_account')
      .select('user_id, email, display_name, operator_id, user_type')
      .eq('email', email.toLowerCase())
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
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

    // Get user roles to determine permissions
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

    // Generate JWT token
    // In production, use a proper JWT library with expiration
    const token = Buffer.from(JSON.stringify({
      user_id: userData.user_id,
      email: userData.email,
      operator_id: userData.operator_id,
      operator_name: operatorData.operator_name,
      roles: roles?.map(r => r.role_type) || ['scanner'],
      location_ids: roles?.map(r => r.location_id).filter(Boolean) || [],
      iat: Date.now(),
      exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
    })).toString('base64')

    return NextResponse.json({
      access_token: token,
      operator_id: userData.operator_id,
      operator_name: operatorData.operator_name,
      operator_slug: operatorData.slug,
      user: {
        user_id: userData.user_id,
        email: userData.email,
        display_name: userData.display_name,
        user_type: userData.user_type
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
