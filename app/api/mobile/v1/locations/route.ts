import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Helper to verify JWT token
function verifyToken(token: string): { user_id: string; operator_id: string } | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    if (decoded.exp < Date.now()) return null
    return decoded
  } catch {
    return null
  }
}

// GET /api/mobile/v1/locations?operator_id={uuid}
// Get all active locations for an operator
export async function GET(request: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const tokenData = verifyToken(token)

    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get query params
    const { searchParams } = new URL(request.url)
    const operatorId = searchParams.get('operator_id')

    // Validate operator_id matches token
    if (operatorId !== tokenData.operator_id) {
      return NextResponse.json(
        { error: 'Operator mismatch' },
        { status: 403 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch locations
    const { data: locations, error } = await supabase
      .from('location')
      .select(`
        location_id,
        location_name,
        address_line1,
        address_line2,
        city,
        state_province,
        postal_code,
        country_code,
        property_id,
        is_active
      `)
      .eq('operator_id', operatorId)
      .eq('is_active', true)
      .order('location_name')

    if (error) {
      console.error('Locations fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch locations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      locations: locations || [],
      count: locations?.length || 0
    })

  } catch (error) {
    console.error('Locations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}
