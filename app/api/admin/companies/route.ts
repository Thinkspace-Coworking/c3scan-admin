import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin: Companies with Search
 * 
 * GET /api/admin/companies
 * 
 * Enhanced with search by company name
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const operatorId = request.headers.get('X-Effective-Operator-Id');
    const userId = request.headers.get('X-User-Id');
    const roles = JSON.parse(request.headers.get('X-User-Roles') || '[]');
    
    if (!operatorId) {
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    
    // Parse query params
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const cursor = searchParams.get('cursor');
    const search = searchParams.get('search') || '';
    const includeAliases = searchParams.get('include_aliases') === 'true';
    
    // Build query
    let query = supabase
      .from('company')
      .select(`
        company_id,
        company_name,
        external_id,
        is_active,
        created_at,
        updated_at,
        mailbox:mailbox_id (
          mailbox_id,
          pmb_number,
          location_id,
          location:location_id (location_name)
        )
      `)
      .eq('operator_id', operatorId)
      .eq('is_active', true)
      .order('company_name', { ascending: true })
      .limit(limit);
    
    // Apply search filter
    if (search) {
      query = query.ilike('company_name', `%${search}%`);
    }
    
    // Apply cursor pagination
    if (cursor) {
      query = query.gt('company_id', cursor);
    }
    
    const { data: companies, error } = await query;
    
    if (error) {
      console.error('Failed to fetch companies:', error);
      return NextResponse.json(
        { error: { code: 'server_error', message: 'Failed to fetch companies' } },
        { status: 500 }
      );
    }
    
    // Get alias counts for each company if requested
    let aliasCounts: Record<string, number> = {};
    if (includeAliases && companies && companies.length > 0) {
      const companyIds = companies.map(c => c.company_id);
      const { data: aliases } = await supabase
        .from('company_alias')
        .select('company_id, is_active')
        .in('company_id', companyIds);
      
      aliases?.forEach((a: any) => {
        if (a.is_active) {
          aliasCounts[a.company_id] = (aliasCounts[a.company_id] || 0) + 1;
        }
      });
    }
    
    // Format response
    const formatted = companies?.map(c => ({
      company_id: c.company_id,
      company_name: c.company_name,
      external_id: c.external_id,
      is_active: c.is_active,
      created_at: c.created_at,
      updated_at: c.updated_at,
      mailbox: c.mailbox ? {
        mailbox_id: (c.mailbox as any).mailbox_id,
        pmb_number: (c.mailbox as any).pmb_number,
        location_name: (c.mailbox as any).location?.location_name
      } : null,
      alias_count: aliasCounts[c.company_id] || 0
    })) || [];
    
    // Get next cursor
    const nextCursor = companies && companies.length === limit
      ? companies[companies.length - 1].company_id
      : null;
    
    return NextResponse.json({
      items: formatted,
      next_cursor: nextCursor
    });
    
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: { code: 'server_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
