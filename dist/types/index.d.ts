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
export interface ExcelJobDescription {
    id: string;
    title: string;
    company: string;
    department?: string;
    location?: string;
    description: string;
    requirements: string;
    minimumExperience?: number;
    requiredSkills?: string[];
    preferredSkills?: string[];
    education?: string;
    salary?: string;
    employmentType?: string;
}
export interface ExcelProcessingResult {
    jobDescriptions: ExcelJobDescription[];
    errors: string[];
    totalRows: number;
    processedRows: number;
}
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    metadata?: {
        candidateId?: string;
        jobId?: string;
        screeningResult?: ScreeningResult;
    };
}
export interface ChatSession {
    id: string;
    messages: ChatMessage[];
    candidateProfile?: ParsedResume;
    jobDescription?: ExcelJobDescription;
    screeningResult?: ScreeningResult;
    createdAt: Date;
    updatedAt: Date;
}
export interface ChatbotResponse {
    message: string;
    confidence: number;
    reasoning?: string;
    suggestedQuestions?: string[];
}
export interface LLMConfig {
    provider: 'openai' | 'anthropic' | 'local';
    model: string;
    apiKey?: string;
    temperature?: number;
    maxTokens?: number;
}
export interface LLMContext {
    candidateProfile: ParsedResume;
    jobDescription: ExcelJobDescription;
    screeningResult: ScreeningResult;
    chatHistory: ChatMessage[];
}
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
    type: 'parsing' | 'extraction' | 'evaluation' | 'excel' | 'llm';
    message: string;
    details?: any;
    timestamp: Date;
}
//# sourceMappingURL=index.d.ts.map