import { useState, useRef, useEffect } from "react";
import axios from "axios";

function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [response, setResponse] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const resumeInputRef = useRef(null);

  useEffect(() => {
    if (!loading) return;
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 8;
      });
    }, 600);
    return () => window.clearInterval(interval);
  }, [loading]);

  const handleResumeFile = (file) => {
    if (!file) return;
    const allowed = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|txt|doc|docx)$/i)) {
      setError("Please upload a PDF, TXT, DOC, or DOCX file.");
      return;
    }
    setResumeFile(file);
    setError("");
  };

  const handlePhotoPick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoURL(URL.createObjectURL(file));
  };

  const parseResumeAnalysis = (raw) => {
    const text = raw || "";
    const scoreMatch = text.match(/score[^\d]*(\d{1,3})(?:\/10|\/100)?/i) || text.match(/overall[^\d]*(\d{1,3})/i);
    const score = scoreMatch ? Number(scoreMatch[1]) : null;

    const extractSection = (heading) => {
      const pattern = new RegExp(`\\*\\*${heading}\\*\\*\\s*[:\-]?\\s*(.*)`, "i");
      const match = text.match(pattern);
      if (!match) return [];
      const body = match[1] || "";
      return body
        .split(/\n|\r/)
        .map((line) => line.replace(/^[-*•\d.]+\s*/, "").trim())
        .filter(Boolean);
    };

    return {
      score,
      strengths: extractSection("Strengths"),
      weaknesses: extractSection("Areas to Improve") || extractSection("Weaknesses"),
      missingSkills: extractSection("ATS Keywords Missing") || extractSection("Missing Skills"),
      improvements: extractSection("Actionable Suggestions"),
      roles: text.match(/([A-Z][A-Za-z &/.-]+(?:Manager|Developer|Engineer|Analyst|Designer|Scientist|Architect|Specialist))/g) || [],
    };
  };

  const analyze = async () => {
    if (!resumeFile) {
      setError("Please upload a PDF, DOCX, or TXT file before requesting an AI analysis.");
      setProgress(0);
      setProgressLabel("");
      return;
    }

    setResponse("");
    setAnalysis(null);
    setError("");
    setLoading(true);
    setProgress(12);
    setProgressLabel("Uploading resume…");

    try {
      const form = new FormData();
      form.append("file", resumeFile);
      if (targetRole) form.append("target_role", targetRole);

      setProgress(30);
      setProgressLabel("Extracting resume text…");

      const res = await axios.post("/resume", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProgress(80);
      setProgressLabel("Generating analysis…");
      setResponse(res.data.response);
      setAnalysis(parseResumeAnalysis(res.data.response));
      setProgress(100);
      setProgressLabel("Analysis completed");
    } catch (e) {
      setError(e.response?.data?.message || "Failed to connect to the backend.");
      setProgress(0);
      setProgressLabel("");
    } finally {
      window.setTimeout(() => setLoading(false), 350);
    }
  };

  return (
    <>
      <div className="panel-header">
        <span style={{ fontSize: 20 }}>📄</span>
        <h1>Resume Analyzer</h1>
        <div className="header-dot" />
      </div>

      <div className="panel-body">
        <p className="section-title">AI-Powered Resume Review</p>
        <p className="section-sub">
          Upload your resume and receive a professional review with score, strengths, weaknesses,
          ATS alignment, and recommended next steps.
        </p>

        <div className="ai-form">
          <div className="form-group">
            <label>Profile Photo (optional)</label>
            <div className="photo-zone">
              {photoURL ? (
                <img src={photoURL} alt="profile" className="photo-preview" />
              ) : (
                <div className="photo-placeholder">👤</div>
              )}
              <div>
                <label className="photo-upload-btn">
                  {photoURL ? "Change Photo" : "Upload Photo"}
                  <input type="file" accept="image/*" onChange={handlePhotoPick} />
                </label>
                {photoFile && <div className="upload-file-name">✓ {photoFile.name}</div>}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Resume File *</label>
            <div
              className={`upload-zone ${dragOver ? "drag-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleResumeFile(e.dataTransfer.files[0]);
              }}
              onClick={() => resumeInputRef.current?.click()}
            >
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                style={{ display: "none" }}
                onChange={(e) => handleResumeFile(e.target.files[0])}
              />
              <div className="upload-icon">📂</div>
              <div className="upload-title">{resumeFile ? "File selected" : "Drag & drop your resume here"}</div>
              <div className="upload-sub">
                {resumeFile ? resumeFile.name : "Supports PDF, TXT, DOC, DOCX — or click to browse"}
              </div>
              {resumeFile && <div className="upload-file-name">✓ {resumeFile.name}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Target Role (optional)</label>
            <input
              className="form-input"
              placeholder="e.g. Senior Data Scientist, Product Manager, UX Designer…"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>

          <button className="submit-btn" onClick={analyze} disabled={loading || !resumeFile}>
            {loading ? "Analyzing…" : "Analyze Resume →"}
          </button>
        </div>

        {loading && (
          <div className="status-card" style={{ marginTop: 20 }}>
            <div className="spinner">
              <div className="spinner-dots">
                <span />
                <span />
                <span />
              </div>
              <span>{progressLabel || "Preparing your review…"}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
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
          <div className="analysis-grid">
            <div className="score-card glow-card">
              <div className="score-label">Resume Score</div>
              <div className="score-value">{analysis.score ?? "—"}/100</div>
              <div className="score-caption">Professional readiness</div>
            </div>

            <div className="result-card">
              <h3>Strengths</h3>
              <ul>{analysis.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>

            <div className="result-card">
              <h3>Weaknesses</h3>
              <ul>{analysis.weaknesses.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>

            <div className="result-card">
              <h3>Missing Skills</h3>
              <ul>{analysis.missingSkills.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>

            <div className="result-card">
              <h3>ATS Compatibility</h3>
              <p>{analysis.score && analysis.score >= 75 ? "Strong keyword alignment and formatting." : "Needs stronger keyword alignment and formatting."}</p>
            </div>

            <div className="result-card">
              <h3>Suggested Improvements</h3>
              <ul>{analysis.improvements.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>

            <div className="result-card wide-card">
              <h3>Recommended Career Roles</h3>
              <div className="pill-list">
                {analysis.roles.length > 0 ? (
                  analysis.roles.map((role) => <span key={role} className="pill">{role}</span>)
                ) : (
                  <span className="pill">Generalist Professional</span>
                )}
              </div>
            </div>
          </div>
        )}

        {response && !analysis && (
          <div className="ai-response">
            <div className="ai-response-header">
              🤖 Resume Analysis
              {targetRole && <span style={{ color: "rgba(140,190,255,.6)", marginLeft: 8 }}>— {targetRole}</span>}
            </div>
            <div className="ai-response-body">{response}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default ResumeAnalyzer;
