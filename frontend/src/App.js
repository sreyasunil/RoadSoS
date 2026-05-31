import { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "🚑 RoadSoS — AI Emergency Assistant\n\nTell me what happened. I'll guide you through the emergency.\n\nFor real emergencies call 108 or 112 immediately." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userText = input;
    setInput("");
    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const history = newMessages.slice(1).slice(0, -1).map(m => ({
        role: m.role,
        text: m.text
      }));
      const res = await fetch("http://127.0.0.1:8001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "ai", text: data.reply }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "⚠️ Cannot reach server. Is backend running?" }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "system-ui" }}>
      {/* Header */}
      <div style={{ background: "#C0392B", padding: "12px 16px", color: "#fff" }}>
        <strong style={{ fontSize: 18 }}>🚑 RoadSoS</strong>
        <span style={{ fontSize: 12, marginLeft: 10, opacity: 0.8 }}>AI Emergency Assistant</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10, background: "#f9f9f9" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "75%", padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap",
              background: m.role === "user" ? "#C0392B" : "#fff",
              color: m.role === "user" ? "#fff" : "#111",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "#fff", padding: "10px 14px", borderRadius: 12, fontSize: 14, color: "#888", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick replies */}
      <div style={{ padding: "8px 12px", background: "#fff", display: "flex", gap: 6, flexWrap: "wrap", borderTop: "0.5px solid #eee" }}>
        {["I met with an accident", "Someone is injured", "Vehicle broke down"].map((q, i) => (
          <button key={i} onClick={() => { setInput(q); }} style={{ padding: "5px 10px", borderRadius: 20, border: "0.5px solid #C0392B", background: "transparent", color: "#C0392B", fontSize: 12, cursor: "pointer" }}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 12px", background: "#fff", display: "flex", gap: 8, borderTop: "0.5px solid #eee" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Describe the emergency..."
          style={{ flex: 1, padding: "9px 12px", border: "0.5px solid #ddd", borderRadius: 20, fontSize: 14, outline: "none" }}
        />
        <button onClick={sendMessage} style={{ padding: "9px 18px", background: "#C0392B", color: "#fff", border: "none", borderRadius: 20, cursor: "pointer", fontWeight: 600 }}>
          Send
        </button>
      </div>
    </div>
  );
}