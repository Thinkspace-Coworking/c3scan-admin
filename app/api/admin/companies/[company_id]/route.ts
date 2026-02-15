import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin: Update Company
 * 
 * PATCH /api/admin/companies/{company_id}
 * 
 * Update company details. operator_admin only.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface UpdateCompanyRequest {
  company_name?: string;
  external_id?: string;
  is_active?: boolean;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { company_id: string } }
) {
  try {
    const { company_id } = params;
    const operatorId = request.headers.get('X-Effective-Operator-Id');
    const userId = request.headers.get('X-User-Id');
    const roles = JSON.parse(request.headers.get('X-User-Roles') || '[]');
    
    if (!operatorId || !userId) {
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    
    // Only operator_admin can update companies
    if (!roles.includes('operator_admin')) {
      return NextResponse.json(
        { error: { code: 'forbidden', message: 'Only operator_admin can update companies' } },
        { status: 403 }
      );
    }
    
    // Verify company exists and belongs to operator
    const { data: existingCompany, error: fetchError } = await supabase
      .from('company')
      .select('company_id, company_name, external_id, is_active')
      .eq('company_id', company_id)
      .eq('operator_id', operatorId)
      .single();
    
    if (fetchError || !existingCompany) {
      return NextResponse.json(
        { error: { code: 'not_found', message: 'Company not found' } },
        { status: 404 }
      );
    }
    
    // Parse request body
    const body: UpdateCompanyRequest = await request.json();
    
    // Build update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (body.company_name !== undefined) {
      if (!body.company_name.trim()) {
        return NextResponse.json(
          { error: { code: 'validation_failed', message: 'company_name cannot be empty' } },
          { status: 400 }
        );
      }
      updateData.company_name = body.company_name.trim();
    }
    
    if (body.external_id !== undefined) {
      updateData.external_id = body.external_id.trim() || null;
    }
    
    if (body.is_active !== undefined) {
      updateData.is_active = body.is_active;
    }
    
    // Update company
    const { data: updatedCompany, error: updateError } = await supabase
      .from('company')
      .update(updateData)
      .eq('company_id', company_id)
      .eq('operator_id', operatorId)
      .select(`
        company_id,
        company_name,
        external_id,
        is_active,
        updated_at,
        mailbox:mailbox_id (
          mailbox_id,
          pmb_number,
          location:location_id (location_name)
        )
      `)
      .single();
    
    if (updateError) {
      console.error('Failed to update company:', updateError);
      return NextResponse.json(
        { error: { code: 'server_error', message: 'Failed to update company' } },
        { status: 500 }
      );
    }
    
    // Log audit
    await supabase.from('audit_logs').insert({
      timestamp: new Date().toISOString(),
      actor_user_id: userId,
      actor_roles: JSON.stringify(roles),
      effective_operator_id: operatorId,
      endpoint: `/api/admin/companies/${company_id}`,
      method: 'PATCH',
      event_type: 'COMPANY_UPDATED',
      resource_type: 'company',
      resource_id: company_id,
      result: 'success',
      previous_state: JSON.stringify(existingCompany),
      new_state: JSON.stringify(updatedCompany),
      metadata: JSON.stringify({ fields_updated: Object.keys(updateData) })
    });
    
    return NextResponse.json({
      success: true,
      company: updatedCompany,
      message: 'Company updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: { code: 'server_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
