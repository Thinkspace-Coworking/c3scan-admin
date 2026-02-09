import { createClient } from '@/lib/supabase-browser'
import type { SupabaseClient } from '@supabase/supabase-js'

// Operator type
export interface Operator {
  operator_id: string
  operator_name: string
  is_active: boolean
  created_at: string
}

// Location type
export interface Location {
  location_id: string
  operator_id: string
  location_name: string
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  is_active: boolean
  created_at: string
}

// Compliance Case type
export interface ComplianceCase {
  case_id: string
  mailbox_id: string
  status: 'pending' | 'under_review' | 'compliant' | 'non_compliant' | 'rejected'
  grace_deadline?: string
  last_reminder_at?: string
  created_at: string
  updated_at: string
}

// Payment Method type
export interface PaymentMethod {
  payment_method_id: string
  operator_id: string
  brand: string
  last4: string
  exp_month: number
  exp_year: number
  is_default: boolean
  created_at: string
}

// Invoice type
export interface Invoice {
  invoice_id: string
  operator_id: string
  mailbox_id: string
  period_start: string
  period_end: string
  amount_cents: number
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
  due_date: string
  created_at: string
  pdf_path?: string
}

// Renter type from spec
export interface Renter {
  renter_id: string
  mailbox_id: string
  full_name: string
  email: string
  phone?: string
  registration_date: string
  is_active: boolean
}

// Types from spec
export interface MailItem {
  mail_item_id: string
  mailbox_id: string
  location_id: string
  package_type: 'correspondence' | 'package'
  status: string
  uploaded_at: string
  received_at: string
  carrier?: string
  tracking_number?: string
  created_by: string
}

export interface Mailbox {
  mailbox_id: string
  operator_id: string
  location_id: string
  pmb: string
  mailbox_name: string
  status: 'active' | 'cancelled'
  offering_plan_id?: string
  created_at: string
}

export interface Request {
  request_id: string
  mail_item_id: string
  mailbox_id: string
  request_type: 'open_scan' | 'forward' | 'shred' | 'recycle' | 'pickup' | 'deposit' | 'weekly_forward' | 'biweekly_forward' | 'leave_at_office'
  request_status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  requested_by_user_id: string
  requested_at: string
  completed_at?: string
  notes?: string
  metadata_json?: Record<string, unknown>
}

export interface AliasSubmission {
  submission_id: string
  company_id: string
  proposed_alias_name: string
  alias_type: string
  submission_reason: string
  employee_notes?: string
  source_ocr_text?: string
  submitter_email: string
  review_status: 'pending' | 'under_review' | 'approved' | 'rejected'
  created_at: string
}

// Browser API Client
class BrowserApiClient {
  private client: SupabaseClient

  constructor() {
    this.client = createClient()
  }

