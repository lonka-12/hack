export interface ChatMessage {
  type: "user" | "ai";
  content: string;
}

export interface TreatmentCosts {
  [cancerType: string]: {
    [stage: string]: {
      [treatment: string]: string;
    };
  };
}

export interface FinancialResource {
  name: string;
  phone: string;
  website?: string;
}

export interface FinancialResources {
  federal: FinancialResource[];
  state: FinancialResource[];
}

export interface CounselingResource {
  name: string;
  phone: string;
  website?: string;
  type: string; // e.g., "Financial Counseling", "Emotional Support", "Group Therapy"
}

export interface CounselingServices {
  federal: CounselingResource[];
  state: CounselingResource[];
}

export interface FormData {
  selectedState: string;
  cancerType: string;
  stage: string;
  insuranceType: string;
} 