
export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  type: 'pdf' | 'job_match';
  summary: string; // Match summary
  candidateProfile?: string; // Summary of the candidate's resume/background
  score?: number;
  stats?: {
    label: string;
    value: number | string;
  }[];
  trends?: {
    name: string;
    value: number;
  }[];
  suggestions: string[];
  rawInput: string;
}

export interface AnalysisPayload {
  resumeBase64?: string;
  resumeMimeType?: string;
  jobDescription?: string;
  type: 'pdf' | 'job_match';
}
