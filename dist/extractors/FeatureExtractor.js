"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureExtractor = void 0;
/**
 * FeatureExtractor - Analyzes parsed resume data and extracts relevant features
 * for job requirement evaluation
 */
class FeatureExtractor {
    /**
     * Extract all relevant features from parsed resume data
     */
    extractFeatures(parsedResume) {
        return {
            hasRequiredSkills: this.checkRequiredSkills(parsedResume.skills),
            hasPreferredSkills: this.checkPreferredSkills(parsedResume.skills),
            meetsExperienceRequirement: this.checkExperienceRequirement(parsedResume.workExperience),
            meetsEducationRequirement: this.checkEducationRequirement(parsedResume.education),
            hasRequiredCertifications: this.checkCertificationRequirement(parsedResume.certifications),
            totalYearsExperience: this.calculateTotalExperience(parsedResume.workExperience),
            skillMatchPercentage: this.calculateSkillMatch(parsedResume.skills),
            educationLevel: this.determineEducationLevel(parsedResume.education)
        };
    }
    /**
     * Check if candidate has required skills
     */
    checkRequiredSkills(skills) {
        const requiredSkills = [
            'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL',
            'Git', 'HTML', 'CSS', 'TypeScript', 'AWS', 'Docker'
        ];
        const candidateSkillNames = skills.map(skill => skill.name.toLowerCase());
        const hasRequiredSkills = requiredSkills.some(skill => candidateSkillNames.includes(skill.toLowerCase()));
        return hasRequiredSkills;
    }
    /**
     * Check if candidate has preferred skills
     */
    checkPreferredSkills(skills) {
        const preferredSkills = [
            'Kubernetes', 'MongoDB', 'Redis', 'GraphQL', 'TypeScript',
            'Docker', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Microservices'
        ];
        const candidateSkillNames = skills.map(skill => skill.name.toLowerCase());
        const hasPreferredSkills = preferredSkills.some(skill => candidateSkillNames.includes(skill.toLowerCase()));
        return hasPreferredSkills;
    }
    /**
     * Check if candidate meets minimum experience requirement
     */
    checkExperienceRequirement(workExperience) {
        const totalMonths = this.calculateTotalExperience(workExperience);
        const minimumYears = 3; // Default minimum
        return totalMonths >= (minimumYears * 12);
    }
    /**
     * Check if candidate meets education requirement
     */
    checkEducationRequirement(education) {
        const educationLevel = this.determineEducationLevel(education);
        const requiredLevel = 'bachelor'; // Default requirement
        const levelHierarchy = {
            'high_school': 1,
            'associate': 2,
            'bachelor': 3,
            'master': 4,
            'phd': 5
        };
        const candidateLevel = levelHierarchy[educationLevel] || 0;
        const requiredLevelNum = levelHierarchy[requiredLevel] || 0;
        return candidateLevel >= requiredLevelNum;
    }
    /**
     * Check if candidate has required certifications
     */
    checkCertificationRequirement(certifications) {
        const requiredCerts = [
            'AWS Certified', 'Microsoft Certified', 'Google Certified',
            'CISSP', 'PMP', 'Scrum Master'
        ];
        if (certifications.length === 0)
            return true; // No certification requirement
        const candidateCertNames = certifications.map(cert => cert.name.toLowerCase());
        return requiredCerts.some(cert => candidateCertNames.some(candidateCert => candidateCert.includes(cert.toLowerCase())));
    }
    /**
     * Calculate total years of experience
     */
    calculateTotalExperience(workExperience) {
        const totalMonths = workExperience.reduce((total, exp) => {
            return total + exp.duration;
        }, 0);
        return Math.round(totalMonths / 12);
    }
    /**
     * Calculate skill match percentage
     */
    calculateSkillMatch(skills) {
        const allSkills = [
            'JavaScript', 'Python', 'Java', 'C++', 'React', 'Angular', 'Vue', 'Node.js',
            'SQL', 'MongoDB', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Linux',
            'HTML', 'CSS', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
            'Kubernetes', 'Redis', 'GraphQL', 'CI/CD', 'Microservices', 'REST', 'GraphQL'
        ];
        const candidateSkillNames = skills.map(skill => skill.name.toLowerCase());
        const matchedSkills = allSkills.filter(skill => candidateSkillNames.includes(skill.toLowerCase()));
        return Math.round((matchedSkills.length / allSkills.length) * 100);
    }
    /**
     * Determine the highest education level achieved
     */
    determineEducationLevel(education) {
        if (education.length === 0)
            return 'high_school';
        const degreeLevels = {
            'high_school': 1,
            'associate': 2,
            'bachelor': 3,
            'master': 4,
            'phd': 5
        };
        let highestLevel = 'high_school';
        let highestLevelNum = 1;
        for (const edu of education) {
            const degree = edu.degree.toLowerCase();
            if (degree.includes('phd') || degree.includes('doctorate')) {
                if (degreeLevels.phd > highestLevelNum) {
                    highestLevel = 'phd';
                    highestLevelNum = degreeLevels.phd;
                }
            }
            else if (degree.includes('master') || degree.includes('ms') || degree.includes('ma')) {
                if (degreeLevels.master > highestLevelNum) {
                    highestLevel = 'master';
                    highestLevelNum = degreeLevels.master;
                }
            }
            else if (degree.includes('bachelor') || degree.includes('bs') || degree.includes('ba')) {
                if (degreeLevels.bachelor > highestLevelNum) {
                    highestLevel = 'bachelor';
                    highestLevelNum = degreeLevels.bachelor;
                }
            }
            else if (degree.includes('associate') || degree.includes('aa') || degree.includes('as')) {
                if (degreeLevels.associate > highestLevelNum) {
                    highestLevel = 'associate';
                    highestLevelNum = degreeLevels.associate;
                }
            }
        }
        return highestLevel;
    }
    /**
     * Extract specific features for detailed analysis
     */
    extractDetailedFeatures(parsedResume) {
        return {
            // Basic info
            hasValidEmail: this.isValidEmail(parsedResume.email),
            hasValidPhone: this.isValidPhone(parsedResume.phone),
            // Experience analysis
            experienceBreakdown: this.analyzeExperience(parsedResume.workExperience),
            // Skills analysis
            technicalSkills: this.getTechnicalSkills(parsedResume.skills),
            softSkills: this.getSoftSkills(parsedResume.skills),
            // Education analysis
            educationBreakdown: this.analyzeEducation(parsedResume.education),
            // Certifications
            certificationCount: parsedResume.certifications.length,
            // Overall metrics
            completenessScore: this.calculateCompleteness(parsedResume)
        };
    }
    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
    /**
     * Validate phone format
     */
    isValidPhone(phone) {
        return phone.length >= 10;
    }
    /**
     * Analyze work experience patterns
     */
    analyzeExperience(workExperience) {
        const totalMonths = this.calculateTotalExperience(workExperience);
        const avgDuration = workExperience.length > 0 ?
            totalMonths / workExperience.length : 0;
        return {
            totalMonths,
            averageDuration: avgDuration,
            jobCount: workExperience.length,
            hasRecentExperience: this.hasRecentExperience(workExperience),
            careerProgression: this.analyzeCareerProgression(workExperience)
        };
    }
    /**
     * Check if candidate has recent experience (within last 2 years)
     */
    hasRecentExperience(workExperience) {
        const currentYear = new Date().getFullYear();
        return workExperience.some(exp => {
            const endYear = exp.endDate ? parseInt(exp.endDate) : currentYear;
            return (currentYear - endYear) <= 2;
        });
    }
    /**
     * Analyze career progression
     */
    analyzeCareerProgression(workExperience) {
        if (workExperience.length < 2)
            return 'insufficient_data';
        const titles = workExperience.map(exp => exp.title.toLowerCase());
        const hasProgression = titles.some(title => title.includes('senior') || title.includes('lead') || title.includes('principal'));
        return hasProgression ? 'progressive' : 'lateral';
    }
    /**
     * Get technical skills
     */
    getTechnicalSkills(skills) {
        return skills
            .filter(skill => skill.category === 'technical')
            .map(skill => skill.name);
    }
    /**
     * Get soft skills
     */
    getSoftSkills(skills) {
        return skills
            .filter(skill => skill.category === 'soft')
            .map(skill => skill.name);
    }
    /**
     * Analyze education patterns
     */
    analyzeEducation(education) {
        return {
            degreeCount: education.length,
            highestDegree: this.determineEducationLevel(education),
            hasRelevantField: this.hasRelevantField(education),
            graduationYears: education.map(edu => edu.graduationYear).filter(Boolean)
        };
    }
    /**
     * Check if candidate has relevant field of study
     */
    hasRelevantField(education) {
        const relevantFields = [
            'computer science', 'software engineering', 'information technology',
            'data science', 'engineering', 'mathematics', 'physics'
        ];
        return education.some(edu => {
            const field = edu.field?.toLowerCase() || '';
            return relevantFields.some(relevant => field.includes(relevant));
        });
    }
    /**
     * Calculate resume completeness score
     */
    calculateCompleteness(parsedResume) {
        let score = 0;
        const maxScore = 100;
        // Basic info (20 points)
        if (parsedResume.fullName !== 'Unknown')
            score += 10;
        if (parsedResume.email)
            score += 5;
        if (parsedResume.phone)
            score += 5;
        // Experience (30 points)
        if (parsedResume.workExperience.length > 0)
            score += 30;
        // Education (20 points)
        if (parsedResume.education.length > 0)
            score += 20;
        // Skills (20 points)
        if (parsedResume.skills.length > 0)
            score += 20;
        // Certifications (10 points)
        if (parsedResume.certifications.length > 0)
            score += 10;
        return Math.min(score, maxScore);
    }
}
exports.FeatureExtractor = FeatureExtractor;
//# sourceMappingURL=FeatureExtractor.js.map