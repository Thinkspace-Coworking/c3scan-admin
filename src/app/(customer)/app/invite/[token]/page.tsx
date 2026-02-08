'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { api } from '@/lib/api'
import { Mail, Loader2, AlertCircle, CheckCircle, UserPlus } from 'lucide-react'
import Link from 'next/link'

interface Invitation {
  invitation_id: string
  email: string
  mailbox_id: string
  mailbox_name: string
  pmb: string
  operator_name: string
  invited_by: string
  invited_at: string
  status: 'pending' | 'accepted' | 'expired'
  token: string
}

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading: authLoading } = useAuth()
  const token = params.token as string

  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)

  // Fetch invitation details
  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // TODO: Replace with actual API call when backend endpoint exists
        // const data = await api.getInvitation(token)
        
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 800))
        const mockInvitation: Invitation = {
          invitation_id: 'inv_001',
          email: 'newuser@example.com',
          mailbox_id: 'mbx_123',
          mailbox_name: 'Acme Corp',
          pmb: '1234',
          operator_name: 'Thinkspace',
          invited_by: 'Admin User',
          invited_at: new Date().toISOString(),
          status: 'pending',
          token: token,
        }
        
        setInvitation(mockInvitation)
      } catch (err) {
        console.error('Error fetching invitation:', err)
        setError(err instanceof Error ? err.message : 'Invalid or expired invitation')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchInvitation()
    }
  }, [token])

  // Handle accept invitation
  const handleAccept = async () => {
    if (!invitation) return

    try {
      setAccepting(true)
      
      // If user is not logged in, redirect to register with email pre-filled
      if (!user) {
        const searchParams = new URLSearchParams({
          email: invitation.email,
          token: invitation.token,
          mailbox: invitation.mailbox_id,
        })
        router.push(`/app/register?${searchParams.toString()}`)
        return
      }

      // TODO: Replace with actual API call
      // await api.acceptInvitation(token)
      
      // Mock acceptance
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAccepted(true)
      
      // Redirect to mailbox after short delay
      setTimeout(() => {
        router.push(`/app/${invitation.mailbox_id}/mail`)
      }, 1500)
    } catch (err) {
      console.error('Error accepting invitation:', err)
      setError(err instanceof Error ? err.message : 'Failed to accept invitation')
    } finally {
      setAccepting(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#FFCC00] mx-auto mb-4" />
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Invitation Invalid</h1>
          <p className="text-gray-600 mb-8">
            {error || 'This invitation link is invalid, expired, or has already been used.'}
          </p>
          <Link
            href="/app"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-xl hover:bg-[#E6B800] transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Invitation Accepted!</h1>
          <p className="text-gray-600 mb-8">
            You now have access to <strong>{invitation.mailbox_name}</strong>. Redirecting to your mailbox...
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-[#FFCC00] mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FFCC00] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mailbox Invitation</h1>
          <p className="text-gray-500">
            You&apos;ve been invited to manage a mailbox
          </p>
        </div>

        {/* Invitation Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-6 h-6 text-[#FFCC00]" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-lg">{invitation.mailbox_name}</h2>
                <p className="text-gray-500">PMB {invitation.pmb}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Operator</span>
                <span className="font-medium text-gray-900">{invitation.operator_name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Invited by</span>
                <span className="font-medium text-gray-900">{invitation.invited_by}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{invitation.email}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-500">Invited</span>
                <span className="font-medium text-gray-900">
                  {new Date(invitation.invited_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-3">
            {user ? (
              <>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Signed in as <strong>{user.email}</strong>
                </p>
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="w-full px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-xl hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {accepting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    'Accept Invitation'
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="w-full px-6 py-3 bg-[#FFCC00] text-black font-medium rounded-xl hover:bg-[#E6B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {accepting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  'Create Account to Accept'
                )}
              </button>
            )}
            
            <Link
              href="/app"
              className="block w-full px-6 py-3 text-center text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              Decline
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500">
          Need help?{' '}
          <Link href="#" className="text-blue-600 hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}
