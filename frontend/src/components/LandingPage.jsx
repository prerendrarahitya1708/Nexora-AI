export default function LandingPage({ onGetStarted }) {
  return (
    <div className="landing-page">

      {/* Background Effects */}
      <div className="scan-line"></div>

      <div className="particle p1"></div>
      <div className="particle p2"></div>
      <div className="particle p3"></div>
      <div className="particle p4"></div>
      <div className="particle p5"></div>
      <div className="particle p6"></div>

      {/* AI Core */}

      <div className="landing-center">

        <div className="ai-core">

          <div className="ring ring1"></div>
          <div className="ring ring2"></div>
          <div className="ring ring3"></div>

          <div className="core">
            AI
          </div>

        </div>

        <h1>NEXORA AI</h1>

        <h3>Your Intelligent Career Companion</h3>

        <p className="landing-description">
          AI Powered Career Guidance using Multiple Intelligent Agents.
          Analyze resumes, identify skill gaps, generate personalized
          learning roadmaps and prepare for interviews with one
          intelligent platform.
        </p>

        <div className="boot-console">

          <div className="console-line success">
            ✓ Career Advisor Agent Loaded
          </div>

          <div className="console-line success">
            ✓ Resume Analyzer Agent Loaded
          </div>

          <div className="console-line success">
            ✓ Skill Gap Analyzer Loaded
          </div>

          <div className="console-line success">
            ✓ Learning Roadmap Loaded
          </div>

          <div className="console-line success">
            ✓ Interview Coach Loaded
          </div>

          <div className="console-line ready">
            SYSTEM STATUS : ONLINE
          </div>

        </div>

        <button
          className="submit-btn"
          onClick={onGetStarted}
        >
          GO TO NEXORA →
        </button>

      </div>

    </div>
  );
}