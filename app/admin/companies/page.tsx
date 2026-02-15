"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Building2,
  Package,
  Tag,
  ChevronRight,
  Plus
} from "lucide-react";

interface Company {
  company_id: string;
  company_name: string;
  external_id: string | null;
  mailbox: {
    mailbox_id: string;
    pmb_number: string;
    location_name: string;
  } | null;
  alias_count: number;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Fetch companies
  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearch]);
  
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('include_aliases', 'true');
      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      }
      
      const res = await fetch(`/api/admin/companies?${params.toString()}`);
      const data = await res.json();
      if (data.items) {
        setCompanies(data.items);
      }
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">Manage companies and their mail aliases</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          <Plus size={18} />
          Add Company
        </button>
      </div>
      
      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Companies Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#FFCC00] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading companies...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchQuery ? 'No companies found' : 'No companies yet'}
          </h3>
          <p className="mt-2 text-gray-600">
            {searchQuery 
              ? `No companies matching "${searchQuery}"` 
              : 'Add your first company to get started'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {companies.map((company) => (
            <Link
              key={company.company_id}
              href={`/admin/companies/${company.company_id}`}
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
                        {company.company_name}
                      </h3>
                      {company.external_id && (
                        <p className="text-sm text-gray-500">
                          ID: {company.external_id}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-4 ml-13">
                    {company.mailbox ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package size={16} className="text-gray-400" />
                        <span>PMB {company.mailbox.pmb_number}</span>
                        <span className="text-gray-400">•</span>
                        <span>{company.mailbox.location_name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">No mailbox assigned</span>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag size={16} className="text-gray-400" />
                      <span>{company.alias_count} aliases</span>
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
