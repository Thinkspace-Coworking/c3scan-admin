'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { api } from '@/lib/api'
import { Mail, Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function ConfirmEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const { user } = useAuth()

  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'already-verified'>('verifying')
  const [message, setMessage] = useState('Confirming your email address...')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Invalid confirmation link. No token provided.')
        return
      }

      try {
        // TODO: Replace with actual API call when backend endpoint exists
        // const result = await api.confirmEmail(token)
        
        // Mock confirmation
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Simulate success
        setStatus('success')
        setMessage('Your email has been confirmed successfully!')
        
        // Refresh session to get updated email_verified status
        // Note: Session refresh happens automatically via auth state change
        
        // Redirect after delay
        setTimeout(() => {
          if (user) {
            router.push('/app/select-mailbox')
          } else {
            router.push('/app')
          }
        }, 2500)
      } catch (err) {
        console.error('Email confirmation error:', err)
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Failed to confirm email. The link may be expired or invalid.')
      }
    }

    // Check if already verified
    if (user?.email_confirmed_at) {
      setStatus('already-verified')
      setMessage('Your email is already confirmed.')
      setTimeout(() => {
        router.push('/app/select-mailbox')
      }, 2000)
      return
    }

    confirmEmail()
  }, [token, user, router])

  const handleResend = async () => {
    if (!user?.email) return
    
    try {
      setResending(true)
      
      // TODO: Replace with actual API call
      // await api.resendConfirmationEmail(user.email)
      
      // Mock resend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setResent(true)
    } catch (err) {
      console.error('Resend error:', err)
    } finally {
      setResending(false)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return <Loader2 className="w-12 h-12 animate-spin text-[#FFCC00]" />
      case 'success':
      case 'already-verified':
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />
    }
  }

  const getStatusBg = () => {
    switch (status) {
      case 'verifying':
        return 'bg-yellow-50'
      case 'success':
      case 'already-verified':
        return 'bg-green-50'
      case 'error':
        return 'bg-red-50'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FFCC00] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Confirmation</h1>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className={`w-24 h-24 ${getStatusBg()} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {getStatusIcon()}
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {status === 'verifying' && 'Confirming Email...'}
            {status === 'success' && 'Email Confirmed!'}
            {status === 'already-verified' && 'Already Confirmed'}
            {status === 'error' && 'Confirmation Failed'}
          </h2>

          <p className="text-gray-600 mb-6">{message}</p>

          {status === 'verifying' && (
            <p className="text-sm text-gray-500">
              Please wait while we verify your email address...
            </p>
          )}

          {(status === 'success' || status === 'already-verified') && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Redirecting to your account...</span>
              </div>
              <Loader2 className="w-5 h-5 animate-spin text-[#FFCC00] mx-auto" />
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              {user?.email && !resent && (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-xl hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Resend Confirmation Email
                    </>
                  )}
                </button>
              )}

              {resent && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-700">
                    Confirmation email sent! Check your inbox.
                  </p>
                </div>
              )}

              <Link
                href="/app"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Help */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{' '}
          <Link href="#" className="text-blue-600 hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#FFCC00] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  )
}
