import React, { useState, useRef } from 'react';

interface ExcelJobDescription {
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

interface ScreeningResult {
  screeningResult: 'pass' | 'fail';
  confidenceScore: number;
  matchReasons: string[];
  missingRequirements?: string[];
  candidateProfile: {
    fullName: string;
    email: string;
    phone: string;
    education: any[];
    workExperience: any[];
    skills: any[];
    certifications: any[];
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  candidateProfile?: any;
  jobDescription?: ExcelJobDescription;
  screeningResult?: ScreeningResult;
}

const EnhancedResumeScreener: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resume' | 'excel' | 'chat'>('resume');
  const [rawResume, setRawResume] = useState('');
  const [structuredResume, setStructuredResume] = useState('');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [jobDescriptions, setJobDescriptions] = useState<ExcelJobDescription[]>([]);
  const [screeningResults, setScreeningResults] = useState<Array<{
    jobDescription: ExcelJobDescription;
    result: ScreeningResult;
  }>>([]);
  const [selectedResult, setSelectedResult] = useState<{
    jobDescription: ExcelJobDescription;
    result: ScreeningResult;
  } | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setExcelFile(file);
      // Mock processing - in real app, this would call the backend
      const mockJobDescriptions: ExcelJobDescription[] = [
        {
          id: 'job-1',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          department: 'Engineering',
          location: 'San Francisco, CA',
          description: 'We are looking for a senior software engineer to join our team.',
          requirements: '5+ years of experience in software development',
          minimumExperience: 5,
          requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
          preferredSkills: ['TypeScript', 'AWS', 'Docker'],
          education: 'Bachelor\'s degree in Computer Science',
          salary: '$120,000 - $150,000',
          employmentType: 'Full-time'
        },
        {
          id: 'job-2',
          title: 'Frontend Developer',
          company: 'StartupXYZ',
          department: 'Product',
          location: 'Remote',
          description: 'Join our fast-growing startup as a frontend developer.',
          requirements: '3+ years of frontend development experience',
          minimumExperience: 3,
          requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS'],
          preferredSkills: ['TypeScript', 'Vue.js', 'SASS'],
          education: 'Bachelor\'s degree or equivalent experience',
          salary: '$80,000 - $100,000',
          employmentType: 'Full-time'
        }
      ];
      setJobDescriptions(mockJobDescriptions);
    }
  };

  const handleScreenResume = async () => {
    if (!jobDescriptions.length) {
      alert('Please upload an Excel file with job descriptions first.');
      return;
    }

    setLoading(true);
    setScreeningResults([]);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock results
      const mockResults = jobDescriptions.map(job => ({
        jobDescription: job,
        result: {
          screeningResult: Math.random() > 0.5 ? 'pass' as const : 'fail' as const,
          confidenceScore: Math.random() * 0.4 + 0.6,
          matchReasons: [
            '✓ Has required technical skills',
            '✓ Meets education requirements',
            '✓ Has relevant experience'
          ],
          missingRequirements: Math.random() > 0.7 ? [
            'Requires 3+ years experience',
            'Missing preferred skills: TypeScript, AWS'
          ] : [],
          candidateProfile: {
            fullName: 'John Doe',
            email: 'john.doe@email.com',
            phone: '(555) 123-4567',
            education: [
              {
                degree: 'Bachelor of Science in Computer Science',
                institution: 'University of Technology',
                graduationYear: 2020
              }
            ],
            workExperience: [
              {
                title: 'Senior Software Engineer',
                company: 'Tech Corp Inc',
                startDate: '2021',
                endDate: '2023',
                duration: 24
              }
            ],
            skills: [
              { name: 'JavaScript', category: 'technical' },
              { name: 'React', category: 'technical' },
              { name: 'Node.js', category: 'technical' }
            ],
            certifications: []
          }
        }
      }));

      setScreeningResults(mockResults);
    } catch (error) {
      console.error('Screening failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const createChatSession = (result: { jobDescription: ExcelJobDescription; result: ScreeningResult }) => {
    const sessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: sessionId,
      messages: [],
      candidateProfile: result.result.candidateProfile,
      jobDescription: result.jobDescription,
      screeningResult: result.result
    };

    setChatSessions(prev => [...prev, newSession]);
    setCurrentSession(newSession);
    setActiveTab('chat');
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || !currentSession) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: chatMessage,
      timestamp: new Date()
    };

    // Add user message
    setCurrentSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage]
    } : null);

    setChatMessage('');
    setLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: `I can help you understand the screening decision for ${currentSession.candidateProfile?.fullName} for the ${currentSession.jobDescription?.title} position. The candidate was screened as ${currentSession.screeningResult?.screeningResult.toUpperCase()} with ${Math.round((currentSession.screeningResult?.confidenceScore || 0) * 100)}% confidence.`,
        timestamp: new Date()
      };

      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, aiMessage]
      } : null);
    } catch (error) {
      console.error('Chat failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedQuestions = () => [
    "Why was this candidate screened as pass/fail?",
    "What skills does the candidate have?",
    "What are the missing requirements?",
    "How does their experience match the job?"
  ];

  return (
    <div className="enhanced-screener">
      {/* Navigation Tabs */}
      <div className="tabs-container">
        <button
          className={`tab ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          Resume Input
        </button>
        <button
          className={`tab ${activeTab === 'excel' ? 'active' : ''}`}
          onClick={() => setActiveTab('excel')}
        >
          Excel Upload
        </button>
        <button
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chatbot
        </button>
      </div>

      {/* Resume Input Tab */}
      {activeTab === 'resume' && (
        <div className="tab-content active">
          <div className="card">
            <h2>Resume Input</h2>
            
            <div className="input-tabs">
              <button
                className={`input-tab ${rawResume ? 'active' : ''}`}
                onClick={() => setRawResume(rawResume)}
              >
                Raw Text
              </button>
              <button
                className={`input-tab ${structuredResume ? 'active' : ''}`}
                onClick={() => setStructuredResume(structuredResume)}
              >
                Structured JSON
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="rawResume">Paste Resume Text</label>
              <textarea
                id="rawResume"
                className="form-control"
                value={rawResume}
                onChange={(e) => setRawResume(e.target.value)}
                placeholder="Paste the raw resume text here..."
                rows={10}
              />
            </div>

            <div className="form-group">
              <label htmlFor="structuredResume">Structured Resume JSON</label>
              <textarea
                id="structuredResume"
                className="form-control json-input"
                value={structuredResume}
                onChange={(e) => setStructuredResume(e.target.value)}
                placeholder='{"name": "John Doe", "email": "john@email.com", ...}'
                rows={10}
              />
            </div>

            <button
              className="btn"
              onClick={handleScreenResume}
              disabled={!jobDescriptions.length || loading}
            >
              {loading ? 'Screening...' : 'Screen Resume'}
            </button>
          </div>
        </div>
      )}

      {/* Excel Upload Tab */}
      {activeTab === 'excel' && (
        <div className="tab-content active">
          <div className="card">
            <h2>Upload Job Descriptions (Excel)</h2>
            
            <div className="upload-section">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                style={{ display: 'none' }}
              />
              
              <button
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Excel File
              </button>
              
              {excelFile && (
                <div className="file-info">
                  <span>✓ {excelFile.name}</span>
                  <span>{jobDescriptions.length} job descriptions loaded</span>
                </div>
              )}
            </div>

            {jobDescriptions.length > 0 && (
              <div className="job-list">
                <h3>Loaded Job Descriptions</h3>
                {jobDescriptions.map((job, index) => (
                  <div key={job.id} className="job-item">
                    <h4>{job.title}</h4>
                    <p><strong>Company:</strong> {job.company}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Experience:</strong> {job.minimumExperience}+ years</p>
                    <p><strong>Required Skills:</strong> {job.requiredSkills?.join(', ')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chatbot Tab */}
      {activeTab === 'chat' && (
        <div className="tab-content active">
          <div className="chat-container">
            {/* Chat Sessions List */}
            <div className="chat-sessions">
              <h3>Chat Sessions</h3>
              {chatSessions.length === 0 ? (
                <p>No chat sessions yet. Screen a resume first to start chatting.</p>
              ) : (
                chatSessions.map(session => (
                  <div
                    key={session.id}
                    className={`chat-session ${currentSession?.id === session.id ? 'active' : ''}`}
                    onClick={() => setCurrentSession(session)}
                  >
                    <h4>{session.candidateProfile?.fullName}</h4>
                    <p>{session.jobDescription?.title} at {session.jobDescription?.company}</p>
                    <span className={`status ${session.screeningResult?.screeningResult}`}>
                      {session.screeningResult?.screeningResult.toUpperCase()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Chat Interface */}
            {currentSession ? (
              <div className="chat-interface">
                <div className="chat-header">
                  <h3>Chat with {currentSession.candidateProfile?.fullName}</h3>
                  <p>{currentSession.jobDescription?.title} at {currentSession.jobDescription?.company}</p>
                </div>

                <div className="chat-messages">
                  {currentSession.messages.length === 0 ? (
                    <div className="welcome-message">
                      <p>Ask me anything about the screening decision!</p>
                      <div className="suggested-questions">
                        {getSuggestedQuestions().map((question, index) => (
                          <button
                            key={index}
                            className="suggestion-btn"
                            onClick={() => setChatMessage(question)}
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    currentSession.messages.map(message => (
                      <div key={message.id} className={`message ${message.role}`}>
                        <div className="message-content">{message.content}</div>
                        <div className="message-time">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {loading && (
                    <div className="message assistant">
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="chat-input">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Ask a question about the screening decision..."
                    disabled={loading}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatMessage.trim() || loading}
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-session">
                <p>Select a chat session to start asking questions.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Screening Results */}
      {screeningResults.length > 0 && (
        <div className="results-section">
          <h2>Screening Results</h2>
          
          <div className="results-summary">
            <div className="summary-card">
              <h3>Total Jobs</h3>
              <span>{screeningResults.length}</span>
            </div>
            <div className="summary-card">
              <h3>Passed</h3>
              <span className="pass">{screeningResults.filter(r => r.result.screeningResult === 'pass').length}</span>
            </div>
            <div className="summary-card">
              <h3>Failed</h3>
              <span className="fail">{screeningResults.filter(r => r.result.screeningResult === 'fail').length}</span>
            </div>
          </div>

          <div className="results-list">
            {screeningResults.map((result, index) => (
              <div key={index} className="result-card">
                <div className="result-header">
                  <h3>{result.jobDescription.title} at {result.jobDescription.company}</h3>
                  <span className={`result-status ${result.result.screeningResult}`}>
                    {result.result.screeningResult.toUpperCase()}
                  </span>
                  <span className="confidence-score">
                    {Math.round(result.result.confidenceScore * 100)}% Confidence
                  </span>
                </div>

                <div className="result-details">
                  <div className="match-reasons">
                    <h4>Match Reasons</h4>
                    <ul>
                      {result.result.matchReasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>

                  {result.result.missingRequirements && result.result.missingRequirements.length > 0 && (
                    <div className="missing-requirements">
                      <h4>Missing Requirements</h4>
                      <ul>
                        {result.result.missingRequirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => createChatSession(result)}
                >
                  Ask Questions
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedResumeScreener; 