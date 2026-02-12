"use client";

import { useState } from "react";
import { Building2, Users, Plus, X, Briefcase, User } from "lucide-react";
import { ComplianceFormData } from "@/types/compliance";

interface BusinessStepProps {
  formData: ComplianceFormData;
  updateFormData: (updates: Partial<ComplianceFormData>) => void;
  onComplete: () => void;
}

export function BusinessStep({ formData, updateFormData, onComplete }: BusinessStepProps) {
  const [isBusinessUse, setIsBusinessUse] = useState(formData.businessUse ?? false);
  const [businessName, setBusinessName] = useState(formData.businessName || "");
  const [placeOfRegistration, setPlaceOfRegistration] = useState(formData.placeOfRegistration || "");
  const [renters, setRenters] = useState<Array<{ fullName: string; email?: string }>>(
    formData.additionalRenters || []
  );
  const [newRenterName, setNewRenterName] = useState("");
  const [newRenterEmail, setNewRenterEmail] = useState("");

  const handleBusinessToggle = (value: boolean) => {
    setIsBusinessUse(value);
    updateFormData({ businessUse: value });
  };

  const handleBusinessNameChange = (value: string) => {
    setBusinessName(value);
    updateFormData({ businessName: value });
  };

  const handlePlaceOfRegistrationChange = (value: string) => {
    setPlaceOfRegistration(value);
    updateFormData({ placeOfRegistration: value });
  };

  const addRenter = () => {
    if (newRenterName.trim()) {
      const updated = [...renters, { fullName: newRenterName.trim(), email: newRenterEmail.trim() }];
      setRenters(updated);
      updateFormData({ additionalRenters: updated });
      setNewRenterName("");
      setNewRenterEmail("");
    }
  };

  const removeRenter = (index: number) => {
    const updated = renters.filter((_, i) => i !== index);
    setRenters(updated);
    updateFormData({ additionalRenters: updated });
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border-subtle)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-0)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary-soft)] flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[var(--action-black)]" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Business & Additional Renters</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Provide business information and list additional mailbox users
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Business Use Section */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-4">
            Is this mailbox for business use?
          </label>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleBusinessToggle(true)}
              className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                isBusinessUse
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]"
                  : "border-[var(--border-subtle)] hover:border-[var(--text-muted)]"
              }`}
            >
              <Briefcase className={`w-8 h-8 ${isBusinessUse ? "text-[var(--action-black)]" : "text-[var(--text-muted)]"}`} />
              <span className={`font-medium ${isBusinessUse ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                Yes, Business Use
              </span>
            </button>
            
            <button
              onClick={() => handleBusinessToggle(false)}
              className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                !isBusinessUse
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]"
                  : "border-[var(--border-subtle)] hover:border-[var(--text-muted)]"
              }`}
            >
              <User className={`w-8 h-8 ${!isBusinessUse ? "text-[var(--action-black)]" : "text-[var(--text-muted)]"}`} />
              <span className={`font-medium ${!isBusinessUse ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                No, Personal Use
              </span>
            </button>
          </div>

          {/* Business Details (only if business use) */}
          {isBusinessUse && (
            <div className="space-y-4 p-4 bg-[var(--surface-0)] rounded-xl">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Business Name <span className="text-[var(--semantic-red)]">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => handleBusinessNameChange(e.target.value)}
                  placeholder="Acme Corporation"
                  className="w-full px-4 py-2.5 bg-white border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Place of Registration (State) <span className="text-[var(--semantic-red)]">*</span>
                </label>
                <input
                  type="text"
                  value={placeOfRegistration}
                  onChange={(e) => handlePlaceOfRegistrationChange(e.target.value)}
                  placeholder="Washington"
                  className="w-full px-4 py-2.5 bg-white border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                />
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Enter the state where your business is registered
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Renters Section */}
        <div className="border-t border-[var(--border-subtle)] pt-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-[var(--text-muted)]" />
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Additional Renters</h3>
              <p className="text-sm text-[var(--text-muted)]">
                List any other individuals who will receive mail at this mailbox
              </p>
            </div>
          </div>

          {/* Current Renters List */}
          {renters.length > 0 && (
            <div className="space-y-2 mb-4">
              {renters.map((renter, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[var(--surface-0)] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--brand-primary-soft)] flex items-center justify-center">
                      <User className="w-4 h-4 text-[var(--action-black)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{renter.fullName}</p>
                      {renter.email && (
                        <p className="text-sm text-[var(--text-muted)]">{renter.email}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeRenter(index)}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Renter Form */}
          <div className="p-4 bg-[var(--surface-0)] rounded-xl">
            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">Add Renter</h4>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={newRenterName}
                onChange={(e) => setNewRenterName(e.target.value)}
                placeholder="Full Name"
                className="flex-1 px-4 py-2.5 bg-white border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              />
              <input
                type="email"
                value={newRenterEmail}
                onChange={(e) => setNewRenterEmail(e.target.value)}
                placeholder="Email (optional)"
                className="flex-1 px-4 py-2.5 bg-white border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
              />
              <button
                onClick={addRenter}
                disabled={!newRenterName.trim()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--action-black)] text-white font-medium rounded-lg hover:bg-[var(--action-black-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-[var(--semantic-blue-soft)] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-[var(--semantic-blue)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-1">Why we need this</h4>
              <p className="text-sm text-[var(--text-secondary)]">
                USPS requires CMRA operators to maintain a complete list of all individuals 
                receiving mail at each mailbox. This information is used to generate Form 1583.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
