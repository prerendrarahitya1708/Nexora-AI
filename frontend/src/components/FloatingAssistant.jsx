import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const messagesByMode = {
  idle: ["👋 Welcome back!", "🤖 Ask me anything.", "🎯 Let's build your roadmap."],
  thinking: ["🧠 Thinking...", "⚙️ Analyzing your request...", "✨ Preparing guidance..."],
  done: ["✅ Ready for the next step.", "🚀 Response is ready.", "💼 Let's keep going."],
  error: ["⚠️ A quick retry may help.", "🔄 Let’s try again.", "🛠️ The assistant is ready."],
};

function FloatingAssistant({ mode = "idle" }) {
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    setBubbleIndex(0);
    setShowBubble(true);
    const keepVisible = window.setTimeout(() => setShowBubble(false), 2600);
    return () => window.clearTimeout(keepVisible);
  }, [mode]);

  useEffect(() => {
    const cycle = window.setInterval(() => {
      setBubbleIndex((prev) => (prev + 1) % messagesByMode[mode].length);
      setShowBubble(true);
    }, 3200);
    return () => window.clearInterval(cycle);
  }, [mode]);

  useEffect(() => {
    if (!showBubble) return;
    const timer = window.setTimeout(() => setShowBubble(false), 2600);
    return () => window.clearTimeout(timer);
  }, [bubbleIndex, showBubble]);

  const bubbleText = useMemo(() => messagesByMode[mode][bubbleIndex] || messagesByMode[mode][0], [bubbleIndex, mode]);

  return (
    <motion.div
      className={`assistant-shell ${mode} ${isExpanded ? "expanded" : ""}`}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: hovered ? 1.04 : 1 }}
      transition={{ duration: 0.24 }}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const relativeX = event.clientX - bounds.left;
        setTilt(((relativeX / bounds.width) - 0.5) * 8);
      }}
      onMouseLeave={() => setTilt(0)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {showBubble && (
        <motion.div
          className="assistant-bubble"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
        >
          {bubbleText}
        </motion.div>
      )}

      <motion.button
        className="assistant-toggle"
        whileHover={{ scale: 1.06, rotate: -4 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsExpanded((prev) => !prev)}
        type="button"
      >
        🤖
      </motion.button>

      <motion.div
        className="assistant-card"
        animate={{ y: hovered ? -4 : [0, -8, 0], rotate: hovered ? 0 : [0, -2, 2, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="assistant-robot">
          <div className="assistant-antenna" />
          <div className="assistant-head">
            <span className="assistant-eye left" />
            <span className="assistant-eye right" />
            <span className="assistant-mouth" />
          </div>
          <div className="assistant-body" />
          <div className="assistant-arm left" />
          <div className="assistant-arm right" />
          <div className="assistant-leg left" />
          <div className="assistant-leg right" />
        </div>
        <div className="assistant-status">
          <strong>{mode === "thinking" ? "Thinking..." : mode === "done" ? "All set" : mode === "error" ? "Retry" : "Ready"}</strong>
          <span>{bubbleText}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default FloatingAssistant;
