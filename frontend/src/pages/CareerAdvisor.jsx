import { useState } from "react";
import axios from "axios";

const QUICK = [
  "What career path suits a software engineer with 3 years experience?",
  "How do I transition from finance to data science?",
  "What skills are most in demand in AI/ML right now?",
  "How do I negotiate a higher salary?",
  "What certifications help advance a cloud computing career?",
];

function CareerAdvisor() {
  const [query, setQuery]     = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const ask = async (q) => {
    const text = (q || query).trim();
    if (!text) return;
    setQuery(text);
    setResponse(""); setError(""); setLoading(true);
    try {
      const res = await axios.post("/chat", {
    query: text
});
      setResponse(res.data.response);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to connect to backend.");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="panel-header">
        <span style={{ fontSize: 20 }}>🚀</span>
        <h1>Career Advisor</h1>
        <div className="header-dot" />
      </div>

      <div className="panel-body">
        <p className="section-title">Get Expert Career Guidance</p>
        <p className="section-sub">
          Ask anything about career paths, skill development, job transitions,
          salary negotiation, or industry trends.
        </p>

        {/* Quick prompts */}
        <div className="suggestions" style={{ justifyContent: "flex-start", marginBottom: 20 }}>
          {QUICK.map((q) => (
            <button key={q} onClick={() => ask(q)}>{q.split(" ").slice(0, 5).join(" ")}…</button>
          ))}
        </div>

        {/* Input */}
        <div className="ai-form">
          <div className="form-group">
            <label>Your question</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. I have 2 years of experience in marketing. How do I move into product management?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }}
              style={{ minHeight: 80 }}
            />
          </div>
          <button
            className="submit-btn"
            onClick={() => ask()}
            disabled={loading || !query.trim()}
          >
            {loading ? "Thinking…" : "Ask Career Advisor →"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="spinner" style={{ marginTop: 20 }}>
            <div className="spinner-dots">
              <span /><span /><span />
            </div>
            Nexora AI is thinking…
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="ai-response" style={{ marginTop: 20 }}>
            <div className="ai-response-header" style={{ color: "#ff6b6b" }}>⚠ Error</div>
            <div className="ai-response-body" style={{ color: "#ff9999" }}>{error}</div>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="ai-response">
            <div className="ai-response-header">
              🤖 Career Advisor Response
            </div>
            <div className="ai-response-body">{response}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default CareerAdvisor;
