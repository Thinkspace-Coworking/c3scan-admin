'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Upload,
  FileText,
  User,
  ChevronRight,
  Lock
} from 'lucide-react'

// Compliance steps
interface ComplianceStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'completed'
  icon: typeof User
}

const complianceSteps: ComplianceStep[] = [
  {
    id: 'renters',
    title: 'Add Renters',
    description: 'Add at least one renter who will receive mail at this address',
    status: 'pending',
    icon: User,
  },
  {
    id: 'id_verification',
    title: 'Upload ID',
    description: 'Upload a government-issued photo ID',
    status: 'pending',
    icon: FileText,
  },
  {
    id: 'address_proof',
    title: 'Proof of Address',
    description: 'Upload a utility bill or bank statement',
    status: 'pending',
    icon: Upload,
  },
  {
    id: 'form_1583',
    title: 'Sign Form 1583',
    description: 'Electronically sign the USPS Form 1583',
    status: 'pending',
    icon: FileText,
  },
]

export default function CustomerCompliancePage() {
  const params = useParams()
  const mailboxId = params.mailbox_id as string
  const [activeTab, setActiveTab] = useState<'overview' | 'assistant'>('overview')

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">USPS Form 1583 Compliance</h1>
        <p className="text-gray-500 mt-1">
          Complete the required documentation to receive mail at this address
        </p>
      </div>

      {/* Status Banner */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-yellow-800">Compliance Pending</p>
          <p className="text-sm text-yellow-700 mt-1">
            You have 28 days remaining to complete your compliance documentation. 
            Your service may be restricted if not completed by March 8, 2026.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-[#FFCC00] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('assistant')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'assistant'
              ? 'border-[#FFCC00] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Compliance Assistant
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress</h2>
            <div className="relative">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-[#FFCC00] rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">1 of 4 steps completed</p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {complianceSteps.map((step, index) => (
              <div
                key={step.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  step.status === 'completed' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{index + 1}. {step.title}</h3>
                    {step.status === 'completed' && (
                      <span className="text-xs text-green-600 font-medium">Completed</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                </div>
                {step.status !== 'completed' && (
                  <Link
                    href={`/app/${mailboxId}/compliance/assistant`}
                    className="px-4 py-2 bg-[#FFCC00] text-black text-sm font-medium rounded-lg hover:bg-[#E6B800] transition-colors"
                  >
                    Complete
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Privacy Notice */}
          <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3">
            <Lock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">
                Your personal information is securely stored and only used for USPS compliance purposes. 
                We use bank-level encryption to protect your data.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#FFCC00] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Compliance Assistant</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              The compliance assistant will guide you through each step of the USPS Form 1583 process.
            </p>
            <Link
              href={`/app/${mailboxId}/compliance/assistant?step=0`}
              className="px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-lg hover:bg-[#E6B800] transition-colors inline-block"
            >
              Start Compliance Wizard
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
