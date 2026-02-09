'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ChevronLeft,
  ShieldCheck,
  User,
  Upload,
  FileText,
  CheckCircle,
  Pen,
  X,
  Loader2,
  AlertCircle,
  Check,
  Plus,
  Trash2,
  Briefcase
} from 'lucide-react'
import { api } from '@/lib/api'

// Wizard steps definition
const WIZARD_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'What you\'ll need',
    icon: ShieldCheck,
  },
  {
    id: 'identity',
    title: 'Identity',
    description: 'Upload photo ID',
    icon: User,
  },
  {
    id: 'address',
    title: 'Address',
    description: 'Proof of address',
    icon: Upload,
  },
  {
    id: 'additional',
    title: 'Details',
    description: 'Business & renters',
    icon: FileText,
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Verify information',
    icon: CheckCircle,
  },
  {
    id: 'sign',
    title: 'Sign',
    description: 'Electronically sign',
    icon: Pen,
  },
] as const

type WizardStep = typeof WIZARD_STEPS[number]['id']

export default function ComplianceAssistantPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const mailboxId = params.mailbox_id as string
  
  // Get current step from URL or default to welcome
  const currentStepIndex = Math.min(
    Math.max(parseInt(searchParams.get('step') || '0', 10), 0),
    WIZARD_STEPS.length - 1
  )
  const currentStep = WIZARD_STEPS[currentStepIndex]
  
  // Track completed steps
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  
  // Navigate to step
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < WIZARD_STEPS.length) {
      router.push(`/app/${mailboxId}/compliance/assistant?step=${stepIndex}`)
    }
  }
  
  const goNext = () => {
    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep.id]))
    goToStep(currentStepIndex + 1)
  }
  
  const goBack = () => {
    goToStep(currentStepIndex - 1)
  }
  
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href={`/app/${mailboxId}/compliance`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Compliance
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">USPS Form 1583 Compliance</h1>
        <p className="text-gray-500 mt-1">
          Complete the required documentation to receive mail at this address
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {WIZARD_STEPS.map((step, index) => {
            const isCompleted = completedSteps.has(step.id) || index < currentStepIndex
            const isCurrent = index === currentStepIndex
            const isClickable = index <= currentStepIndex || completedSteps.has(step.id)
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step indicator */}
                <button
                  onClick={() => isClickable && goToStep(index)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center group ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-[#FFCC00] text-black'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    isCurrent ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </button>
                
                {/* Connector line */}
                {index < WIZARD_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-colors ${
                    index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[400px]">
        {currentStep.id === 'welcome' && (
          <WelcomeStep onNext={goNext} />
        )}
        {currentStep.id === 'identity' && (
          <IdentityStep onNext={goNext} onBack={goBack} mailboxId={mailboxId} />
        )}
        {currentStep.id === 'address' && (
          <AddressStep onNext={goNext} onBack={goBack} mailboxId={mailboxId} />
        )}
        {currentStep.id === 'additional' && (
          <AdditionalInfoStep onNext={goNext} onBack={goBack} mailboxId={mailboxId} />
        )}
        {currentStep.id === 'review' && (
          <ReviewStep onNext={goNext} onBack={goBack} mailboxId={mailboxId} />
        )}
        {currentStep.id === 'sign' && (
          <SignStep onBack={goBack} mailboxId={mailboxId} />
        )}
      </div>

      {/* Navigation Buttons (for steps that don't define their own) */}
      {!['welcome', 'sign'].includes(currentStep.id) && (
        <div className="flex justify-between mt-6">
          <button
            onClick={goBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={goNext}
            className="px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}

// Step 1: Welcome
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-[#FFCC00] rounded-2xl flex items-center justify-center mx-auto mb-6">
        <ShieldCheck className="w-10 h-10 text-black" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        USPS Form 1583 Compliance
      </h2>
      <p className="text-gray-600 max-w-lg mx-auto mb-8">
        Federal law requires all Commercial Mail Receiving Agencies (CMRAs) to collect 
        identification and authorization forms before handling mail. This wizard will 
        guide you through the process.
      </p>
      
      <div className="bg-gray-50 rounded-xl p-6 max-w-lg mx-auto mb-8 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">What you&apos;ll need:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">Government-issued photo ID (Driver&apos;s License or Passport)</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">Proof of address (Utility bill, bank statement, or lease dated within 90 days)</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">Business information (if using for business purposes)</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">5-10 minutes to complete</span>
          </li>
        </ul>
      </div>
      
      <div className="text-sm text-gray-500 mb-8">
        <a 
          href="https://about.usps.com/forms/ps1583.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View USPS Form 1583 (PDF)
        </a>
      </div>
      
      <button
        onClick={onNext}
        className="px-8 py-4 bg-[#FFCC00] text-black font-semibold rounded-lg hover:bg-[#E6B800] transition-colors"
      >
        Get Started
      </button>
    </div>
  )
}

// Step 2: Identity Verification
function IdentityStep({
  onNext,
  onBack,
  mailboxId
}: {
  onNext: () => void
  onBack: () => void
  mailboxId: string
}) {
  const [idType, setIdType] = useState<'drivers_license' | 'passport' | 'state_id'>('drivers_license')
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [frontPath, setFrontPath] = useState<string | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const [backPath, setBackPath] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (
    file: File,
    side: 'front' | 'back'
  ) => {
    setError(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, or PDF)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file)
    if (side === 'front') {
      setFrontFile(file)
      setFrontPreview(previewUrl)
    } else {
      setBackFile(file)
      setBackPreview(previewUrl)
    }

    // Upload to storage
    setIsUploading(true)
    try {
      const { signedUrl, filePath } = await api.getComplianceUploadUrl({
        mailboxId,
        documentType: side === 'front' ? 'id_front' : 'id_back',
        fileName: file.name,
        contentType: file.type,
      })

      await api.uploadToSignedUrl(signedUrl, file)

      // Save document record (stub for now)
      await api.saveComplianceDocument({
        mailboxId,
        documentType: side === 'front' ? 'id_front' : 'id_back',
        storagePath: filePath,
        fileName: file.name,
        metadata: { idType },
      })

      if (side === 'front') {
        setFrontPath(filePath)
      } else {
        setBackPath(filePath)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
      if (side === 'front') {
        setFrontFile(null)
        setFrontPreview(null)
      } else {
        setBackFile(null)
        setBackPreview(null)
      }
    } finally {
      setIsUploading(false)
    }
  }, [mailboxId, idType])

  const handleDrop = useCallback((e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file, side)
    }
  }, [handleFileSelect])

  const clearFile = useCallback((side: 'front' | 'back') => {
    if (side === 'front') {
      if (frontPreview) URL.revokeObjectURL(frontPreview)
      setFrontFile(null)
      setFrontPreview(null)
      setFrontPath(null)
    } else {
      if (backPreview) URL.revokeObjectURL(backPreview)
      setBackFile(null)
      setBackPreview(null)
      setBackPath(null)
    }
  }, [frontPreview, backPreview])

  const canContinue = frontPath !== null && (idType === 'passport' || backPath !== null)

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Identity Verification</h2>
      <p className="text-gray-500 mb-6">
        Upload a government-issued photo ID. This is required by USPS to verify your identity.
      </p>

      {/* ID Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select ID Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'drivers_license', label: "Driver's License" },
            { id: 'passport', label: 'Passport' },
            { id: 'state_id', label: 'State ID' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setIdType(option.id as typeof idType)}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                idType === option.id
                  ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-gray-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Front of ID Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Front of ID <span className="text-red-500">*</span>
        </label>
        {frontPreview ? (
          <div className="relative border rounded-xl overflow-hidden">
            <div className="aspect-video relative">
              <Image
                src={frontPreview}
                alt="Front of ID"
                fill
                className="object-contain bg-gray-50"
              />
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => clearFile('front')}
                className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            {frontPath && (
              <div className="absolute bottom-2 left-2 flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-full text-sm font-medium">
                <Check className="w-4 h-4" />
                Uploaded
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => frontInputRef.current?.click()}
            onDrop={(e) => handleDrop(e, 'front')}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FFCC00] hover:bg-[#FFCC00]/5 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {isUploading ? 'Uploading...' : 'Click or drag to upload'}
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, or PDF up to 10MB
            </p>
            <input
              ref={frontInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'front')}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Back of ID Upload (not required for passport) */}
      {idType !== 'passport' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Back of ID <span className="text-red-500">*</span>
          </label>
          {backPreview ? (
            <div className="relative border rounded-xl overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={backPreview}
                  alt="Back of ID"
                  fill
                  className="object-contain bg-gray-50"
                />
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => clearFile('back')}
                  className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                  title="Remove"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              {backPath && (
                <div className="absolute bottom-2 left-2 flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-full text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Uploaded
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => backInputRef.current?.click()}
              onDrop={(e) => handleDrop(e, 'back')}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FFCC00] hover:bg-[#FFCC00]/5 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {isUploading ? 'Uploading...' : 'Click or drag to upload'}
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, or PDF up to 10MB
              </p>
              <input
                ref={backInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'back')}
                className="hidden"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          disabled={isUploading}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue || isUploading}
          className="px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Step 3: Proof of Address
function AddressStep({
  onNext,
  onBack,
  mailboxId
}: {
  onNext: () => void
  onBack: () => void
  mailboxId: string
}) {
  const [docType, setDocType] = useState<'utility' | 'bank' | 'lease' | 'government'>('utility')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [filePath, setFilePath] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Address fields
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setError(null)

    if (!selectedFile.type.startsWith('image/') && selectedFile.type !== 'application/pdf') {
      setError('Please upload an image file (JPG, PNG) or PDF')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    const previewUrl = URL.createObjectURL(selectedFile)
    setFile(selectedFile)
    setPreview(previewUrl)

    setIsUploading(true)
    try {
      const { signedUrl, filePath: path } = await api.getComplianceUploadUrl({
        mailboxId,
        documentType: 'address_proof',
        fileName: selectedFile.name,
        contentType: selectedFile.type,
      })

      await api.uploadToSignedUrl(signedUrl, selectedFile)

      await api.saveComplianceDocument({
        mailboxId,
        documentType: 'address_proof',
        storagePath: path,
        fileName: selectedFile.name,
        metadata: { docType, address: { addressLine1, city, state, zipCode } },
      })

      setFilePath(path)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
      setFile(null)
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }, [mailboxId, docType, addressLine1, city, state, zipCode])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [handleFileSelect])

  const clearFile = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setFilePath(null)
  }, [preview])

  const canContinue = filePath !== null &&
    addressLine1.trim() !== '' &&
    city.trim() !== '' &&
    state.trim() !== '' &&
    zipCode.trim() !== ''

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Proof of Address</h2>
      <p className="text-gray-500 mb-6">
        Upload a document showing your current address. Document must be dated within 90 days.
      </p>

      {/* Document Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Document Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'utility', label: 'Utility Bill' },
            { id: 'bank', label: 'Bank Statement' },
            { id: 'lease', label: 'Lease Agreement' },
            { id: 'government', label: 'Government Letter' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setDocType(option.id as typeof docType)}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors text-left ${
                docType === option.id
                  ? 'border-[#FFCC00] bg-[#FFCC00]/10 text-gray-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Upload Document <span className="text-red-500">*</span>
        </label>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {preview ? (
          <div className="relative border rounded-xl overflow-hidden">
            <div className="aspect-video relative">
              {file?.type === 'application/pdf' ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <FileText className="w-16 h-16 text-gray-400" />
                </div>
              ) : (
                <Image
                  src={preview}
                  alt="Address proof document"
                  fill
                  className="object-contain bg-gray-50"
                />
              )}
            </div>
            <div className="absolute top-2 right-2">
              <button
                onClick={clearFile}
                className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            {filePath && (
              <div className="absolute bottom-2 left-2 flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-full text-sm font-medium">
                <Check className="w-4 h-4" />
                Uploaded
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FFCC00] hover:bg-[#FFCC00]/5 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {isUploading ? 'Uploading...' : 'Click or drag to upload'}
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, or PDF up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Address Fields */}
      <div className="mb-6 space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Address on Document</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            placeholder="123 Main Street"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2
          </label>
          <input
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            placeholder="Apt 4B (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Seattle"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent bg-white"
            >
              <option value="">Select...</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="98101"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          disabled={isUploading}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue || isUploading}
          className="px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Step 4: Additional Information
function AdditionalInfoStep({
  onNext,
  onBack,
  mailboxId
}: {
  onNext: () => void
  onBack: () => void
  mailboxId: string
}) {
  const [placeOfRegistration, setPlaceOfRegistration] = useState('')
  const [isBusinessUse, setIsBusinessUse] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const [renters, setRenters] = useState<Array<{ renter_id?: string; full_name: string; email: string; phone: string; isNew?: boolean }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // New renter form state
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRenterName, setNewRenterName] = useState('')
  const [newRenterEmail, setNewRenterEmail] = useState('')
  const [newRenterPhone, setNewRenterPhone] = useState('')

  // Load existing renters on mount
  useEffect(() => {
    const loadRenters = async () => {
      try {
        const existingRenters = await api.getRenters({ mailboxId })
        setRenters(existingRenters.map(r => ({
          renter_id: r.renter_id,
          full_name: r.full_name,
          email: r.email,
          phone: r.phone || '',
          isNew: false,
        })))
      } catch (err) {
        console.error('Failed to load renters:', err)
      }
    }
    loadRenters()
  }, [mailboxId])

  const handleAddRenter = async () => {
    if (!newRenterName.trim() || !newRenterEmail.trim()) {
      setError('Name and email are required')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create renter in database
      const created = await api.createRenter({
        mailboxId,
        fullName: newRenterName.trim(),
        email: newRenterEmail.trim(),
        phone: newRenterPhone.trim() || undefined,
      })

      setRenters([...renters, {
        renter_id: created.renter_id,
        full_name: created.full_name,
        email: created.email,
        phone: created.phone || '',
        isNew: true,
      }])

      // Reset form
      setNewRenterName('')
      setNewRenterEmail('')
      setNewRenterPhone('')
      setShowAddForm(false)
    } catch (err) {
      console.error('Failed to create renter:', err)
      setError(err instanceof Error ? err.message : 'Failed to add renter')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveRenter = async (index: number) => {
    const renter = renters[index]
    if (renter.renter_id) {
      try {
        await api.deleteRenter(renter.renter_id)
      } catch (err) {
        console.error('Failed to delete renter:', err)
        setError('Failed to remove renter')
        return
      }
    }
    setRenters(renters.filter((_, i) => i !== index))
  }

  const canContinue = placeOfRegistration.trim() !== '' && renters.length > 0

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Additional Information</h2>
      <p className="text-gray-500 mb-6">
        Provide business details and manage renters associated with this mailbox.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Place of Registration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Place of Registration (City, State) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={placeOfRegistration}
          onChange={(e) => setPlaceOfRegistration(e.target.value)}
          placeholder="e.g., Seattle, WA"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the city and state where you are registered to vote or hold a driver&apos;s license.
        </p>
      </div>

      {/* Business Use */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isBusinessUse}
            onChange={(e) => setIsBusinessUse(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#FFCC00] focus:ring-[#FFCC00]"
          />
          <div>
            <span className="font-medium text-gray-900">This mailbox is for business use</span>
            <p className="text-sm text-gray-500">
              Check this if you will receive business mail at this address.
            </p>
          </div>
        </label>

        {isBusinessUse && (
          <div className="mt-4 pl-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your Business LLC"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Renters Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Renters <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-gray-500">
            {renters.length} renter{renters.length !== 1 ? 's' : ''}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Add all individuals who will receive mail at this address. At least one renter is required.
        </p>

        {/* Renter List */}
        {renters.length > 0 && (
          <div className="space-y-2 mb-4">
            {renters.map((renter, index) => (
              <div
                key={renter.renter_id || index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#FFCC00] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{renter.full_name}</p>
                    <p className="text-sm text-gray-500">{renter.email}</p>
                    {renter.phone && <p className="text-xs text-gray-400">{renter.phone}</p>}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveRenter(index)}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Remove renter"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Renter Button or Form */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-600 hover:border-[#FFCC00] hover:text-gray-900 hover:bg-[#FFCC00]/5 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Renter
          </button>
        ) : (
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 className="font-medium text-gray-900 mb-4">Add New Renter</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newRenterName}
                  onChange={(e) => setNewRenterName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newRenterEmail}
                  onChange={(e) => setNewRenterEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={newRenterPhone}
                  onChange={(e) => setNewRenterPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewRenterName('')
                  setNewRenterEmail('')
                  setNewRenterPhone('')
                  setError(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRenter}
                disabled={isLoading || !newRenterName.trim() || !newRenterEmail.trim()}
                className="flex-1 px-4 py-2 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Adding...' : 'Add Renter'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue || isLoading}
          className="px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Step 5: Review
function ReviewStep({
  onNext,
  onBack,
  mailboxId
}: {
  onNext: () => void
  onBack: () => void
  mailboxId: string
}) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['identity', 'address', 'additional']))

  const router = useRouter()

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const goToStep = (stepIndex: number) => {
    router.push(`/app/${mailboxId}/compliance/assistant?step=${stepIndex}`)
  }

  // Review Section Card Component
  const ReviewCard = ({
    title,
    stepIndex,
    sectionKey,
    children,
    isComplete = true
  }: {
    title: string
    stepIndex: number
    sectionKey: string
    children: React.ReactNode
    isComplete?: boolean
  }) => (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isComplete ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
          }`}>
            {isComplete ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          </div>
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToStep(stepIndex)
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit
          </button>
          <ChevronLeft className={`w-5 h-5 text-gray-400 transition-transform ${
            expandedSections.has(sectionKey) ? '-rotate-90' : 'rotate-180'
          }`} />
        </div>
      </button>
      {expandedSections.has(sectionKey) && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Review Your Information</h2>
      <p className="text-gray-500 mb-6">
        Please review all information before signing. Click Edit to make changes.
      </p>

      {/* Identity Verification Summary */}
      <ReviewCard title="Identity Verification" stepIndex={1} sectionKey="identity">
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">ID Type</span>
            <span className="font-medium text-gray-900">Driver&apos;s License</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Front of ID</span>
            <span className="flex items-center gap-2 text-green-600">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Uploaded</span>
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Back of ID</span>
            <span className="flex items-center gap-2 text-green-600">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Uploaded</span>
            </span>
          </div>
        </div>
      </ReviewCard>

      {/* Proof of Address Summary */}
      <ReviewCard title="Proof of Address" stepIndex={2} sectionKey="address">
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Document Type</span>
            <span className="font-medium text-gray-900">Utility Bill</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Document</span>
            <span className="flex items-center gap-2 text-green-600">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Uploaded</span>
            </span>
          </div>
          <div className="pt-2">
            <span className="text-gray-500 text-sm">Address on Document</span>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">123 Main Street, Apt 4B</p>
              <p className="text-gray-700">Seattle, WA 98101</p>
            </div>
          </div>
        </div>
      </ReviewCard>

      {/* Additional Information Summary */}
      <ReviewCard title="Additional Information" stepIndex={3} sectionKey="additional">
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Place of Registration</span>
            <span className="font-medium text-gray-900">Seattle, WA</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Business Use</span>
            <span className="font-medium text-gray-900">Yes</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Business Name</span>
            <span className="font-medium text-gray-900">Acme Corporation LLC</span>
          </div>
          <div className="pt-2">
            <span className="text-gray-500 text-sm">Renters</span>
            <div className="mt-1 space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500">john@example.com</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Jane Smith</p>
                  <p className="text-sm text-gray-500">jane@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ReviewCard>

      {/* USPS Form 1583 Notice */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">USPS Form 1583</h4>
        <p className="text-sm text-blue-700 mb-3">
          By proceeding to sign, you authorize this Commercial Mail Receiving Agency (CMRA) 
          to receive mail on your behalf in accordance with USPS regulations.
        </p>
        <a
          href="https://about.usps.com/forms/ps1583.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
        >
          View Official USPS Form 1583
          <ChevronLeft className="w-4 h-4 rotate-180" />
        </a>
      </div>

      {/* Confirmation Checkbox */}
      <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
        <input
          type="checkbox"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
          className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#FFCC00] focus:ring-[#FFCC00]"
        />
        <span className="text-sm text-gray-700">
          I confirm that all information provided is accurate and complete. I understand that 
          providing false information may result in denial of service and possible legal action 
          under federal law.
        </span>
      </label>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isConfirmed}
          className="px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Sign
        </button>
      </div>
    </div>
  )
}

// Step 6: Sign (stub)
function SignStep({ 
  onBack, 
  mailboxId 
}: { 
  onBack: () => void
  mailboxId: string 
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Electronically Sign</h2>
      <p className="text-gray-500 mb-6">
        By signing, you authorize this CMRA to receive mail on your behalf per USPS Form 1583.
      </p>
      
      <div className="p-12 border-2 border-dashed border-gray-300 rounded-xl text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Pen className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 mb-2">Signature capture coming in next chunk</p>
        <p className="text-sm text-gray-400">Step 6 of 6</p>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          disabled
          className="px-6 py-3 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed"
        >
          Submit for Review
        </button>
      </div>
    </div>
  )
}
