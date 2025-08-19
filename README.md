# R1 - Intelligent Resume Screening Agent

R1 is the first intelligent agent in an AI-based recruitment automation pipeline. It specializes in resume screening with advanced features including Excel job description processing and LLM-powered chatbot Q&A.

## 🚀 Features

### Core Resume Screening
- **Multi-format Input**: Accepts both raw text and structured JSON resume data
- **Intelligent Parsing**: Extracts candidate information using advanced regex patterns
- **Feature Extraction**: Analyzes skills, experience, education, and certifications
- **Smart Evaluation**: Evaluates candidates against job requirements with confidence scoring
- **Comprehensive Results**: Provides detailed pass/fail decisions with reasoning

### Excel Job Description Processing
- **Bulk Processing**: Upload Excel files with multiple job descriptions
- **Flexible Column Mapping**: Automatically maps common column names to expected fields
- **Validation**: Validates Excel structure and provides detailed error reporting
- **Multi-job Screening**: Screen one resume against multiple job descriptions simultaneously

### LLM-Powered Chatbot
- **Natural Language Q&A**: Ask questions about screening decisions in plain English
- **Context-Aware Responses**: Chatbot understands candidate profiles and job requirements
- **Suggested Questions**: Get intelligent question suggestions based on screening results
- **Session Management**: Maintain chat history for each candidate-job combination
- **Confidence Scoring**: Receive confidence levels for chatbot responses

### Agentic AI Capabilities
- **Autonomous Decision-Making**: Makes intelligent parsing and evaluation decisions
- **Multi-Scenario Analysis**: Evaluates candidates under different criteria
- **Uncertainty Handling**: Detects and manages factors that introduce uncertainty
- **Learning & Adaptation**: Learns from past screenings to improve future decisions
- **Transparent Reasoning**: Provides detailed explanations for all decisions

## 🛠️ Tech Stack

- **Backend**: TypeScript, Node.js
- **Frontend**: React, Vite
- **Excel Processing**: xlsx library
- **LLM Integration**: OpenAI API (configurable)
- **Testing**: Jest
- **Build Tools**: TypeScript compiler, Vite

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd R1_Agent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
# Create .env file for LLM configuration
OPENAI_API_KEY=your_openai_api_key_here
```

## 🚀 Usage

### Development

Start the frontend development server:
```bash
npm run dev:frontend
```

Run the backend agent:
```bash
npm run dev:agent
```

Run tests:
```bash
npm test
```

### Production

Build the frontend:
```bash
npm run build:frontend
```

Build the backend:
```bash
npm run build
```

## 📋 Excel File Format

The application accepts Excel files (.xlsx, .xls) with job descriptions. The following columns are supported:

| Column Name | Description | Required |
|-------------|-------------|----------|
| Title/Position/Role | Job title | ✅ |
| Company/Organization | Company name | ✅ |
| Description/Summary | Job description | ✅ |
| Requirements/Qualifications | Job requirements | ❌ |
| Experience/Years | Minimum experience | ❌ |
| Required Skills | Comma-separated skills | ❌ |
| Preferred Skills | Comma-separated skills | ❌ |
| Education/Degree | Education requirements | ❌ |
| Location/City/Address | Job location | ❌ |
| Department/Team | Department name | ❌ |
| Salary/Compensation | Salary range | ❌ |
| Employment Type | Full-time, Part-time, etc. | ❌ |

### Example Excel Structure:
```
Title           | Company    | Description           | Requirements
Senior Developer| Tech Corp  | We are looking...    | 5+ years...
Frontend Dev    | StartupXYZ | Join our team...     | 3+ years...
```

## 💬 Chatbot Usage

The chatbot allows you to ask natural language questions about screening decisions:

### Example Questions:
- "Why was this candidate screened as pass/fail?"
- "What skills does the candidate have?"
- "What are the missing requirements?"
- "How does their experience match the job?"
- "Could this candidate be considered for a different role?"

### Features:
- **Context Awareness**: Understands candidate profiles and job requirements
- **Suggested Questions**: Click on suggested questions to get started
- **Session History**: Maintains conversation context
- **Confidence Scoring**: Shows confidence levels for responses

## 🏗️ Architecture

### Core Modules

```
src/
├── types/                 # TypeScript interfaces and types
├── parsers/              # Resume parsing logic
├── extractors/           # Feature extraction
├── evaluators/           # Resume evaluation
├── processors/           # Excel processing
├── chatbot/              # LLM-powered chatbot
├── agentic/              # Agentic AI capabilities
└── R1AgentEnhanced.ts    # Main orchestrator
```

### Data Flow

1. **Input Processing**: Resume data (raw text or JSON) + Excel job descriptions
2. **Parsing**: Extract structured candidate information
3. **Feature Extraction**: Analyze skills, experience, education
4. **Evaluation**: Compare against job requirements
5. **Results**: Generate screening decisions with reasoning
6. **Chatbot**: Enable Q&A about decisions

## 🔧 Configuration

### LLM Configuration

Configure the chatbot in `src/R1AgentEnhanced.ts`:

```typescript
const llmConfig: LLMConfig = {
  provider: 'openai',
  model: 'gpt-3.5-turbo',
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  maxTokens: 1000
};
```

### Excel Processing Configuration

The Excel processor automatically maps column names. You can customize the mapping in `src/processors/ExcelProcessor.ts`.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📊 Sample Data

### Sample Resume (Raw Text)
```
John Doe
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

