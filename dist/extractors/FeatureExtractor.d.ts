import { ParsedResume, ExtractedFeatures } from '../types';
/**
 * FeatureExtractor - Analyzes parsed resume data and extracts relevant features
 * for job requirement evaluation
 */
export declare class FeatureExtractor {
    /**
     * Extract all relevant features from parsed resume data
     */
    extractFeatures(parsedResume: ParsedResume): ExtractedFeatures;
    /**
     * Check if candidate has required skills
     */
    private checkRequiredSkills;
    /**
     * Check if candidate has preferred skills
     */
    private checkPreferredSkills;
    /**
     * Check if candidate meets minimum experience requirement
     */
    private checkExperienceRequirement;
    /**
     * Check if candidate meets education requirement
     */
    private checkEducationRequirement;
    /**
     * Check if candidate has required certifications
     */
    private checkCertificationRequirement;
    /**
     * Calculate total years of experience
     */
    private calculateTotalExperience;
    /**
     * Calculate skill match percentage
     */
    private calculateSkillMatch;
    /**
     * Determine the highest education level achieved
     */
    private determineEducationLevel;
    /**
     * Extract specific features for detailed analysis
     */
    extractDetailedFeatures(parsedResume: ParsedResume): any;
    /**
     * Validate email format
     */
    private isValidEmail;
    /**
     * Validate phone format
     */
    private isValidPhone;
    /**
     * Analyze work experience patterns
     */
    private analyzeExperience;
    /**
     * Check if candidate has recent experience (within last 2 years)
     */
    private hasRecentExperience;
    /**
     * Analyze career progression
     */
    private analyzeCareerProgression;
    /**
     * Get technical skills
     */
    private getTechnicalSkills;
    /**
     * Get soft skills
     */
    private getSoftSkills;
    /**
     * Analyze education patterns
     */
    private analyzeEducation;
    /**
     * Check if candidate has relevant field of study
     */
    private hasRelevantField;
    /**
     * Calculate resume completeness score
     */
    private calculateCompleteness;
}
//# sourceMappingURL=FeatureExtractor.d.ts.map