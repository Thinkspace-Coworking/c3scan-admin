import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin: Manage Company Alias
 * 
 * PATCH /api/admin/company-aliases/{company_alias_id}
 * 
 * Update alias details or archive (set is_active = false)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface UpdateAliasRequest {
  alias_name?: string;
  alias_type?: 'dba' | 'authorized_member' | 'ocr_variant';
  is_active?: boolean;
  notes?: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { company_alias_id: string } }
) {
  try {
    const { company_alias_id } = params;
    const operatorId = request.headers.get('X-Effective-Operator-Id');
    const userId = request.headers.get('X-User-Id');
    const roles = JSON.parse(request.headers.get('X-User-Roles') || '[]');
    
    if (!operatorId || !userId) {
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    
    // Check permissions
    const allowedRoles = ['operator_admin', 'operator_staff'];
    if (!roles.some((role: string) => allowedRoles.includes(role))) {
      return NextResponse.json(
        { error: { code: 'forbidden', message: 'Insufficient permissions' } },
        { status: 403 }
      );
    }
    
    // Get the alias to verify ownership
    const { data: alias, error: aliasError } = await supabase
      .from('company_alias')
      .select('*, company:company_id(operator_id)')
      .eq('company_alias_id', company_alias_id)
      .single();
    
    if (aliasError || !alias) {
      return NextResponse.json(
        { error: { code: 'not_found', message: 'Alias not found' } },
        { status: 404 }
      );
    }
    
    // Verify company belongs to operator
    const companyOperatorId = (alias.company as any)?.operator_id;
    if (companyOperatorId !== operatorId) {
      return NextResponse.json(
        { error: { code: 'forbidden', message: 'Access denied' } },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body: UpdateAliasRequest = await request.json();
    const now = new Date().toISOString();
    
    // Build update data
    const updateData: any = {
      updated_at: now
    };
    
    if (body.alias_name !== undefined) {
      updateData.alias_name = body.alias_name;
      updateData.alias_name_normalized = body.alias_name.toLowerCase().trim();
    }
    
    if (body.alias_type !== undefined) {
      updateData.alias_type = body.alias_type;
    }
    
    if (body.is_active !== undefined) {
      updateData.is_active = body.is_active;
      // When archiving, set effective_to date
      if (!body.is_active) {
        updateData.effective_to = now;
      }
    }
    
    // Update the alias
    const { data: updatedAlias, error: updateError } = await supabase
      .from('company_alias')
      .update(updateData)
      .eq('company_alias_id', company_alias_id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Failed to update alias:', updateError);
      return NextResponse.json(
        { error: { code: 'server_error', message: 'Failed to update alias' } },
        { status: 500 }
      );
    }
    
    // Determine action type for audit
    const actionType = body.is_active === false ? 'ALIAS_ARCHIVED' : 
                       body.is_active === true ? 'ALIAS_RESTORED' : 'ALIAS_UPDATED';
    
    // Log audit
    await supabase.from('audit_logs').insert({
      timestamp: now,
      actor_user_id: userId,
      actor_roles: JSON.stringify(roles),
      effective_operator_id: operatorId,
      endpoint: `/api/admin/company-aliases/${company_alias_id}`,
      method: 'PATCH',
      event_type: actionType,
      resource_type: 'company_alias',
      resource_id: company_alias_id,
      result: 'success',
      previous_state: JSON.stringify({
        alias_name: alias.alias_name,
        alias_type: alias.alias_type,
        is_active: alias.is_active
      }),
      new_state: JSON.stringify({
        alias_name: updatedAlias.alias_name,
        alias_type: updatedAlias.alias_type,
        is_active: updatedAlias.is_active
      }),
      metadata: JSON.stringify({
        notes: body.notes,
        company_id: alias.company_id
      })
    });
    
    return NextResponse.json({
      success: true,
      alias: updatedAlias,
      message: body.is_active === false 
        ? 'Alias archived successfully' 
        : body.is_active === true 
        ? 'Alias restored successfully'
        : 'Alias updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating alias:', error);
    return NextResponse.json(
      { error: { code: 'server_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
