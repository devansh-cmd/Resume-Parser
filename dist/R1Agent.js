"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.R1Agent = void 0;
exports.createR1Agent = createR1Agent;
exports.screenResume = screenResume;
const ResumeParser_1 = require("./parsers/ResumeParser");
const FeatureExtractor_1 = require("./extractors/FeatureExtractor");
const ResumeEvaluator_1 = require("./evaluators/ResumeEvaluator");
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
class R1Agent {
    constructor() {
        this.errors = [];
        this.parser = ResumeParser_1.parseResume;
        this.featureExtractor = new FeatureExtractor_1.FeatureExtractor();
        this.evaluator = new ResumeEvaluator_1.ResumeEvaluator();
    }
    /**
     * Main entry point for R1 agent
     * Orchestrates the entire resume screening process
     */
    async runR1(resumeInput, jobRequirements) {
        try {
            // Reset errors for new screening session
            this.errors = [];
            // Step 1: Parse resume data
            const parsedResume = await this.parseResume(resumeInput);
            // Step 2: Extract features
            const extractedFeatures = this.extractFeatures(parsedResume);
            // Step 3: Evaluate against criteria
            const screeningResult = this.evaluateAgainstCriteria(parsedResume, jobRequirements);
            // Step 4: Log successful screening
            this.logScreeningActivity(parsedResume, screeningResult);
            return screeningResult;
        }
        catch (error) {
            // Handle and log errors
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            this.logError('evaluation', `R1 screening failed: ${errorMessage}`);
            // Return error result
            return this.createErrorResult(errorMessage);
        }
    }
    /**
     * Parse resume data using the appropriate parser
     */
    async parseResume(resumeInput) {
        try {
            if (resumeInput.type === 'raw') {
                return this.parser(resumeInput.content);
            }
            else {
                return this.parser(resumeInput.content);
            }
        }
        catch (error) {
            const errorMessage = `Failed to parse resume: ${error instanceof Error ? error.message : 'Unknown parsing error'}`;
            this.logError('parsing', errorMessage);
            throw new Error(errorMessage);
        }
    }
    /**
     * Extract features from parsed resume data
     */
    extractFeatures(parsedResume) {
        try {
            return this.featureExtractor.extractFeatures(parsedResume);
        }
        catch (error) {
            const errorMessage = `Failed to extract features: ${error instanceof Error ? error.message : 'Unknown extraction error'}`;
            this.logError('extraction', errorMessage);
            throw new Error(errorMessage);
        }
    }
    /**
     * Evaluate candidate against job requirements
     */
    evaluateAgainstCriteria(parsedResume, jobRequirements) {
        try {
            return this.evaluator.evaluateAgainstCriteria(parsedResume, jobRequirements);
        }
        catch (error) {
            const errorMessage = `Failed to evaluate candidate: ${error instanceof Error ? error.message : 'Unknown evaluation error'}`;
            this.logError('evaluation', errorMessage);
            throw new Error(errorMessage);
        }
    }
    /**
     * Log screening activity for monitoring and debugging
     */
    logScreeningActivity(parsedResume, result) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            candidate: parsedResume.fullName,
            email: parsedResume.email,
            result: result.screeningResult,
            confidence: result.confidenceScore,
            reasons: result.matchReasons,
            missing: result.missingRequirements,
            errors: result.errorMessages
        };
        console.log('R1 Screening Activity:', JSON.stringify(logEntry, null, 2));
    }
    /**
     * Log errors for debugging and monitoring
     */
    logError(type, message) {
        const error = {
            type,
            message,
            timestamp: new Date()
        };
        this.errors.push(error);
        console.error(`R1 Agent Error [${type}]:`, message);
    }
    /**
     * Create error result when processing fails
     */
    createErrorResult(errorMessage) {
        return {
            candidateProfile: {
                fullName: 'Unknown',
                email: '',
                phone: '',
                education: [],
                workExperience: [],
                skills: [],
                certifications: []
            },
            screeningResult: 'fail',
            matchReasons: ['Processing error occurred'],
            confidenceScore: 0,
            missingRequirements: [],
            errorMessages: [errorMessage]
        };
    }
    /**
     * Get processing errors for debugging
     */
    getErrors() {
        return this.errors;
    }
    /**
     * Clear error log
     */
    clearErrors() {
        this.errors = [];
    }
    /**
     * Generate detailed screening report
     */
    async generateDetailedReport(resumeInput, jobRequirements) {
        try {
            const parsedResume = await this.parseResume(resumeInput);
            const extractedFeatures = this.extractFeatures(parsedResume);
            const screeningResult = this.evaluateAgainstCriteria(parsedResume, jobRequirements);
            return {
                screeningResult,
                detailedReport: this.evaluator.generateDetailedReport(parsedResume, jobRequirements),
                extractedFeatures: this.featureExtractor.extractDetailedFeatures(parsedResume),
                processingErrors: this.errors
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logError('evaluation', `Detailed report generation failed: ${errorMessage}`);
            throw error;
        }
    }
    /**
     * Validate job requirements before processing
     */
    validateJobRequirements(requirements) {
        const errors = [];
        if (!requirements.minimumYearsOfExperience || requirements.minimumYearsOfExperience < 0) {
            errors.push('Invalid minimum years of experience');
        }
        if (!requirements.requiredSkills || requirements.requiredSkills.length === 0) {
            errors.push('No required skills specified');
        }
        if (!requirements.requiredEducation || !requirements.requiredEducation.minimumDegree) {
            errors.push('No education requirements specified');
        }
        if (errors.length > 0) {
            console.error('Job Requirements Validation Errors:', errors);
            return false;
        }
        return true;
    }
    /**
     * Get agent status and health information
     */
    getAgentStatus() {
        return {
            agent: 'R1 - Resume Screening Agent',
            version: '1.0.0',
            status: 'active',
            errorCount: this.errors.length,
            lastError: this.errors.length > 0 ? this.errors[this.errors.length - 1] : null,
            timestamp: new Date().toISOString()
        };
    }
}
exports.R1Agent = R1Agent;
/**
 * Factory function to create R1 agent instance
 */
function createR1Agent() {
    return new R1Agent();
}
/**
 * Convenience function for quick resume screening
 */
async function screenResume(resumeInput, jobRequirements) {
    const agent = createR1Agent();
    return await agent.runR1(resumeInput, jobRequirements);
}
//# sourceMappingURL=R1Agent.js.map