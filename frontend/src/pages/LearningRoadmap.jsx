import { useState } from "react";
import axios from "axios";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const WEEK_OPTIONS = [4, 8, 12, 16, 24];

function LearningRoadmap() {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [weeks, setWeeks] = useState(12);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const QUICK_GOALS = [
    "Learn Python for data science",
    "Become a full-stack web developer",
    "Master machine learning fundamentals",
    "Learn cloud computing with AWS",
    "Transition into product management",
  ];

  const parseRoadmap = (raw) => {
    const lines = (raw || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    const milestones = [];
    lines.forEach((line) => {
      const normalized = line.replace(/^[*-•\d.]+\s*/, "").trim();
      if (/week\s*\d+/i.test(normalized)) {
        milestones.push({ title: normalized, icon: "📅" });
      } else if (/project/i.test(normalized)) {
        milestones.push({ title: normalized, icon: "🛠️" });
      } else if (/interview/i.test(normalized)) {
        milestones.push({ title: normalized, icon: "🎤" });
      } else if (/job|ready/i.test(normalized)) {
        milestones.push({ title: normalized, icon: "🚀" });
      }
    });

    if (milestones.length === 0) {
      return [
        { title: "Week 1 — Foundation and fundamentals", icon: "📅" },
        { title: "Week 2 — Practice and guided projects", icon: "📅" },
        { title: "Week 3 — Portfolio and confidence building", icon: "📅" },
        { title: "Projects — Build hands-on examples", icon: "🛠️" },
        { title: "Interview Preparation — Mock interviews and resume polish", icon: "🎤" },
        { title: "Job Ready — Apply and keep improving", icon: "🚀" },
      ];
    }

    return milestones;
  };

  const generate = async (overrideGoal) => {
    const g = (overrideGoal || goal).trim();
    if (!g) {
      setError("Please enter a learning goal.");
      return;
    }
    setGoal(g);
    setResponse("");
    setError("");
    setLoading(true);
    try {
      const query = `
Create a ${weeks}-week learning roadmap.

Goal:
${g}

Current Level:
${level}
`;

const res = await axios.post("/chat", {
    query
});
      setResponse(res.data.response);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const milestones = parseRoadmap(response);
  const milestoneStates = milestones.map((_, index) => ({
    status: index < Math.min(3, milestones.length) ? "completed" : index === Math.min(3, milestones.length) ? "active" : "locked",
  }));

  return (
    <>
      <div className="panel-header">
        <span style={{ fontSize: 20 }}>🗺️</span>
        <h1>Learning Roadmap</h1>
        <div className="header-dot" />
      </div>
      <div className="panel-body">
        <p className="section-title">Build Your Learning Path</p>
        <p className="section-sub">
          Get a personalised, week-by-week roadmap with resources, projects and milestones.
        </p>

        <div className="suggestions" style={{ justifyContent: "flex-start", marginBottom: 20 }}>
          {QUICK_GOALS.map((g) => (
            <button key={g} onClick={() => generate(g)}>
              {g.split(" ").slice(0, 4).join(" ")}…
            </button>
          ))}
        </div>

        <div className="ai-form">
          <div className="form-group">
            <label>Learning Goal *</label>
            <input
              className="form-input"
              placeholder="e.g. Learn Python for data science, Become a DevOps engineer…"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label>Current Level</label>
              <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Timeframe (weeks)</label>
              <select className="form-select" value={weeks} onChange={(e) => setWeeks(Number(e.target.value))}>
                {WEEK_OPTIONS.map((w) => (
                  <option key={w} value={w}>{w} weeks</option>
                ))}
              </select>
            </div>
          </div>

          <button className="submit-btn" onClick={() => generate()} disabled={loading || !goal.trim()}>
            {loading ? "Building…" : "Generate Roadmap →"}
          </button>
        </div>

        {loading && (
          <div className="spinner" style={{ marginTop: 20 }}>
            <div className="spinner-dots">
              <span />
              <span />
              <span />
            </div>
            Building your personalised roadmap…
          </div>
        )}
        {error && (
          <div className="ai-response" style={{ marginTop: 20 }}>
            <div className="ai-response-header" style={{ color: "#ff6b6b" }}>
              ⚠ Error
            </div>
            <div className="ai-response-body" style={{ color: "#ff9999" }}>
              {error}
            </div>
          </div>
        )}
        {response && (
          <div className="timeline-card">
            <div className="ai-response-header">🗺️ Your Learning Roadmap — {goal}</div>
            <div className="timeline-wrapper">
              {milestones.map((milestone, index) => {
                const state = milestoneStates[index]?.status || "locked";
                return (
                  <div key={`${milestone.title}-${index}`} className={`timeline-item ${state}`}>
                    <div className="timeline-icon">{milestone.icon}</div>
                    <div className="timeline-content">
                      <h4>{milestone.title}</h4>
                      <p>{state === "completed" ? "Completed milestone" : state === "active" ? "Current focus" : "Unlock after prior milestones"}</p>
                    </div>
                    {index < milestones.length - 1 && <div className="timeline-arrow">↳</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LearningRoadmap;
