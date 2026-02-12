"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import { 
  Inbox, 
  FileCheck, 
  Bell,
  ChevronDown,
  LogOut,
  User
} from "lucide-react";
import { useState } from "react";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const pathname = usePathname();
  const params = useParams();
  const mailboxId = params.mailbox_id as string;
  const [mailboxDropdownOpen, setMailboxDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Mock current mailbox - in real app would come from context/api
  const currentMailbox = {
    id: mailboxId || "mb-1",
    name: "TechCorp Inc.",
    pmb: "1201",
    complianceStatus: "pending" as string,
  };

  const mailboxes = [
    { id: "mb-1", name: "TechCorp Inc.", pmb: "1201" },
  ];

  const showComplianceBanner = currentMailbox.complianceStatus !== "compliant";

  return (
    <div className="min-h-screen bg-[var(--surface-0)]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Logo */}
          <Link href={`/app/${mailboxId}/mail`} className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="C3scan"
              width={32}
              height={32}
              className="rounded"
              priority
            />
            <span className="font-semibold text-[var(--text-primary)] text-lg">
              C3scan
            </span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href={`/app/${mailboxId}/mail`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname.includes("/mail")
                  ? "bg-[var(--brand-primary-soft)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-0)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Inbox className="w-4 h-4" />
              Mail
            </Link>
            <Link
              href={`/app/${mailboxId}/compliance`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname.includes("/compliance")
                  ? "bg-[var(--brand-primary-soft)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-0)] hover:text-[var(--text-primary)]"
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Compliance
            </Link>
          </nav>

          {/* Right: Notifications & User */}
          <div className="flex items-center gap-2">
            {/* Mailbox Selector */}
            {mailboxes.length > 1 && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setMailboxDropdownOpen(!mailboxDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--surface-0)] transition-colors"
                >
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {currentMailbox.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    PMB {currentMailbox.pmb}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
                
                {mailboxDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[var(--border-subtle)] py-2 z-50">
                    <div className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                      Your Mailboxes
                    </div>
                    {mailboxes.map((mb) => (
                      <Link
                        key={mb.id}
                        href={`/app/${mb.id}/mail`}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-[var(--surface-0)] transition-colors"
                        onClick={() => setMailboxDropdownOpen(false)}
                      >
                        <span className="text-sm text-[var(--text-primary)]">{mb.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">PMB {mb.pmb}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-[var(--surface-0)] transition-colors">
              <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
              {showComplianceBanner && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--semantic-red)] rounded-full" />
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-sm font-semibold text-[var(--action-black)] hover:ring-2 hover:ring-[var(--brand-primary)] transition-all"
              >
                JD
              </button>

              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[var(--border-subtle)] py-2 z-50">
                  <div className="px-4 py-2 border-b border-[var(--border-subtle)]">
                    <p className="text-sm font-medium text-[var(--text-primary)]">John Doe</p>
                    <p className="text-xs text-[var(--text-muted)]">john@techcorp.com</p>
                  </div>
                  <Link
                    href="/app/profile"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-0)] transition-colors"
                  >
                    <User className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-sm text-[var(--text-primary)]">Profile</span>
                  </Link>
                  <Link
                    href="/app/login"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-0)] transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-sm text-[var(--text-primary)]">Sign Out</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-around px-4 py-2 border-t border-[var(--border-subtle)]">
          <Link
            href={`/app/${mailboxId}/mail`}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
              pathname.includes("/mail") ? "text-[var(--action-black)]" : "text-[var(--text-muted)]"
            }`}
          >
            <Inbox className="w-5 h-5" />
            <span className="text-xs">Mail</span>
          </Link>
          <Link
            href={`/app/${mailboxId}/compliance`}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
              pathname.includes("/compliance") ? "text-[var(--action-black)]" : "text-[var(--text-muted)]"
            }`}
          >
            <FileCheck className="w-5 h-5" />
            <span className="text-xs">Compliance</span>
          </Link>
        </nav>
      </header>

      {/* Compliance Banner */}
      {showComplianceBanner && (
        <div className="bg-[var(--semantic-yellow-soft)] border-b border-[var(--semantic-yellow)] px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--semantic-yellow)] flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Complete your USPS compliance
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Form 1583 verification required to receive mail
                </p>
              </div>
            </div>
            <Link
              href={`/app/${mailboxId}/compliance/assistant`}
              className="flex-shrink-0 px-4 py-2 bg-[var(--action-black)] text-white text-sm font-medium rounded-lg hover:bg-[var(--action-black-hover)] transition-colors"
            >
              Finish Compliance
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
