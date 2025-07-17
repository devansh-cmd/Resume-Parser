import { ResumeInput, ParsedResume, Education, WorkExperience, Skill, Certification } from '../types';

/**
 * Parses resume data from either raw text or structured JSON format
 * Returns a unified ParsedResume object with extracted information
 */
export function parseResume(input: string | any): ParsedResume {
  // Detect input format
  if (typeof input === 'string') {
    return parseRawResume(input);
  } else if (typeof input === 'object' && input !== null) {
    return parseStructuredResume(input);
  } else {
    throw new Error('Invalid input format. Expected string or object.');
  }
}

/**
 * Parse raw text resume using regex patterns
 */
function parseRawResume(rawText: string): ParsedResume {
  const normalizedText = normalizeText(rawText);
  
  return {
    fullName: extractFullName(normalizedText),
    email: extractEmail(normalizedText),
    phone: extractPhone(normalizedText),
    education: extractEducation(normalizedText),
    workExperience: extractWorkExperience(normalizedText),
    skills: extractSkills(normalizedText),
    certifications: extractCertifications(normalizedText),
    rawText: rawText
  };
}

/**
 * Parse structured JSON resume data
 */
function parseStructuredResume(data: any): ParsedResume {
  return {
    fullName: data.name || data.fullName || 'Unknown',
    email: data.email || '',
    phone: data.phone || data.phoneNumber || '',
    education: normalizeEducation(data.education || []),
    workExperience: normalizeWorkExperience(data.experience || data.workExperience || []),
    skills: normalizeSkills(data.skills || []),
    certifications: normalizeCertifications(data.certifications || []),
  };
}

/**
 * Normalize text for better parsing
 */
function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
}

/**
 * Extract full name using common patterns
 */
function extractFullName(text: string): string {
  // Look for name at the beginning of document
  const namePatterns = [
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/m,
    /Name[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s+Resume/i
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }

  return 'Unknown';
}

/**
 * Extract email address
 */
function extractEmail(text: string): string {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailPattern);
  return match ? match[0] : '';
}

/**
 * Extract phone number
 */
function extractPhone(text: string): string {
  const phonePatterns = [
    /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
    /(\+?[0-9]{1,3}[-.\s]?)?([0-9]{3,4})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})/
  ];

  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].replace(/[-.\s]/g, '');
    }
  }

  return '';
}

/**
 * Extract education information
 */
function extractEducation(text: string): Education[] {
  const education: Education[] = [];
  const educationSection = extractSection(text, ['education', 'academic', 'degree']);
  
  if (!educationSection) return education;

  // Look for degree patterns
  const degreePatterns = [
    /(Bachelor|Master|PhD|Associate|High School|Diploma)[\s\w]*?(?:of|in|Science|Arts|Engineering|Technology|Computer|Business)/gi,
    /([A-Z][a-z]+)\s+(?:Degree|Diploma|Certificate)/gi
  ];

  const institutionPatterns = [
    /(?:University|College|Institute|School)\s+of\s+([A-Z][a-z\s]+)/gi,
    /([A-Z][a-z\s]+)\s+(?:University|College|Institute)/gi
  ];

  const yearPattern = /(?:20\d{2}|19\d{2})/g;

  // Extract degrees
  for (const pattern of degreePatterns) {
    const matches = educationSection.matchAll(pattern);
    for (const match of matches) {
      const degree = match[0];
      const institution = findInstitution(educationSection, institutionPatterns);
      const year = extractYear(educationSection, yearPattern);
      
      education.push({
        degree: degree.trim(),
        institution: institution || 'Unknown Institution',
        graduationYear: year,
        field: extractField(degree)
      });
    }
  }

  return education;
}

/**
 * Extract work experience
 */
function extractWorkExperience(text: string): WorkExperience[] {
  const experience: WorkExperience[] = [];
  const experienceSection = extractSection(text, ['experience', 'work', 'employment']);
  
  if (!experienceSection) return experience;

  // Common job title keywords
  const jobTitles = [
    'Engineer', 'Developer', 'Manager', 'Analyst', 'Specialist', 'Coordinator',
    'Director', 'Lead', 'Senior', 'Junior', 'Principal', 'Architect', 'Consultant'
  ];

  const titlePattern = new RegExp(`(${jobTitles.join('|')})`, 'gi');
  const companyPattern = /(?:at|with|for)\s+([A-Z][a-z\s&]+(?:Inc|LLC|Corp|Company|Ltd))/gi;
  const datePattern = /(?:20\d{2}|19\d{2})/g;

  const matches = experienceSection.matchAll(titlePattern);
  for (const match of matches) {
    const title = match[0];
    const company = findCompany(experienceSection, companyPattern);
    const dates = extractDates(experienceSection, datePattern);
    
    experience.push({
      title: title.trim(),
      company: company || 'Unknown Company',
      startDate: dates.start || '',
      endDate: dates.end,
      duration: calculateDuration(dates.start, dates.end),
      description: '',
      technologies: []
    });
  }

  return experience;
}

/**
 * Extract skills from text
 */
