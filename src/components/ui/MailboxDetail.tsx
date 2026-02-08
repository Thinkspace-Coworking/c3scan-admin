'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, Mail, Users, ShieldCheck, Building2, Calendar, Phone, MoreHorizontal, ExternalLink, Loader2, AlertCircle } from 'lucide-react'
import { StatusPill } from '@/components/ui/StatusPill'
import type { Mailbox } from '@/lib/api'

interface MailboxDetailProps {
  mailbox: Mailbox
  onClose: () => void
}

interface Renter {
  renter_id: string
  full_name: string
  email: string
  phone?: string
  is_active: boolean
}

interface MailItem {
  mail_item_id: string
  status: string
  uploaded_at: string
  package_type: string
}

export function MailboxDetail({ mailbox, onClose }: MailboxDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'renters' | 'mail' | 'compliance'>('overview')
  const [renters, setRenters] = useState<Renter[]>([])
  const [recentMail, setRecentMail] = useState<MailItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMailboxData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Fetch renters and recent mail from API
      // For now, simulate empty states
      await new Promise(resolve => setTimeout(resolve, 300))
      setRenters([])
      setRecentMail([])
    } catch (err) {
      console.error('Error fetching mailbox data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load mailbox details')
    } finally {
      setLoading(false)
    }
  }, [mailbox.mailbox_id])

  useEffect(() => {
    fetchMailboxData()
  }, [fetchMailboxData])

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm text-gray-500">PMB {mailbox.pmb}</span>
              <StatusPill status={mailbox.status} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{mailbox.mailbox_name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="More actions"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-gray-200 px-6">
          {(['overview', 'renters', 'mail', 'compliance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-[#FFCC00] text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-[#FFCC00]" />
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Users className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{renters.length}</p>
                      <p className="text-xs text-gray-500">Renters</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Mail className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{recentMail.length}</p>
                      <p className="text-xs text-gray-500">Recent Mail</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <ShieldCheck className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">—</p>
                      <p className="text-xs text-gray-500">Compliance</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Mailbox ID</span>
                        <code className="text-sm text-gray-900">{mailbox.mailbox_id.substring(0, 8)}...</code>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">PMB Number</span>
                        <span className="font-mono text-gray-900">{mailbox.pmb}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Status</span>
                        <StatusPill status={mailbox.status} />
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Created</span>
                        <span className="text-gray-900">
                          {new Date(mailbox.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Location</span>
                        <span className="text-gray-900">{mailbox.location_id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">Manage Renters</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">View Mail History</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">View Compliance</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Renters Tab */}
              {activeTab === 'renters' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Renters ({renters.length})
                    </h3>
                    <button className="px-3 py-1.5 bg-[#FFCC00] text-black text-sm font-medium rounded-lg hover:bg-[#E6B800] transition-colors">
                      Add Renter
                    </button>
                  </div>
                  
                  {renters.length > 0 ? (
                    <div className="space-y-3">
                      {renters.map((renter) => (
                        <div 
                          key={renter.renter_id}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{renter.full_name}</p>
                                <p className="text-sm text-gray-500">{renter.email}</p>
                              </div>
                            </div>
                            {renter.is_active && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          {renter.phone && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-4 h-4" />
                              {renter.phone}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No renters yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Add renters for USPS Form 1583 compliance
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Mail Tab */}
              {activeTab === 'mail' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Recent Mail
                  </h3>
                  
                  {recentMail.length > 0 ? (
                    <div className="space-y-3">
                      {recentMail.map((item) => (
                        <div 
                          key={item.mail_item_id}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900 capitalize">
                                  {item.package_type}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(item.uploaded_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <StatusPill status={item.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No mail items yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Mail will appear here when received
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Compliance Tab */}
              {activeTab === 'compliance' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    USPS Form 1583 Compliance
                  </h3>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Pending Setup</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          This mailbox needs renters and compliance documents to be fully compliant with USPS regulations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Required Actions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-gray-700">Add at least one renter</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-gray-700">Upload ID verification documents</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-gray-700">Complete Form 1583 signing</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors">
                    Start Compliance Workflow
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
