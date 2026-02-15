import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin: Mailbox Detail
 * 
 * GET /api/admin/mailboxes/{mailbox_id}
 * PATCH /api/admin/mailboxes/{mailbox_id}
 * 
 * Get mailbox details with related data, or update mailbox.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET - Fetch mailbox detail with mail items and compliance status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { mailbox_id: string } }
) {
  try {
    const { mailbox_id } = params;
    const operatorId = request.headers.get('X-Effective-Operator-Id');
    const userId = request.headers.get('X-User-Id');
    const roles = JSON.parse(request.headers.get('X-User-Roles') || '[]');
    const userLocationIds = JSON.parse(request.headers.get('X-User-Location-Ids') || '[]');
    
    if (!operatorId) {
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    
    // Fetch mailbox with company and location
    const { data: mailbox, error: mailboxError } = await supabase
      .from('mailbox')
      .select(`
        *,
        company:company_id (*),
        location:location_id (*)
      `)
      .eq('mailbox_id', mailbox_id)
      .eq('operator_id', operatorId)
      .single();
    
    if (mailboxError || !mailbox) {
      return NextResponse.json(
        { error: { code: 'not_found', message: 'Mailbox not found' } },
        { status: 404 }
      );
    }
    
    // Check location permissions for location_staff
    if (roles.includes('location_staff') && !roles.includes('operator_admin')) {
      if (userLocationIds.length > 0 && !userLocationIds.includes(mailbox.location_id)) {
        return NextResponse.json(
          { error: { code: 'forbidden', message: 'Access denied for this location' } },
          { status: 403 }
        );
      }
    }
    
    // Fetch recent mail items for this mailbox
    const { data: mailItems } = await supabase
      .from('mail_item')
      .select(`
        mail_item_id,
        received_at,
        status,
        is_active,
        match_confidence,
        mail_item_image (image_type, storage_path)
      `)
      .eq('mailbox_id', mailbox_id)
      .eq('operator_id', operatorId)
      .order('received_at', { ascending: false })
      .limit(20);
    
    // Fetch compliance status (if you have a compliance table)
    // For now, we'll return a placeholder structure
    const complianceStatus = {
      status: 'compliant', // or 'pending', 'non_compliant'
      grace_expires_at: null,
      documents_uploaded: 0,
      documents_required: 2,
      last_updated: mailbox.updated_at
    };
    
    // Fetch active requests for this mailbox's mail items
    const mailItemIds = mailItems?.map(m => m.mail_item_id) || [];
    let activeRequests: any[] = [];
    
    if (mailItemIds.length > 0) {
      const { data: requests } = await supabase
        .from('mail_request')
        .select('*')
        .in('mail_item_id', mailItemIds)
        .eq('request_status', 'pending')
        .order('requested_at', { ascending: false });
      
      activeRequests = requests || [];
    }
    
    return NextResponse.json({
      mailbox: {
        mailbox_id: mailbox.mailbox_id,
        pmb_number: mailbox.pmb_number,
        mailbox_label: mailbox.mailbox_label,
        is_active: mailbox.is_active,
        created_at: mailbox.created_at,
        updated_at: mailbox.updated_at,
        company: mailbox.company,
        location: mailbox.location
      },
      stats: {
        total_mail_items: mailItems?.length || 0,
        active_requests: activeRequests.length,
        pending_mail: mailItems?.filter(m => m.status === 'uploaded').length || 0
      },
      recent_mail: mailItems || [],
      active_requests: activeRequests,
      compliance: complianceStatus
    });
    
  } catch (error) {
    console.error('Error fetching mailbox detail:', error);
    return NextResponse.json(
      { error: { code: 'server_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update mailbox details
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { mailbox_id: string } }
) {
  try {
    const { mailbox_id } = params;
    const operatorId = request.headers.get('X-Effective-Operator-Id');
    const userId = request.headers.get('X-User-Id');
    const roles = JSON.parse(request.headers.get('X-User-Roles') || '[]');
    
    if (!operatorId || !userId) {
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    
    // Only operator_admin can update mailboxes
    if (!roles.includes('operator_admin')) {
      return NextResponse.json(
        { error: { code: 'forbidden', message: 'Only operator_admin can update mailboxes' } },
        { status: 403 }
      );
    }
    
    // Verify mailbox exists
    const { data: existingMailbox, error: fetchError } = await supabase
      .from('mailbox')
      .select('*')
      .eq('mailbox_id', mailbox_id)
      .eq('operator_id', operatorId)
      .single();
    
    if (fetchError || !existingMailbox) {
      return NextResponse.json(
        { error: { code: 'not_found', message: 'Mailbox not found' } },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    // Update allowed fields
    if (body.mailbox_label !== undefined) {
      updateData.mailbox_label = body.mailbox_label.trim();
    }
    
    if (body.pmb_number !== undefined) {
      // Check if new PMB number conflicts with existing
      if (body.pmb_number !== existingMailbox.pmb_number) {
        const { data: existing } = await supabase
          .from('mailbox')
          .select('mailbox_id')
          .eq('operator_id', operatorId)
          .eq('pmb_number', body.pmb_number)
          .single();
        
        if (existing) {
          return NextResponse.json(
            { error: { code: 'conflict', message: 'PMB number already exists' } },
            { status: 409 }
          );
        }
      }
      updateData.pmb_number = body.pmb_number.trim();
    }
    
    if (body.is_active !== undefined) {
      updateData.is_active = body.is_active;
    }
    
    if (body.company_id !== undefined) {
      updateData.company_id = body.company_id;
    }
    
    // Update mailbox
    const { data: updatedMailbox, error: updateError } = await supabase
      .from('mailbox')
      .update(updateData)
      .eq('mailbox_id', mailbox_id)
      .eq('operator_id', operatorId)
      .select(`
        *,
        company:company_id (*),
        location:location_id (*)
      `)
      .single();
    
    if (updateError) {
      console.error('Failed to update mailbox:', updateError);
      return NextResponse.json(
        { error: { code: 'server_error', message: 'Failed to update mailbox' } },
        { status: 500 }
      );
    }
    
    // Log audit
    await supabase.from('audit_logs').insert({
      timestamp: new Date().toISOString(),
      actor_user_id: userId,
      actor_roles: JSON.stringify(roles),
      effective_operator_id: operatorId,
      endpoint: `/api/admin/mailboxes/${mailbox_id}`,
      method: 'PATCH',
      event_type: 'MAILBOX_UPDATED',
      resource_type: 'mailbox',
      resource_id: mailbox_id,
      result: 'success',
      previous_state: JSON.stringify(existingMailbox),
      new_state: JSON.stringify(updatedMailbox),
      metadata: JSON.stringify({ fields_updated: Object.keys(updateData) })
    });
    
    return NextResponse.json({
      success: true,
      mailbox: updatedMailbox,
      message: 'Mailbox updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating mailbox:', error);
    return NextResponse.json(
      { error: { code: 'server_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
