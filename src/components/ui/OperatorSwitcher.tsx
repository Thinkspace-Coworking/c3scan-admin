'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTenant } from '@/providers/tenant-provider'
import { Building2, ChevronDown, Check, LogOut } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'

export function OperatorSwitcher() {
  const router = useRouter()
  const { operators, selectedOperator, setSelectedOperator, setSelectedLocation } = useTenant()
  const { signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Don't show if no operators
  if (!selectedOperator || operators.length === 0) return null

  function handleSwitchOperator(operator: typeof operators[0]) {
    setSelectedOperator(operator)
    setSelectedLocation(null) // Clear location when switching operators
    setIsOpen(false)
    router.push('/admin')
  }

  function handleSignOut() {
    signOut()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors text-sm"
      >
        <div className="w-6 h-6 bg-[#FFCC00] rounded-md flex items-center justify-center">
          <span className="text-xs font-bold text-black">
            {selectedOperator.operator_name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
          {selectedOperator.operator_name}
        </span>
        {operators.length > 1 && (
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && operators.length > 1 && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Switch Account
              </p>
            </div>

            {/* Operators List */}
            <div className="max-h-64 overflow-y-auto py-1">
              {operators.map((operator) => (
                <button
                  key={operator.operator_id}
                  onClick={() => handleSwitchOperator(operator)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                    selectedOperator?.operator_id === operator.operator_id ? 'bg-yellow-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      selectedOperator?.operator_id === operator.operator_id 
                        ? 'bg-[#FFCC00]' 
                        : 'bg-gray-100'
                    }`}>
                      <Building2 className={`w-4 h-4 ${
                        selectedOperator?.operator_id === operator.operator_id 
                          ? 'text-black' 
                          : 'text-gray-500'
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      selectedOperator?.operator_id === operator.operator_id 
                        ? 'text-gray-900' 
                        : 'text-gray-700'
                    }`}>
                      {operator.operator_name}
                    </span>
                  </div>
                  {selectedOperator?.operator_id === operator.operator_id && (
                    <Check className="w-4 h-4 text-[#FFCC00]" />
                  )}
                </button>
              ))}
            </div>

            {/* Portal Switch */}
            <div className="border-t border-gray-200 py-1">
              <Link
                href="/app"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors text-gray-700"
              >
                <span className="text-sm font-medium">Switch to Customer Portal</span>
              </Link>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 py-1">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {isOpen && operators.length === 1 && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown with just sign out */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
