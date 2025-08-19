import { ChatMessage, ChatSession, ChatbotResponse, LLMContext, LLMConfig, ParsedResume, ExcelJobDescription, ScreeningResult } from '../types';

/**
 * ChatbotService - LLM-powered chatbot for explaining screening decisions
 */
export class ChatbotService {
  private config: LLMConfig;
  private sessions: Map<string, ChatSession> = new Map();

  constructor(config: LLMConfig) {
    this.config = config;
  }

  /**
   * Create a new chat session for a candidate and job
   */
  public createSession(
    candidateProfile: ParsedResume,
    jobDescription: ExcelJobDescription,
    screeningResult: ScreeningResult
  ): string {
    const sessionId = this.generateSessionId(candidateProfile.fullName, jobDescription.id);
    
    const session: ChatSession = {
      id: sessionId,
      messages: [],
      candidateProfile,
      jobDescription,
      screeningResult,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  /**
   * Send a message to the chatbot and get a response
   */
  public async sendMessage(sessionId: string, userMessage: string): Promise<ChatbotResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Chat session not found');
    }

    // Add user message to session
    const userMsg: ChatMessage = {
      id: this.generateMessageId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      metadata: {
        candidateId: session.candidateProfile?.fullName,
        jobId: session.jobDescription?.id,
        screeningResult: session.screeningResult
      }
    };

    session.messages.push(userMsg);

    // Generate AI response
    const aiResponse = await this.generateResponse(session, userMessage);
    
    // Add AI response to session
    const aiMsg: ChatMessage = {
      id: this.generateMessageId(),
      role: 'assistant',
      content: aiResponse.message,
      timestamp: new Date(),
      metadata: {
        candidateId: session.candidateProfile?.fullName,
        jobId: session.jobDescription?.id,
        screeningResult: session.screeningResult
      }
    };

    session.messages.push(aiMsg);
    session.updatedAt = new Date();

    return aiResponse;
  }

  /**
   * Generate AI response using LLM
   */
  private async generateResponse(session: ChatSession, userMessage: string): Promise<ChatbotResponse> {
    const context = this.buildLLMContext(session);
    const prompt = this.buildPrompt(context, userMessage);

    try {
      // For now, we'll use a mock response since we don't have actual LLM integration
      // In a real implementation, you would call the LLM API here
      const response = await this.mockLLMResponse(prompt, context);
      return response;
    } catch (error) {
      console.error('LLM response generation failed:', error);
      return {
        message: "I apologize, but I'm having trouble processing your question right now. Please try again later.",
        confidence: 0.1,
        reasoning: "LLM service unavailable",
        suggestedQuestions: [
          "Why was this candidate screened as pass/fail?",
          "What skills does the candidate have?",
          "What are the missing requirements?"
        ]
      };
    }
  }

  /**
   * Build LLM context from session data
   */
  private buildLLMContext(session: ChatSession): LLMContext {
    return {
      candidateProfile: session.candidateProfile!,
      jobDescription: session.jobDescription!,
      screeningResult: session.screeningResult!,
      chatHistory: session.messages
    };
  }

  /**
   * Build prompt for LLM
   */
  private buildPrompt(context: LLMContext, userMessage: string): string {
    const candidate = context.candidateProfile;
    const job = context.jobDescription;
    const result = context.screeningResult;

    return `You are an AI assistant explaining resume screening decisions. 

CANDIDATE PROFILE:
Name: ${candidate.fullName}
Email: ${candidate.email}
Education: ${candidate.education.map(edu => `${edu.degree} from ${edu.institution}`).join(', ')}
Experience: ${candidate.workExperience.length} positions
Skills: ${candidate.skills.map(skill => skill.name).join(', ')}

JOB DESCRIPTION:
Title: ${job.title}
Company: ${job.company}
Department: ${job.department || 'N/A'}
Description: ${job.description}
Requirements: ${job.requirements}
Required Skills: ${job.requiredSkills?.join(', ') || 'N/A'}
Preferred Skills: ${job.preferredSkills?.join(', ') || 'N/A'}
Minimum Experience: ${job.minimumExperience || 'N/A'} years

SCREENING RESULT:
Decision: ${result.screeningResult.toUpperCase()}
Confidence: ${Math.round(result.confidenceScore * 100)}%
Match Reasons: ${result.matchReasons.join(', ')}
Missing Requirements: ${result.missingRequirements?.join(', ') || 'None'}

CHAT HISTORY:
${context.chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

USER QUESTION: ${userMessage}

Please provide a helpful, detailed response explaining the screening decision and answering the user's question. Be specific about why the candidate passed or failed, what skills they have, and what requirements they meet or don't meet.`;
  }

