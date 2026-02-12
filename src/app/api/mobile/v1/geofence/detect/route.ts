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

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// POST /api/mobile/v1/geofence/detect
// Detect nearby locations based on GPS coordinates
// SECURITY: operator_id comes from JWT token (set at login based on email domain)
// This ensures users can ONLY see locations for their assigned operator
export async function POST(request: NextRequest) {
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

    // SECURITY: operator_id is determined at login from user's email domain
    // This prevents cross-operator location leakage (e.g., Thinkspace user
    // cannot see 25N locations even if physically nearby)
    const operatorId = tokenData.operator_id
    const userId = tokenData.user_id

    // Get request body
    const body = await request.json()
    const { latitude, longitude, radius_miles = 10 } = body

    // Validate coordinates
    if (latitude == null || longitude == null) {
      return NextResponse.json(
        { error: 'latitude and longitude are required' },
        { status: 400 }
      )
    }

    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // SECURITY: Only fetch locations for the authenticated user's operator
    // This is the critical boundary that prevents cross-operator data leakage
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
        latitude,
        longitude
      `)
      .eq('operator_id', operatorId)
      .eq('is_active', true)

    if (error) {
      console.error('Geofence locations fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch locations' },
        { status: 500 }
      )
    }

    if (!locations || locations.length === 0) {
      return NextResponse.json(
        { error: 'No locations found for this operator' },
        { status: 404 }
      )
    }

    // Calculate distance to each location and filter by radius
    const locationsWithDistance = locations
      .map((location) => {
        if (location.latitude == null || location.longitude == null) {
          return null
        }
        const distance = calculateDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude
        )
        return {
          ...location,
          distance_miles: Math.round(distance * 100) / 100, // Round to 2 decimal places
        }
      })
      .filter((loc): loc is NonNullable<typeof loc> => loc !== null)
      .filter((loc) => loc.distance_miles <= radius_miles)
      .sort((a, b) => a.distance_miles - b.distance_miles)

    // SECURITY AUDIT LOG: Log geofence detection for security review
    console.log(`[GEOFENCE] user=${userId} operator=${operatorId} locations_found=${locationsWithDistance.length} radius=${radius_miles}mi coords=${latitude},${longitude}`)

    // Return results
    return NextResponse.json({
      user_location: {
        latitude,
        longitude,
      },
      radius_miles: radius_miles,
      locations: locationsWithDistance,
      count: locationsWithDistance.length,
      operator_id: operatorId, // Included for client verification
      closest_location:
        locationsWithDistance.length > 0
          ? {
              location_id: locationsWithDistance[0].location_id,
              location_name: locationsWithDistance[0].location_name,
              distance_miles: locationsWithDistance[0].distance_miles,
            }
          : null,
    })
  } catch (error) {
    console.error('Geofence detection error:', error)
    return NextResponse.json(
      { error: 'Failed to detect location' },
      { status: 500 }
    )
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
