/**
 * Core data structures for R1 Resume Screening Agent
 */
export interface RawResumeInput {
    type: 'raw';
    content: string;
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
export interface ParsedResume {
    fullName: string;
    email: string;
    phone: string;
    education: Education[];
    workExperience: WorkExperience[];
    skills: Skill[];
    certifications: Certification[];
    rawText?: string;
}
export interface Education {
    degree: string;
    institution: string;
    graduationYear?: number;
    field?: string;
    gpa?: number;
}
export interface WorkExperience {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    duration: number;
    description?: string;
    technologies?: string[];
}
export interface Skill {
    name: string;
    category: 'technical' | 'soft' | 'language' | 'tool';
    proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience?: number;
}
export interface Certification {
    name: string;
    issuingOrganization: string;
    issueDate?: string;
    expiryDate?: string;
    credentialId?: string;
}
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
export interface ScreeningResult {
    candidateProfile: ParsedResume;
    screeningResult: 'pass' | 'fail';
    matchReasons: string[];
    confidenceScore: number;
    missingRequirements?: string[];
    errorMessages?: string[];
}
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
export interface ProcessingError {
    type: 'parsing' | 'extraction' | 'evaluation';
    message: string;
    details?: any;
    timestamp: Date;
}
//# sourceMappingURL=index.d.ts.map