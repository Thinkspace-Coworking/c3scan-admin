"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Download,
  Upload,
  FileCheck,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Building2,
  MapPin,
  Loader2
} from "lucide-react";

interface Mailbox {
  mailbox_id: string;
  pmb_number: string;
  mailbox_label: string;
  is_active: boolean;
  created_at: string;
  company: {
    company_id: string;
    company_name: string;
  } | null;
  location: {
    location_id: string;
    location_name: string;
  } | null;
}

export default function MailboxesPage() {
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "inactive" | "all">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  useEffect(() => {
    fetchMailboxes();
  }, [debouncedSearch, activeTab]);
  
  const fetchMailboxes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      }
      if (activeTab !== 'all') {
        params.set('status', activeTab);
      }
      
      const res = await fetch(`/api/admin/mailboxes?${params.toString()}`);
      const data = await res.json();
      if (data.items) {
        setMailboxes(data.items);
      }
    } catch (err) {
      console.error('Failed to fetch mailboxes:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredMailboxes = mailboxes.filter((mb) => {
    if (activeTab === 'active') return mb.is_active;
    if (activeTab === 'inactive') return !mb.is_active;
    return true;
  });
  
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Mailboxes</h1>
          <p className="text-gray-600 mt-1">Manage customer mailboxes and PMBs</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={18} />
            Export
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Plus size={18} />
            New Mailbox
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "active", label: "Active" },
          { id: "inactive", label: "Inactive" },
          { id: "all", label: "All" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? "border-[#FFCC00] text-gray-900"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by PMB or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
            />
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Upload size={18} />
          Import
        </button>
        <button className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <FileCheck size={18} />
          Export CMRAs
        </button>
      </div>

      {/* Mailboxes Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#FFCC00]" />
          <p className="text-gray-600">Loading mailboxes...</p>
        </div>
      ) : filteredMailboxes.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchQuery ? 'No mailboxes found' : 'No mailboxes yet'}
          </h3>
          <p className="mt-2 text-gray-600">
            {searchQuery ? `No mailboxes matching "${searchQuery}"` : 'Create your first mailbox to get started'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMailboxes.map((mb) => (
            <Link
              key={mb.mailbox_id}
              href={`/admin/mailboxes/${mb.mailbox_id}`}
              className="bg-white p-5 rounded-xl border border-gray-200 hover:border-[#FFCC00] hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFCC00] rounded-lg flex items-center justify-center">
                      <Building2 size={20} className="text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                        {mb.mailbox_label}
                        {mb.pmb_number !== mb.mailbox_label && (
                          <span className="text-gray-500 font-normal ml-2">
                            (PMB {mb.pmb_number})
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                          mb.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {mb.is_active ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                          {mb.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-4 ml-13">
                    {mb.company && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 size={16} className="text-gray-400" />
                        <span>{mb.company.company_name}</span>
                      </div>
                    )}
                    
                    {mb.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{mb.location.location_name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Created {formatDate(mb.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
