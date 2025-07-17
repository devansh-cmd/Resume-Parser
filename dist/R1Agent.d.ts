import { ResumeInput, JobRequirements, ScreeningResult, ProcessingError } from './types';
/**
 * R1 Agent - Resume Screening Agent
 *
 * Core responsibilities:
 * 1. Parse resume data (raw text or structured JSON)
 * 2. Extract relevant features for evaluation
 * 3. Evaluate against job requirements
 * 4. Generate screening results with pass/fail decisions
 * 5. Log activity and handle errors
 */
export declare class R1Agent {
    private parser;
    private featureExtractor;
    private evaluator;
    private errors;
    constructor();
    /**
     * Main entry point for R1 agent
     * Orchestrates the entire resume screening process
     */
    runR1(resumeInput: ResumeInput, jobRequirements: JobRequirements): Promise<ScreeningResult>;
    /**
     * Parse resume data using the appropriate parser
     */
    private parseResume;
    /**
     * Extract features from parsed resume data
     */
    private extractFeatures;
    /**
     * Evaluate candidate against job requirements
     */
    private evaluateAgainstCriteria;
    /**
     * Log screening activity for monitoring and debugging
     */
    private logScreeningActivity;
    /**
     * Log errors for debugging and monitoring
     */
    private logError;
    /**
     * Create error result when processing fails
     */
    private createErrorResult;
    /**
     * Get processing errors for debugging
     */
    getErrors(): ProcessingError[];
    /**
     * Clear error log
     */
    clearErrors(): void;
    /**
     * Generate detailed screening report
     */
    generateDetailedReport(resumeInput: ResumeInput, jobRequirements: JobRequirements): Promise<any>;
    /**
     * Validate job requirements before processing
     */
    validateJobRequirements(requirements: JobRequirements): boolean;
    /**
     * Get agent status and health information
     */
    getAgentStatus(): any;
}
/**
 * Factory function to create R1 agent instance
 */
export declare function createR1Agent(): R1Agent;
/**
 * Convenience function for quick resume screening
 */
export declare function screenResume(resumeInput: ResumeInput, jobRequirements: JobRequirements): Promise<ScreeningResult>;
//# sourceMappingURL=R1Agent.d.ts.map