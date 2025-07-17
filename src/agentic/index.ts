import { AgenticR1Agent } from './AgenticR1Agent'
import { ResumeInput, JobRequirements } from '../types'

/**
 * Agentic R1 Agent - Main Entry Point
 * 
 * This demonstrates the autonomous, agentic capabilities of the R1 agent
 * including reasoning chains, multi-scenario analysis, and learning.
 */

async function demonstrateAgenticCapabilities() {
  console.log('🤖 Initializing Agentic R1 Agent...')
  
  const agent = new AgenticR1Agent()
  
  // Example job requirements
  const jobRequirements: JobRequirements = {
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

  // Example raw resume
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
      - Developed React applications with TypeScript
      - Built scalable Node.js backend services
      - Worked with SQL and MongoDB databases
      - Implemented CI/CD pipelines with Docker
      
      Software Developer
      StartupXYZ, 2019-2021
      - Built web applications with JavaScript and React
      - Implemented REST APIs and microservices
      - Collaborated with cross-functional teams
      
      SKILLS
      JavaScript, TypeScript, React, Node.js, SQL, MongoDB, AWS, Docker, Git, HTML, CSS
    `
  }

  // Example structured resume
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
          technologies: ['React', 'Node.js', 'MongoDB', 'TypeScript']
        }
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
      certifications: [
        {
          name: 'AWS Certified Developer',
          issuingOrganization: 'Amazon Web Services',
          issueDate: '2022'
        }
      ]
    }
  }

  try {
    console.log('\n🔍 Testing Agentic Screening with Raw Resume...')
    const rawResult = await agent.agenticScreenResume(rawResumeInput, jobRequirements)
    
    console.log('\n📊 Raw Resume Agentic Results:')
    console.log('Screening Result:', rawResult.screeningResult)
    console.log('Confidence Score:', Math.round(rawResult.confidenceScore * 100) + '%')
    console.log('Match Reasons:', rawResult.matchReasons)
    console.log('Uncertainty Factors:', rawResult.uncertaintyFactors)
    console.log('Recommendation:', rawResult.recommendation)
    console.log('Learning Outcome:', rawResult.learningOutcome)
    console.log('Next Actions:', rawResult.nextActions)
    
    console.log('\n🧠 Agent Reasoning Chain:')
    rawResult.agentReasoning.forEach((reasoning, index) => {
      console.log(`${index + 1}. ${reasoning.reasoning}`)
      console.log(`   Evidence: ${reasoning.evidence.join(', ')}`)
      console.log(`   Confidence: ${Math.round(reasoning.confidence * 100)}%`)
    })

    console.log('\n📈 Alternative Scenarios:')
    rawResult.alternativeScenarios.forEach(scenario => {
      console.log(`- ${scenario.scenario}: ${scenario.outcome} (${Math.round(scenario.probability * 100)}% probability)`)
      console.log(`  Reasoning: ${scenario.reasoning}`)
    })

    console.log('\n🔍 Testing Agentic Screening with Structured Resume...')
    const structuredResult = await agent.agenticScreenResume(structuredResumeInput, jobRequirements)
    
    console.log('\n📊 Structured Resume Agentic Results:')
    console.log('Screening Result:', structuredResult.screeningResult)
    console.log('Confidence Score:', Math.round(structuredResult.confidenceScore * 100) + '%')
    console.log('Match Reasons:', structuredResult.matchReasons)
    console.log('Uncertainty Factors:', structuredResult.uncertaintyFactors)
    console.log('Recommendation:', structuredResult.recommendation)
    console.log('Learning Outcome:', structuredResult.learningOutcome)
    console.log('Next Actions:', structuredResult.nextActions)

    console.log('\n🧠 Agent Reasoning Chain:')
    structuredResult.agentReasoning.forEach((reasoning, index) => {
      console.log(`${index + 1}. ${reasoning.reasoning}`)
      console.log(`   Evidence: ${reasoning.evidence.join(', ')}`)
      console.log(`   Confidence: ${Math.round(reasoning.confidence * 100)}%`)
    })

    console.log('\n📈 Alternative Scenarios:')
    structuredResult.alternativeScenarios.forEach(scenario => {
      console.log(`- ${scenario.scenario}: ${scenario.outcome} (${Math.round(scenario.probability * 100)}% probability)`)
      console.log(`  Reasoning: ${scenario.reasoning}`)
    })

    // Display agent state and capabilities
    console.log('\n🤖 Agent State Summary:')
    const agentState = agent.getAgentState()
    console.log('Current Task:', agentState.currentTask)
    console.log('Iteration:', agentState.iteration)
    console.log('Confidence:', Math.round(agentState.confidence * 100) + '%')
    console.log('Decisions Made:', agentState.decisions.length)
    console.log('Reasoning Steps:', agentState.reasoning.length)

    console.log('\n⚡ Agent Capabilities:')
    const capabilities = agent.getCapabilities()
    Object.entries(capabilities).forEach(([capability, enabled]) => {
      console.log(`${enabled ? '✅' : '❌'} ${capability}: ${enabled}`)
    })

    console.log('\n🎯 Agentic Features Demonstrated:')
    console.log('✅ Autonomous content analysis and parsing strategy selection')
    console.log('✅ Multi-scenario evaluation with probability weighting')
    console.log('✅ Uncertainty detection and handling')
    console.log('✅ Confidence calibration based on historical performance')
    console.log('✅ Learning application from previous screenings')
    console.log('✅ Transparent reasoning chains for explainability')
    console.log('✅ Contextual feature extraction and evaluation')
    console.log('✅ Alternative scenario analysis for robust decisions')

  } catch (error) {
    console.error('❌ Agentic screening failed:', error)
  }
}

// Run the demonstration if this file is executed directly
if (require.main === module) {
  demonstrateAgenticCapabilities().catch(console.error)
}

export { AgenticR1Agent, demonstrateAgenticCapabilities } 