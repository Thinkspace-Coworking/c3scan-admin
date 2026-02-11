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

// POST /api/mobile/v1/images/upload-url
// Generate signed URL for direct upload to Supabase Storage
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

    const body = await request.json()
    const { content_type, filename, operator_id } = body

    // Validate required fields
    if (!content_type || !filename || !operator_id) {
      return NextResponse.json(
        { error: 'content_type, filename, and operator_id required' },
        { status: 400 }
      )
    }

    // Validate operator_id matches token
    if (operator_id !== tokenData.operator_id) {
      return NextResponse.json(
        { error: 'Operator mismatch' },
        { status: 403 }
      )
    }

    // Validate content type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf']
    if (!allowedTypes.includes(content_type)) {
      return NextResponse.json(
        { error: 'Invalid content type. Allowed: ' + allowedTypes.join(', ') },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate unique storage path
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const uniqueId = crypto.randomUUID()
    const fileExt = filename.split('.').pop() || 'jpg'
    const storagePath = `${operator_id}/${timestamp}/${uniqueId}.${fileExt}`

    // Generate signed URL for upload
    // Bucket name: mail-photos
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('mail-photos')
      .createSignedUploadUrl(storagePath)

    if (uploadError) {
      console.error('Upload URL error:', uploadError)
      
      // If bucket doesn't exist, return error with helpful message
      if (uploadError.message?.includes('bucket') || uploadError.message?.includes('not found')) {
        return NextResponse.json(
          { 
            error: 'Storage bucket not configured',
            details: 'Please create the mail-photos bucket in Supabase'
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to create upload URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      upload_url: uploadData.signedUrl,
      storage_path: storagePath,
      token: uploadData.token,
      expires_in: 300, // 5 minutes
      headers: {
        'Content-Type': content_type
      }
    })

  } catch (error) {
    console.error('Upload URL error:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
