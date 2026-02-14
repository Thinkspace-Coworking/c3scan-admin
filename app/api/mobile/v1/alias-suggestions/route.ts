import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'

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

// POST /api/mobile/v1/alias-suggestions
// Submit unmatched mail for admin review
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
      company_id,
      suggested_alias,
      ocr_extraction_id,
      envelope_image,
      ocr_raw_text,
      ocr_confidence,
      scanned_by_email,
      scanned_at,
      client_scan_id
    } = body

    // Validate required fields
    if (!operator_id || !location_id || !suggested_alias) {
      return NextResponse.json(
        { error: 'Missing required fields: operator_id, location_id, suggested_alias' },
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
      .eq('email', (scanned_by_email || tokenData.email).toLowerCase())
      .single()

    // Create alias_suggestion record
    const { data: suggestion, error: suggestionError } = await supabase
      .from('alias_suggestion')
      .insert({
        operator_id,
        location_id,
        company_id: company_id || null,
        suggested_alias: suggested_alias,
        suggested_alias_normalized: suggested_alias.toLowerCase().trim(),
        ocr_extraction_id: ocr_extraction_id || null,
        status: 'pending',
        created_by_user_id: userData?.user_id || null,
        created_at: new Date().toISOString()
      })
      .select('alias_suggestion_id')
      .single()

    if (suggestionError) {
      console.error('Alias suggestion creation error:', suggestionError)
      Sentry.captureException(suggestionError, {
        extra: {
          context: 'alias_suggestion_insert',
          operator_id,
          location_id,
          suggested_alias,
          error_code: suggestionError.code,
          error_details: suggestionError.message,
          hint: suggestionError.hint,
        },
        tags: {
          endpoint: 'alias-suggestions',
          error_type: 'database_insert',
        }
      })
      return NextResponse.json(
        { error: 'Failed to create alias suggestion', details: suggestionError.message },
        { status: 500 }
      )
    }

    // If envelope image provided, store reference
    let mailItemId = null
    if (envelope_image) {
      // Create a placeholder mail_item for the unmatched mail
      const { data: mailItem, error: mailError } = await supabase
        .from('mail_item')
        .insert({
          operator_id,
          location_id,
          mailbox_id: null, // Unmatched - no mailbox yet
          received_at: scanned_at || new Date().toISOString(),
          status: 'pending_review',
          is_active: true,
          match_method: 'unmatched',
          match_confidence: 0,
          ocr_text: ocr_raw_text || null,
          scan_mode: 'standard',
          confidence_score: ocr_confidence || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('mail_item_id')
        .single()

      if (!mailError && mailItem) {
        mailItemId = mailItem.mail_item_id

        // Store image reference
        await supabase
          .from('mail_item_image')
          .insert({
            operator_id,
            mail_item_id: mailItemId,
            image_type: 'envelope',
            storage_path: envelope_image.replace('storage_path:', ''),
            mime_type: 'image/jpeg',
            created_at: new Date().toISOString()
          })

        // Store OCR if present
        if (ocr_raw_text) {
          await supabase
            .from('ocr_extraction')
            .insert({
              operator_id,
              mail_item_id: mailItemId,
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
            mail_item_id: mailItemId,
            event_type: 'unmatched_scanned',
            event_payload: {
              scanned_by: scanned_by_email || tokenData.email,
              client_scan_id,
              suggested_alias,
              alias_suggestion_id: suggestion.alias_suggestion_id
            },
            event_at: new Date().toISOString(),
            created_by_user_id: userData?.user_id
          })
      }
    }

    return NextResponse.json({
      alias_suggestion_id: suggestion.alias_suggestion_id,
      mail_item_id: mailItemId,
      status: 'pending',
      message: 'Alias suggestion submitted for admin review'
    }, { status: 201 })

  } catch (error) {
    console.error('Alias suggestion error:', error)
    Sentry.captureException(error, {
      extra: {
        context: 'alias_suggestions_post',
      },
      tags: {
        endpoint: 'alias-suggestions',
        error_type: 'unhandled_exception',
      }
    })
    return NextResponse.json(
      { error: 'Failed to submit alias suggestion' },
      { status: 500 }
    )
  }
}
