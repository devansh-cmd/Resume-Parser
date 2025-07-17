# R1 Agent - Intelligent Resume Screening Agent

R1 is the first intelligent agent in an agentic AI-based recruitment automation pipeline. It specializes in resume screening and evaluation against job requirements.

## Features

- **Dual Input Support**: Accepts both raw text resumes and structured JSON data
- **Intelligent Parsing**: Extracts key information like contact details, education, experience, and skills
- **Smart Evaluation**: Evaluates candidates against customizable job requirements
- **Beautiful UI**: Modern web interface for easy interaction
- **Comprehensive Testing**: Full test suite with 90%+ coverage

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test
```

### 3. Start the Frontend
```bash
npm run dev:frontend
```

This will start the web interface at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build:frontend
```

## Project Structure

```
R1_Agent/
├── src/
│   ├── types/           # TypeScript interfaces and types
│   ├── parsers/         # Resume parsing logic
│   ├── extractors/      # Feature extraction
│   ├── evaluators/      # Evaluation and scoring
│   ├── __tests__/       # Test files
│   ├── R1Agent.ts       # Main agent orchestrator
│   └── index.ts         # Entry point
├── frontend/            # React web interface
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.tsx      # Main app component
│   │   └── index.css    # Styles
│   └── index.html       # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── jest.config.js       # Test configuration
└── vite.config.ts       # Frontend build configuration
```

## Usage

### Programmatic Usage

```typescript
import { R1Agent, screenResume } from './src/R1Agent';

// Create agent instance
const agent = new R1Agent();

// Define job requirements
const jobRequirements = {
  minimumYearsOfExperience: 3,
  requiredSkills: ['JavaScript', 'React', 'Node.js'],
  preferredSkills: ['TypeScript', 'AWS'],
  requiredEducation: {
    minimumDegree: 'bachelor',
    preferredFields: ['Computer Science']
  },
  requiredCertifications: [],
  softSkills: ['Communication']
};

// Screen a raw text resume
const rawResumeInput = {
  type: 'raw',
  content: `
    John Doe
    john.doe@email.com
    (555) 123-4567
    
    EDUCATION
    Bachelor of Science in Computer Science
    University of Technology, 2020
    
    EXPERIENCE
    Senior Software Engineer
    Tech Corp Inc, 2021-2023
    
    SKILLS
    JavaScript, React, Node.js, SQL
  `
};

const result = await agent.runR1(rawResumeInput, jobRequirements);
console.log(result.screeningResult); // 'pass' or 'fail'
```

### Web Interface

1. Start the development server: `npm run dev:frontend`
2. Open your browser to `http://localhost:3000`
3. Choose between "Raw Text" or "Structured JSON" input
4. Paste resume data and optional job requirements
5. Click "Screen Resume" to get results

## API Reference

### R1Agent Class

#### `runR1(resumeInput, jobRequirements)`
Main method to screen a resume against job requirements.

**Parameters:**
- `resumeInput`: ResumeInput object (raw text or structured JSON)
- `jobRequirements`: JobRequirements object

**Returns:** Promise<ScreeningResult>

#### `generateDetailedReport(resumeInput, jobRequirements)`
Generate a comprehensive screening report with detailed analysis.

#### `validateJobRequirements(requirements)`
Validate job requirements before processing.

#### `getAgentStatus()`
Get agent health and status information.

### Types

#### ResumeInput
```typescript
type ResumeInput = RawResumeInput | StructuredResumeInput;

interface RawResumeInput {
  type: 'raw';
  content: string;
}

interface StructuredResumeInput {
  type: 'structured';
  content: {
    name?: string;
    email?: string;
    phone?: string;
    education?: Education[];
    experience?: WorkExperience[];
    skills?: string[];
    certifications?: Certification[];
  };
}
```

#### ScreeningResult
```typescript
interface ScreeningResult {
  candidateProfile: ParsedResume;
  screeningResult: 'pass' | 'fail';
  matchReasons: string[];
  confidenceScore: number;
  missingRequirements?: string[];
  errorMessages?: string[];
}
```

## Testing

Run the full test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Development

### Backend Development
```bash
npm run dev          # Run backend with ts-node
npm run build        # Build TypeScript
npm start           # Run built JavaScript
```

### Frontend Development
```bash
npm run dev:frontend    # Start Vite dev server
npm run build:frontend  # Build for production
npm run preview        # Preview production build
```

## Configuration

### Job Requirements
Customize the evaluation criteria by modifying the `JobRequirements` object:

```typescript
const jobRequirements = {
  minimumYearsOfExperience: 3,
  requiredSkills: ['JavaScript', 'React', 'Node.js'],
  preferredSkills: ['TypeScript', 'AWS', 'Docker'],
  requiredEducation: {
    minimumDegree: 'bachelor',
    preferredFields: ['Computer Science', 'Software Engineering']
  },
  requiredCertifications: ['AWS Certified'],
  softSkills: ['Communication', 'Teamwork']
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Roadmap

- [ ] LLM integration for improved parsing
- [ ] PDF resume parsing
- [ ] Integration with R2 (Ranking Agent)
- [ ] Advanced skill matching algorithms
- [ ] Multi-language support
- [ ] API endpoints for external integration 