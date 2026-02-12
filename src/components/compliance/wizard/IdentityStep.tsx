"use client";

import { useState, useCallback } from "react";
import { UserCheck, Upload, X, Camera, CreditCard, FileCheck } from "lucide-react";
import { ComplianceFormData } from "@/types/compliance";

interface IdentityStepProps {
  formData: ComplianceFormData;
  updateFormData: (updates: Partial<ComplianceFormData>) => void;
  onComplete: () => void;
}

const idTypes = [
  { id: "drivers_license", label: "Driver's License", icon: CreditCard },
  { id: "passport", label: "Passport", icon: FileCheck },
  { id: "state_id", label: "State ID Card", icon: CreditCard },
  { id: "military_id", label: "Military ID", icon: FileCheck },
] as const;

export function IdentityStep({ formData, updateFormData, onComplete }: IdentityStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [localIdType, setLocalIdType] = useState(formData.idType || "");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, side: "front" | "back") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (side === "front") {
        updateFormData({ idFrontFile: file });
      } else {
        updateFormData({ idBackFile: file });
      }
    }
  }, [updateFormData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (side === "front") {
        updateFormData({ idFrontFile: file });
      } else {
        updateFormData({ idBackFile: file });
      }
    }
  };

  const handleIdTypeSelect = (type: typeof idTypes[number]["id"]) => {
    setLocalIdType(type);
    updateFormData({ idType: type });
  };

  const needsBackImage = localIdType !== "passport";
  const isComplete = formData.idType && formData.idFrontFile && (!needsBackImage || formData.idBackFile);

  return (
    <div className="bg-white rounded-xl border border-[var(--border-subtle)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-0)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary-soft)] flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-[var(--action-black)]" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Identity Verification</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Upload your government-issued photo ID
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* ID Type Selection */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
            Select ID Type <span className="text-[var(--semantic-red)]">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {idTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = localIdType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => handleIdTypeSelect(type.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]"
                      : "border-[var(--border-subtle)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isSelected ? "text-[var(--action-black)]" : "text-[var(--text-muted)]"}`} />
                  <span className={`text-sm font-medium ${isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Front of ID Upload */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
            Front of ID <span className="text-[var(--semantic-red)]">*</span>
          </label>
          {formData.idFrontFile ? (
            <div className="relative p-4 bg-[var(--surface-0)] rounded-xl border border-[var(--border-subtle)]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[var(--brand-primary)] rounded-lg flex items-center justify-center">
                  <FileCheck className="w-8 h-8 text-[var(--action-black)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--text-primary)] truncate">
                    {formData.idFrontFile.name}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {(formData.idFrontFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => updateFormData({ idFrontFile: undefined })}
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
              onDrop={(e) => handleDrop(e, "front")}
              className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
                dragActive
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]"
                  : "border-[var(--border-subtle)] hover:border-[var(--text-muted)]"
              }`}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, "front")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--surface-0)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-[var(--text-muted)]" />
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                  Drop front of ID here, or click to browse
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Supports JPG, PNG, PDF up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Back of ID Upload (not needed for passport) */}
        {needsBackImage && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
              Back of ID <span className="text-[var(--semantic-red)]">*</span>
            </label>
            {formData.idBackFile ? (
              <div className="relative p-4 bg-[var(--surface-0)] rounded-xl border border-[var(--border-subtle)]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[var(--brand-primary)] rounded-lg flex items-center justify-center">
                    <FileCheck className="w-8 h-8 text-[var(--action-black)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text-primary)] truncate">
                      {formData.idBackFile.name}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {(formData.idBackFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => updateFormData({ idBackFile: undefined })}
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
                onDrop={(e) => handleDrop(e, "back")}
                className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
                  dragActive
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]"
                    : "border-[var(--border-subtle)] hover:border-[var(--text-muted)]"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, "back")}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--surface-0)] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-[var(--text-muted)]" />
                  </div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                    Drop back of ID here, or click to browse
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Supports JPG, PNG, PDF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="bg-[var(--semantic-blue-soft)] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Camera className="w-5 h-5 text-[var(--semantic-blue)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-1">Photo Tips</h4>
              <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                <li>• Ensure all text is clearly readable</li>
                <li>• Use good lighting and avoid glare</li>
                <li>• Capture the entire ID within the frame</li>
                <li>• Make sure the image is not blurry</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
