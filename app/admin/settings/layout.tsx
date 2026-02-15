"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Package,
  Truck,
  Building2,
  Palette,
  FileCheck,
  Users,
  Zap,
  Plug,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

const settingsNav = [
  { href: "/admin/settings/general", icon: Settings, label: "General" },
  { href: "/admin/settings/offerings", icon: Package, label: "Offerings" },
  { href: "/admin/settings/carriers", icon: Truck, label: "Carriers" },
  { href: "/admin/settings/banks", icon: Building2, label: "Banks" },
  { href: "/admin/settings/brand", icon: Palette, label: "Brand" },
  { href: "/admin/settings/compliance", icon: FileCheck, label: "Compliance" },
  { href: "/admin/settings/access", icon: Users, label: "Access" },
  { href: "/admin/settings/automations", icon: Zap, label: "Automations" },
  { href: "/admin/settings/integrations", icon: Plug, label: "Integrations" },
  { href: "/admin/settings/maintenance", icon: AlertTriangle, label: "Maintenance" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your operator settings</p>
      </div>

      <div className="flex gap-6">
        {/* Settings Navigation */}
        <nav className="w-64 flex-shrink-0 space-y-1">
          {settingsNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
            );
          })}
        </nav>

        {/* Settings Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
