import { useState, useRef, useEffect } from "react";

const EMERGENCY_CONTACTS = [
  { icon: "🚑", label: "Ambulance", num: "108", bg: "#FCEBEB", color: "#C0392B" },
  { icon: "🚔", label: "Police", num: "100", bg: "#E6F1FB", color: "#185FA5" },
  { icon: "🚒", label: "Fire", num: "101", bg: "#EAF3DE", color: "#3B6D11" },
  { icon: "🆘", label: "All Emergencies", num: "112", bg: "#FAEEDA", color: "#BA7517" },
];

const FIRST_AID = [
  {
    title: "Severe Bleeding",
    steps: ["Apply firm pressure with clean cloth", "Do not remove soaked cloth — add more on top", "Elevate limb above heart level", "Call 108 immediately"],
  },
  {
    title: "Unconscious Victim",
    steps: ["Do not move (spinal risk)", "Check breathing — tilt head, lift chin", "CPR if no breathing: 30 compressions + 2 breaths", "Call 108, stay on line"],
  },
  {
    title: "Vehicle Fire",
    steps: ["Turn off engine immediately", "Exit vehicle, move 100m away", "Call 101 (Fire) + 108 (Ambulance)", "Never open hood if smoking"],
  },
];

export default function App() {
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState([
    { role: "ai", text: "🚑 RoadSoS — AI Emergency Assistant\n\nTell me what happened. I'll guide you through the emergency.\n\nFor real emergencies call 108 or 112 immediately." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userText = text || input;
    if (!userText.trim()) return;
    setInput("");
    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const history = newMessages.slice(1).slice(0, -1).map(m => ({ role: m.role, text: m.text }));
      const res = await fetch("http://127.0.0.1:8001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "ai", text: data.reply }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "⚠️ Cannot reach server. Is backend running?" }]);
    }
    setLoading(false);
  }

  async function analyzeImage() {
    if (!image) { alert("Please select an image."); return; }
    setAnalyzing(true);
    setAnalysis("");
    const formData = new FormData();
    formData.append("file", image);
    try {
      const response = await fetch("http://127.0.0.1:8001/analyze-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch {
      setAnalysis("⚠️ Failed to analyze image. Is backend running?");
    }
    setAnalyzing(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "system-ui", border: "0.5px solid #eee" }}>
      
      {/* Header */}
      <div style={{ background: "#C0392B", padding: "12px 16px", color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
        <strong style={{ fontSize: 18 }}>🚑 RoadSoS</strong>
        <span style={{ fontSize: 12, opacity: 0.8 }}>AI Emergency Assistant</span>
        <div style={{ marginLeft: "auto", width: 8, height: 8, background: "#4ade80", borderRadius: "50%" }} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "0.5px solid #eee", background: "#f9f9f9" }}>
        {["chat", "image", "emergency", "firstaid"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "9px 4px", fontSize: 11, fontWeight: 500, textAlign: "center",
            cursor: "pointer", border: "none", background: "transparent",
            borderBottom: tab === t ? "2px solid #C0392B" : "2px solid transparent",
            color: tab === t ? "#C0392B" : "#888"
          }}>
            {t === "chat" ? "AI Chat" : t === "image" ? "📷 Image" : t === "emergency" ? "Emergency" : "First Aid"}
          </button>
        ))}
      </div>

      {/* CHAT TAB */}
      {tab === "chat" && (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10, background: "#f9f9f9" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "75%", padding: "10px 14px", borderRadius: 12, fontSize: 14,
                  lineHeight: 1.55, whiteSpace: "pre-wrap",
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
          <div style={{ padding: "8px 12px", background: "#fff", display: "flex", gap: 6, flexWrap: "wrap", borderTop: "0.5px solid #eee" }}>
            {["I met with an accident", "Someone is injured", "Vehicle broke down"].map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} style={{
                padding: "5px 10px", borderRadius: 20, border: "0.5px solid #C0392B",
                background: "transparent", color: "#C0392B", fontSize: 12, cursor: "pointer"
              }}>{q}</button>
            ))}
          </div>
          <div style={{ padding: "10px 12px", background: "#fff", display: "flex", gap: 8, borderTop: "0.5px solid #eee" }}>
            <button onClick={() => sendMessage("SOS Emergency! Road accident! Need immediate help!")} style={{
              width: 36, height: 36, borderRadius: "50%", background: "#FCEBEB",
              border: "1.5px solid #C0392B", color: "#C0392B", cursor: "pointer",
              fontSize: 10, fontWeight: 800
            }}>SOS</button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Describe the emergency..."
              style={{ flex: 1, padding: "9px 12px", border: "0.5px solid #ddd", borderRadius: 20, fontSize: 14, outline: "none" }}
            />
            <button onClick={() => sendMessage()} style={{
              padding: "9px 18px", background: "#C0392B", color: "#fff",
              border: "none", borderRadius: 20, cursor: "pointer", fontWeight: 600
            }}>Send</button>
          </div>
        </>
      )}

      {/* IMAGE TAB */}
      {tab === "image" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#C0392B" }}>📷 Accident Image Analysis</div>
          <p style={{ fontSize: 13, color: "#666" }}>Upload or capture an accident photo. AI will assess severity.</p>
          <input type="file" accept="image/*" capture="environment" onChange={e => setImage(e.target.files[0])}
            style={{ fontSize: 13 }} />
          {image && (
            <img src={URL.createObjectURL(image)} alt="preview" style={{ borderRadius: 10, maxHeight: 200, objectFit: "cover" }} />
          )}
          <button onClick={analyzeImage} disabled={analyzing} style={{
            padding: "10px", background: analyzing ? "#aaa" : "#C0392B", color: "#fff",
            border: "none", borderRadius: 8, cursor: analyzing ? "not-allowed" : "pointer", fontWeight: 600
          }}>
            {analyzing ? "Analyzing..." : "Analyze Accident"}
          </button>
          {analysis && (
            <div style={{ padding: 14, background: "#fff", borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, color: "#C0392B", marginBottom: 8 }}>🚨 AI Analysis</div>
              {analysis}
            </div>
          )}
        </div>
      )}

      {/* EMERGENCY TAB */}
      {tab === "emergency" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#C0392B" }}>Emergency Contacts</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {EMERGENCY_CONTACTS.map((c, i) => (
              <div key={i} onClick={() => alert("Calling " + c.num)}
                style={{ background: c.bg, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
                <span style={{ fontSize: 26 }}>{c.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: c.color }}>{c.label}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: c.color }}>{c.num}</span>
              </div>
            ))}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#C0392B" }}>Nearby Resources</div>
          {[
            { icon: "🏥", name: "KIMS Hospital", dist: "2.3 km · Trauma Center" },
            { icon: "🚑", name: "Govt Ambulance", dist: "1.1 km · ETA 4 min" },
            { icon: "👮", name: "Traffic Police", dist: "0.8 km away" },
            { icon: "🔧", name: "Towing Service", dist: "3.2 km away" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fff", borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <span style={{ fontSize: 24 }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{r.dist}</div>
              </div>
              <button style={{ padding: "5px 12px", background: "#C0392B", color: "#fff", border: "none", borderRadius: 20, fontSize: 12, cursor: "pointer" }}>Call</button>
            </div>
          ))}
        </div>
      )}

      {/* FIRST AID TAB */}
      {tab === "firstaid" && (
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#C0392B" }}>First Aid Guide</div>
          {FIRST_AID.map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "12px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#C0392B", marginBottom: 8 }}>{s.title}</div>
              {s.steps.map((st, j) => (
                <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: j < s.steps.length - 1 ? "0.5px solid #f0f0f0" : "none" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#C0392B", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{j + 1}</div>
                  <span style={{ fontSize: 13 }}>{st}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}