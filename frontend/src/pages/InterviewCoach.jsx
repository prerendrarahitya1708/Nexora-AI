import { useState } from "react";
import axios from "axios";

const EXPERIENCE_LEVELS = ["Entry-level", "Mid-level", "Senior", "Lead / Principal"];

function InterviewCoach() {
  const [role, setRole] = useState("");
  const [experience, setExp] = useState("Mid-level");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("generate");
  const [insight, setInsight] = useState(null);

  const submit = async () => {
    if (!role.trim()) {
      setError("Please enter a role.");
      return;
    }
    if (mode === "evaluate" && (!question.trim() || !answer.trim())) {
      setError("Please enter both question and your answer.");
      return;
    }

    setResponse("");
    setError("");
    setInsight(null);
    setLoading(true);

    try {
      const body = mode === "evaluate"
        ? { role, experience, question, answer }
        : { role, experience };
      const res = await axios.post("/interview", body);
      setResponse(res.data.response);
      if (mode === "evaluate") {
        setInsight({
          title: "Coaching focus",
          points: [
            "Lead with impact by opening with a clear outcome.",
            "Use metrics and examples to make your answer tangible.",
            "Close by explaining why the experience matters for the role."
          ]
        });
      }
    } catch (e) {
      setError(e.response?.data?.message || "Failed to connect to backend.");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="panel-header">
        <span style={{ fontSize: 20 }}>🎤</span>
        <h1>Interview Coach</h1>
        <div className="header-dot" />
      </div>
      <div className="panel-body">
        <p className="section-title">Ace Your Next Interview</p>
        <p className="section-sub">
          Generate tailored interview questions or get instant feedback on your answers.
        </p>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          {["generate", "evaluate"].map((m) => (
            <button
              key={m}
              className={`nav-btn ${mode === m ? "active" : ""}`}
              style={{ flex: 1, justifyContent: "center", borderRadius: 12, padding: "10px" }}
              onClick={() => { setMode(m); setResponse(""); setError(""); }}
            >
              {m === "generate" ? "🎯 Generate Questions" : "✅ Evaluate My Answer"}
            </button>
          ))}
        </div>

        <div className="ai-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label>Target Role *</label>
              <input className="form-input" placeholder="e.g. Backend Engineer, Data Analyst…"
                value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Experience Level</label>
              <select className="form-select" value={experience}
                onChange={(e) => setExp(e.target.value)}>
                {EXPERIENCE_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {mode === "evaluate" && (
            <>
              <div className="form-group">
                <label>Interview Question</label>
                <input className="form-input" placeholder="Paste the interview question here…"
                  value={question} onChange={(e) => setQuestion(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Your Answer</label>
                <textarea className="form-textarea" placeholder="Type your answer…"
                  value={answer} onChange={(e) => setAnswer(e.target.value)}
                  style={{ minHeight: 100 }} />
              </div>
            </>
          )}

          <button className="submit-btn" onClick={submit} disabled={loading || !role.trim()}>
            {loading ? "Working…" : mode === "generate" ? "Generate Questions →" : "Evaluate Answer →"}
          </button>
        </div>

        {loading && (
          <div className="spinner" style={{ marginTop: 20 }}>
            <div className="spinner-dots"><span /><span /><span /></div>
            {mode === "generate" ? "Generating interview questions…" : "Evaluating your answer…"}
          </div>
        )}
        {error && (
          <div className="ai-response" style={{ marginTop: 20 }}>
            <div className="ai-response-header" style={{ color: "#ff6b6b" }}>⚠ Error</div>
            <div className="ai-response-body" style={{ color: "#ff9999" }}>{error}</div>
          </div>
        )}
        {response && (
          <div className="ai-response">
            <div className="ai-response-header">
              🤖 {mode === "generate" ? "Interview Questions" : "Answer Evaluation"} — {role}
            </div>
            <div className="ai-response-body">{response}</div>
          </div>
        )}
        {insight && (
          <div className="score-grid" style={{ marginTop: 16 }}>
            <div className="score-card">
              <div className="score-label">Confidence</div>
              <div className="score-value">84%</div>
            </div>
            <div className="score-card">
              <div className="score-label">Technical</div>
              <div className="score-value">79%</div>
            </div>
            <div className="score-card">
              <div className="score-label">Communication</div>
              <div className="score-value">88%</div>
            </div>
            <div className="summary-card">
              <div className="summary-title">{insight.title}</div>
              <ul>
                {insight.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default InterviewCoach;
