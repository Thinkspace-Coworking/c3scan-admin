import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin: Mail Item Staging
 * 
 * GET /api/admin/mail-items/staging
 * 
 * View mail items in staging queue and their processing status.
 * Shows relationship between staging records and processed mail_items.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const operatorId = request.headers.get('X-Effective-Operator-Id');
    const userId = request.headers.get('X-User-Id');
    const roles = JSON.parse(request.headers.get('X-User-Roles') || '[]');
    const locationIds = JSON.parse(request.headers.get('X-User-Location-Ids') || '[]');
    
    if (!operatorId) {
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Authentication required' } },
        { status: 401 }
      );
    }
    
    // Parse query params
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const cursor = searchParams.get('cursor');
    const statusFilter = searchParams.get('status'); // pending_processing, processed, failed
    const locationFilter = searchParams.get('location_id');
    const mailboxFilter = searchParams.get('mailbox_id');
    const showProcessed = searchParams.get('show_processed') === 'true';
    
    // Build query
    let query = supabase
      .from('mail_item_staging')
      .select(`
        *,
        processed_mail_item:processed_mail_item_id (
          mail_item_id,
          status,
          received_at,
          mailbox:mailbox_id (pmb_number, mailbox_label)
        )
      `)
      .eq('operator_id', operatorId)
      .order('received_at', { ascending: false })
      .limit(limit);
    
    // Apply filters
    if (cursor) {
      query = query.lt('staging_id', cursor);
    }
    
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    
    if (locationFilter) {
      query = query.eq('location_id', locationFilter);
    }
    
    if (mailboxFilter) {
      query = query.eq('mailbox_id', mailboxFilter);
    }
    
    // By default, hide already processed items unless explicitly requested
    if (!showProcessed) {
      query = query.neq('status', 'processed');
    }
    
    // Location scoping for location_staff
    if (roles.includes('location_staff') && !roles.includes('operator_admin')) {
      if (locationIds.length > 0) {
        query = query.in('location_id', locationIds);
      }
    }
    
    const { data: stagingItems, error } = await query;
    
    if (error) {
      console.error('Failed to fetch staging items:', error);
      return NextResponse.json(
        { error: { code: 'server_error', message: 'Failed to fetch staging items' } },
        { status: 500 }
      );
    }
    
    // Format response
    const formattedItems = stagingItems?.map(item => ({
      staging_id: item.staging_id,
      status: item.status,
      received_at: item.received_at,
      scanned_by_email: item.scanned_by_email,
      
      // Mailbox info
      location_id: item.location_id,
      mailbox_id: item.mailbox_id,
      company_id: item.company_id,
      company_name: item.company_name,
      
      // OCR/Matching
      ocr_text: item.ocr_text,
      ocr_confidence: item.ocr_confidence,
      match_confidence: item.match_confidence,
      match_method: item.match_method,
      
      // Package info
      package_type: item.package_type,
      carrier: item.carrier,
      tracking_number: item.tracking_number,
      
      // Image
      envelope_image: item.envelope_image,
      client_scan_id: item.client_scan_id,
      
      // Processing info
      processed_at: item.processed_at,
      processing_error: item.processing_error,
      
      // Linked mail_item (if processed)
      processed_mail_item: item.processed_mail_item ? {
        mail_item_id: (item.processed_mail_item as any).mail_item_id,
        status: (item.processed_mail_item as any).status,
        received_at: (item.processed_mail_item as any).received_at,
        pmb_number: (item.processed_mail_item as any).mailbox?.pmb_number,
        mailbox_label: (item.processed_mail_item as any).mailbox?.mailbox_label
      } : null
    })) || [];
    
    // Get next cursor
    const nextCursor = stagingItems && stagingItems.length === limit
      ? stagingItems[stagingItems.length - 1].staging_id
      : null;
    
    // Get counts by status for summary
    const { data: statusCounts } = await supabase
      .from('mail_item_staging')
      .select('status', { count: 'exact' })
      .eq('operator_id', operatorId);
    
    const counts: Record<string, number> = {};
    statusCounts?.forEach((item: any) => {
      counts[item.status] = (counts[item.status] || 0) + 1;
    });
    
    return NextResponse.json({
      items: formattedItems,
      summary: {
        total: Object.values(counts).reduce((a, b) => a + b, 0),
        by_status: counts
      },
      next_cursor: nextCursor
    });
    
  } catch (error) {
    console.error('Error fetching staging items:', error);
    return NextResponse.json(
      { error: { code: 'server_error', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
