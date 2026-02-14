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
// Create a mail item in staging table (no constraints) for post-processing
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
      mailbox_id,        // This is the PMB string (e.g., "1614")
      mailbox_pmb,       // Alternative field name
      scanned_by_email,
      envelope_image,
      ocr_raw_text,
      ocr_confidence,
      package_type,
      carrier,
      tracking_number,
      scanned_at,
      image_hash,
      client_scan_id,
      company_id,        // Company identifier
      company_name       // Company name for reference
    } = body

    // Validate required fields
    if (!operator_id || !scanned_by_email || !envelope_image) {
      return NextResponse.json(
        { error: 'Missing required fields: operator_id, scanned_by_email, envelope_image' },
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

    // Use the PMB value - could be in mailbox_id or mailbox_pmb field
    const pmbValue = mailbox_pmb || mailbox_id

    // Insert into STAGING table (no constraints, flexible schema)
    const { data: stagingItem, error: insertError } = await supabase
      .from('mail_item_staging')
      .insert({
        operator_id,
        location_id: location_id || null,
        mailbox_pmb: pmbValue,                    // Store PMB string (e.g., "1614")
        company_id: company_id || null,           // Company identifier if available
        company_name: company_name || null,       // Company name for reference
        received_at: scanned_at || new Date().toISOString(),
        status: 'pending_processing',             // Will be processed by post-processor
        scanned_by_email: scanned_by_email.toLowerCase(),
        envelope_image: envelope_image.replace('storage_path:', ''),
        ocr_text: ocr_raw_text || null,
        ocr_confidence: ocr_confidence || 0,
        match_confidence: body.match_confidence || ocr_confidence || 0,
        match_method: body.match_method || (ocr_raw_text ? 'fuzzy_ocr' : 'manual'),
        package_type: package_type || null,
        carrier: carrier || null,
        tracking_number: tracking_number || null,
        client_scan_id: client_scan_id || null,
        image_hash: image_hash || null,
        app_version: body.app_version || '1.0.0',
        raw_payload: body  // Store entire original payload for debugging
      })
      .select('staging_id')
      .single()

    if (insertError) {
      console.error('Staging insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to stage mail item', details: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      staging_id: stagingItem.staging_id,
      status: 'pending_processing',
      message: 'Mail item staged successfully - will be processed into mail_item table'
    }, { status: 201 })

  } catch (error) {
    console.error('Mail staging error:', error)
    return NextResponse.json(
      { error: 'Failed to stage mail item' },
      { status: 500 }
    )
  }
}