'use client'

import { useEffect, useState } from 'react'
import { supabase, type ScannedMail } from '@/lib/supabase'
import { StatusPill } from '@/components/ui/StatusPill'
import { Inbox, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function CustomerDashboard() {
  const [mailItems, setMailItems] = useState<ScannedMail[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchMailItems()
  }, [])

  async function fetchMailItems() {
    try {
      // TODO: Filter by current user's mailbox
      const { data, error } = await supabase
        .from('scanned_mail')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setMailItems(data || [])
    } catch (error) {
      console.error('Error fetching mail:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFCC00]"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Mail</h1>
        <p className="text-gray-500 mt-1">View and manage your incoming mail</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="New Mail"
          value={mailItems.length}
          icon={<Inbox className="w-5 h-5 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Pending Actions"
          value={0}
          icon={<Clock className="w-5 h-5 text-yellow-600" />}
          color="bg-yellow-50"
        />
        <StatCard
          title="Processed"
          value={0}
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Requires Attention"
          value={0}
          icon={<AlertCircle className="w-5 h-5 text-red-600" />}
          color="bg-red-50"
        />
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Mail</h2>
        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Mail Items */}
      {mailItems.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mailItems.map((item) => (
              <MailCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
            {mailItems.map((item) => (
              <MailListItem key={item.id} item={item} />
            ))}
          </div>
        )
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

function MailCard({ item }: { item: ScannedMail }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-100 relative">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt="Mail"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Inbox className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusPill status="received" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {item.raw_ocr_text || 'No text detected'}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(item.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

function MailListItem({ item }: { item: ScannedMail }) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt="Mail"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Inbox className="w-6 h-6" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">
          {item.raw_ocr_text || 'No text detected'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(item.created_at).toLocaleDateString()}
        </p>
      </div>
      <StatusPill status="received" />
    </div>
  )
}

function StatCard({ title, value, icon, color }: {
  title: string
  value: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Inbox className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">No mail found</h3>
      <p className="text-gray-500 mt-1">New mail will appear here when it arrives</p>
    </div>
  )
}
