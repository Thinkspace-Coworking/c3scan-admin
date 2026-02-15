"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft,
  Package,
  Building2,
  Mail,
  Inbox,
  FileCheck,
  Edit2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  User
} from "lucide-react";

interface Mailbox {
  mailbox_id: string;
  pmb_number: string;
  mailbox_label: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  company: {
    company_id: string;
    company_name: string;
  } | null;
  location: {
    location_id: string;
    location_name: string;
    address_line1: string;
    city: string;
    state_province: string;
  } | null;
}

interface MailItem {
  mail_item_id: string;
  received_at: string;
  status: string;
  is_active: boolean;
  match_confidence: number;
  mail_item_image: {
    image_type: string;
    storage_path: string;
  }[];
}

interface ActiveRequest {
  request_id: string;
  request_type: string;
  request_status: string;
  requested_at: string;
}

interface ComplianceStatus {
  status: 'compliant' | 'pending' | 'non_compliant';
  grace_expires_at: string | null;
  documents_uploaded: number;
  documents_required: number;
}

export default function MailboxDetailPage() {
  const params = useParams();
  const mailboxId = params.mailbox_id as string;
  
  const [mailbox, setMailbox] = useState<Mailbox | null>(null);
  const [recentMail, setRecentMail] = useState<MailItem[]>([]);
  const [activeRequests, setActiveRequests] = useState<ActiveRequest[]>([]);
  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null);
  const [stats, setStats] = useState({ total_mail_items: 0, active_requests: 0, pending_mail: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    mailbox_label: '',
    pmb_number: ''
  });
  
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchMailboxDetail();
  }, [mailboxId]);
  
  const fetchMailboxDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/mailboxes/${mailboxId}`);
      const data = await res.json();
      
      if (data.mailbox) {
        setMailbox(data.mailbox);
        setRecentMail(data.recent_mail || []);
        setActiveRequests(data.active_requests || []);
        setCompliance(data.compliance);
        setStats(data.stats || { total_mail_items: 0, active_requests: 0, pending_mail: 0 });
        setEditForm({
          mailbox_label: data.mailbox.mailbox_label,
          pmb_number: data.mailbox.pmb_number
        });
      } else {
        setError('Mailbox not found');
      }
    } catch (err) {
      setError('Failed to fetch mailbox details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!editForm.mailbox_label.trim() || !editForm.pmb_number.trim()) {
      setError('Mailbox label and PMB number are required');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/admin/mailboxes/${mailboxId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mailbox_label: editForm.mailbox_label,
          pmb_number: editForm.pmb_number
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMailbox(data.mailbox);
        setIsEditing(false);
        setMessage('Mailbox updated successfully');
        setTimeout(() => setMessage(null), 3000);
      } else {
        setError(data.error?.message || 'Failed to update mailbox');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      uploaded: 'bg-blue-100 text-blue-700',
      processed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };
  
  if (loading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#FFCC00]" />
        <p className="text-gray-600">Loading mailbox...</p>
      </div>
    );
  }
  
  if (!mailbox) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Mailbox not found</h3>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/admin/mailboxes" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} />
        Back to Mailboxes
      </Link>
      
      {/* Messages */}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 flex items-center gap-2">
          <CheckCircle size={18} />
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      
      {/* Mailbox Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 bg-[#FFCC00] rounded-xl flex items-center justify-center flex-shrink-0">
              <Package size={28} className="text-gray-900" />
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mailbox Label</label>
                    <input
                      type="text"
                      value={editForm.mailbox_label}
                      onChange={(e) => setEditForm({ ...editForm, mailbox_label: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PMB Number</label>
                    <input
                      type="text"
                      value={editForm.pmb_number}
                      onChange={(e) => setEditForm({ ...editForm, pmb_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          mailbox_label: mailbox.mailbox_label,
                          pmb_number: mailbox.pmb_number
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-900">
                        {mailbox.mailbox_label}
                        {mailbox.pmb_number !== mailbox.mailbox_label && (
                          <span className="text-gray-500 text-lg font-normal ml-2">
                            (PMB {mailbox.pmb_number})
                          </span>
                        )}
                      </h1>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          mailbox.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {mailbox.is_active ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {mailbox.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit mailbox"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 mt-4">
                    {mailbox.company && (
                      <Link 
                        href={`/admin/companies/${mailbox.company.company_id}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <Building2 size={16} className="text-gray-400" />
                        <span>{mailbox.company.company_name}</span>
                      </Link>
                    )}
                    
                    {mailbox.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{mailbox.location.location_name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} className="text-gray-400" />
                      <span>Created {formatDate(mailbox.created_at)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_mail_items}</p>
              <p className="text-sm text-gray-600">Total Mail Items</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Inbox size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending_mail}</p>
              <p className="text-sm text-gray-600">Pending Mail</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{stats.active_requests}</p>
              <p className="text-sm text-gray-600">Active Requests</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Mail */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Mail size={18} />
              Recent Mail
            </h2>
            <Link 
              href={`/admin/mail?mailbox_id=${mailboxId}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all →
            </Link>
          </div>
          
          {recentMail.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Mail className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <p>No mail items yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentMail.slice(0, 5).map((item) => (
                <Link
                  key={item.mail_item_id}
                  href={`/admin/mail/${item.mail_item_id}`}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Mail size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDate(item.received_at)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.mail_item_image?.length || 0} images
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Active Requests */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Inbox size={18} />
              Active Requests
            </h2>
            <Link 
              href={`/admin/requests?mailbox_id=${mailboxId}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all →
            </Link>
          </div>
          
          {activeRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Inbox className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <p>No active requests</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activeRequests.map((req) => (
                <Link
                  key={req.request_id}
                  href={`/admin/requests/${req.request_id}`}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {req.request_type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Requested {formatDate(req.requested_at)}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                    {req.request_status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Compliance Status */}
      {compliance && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <FileCheck size={18} />
            Compliance Status
          </h2>
          
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              compliance.status === 'compliant' ? 'bg-green-100' :
              compliance.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              {compliance.status === 'compliant' ? (
                <CheckCircle size={24} className="text-green-600" />
              ) : compliance.status === 'pending' ? (
                <Clock size={24} className="text-yellow-600" />
              ) : (
                <AlertCircle size={24} className="text-red-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 capitalize">
                {compliance.status.replace('_', ' ')}
              </p>
              <p className="text-sm text-gray-600">
                {compliance.documents_uploaded} of {compliance.documents_required} documents uploaded
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
