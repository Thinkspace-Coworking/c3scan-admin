"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft,
  Building2,
  Package,
  Tag,
  Edit2,
  Archive,
  RotateCcw,
  Save,
  X,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface Company {
  company_id: string;
  company_name: string;
  external_id: string | null;
  is_active: boolean;
  mailbox: {
    mailbox_id: string;
    pmb_number: string;
    location: {
      location_name: string;
    };
  } | null;
}

interface Alias {
  company_alias_id: string;
  alias_name: string;
  alias_name_normalized: string;
  alias_type: 'dba' | 'authorized_member' | 'ocr_variant';
  mailbox_id: string | null;
  is_active: boolean;
  effective_from: string;
  effective_to: string | null;
  created_at: string;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.company_id as string;
  
  const [company, setCompany] = useState<Company | null>(null);
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAlias, setEditingAlias] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ alias_name: '', alias_type: '' });
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'archived'>('all');
  
  useEffect(() => {
    fetchCompanyDetail();
  }, [companyId]);
  
  const fetchCompanyDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/companies/${companyId}`);
      const data = await res.json();
      if (data.company) {
        setCompany(data.company);
        setAliases(data.aliases || []);
      }
    } catch (err) {
      console.error('Failed to fetch company:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (alias: Alias) => {
    setEditingAlias(alias.company_alias_id);
    setEditForm({
      alias_name: alias.alias_name,
      alias_type: alias.alias_type
    });
  };
  
  const handleSaveEdit = async (aliasId: string) => {
    try {
      const res = await fetch(`/api/admin/company-aliases/${aliasId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alias_name: editForm.alias_name,
          alias_type: editForm.alias_type
        })
      });
      
      if (res.ok) {
        setEditingAlias(null);
        fetchCompanyDetail();
      } else {
        alert('Failed to update alias');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update alias');
    }
  };
  
  const handleArchive = async (aliasId: string) => {
    if (!confirm('Are you sure you want to archive this alias? It will no longer be used for matching.')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/admin/company-aliases/${aliasId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_active: false,
          notes: 'Archived by admin'
        })
      });
      
      if (res.ok) {
        fetchCompanyDetail();
      } else {
        alert('Failed to archive alias');
      }
    } catch (err) {
      console.error('Archive error:', err);
      alert('Failed to archive alias');
    }
  };
  
  const handleRestore = async (aliasId: string) => {
    try {
      const res = await fetch(`/api/admin/company-aliases/${aliasId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_active: true,
          notes: 'Restored by admin'
        })
      });
      
      if (res.ok) {
        fetchCompanyDetail();
      } else {
        alert('Failed to restore alias');
      }
    } catch (err) {
      console.error('Restore error:', err);
      alert('Failed to restore alias');
    }
  };
  
  const filteredAliases = aliases.filter(a => {
    if (activeFilter === 'active') return a.is_active;
    if (activeFilter === 'archived') return !a.is_active;
    return true;
  });
  
  const activeCount = aliases.filter(a => a.is_active).length;
  const archivedCount = aliases.filter(a => !a.is_active).length;
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getAliasTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dba: 'DBA Name',
      authorized_member: 'Authorized Member',
      ocr_variant: 'OCR Variant'
    };
    return labels[type] || type;
  };
  
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FFCC00] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading company...</p>
      </div>
    );
  }
  
  if (!company) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Company not found</h3>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link 
        href="/admin/companies"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Companies
      </Link>
      
      {/* Company Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-[#FFCC00] rounded-xl flex items-center justify-center">
            <Building2 size={28} className="text-gray-900" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">{company.company_name}</h1>
            {company.external_id && (
              <p className="text-gray-500 mt-1">ID: {company.external_id}</p>
            )}
            
            {company.mailbox && (
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package size={16} className="text-gray-400" />
                  <span>PMB {company.mailbox.pmb_number}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 size={16} className="text-gray-400" />
                  <span>{company.mailbox.location.location_name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Aliases Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Tag size={20} />
            Mail Aliases
          </h2>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm">
            Add Alias
          </button>
        </div>
        
        {/* Stats & Filter */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === 'all' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({aliases.length})
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
              activeFilter === 'active' 
                ? 'bg-green-600 text-white' 
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            <CheckCircle size={14} />
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveFilter('archived')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
              activeFilter === 'archived' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Archive size={14} />
            Archived ({archivedCount})
          </button>
        </div>
        
        {/* Aliases Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredAliases.length === 0 ? (
            <div className="p-12 text-center">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {activeFilter === 'archived' ? 'No archived aliases' : 'No aliases yet'}
              </h3>
              <p className="mt-2 text-gray-600">
                {activeFilter === 'archived' 
                  ? 'Archived aliases will appear here'
                  : 'Add an alias to help match mail to this company'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alias Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAliases.map((alias) => (
                  <tr key={alias.company_alias_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      {editingAlias === alias.company_alias_id ? (
                        <input
                          type="text"
                          value={editForm.alias_name}
                          onChange={(e) => setEditForm({ ...editForm, alias_name: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                        />
                      ) : (
                        <div>
                          <p className={`font-medium ${alias.is_active ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
                            {alias.alias_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {alias.alias_name_normalized}
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingAlias === alias.company_alias_id ? (
                        <select
                          value={editForm.alias_type}
                          onChange={(e) => setEditForm({ ...editForm, alias_type: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                        >
                          <option value="dba">DBA Name</option>
                          <option value="authorized_member">Authorized Member</option>
                          <option value="ocr_variant">OCR Variant</option>
                        </select>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {getAliasTypeLabel(alias.alias_type)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {alias.is_active ? (
                        <span className="inline-flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle size={14} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                          <Archive size={14} />
                          Archived
                          {alias.effective_to && (
                            <span className="text-xs text-gray-400">
                              ({formatDate(alias.effective_to)})
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(alias.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingAlias === alias.company_alias_id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(alias.company_alias_id)}
                              className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              title="Save"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={() => setEditingAlias(null)}
                              className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            {alias.is_active ? (
                              <>
                                <button
                                  onClick={() => handleEdit(alias)}
                                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleArchive(alias.company_alias_id)}
                                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                  title="Archive"
                                >
                                  <Archive size={16} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleRestore(alias.company_alias_id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors flex items-center gap-1"
                                title="Restore"
                              >
                                <RotateCcw size={16} />
                                <span className="text-sm">Restore</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
