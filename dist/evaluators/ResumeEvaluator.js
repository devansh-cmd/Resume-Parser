"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeEvaluator = void 0;
/**
 * ResumeEvaluator - Evaluates candidate profiles against job requirements
 * and generates screening results with pass/fail decisions
 */
class ResumeEvaluator {
    /**
     * Evaluate candidate against job requirements
     */
    evaluateAgainstCriteria(candidateData, jobRequirements) {
        const features = this.extractEvaluationFeatures(candidateData);
        const evaluation = this.performEvaluation(features, jobRequirements);
        return {
            candidateProfile: candidateData,
            screeningResult: evaluation.pass ? 'pass' : 'fail',
            matchReasons: evaluation.reasons,
            confidenceScore: evaluation.confidence,
            missingRequirements: evaluation.missing,
            errorMessages: evaluation.errors
        };
    }
    /**
     * Extract features for evaluation
     */
    extractEvaluationFeatures(candidateData) {
        return {
            // Basic validation
            hasValidContact: this.hasValidContact(candidateData),
            // Experience analysis
            totalExperience: this.calculateTotalExperience(candidateData.workExperience),
            hasRelevantExperience: this.hasRelevantExperience(candidateData.workExperience),
            // Skills analysis
            skillMatch: this.analyzeSkillMatch(candidateData.skills),
            hasRequiredSkills: this.hasRequiredSkills(candidateData.skills),
            // Education analysis
            educationLevel: this.determineEducationLevel(candidateData.education),
            hasRelevantEducation: this.hasRelevantEducation(candidateData.education),
            // Certifications
            hasCertifications: candidateData.certifications.length > 0,
            // Overall quality
            resumeCompleteness: this.calculateCompleteness(candidateData),
            candidateSkillNames: candidateData.skills.map(skill => skill.name.toLowerCase())
        };
    }
    /**
     * Perform the actual evaluation
     */
    performEvaluation(features, requirements) {
        const reasons = [];
        const missing = [];
        const errors = [];
        let passScore = 0;
        let totalScore = 0;
        // Experience evaluation (30% weight)
        const experienceScore = this.evaluateExperience(features, requirements);
        passScore += experienceScore.score;
        totalScore += 30;
        if (experienceScore.pass) {
            reasons.push(`✓ ${features.totalExperience} years of experience`);
        }
        else {
            missing.push(`Requires ${requirements.minimumYearsOfExperience}+ years experience`);
        }
        // Skills evaluation (40% weight)
        const skillsScore = this.evaluateSkills(features, requirements);
        passScore += skillsScore.score;
        totalScore += 40;
        if (skillsScore.pass) {
            reasons.push(`✓ Has required technical skills`);
        }
        else {
            const missingSkills = requirements.requiredSkills.filter(skill => !features.candidateSkillNames.includes(skill.toLowerCase()));
            missing.push(`Missing required skills: ${missingSkills.join(', ')}`);
        }
        // Education evaluation (20% weight)
        const educationScore = this.evaluateEducation(features, requirements);
        passScore += educationScore.score;
        totalScore += 20;
        if (educationScore.pass) {
            reasons.push(`✓ Meets education requirements`);
        }
        else {
            missing.push(`Requires ${requirements.requiredEducation.minimumDegree} degree`);
        }
        // Certifications evaluation (10% weight)
        const certScore = this.evaluateCertifications(features, requirements);
        passScore += certScore.score;
        totalScore += 10;
        if (certScore.pass) {
            reasons.push(`✓ Has relevant certifications`);
        }
        else if (requirements.requiredCertifications && requirements.requiredCertifications.length > 0) {
            missing.push(`Missing required certifications`);
        }
        // Calculate confidence and final decision
        const confidence = totalScore > 0 ? (passScore / totalScore) : 0;
        const pass = confidence >= 0.7; // 70% threshold
        return {
            pass,
            confidence,
            reasons,
            missing,
            errors
        };
    }
    /**
     * Evaluate experience requirements
     */
    evaluateExperience(features, requirements) {
        const hasMinimumExperience = features.totalExperience >= requirements.minimumYearsOfExperience;
        const hasRelevantExperience = features.hasRelevantExperience;
        let score = 0;
        if (hasMinimumExperience)
            score += 20;
        if (hasRelevantExperience)
            score += 10;
        return {
            pass: hasMinimumExperience,
            score
        };
    }
    /**
     * Evaluate skills requirements
     */
    evaluateSkills(features, requirements) {
        const hasRequiredSkills = features.hasRequiredSkills;
        const skillMatchPercentage = features.skillMatch.percentage;
        let score = 0;
        if (hasRequiredSkills)
            score += 25;
        if (skillMatchPercentage >= 50)
            score += 15;
        return {
            pass: hasRequiredSkills,
            score
        };
    }
    /**
     * Evaluate education requirements
     */
    evaluateEducation(features, requirements) {
        const educationLevel = features.educationLevel;
        const hasRelevantEducation = features.hasRelevantEducation;
        const levelHierarchy = {
            'high_school': 1,
            'associate': 2,
            'bachelor': 3,
            'master': 4,
            'phd': 5
        };
        const requiredLevel = levelHierarchy[requirements.requiredEducation.minimumDegree] || 0;
        const candidateLevel = levelHierarchy[educationLevel] || 0;
        const meetsLevel = candidateLevel >= requiredLevel;
        let score = 0;
        if (meetsLevel)
            score += 15;
        if (hasRelevantEducation)
            score += 5;
        return {
            pass: meetsLevel,
            score
        };
    }
    /**
     * Evaluate certification requirements
     */
    evaluateCertifications(features, requirements) {
        const hasCertifications = features.hasCertifications;
        // If no certifications required, always pass
        if (!requirements.requiredCertifications || requirements.requiredCertifications.length === 0) {
            return { pass: true, score: 10 };
        }
        return {
            pass: hasCertifications,
            score: hasCertifications ? 10 : 0
        };
    }
    /**
     * Helper methods for feature extraction
     */
    hasValidContact(candidateData) {
        return candidateData.email.length > 0 && candidateData.phone.length > 0;
    }
    calculateTotalExperience(workExperience) {
        const totalMonths = workExperience.reduce((total, exp) => {
            return total + exp.duration;
        }, 0);
        return Math.round(totalMonths / 12);
    }
    hasRelevantExperience(workExperience) {
        const relevantKeywords = [
            'software', 'developer', 'engineer', 'programmer', 'coding',
            'web', 'application', 'system', 'database', 'frontend', 'backend'
        ];
        return workExperience.some(exp => {
            const title = exp.title.toLowerCase();
            const description = exp.description?.toLowerCase() || '';
            return relevantKeywords.some(keyword => title.includes(keyword) || description.includes(keyword));
        });
    }
    analyzeSkillMatch(skills) {
        const allSkills = [
            'JavaScript', 'Python', 'Java', 'C++', 'React', 'Angular', 'Vue', 'Node.js',
            'SQL', 'MongoDB', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Linux',
            'HTML', 'CSS', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin'
        ];
        const candidateSkillNames = skills.map(skill => skill.name.toLowerCase());
        const matchedSkills = allSkills.filter(skill => candidateSkillNames.includes(skill.toLowerCase()));
        return {
            matched: matchedSkills,
            percentage: Math.round((matchedSkills.length / allSkills.length) * 100)
        };
    }
    hasRequiredSkills(skills) {
        const requiredSkills = [
            'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL',
            'Git', 'HTML', 'CSS', 'TypeScript', 'AWS', 'Docker'
        ];
        const candidateSkillNames = skills.map(skill => skill.name.toLowerCase());
        return requiredSkills.some(skill => candidateSkillNames.includes(skill.toLowerCase()));
    }
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
    hasRelevantEducation(education) {
        const relevantFields = [
            'computer science', 'software engineering', 'information technology',
            'data science', 'engineering', 'mathematics', 'physics'
        ];
        return education.some(edu => {
            const field = edu.field?.toLowerCase() || '';
            return relevantFields.some(relevant => field.includes(relevant));
        });
    }
    calculateCompleteness(candidateData) {
        let score = 0;
        const maxScore = 100;
        // Basic info (20 points)
        if (candidateData.fullName !== 'Unknown')
            score += 10;
        if (candidateData.email)
            score += 5;
        if (candidateData.phone)
            score += 5;
        // Experience (30 points)
        if (candidateData.workExperience.length > 0)
            score += 30;
        // Education (20 points)
        if (candidateData.education.length > 0)
            score += 20;
        // Skills (20 points)
        if (candidateData.skills.length > 0)
            score += 20;
        // Certifications (10 points)
        if (candidateData.certifications.length > 0)
            score += 10;
        return Math.min(score, maxScore);
    }
    /**
     * Generate detailed evaluation report
     */
    generateDetailedReport(candidateData, jobRequirements) {
        const features = this.extractEvaluationFeatures(candidateData);
        const evaluation = this.performEvaluation(features, jobRequirements);
        return {
            candidate: {
                name: candidateData.fullName,
                email: candidateData.email,
                phone: candidateData.phone,
                totalExperience: features.totalExperience,
                educationLevel: features.educationLevel,
                skillCount: candidateData.skills.length,
                certificationCount: candidateData.certifications.length
            },
            evaluation: {
                result: evaluation.pass ? 'PASS' : 'FAIL',
                confidence: Math.round(evaluation.confidence * 100),
                reasons: evaluation.reasons,
                missing: evaluation.missing,
                score: Math.round(evaluation.confidence * 100)
            },
            requirements: {
                minimumExperience: jobRequirements.minimumYearsOfExperience,
                requiredSkills: jobRequirements.requiredSkills,
                preferredSkills: jobRequirements.preferredSkills,
                minimumEducation: jobRequirements.requiredEducation.minimumDegree,
                requiredCertifications: jobRequirements.requiredCertifications || []
            },
            features: features
        };
    }
}
exports.ResumeEvaluator = ResumeEvaluator;
//# sourceMappingURL=ResumeEvaluator.js.map