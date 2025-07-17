import React, { useState } from 'react'

interface ScreeningResult {
  screeningResult: 'pass' | 'fail'
  confidenceScore: number
  matchReasons: string[]
  missingRequirements?: string[]
  candidateProfile: {
    fullName: string
    email: string
    phone: string
    education: any[]
    workExperience: any[]
    skills: any[]
    certifications: any[]
  }
}

const ResumeScreener: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'raw' | 'structured'>('raw')
  const [rawResume, setRawResume] = useState('')
  const [structuredResume, setStructuredResume] = useState('')
  const [jobRequirements, setJobRequirements] = useState('')
  const [result, setResult] = useState<ScreeningResult | null>(null)
  const [loading, setLoading] = useState(false)

  const defaultJobRequirements = {
    minimumYearsOfExperience: 3,
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
    preferredSkills: ['TypeScript', 'AWS', 'Docker', 'MongoDB'],
    requiredEducation: {
      minimumDegree: 'bachelor',
      preferredFields: ['Computer Science', 'Software Engineering']
    },
    requiredCertifications: [],
    softSkills: ['Communication', 'Teamwork', 'Problem Solving']
  }

  const handleScreenResume = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Simulate API call to R1 agent
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock result for demo
      const mockResult: ScreeningResult = {
        screeningResult: Math.random() > 0.5 ? 'pass' : 'fail',
        confidenceScore: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
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

      setResult(mockResult)
    } catch (error) {
      console.error('Screening failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInputData = () => {
    if (activeTab === 'raw') {
      return {
        type: 'raw' as const,
        content: rawResume
      }
    } else {
      try {
        return {
          type: 'structured' as const,
          content: JSON.parse(structuredResume)
        }
      } catch {
        return null
      }
    }
  }

  const isFormValid = () => {
    if (activeTab === 'raw') {
      return rawResume.trim().length > 0
    } else {
      try {
        JSON.parse(structuredResume)
        return true
      } catch {
        return false
      }
    }
  }

  return (
    <div>
      {/* Input Section */}
      <div className="card">
        <h2>Resume Input</h2>
        
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'raw' ? 'active' : ''}`}
            onClick={() => setActiveTab('raw')}
          >
            Raw Text
          </button>
          <button
            className={`tab ${activeTab === 'structured' ? 'active' : ''}`}
            onClick={() => setActiveTab('structured')}
          >
            Structured JSON
          </button>
        </div>

        <div className={`tab-content ${activeTab === 'raw' ? 'active' : ''}`}>
          <div className="form-group">
            <label htmlFor="rawResume">Paste Resume Text</label>
            <textarea
              id="rawResume"
              className="form-control"
              value={rawResume}
              onChange={(e) => setRawResume(e.target.value)}
              placeholder="Paste the raw resume text here..."
            />
          </div>
        </div>

        <div className={`tab-content ${activeTab === 'structured' ? 'active' : ''}`}>
          <div className="form-group">
            <label htmlFor="structuredResume">Structured Resume JSON</label>
            <textarea
              id="structuredResume"
              className="form-control json-input"
              value={structuredResume}
              onChange={(e) => setStructuredResume(e.target.value)}
              placeholder='{"name": "John Doe", "email": "john@email.com", ...}'
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="jobRequirements">Job Requirements (Optional)</label>
          <textarea
            id="jobRequirements"
            className="form-control json-input"
            value={jobRequirements}
            onChange={(e) => setJobRequirements(e.target.value)}
            placeholder="Leave empty to use default requirements"
          />
        </div>

        <button
          className="btn"
          onClick={handleScreenResume}
          disabled={!isFormValid() || loading}
        >
          {loading ? 'Screening...' : 'Screen Resume'}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
            <span style={{ marginLeft: '1rem' }}>Analyzing resume...</span>
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="result-card">
          <div className="result-header">
            <span className={`result-status ${result.screeningResult}`}>
              {result.screeningResult.toUpperCase()}
            </span>
            <span className="confidence-score">
              {Math.round(result.confidenceScore * 100)}% Confidence
            </span>
          </div>

          <div className="result-details">
            <div className="result-section">
              <h3>Match Reasons</h3>
              <ul className="result-list">
                {result.matchReasons.map((reason, index) => (
                  <li key={index}>
                    <span className="icon success">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {result.missingRequirements && result.missingRequirements.length > 0 && (
              <div className="result-section">
                <h3>Missing Requirements</h3>
                <ul className="result-list">
                  {result.missingRequirements.map((requirement, index) => (
                    <li key={index}>
                      <span className="icon error">✗</span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="result-section" style={{ marginTop: '2rem' }}>
            <h3>Candidate Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <strong>Name:</strong> {result.candidateProfile.fullName}
              </div>
              <div>
                <strong>Email:</strong> {result.candidateProfile.email}
              </div>
              <div>
                <strong>Phone:</strong> {result.candidateProfile.phone}
              </div>
              <div>
                <strong>Experience:</strong> {result.candidateProfile.workExperience.length} positions
              </div>
              <div>
                <strong>Education:</strong> {result.candidateProfile.education.length} degrees
              </div>
              <div>
                <strong>Skills:</strong> {result.candidateProfile.skills.length} skills
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Example Section */}
      <div className="card">
        <h2>Example Input</h2>
        <p style={{ marginBottom: '1rem', color: '#718096' }}>
          Try this sample resume to test the system:
        </p>
        
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'raw' ? 'active' : ''}`}
            onClick={() => setActiveTab('raw')}
          >
            Raw Text Example
          </button>
          <button
            className={`tab ${activeTab === 'structured' ? 'active' : ''}`}
            onClick={() => setActiveTab('structured')}
          >
            JSON Example
          </button>
        </div>

        <div className={`tab-content ${activeTab === 'raw' ? 'active' : ''}`}>
          <button
            className="btn btn-secondary"
            onClick={() => setRawResume(`John Doe
john.doe@email.com
(555) 123-4567

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2020

EXPERIENCE
Senior Software Engineer
Tech Corp Inc, 2021-2023
- Developed React applications
- Used Node.js for backend services
- Worked with SQL databases

Software Developer
StartupXYZ, 2019-2021
- Built web applications with JavaScript
- Implemented REST APIs

SKILLS
JavaScript, React, Node.js, SQL, TypeScript, Git, HTML, CSS`)}
          >
            Load Example Raw Resume
          </button>
        </div>

        <div className={`tab-content ${activeTab === 'structured' ? 'active' : ''}`}>
          <button
            className="btn btn-secondary"
            onClick={() => setStructuredResume(JSON.stringify({
              name: 'Jane Smith',
              email: 'jane.smith@email.com',
              phone: '(555) 987-6543',
              education: [
                {
                  degree: 'Master of Science in Software Engineering',
                  institution: 'Tech University',
                  graduationYear: 2021,
                  field: 'Software Engineering'
                }
              ],
              experience: [
                {
                  title: 'Full Stack Developer',
                  company: 'Tech Solutions',
                  startDate: '2021',
                  endDate: '2023',
                  duration: 24,
                  description: 'Developed full-stack applications',
                  technologies: ['React', 'Node.js', 'MongoDB']
                }
              ],
              skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
              certifications: [
                {
                  name: 'AWS Certified Developer',
                  issuingOrganization: 'Amazon Web Services',
                  issueDate: '2022'
                }
              ]
            }, null, 2))}
          >
            Load Example JSON Resume
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResumeScreener 