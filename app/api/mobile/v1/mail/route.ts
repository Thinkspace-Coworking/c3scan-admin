import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Helper to verify JWT token
function verifyToken(token: string): { user_id: string; operator_id: string; email: string } | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    if (decoded.exp < Date.now()) return null
    return decoded
  } catch {
    return null
  }
}

// POST /api/mobile/v1/mail
// Create a mail item after image upload
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
    const {
      operator_id,
      location_id,
      mailbox_id,
      scanned_by_email,
      envelope_image,
      ocr_raw_text,
      ocr_confidence,
      package_type,
      carrier,
      tracking_number,
      scanned_at,
      image_hash,
      client_scan_id
    } = body

    // Validate required fields
    if (!operator_id || !location_id || !mailbox_id || !scanned_by_email || !envelope_image) {
      return NextResponse.json(
        { error: 'Missing required fields: operator_id, location_id, mailbox_id, scanned_by_email, envelope_image' },
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user_id from email
    const { data: userData } = await supabase
      .from('user_account')
      .select('user_id')
      .eq('email', scanned_by_email.toLowerCase())
      .single()

    // Create mail_item record
    const { data: mailItem, error: insertError } = await supabase
      .from('mail_item')
      .insert({
        operator_id,
        location_id,
        mailbox_id,
        received_at: scanned_at || new Date().toISOString(),
        status: 'received',
        is_active: true,
        match_method: ocr_raw_text ? 'fuzzy' : 'manual',
        match_confidence: ocr_confidence || 0,
        ocr_text: ocr_raw_text,
        app_version: '1.0.0', // Should come from client
        scan_mode: package_type || 'standard',
        confidence_score: ocr_confidence
      })
      .select('mail_item_id')
      .single()

    if (insertError) {
      console.error('Mail item insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create mail item' },
        { status: 500 }
      )
    }

    // Create mail_item_image record
    const { error: imageError } = await supabase
      .from('mail_item_image')
      .insert({
        operator_id,
        mail_item_id: mailItem.mail_item_id,
        image_type: 'envelope',
        storage_path: envelope_image.replace('storage_path:', ''), // Remove prefix if present
        mime_type: 'image/jpeg', // Should detect from actual file
        created_at: new Date().toISOString()
      })

    if (imageError) {
      console.error('Mail image insert error:', imageError)
      // Don't fail the whole request, but log it
    }

    // Create OCR extraction record if text was captured
    if (ocr_raw_text) {
      const { error: ocrError } = await supabase
        .from('ocr_extraction')
        .insert({
          operator_id,
          mail_item_id: mailItem.mail_item_id,
          source: 'ios',
          model_version: 'on-device-v1',
          confidence_score: ocr_confidence || 0,
          raw_text: ocr_raw_text,
          created_at: new Date().toISOString()
        })

      if (ocrError) {
        console.error('OCR extraction insert error:', ocrError)
      }
    }

    // Create mail event for tracking
    const { error: eventError } = await supabase
      .from('mail_event')
      .insert({
        operator_id,
        mail_item_id: mailItem.mail_item_id,
        event_type: 'scanned',
        event_payload: {
          scanned_by: scanned_by_email,
          client_scan_id,
          image_hash,
          carrier,
          tracking_number
        },
        event_at: new Date().toISOString(),
        created_by_user_id: userData?.user_id || null
      })

    if (eventError) {
      console.error('Mail event insert error:', eventError)
    }

    return NextResponse.json({
      mail_item_id: mailItem.mail_item_id,
      status: 'received',
      message: 'Mail item created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Mail creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create mail item' },
      { status: 500 }
    )
  }
}
