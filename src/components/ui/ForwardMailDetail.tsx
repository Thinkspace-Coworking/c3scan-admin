'use client'

import { useState } from 'react'
import { StatusPill } from '@/components/ui/StatusPill'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Upload, 
  FileText, 
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  Package
} from 'lucide-react'

interface RequestDetailProps {
  requestId: string
  onClose: () => void
}

// Mock request data
const mockRequest = {
  request_id: 'req-002',
  request_type: 'forward',
  status: 'pending',
  mailbox_name: 'TechStart Inc',
  pmb: '1002',
  mail_item_id: 'mail-456',
  requested_by: 'sarah@techstart.com',
  requested_at: '2026-02-08T09:15:00Z',
  recipient_name: 'Sarah Johnson',
  address_line1: '123 Main Street',
  address_line2: 'Suite 100',
  city: 'Seattle',
  state: 'WA',
  postal_code: '98101',
  country: 'US',
  carrier: 'USPS',
  service: 'First Class',
}

const mockEvents = [
  { id: 1, type: 'created', user: 'sarah@techstart.com', timestamp: '2026-02-08T09:15:00Z', message: 'Request created' },
  { id: 2, type: 'viewed', user: 'admin@thinkspace.com', timestamp: '2026-02-08T10:30:00Z', message: 'Request viewed by staff' },
]

const mockNotes: { id: number; user: string; text: string; timestamp: string; isStaffOnly: boolean }[] = []

export function ForwardMailDetail({ requestId, onClose }: RequestDetailProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'activity'>('details')
  const [newNote, setNewNote] = useState('')
  const [isStaffOnly, setIsStaffOnly] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleForward = async () => {
    setIsProcessing(true)
    // TODO: Implement forward workflow
    // 1. Validate address
    // 2. Create shipment via EasyPost
    // 3. Store label as attachment
    // 4. Update request status
    setTimeout(() => {
      setIsProcessing(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Detail Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Forward Mail</h2>
                <StatusPill status={mockRequest.status} />
              </div>
              <p className="text-sm text-gray-500">
                Request {mockRequest.request_id} • Mail {mockRequest.mail_item_id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-[#FFCC00] text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-[#FFCC00] text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'activity'
                ? 'border-[#FFCC00] text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Activity
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Mail Preview */}
              <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center h-48">
                <div className="text-center text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-2" />
                  <p>Envelope image preview</p>
                </div>
              </div>

              {/* Mailbox Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Mailbox</h3>
                <p className="font-medium text-gray-900">{mockRequest.mailbox_name}</p>
                <p className="text-sm text-gray-500">PMB {mockRequest.pmb}</p>
              </div>

              {/* Forward Destination */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Forward Destination</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-gray-900">{mockRequest.recipient_name}</p>
                  <p className="text-gray-600">{mockRequest.address_line1}</p>
                  {mockRequest.address_line2 && (
                    <p className="text-gray-600">{mockRequest.address_line2}</p>
                  )}
                  <p className="text-gray-600">
                    {mockRequest.city}, {mockRequest.state} {mockRequest.postal_code}
                  </p>
                  <p className="text-gray-600">{mockRequest.country}</p>
                </div>
              </div>

              {/* Carrier & Service */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Carrier</h3>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00]">
                    <option>USPS</option>
                    <option>UPS</option>
                    <option>FedEx</option>
                    <option>DHL</option>
                  </select>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Service</h3>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00]">
                    <option>First Class</option>
                    <option>Priority</option>
                    <option>Express</option>
                    <option>Ground</option>
                  </select>
                </div>
              </div>

              {/* Requested By */}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Requested by {mockRequest.requested_by}</span>
                <span className="text-gray-400">•</span>
                <Clock className="w-4 h-4" />
                <span>{new Date(mockRequest.requested_at).toLocaleString()}</span>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Add Note */}
              <div className="border border-gray-200 rounded-lg p-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full resize-none outline-none text-gray-700"
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={isStaffOnly}
                      onChange={(e) => setIsStaffOnly(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Staff only
                  </label>
                  <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800">
                    Add Note
                  </button>
                </div>
              </div>

              {/* Notes List */}
              {mockNotes.length > 0 ? (
                mockNotes.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{note.user}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(note.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{note.text}</p>
                    {note.isStaffOnly && (
                      <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Staff only
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No notes yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {mockEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {event.type === 'created' && <Send className="w-4 h-4 text-gray-500" />}
                    {event.type === 'viewed' && <User className="w-4 h-4 text-gray-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{event.message}</p>
                    <p className="text-sm text-gray-500">
                      by {event.user} • {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={handleForward}
            disabled={isProcessing}
            className="w-full py-3 bg-[#10B981] text-white font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Forward Mail
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
