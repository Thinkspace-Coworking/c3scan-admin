import { createClient } from '@/lib/supabase-browser'
import type { SupabaseClient } from '@supabase/supabase-js'

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
}

// Export singleton instance for browser
export const api = new BrowserApiClient()
