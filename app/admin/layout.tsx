"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Mail,
  Inbox,
  Users,
  FileCheck,
  CreditCard,
  Settings,
  LogOut,
  Building2,
  Package,
  ChevronDown,
  Bell,
  Search,
  Command,
  Tag,
  Briefcase,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", icon: Building2, label: "Dashboard" },
  { href: "/admin/mail", icon: Mail, label: "Mail" },
  { href: "/admin/requests", icon: Inbox, label: "Requests" },
  { href: "/admin/aliases", icon: Tag, label: "Aliases" },
  { href: "/admin/companies", icon: Briefcase, label: "Companies" },
  { href: "/admin/mailboxes", icon: Package, label: "Mailboxes" },
  { href: "/admin/renters", icon: Users, label: "Renters" },
  { href: "/admin/compliance", icon: FileCheck, label: "Compliance" },
  { href: "/admin/billing", icon: CreditCard, label: "Billing" },
  { href: "/admin/settings/general", icon: Settings, label: "Settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [locationOpen, setLocationOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="c3scan"
              width={36}
              height={36}
              className="rounded"
            />
            <span className="font-semibold text-gray-900">c3scan</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#FFF4BF] text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="p-3 border-t border-gray-200">
          <Link
            href="/admin/login"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
          {/* Search / Command */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors">
              <Search size={16} />
              <span>Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-white rounded border text-xs text-gray-500">
                <Command size={12} />K
              </kbd>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Location Selector */}
            <div className="relative">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <Building2 size={16} />
                <span>Thinkspace Seattle</span>
                <ChevronDown size={16} />
              </button>
              {locationOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button className="w-full px-4 py-2 text-left text-sm bg-[#FFF4BF] text-gray-900">
                    Thinkspace Seattle
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50">
                    Thinkspace Redmond
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User */}
            <div className="w-8 h-8 bg-[#FFCC00] rounded-full flex items-center justify-center text-sm font-semibold text-gray-900">
              PC
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
