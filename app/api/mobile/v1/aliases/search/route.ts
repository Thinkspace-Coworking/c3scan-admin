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

// GET /api/mobile/v1/aliases/search?q={query}&operator_id={uuid}
// Manual search for company aliases when fuzzy match fails
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
    const query = searchParams.get('q')
    const operatorId = searchParams.get('operator_id')

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Validate operator_id matches token
    if (operatorId !== tokenData.operator_id) {
      return NextResponse.json(
        { error: 'Operator mismatch' },
        { status: 403 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Search using the existing search_company_aliases RPC or direct query
    // First try the RPC if it exists
    let searchResults: any[] = []
    
    try {
      const { data: rpcResults, error: rpcError } = await supabase
        .rpc('search_company_aliases', {
          search_query: query,
          limit_count: 10
        })

      if (!rpcError && rpcResults) {
        searchResults = rpcResults
      }
    } catch {
      // RPC might not exist, fall back to direct query
    }

    // Fallback: Direct query if RPC didn't work
    if (searchResults.length === 0) {
      const normalizedQuery = query.toLowerCase().trim()
      
      const { data: directResults, error: directError } = await supabase
        .from('company_alias')
        .select(`
          company_alias_id,
          company_id,
          alias_name,
          alias_name_normalized,
          alias_type,
          mailbox_id,
          is_active,
          company:company_id!inner (
            company_name,
            operator_id
          )
        `)
        .eq('company.operator_id', operatorId)
        .eq('is_active', true)
        .or(`alias_name.ilike.%${query}%,alias_name_normalized.ilike.%${normalizedQuery}%`)
        .limit(10)

      if (!directError && directResults) {
        searchResults = directResults
      }
    }

    // Get mailbox details for results
    const mailboxIds = searchResults
      .map((r: any) => r.mailbox_id)
      .filter(Boolean)
      .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)

    let mailboxes: any[] = []
    if (mailboxIds.length > 0) {
      const { data: mailboxData } = await supabase
        .from('mailbox')
        .select('mailbox_id, pmb_number, location_id')
        .in('mailbox_id', mailboxIds)
        .eq('is_active', true)
      
      mailboxes = mailboxData || []
    }

    // Format results
    const formattedResults = searchResults.map((result: any) => {
      const mailbox = mailboxes.find((m: any) => m.mailbox_id === result.mailbox_id)
      const company = Array.isArray(result.company) ? result.company[0] : result.company
      
      return {
        company_alias_id: result.company_alias_id,
        company_id: result.company_id,
        company_name: company?.company_name || result.alias_name,
        alias_name: result.alias_name,
        alias_type: result.alias_type,
        mailbox_id: result.mailbox_id,
        mailbox_pmb: mailbox?.pmb_number || null,
        location_id: mailbox?.location_id || null,
        confidence: 1.0 // Manual selection = high confidence
      }
    })

    return NextResponse.json({
      query,
      results: formattedResults,
      count: formattedResults.length
    })

  } catch (error) {
    console.error('Alias search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
