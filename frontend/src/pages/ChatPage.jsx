import { useState } from "react";
import axios from "axios";
import { API } from "../services/api";

export default function ChatPage({ siteUrl }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      const res = await API.post("/chat", {
        message: text,
        siteUrl, // 🔥 IMPORTANT
      });

      const botMsg = {
        role: "assistant",
        text: res.data.answer,
      };

      setMessages((prev) => [...prev, botMsg]);
      setSources(res.data.sources);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
    setText("");
  };

  return (
    <div className="flex h-screen bg-[#0B0E11]">

      {/* CHAT AREA */}
      <div className="flex-[3] flex flex-col">

        {/* messages */}
        <div className="flex-1 p-5 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} mb-3`}
            >
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#3ADB76]/10 border border-[#3ADB76]/20 text-[#EDEDED]"
                    : "bg-[#12161C] border border-[#181C24] text-[#EDEDED]"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <p className="text-[#5C6672] text-xs font-mono">Thinking...</p>
          )}
        </div>

        {/* input */}
        <div className="flex items-center gap-2 p-4 border-t border-[#181C24]">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask about this website..."
            className="flex-1 bg-[#12161C] border border-[#232833] focus:border-[#3ADB76]/60 rounded-lg px-4 py-3 text-[#EDEDED] placeholder-[#4B5561] text-sm outline-none transition-colors"
          />

          <button
            onClick={sendMessage}
            className="bg-[#3ADB76] text-[#0B0E11] font-medium text-sm px-4 py-3 rounded-lg hover:bg-[#4EE888] transition-colors"
          >
            Send
          </button>
        </div>
      </div>

      {/* SOURCES PANEL */}
      <div className="flex-1 border-l border-[#181C24] p-4 overflow-y-auto">
        <h3 className="text-[#8B949E] text-xs font-mono tracking-widest uppercase mb-3">
          Sources
        </h3>

        {sources.length === 0 && (
          <p className="text-[#4B5561] text-sm">No sources yet</p>
        )}

        {sources.map((s) => (
          <div
            key={s.id}
            className="mb-2.5 p-3 rounded-md border border-[#181C24] bg-[#12161C] hover:border-[#3ADB76]/40 transition-colors"
          >
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-[#EDEDED] text-sm hover:text-[#3ADB76]"
            >
              [{s.id}] {s.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}