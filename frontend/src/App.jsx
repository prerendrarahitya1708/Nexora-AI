import { Suspense, lazy, useEffect, useState } from "react";
import "./App.css";

import LandingPage from "./components/LandingPage";
import FloatingAssistant from "./components/FloatingAssistant";

const CareerAdvisor = lazy(() => import("./pages/CareerAdvisor"));
const ResumeAnalyzer = lazy(() => import("./pages/ResumeAnalyzer"));
const SkillGap = lazy(() => import("./pages/SkillGap"));
const LearningRoadmap = lazy(() => import("./pages/LearningRoadmap"));
const InterviewCoach = lazy(() => import("./pages/InterviewCoach"));

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <h2>Preparing Nexora AI...</h2>
    </div>
  );
}

const TABS = [
  { id: "career", label: "Career Advisor", icon: "🚀" },
  { id: "resume", label: "Resume Analyzer", icon: "📄" },
  { id: "skills", label: "Skill Gap", icon: "📊" },
  { id: "roadmap", label: "Learning Roadmap", icon: "🗺️" },
  { id: "interview", label: "Interview Coach", icon: "🎤" },
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [booting, setBooting] = useState(false);
  const [activeTab, setActiveTab] = useState("career");

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }, []);

  const handleStart = () => {
    setBooting(true);

    setTimeout(() => {
      setBooting(false);
      setStarted(true);
    }, 2000);
  };

  if (!started && !booting) {
    return <LandingPage onGetStarted={handleStart} />;
  }

  if (booting) {
    return (
      <div className="boot-screen">
        <div className="boot-logo">🤖</div>

        <h1>NEXORA AI</h1>

        <p>Initializing Intelligent Agents...</p>

        <div className="boot-loader">
          <div className="boot-fill"></div>
        </div>

        <div className="boot-status">Career Advisor Loaded</div>
        <div className="boot-status">Resume Analyzer Loaded</div>
        <div className="boot-status">Skill Gap Analyzer Loaded</div>
        <div className="boot-status">Learning Roadmap Loaded</div>
        <div className="boot-status">Interview Coach Loaded</div>
      </div>
    );
  }

  return (
    <div className="app-scene">
      <div className="app-shell">

        <aside className="sidebar">

          <div className="sidebar-logo">
            <h2>NEXORA <span className="logo-ai">AI</span></h2>
          </div>

          <nav className="sidebar-nav">

            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`nav-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}

          </nav>

          <div className="sidebar-footer">
            <div className="status-dot"></div>
            AI Online
          </div>

        </aside>

        <main className="main-panel">

          <Suspense fallback={<LoadingScreen />}>

            {activeTab === "career" && <CareerAdvisor />}

            {activeTab === "resume" && <ResumeAnalyzer />}

            {activeTab === "skills" && <SkillGap />}

            {activeTab === "roadmap" && <LearningRoadmap />}

            {activeTab === "interview" && <InterviewCoach />}

          </Suspense>

        </main>

      </div>

      <FloatingAssistant mode="idle" />

    </div>
  );
}