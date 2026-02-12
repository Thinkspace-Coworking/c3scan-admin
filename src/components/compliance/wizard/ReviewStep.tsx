import { FileText, UserCheck, MapPin, Building2, Users, AlertCircle } from "lucide-react";
import { ComplianceFormData } from "@/types/compliance";

interface ReviewStepProps {
  formData: ComplianceFormData;
  mailboxId: string;
}

export function ReviewStep({ formData, mailboxId }: ReviewStepProps) {
  const idTypeLabels: Record<string, string> = {
    drivers_license: "Driver's License",
    passport: "Passport",
    state_id: "State ID Card",
    military_id: "Military ID",
  };

  const formatAddress = () => {
    const parts = [
      formData.addressLine1,
      formData.addressLine2,
      formData.city,
      formData.state,
      formData.postalCode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border-subtle)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-0)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary-soft)] flex items-center justify-center">
            <FileText className="w-5 h-5 text-[var(--action-black)]" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Review Your Information</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Please review all details before signing Form 1583
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Warning Banner */}
        <div className="bg-[var(--semantic-yellow-soft)] border border-[var(--semantic-yellow)] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--semantic-yellow)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-1">Important</h4>
              <p className="text-sm text-[var(--text-secondary)]">
                By continuing, you confirm that all information provided is accurate and truthful. 
                False statements on Form 1583 may result in mail service suspension and potential legal consequences.
              </p>
            </div>
          </div>
        </div>

        {/* Identity Section */}
        <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[var(--surface-0)] border-b border-[var(--border-subtle)] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[var(--text-muted)]" />
            <h3 className="font-medium text-[var(--text-primary)]">Identity Verification</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-muted)]">ID Type</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {formData.idType ? idTypeLabels[formData.idType] : "Not provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-muted)]">Front of ID</span>
              <span className="text-sm font-medium text-[var(--semantic-green)]">
                {formData.idFrontFile ? "Uploaded ✓" : "Not uploaded"}
              </span>
            </div>
            {formData.idType !== "passport" && (
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-muted)]">Back of ID</span>
                <span className="text-sm font-medium text-[var(--semantic-green)]">
                  {formData.idBackFile ? "Uploaded ✓" : "Not uploaded"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[var(--surface-0)] border-b border-[var(--border-subtle)] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
            <h3 className="font-medium text-[var(--text-primary)]">Address</h3>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <span className="text-sm text-[var(--text-muted)] block mb-1">Street Address</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {formatAddress() || "Not provided"}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[var(--border-subtle)]">
              <span className="text-sm text-[var(--text-muted)]">Proof of Address</span>
              <span className="text-sm font-medium text-[var(--semantic-green)]">
                {formData.proofOfAddressFile ? "Uploaded ✓" : "Not uploaded"}
              </span>
            </div>
          </div>
        </div>

        {/* Business Section */}
        <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[var(--surface-0)] border-b border-[var(--border-subtle)] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[var(--text-muted)]" />
            <h3 className="font-medium text-[var(--text-primary)]">Business Information</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-muted)]">Business Use</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {formData.businessUse ? "Yes" : "No"}
              </span>
            </div>
            {formData.businessUse && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Business Name</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {formData.businessName || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Place of Registration</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {formData.placeOfRegistration || "Not provided"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Renters Section */}
        {formData.additionalRenters && formData.additionalRenters.length > 0 && (
          <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-[var(--surface-0)] border-b border-[var(--border-subtle)] flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--text-muted)]" />
              <h3 className="font-medium text-[var(--text-primary)]">
                Additional Renters ({formData.additionalRenters.length})
              </h3>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {formData.additionalRenters.map((renter, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {renter.fullName}
                    </span>
                    {renter.email && (
                      <span className="text-sm text-[var(--text-muted)]">{renter.email}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Mailbox Info */}
        <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[var(--surface-0)] border-b border-[var(--border-subtle)]">
            <h3 className="font-medium text-[var(--text-primary)]">Mailbox Information</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-muted)]">Mailbox ID</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{mailboxId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[var(--text-muted)]">CMRA Location</span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                Thinkspace Seattle
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