  // Helper to safely get current user ID
  private async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: sessionData } = await this.client.auth.getSession()
      return sessionData.session?.user?.id || null
    } catch (error) {
      // AuthSessionMissingError is expected for unauthenticated users
      return null
    }
  }

  // Operators
  async getUserOperators() {
    const { data, error } = await this.client
      .from('operator_users')
      .select(`
        operator_id,
        operators!inner (
          operator_id,
          operator_name,
          is_active,
          created_at
        )
      `)
      .eq('is_active', true)
    
    if (error) throw error
    
    // Transform to Operator array - operators comes as array from Supabase
    return (data || []).map((item: { operators: Operator[] }) => item.operators?.[0]).filter(Boolean) as Operator[]
  }

  // Locations
  async getOperatorLocations(operatorId: string) {
    const { data, error } = await this.client
      .from('locations')
      .select('*')
      .eq('operator_id', operatorId)
      .eq('is_active', true)
      .order('location_name', { ascending: true })
    
    if (error) throw error
    return data as Location[]
  }

  async getLocationById(locationId: string) {
    const { data, error } = await this.client
      .from('locations')
      .select('*')
      .eq('location_id', locationId)
      .single()
    
    if (error) throw error
    return data as Location
  }

  // Compliance
  async getComplianceCases(filters?: {
    status?: 'compliant' | 'non_compliant' | 'pending' | 'under_review' | 'rejected'
    search?: string
  }) {
    let query = this.client
      .from('compliance_cases')
      .select('*')
      .order('updated_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query
    if (error) throw error

    let cases = data as ComplianceCase[]

    // Client-side search by mailbox_id (until we join with mailboxes table)
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      cases = cases.filter(c =>
        c.mailbox_id.toLowerCase().includes(searchLower)
      )
    }

    return cases
  }

  async updateComplianceStatus(caseId: string, status: string) {
    const { error } = await this.client
      .from('compliance_cases')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('case_id', caseId)

    if (error) throw error
  }

  // Billing - Payment Methods
  async getPaymentMethods() {
    const { data, error } = await this.client
      .from('payment_methods')
      .select('*')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as PaymentMethod[]
  }

  async deletePaymentMethod(paymentMethodId: string) {
    const { error } = await this.client
      .from('payment_methods')
      .delete()
      .eq('payment_method_id', paymentMethodId)
    
    if (error) throw error
  }

  // Billing - Invoices
  async getInvoices(filters?: {
    status?: string
    search?: string
  }) {
    let query = this.client
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    const { data, error } = await query
    if (error) throw error
    
    let invoices = data as Invoice[]
    
    // Client-side search
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      invoices = invoices.filter(i => 
        i.invoice_id.toLowerCase().includes(searchLower) ||
        i.mailbox_id.toLowerCase().includes(searchLower)
      )
    }
    
    return invoices
  }

  // Renters
  async getRenters(filters?: {
    search?: string
    mailboxId?: string
  }) {
    let query = this.client
      .from('renters')
      .select('*')
      .order('full_name', { ascending: true })

    if (filters?.mailboxId) {
      query = query.eq('mailbox_id', filters.mailboxId)
    }

    const { data, error } = await query
    if (error) throw error

    let renters = data as Renter[]

    // Client-side search
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      renters = renters.filter(r =>
        r.full_name.toLowerCase().includes(searchLower) ||
        r.email.toLowerCase().includes(searchLower) ||
        (r.phone?.toLowerCase().includes(searchLower) ?? false)
      )
    }

    return renters
  }

  async getRenterById(renterId: string) {
    const { data, error } = await this.client
      .from('renters')
      .select('*')
      .eq('renter_id', renterId)
      .single()

    if (error) throw error
    return data as Renter
  }

  async createRenter(params: {
    mailboxId: string
    fullName: string
    email: string
    phone?: string
  }) {
    const { data, error } = await this.client
      .from('renters')
      .insert({
        mailbox_id: params.mailboxId,
        full_name: params.fullName,
        email: params.email,
        phone: params.phone,
        registration_date: new Date().toISOString(),
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error
    return data as Renter
  }

  async updateRenter(renterId: string, params: {
    fullName?: string
    email?: string
    phone?: string
    isActive?: boolean
  }) {
    const { data, error } = await this.client
      .from('renters')
      .update({
        full_name: params.fullName,
        email: params.email,
        phone: params.phone,
        is_active: params.isActive,
      })
      .eq('renter_id', renterId)
      .select()
      .single()

    if (error) throw error
    return data as Renter
  }

  async deleteRenter(renterId: string) {
    const { error } = await this.client
      .from('renters')
      .delete()
      .eq('renter_id', renterId)

    if (error) throw error
  }

  // Mailboxes
  async getMailboxes(filters?: {
    status?: 'active' | 'cancelled'
    search?: string
  }) {
    let query = this.client
      .from('mailboxes')
      .select('*')
      .order('pmb', { ascending: true })
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    const { data, error } = await query
    if (error) throw error
    
    let mailboxes = data as Mailbox[]
    
    // Client-side search (until we have full-text search)
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      mailboxes = mailboxes.filter(m => 
        m.pmb.toLowerCase().includes(searchLower) ||
        m.mailbox_name.toLowerCase().includes(searchLower)
      )
    }
    
    return mailboxes
  }

  async getMailboxById(mailboxId: string) {
    const { data, error } = await this.client
      .from('mailboxes')
      .select('*')
      .eq('mailbox_id', mailboxId)
      .single()
    
    if (error) throw error
    return data as Mailbox
  }

  // Dashboard Stats
  async getDashboardStats() {
    const [pendingAliasesResult, todayScansResult] = await Promise.all([
      this.client.from('alias_submissions').select('*', { count: 'exact', head: true }).eq('review_status', 'pending'),
      this.client.from('scanned_mail').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
    ])

    return {
      pendingAliases: pendingAliasesResult.count || 0,
      todayScans: todayScansResult.count || 0,
    }
  }

  // Get Alias Submissions with optional status filter
  async getAliasSubmissions(status?: string) {
    let query = this.client
      .from('alias_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('review_status', status)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as AliasSubmission[]
  }

  // Recent Submissions
  async getRecentSubmissions(limit = 5) {
    const { data, error } = await this.client
      .from('alias_submissions')
      .select('*')
      .eq('review_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data as AliasSubmission[]
  }

  // Recent Activity
  async getRecentActivity(limit = 10) {
    const { data, error } = await this.client
      .from('scanned_mail')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }

  // Alias Actions
  async approveAlias(submissionId: string) {
    const { error } = await this.client.rpc('approve_alias_submission', {
      p_submission_id: submissionId,
      p_review_notes: 'Approved via admin dashboard'
    })
    if (error) throw error
  }

  async rejectAlias(submissionId: string) {
    const { error } = await this.client.rpc('reject_alias_submission', {
      p_submission_id: submissionId,
      p_rejection_reason: 'Rejected via admin dashboard'
    })
    if (error) throw error
  }

  // Scanned Mail (temporary until mail_items table is ready)
  async getScannedMail() {
    const { data, error } = await this.client
      .from('scanned_mail')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Mail Items
  async getMailItems(filters?: {
    status?: string
    packageType?: string
    search?: string
  }) {
    let query = this.client.from('mail_items').select('*')

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.packageType) {
      query = query.eq('package_type', filters.packageType)
    }

    const { data, error } = await query.order('uploaded_at', { ascending: false })
    if (error) throw error
    return data as MailItem[]
  }

  // Requests
  async getRequests(status?: string) {
    let query = this.client.from('requests').select('*')

    if (status) {
      query = query.eq('request_status', status)
    }

    const { data, error } = await query.order('requested_at', { ascending: false })
    if (error) throw error
    return data as Request[]
  }

  // ===== CUSTOMER API METHODS =====

  // Get mail items for a specific mailbox (customer view)
  async getCustomerMailItems(mailboxId: string, filters?: {
    status?: string
    search?: string
  }) {
    let query = this.client
      .from('mail_items')
      .select(`
        *,
        mailboxes!inner (
          pmb,
          mailbox_name
        )
      `)
      .eq('mailbox_id', mailboxId)

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query.order('uploaded_at', { ascending: false })
    if (error) throw error

    // Also fetch any active requests for these mail items
    const mailItemIds = (data || []).map((item: { mail_item_id: string }) => item.mail_item_id)
    
    let activeRequests: { mail_item_id: string }[] = []
    if (mailItemIds.length > 0) {
      const { data: requestsData, error: requestsError } = await this.client
        .from('requests')
        .select('mail_item_id')
        .in('mail_item_id', mailItemIds)
        .in('request_status', ['pending', 'in_progress'])
      
      if (!requestsError && requestsData) {
        activeRequests = requestsData as { mail_item_id: string }[]
      }
    }

    const activeRequestIds = new Set(activeRequests.map(r => r.mail_item_id))

    // Transform to customer view
    return (data || []).map((item: {
      mail_item_id: string
      mailbox_id: string
      mailboxes: { pmb: string; mailbox_name: string }
      package_type: 'correspondence' | 'package'
      status: string
      uploaded_at: string
      received_at: string
      carrier?: string
      tracking_number?: string
      photo_url?: string
    }) => ({
      mail_item_id: item.mail_item_id,
      mailbox_id: item.mailbox_id,
      pmb: item.mailboxes?.pmb || '',
      mailbox_name: item.mailboxes?.mailbox_name || '',
      package_type: item.package_type,
      status: item.status,
      uploaded_at: item.uploaded_at,
      received_at: item.received_at,
      carrier: item.carrier,
      tracking_number: item.tracking_number,
      photo_url: item.photo_url,
      has_active_request: activeRequestIds.has(item.mail_item_id),
    }))
  }

  // Get a single mail item for customer view
  async getCustomerMailItem(mailboxId: string, mailItemId: string) {
    const { data, error } = await this.client
      .from('mail_items')
      .select(`
        *,
        mailboxes!inner (
          pmb,
          mailbox_name
        )
      `)
      .eq('mailbox_id', mailboxId)
      .eq('mail_item_id', mailItemId)
      .single()

    if (error) throw error

    // Get active requests for this mail item
    const { data: requestsData } = await this.client
      .from('requests')
      .select('*')
      .eq('mail_item_id', mailItemId)
      .order('requested_at', { ascending: false })

    const hasActiveRequest = (requestsData || []).some(
      (r: { request_status: string }) => ['pending', 'in_progress'].includes(r.request_status)
    )

    return {
      ...data,
      has_active_request: hasActiveRequest,
      requests: requestsData || [],
    }
  }

  // Get customer's mailboxes (where they have membership)
  async getCustomerMailboxes() {
    const userId = await this.getCurrentUserId()
    
    if (!userId) {
      throw new Error('Not authenticated')
    }

    const { data, error } = await this.client
      .from('mailbox_memberships')
      .select(`
        *,
        mailboxes!inner (
          *,
          locations (
            location_name
          )
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')

    if (error) throw error

    return (data || []).map((membership: {
      mailboxes: {
        mailbox_id: string
        operator_id: string
        location_id: string
        pmb: string
        mailbox_name: string
        status: 'active' | 'cancelled'
        offering_plan_id?: string
        created_at: string
        locations?: { location_name: string }
      }
    }) => ({
      ...membership.mailboxes,
      location_name: membership.mailboxes.locations?.location_name || '',
    }))
  }

  // Get compliance status for a mailbox
  async getCustomerComplianceStatus(mailboxId: string) {
    const { data, error } = await this.client
      .from('compliance_cases')
      .select('*')
      .eq('mailbox_id', mailboxId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
    return data
  }

  // ===== CUSTOMER REQUEST API =====

  // Create a new request for a mail item
  async createRequest(params: {
    mail_item_id: string
    mailbox_id: string
    request_type: 'open_scan' | 'forward' | 'shred' | 'recycle' | 'pickup' | 'deposit' | 'leave_at_office' | 'weekly_forward' | 'biweekly_forward'
    notes?: string
    metadata?: Record<string, unknown>
  }) {
    const userId = await this.getCurrentUserId()
    
    if (!userId) {
      throw new Error('Not authenticated')
    }

    // Check for existing active request on this mail item
    const { data: existingRequests, error: checkError } = await this.client
      .from('requests')
      .select('request_id')
      .eq('mail_item_id', params.mail_item_id)
      .in('request_status', ['pending', 'in_progress'])
      .limit(1)

    if (checkError) throw checkError
    if (existingRequests && existingRequests.length > 0) {
      throw new Error('An active request already exists for this mail item')
    }

    // Create the request
    const { data, error } = await this.client
      .from('requests')
      .insert({
        mail_item_id: params.mail_item_id,
        mailbox_id: params.mailbox_id,
        request_type: params.request_type,
        request_status: 'pending',
        requested_by_user_id: userId,
        requested_at: new Date().toISOString(),
        notes: params.notes,
        metadata_json: params.metadata,
      })
      .select()
      .single()

    if (error) throw error

    // Update mail item status to reflect the request
    const statusMap: Record<string, string> = {
      'open_scan': 'open_scan_requested',
      'forward': 'forward_requested',
      'shred': 'shred_requested',
      'recycle': 'recycle_requested',
      'pickup': 'pickup_requested',
      'deposit': 'deposit_requested',
      'leave_at_office': 'left_at_office',
      'weekly_forward': 'forward_requested',
      'biweekly_forward': 'forward_requested',
    }

    const { error: updateError } = await this.client
      .from('mail_items')
      .update({ status: statusMap[params.request_type] })
      .eq('mail_item_id', params.mail_item_id)

    if (updateError) {
      console.error('Failed to update mail item status:', updateError)
      // Don't throw here - the request was created successfully
    }

    return data
  }

  // Get customer's requests
  async getCustomerRequests(mailboxId?: string, status?: string) {
    const userId = await this.getCurrentUserId()
    
    if (!userId) {
      throw new Error('Not authenticated')
    }

    let query = this.client
      .from('requests')
      .select(`
        *,
        mail_items (
          mail_item_id,
          package_type,
          photo_url
        )
      `)
      .eq('requested_by_user_id', userId)
      .order('requested_at', { ascending: false })

    if (mailboxId) {
      query = query.eq('mailbox_id', mailboxId)
    }
    if (status) {
      query = query.eq('request_status', status)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Cancel a pending request (customer can only cancel their own pending requests)
  async cancelRequest(requestId: string) {
    const userId = await this.getCurrentUserId()
    
    if (!userId) {
      throw new Error('Not authenticated')
    }

    // First verify the request belongs to the user and is pending
    const { data: request, error: fetchError } = await this.client
      .from('requests')
      .select('request_status, mail_item_id')
      .eq('request_id', requestId)
      .eq('requested_by_user_id', userId)
      .single()

    if (fetchError) throw fetchError
    if (!request) throw new Error('Request not found')
    if (request.request_status !== 'pending') {
      throw new Error('Only pending requests can be cancelled')
    }

    // Cancel the request
    const { error } = await this.client
      .from('requests')
      .update({ 
        request_status: 'cancelled',
        completed_at: new Date().toISOString()
      })
      .eq('request_id', requestId)

    if (error) throw error

    // Revert mail item status back to uploaded
    const { error: updateError } = await this.client
      .from('mail_items')
      .update({ status: 'uploaded' })
      .eq('mail_item_id', request.mail_item_id)

    if (updateError) {
      console.error('Failed to revert mail item status:', updateError)
    }
  }

  // ===== FILE UPLOAD API =====
  // Get signed upload URL for compliance documents
  async getComplianceUploadUrl(params: {
    mailboxId: string
    documentType: 'id_front' | 'id_back' | 'address_proof'
    fileName: string
    contentType: string
  }) {
    const fileExt = params.fileName.split('.').pop() || 'jpg'
    const filePath = `${params.mailboxId}/${params.documentType}_${Date.now()}.${fileExt}`
    
    const { data, error } = await this.client
      .storage
      .from('compliance-documents')
      .createSignedUploadUrl(filePath)
    
    if (error) throw error
    return {
      signedUrl: data.signedUrl,
      filePath: data.path,
    }
  }

  // Upload file directly to storage using signed URL
  async uploadToSignedUrl(signedUrl: string, file: File) {
    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }
  }

  // Get signed download URL for viewing
  async getComplianceDownloadUrl(filePath: string) {
    const { data, error } = await this.client
      .storage
      .from('compliance-documents')
      .createSignedUrl(filePath, 3600) // 1 hour expiry
    
    if (error) throw error
    return data.signedUrl
  }

  // ===== COMPLIANCE DOCUMENT API =====
  // Save compliance document record (stub - will be implemented when DB schema is ready)
  async saveComplianceDocument(params: {
    mailboxId: string
    documentType: 'id_front' | 'id_back' | 'address_proof'
    storagePath: string
    fileName: string
    metadata?: Record<string, unknown>
  }) {
    // Stub: Will save to compliance_documents table when created
    // For now, just return success
    console.log('Saving compliance document:', params)
    return { success: true }
  }

  // Get compliance documents for a mailbox (stub)
  async getComplianceDocuments(mailboxId: string) {
    // Stub: Will fetch from compliance_documents table when created
    return {
      idFront: null,
      idBack: null,
      addressProof: null,
    }
  }

  // Submit compliance case for review
  async submitComplianceCase(params: {
    mailboxId: string
    signatureSvg: string
    formData: {
      idType: string
      address: {
        line1: string
        line2?: string
        city: string
        state: string
        zip: string
      }
      placeOfRegistration: string
      isBusinessUse: boolean
      businessName?: string
      renters: Array<{ name: string; email: string; phone?: string }>
    }
  }) {
    // First upload signature to storage
    const signatureBlob = new Blob([params.signatureSvg], { type: 'image/svg+xml' })
    const signatureFile = new File([signatureBlob], 'signature.svg', { type: 'image/svg+xml' })

    const { signedUrl, filePath: signaturePath } = await this.getComplianceUploadUrl({
      mailboxId: params.mailboxId,
      documentType: 'address_proof', // Reusing for now, should be 'signature'
      fileName: 'signature.svg',
      contentType: 'image/svg+xml',
    })

    await this.uploadToSignedUrl(signedUrl, signatureFile)

    // Update compliance case status to under_review
    const { error } = await this.client
      .from('compliance_cases')
      .update({
        status: 'under_review',
        updated_at: new Date().toISOString(),
      })
      .eq('mailbox_id', params.mailboxId)

    if (error) throw error

    // TODO: Save signature reference and form data to database when schema is ready
    console.log('Compliance case submitted:', {
      mailboxId: params.mailboxId,
      signaturePath,
      formData: params.formData,
    })

    return { success: true, signaturePath }
  }
}

// Export singleton instance for browser
export const api = new BrowserApiClient()
