export type WizardStep = 
  | "welcome" 
  | "identity" 
  | "address" 
  | "business" 
  | "review" 
  | "sign" 
  | "success";

export interface ComplianceFormData {
  // Identity
  idType?: "drivers_license" | "passport" | "state_id" | "military_id";
  idFrontFile?: File;
  idBackFile?: File;
  idNumber?: string;
  
  // Address
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  proofOfAddressFile?: File;
  
  // Business
  businessUse?: boolean;
  businessName?: string;
  placeOfRegistration?: string;
  
  // Renters
  additionalRenters?: Array<{
    fullName: string;
    email?: string;
  }>;
  
  // Signature
  signatureDataUrl?: string;
  signedAt?: string;
  
  // Metadata
  completedSteps?: WizardStep[];
}
