"use client";

import { useState, useCallback } from "react";
import { MapPin, Upload, X, FileCheck, Home, FileText } from "lucide-react";
import { ComplianceFormData } from "@/types/compliance";

interface AddressStepProps {
  formData: ComplianceFormData;
  updateFormData: (updates: Partial<ComplianceFormData>) => void;
  onComplete: () => void;
}

const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC", "PR"
];

export function AddressStep({ formData, updateFormData, onComplete }: AddressStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [localAddress, setLocalAddress] = useState({
    addressLine1: formData.addressLine1 || "",
    addressLine2: formData.addressLine2 || "",
    city: formData.city || "",
    state: formData.state || "",
    postalCode: formData.postalCode || "",
  });

  const handleAddressChange = (field: keyof typeof localAddress, value: string) => {
    const updated = { ...localAddress, [field]: value };
    setLocalAddress(updated);
    updateFormData(updated);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      updateFormData({ proofOfAddressFile: e.dataTransfer.files[0] });
    }
  }, [updateFormData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateFormData({ proofOfAddressFile: e.target.files[0] });
    }
  };

  const isComplete = 
    localAddress.addressLine1 && 
    localAddress.city && 
    localAddress.state && 
    localAddress.postalCode && 
    formData.proofOfAddressFile;

  return (
    <div className="bg-white rounded-xl border border-[var(--border-subtle)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-0)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary-soft)] flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[var(--action-black)]" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Proof of Address</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Enter your current address and upload proof of residence
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Address Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Street Address <span className="text-[var(--semantic-red)]">*</span>
            </label>
            <input
              type="text"
              value={localAddress.addressLine1}
              onChange={(e) => handleAddressChange("addressLine1", e.target.value)}
              placeholder="123 Main Street"
              className="w-full px-4 py-2.5 bg-white border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Apartment, Suite, etc. (optional)
            </label>
            <input
              type="text"
              value={localAddress.addressLine2}
              onChange={(e) => handleAddressChange("addressLine2", e.target.value)}
              placeholder="Apt 4B"
              className="w-full px-4 py-2.5 bg-white border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                City <span className="text-[var(--semantic-red)]">*</span>
              </label>
              <input
                type="text"
                value={localAddress.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                placeholder="Seattle"
                className="w-full px-4 py-2.5 bg-white border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                State <span className="text-[var(--semantic-red)]">*</span>
              </label>
              <select
                value={localAddress.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                <option value="">Select</option>
                {usStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                ZIP Code <span className="text-[var(--semantic-red)]">*</span>
              </label>
              <input
                type="text"
                value={localAddress.postalCode}
                onChange={(e) => handleAddressChange("postalCode", e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98101"
                className="w-full px-4 py-2.5 bg-white border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Proof of Address Upload */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
            Proof of Address Document <span className="text-[var(--semantic-red)]">*</span>
          </label>
          <p className="text-sm text-[var(--text-muted)] mb-3">
            Upload a utility bill, bank statement, lease agreement, or government document dated within the last 90 days.
          </p>

          {formData.proofOfAddressFile ? (
            <div className="relative p-4 bg-[var(--surface-0)] rounded-xl border border-[var(--border-subtle)]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[var(--brand-primary)] rounded-lg flex items-center justify-center">
                  <FileCheck className="w-8 h-8 text-[var(--action-black)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--text-primary)] truncate">
                    {formData.proofOfAddressFile.name}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {(formData.proofOfAddressFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => updateFormData({ proofOfAddressFile: undefined })}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
                dragActive
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]"
                  : "border-[var(--border-subtle)] hover:border-[var(--text-muted)]"
              }`}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--surface-0)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-[var(--text-muted)]" />
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                  Drop document here, or click to browse
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Supports JPG, PNG, PDF up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Accepted Documents */}
        <div className="bg-[var(--surface-0)] rounded-xl p-4">
          <h4 className="font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--brand-primary)]" />
            Accepted Documents
          </h4>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--semantic-green)]" />
              Utility bill (gas, electric, water)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--semantic-green)]" />
              Bank or credit card statement
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--semantic-green)]" />
              Lease or rental agreement
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--semantic-green)]" />
              Government-issued document
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--semantic-green)]" />
              Insurance statement
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--semantic-green)]" />
              Pay stub with address
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-[var(--semantic-yellow-soft)] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Home className="w-5 h-5 text-[var(--semantic-yellow)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-1">Important</h4>
              <p className="text-sm text-[var(--text-secondary)]">
                This address must match your government-issued ID. P.O. boxes are not accepted as proof of address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
