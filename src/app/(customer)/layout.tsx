'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTenant } from '@/providers/tenant-provider'
import { 
  Mail, 
  ShieldCheck, 
  Settings,
  Bell,
  ChevronDown,
  LogOut
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { selectedOperator } = useTenant()
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Get mailbox ID from pathname
  const mailboxMatch = pathname.match(/\/app\/([^/]+)/)
  const mailboxId = mailboxMatch?.[1]

  const navItems: NavItem[] = mailboxId && mailboxId !== 'select-mailbox' && !pathname.includes('invite') && !pathname.includes('register') && !pathname.includes('confirm-email')
    ? [
        { href: `/app/${mailboxId}/mail`, icon: <Mail className="w-5 h-5" />, label: 'Mail' },
        { href: `/app/${mailboxId}/compliance`, icon: <ShieldCheck className="w-5 h-5" />, label: 'Compliance' },
        { href: `/app/${mailboxId}/settings`, icon: <Settings className="w-5 h-5" />, label: 'Settings' },
      ]
    : []

  const isAuthPage = pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/invite') || pathname.includes('/confirm-email')

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/app" className="flex items-center gap-3">
              <img 
                src="/logo-square.png" 
                alt="C3Scan" 
                className="w-10 h-10 object-contain rounded-lg"
              />
              <span className="font-semibold text-gray-900 hidden sm:block">
                {selectedOperator?.operator_name || 'C3Scan'}
              </span>
            </Link>

            {/* Navigation */}
            {navItems.length > 0 && (
              <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-yellow-50 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {item.icon}
                      <span className="hidden sm:block">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                {/* Notification badge */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">U</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                      <div className="py-1">
                        <Link
                          href="/app/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            // TODO: Sign out
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}
