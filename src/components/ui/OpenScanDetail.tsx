'use client'

import { useState, useRef } from 'react'
import { StatusPill } from '@/components/ui/StatusPill'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Scan, 
  Upload, 
  FileText, 
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  FileImage,
  Trash2
} from 'lucide-react'

interface RequestDetailProps {
  requestId: string
  onClose: () => void
}

// Mock request data
const mockRequest = {
  request_id: 'req-001',
  request_type: 'open_scan',
  status: 'pending',
  mailbox_name: 'Acme Corp',
  pmb: '1001',
  mail_item_id: 'mail-123',
  requested_by: 'john@acme.com',
  requested_at: '2026-02-08T10:30:00Z',
}

const mockEvents = [
  { id: 1, type: 'created', user: 'john@acme.com', timestamp: '2026-02-08T10:30:00Z', message: 'Request created' },
  { id: 2, type: 'viewed', user: 'admin@thinkspace.com', timestamp: '2026-02-08T11:00:00Z', message: 'Request viewed by staff' },
]

const mockNotes: { id: number; user: string; text: string; timestamp: string; isStaffOnly: boolean }[] = []

export function OpenScanDetail({ requestId, onClose }: RequestDetailProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'activity'>('details')
  const [newNote, setNewNote] = useState('')
  const [isStaffOnly, setIsStaffOnly] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.dataTransfer.files)])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleComplete = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one scanned file before completing')
      return
    }
    
    setIsCompleting(true)
    // TODO: Implement completion workflow
    // 1. Upload files to storage
    // 2. Create request_attachments
    // 3. Update request status to completed
    // 4. Log completion event
    setTimeout(() => {
      setIsCompleting(false)
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
                <h2 className="text-lg font-semibold text-gray-900">Open & Scan</h2>
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
                  <FileImage className="w-12 h-12 mx-auto mb-2" />
                  <p>Envelope image preview</p>
                </div>
              </div>

              {/* Mailbox Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Mailbox</h3>
                <p className="font-medium text-gray-900">{mockRequest.mailbox_name}</p>
                <p className="text-sm text-gray-500">PMB {mockRequest.pmb}</p>
              </div>

              {/* File Upload */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Upload Scanned Files <span className="text-red-500">*</span>
                </h3>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FFCC00] hover:bg-[#FFF4BF] transition-colors cursor-pointer"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 font-medium">
                    Drop scanned files here or click to upload
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    PDF or images (at least one required)
                  </p>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Files to upload ({uploadedFiles.length})
                    </h4>
                    {uploadedFiles.map((file, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                    {event.type === 'created' && <Scan className="w-4 h-4 text-gray-500" />}
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
            onClick={handleComplete}
            disabled={isCompleting || uploadedFiles.length === 0}
            className={`w-full py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
              uploadedFiles.length > 0 && !isCompleting
                ? 'bg-[#10B981] text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isCompleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Mark as Completed
              </>
            )}
          </button>
          {uploadedFiles.length === 0 && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Upload at least one file to complete this request
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
