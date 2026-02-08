'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, Users, Mail, Phone, Calendar, Building2, ShieldCheck, ExternalLink, Loader2, AlertCircle, FileText } from 'lucide-react'
import { StatusPill } from '@/components/ui/StatusPill'
import type { Renter, Mailbox } from '@/lib/api'
import { api } from '@/lib/api'

interface RenterDetailProps {
  renter: Renter
  onClose: () => void
}

interface ComplianceDocument {
  document_id: string
  document_type: string
  verified_at?: string
}

export function RenterDetail({ renter, onClose }: RenterDetailProps) {
  const [mailbox, setMailbox] = useState<Mailbox | null>(null)
  const [complianceDocs, setComplianceDocs] = useState<ComplianceDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRenterData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch associated mailbox
      const mailboxData = await api.getMailboxById(renter.mailbox_id)
      setMailbox(mailboxData)

      // TODO: Fetch compliance documents when API is ready
      setComplianceDocs([])
    } catch (err) {
      console.error('Error fetching renter data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load renter details')
    } finally {
      setLoading(false)
    }
  }, [renter.mailbox_id])

  useEffect(() => {
    fetchRenterData()
  }, [fetchRenterData])

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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{renter.full_name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <StatusPill status={renter.is_active ? 'active' : 'inactive'} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
            <div className="space-y-8">
              {/* Contact Information */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{renter.email}</p>
                    </div>
                  </div>
                  {renter.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900">{renter.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Registration Date</p>
                      <p className="text-gray-900">
                        {new Date(renter.registration_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Associated Mailbox */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                  Associated Mailbox
                </h3>
                {mailbox ? (
                  <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-[#FFCC00]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{mailbox.mailbox_name}</p>
                          <p className="text-sm text-gray-500">PMB {mailbox.pmb}</p>
                        </div>
                      </div>
                      <StatusPill status={mailbox.status} />
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Mailbox
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Mailbox not found</p>
                  </div>
                )}
              </section>

              {/* Compliance Documents */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Compliance Documents
                </h3>

                {complianceDocs.length > 0 ? (
                  <div className="space-y-3">
                    {complianceDocs.map((doc) => (
                      <div
                        key={doc.document_id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.document_type}</p>
                            {doc.verified_at && (
                              <p className="text-sm text-gray-500">
                                Verified: {new Date(doc.verified_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">No Documents</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Compliance documents have not been uploaded yet. Required for USPS Form 1583.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Actions */}
              <section>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                  Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">View Compliance History</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">Send Message</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </section>

              {/* Renter ID */}
              <section className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Renter ID</span>
                  <code className="text-gray-600">{renter.renter_id}</code>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
