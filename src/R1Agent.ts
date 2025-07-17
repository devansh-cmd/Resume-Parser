import { parseResume } from './parsers/ResumeParser';
import { FeatureExtractor } from './extractors/FeatureExtractor';
import { ResumeEvaluator } from './evaluators/ResumeEvaluator';
import { 
  ResumeInput, 
  ParsedResume, 
  JobRequirements, 
  ScreeningResult, 
  ProcessingError 
} from './types';

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
export class R1Agent {
  private parser: typeof parseResume;
  private featureExtractor: FeatureExtractor;
  private evaluator: ResumeEvaluator;
  private errors: ProcessingError[] = [];

  constructor() {
    this.parser = parseResume;
    this.featureExtractor = new FeatureExtractor();
    this.evaluator = new ResumeEvaluator();
  }

  /**
   * Main entry point for R1 agent
   * Orchestrates the entire resume screening process
   */
  public async runR1(
    resumeInput: ResumeInput, 
    jobRequirements: JobRequirements
  ): Promise<ScreeningResult> {
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

    } catch (error) {
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
  private async parseResume(resumeInput: ResumeInput): Promise<ParsedResume> {
    try {
      if (resumeInput.type === 'raw') {
        return this.parser(resumeInput.content);
      } else {
        return this.parser(resumeInput.content);
      }
    } catch (error) {
      const errorMessage = `Failed to parse resume: ${error instanceof Error ? error.message : 'Unknown parsing error'}`;
      this.logError('parsing', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Extract features from parsed resume data
   */
  private extractFeatures(parsedResume: ParsedResume): any {
    try {
      return this.featureExtractor.extractFeatures(parsedResume);
    } catch (error) {
      const errorMessage = `Failed to extract features: ${error instanceof Error ? error.message : 'Unknown extraction error'}`;
      this.logError('extraction', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Evaluate candidate against job requirements
   */
  private evaluateAgainstCriteria(
    parsedResume: ParsedResume, 
    jobRequirements: JobRequirements
  ): ScreeningResult {
    try {
      return this.evaluator.evaluateAgainstCriteria(parsedResume, jobRequirements);
    } catch (error) {
      const errorMessage = `Failed to evaluate candidate: ${error instanceof Error ? error.message : 'Unknown evaluation error'}`;
      this.logError('evaluation', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Log screening activity for monitoring and debugging
   */
  private logScreeningActivity(parsedResume: ParsedResume, result: ScreeningResult): void {
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
  private logError(type: 'parsing' | 'extraction' | 'evaluation', message: string): void {
    const error: ProcessingError = {
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
  private createErrorResult(errorMessage: string): ScreeningResult {
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
  public getErrors(): ProcessingError[] {
    return this.errors;
  }

  /**
   * Clear error log
   */
  public clearErrors(): void {
    this.errors = [];
  }

  /**
   * Generate detailed screening report
   */
  public async generateDetailedReport(
    resumeInput: ResumeInput, 
    jobRequirements: JobRequirements
  ): Promise<any> {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logError('evaluation', `Detailed report generation failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Validate job requirements before processing
   */
  public validateJobRequirements(requirements: JobRequirements): boolean {
    const errors: string[] = [];

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
  public getAgentStatus(): any {
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

/**
 * Factory function to create R1 agent instance
 */
export function createR1Agent(): R1Agent {
  return new R1Agent();
}

/**
 * Convenience function for quick resume screening
 */
export async function screenResume(
  resumeInput: ResumeInput, 
  jobRequirements: JobRequirements
): Promise<ScreeningResult> {
  const agent = createR1Agent();
  return await agent.runR1(resumeInput, jobRequirements);
} 