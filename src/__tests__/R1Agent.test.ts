import { R1Agent, screenResume } from '../R1Agent';
import { parseResume } from '../parsers/ResumeParser';
import { FeatureExtractor } from '../extractors/FeatureExtractor';
import { ResumeEvaluator } from '../evaluators/ResumeEvaluator';
import { JobRequirements, ResumeInput } from '../types';

describe('R1 Agent Tests', () => {
  let agent: R1Agent;

  beforeEach(() => {
    agent = new R1Agent();
  });

  describe('Resume Parser', () => {
    test('should parse raw text resume', () => {
      const rawText = `
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
      `;

      const result = parseResume(rawText);

      expect(result.fullName).toBe('John Doe');
      expect(result.email).toBe('john.doe@email.com');
      expect(result.phone).toBe('5551234567');
      expect(result.education.length).toBeGreaterThan(0);
      expect(result.skills.length).toBeGreaterThan(0);
    });

    test('should parse structured JSON resume', () => {
      const structuredData = {
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '(555) 987-6543',
        education: [
          {
            degree: 'Master of Science in Software Engineering',
            institution: 'Tech University',
            graduationYear: 2021
          }
        ],
        experience: [
          {
            title: 'Full Stack Developer',
            company: 'Tech Solutions',
            startDate: '2021',
            endDate: '2023',
            duration: 24
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
      };

      const result = parseResume(structuredData);

      expect(result.fullName).toBe('Jane Smith');
      expect(result.email).toBe('jane.smith@email.com');
      expect(result.education.length).toBe(1);
      expect(result.workExperience.length).toBe(1);
      expect(result.skills.length).toBe(4);
    });
  });

  describe('Feature Extractor', () => {
    test('should extract features from parsed resume', () => {
      const parsedResume = {
        fullName: 'Test Candidate',
        email: 'test@email.com',
        phone: '5551234567',
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'Test University',
            graduationYear: 2020,
            field: 'Computer Science'
          }
        ],
        workExperience: [
          {
            title: 'Software Engineer',
            company: 'Test Company',
            startDate: '2020',
            endDate: '2023',
            duration: 36,
            description: 'Developed web applications',
            technologies: ['JavaScript', 'React', 'Node.js']
          }
        ],
        skills: [
          { name: 'JavaScript', category: 'technical' as const, proficiency: 'advanced' as const },
          { name: 'React', category: 'technical' as const, proficiency: 'intermediate' as const },
          { name: 'Node.js', category: 'technical' as const, proficiency: 'intermediate' as const }
        ],
        certifications: []
      };

      const extractor = new FeatureExtractor();
      const features = extractor.extractFeatures(parsedResume);

      expect(features.totalYearsExperience).toBe(3);
      expect(features.educationLevel).toBe('bachelor');
      expect(features.hasRequiredSkills).toBe(true);
      expect(features.skillMatchPercentage).toBeGreaterThan(0);
    });
  });

  describe('Resume Evaluator', () => {
    test('should evaluate candidate against job requirements', () => {
      const jobRequirements: JobRequirements = {
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

      const parsedResume = {
        fullName: 'Test Candidate',
        email: 'test@email.com',
        phone: '5551234567',
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'Test University',
            graduationYear: 2020,
            field: 'Computer Science'
          }
        ],
        workExperience: [
          {
            title: 'Software Engineer',
            company: 'Test Company',
            startDate: '2020',
            endDate: '2023',
            duration: 36,
            description: 'Developed web applications',
            technologies: ['JavaScript', 'React', 'Node.js']
          }
        ],
        skills: [
          { name: 'JavaScript', category: 'technical' as const, proficiency: 'advanced' as const },
          { name: 'React', category: 'technical' as const, proficiency: 'intermediate' as const },
          { name: 'Node.js', category: 'technical' as const, proficiency: 'intermediate' as const }
        ],
        certifications: []
      };

      const evaluator = new ResumeEvaluator();
      const result = evaluator.evaluateAgainstCriteria(parsedResume, jobRequirements);

      expect(result.screeningResult).toBe('pass');
      expect(result.confidenceScore).toBeGreaterThan(0.7);
      expect(result.matchReasons.length).toBeGreaterThan(0);
    });
  });

  describe('R1 Agent Integration', () => {
    test('should process raw text resume end-to-end', async () => {
      const rawResumeInput: ResumeInput = {
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
          - Developed React applications
          - Used Node.js for backend services
          
          SKILLS
          Technical Skills: JavaScript, React, Node.js, SQL, TypeScript
        `
      };

      const jobRequirements: JobRequirements = {
        minimumYearsOfExperience: 2,
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        preferredSkills: ['TypeScript', 'SQL'],
        requiredEducation: {
          minimumDegree: 'bachelor',
          preferredFields: ['Computer Science']
        },
        requiredCertifications: [],
        softSkills: ['Communication']
      };

      const result = await agent.runR1(rawResumeInput, jobRequirements);

      expect(result.screeningResult).toBe('pass');
      expect(result.candidateProfile.fullName).toBe('John Doe');
      expect(result.candidateProfile.email).toBe('john.doe@email.com');
      expect(result.matchReasons.length).toBeGreaterThan(0);
    });

    test('should process structured resume end-to-end', async () => {
      const structuredResumeInput: ResumeInput = {
        type: 'structured',
        content: {
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
        }
      };

      const jobRequirements: JobRequirements = {
        minimumYearsOfExperience: 2,
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        preferredSkills: ['TypeScript', 'MongoDB', 'AWS'],
        requiredEducation: {
          minimumDegree: 'bachelor',
          preferredFields: ['Software Engineering']
        },
        requiredCertifications: [],
        softSkills: ['Communication']
      };

      const result = await agent.runR1(structuredResumeInput, jobRequirements);

      expect(result.screeningResult).toBe('pass');
      expect(result.candidateProfile.fullName).toBe('Jane Smith');
      expect(result.candidateProfile.email).toBe('jane.smith@email.com');
      expect(result.confidenceScore).toBeGreaterThan(0.8);
    });

    test('should fail candidate with insufficient experience', async () => {
      const rawResumeInput: ResumeInput = {
        type: 'raw',
        content: `
          New Graduate
          newgrad@email.com
          (555) 111-2222
          
          EDUCATION
          Bachelor of Science in Computer Science
          University of Technology, 2023
          
          EXPERIENCE
          Intern
          Tech Corp Inc, 2023
          - Assisted with web development
          
          SKILLS
          JavaScript, HTML, CSS
        `
      };

      const jobRequirements: JobRequirements = {
        minimumYearsOfExperience: 3,
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        preferredSkills: ['TypeScript'],
        requiredEducation: {
          minimumDegree: 'bachelor',
          preferredFields: ['Computer Science']
        },
        requiredCertifications: [],
        softSkills: ['Communication']
      };

      const result = await agent.runR1(rawResumeInput, jobRequirements);

      expect(result.screeningResult).toBe('fail');
      expect(result.missingRequirements).toContain('Requires 3+ years experience');
    });

    test('should fail candidate with missing required skills', async () => {
      const rawResumeInput: ResumeInput = {
        type: 'raw',
        content: `
          Designer
          designer@email.com
          (555) 333-4444
          
          EDUCATION
          Bachelor of Arts in Design
          Design University, 2020
          
          EXPERIENCE
          UI Designer
          Design Corp, 2020-2023
          - Created user interfaces
          
          SKILLS
          Photoshop, Illustrator, Figma, HTML, CSS
        `
      };

      const jobRequirements: JobRequirements = {
        minimumYearsOfExperience: 2,
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        preferredSkills: ['TypeScript'],
        requiredEducation: {
          minimumDegree: 'bachelor',
          preferredFields: ['Computer Science']
        },
        requiredCertifications: [],
        softSkills: ['Communication']
      };

      const result = await agent.runR1(rawResumeInput, jobRequirements);

      expect(result.screeningResult).toBe('fail');
      expect(result.missingRequirements![1]).toContain('Missing required skills:');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid resume input gracefully', async () => {
      const invalidInput = {
        type: 'raw',
        content: '' // Empty content
      };

      const jobRequirements: JobRequirements = {
        minimumYearsOfExperience: 2,
        requiredSkills: ['JavaScript'],
        preferredSkills: ['React'],
        requiredEducation: {
          minimumDegree: 'bachelor',
          preferredFields: ['Computer Science']
        },
        requiredCertifications: [],
        softSkills: ['Communication']
      };

      const result = await agent.runR1(invalidInput as ResumeInput, jobRequirements);

      expect(result.screeningResult).toBe('fail');
      expect(result.errorMessages).toBeDefined();
    });

    test('should validate job requirements', () => {
      const invalidRequirements = {
        minimumYearsOfExperience: -1, // Invalid
        requiredSkills: [], // Empty
        preferredSkills: ['React'],
        requiredEducation: {
          minimumDegree: 'bachelor',
          preferredFields: ['Computer Science']
        },
        requiredCertifications: [],
        softSkills: ['Communication']
      };

      const isValid = agent.validateJobRequirements(invalidRequirements as JobRequirements);
      expect(isValid).toBe(false);
    });
  });

  describe('Agent Status', () => {
    test('should return agent status information', () => {
      const status = agent.getAgentStatus();

      expect(status.agent).toBe('R1 - Resume Screening Agent');
      expect(status.version).toBe('1.0.0');
      expect(status.status).toBe('active');
      expect(status.errorCount).toBe(0);
      expect(status.timestamp).toBeDefined();
    });
  });
}); 