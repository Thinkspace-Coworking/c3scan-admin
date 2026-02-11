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

// POST /api/mobile/v1/mail/batch
// Batch create mail items for offline sync
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
      items,
      client_batch_id 
    } = body

    // Validate required fields
    if (!operator_id || !location_id || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Missing required fields: operator_id, location_id, items (array)' },
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

    // Limit batch size
    if (items.length > 50) {
      return NextResponse.json(
        { error: 'Batch size exceeds maximum of 50 items' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user_id from token email
    const { data: userData } = await supabase
      .from('user_account')
      .select('user_id')
      .eq('email', tokenData.email.toLowerCase())
      .single()

    // Create batch record
    const { data: batchRecord, error: batchError } = await supabase
      .from('ingest_batch')
      .insert({
        operator_id,
        location_id,
        user_id: userData?.user_id,
        client_batch_id: client_batch_id || crypto.randomUUID(),
        status: 'processing',
        started_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select('ingest_batch_id')
      .single()

    if (batchError) {
      console.error('Batch creation error:', batchError)
      return NextResponse.json(
        { error: 'Failed to create batch record' },
        { status: 500 }
      )
    }

    const results = []
    const errors = []

    // Process each item in the batch
    for (const item of items) {
      try {
        const {
          mailbox_id,
          scanned_by_email,
          envelope_image,
          ocr_raw_text,
          ocr_confidence,
          package_type,
          carrier,
          tracking_number,
          scanned_at,
          client_scan_id
        } = item

        if (!mailbox_id || !envelope_image) {
          errors.push({
            client_scan_id: client_scan_id || 'unknown',
            error: 'Missing required fields: mailbox_id or envelope_image'
          })
          continue
        }

        // Create mail_item
        const { data: mailItem, error: mailError } = await supabase
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
            scan_mode: package_type || 'standard',
            confidence_score: ocr_confidence,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('mail_item_id')
          .single()

        if (mailError) {
          errors.push({
            client_scan_id: client_scan_id || 'unknown',
            error: `Failed to create mail item: ${mailError.message}`
          })
          continue
        }

        // Create mail_item_image
        await supabase
          .from('mail_item_image')
          .insert({
            operator_id,
            mail_item_id: mailItem.mail_item_id,
            image_type: 'envelope',
            storage_path: envelope_image.replace('storage_path:', ''),
            mime_type: 'image/jpeg',
            created_at: new Date().toISOString()
          })

        // Create OCR extraction if text present
        if (ocr_raw_text) {
          await supabase
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
        }

        // Create mail event
        await supabase
          .from('mail_event')
          .insert({
            operator_id,
            mail_item_id: mailItem.mail_item_id,
            event_type: 'scanned_batch',
            event_payload: {
              scanned_by: scanned_by_email || tokenData.email,
              client_scan_id,
              carrier,
              tracking_number,
              batch_id: batchRecord.ingest_batch_id
            },
            event_at: new Date().toISOString(),
            created_by_user_id: userData?.user_id
          })

        // Create batch item record
        await supabase
          .from('ingest_batch_item')
          .insert({
            ingest_batch_id: batchRecord.ingest_batch_id,
            local_scan_id: client_scan_id,
            mail_item_id: mailItem.mail_item_id,
            status: 'completed',
            created_at: new Date().toISOString()
          })

        results.push({
          client_scan_id: client_scan_id || null,
          mail_item_id: mailItem.mail_item_id,
          status: 'created'
        })

      } catch (itemError) {
        errors.push({
          client_scan_id: item.client_scan_id || 'unknown',
          error: itemError instanceof Error ? itemError.message : 'Unknown error'
        })
      }
    }

    // Update batch status
    const allSucceeded = errors.length === 0
    await supabase
      .from('ingest_batch')
      .update({
        status: allSucceeded ? 'completed' : 'completed_with_errors',
        completed_at: new Date().toISOString()
      })
      .eq('ingest_batch_id', batchRecord.ingest_batch_id)

    return NextResponse.json({
      batch_id: batchRecord.ingest_batch_id,
      processed: items.length,
      succeeded: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    }, { status: 201 })

  } catch (error) {
    console.error('Batch upload error:', error)
    return NextResponse.json(
      { error: 'Batch processing failed' },
      { status: 500 }
    )
  }
}
