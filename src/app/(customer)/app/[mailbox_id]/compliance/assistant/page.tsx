'use client'

import { useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ChevronLeft,
  ShieldCheck,
  User,
  Upload,
  FileText,
  CheckCircle,
  Pen
} from 'lucide-react'

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

// Step 2: Identity Verification (stub)
function IdentityStep({ 
  onNext, 
  onBack, 
  mailboxId 
}: { 
  onNext: () => void
  onBack: () => void
  mailboxId: string 
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Identity Verification</h2>
      <p className="text-gray-500 mb-6">
        Upload a government-issued photo ID. This is required by USPS to verify your identity.
      </p>
      
      <div className="p-12 border-2 border-dashed border-gray-300 rounded-xl text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 mb-2">ID upload coming in next chunk</p>
        <p className="text-sm text-gray-400">Step 2 of 6</p>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Step 3: Proof of Address (stub)
function AddressStep({ 
  onNext, 
  onBack, 
  mailboxId 
}: { 
  onNext: () => void
  onBack: () => void
  mailboxId: string 
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Proof of Address</h2>
      <p className="text-gray-500 mb-6">
        Upload a document showing your current address (must be dated within 90 days).
      </p>
      
      <div className="p-12 border-2 border-dashed border-gray-300 rounded-xl text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 mb-2">Address proof upload coming in next chunk</p>
        <p className="text-sm text-gray-400">Step 3 of 6</p>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Step 4: Additional Information (stub)
function AdditionalInfoStep({ 
  onNext, 
  onBack, 
  mailboxId 
}: { 
  onNext: () => void
  onBack: () => void
  mailboxId: string 
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Additional Information</h2>
      <p className="text-gray-500 mb-6">
        Provide business details and manage renters associated with this mailbox.
      </p>
      
      <div className="p-12 border-2 border-dashed border-gray-300 rounded-xl text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 mb-2">Business details and renter management coming in next chunk</p>
        <p className="text-sm text-gray-400">Step 4 of 6</p>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Step 5: Review (stub)
function ReviewStep({ 
  onNext, 
  onBack, 
  mailboxId 
}: { 
  onNext: () => void
  onBack: () => void
  mailboxId: string 
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Review Your Information</h2>
      <p className="text-gray-500 mb-6">
        Please review all information before signing. You can go back to edit any section.
      </p>
      
      <div className="p-12 border-2 border-dashed border-gray-300 rounded-xl text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 mb-2">Form 1583 review preview coming in next chunk</p>
        <p className="text-sm text-gray-400">Step 5 of 6</p>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors"
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