SKILLS
JavaScript, React, Node.js, SQL, TypeScript, Git
```

### Sample Resume (JSON)
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@email.com",
  "phone": "(555) 987-6543",
  "education": [
    {
      "degree": "Master of Science in Software Engineering",
      "institution": "Tech University",
      "graduationYear": 2021
    }
  ],
  "experience": [
    {
      "title": "Full Stack Developer",
      "company": "Tech Solutions",
      "startDate": "2021",
      "endDate": "2023",
      "duration": 24
    }
  ],
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"]
}
```

## 🤖 Agentic AI Features

### Autonomous Decision-Making
- **Content Analysis**: Analyzes resume content to determine parsing strategy
- **Adaptive Parsing**: Chooses appropriate parsing methods based on content
- **Multi-Scenario Evaluation**: Evaluates candidates under different criteria

### Uncertainty Handling
- **Confidence Calibration**: Adjusts confidence scores based on data quality
- **Alternative Evaluations**: Provides multiple evaluation perspectives
- **Risk Assessment**: Identifies factors that introduce uncertainty

### Learning & Adaptation
- **Pattern Recognition**: Learns from past screening patterns
- **Heuristic Application**: Applies learned heuristics to new cases
- **Performance Tracking**: Monitors and improves decision accuracy

### Transparent Reasoning
- **Decision Chains**: Documents step-by-step reasoning
- **Evidence Tracking**: Links decisions to specific evidence
- **Explanation Generation**: Provides detailed explanations for all decisions

## 🚀 Getting Started

1. **Upload Job Descriptions**: Use the Excel Upload tab to add job descriptions
2. **Input Resume**: Paste resume text or JSON in the Resume Input tab
3. **Screen Resume**: Click "Screen Resume" to process against all jobs
4. **Review Results**: View detailed screening results with confidence scores
5. **Ask Questions**: Use the Chatbot tab to ask questions about decisions

## 📈 Future Enhancements

- **Real LLM Integration**: Connect to actual OpenAI API for chatbot responses
- **PDF Processing**: Add support for PDF resume parsing
- **Advanced Analytics**: Dashboard with screening statistics
- **API Endpoints**: RESTful API for integration with other systems
- **Multi-language Support**: Support for resumes in different languages
- **Custom Scoring Models**: Configurable evaluation criteria

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions and support, please open an issue in the repository.

---

**R1 Agent** - Making recruitment smarter, one resume at a time! 🚀 