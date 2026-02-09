'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'
import { useTenant } from '@/providers/tenant-provider'
import { LocationSelector } from '@/components/ui/LocationSelector'
import { OperatorSwitcher } from '@/components/ui/OperatorSwitcher'
import { Home, Mail, ClipboardList, FileText, Users, Settings, Command, LogOut, Boxes, UserCheck, CreditCard, ShieldCheck, Loader2 } from 'lucide-react'

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  { href: '/admin', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
  { href: '/admin/mail', icon: <Mail className="w-5 h-5" />, label: 'Mail' },
  { href: '/admin/mailboxes', icon: <Boxes className="w-5 h-5" />, label: 'Mailboxes' },
  { href: '/admin/renters', icon: <UserCheck className="w-5 h-5" />, label: 'Renters' },
  { href: '/admin/compliance', icon: <ShieldCheck className="w-5 h-5" />, label: 'Compliance' },
  { href: '/admin/requests', icon: <FileText className="w-5 h-5" />, label: 'Requests' },
  { href: '/admin/alias-submissions', icon: <ClipboardList className="w-5 h-5" />, label: 'Aliases' },
  { href: '/admin/customers', icon: <Users className="w-5 h-5" />, label: 'Customers' },
  { href: '/admin/billing', icon: <CreditCard className="w-5 h-5" />, label: 'Billing' },
  { href: '/admin/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading: isLoadingAuth } = useAuth()
  const { 
    operators, 
    selectedOperator, 
    isLoadingOperators, 
    locations,
    selectedLocation 
  } = useTenant()

  // Redirect to select-account if no operator selected and multiple available
  useEffect(() => {
    if (!isLoadingAuth && !isLoadingOperators && user) {
      if (!selectedOperator && operators.length > 1) {
        router.push('/admin/select-account')
      }
    }
  }, [isLoadingAuth, isLoadingOperators, user, selectedOperator, operators, router])

  // Show loading state while checking auth and operators
  if (isLoadingAuth || isLoadingOperators) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFCC00] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 fixed top-0 right-0 left-16 z-20">
        {/* Left: Location Selector */}
        <div className="flex items-center gap-4">
          <LocationSelector />
          {selectedLocation && (
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{selectedLocation.city}, {selectedLocation.state}</span>
            </div>
          )}
        </div>

        {/* Right: Operator Switcher */}
        <OperatorSwitcher />
      </header>

      <div className="flex flex-1 pt-14">
        {/* Left Rail Navigation - Icon Only */}
        <nav className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 fixed h-full z-10 top-0">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/admin">
              <img 
                src="/logo-square.png" 
                alt="C3Scan" 
                className="w-10 h-10 object-contain rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Navigation Icons */}
          <div className="flex-1 flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative group",
                    isActive 
                      ? "bg-gray-100 text-gray-900" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  )}
                >
                  {item.icon}
                  
                  {/* Tooltip */}
                  <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.label}
                  </span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <span className="absolute left-0 w-1 h-6 bg-[#FFCC00] rounded-r-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-2">
            {/* Command Palette Trigger */}
            <button 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              title="Command Palette (CMD+K)"
            >
              <Command className="w-5 h-5" />
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 ml-16 p-6">
          {/* Context Banner - Show if no location selected */}
          {!selectedLocation && locations.length > 1 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <span className="text-yellow-600">⚠️</span>
              <p className="text-yellow-800 text-sm">
                Please select a location from the header to view location-specific data.
              </p>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  )
}
