import { 
  ResumeInput, 
  ParsedResume, 
  JobRequirements, 
  ScreeningResult, 
  ExcelJobDescription, 
  ExcelProcessingResult,
  ChatSession,
  ChatbotResponse,
  LLMConfig
} from './types';
import { parseResume } from './parsers/ResumeParser';
import { FeatureExtractor } from './extractors/FeatureExtractor';
import { ResumeEvaluator } from './evaluators/ResumeEvaluator';
import { ExcelProcessor } from './processors/ExcelProcessor';
import { ChatbotService } from './chatbot/ChatbotService';

/**
 * R1AgentEnhanced - Enhanced R1 agent with Excel processing and chatbot capabilities
 */
export class R1AgentEnhanced {
  private extractor: FeatureExtractor;
  private evaluator: ResumeEvaluator;
  private excelProcessor: ExcelProcessor;
  private chatbotService: ChatbotService;
  private screeningHistory: Map<string, ScreeningResult> = new Map();

  constructor(llmConfig?: LLMConfig) {
    this.extractor = new FeatureExtractor();
    this.evaluator = new ResumeEvaluator();
    this.excelProcessor = new ExcelProcessor();
    
    // Initialize chatbot with default config if none provided
    const defaultConfig: LLMConfig = {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000
    };
    
    this.chatbotService = new ChatbotService(llmConfig || defaultConfig);
  }

  /**
   * Process Excel file with multiple job descriptions
   */
  public processExcelFile(fileBuffer: Buffer): ExcelProcessingResult {
    console.log('Processing Excel file with job descriptions...');
    
    // Validate Excel structure first
    const validation = this.excelProcessor.validateExcelStructure(fileBuffer);
    if (!validation.isValid) {
      console.error('Excel file validation failed:', validation.errors);
      return {
        jobDescriptions: [],
        errors: validation.errors,
        totalRows: 0,
        processedRows: 0
      };
    }

    // Process the Excel file
    const result = this.excelProcessor.processExcelFile(fileBuffer);
    
    console.log(`Processed ${result.processedRows} job descriptions from ${result.totalRows} rows`);
    if (result.errors.length > 0) {
      console.warn('Processing errors:', result.errors);
    }

    return result;
  }

  /**
   * Screen a resume against multiple job descriptions
   */
  public async screenResumeAgainstMultipleJobs(
    resumeInput: ResumeInput,
    jobDescriptions: ExcelJobDescription[]
  ): Promise<{
    candidateProfile: ParsedResume;
    screeningResults: Array<{
      jobDescription: ExcelJobDescription;
      result: ScreeningResult;
    }>;
    summary: {
      totalJobs: number;
      passedJobs: number;
      failedJobs: number;
      bestMatches: Array<{
        job: ExcelJobDescription;
        score: number;
        reasons: string[];
      }>;
    };
  }> {
    console.log(`Screening resume against ${jobDescriptions.length} job descriptions...`);

    // Parse the resume once
    const candidateProfile = parseResume(resumeInput);
    
    // Screen against each job description
    const screeningResults: Array<{
      jobDescription: ExcelJobDescription;
      result: ScreeningResult;
    }> = [];

    for (const jobDescription of jobDescriptions) {
      try {
        // Convert Excel job description to JobRequirements format
        const jobRequirements = this.convertExcelJobToRequirements(jobDescription);
        
        // Extract features
        const features = this.extractor.extractFeatures(candidateProfile);
        
        // Evaluate against job requirements
        const result = this.evaluator.evaluateAgainstCriteria(candidateProfile, jobRequirements);
        
        // Store result
        const resultId = this.generateResultId(candidateProfile.fullName, jobDescription.id);
        this.screeningHistory.set(resultId, result);
        
        screeningResults.push({
          jobDescription,
          result
        });

        console.log(`Screened against ${jobDescription.title} at ${jobDescription.company}: ${result.screeningResult}`);
      } catch (error) {
        console.error(`Error screening against ${jobDescription.title}:`, error);
      }
    }

    // Generate summary
    const passedJobs = screeningResults.filter(r => r.result.screeningResult === 'pass');
    const failedJobs = screeningResults.filter(r => r.result.screeningResult === 'fail');
    
    const bestMatches = screeningResults
      .filter(r => r.result.screeningResult === 'pass')
      .sort((a, b) => b.result.confidenceScore - a.result.confidenceScore)
      .slice(0, 3)
      .map(r => ({
        job: r.jobDescription,
        score: r.result.confidenceScore,
        reasons: r.result.matchReasons
      }));

    return {
      candidateProfile,
      screeningResults,
      summary: {
        totalJobs: jobDescriptions.length,
        passedJobs: passedJobs.length,
        failedJobs: failedJobs.length,
        bestMatches
      }
    };
  }

