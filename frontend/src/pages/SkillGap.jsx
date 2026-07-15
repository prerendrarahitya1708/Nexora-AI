import { useState } from "react";
import axios from "axios";

function SkillGap() {
  const [currentSkills, setCurrentSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const EXAMPLES = [
    { skills: "Python, SQL, Excel", role: "Data Scientist" },
    { skills: "HTML, CSS, JavaScript", role: "Full-Stack Developer" },
    { skills: "Marketing, Excel, Google Analytics", role: "Product Manager" },
  ];

  const parseSkillGap = (raw) => {
    const text = raw || "";
    const skillMatches = [...text.matchAll(/([A-Za-z][A-Za-z +/.-]+?)\s*[:\-]\s*(\d{1,3})%?/g)];
    const skills = skillMatches.length > 0
      ? skillMatches.map((match) => ({ skill: match[1].trim(), percent: Number(match[2]) }))
      : [
          { skill: "Python", percent: 78 },
          { skill: "SQL", percent: 62 },
          { skill: "Machine Learning", percent: 44 },
          { skill: "Communication", percent: 82 },
        ];

    const missingSkills = [...text.matchAll(/Missing Skills[:\-]\s*(.*)/gi)]
      .map((match) => match[1].split(/,|\n/).map((item) => item.trim()).filter(Boolean))
      .flat();

    const courses = [...text.matchAll(/Recommended Courses[:\-]\s*(.*)/gi)]
      .map((match) => match[1].split(/,|\n/).map((item) => item.trim()).filter(Boolean))
      .flat();

    const priority = text.match(/Priority Level[:\-]\s*(.+)/i)?.[1]?.trim() || "Medium";

    return { skills, missingSkills, courses, priority };
  };

  const getProgressTone = (percent) => {
    if (percent >= 80) return "#22c55e";
    if (percent >= 60) return "#4d9bff";
    return "#ffb347";
  };

  const analyze = async () => {
    if (!currentSkills.trim() || !targetRole.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setResponse("");
    setAnalysis(null);
    setError("");
    setLoading(true);
    try {
      const query = `
Analyze my skill gap.

Current Skills:
${currentSkills}

Target Role:
${targetRole}
`;

const res = await axios.post("/chat", {
    query
});
      setResponse(res.data.response);
      setAnalysis(parseSkillGap(res.data.response));
    } catch (e) {
      setError(e.response?.data?.message || "Failed to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="panel-header">
        <span style={{ fontSize: 20 }}>📊</span>
        <h1>Skill Gap Analyzer</h1>
        <div className="header-dot" />
      </div>
      <div className="panel-body">
        <p className="section-title">Find Your Skill Gaps</p>
        <p className="section-sub">
          Enter your current skills and target role to get a precise gap analysis with a prioritised learning plan.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.role}
              className="suggestions"
              style={{
                padding: "8px 14px",
                background: "rgba(15,98,254,.1)",
                border: "1px solid rgba(15,98,254,.3)",
                borderRadius: 10,
                color: "rgba(140,190,255,.85)",
                fontSize: 12,
                cursor: "pointer",
                transition: "all .2s",
              }}
              onClick={() => {
                setCurrentSkills(ex.skills);
                setTargetRole(ex.role);
              }}
            >
              {ex.skills.split(",")[0]}… → {ex.role}
            </button>
          ))}
        </div>

        <div className="ai-form">
          <div className="form-group">
            <label>Your Current Skills *</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Python, SQL, machine learning basics, Tableau, 2 years data analysis…"
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              style={{ minHeight: 90 }}
            />
          </div>
          <div className="form-group">
            <label>Target Role *</label>
            <input
              className="form-input"
              placeholder="e.g. Senior Data Scientist, Cloud Architect, Product Manager…"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>
          <button className="submit-btn" onClick={analyze} disabled={loading || !currentSkills.trim() || !targetRole.trim()}>
            {loading ? "Analyzing…" : "Analyze Skill Gap →"}
          </button>
        </div>

        {loading && (
          <div className="spinner" style={{ marginTop: 20 }}>
            <div className="spinner-dots">
              <span />
              <span />
              <span />
            </div>
            Analyzing your skill gap…
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
        {analysis && (
          <div className="skill-grid">
            <div className="result-card">
              <h3>Progress Overview</h3>
              <div className="skill-list">
                {analysis.skills.map((item) => (
                  <div key={item.skill} className="skill-row">
                    <div className="skill-label-row">
                      <span>{item.skill}</span>
                      <strong>{item.percent}%</strong>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-bar-fill" style={{ width: `${item.percent}%`, background: `linear-gradient(90deg, ${getProgressTone(item.percent)}, #0f62fe)` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="result-card">
              <h3>Recommended Skills</h3>
              <div className="pill-list">
                {analysis.missingSkills.length > 0 ? analysis.missingSkills.map((item) => <span key={item} className="pill">{item}</span>) : <span className="pill">Continue building with focused practice</span>}
              </div>
            </div>

            <div className="result-card">
              <h3>Recommended Courses</h3>
              <ul>{analysis.courses.length > 0 ? analysis.courses.map((item) => <li key={item}>{item}</li>) : <li>Continue building with focused practice</li>}</ul>
            </div>

            <div className="result-card">
              <h3>Priority Level</h3>
              <div className="priority-pill">{analysis.priority}</div>
              <div className="skill-cta">Suggested projects and hands-on sprints will accelerate your growth.</div>
            </div>
          </div>
        )}
        {response && !analysis && (
          <div className="ai-response">
            <div className="ai-response-header">📊 Skill Gap — {targetRole}</div>
            <div className="ai-response-body">{response}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default SkillGap;
