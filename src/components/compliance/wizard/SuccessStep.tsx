import { CheckCircle2, Clock, FileCheck, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

interface SuccessStepProps {
  mailboxId: string;
}

export function SuccessStep({ mailboxId }: SuccessStepProps) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border-subtle)] p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[var(--semantic-green-soft)] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-[var(--semantic-green)]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-4">
          Compliance Submitted!
        </h1>

        {/* Description */}
        <p className="text-[var(--text-secondary)] mb-8">
          Your Form 1583 has been submitted successfully and is now under review. 
          You'll receive an email notification once approved.
        </p>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-[var(--surface-0)] rounded-xl">
            <FileCheck className="w-8 h-8 text-[var(--brand-primary)] mx-auto mb-2" />
            <h3 className="font-medium text-[var(--text-primary)] mb-1">Form 1583</h3>
            <p className="text-sm text-[var(--text-muted)]">Submitted</p>
          </div>
          <div className="p-4 bg-[var(--surface-0)] rounded-xl">
            <Clock className="w-8 h-8 text-[var(--semantic-blue)] mx-auto mb-2" />
            <h3 className="font-medium text-[var(--text-primary)] mb-1">Review Time</h3>
            <p className="text-sm text-[var(--text-muted)]">1-2 business days</p>
          </div>
          <div className="p-4 bg-[var(--surface-0)] rounded-xl">
            <Mail className="w-8 h-8 text-[var(--semantic-green)] mx-auto mb-2" />
            <h3 className="font-medium text-[var(--text-primary)] mb-1">Mail Access</h3>
            <p className="text-sm text-[var(--text-muted)]">After approval</p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-[var(--surface-0)] rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">What happens next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--brand-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-[var(--action-black)]">1</span>
              </div>
              <span className="text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">Staff Review</strong>
                <br />
                Our team will review your submitted documents and information
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--brand-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-[var(--action-black)]">2</span>
              </div>
              <span className="text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">Email Notification</strong>
                <br />
                You'll receive an email when your compliance is approved or if additional info is needed
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--brand-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-[var(--action-black)]">3</span>
              </div>
              <span className="text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">Full Mail Access</strong>
                <br />
                Once approved, you can receive and manage all mail through your virtual mailbox
              </span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/app/${mailboxId}/compliance`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--brand-primary)] text-[var(--action-black)] font-medium rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            View Compliance Status
          </Link>
          <Link
            href={`/app/${mailboxId}/mail`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--surface-0)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mail
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs text-[var(--text-muted)]">
          Have questions? Contact support at support@thinkspace.com
        </p>
      </div>
    </div>
  );
}
