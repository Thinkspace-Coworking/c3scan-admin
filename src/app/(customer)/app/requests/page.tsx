'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { StatusPill } from '@/components/ui/StatusPill'
import { 
  Search, 
  Filter, 
  Package, 
  Mail,
  Scan,
  Send,
  Trash2,
  Recycle,
  User,
  Banknote,
  Home,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Inbox,
  X
} from 'lucide-react'

interface RequestWithMail {
  request_id: string
  mail_item_id: string
  mailbox_id: string
  request_type: string
  request_status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  requested_at: string
  completed_at?: string
  notes?: string
  mail_items?: {
    mail_item_id: string
    package_type: 'correspondence' | 'package'
    photo_url?: string
  }
}

const statusFilters = [
  { value: 'all', label: 'All Requests', color: 'bg-gray-100 text-gray-700' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-500' },
]

const requestTypeFilters = [
  { value: 'all', label: 'All Types' },
  { value: 'open_scan', label: 'Open & Scan' },
  { value: 'forward', label: 'Forward' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'shred', label: 'Shred' },
  { value: 'recycle', label: 'Recycle' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'leave_at_office', label: 'Leave at Office' },
]

const requestTypeIcons: Record<string, typeof Scan> = {
  open_scan: Scan,
  forward: Send,
  pickup: User,
  shred: Trash2,
  recycle: Recycle,
  deposit: Banknote,
  leave_at_office: Home,
}

const requestTypeColors: Record<string, string> = {
  open_scan: 'bg-blue-50 text-blue-600',
  forward: 'bg-purple-50 text-purple-600',
  pickup: 'bg-orange-50 text-orange-600',
  shred: 'bg-red-50 text-red-600',
  recycle: 'bg-green-50 text-green-600',
  deposit: 'bg-emerald-50 text-emerald-600',
  leave_at_office: 'bg-gray-50 text-gray-600',
}

export default function CustomerRequestsPage() {
  const [requests, setRequests] = useState<RequestWithMail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await api.getCustomerRequests(
        undefined, // all mailboxes
        statusFilter === 'all' ? undefined : statusFilter
      )
      
      setRequests(data as RequestWithMail[])
    } catch (err) {
      console.error('Error fetching requests:', err)
      setError(err instanceof Error ? err.message : 'Failed to load requests')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleCancelRequest = useCallback(async (requestId: string) => {
    try {
      setCancellingId(requestId)
      setError(null)
      
      await api.cancelRequest(requestId)
      
      await fetchRequests()
      setSuccessMessage('Request cancelled successfully')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Error cancelling request:', err)
      setError(err instanceof Error ? err.message : 'Failed to cancel request')
    } finally {
      setCancellingId(null)
    }
  }, [fetchRequests])

  // Filter requests client-side for search and type
  const filteredRequests = requests.filter(req => {
    const matchesSearch = searchQuery === '' || 
      req.request_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.mail_item_id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = typeFilter === 'all' || req.request_type === typeFilter
    
    return matchesSearch && matchesType
  })

  // Count by status
  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.request_status === 'pending').length,
    in_progress: requests.filter(r => r.request_status === 'in_progress').length,
    completed: requests.filter(r => r.request_status === 'completed').length,
    cancelled: requests.filter(r => r.request_status === 'cancelled').length,
  }

  const activeRequestsCount = counts.pending + counts.in_progress

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-gray-500">
            {activeRequestsCount > 0 
              ? `${activeRequestsCount} active request${activeRequestsCount !== 1 ? 's' : ''}`
              : 'No active requests'
            }
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 flex-1">{error}</p>
          <button 
            onClick={fetchRequests}
            className="flex items-center gap-1.5 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === filter.value
                ? filter.color.replace('bg-', 'bg-').replace('text-', 'ring-2 ring-offset-2 ring-')
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            } ${statusFilter === filter.value ? filter.color : ''}`}
          >
            {filter.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              statusFilter === filter.value ? 'bg-white/50' : 'bg-gray-100'
            }`}>
              {counts[filter.value as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Type Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent bg-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {requestTypeFilters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFCC00]" />
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const IconComponent = requestTypeIcons[request.request_type] || Mail
            const typeColor = requestTypeColors[request.request_type] || 'bg-gray-50 text-gray-600'
            
            return (
              <div
                key={request.request_id}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Mail Item Preview */}
                  <Link
                    href={`/app/${request.mailbox_id}/mail/${request.mail_item_id}`}
                    className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    {request.mail_items?.photo_url ? (
                      <img
                        src={request.mail_items.photo_url}
                        alt="Mail item"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {request.mail_items?.package_type === 'package' ? (
                          <Package className="w-8 h-8 text-gray-400" />
                        ) : (
                          <Mail className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    )}
                  </Link>

                  {/* Request Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${typeColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {request.request_type.replace('_', ' ')}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Request #{request.request_id.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <StatusPill status={request.request_status} />
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          Submitted {new Date(request.requested_at).toLocaleDateString()}
                        </span>
                        {request.completed_at && (
                          <>
                            <span>•</span>
                            <span>
                              Completed {new Date(request.completed_at).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {request.request_status === 'pending' && (
                          <button
                            onClick={() => handleCancelRequest(request.request_id)}
                            disabled={cancellingId === request.request_id}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingId === request.request_id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4" />
                                Cancel
                              </>
                            )}
                          </button>
                        )}
                        <Link
                          href={`/app/${request.mailbox_id}/mail/${request.mail_item_id}`}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Mail
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests Found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            {searchQuery || typeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'You haven\'t made any requests yet. Browse your mail to request actions.'}
          </p>
          <Link
            href="/app/select-mailbox"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors"
          >
            Go to Mailboxes
          </Link>
        </div>
      )}
    </div>
  )
}