  /**
   * Mock LLM response for demonstration
   */
  private async mockLLMResponse(prompt: string, context: LLMContext): Promise<ChatbotResponse> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userMessage = context.chatHistory[context.chatHistory.length - 1]?.content.toLowerCase() || '';
    const result = context.screeningResult;
    const candidate = context.candidateProfile;
    const job = context.jobDescription;

    let response: ChatbotResponse;

    if (userMessage.includes('why') && userMessage.includes('pass')) {
      response = {
        message: `The candidate was screened as PASS because they meet the key requirements for the ${job.title} position. They have ${candidate.workExperience.length} years of relevant experience and possess the required skills: ${candidate.skills.slice(0, 3).map(s => s.name).join(', ')}. Their education background in ${candidate.education[0]?.field || 'Computer Science'} aligns well with the role requirements.`,
        confidence: 0.85,
        reasoning: "Candidate meets minimum requirements and has relevant skills",
        suggestedQuestions: [
          "What specific skills does the candidate have?",
          "How does their experience match the job requirements?",
          "What are their strongest qualifications?"
        ]
      };
    } else if (userMessage.includes('why') && userMessage.includes('fail')) {
      response = {
        message: `The candidate was screened as FAIL because they don't meet some critical requirements for the ${job.title} position. Specifically, they are missing ${result.missingRequirements?.length || 0} key requirements: ${result.missingRequirements?.join(', ')}. While they have good experience in ${candidate.skills.slice(0, 2).map(s => s.name).join(', ')}, the role requires additional qualifications that the candidate doesn't currently possess.`,
        confidence: 0.80,
        reasoning: "Candidate lacks required qualifications or experience",
        suggestedQuestions: [
          "What specific requirements are missing?",
          "What skills does the candidate have?",
          "Could this candidate be considered for a different role?"
        ]
      };
    } else if (userMessage.includes('skill')) {
      response = {
        message: `The candidate has the following skills: ${candidate.skills.map(skill => `${skill.name} (${skill.category})`).join(', ')}. They have ${candidate.workExperience.length} years of professional experience, with their most recent role as ${candidate.workExperience[0]?.title} at ${candidate.workExperience[0]?.company}.`,
        confidence: 0.90,
        reasoning: "Skills extracted from resume and work experience",
        suggestedQuestions: [
          "How do these skills match the job requirements?",
          "What is the candidate's experience level?",
          "What are their strongest technical skills?"
        ]
      };
    } else if (userMessage.includes('experience')) {
      response = {
        message: `The candidate has ${candidate.workExperience.length} positions in their work history. Their most recent experience is as ${candidate.workExperience[0]?.title} at ${candidate.workExperience[0]?.company} for ${candidate.workExperience[0]?.duration} months. They also worked as ${candidate.workExperience[1]?.title} at ${candidate.workExperience[1]?.company} for ${candidate.workExperience[1]?.duration} months.`,
        confidence: 0.88,
        reasoning: "Work experience extracted from resume",
        suggestedQuestions: [
          "How does this experience match the job requirements?",
          "What technologies did they use in these roles?",
          "What is their total years of experience?"
        ]
      };
    } else {
      response = {
        message: `I can help you understand the screening decision for ${candidate.fullName} for the ${job.title} position at ${job.company}. The candidate was screened as ${result.screeningResult.toUpperCase()} with ${Math.round(result.confidenceScore * 100)}% confidence. ${result.screeningResult === 'pass' ? 'They meet the key requirements for this role.' : 'They don\'t meet some critical requirements.'}`,
        confidence: 0.75,
        reasoning: "General screening decision explanation",
        suggestedQuestions: [
          "Why did the candidate pass/fail?",
          "What skills does the candidate have?",
          "What are the missing requirements?",
          "How does their experience match the job?"
        ]
      };
    }

    return response;
  }

  /**
   * Get chat session
   */
  public getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all sessions
   */
  public getAllSessions(): ChatSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Delete a chat session
   */
  public deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(candidateName: string, jobId: string): string {
    const timestamp = Date.now();
    const sanitizedName = candidateName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return `${sanitizedName}-${jobId}-${timestamp}`;
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get suggested questions based on context
   */
  public getSuggestedQuestions(sessionId: string): string[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    const result = session.screeningResult;
    const candidate = session.candidateProfile;
    const job = session.jobDescription;

    const baseQuestions = [
      "Why was this candidate screened as pass/fail?",
      "What skills does the candidate have?",
      "How does their experience match the job requirements?"
    ];

    if (result && result.screeningResult === 'fail' && result.missingRequirements?.length) {
      baseQuestions.push("What specific requirements are missing?");
      baseQuestions.push("Could this candidate be considered for a different role?");
    }

    if (candidate && candidate.skills.length > 0) {
      baseQuestions.push("What are the candidate's strongest technical skills?");
    }

    if (candidate && candidate.workExperience.length > 0) {
      baseQuestions.push("What technologies did they use in their previous roles?");
    }

    return baseQuestions;
  }
} 