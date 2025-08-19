import React from 'react'
import EnhancedResumeScreener from './components/EnhancedResumeScreener'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>R1 - Intelligent Resume Screening Agent</h1>
        <p>AI-powered resume screening with Excel job descriptions and chatbot Q&A</p>
      </header>
      
      <main>
        <EnhancedResumeScreener />
      </main>
      
      <footer className="app-footer">
        <p>R1 Agent - Part of the AI-based recruitment automation pipeline</p>
      </footer>
    </div>
  )
}

export default App 