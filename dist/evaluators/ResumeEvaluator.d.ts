import { ParsedResume, JobRequirements, ScreeningResult } from '../types';
/**
 * ResumeEvaluator - Evaluates candidate profiles against job requirements
 * and generates screening results with pass/fail decisions
 */
export declare class ResumeEvaluator {
    /**
     * Evaluate candidate against job requirements
     */
    evaluateAgainstCriteria(candidateData: ParsedResume, jobRequirements: JobRequirements): ScreeningResult;
    /**
     * Extract features for evaluation
     */
    private extractEvaluationFeatures;
    /**
     * Perform the actual evaluation
     */
    private performEvaluation;
    /**
     * Evaluate experience requirements
     */
    private evaluateExperience;
    /**
     * Evaluate skills requirements
     */
    private evaluateSkills;
    /**
     * Evaluate education requirements
     */
    private evaluateEducation;
    /**
     * Evaluate certification requirements
     */
    private evaluateCertifications;
    /**
     * Helper methods for feature extraction
     */
    private hasValidContact;
    private calculateTotalExperience;
    private hasRelevantExperience;
    private analyzeSkillMatch;
    private hasRequiredSkills;
    private determineEducationLevel;
    private hasRelevantEducation;
    private calculateCompleteness;
    /**
     * Generate detailed evaluation report
     */
    generateDetailedReport(candidateData: ParsedResume, jobRequirements: JobRequirements): any;
}
//# sourceMappingURL=ResumeEvaluator.d.ts.map