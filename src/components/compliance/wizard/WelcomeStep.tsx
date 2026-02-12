import { Shield, FileText, Clock, ChevronRight } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border-subtle)] p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-[var(--brand-primary-soft)] rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-[var(--action-black)]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-4">
          Complete Your USPS Compliance
        </h1>

        {/* Description */}
        <p className="text-[var(--text-secondary)] mb-8">
          To receive mail at your virtual mailbox, USPS requires us to verify your identity 
          and collect a signed Form 1583. This process takes about 5-10 minutes.
        </p>

        {/* What you'll need */}
        <div className="bg-[var(--surface-0)] rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
            What you'll need
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--brand-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-[var(--action-black)]">1</span>
              </div>
              <span className="text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">Government-issued photo ID</strong>
                <br />
                Driver's license, passport, state ID, or military ID
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--brand-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-[var(--action-black)]">2</span>
              </div>
              <span className="text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">Proof of address</strong>
                <br />
                Utility bill, bank statement, or lease agreement (within last 90 days)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--brand-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-[var(--action-black)]">3</span>
              </div>
              <span className="text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">Business information</strong> (if applicable)
                <br />
                Company name and place of registration
              </span>
            </li>
          </ul>
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] mb-8">
          <Clock className="w-4 h-4" />
          <span>Estimated time: 5-10 minutes</span>
        </div>

        {/* CTA Button */}
        <button
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--brand-primary)] text-[var(--action-black)] font-semibold rounded-xl hover:bg-[var(--brand-primary-hover)] transition-colors text-lg"
        >
          Start Compliance Setup
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Footer note */}
        <p className="mt-6 text-xs text-[var(--text-muted)]">
          By continuing, you agree to provide accurate information for USPS Form 1583. 
          False information may result in mail service suspension.
        </p>
      </div>
    </div>
  );
}
