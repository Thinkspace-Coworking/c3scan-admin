'use client'

import { useEffect, useState, useCallback } from 'react'
import { api, type Mailbox } from '@/lib/api'
import { StatusPill } from '@/components/ui/StatusPill'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { Search, Filter, Plus, Mail, Users, ShieldCheck, MoreHorizontal, Loader2, AlertCircle, RefreshCw, ChevronRight, Building2 } from 'lucide-react'
import { MailboxDetail } from '@/components/ui/MailboxDetail'

export default function MailboxesPage() {
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'cancelled'>('all')
  const [selectedMailbox, setSelectedMailbox] = useState<Mailbox | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchMailboxes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await api.getMailboxes({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined
      })
      
      setMailboxes(data)
    } catch (err) {
      console.error('Error fetching mailboxes:', err)
      setError(err instanceof Error ? err.message : 'Failed to load mailboxes')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, searchQuery])

  useEffect(() => {
    fetchMailboxes()
  }, [fetchMailboxes])

  const activeCount = mailboxes.filter(m => m.status === 'active').length
  const cancelledCount = mailboxes.filter(m => m.status === 'cancelled').length

  return (
    <>
      <CommandPalette />
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mailboxes</h1>
            <p className="text-gray-500 mt-1">
              Manage customer mailboxes and PMB assignments
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Mailbox
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#FFCC00]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mailboxes.length}</p>
              <p className="text-sm text-gray-500">Total Mailboxes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{cancelledCount}</p>
              <p className="text-sm text-gray-500">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 flex-1">{error}</p>
          <button 
            onClick={fetchMailboxes}
            className="flex items-center gap-1.5 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by PMB or mailbox name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mailboxes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFCC00]" />
          </div>
        ) : mailboxes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PMB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mailbox Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Renters
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mailboxes.map((mailbox) => (
                  <tr 
                    key={mailbox.mailbox_id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedMailbox(mailbox)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-gray-900">{mailbox.pmb}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{mailbox.mailbox_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={mailbox.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(mailbox.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>—</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedMailbox(mailbox)
                        }}
                      >
                        View
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No mailboxes found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create a mailbox to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Mailbox Detail Panel */}
      {selectedMailbox && (
        <MailboxDetail
          mailbox={selectedMailbox}
          onClose={() => setSelectedMailbox(null)}
        />
      )}
    </>
  )
}
