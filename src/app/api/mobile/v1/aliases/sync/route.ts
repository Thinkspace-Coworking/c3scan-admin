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

// GET /api/mobile/v1/aliases/sync
// Sync company aliases for fuzzy matching
// Query params: ?since={timestamp}&operator_id={uuid}
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
    const since = searchParams.get('since')
    const operatorId = searchParams.get('operator_id')

    // Validate operator_id matches token
    if (operatorId !== tokenData.operator_id) {
      return NextResponse.json(
        { error: 'Operator mismatch' },
        { status: 403 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Build query for company aliases with company and mailbox info
    let query = supabase
      .from('company_alias')
      .select(`
        company_alias_id,
        company_id,
        alias_name,
        alias_name_normalized,
        alias_type,
        mailbox_id,
        is_active,
        effective_from,
        effective_to,
        created_at,
        updated_at,
        company:company_id!inner (
          company_name,
          operator_id
        )
      `)
      .eq('company.operator_id', operatorId)

    // Add since filter if provided for incremental sync
    if (since) {
      const sinceDate = new Date(parseInt(since) * 1000).toISOString()
      query = query.gte('updated_at', sinceDate)
    }

    // Only active aliases
    query = query.eq('is_active', true)

    const { data: aliases, error } = await query

    if (error) {
      console.error('Aliases sync error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch aliases' },
        { status: 500 }
      )
    }

    // Get mailbox details for PMB numbers
    const mailboxIds = aliases
      ?.map(a => a.mailbox_id)
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i) // unique

    let mailboxes: any[] = []
    if (mailboxIds.length > 0) {
      const { data: mailboxData } = await supabase
        .from('mailbox')
        .select('mailbox_id, pmb_number, location_id')
        .in('mailbox_id', mailboxIds)
        .eq('is_active', true)
      
      mailboxes = mailboxData || []
    }

    // Format response for iOS app
    const formattedAliases = aliases?.map(alias => {
      const mailbox = mailboxes.find(m => m.mailbox_id === alias.mailbox_id)
      // Handle company as either array or object from Supabase
      const companyData = alias.company as { company_name?: string } | Array<{ company_name?: string }> | null
      const companyName = Array.isArray(companyData) 
        ? companyData[0]?.company_name 
        : companyData?.company_name
      return {
        company_id: alias.company_id,
        alias_name: alias.alias_name,
        alias_name_normalized: alias.alias_name_normalized,
        alias_type: alias.alias_type,
        mailbox_id: alias.mailbox_id,
        mailbox_pmb: mailbox?.pmb_number || null,
        location_id: mailbox?.location_id || null,
        company_name: companyName || null,
        is_active: alias.is_active,
        updated_at: alias.updated_at
      }
    }) || []

    return NextResponse.json({
      aliases: formattedAliases,
      sync_timestamp: Math.floor(Date.now() / 1000),
      count: formattedAliases.length
    })

  } catch (error) {
    console.error('Aliases sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    )
  }
}
