"use client";

import { useRef, useState, useEffect } from "react";
import { PenTool, RefreshCw, CheckCircle2, FileText } from "lucide-react";
import { ComplianceFormData } from "@/types/compliance";

interface SignStepProps {
  formData: ComplianceFormData;
  updateFormData: (updates: Partial<ComplianceFormData>) => void;
  onSubmit: () => void;
}

export function SignStep({ formData, updateFormData, onSubmit }: SignStepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas
    ctx.strokeStyle = "#1A202C";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      updateFormData({ signatureDataUrl: dataUrl });
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    updateFormData({ signatureDataUrl: undefined });
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border-subtle)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-0)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary-soft)] flex items-center justify-center">
            <PenTool className="w-5 h-5 text-[var(--action-black)]" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">Sign Form 1583</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Provide your digital signature to complete the compliance process
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Legal Text */}
        <div className="bg-[var(--surface-0)] rounded-xl p-4 text-sm text-[var(--text-secondary)] space-y-3">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-2">USPS Form 1583 Authorization</h4>
              <p>
                I hereby authorize <strong>Thinkspace</strong> (Commercial Mail Receiving Agent) 
                to receive, open, and handle my mail in accordance with USPS regulations.
              </p>
            </div>
          </div>
          <div className="pl-8 space-y-2">
            <p>
              I certify that:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The information provided is true and accurate</li>
              <li>I am the person identified in the submitted documents</li>
              <li>I understand that false statements may result in mail service suspension</li>
              <li>I consent to the verification of my identity by the CMRA</li>
            </ul>
          </div>
        </div>

        {/* Signature Pad */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Your Signature <span className="text-[var(--semantic-red)]">*</span>
            </label>
            <button
              onClick={clearSignature}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Clear
            </button>
          </div>

          <div className="relative border-2 border-[var(--border-subtle)] rounded-xl overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-48 cursor-crosshair touch-none"
              style={{ touchAction: "none" }}
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[var(--text-muted)] text-lg font-medium">
                  Sign here
                </span>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Use your mouse or finger to sign above. Your signature should match your government-issued ID.
          </p>
        </div>

        {/* Confirmation */}
        <div className="bg-[var(--semantic-green-soft)] border border-[var(--semantic-green)] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[var(--semantic-green)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[var(--text-primary)] mb-1">Ready to Submit</h4>
              <p className="text-sm text-[var(--text-secondary)]">
                After signing above, click "Submit Compliance" to send your Form 1583 for review. 
                You'll be notified once approved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
