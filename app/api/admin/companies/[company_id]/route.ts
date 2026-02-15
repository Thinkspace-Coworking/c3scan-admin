import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin: Company Detail with Aliases
 * 
 * GET /api/admin/companies/{company_id}
 * 
 * Returns company details and all aliases (active and archived)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  request: NextRequest,
  { params }: { params: { company_id: string } }
) {
  try {
    const { company_id } = params;
    const operatorId = request.headers.get('X-Effective-Operator-Id');
    const userId = request.headers.get('X-User-Id');
    const roles = JSON.parse(request.headers.get('X-User-Roles') || '[]');
    
    if (!operatorId) {
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    
    // Fetch company with mailbox and location
    const { data: company, error: companyError } = await supabase
      .from('company')
      .select(`
        *,
        mailbox:mailbox_id (
          *,
          location:location_id (*)
        )
      `)
      .eq('company_id', company_id)
      .eq('operator_id', operatorId)
      .single();
    
    if (companyError || !company) {
      return NextResponse.json(
        { error: { code: 'not_found', message: 'Company not found' } },
        { status: 404 }
      );
    }
    
    // Fetch all aliases for this company (both active and inactive)
    const { data: aliases, error: aliasesError } = await supabase
      .from('company_alias')
      .select('*')
      .eq('company_id', company_id)
      .order('is_active', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (aliasesError) {
      console.error('Failed to fetch aliases:', aliasesError);
    }
    
    // Get alias suggestion history
    const { data: suggestions } = await supabase
      .from('alias_suggestion')
      .select('alias_suggestion_id, suggested_alias, status, created_at, decided_at')
      .eq('company_id', company_id)
      .order('created_at', { ascending: false })
      .limit(10);
    
    return NextResponse.json({
      company: {
        company_id: company.company_id,
        company_name: company.company_name,
        external_id: company.external_id,
        is_active: company.is_active,
        created_at: company.created_at,
        updated_at: company.updated_at,
        mailbox: company.mailbox,
      },
      aliases: aliases || [],
      suggestions: suggestions || [],
      summary: {
        total_aliases: aliases?.length || 0,
        active_aliases: aliases?.filter(a => a.is_active).length || 0,
        archived_aliases: aliases?.filter(a => !a.is_active).length || 0
      }
    });
    
  } catch (error) {
    console.error('Error fetching company detail:', error);
    return NextResponse.json(
      { error: { code: 'server_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
