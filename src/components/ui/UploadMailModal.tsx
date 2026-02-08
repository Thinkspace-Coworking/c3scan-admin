'use client'

import { useState, useRef } from 'react'
import { X, Upload, Camera, FileImage, ChevronDown } from 'lucide-react'

interface UploadMailModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// Mock mailbox data - replace with actual Supabase query
const mockMailboxes = [
  { id: '1', pmb: '1001', name: 'Acme Corp' },
  { id: '2', pmb: '1002', name: 'TechStart Inc' },
  { id: '3', pmb: '1003', name: 'Design Studio' },
  { id: '4', pmb: '1004', name: 'Consulting LLC' },
]

const carriers = ['USPS', 'UPS', 'FedEx', 'DHL', 'Other']

export function UploadMailModal({ isOpen, onClose, onSuccess }: UploadMailModalProps) {
  const [selectedMailbox, setSelectedMailbox] = useState('')
  const [packageType, setPackageType] = useState<'correspondence' | 'package'>('correspondence')
  const [carrier, setCarrier] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0])
  const [internalNotes, setInternalNotes] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [showMailboxDropdown, setShowMailboxDropdown] = useState(false)
  const [mailboxSearch, setMailboxSearch] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const filteredMailboxes = mockMailboxes.filter(mb => 
    mb.pmb.includes(mailboxSearch) || 
    mb.name.toLowerCase().includes(mailboxSearch.toLowerCase())
  )

  const selectedMailboxData = mockMailboxes.find(mb => mb.id === selectedMailbox)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      setImages(Array.from(e.dataTransfer.files))
    }
  }

  const handleSubmit = async () => {
    if (!selectedMailbox || images.length === 0) return
    
    setIsUploading(true)
    
    // TODO: Implement actual upload to Supabase
    // 1. Upload images to storage
    // 2. Create mail_item record
    // 3. Create mail_item_image records
    
    setTimeout(() => {
      setIsUploading(false)
      onSuccess()
      onClose()
      // Reset form
      setSelectedMailbox('')
      setPackageType('correspondence')
      setCarrier('')
      setTrackingNumber('')
      setReceivedDate(new Date().toISOString().split('T')[0])
      setInternalNotes('')
      setImages([])
    }, 1500)
  }

  const isValid = selectedMailbox && images.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload Mail</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Mailbox Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mailbox <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowMailboxDropdown(!showMailboxDropdown)}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent bg-white"
                >
                  <span className={selectedMailboxData ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedMailboxData 
                      ? `${selectedMailboxData.pmb} - ${selectedMailboxData.name}` 
                      : 'Search by PMB or mailbox name...'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {showMailboxDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                        value={mailboxSearch}
                        onChange={(e) => setMailboxSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                    {filteredMailboxes.map((mb) => (
                      <button
                        key={mb.id}
                        onClick={() => {
                          setSelectedMailbox(mb.id)
                          setShowMailboxDropdown(false)
                          setMailboxSearch('')
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3"
                      >
                        <span className="font-medium text-gray-900">{mb.pmb}</span>
                        <span className="text-gray-500">{mb.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Package Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setPackageType('correspondence')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                    packageType === 'correspondence'
                      ? 'border-[#FFCC00] bg-[#FFF4BF] text-gray-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileImage className="w-4 h-4" />
                  Correspondence
                </button>
                <button
                  onClick={() => setPackageType('package')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                    packageType === 'package'
                      ? 'border-[#FFCC00] bg-[#FFF4BF] text-gray-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Package
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images <span className="text-red-500">*</span>
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FFCC00] hover:bg-[#FFF4BF] transition-colors cursor-pointer"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 font-medium">
                  Drop images here or click to upload
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  At least one image required (envelope front)
                </p>
              </div>
              
              {images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600 flex items-center gap-2">
                      <FileImage className="w-4 h-4" />
                      {img.name}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setImages(images.filter((_, i) => i !== idx))
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Carrier & Tracking */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carrier
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
                >
                  <option value="">Select carrier...</option>
                  {carriers.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking #"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
                />
              </div>
            </div>

            {/* Received Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Received Date
              </label>
              <input
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
              />
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Internal Notes
              </label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Add any internal notes about this mail item..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isUploading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isValid && !isUploading
                ? 'bg-[#0F172A] text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Mail'}
          </button>
        </div>
      </div>
    </div>
  )
}
