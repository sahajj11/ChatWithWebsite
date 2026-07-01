import { useState } from "react";

export default function ChatBox({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t border-[#181C24]">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Ask about this website..."
        className="flex-1 bg-[#12161C] border border-[#232833] focus:border-[#3ADB76]/60 rounded-lg px-4 py-3 text-[#EDEDED] placeholder-[#4B5561] text-sm outline-none transition-colors"
      />

      <button
        onClick={handleSubmit}
        className="bg-[#3ADB76] text-[#0B0E11] font-medium text-sm px-4 py-3 rounded-lg hover:bg-[#4EE888] transition-colors"
      >
        Send
      </button>
    </div>
  );
}