function extractSkills(text: string): Skill[] {
  const skills: Skill[] = [];
  const skillsSection = extractSection(text, ['skills', 'technical skills', 'competencies']);
  
  if (!skillsSection) return skills;

  // Common technical skills
  const technicalSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Angular', 'Vue', 'Node.js',
    'SQL', 'MongoDB', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Linux',
    'HTML', 'CSS', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin'
  ];

  const skillPattern = new RegExp(`(${technicalSkills.join('|')})`, 'gi');
  const matches = skillsSection.matchAll(skillPattern);
  
  for (const match of matches) {
    skills.push({
      name: match[0],
      category: 'technical',
      proficiency: 'intermediate'
    });
  }

  return skills;
}

/**
 * Extract certifications
 */
function extractCertifications(text: string): Certification[] {
  const certifications: Certification[] = [];
  const certSection = extractSection(text, ['certifications', 'certificates', 'credentials']);
  
  if (!certSection) return certifications;

  const certPattern = /([A-Z][a-z\s]+(?:Certification|Certificate|Certified))/gi;
  const matches = certSection.matchAll(certPattern);
  
  for (const match of matches) {
    certifications.push({
      name: match[0],
      issuingOrganization: 'Unknown',
      issueDate: undefined,
      expiryDate: undefined,
      credentialId: undefined
    });
  }

  return certifications;
}

/**
 * Extract a specific section from text
 */
function extractSection(text: string, keywords: string[]): string | null {
  const lines = text.split('\n');
  let inSection = false;
  let sectionContent: string[] = [];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Check if line contains section keyword
    if (keywords.some(keyword => lowerLine.includes(keyword))) {
      inSection = true;
      continue;
    }

    // Check if we've moved to next section
    if (inSection && (lowerLine.includes('experience') || lowerLine.includes('education') || 
        lowerLine.includes('skills') || lowerLine.includes('certifications'))) {
      break;
    }

    if (inSection) {
      sectionContent.push(line);
    }
  }

  return sectionContent.length > 0 ? sectionContent.join('\n') : null;
}

/**
 * Helper functions for extraction
 */
function findInstitution(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1] || match[0];
  }
  return null;
}

function extractYear(text: string, pattern: RegExp): number | undefined {
  const match = text.match(pattern);
  return match ? parseInt(match[0]) : undefined;
}

function extractField(degree: string): string | undefined {
  const fieldPattern = /(?:in|of)\s+([A-Z][a-z\s]+)/i;
  const match = degree.match(fieldPattern);
  return match ? match[1] : undefined;
}

function findCompany(text: string, pattern: RegExp): string | null {
  const match = text.match(pattern);
  return match ? match[1] : null;
}

function extractDates(text: string, pattern: RegExp): { start?: string, end?: string } {
  const matches = text.matchAll(pattern);
  const dates = Array.from(matches).map(m => m[0]);
  return {
    start: dates[0],
    end: dates[1]
  };
}

function calculateDuration(start?: string, end?: string): number {
  if (!start) return 0;
  const startYear = parseInt(start);
  const endYear = end ? parseInt(end) : new Date().getFullYear();
  return (endYear - startYear) * 12; // Convert to months
}

/**
 * Normalize structured data
 */
function normalizeEducation(education: any[]): Education[] {
  return education.map(edu => ({
    degree: edu.degree || edu.name || 'Unknown',
    institution: edu.institution || edu.school || edu.university || 'Unknown',
    graduationYear: edu.graduationYear || edu.year || edu.graduationDate,
    field: edu.field || edu.major || edu.study,
    gpa: edu.gpa
  }));
}

function normalizeWorkExperience(experience: any[]): WorkExperience[] {
  return experience.map(exp => ({
    title: exp.title || exp.jobTitle || exp.position || 'Unknown',
    company: exp.company || exp.employer || exp.organization || 'Unknown',
    startDate: exp.startDate || exp.start || exp.from || '',
    endDate: exp.endDate || exp.end || exp.to,
    duration: exp.duration || calculateDuration(exp.startDate, exp.endDate),
    description: exp.description || exp.summary || '',
    technologies: exp.technologies || exp.tech || exp.skills || []
  }));
}

function normalizeSkills(skills: any[]): Skill[] {
  return skills.map(skill => {
    if (typeof skill === 'string') {
      return {
        name: skill,
        category: 'technical',
        proficiency: 'intermediate'
      };
    }
    return {
      name: skill.name || skill.skill || 'Unknown',
      category: skill.category || 'technical',
      proficiency: skill.proficiency || 'intermediate',
      yearsOfExperience: skill.yearsOfExperience || skill.years
    };
  });
}

function normalizeCertifications(certifications: any[]): Certification[] {
  return certifications.map(cert => ({
    name: cert.name || cert.certification || 'Unknown',
    issuingOrganization: cert.issuingOrganization || cert.issuer || cert.organization || 'Unknown',
    issueDate: cert.issueDate || cert.issued || cert.date,
    expiryDate: cert.expiryDate || cert.expires || cert.expiration,
    credentialId: cert.credentialId || cert.id || cert.credential
  }));
} 