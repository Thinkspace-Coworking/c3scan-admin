import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Helper to verify JWT token
function verifyToken(token: string): { user_id: string; email: string; operator_id: string } | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    if (decoded.exp < Date.now()) return null
    return decoded
  } catch {
    return null
  }
}

// GET /api/mobile/v1/stats?operator_id={uuid}&email={email}
// Get upload stats for the settings screen
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
    const email = searchParams.get('email') || tokenData.email

    // Validate operator_id matches token
    if (operatorId !== tokenData.operator_id) {
      return NextResponse.json(
        { error: 'Operator mismatch' },
        { status: 403 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get today's date boundaries
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Get user_id from email
    const { data: userData } = await supabase
      .from('user_account')
      .select('user_id')
      .eq('email', email.toLowerCase())
      .single()

    const userId = userData?.user_id

    // Count mail items created by this user today
    const { count: todayCount, error: todayError } = await supabase
      .from('mail_item')
      .select('*', { count: 'exact', head: true })
      .eq('operator_id', operatorId)
      .gte('created_at', todayStart)

    // Count mail items created by this user this week
    const { count: weekCount, error: weekError } = await supabase
      .from('mail_item')
      .select('*', { count: 'exact', head: true })
      .eq('operator_id', operatorId)
      .gte('created_at', weekStart)

    // Get pending alias suggestions count
    const { count: pendingSuggestions, error: suggestionsError } = await supabase
      .from('alias_suggestion')
      .select('*', { count: 'exact', head: true })
      .eq('operator_id', operatorId)
      .eq('status', 'pending')

    // Get batch stats
    const { data: batchStats, error: batchError } = await supabase
      .from('ingest_batch')
      .select('status')
      .eq('operator_id', operatorId)
      .eq('user_id', userId)
      .gte('created_at', weekStart)

    const batchSummary = {
      total: batchStats?.length || 0,
      completed: batchStats?.filter((b: any) => b.status === 'completed').length || 0,
      failed: batchStats?.filter((b: any) => b.status === 'failed').length || 0,
      processing: batchStats?.filter((b: any) => b.status === 'processing').length || 0
    }

    return NextResponse.json({
      user: {
        email,
        operator_id: operatorId
      },
      scans: {
        today: todayCount || 0,
        this_week: weekCount || 0
      },
      pending_review: {
        alias_suggestions: pendingSuggestions || 0
      },
      batches: batchSummary,
      generated_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
