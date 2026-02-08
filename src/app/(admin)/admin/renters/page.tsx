'use client'

import { useEffect, useState, useCallback } from 'react'
import { api, type Renter } from '@/lib/api'
import { StatusPill } from '@/components/ui/StatusPill'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { Search, Users, Mail, Phone, Calendar, Plus, ChevronRight, Loader2, AlertCircle, RefreshCw, Building2 } from 'lucide-react'
import { RenterDetail } from '@/components/ui/RenterDetail'

export default function RentersPage() {
  const [renters, setRenters] = useState<Renter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRenter, setSelectedRenter] = useState<Renter | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchRenters = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await api.getRenters({
        search: searchQuery || undefined
      })

      setRenters(data)
    } catch (err) {
      console.error('Error fetching renters:', err)
      setError(err instanceof Error ? err.message : 'Failed to load renters')
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchRenters()
  }, [fetchRenters])

  const activeCount = renters.filter(r => r.is_active).length
  const inactiveCount = renters.filter(r => !r.is_active).length

  return (
    <>
      <CommandPalette />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Renters</h1>
            <p className="text-gray-500 mt-1">
              Manage renters for USPS Form 1583 compliance
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Renter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#FFCC00]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{renters.length}</p>
              <p className="text-sm text-gray-500">Total Renters</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
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
              <Building2 className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(renters.map(r => r.mailbox_id)).size}
              </p>
              <p className="text-sm text-gray-500">Unique Mailboxes</p>
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
            onClick={fetchRenters}
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

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Renters Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFCC00]" />
          </div>
        ) : renters.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mailbox
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {renters.map((renter) => (
                  <tr
                    key={renter.renter_id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedRenter(renter)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900">{renter.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {renter.email}
                        </div>
                        {renter.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {renter.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={renter.is_active ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(renter.registration_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {renter.mailbox_id.substring(0, 8)}...
                      </code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedRenter(renter)
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
              <Users className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No renters found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Add renters to mailboxes for USPS compliance'}
            </p>
          </div>
        )}
      </div>

      {/* Renter Detail Panel */}
      {selectedRenter && (
        <RenterDetail
          renter={selectedRenter}
          onClose={() => setSelectedRenter(null)}
        />
      )}
    </>
  )
}
