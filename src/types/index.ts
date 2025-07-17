/**
 * Core data structures for R1 Resume Screening Agent
 */

// Input types for resume data
export interface RawResumeInput {
  type: 'raw';
  content: string; // Raw text from OCR or PDF extraction
}

export interface StructuredResumeInput {
  type: 'structured';
  content: {
    name?: string;
    email?: string;
    phone?: string;
    education?: Education[];
    experience?: WorkExperience[];
    skills?: string[];
    certifications?: Certification[];
  };
}

export type ResumeInput = RawResumeInput | StructuredResumeInput;

// Parsed resume data structure
export interface ParsedResume {
  fullName: string;
  email: string;
  phone: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  certifications: Certification[];
  rawText?: string; // Original raw text if available
}

// Education data structure
export interface Education {
  degree: string;
  institution: string;
  graduationYear?: number;
  field?: string;
  gpa?: number;
}

// Work experience data structure
export interface WorkExperience {
  title: string;
  company: string;
  startDate: string;
  endDate?: string; // null/undefined for current position
  duration: number; // in months
  description?: string;
  technologies?: string[];
}

// Skills with categorization
export interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool';
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

// Certification data structure
export interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
}

// Job requirements for evaluation
export interface JobRequirements {
  minimumYearsOfExperience: number;
  requiredSkills: string[];
  preferredSkills: string[];
  requiredEducation: {
    minimumDegree: 'high_school' | 'associate' | 'bachelor' | 'master' | 'phd';
    preferredFields?: string[];
  };
  requiredCertifications?: string[];
  softSkills?: string[];
}

// Screening result structure
export interface ScreeningResult {
  candidateProfile: ParsedResume;
  screeningResult: 'pass' | 'fail';
  matchReasons: string[];
  confidenceScore: number; // 0-1 scale
  missingRequirements?: string[];
  errorMessages?: string[];
}

// Feature extraction result
export interface ExtractedFeatures {
  hasRequiredSkills: boolean;
  hasPreferredSkills: boolean;
  meetsExperienceRequirement: boolean;
  meetsEducationRequirement: boolean;
  hasRequiredCertifications: boolean;
  totalYearsExperience: number;
  skillMatchPercentage: number;
  educationLevel: string;
}

// Error types for logging
export interface ProcessingError {
  type: 'parsing' | 'extraction' | 'evaluation';
  message: string;
  details?: any;
  timestamp: Date;
} 