  /**
   * Create a chat session for a specific screening result
   */
  public createChatSession(
    candidateProfile: ParsedResume,
    jobDescription: ExcelJobDescription,
    screeningResult: ScreeningResult
  ): string {
    console.log(`Creating chat session for ${candidateProfile.fullName} and ${jobDescription.title}`);
    return this.chatbotService.createSession(candidateProfile, jobDescription, screeningResult);
  }

  /**
   * Send a message to the chatbot
   */
  public async sendChatMessage(sessionId: string, message: string): Promise<ChatbotResponse> {
    console.log(`Sending chat message to session ${sessionId}: ${message}`);
    return await this.chatbotService.sendMessage(sessionId, message);
  }

  /**
   * Get suggested questions for a chat session
   */
  public getSuggestedQuestions(sessionId: string): string[] {
    return this.chatbotService.getSuggestedQuestions(sessionId);
  }

  /**
   * Get chat session details
   */
  public getChatSession(sessionId: string): ChatSession | undefined {
    return this.chatbotService.getSession(sessionId);
  }

  /**
   * Get all chat sessions
   */
  public getAllChatSessions(): ChatSession[] {
    return this.chatbotService.getAllSessions();
  }

  /**
   * Get screening history
   */
  public getScreeningHistory(): Map<string, ScreeningResult> {
    return this.screeningHistory;
  }

  /**
   * Get specific screening result
   */
  public getScreeningResult(candidateName: string, jobId: string): ScreeningResult | undefined {
    const resultId = this.generateResultId(candidateName, jobId);
    return this.screeningHistory.get(resultId);
  }

  /**
   * Convert Excel job description to JobRequirements format
   */
  private convertExcelJobToRequirements(jobDescription: ExcelJobDescription): JobRequirements {
    return {
      minimumYearsOfExperience: jobDescription.minimumExperience || 0,
      requiredSkills: jobDescription.requiredSkills || [],
      preferredSkills: jobDescription.preferredSkills || [],
      requiredEducation: {
        minimumDegree: this.parseEducationLevel(jobDescription.education || ''),
        preferredFields: []
      },
      requiredCertifications: [],
      softSkills: []
    };
  }

  /**
   * Parse education level from string
   */
  private parseEducationLevel(education: string): 'high_school' | 'associate' | 'bachelor' | 'master' | 'phd' {
    const lowerEducation = education.toLowerCase();
    
    if (lowerEducation.includes('phd') || lowerEducation.includes('doctorate')) {
      return 'phd';
    } else if (lowerEducation.includes('master')) {
      return 'master';
    } else if (lowerEducation.includes('bachelor') || lowerEducation.includes('bs') || lowerEducation.includes('ba')) {
      return 'bachelor';
    } else if (lowerEducation.includes('associate') || lowerEducation.includes('aa')) {
      return 'associate';
    } else {
      return 'high_school';
    }
  }

  /**
   * Generate unique result ID
   */
  private generateResultId(candidateName: string, jobId: string): string {
    const sanitizedName = candidateName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return `${sanitizedName}-${jobId}`;
  }

  /**
   * Get comprehensive screening report
   */
  public generateScreeningReport(
    candidateProfile: ParsedResume,
    screeningResults: Array<{
      jobDescription: ExcelJobDescription;
      result: ScreeningResult;
    }>
  ): string {
    const report = [
      `SCREENING REPORT FOR ${candidateProfile.fullName.toUpperCase()}`,
      `Generated on: ${new Date().toLocaleString()}`,
      '',
      `CANDIDATE PROFILE:`,
      `- Name: ${candidateProfile.fullName}`,
      `- Email: ${candidateProfile.email}`,
      `- Phone: ${candidateProfile.phone}`,
      `- Education: ${candidateProfile.education.length} degree(s)`,
      `- Experience: ${candidateProfile.workExperience.length} position(s)`,
      `- Skills: ${candidateProfile.skills.length} skill(s)`,
      '',
      `SCREENING SUMMARY:`,
      `- Total Jobs Screened: ${screeningResults.length}`,
      `- Passed: ${screeningResults.filter(r => r.result.screeningResult === 'pass').length}`,
      `- Failed: ${screeningResults.filter(r => r.result.screeningResult === 'fail').length}`,
      '',
      `DETAILED RESULTS:`
    ];

    screeningResults.forEach((screening, index) => {
      const { jobDescription, result } = screening;
      report.push(
        `${index + 1}. ${jobDescription.title} at ${jobDescription.company}`,
        `   Result: ${result.screeningResult.toUpperCase()} (${Math.round(result.confidenceScore * 100)}% confidence)`,
        `   Match Reasons: ${result.matchReasons.join(', ')}`,
        result.missingRequirements?.length ? `   Missing: ${result.missingRequirements.join(', ')}` : '',
        ''
      );
    });

    return report.join('\n');
  }
} 