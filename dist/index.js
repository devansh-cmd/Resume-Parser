"use strict";
/**
 * R1 Agent - Resume Screening Agent
 * Main entry point for the intelligent resume screening system
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeEvaluator = exports.FeatureExtractor = exports.parseResume = exports.screenResume = exports.createR1Agent = exports.R1Agent = void 0;
var R1Agent_1 = require("./R1Agent");
Object.defineProperty(exports, "R1Agent", { enumerable: true, get: function () { return R1Agent_1.R1Agent; } });
Object.defineProperty(exports, "createR1Agent", { enumerable: true, get: function () { return R1Agent_1.createR1Agent; } });
Object.defineProperty(exports, "screenResume", { enumerable: true, get: function () { return R1Agent_1.screenResume; } });
var ResumeParser_1 = require("./parsers/ResumeParser");
Object.defineProperty(exports, "parseResume", { enumerable: true, get: function () { return ResumeParser_1.parseResume; } });
var FeatureExtractor_1 = require("./extractors/FeatureExtractor");
Object.defineProperty(exports, "FeatureExtractor", { enumerable: true, get: function () { return FeatureExtractor_1.FeatureExtractor; } });
var ResumeEvaluator_1 = require("./evaluators/ResumeEvaluator");
Object.defineProperty(exports, "ResumeEvaluator", { enumerable: true, get: function () { return ResumeEvaluator_1.ResumeEvaluator; } });
// Export all types
__exportStar(require("./types"), exports);
/**
 * Example usage of R1 Agent
 */
async function exampleUsage() {
    const { R1Agent } = await Promise.resolve().then(() => __importStar(require('./R1Agent')));
    const agent = new R1Agent();
    // Example job requirements
    const jobRequirements = {
        minimumYearsOfExperience: 3,
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
        preferredSkills: ['TypeScript', 'AWS', 'Docker', 'MongoDB'],
        requiredEducation: {
            minimumDegree: 'bachelor',
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
        const rawResult = await agent.runR1({ type: 'raw', content: rawResumeText }, jobRequirements);
        console.log('Raw Resume Result:', JSON.stringify(rawResult, null, 2));
        // Test with structured resume
        console.log('\n=== Testing Structured Resume ===');
        const structuredResult = await agent.runR1({ type: 'structured', content: structuredResume }, jobRequirements);
        console.log('Structured Resume Result:', JSON.stringify(structuredResult, null, 2));
        // Generate detailed report
        console.log('\n=== Detailed Report ===');
        const detailedReport = await agent.generateDetailedReport({ type: 'structured', content: structuredResume }, jobRequirements);
        console.log('Detailed Report:', JSON.stringify(detailedReport, null, 2));
    }
    catch (error) {
        console.error('Error in example usage:', error);
    }
}
// Example usage can be called directly
// exampleUsage().catch(console.error); 
//# sourceMappingURL=index.js.map