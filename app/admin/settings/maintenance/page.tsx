"use client";

import { useState, useEffect } from "react";
import { 
  AlertTriangle,
  CheckCircle,
  Power,
  Clock,
  RefreshCw
} from "lucide-react";

interface MaintenanceStatus {
  is_enabled: boolean;
  message: string;
  enabled_at?: string;
  enabled_by?: string;
}

export default function MaintenanceSettingsPage() {
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchStatus();
  }, []);
  
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/admin/maintenance-mode');
      const data = await res.json();
      setStatus(data);
      setEnabled(data.is_enabled);
      setCustomMessage(data.message || '');
    } catch (err) {
      setError('Failed to fetch maintenance status');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggle = async () => {
    setSaving(true);
    setError(null);
    setMessage('');
    
    try {
      const res = await fetch('/api/admin/maintenance-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_enabled: !enabled,
          message: customMessage || 'We are performing scheduled maintenance. Please check back soon.'
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setEnabled(!enabled);
        setStatus({
          is_enabled: !enabled,
          message: customMessage,
          enabled_at: data.enabled_at,
          enabled_by: data.enabled_by
        });
        setMessage(!enabled 
          ? 'Maintenance mode enabled. Customer site is now offline.' 
          : 'Maintenance mode disabled. Customer site is now online.'
        );
      } else {
        setError(data.error?.message || 'Failed to toggle maintenance mode');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FFCC00] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Maintenance Mode</h1>
        <p className="text-gray-600 mt-1">
          Take the customer-facing site offline while keeping admin access available
        </p>
      </div>
      
      {/* Status Card */}
      <div className={`rounded-xl border-2 p-6 ${
        enabled 
          ? 'bg-red-50 border-red-200' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              enabled ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {enabled ? (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${
                enabled ? 'text-red-900' : 'text-green-900'
              }`}>
                {enabled ? 'Maintenance Mode is ON' : 'Maintenance Mode is OFF'}
              </h2>
              <p className={`text-sm ${
                enabled ? 'text-red-700' : 'text-green-700'
              }`}>
                {enabled 
                  ? 'Customer site is offline. Admin access remains available.' 
                  : 'Customer site is online and accessible.'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleToggle}
            disabled={saving}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              enabled 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Power size={18} />
                {enabled ? 'Disable Maintenance' : 'Enable Maintenance'}
              </>
            )}
          </button>
        </div>
        
        {enabled && status?.enabled_at && (
          <div className="mt-4 pt-4 border-t border-red-200 flex items-center gap-2 text-sm text-red-700">
            <Clock size={16} />
            Enabled since {new Date(status.enabled_at).toLocaleString()}
          </div>
        )}
      </div>
      
      {/* Message Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Message</h3>
        <p className="text-sm text-gray-600 mb-4">
          This message will be displayed to customers when they try to access the site during maintenance.
        </p>
        
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="We are performing scheduled maintenance. Please check back soon."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent h-24 resize-none"
        />
        
        <p className="text-xs text-gray-500 mt-2">
          Default: &quot;We are performing scheduled maintenance. Please check back soon.&quot;
        </p>
      </div>
      
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            What Stays Online
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Admin dashboard and all admin routes</li>
            <li>• Admin API endpoints</li>
            <li>• Authentication endpoints</li>
            <li>• Emergency login</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600" />
            What Goes Offline
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Customer-facing pages</li>
            <li>• Customer API endpoints</li>
            <li>• Public company pages</li>
            <li>• Customer login and registration</li>
          </ul>
        </div>
      </div>
      
      {/* Messages */}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}
      
      {/* Preview */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <RefreshCw size={16} />
          Preview
        </h3>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-[#FFCC00] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">⚙️</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Scheduled Maintenance</h4>
          <p className="text-sm text-gray-600">
            {customMessage || 'We are performing scheduled maintenance. Please check back soon.'}
          </p>
        </div>
      </div>
    </div>
  );
}
