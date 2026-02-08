'use client'

import { useEffect, useState, useCallback } from 'react'
import { api, type PaymentMethod, type Invoice } from '@/lib/api'
import { StatusPill } from '@/components/ui/StatusPill'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { 
  CreditCard, 
  Plus, 
  MoreHorizontal, 
  Download, 
  Search, 
  Filter,
  Loader2, 
  AlertCircle, 
  RefreshCw,
  Building2,
  FileText,
  DollarSign
} from 'lucide-react'

// Card brand icons
const cardBrands: Record<string, { name: string; color: string }> = {
  visa: { name: 'Visa', color: 'bg-blue-600' },
  mastercard: { name: 'Mastercard', color: 'bg-orange-500' },
  amex: { name: 'American Express', color: 'bg-green-600' },
  discover: { name: 'Discover', color: 'bg-orange-600' },
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

function formatCardBrand(brand: string): string {
  return cardBrands[brand]?.name || brand.charAt(0).toUpperCase() + brand.slice(1)
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'payment_methods' | 'invoices'>('payment_methods')
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)

  const fetchBillingData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (activeTab === 'payment_methods') {
        const data = await api.getPaymentMethods()
        setPaymentMethods(data)
      } else {
        const data = await api.getInvoices({
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchQuery || undefined
        })
        setInvoices(data)
      }
    } catch (err) {
      console.error('Error fetching billing data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load billing data')
    } finally {
      setLoading(false)
    }
  }, [activeTab, statusFilter, searchQuery])

  useEffect(() => {
    fetchBillingData()
  }, [fetchBillingData])

  async function handleDeletePaymentMethod(paymentMethodId: string) {
    if (!confirm('Are you sure you want to remove this payment method?')) return
    
    try {
      await api.deletePaymentMethod(paymentMethodId)
      await fetchBillingData()
    } catch (err) {
      console.error('Error deleting payment method:', err)
      setError(err instanceof Error ? err.message : 'Failed to remove payment method')
    }
  }

  const totalOutstanding = invoices
    .filter(i => i.status === 'open')
    .reduce((sum, i) => sum + i.amount_cents, 0)

  const totalPaid = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount_cents, 0)

  return (
    <>
      <CommandPalette />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 mt-1">
          Manage payment methods and view invoices
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#FFCC00]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{paymentMethods.length}</p>
              <p className="text-sm text-gray-500">Payment Methods</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOutstanding)}</p>
              <p className="text-sm text-gray-500">Outstanding</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
              <p className="text-sm text-gray-500">Total Paid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 flex-1">{error}</p>
          <button
            onClick={fetchBillingData}
            className="flex items-center gap-1.5 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('payment_methods')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'payment_methods'
              ? 'border-[#FFCC00] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Payment Methods
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'invoices'
              ? 'border-[#FFCC00] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          Invoices
        </button>
      </div>

      {/* Payment Methods Tab */}
      {activeTab === 'payment_methods' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Saved Payment Methods</h2>
            <button className="inline-flex items-center px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-[#FFCC00]" />
            </div>
          ) : paymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.payment_method_id}
                  className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-8 rounded-md ${cardBrands[method.brand]?.color || 'bg-gray-600'} flex items-center justify-center`}>
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatCardBrand(method.brand)} •••• {method.last4}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires {method.exp_month}/{method.exp_year}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.is_default && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                          Default
                        </span>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(method.payment_method_id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500">No payment methods</p>
              <p className="text-sm text-gray-400 mt-1">
                Add a payment method to enable automatic billing
              </p>
            </div>
          )}
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by invoice ID or mailbox..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="paid">Paid</option>
                  <option value="void">Void</option>
                </select>
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#FFCC00]" />
              </div>
            ) : invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.invoice_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {invoice.invoice_id.substring(0, 8)}...
                            </code>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(invoice.period_start).toLocaleDateString()} - {new Date(invoice.period_end).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">
                            {formatCurrency(invoice.amount_cents)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusPill status={invoice.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                              title="View Mailbox"
                            >
                              <Building2 className="w-4 h-4" />
                            </button>
                            <button
                              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No invoices found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Invoices will appear here when generated'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
