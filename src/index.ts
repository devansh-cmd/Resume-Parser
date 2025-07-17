/**
 * R1 Agent - Resume Screening Agent
 * Main entry point for the intelligent resume screening system
 */

export { R1Agent, createR1Agent, screenResume } from './R1Agent';
export { parseResume } from './parsers/ResumeParser';
export { FeatureExtractor } from './extractors/FeatureExtractor';
export { ResumeEvaluator } from './evaluators/ResumeEvaluator';

// Export all types
export * from './types';

/**
 * Example usage of R1 Agent
 */
async function exampleUsage() {
  const { R1Agent } = await import('./R1Agent');
  const agent = new R1Agent();

  // Example job requirements
  const jobRequirements = {
    minimumYearsOfExperience: 3,
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
    preferredSkills: ['TypeScript', 'AWS', 'Docker', 'MongoDB'],
    requiredEducation: {
      minimumDegree: 'bachelor' as const,
      preferredFields: ['Computer Science', 'Software Engineering']
    },
    requiredCertifications: [],
    softSkills: ['Communication', 'Teamwork', 'Problem Solving']
  };

  // Example raw resume text
  const rawResumeText = `
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
    
    Software Developer
    StartupXYZ, 2019-2021
    - Built web applications with JavaScript
    - Implemented REST APIs
    
    SKILLS
    JavaScript, React, Node.js, SQL, TypeScript, Git, HTML, CSS
  `;

  // Example structured resume data
  const structuredResume = {
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
  };

  try {
    // Test with raw text resume
    console.log('=== Testing Raw Text Resume ===');
    const rawResult = await agent.runR1(
      { type: 'raw', content: rawResumeText },
      jobRequirements
    );
    console.log('Raw Resume Result:', JSON.stringify(rawResult, null, 2));

    // Test with structured resume
    console.log('\n=== Testing Structured Resume ===');
    const structuredResult = await agent.runR1(
      { type: 'structured', content: structuredResume },
      jobRequirements
    );
    console.log('Structured Resume Result:', JSON.stringify(structuredResult, null, 2));

    // Generate detailed report
    console.log('\n=== Detailed Report ===');
    const detailedReport = await agent.generateDetailedReport(
      { type: 'structured', content: structuredResume },
      jobRequirements
    );
    console.log('Detailed Report:', JSON.stringify(detailedReport, null, 2));

  } catch (error) {
    console.error('Error in example usage:', error);
  }
}

// Example usage can be called directly
// exampleUsage().catch(console.error); 