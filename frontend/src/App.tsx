import React, { useState } from 'react'
import ResumeScreener from './components/ResumeScreener'

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>R1 Agent</h1>
        <p>Intelligent Resume Screening Agent</p>
      </header>
      
      <ResumeScreener />
    </div>
  )
}

export default App 