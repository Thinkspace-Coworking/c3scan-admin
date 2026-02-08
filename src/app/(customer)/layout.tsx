'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Mail, FileText, Settings, User } from 'lucide-react'

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  { href: '/app', icon: <Mail className="w-5 h-5" />, label: 'My Mail' },
  { href: '/app/requests', icon: <FileText className="w-5 h-5" />, label: 'Requests' },
  { href: '/app/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  { href: '/app/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
]

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden">
        <div className="w-8 h-8 bg-[#FFCC00] rounded-lg flex items-center justify-center">
          <span className="font-bold text-black text-xs">C3</span>
        </div>
        <span className="font-semibold text-gray-900">C3Scan</span>
        <div className="w-8" />{/* Spacer */}
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <nav className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFCC00] rounded-lg flex items-center justify-center">
                <span className="font-bold text-black text-sm">C3</span>
              </div>
              <span className="font-bold text-gray-900">C3Scan</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-4 px-3">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      isActive 
                        ? "bg-[#FFCC00]/10 text-gray-900 font-medium" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 bg-[#FFCC00] rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">© 2026 C3Scan.io</p>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 z-50">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
                  isActive ? "text-[#FFCC00]" : "text-gray-500"
                )}
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
