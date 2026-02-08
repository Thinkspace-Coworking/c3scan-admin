'use client'

import { useEffect, useState } from 'react'
import { supabase, type ScannedMail } from '@/lib/supabase'
import { StatusPill } from '@/components/ui/StatusPill'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { UploadMailModal } from '@/components/ui/UploadMailModal'
import { Search, Filter, Upload, Package, Mail, MoreHorizontal } from 'lucide-react'

// Extended type for mail items based on spec
interface MailItem {
  mail_item_id: string
  pmb: string
  mailbox_name: string
  package_type: 'correspondence' | 'package'
  status: string
  uploaded_at: string
  carrier?: string
  tracking_number?: string
  photo_url?: string
}

const packageTypeLabels: Record<string, string> = {
  correspondence: 'Correspondence',
  package: 'Package'
}

export default function MailPage() {
  const [mailItems, setMailItems] = useState<MailItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [packageTypeFilter, setPackageTypeFilter] = useState<string>('all')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  useEffect(() => {
    fetchMailItems()
  }, [statusFilter, packageTypeFilter])

  async function fetchMailItems() {
    try {
      setLoading(true)
      
      // For now, using scanned_mail table as the data source
      // TODO: Migrate to proper mail_item table per spec v0.2.1
      let query = supabase
        .from('scanned_mail')
        .select('*')
        .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error

      // Transform scanned_mail data to MailItem format
      // This is a temporary mapping until the proper mail_item table is set up
      const transformedData: MailItem[] = (data || []).map((item: ScannedMail) => ({
        mail_item_id: item.id,
        pmb: item.matched_company_id?.substring(0, 8) || 'Unknown',
        mailbox_name: item.matched_company_id ? `Mailbox ${item.matched_company_id.substring(0, 4)}` : 'Unassigned',
        package_type: item.scan_mode === 'package' ? 'package' : 'correspondence',
        status: item.matched_company_id ? 'uploaded' : 'unassigned',
        uploaded_at: item.created_at,
        photo_url: item.photo_url
      }))

      setMailItems(transformedData)
    } catch (error) {
      console.error('Error fetching mail items:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter mail items based on search query
  const filteredMailItems = mailItems.filter(item => {
    const matchesSearch = 
      item.pmb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mailbox_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mail_item_id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesType = packageTypeFilter === 'all' || item.package_type === packageTypeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <>
      <CommandPalette />
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mail Items</h1>
            <p className="text-gray-500 mt-1">
              View and manage incoming mail and packages
            </p>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Mail
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by PMB, mailbox name, or mail ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="uploaded">Uploaded</option>
              <option value="open_scan_requested">Open & Scan Requested</option>
              <option value="forward_requested">Forward Requested</option>
              <option value="pickup_requested">Pickup Requested</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Package Type Filter */}
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-400" />
            <select
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
              value={packageTypeFilter}
              onChange={(e) => setPackageTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="correspondence">Correspondence</option>
              <option value="package">Package</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mail Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFCC00]"></div>
          </div>
        ) : filteredMailItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mail ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PMB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mailbox
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMailItems.map((item) => (
                  <tr key={item.mail_item_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {item.mail_item_id.substring(0, 8)}...
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{item.pmb}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{item.mailbox_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {packageTypeLabels[item.package_type]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
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
            <p className="text-gray-500">No mail items found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery || statusFilter !== 'all' || packageTypeFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'New mail will appear here when scanned or uploaded'}
            </p>
          </div>
        )}
      </div>

      <UploadMailModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => fetchMailItems()}
      />
    </>
  )
}
