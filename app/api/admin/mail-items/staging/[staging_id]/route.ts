import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin: Get Staging Item Detail
 * 
 * GET /api/admin/mail-items/staging/{staging_id}
 * 
 * View a specific staging record and its linked mail_item (if processed).
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  request: NextRequest,
  { params }: { params: { staging_id: string } }
) {
  try {
    const { staging_id } = params;
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
    
    // Fetch staging item with linked mail_item
    const { data: stagingItem, error } = await supabase
      .from('mail_item_staging')
      .select(`
        *,
        processed_mail_item:processed_mail_item_id (
          *,
          mailbox:mailbox_id (*),
          company:company_id (*),
          location:location_id (*),
          mail_item_image (*)
        )
      `)
      .eq('staging_id', staging_id)
      .eq('operator_id', operatorId)
      .single();
    
    if (error || !stagingItem) {
      return NextResponse.json(
        { error: { code: 'not_found', message: 'Staging item not found' } },
        { status: 404 }
      );
    }
    
    // Check location permissions for location_staff
    if (roles.includes('location_staff') && !roles.includes('operator_admin')) {
      if (userLocationIds.length > 0 && !userLocationIds.includes(stagingItem.location_id)) {
        return NextResponse.json(
          { error: { code: 'forbidden', message: 'Access denied for this location' } },
          { status: 403 }
        );
      }
    }
    
    // Format response
    const response = {
      staging: {
        staging_id: stagingItem.staging_id,
        status: stagingItem.status,
        received_at: stagingItem.received_at,
        processed_at: stagingItem.processed_at,
        scanned_by_email: stagingItem.scanned_by_email,
        
        // Mailbox/Company
        location_id: stagingItem.location_id,
        mailbox_id: stagingItem.mailbox_id,
        company_id: stagingItem.company_id,
        company_name: stagingItem.company_name,
        
        // OCR Data
        ocr_text: stagingItem.ocr_text,
        ocr_confidence: stagingItem.ocr_confidence,
        match_confidence: stagingItem.match_confidence,
        match_method: stagingItem.match_method,
        
        // Package
        package_type: stagingItem.package_type,
        carrier: stagingItem.carrier,
        tracking_number: stagingItem.tracking_number,
        
        // Image
        envelope_image: stagingItem.envelope_image,
        client_scan_id: stagingItem.client_scan_id,
        
        // Error info
        processing_error: stagingItem.processing_error,
        
        // Raw payload for debugging
        raw_payload: stagingItem.raw_payload
      },
      
      // Linked mail_item if processed
      processed_mail_item: stagingItem.processed_mail_item ? {
        mail_item_id: (stagingItem.processed_mail_item as any).mail_item_id,
        status: (stagingItem.processed_mail_item as any).status,
        received_at: (stagingItem.processed_mail_item as any).received_at,
        mailbox: (stagingItem.processed_mail_item as any).mailbox,
        company: (stagingItem.processed_mail_item as any).company,
        location: (stagingItem.processed_mail_item as any).location,
        images: (stagingItem.processed_mail_item as any).mail_item_image
      } : null,
      
      // Processing status summary
      processing_summary: {
        is_processed: stagingItem.status === 'processed',
        is_failed: stagingItem.status === 'failed',
        is_pending: stagingItem.status === 'pending_processing',
        has_mail_item: stagingItem.processed_mail_item_id !== null,
        processed_at: stagingItem.processed_at,
        error: stagingItem.processing_error
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching staging item:', error);
    return NextResponse.json(
      { error: { code: 'server_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
