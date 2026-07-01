import Message from "./Message";
import { Loader2 } from "lucide-react";

export default function MessageList({ messages, loading }) {
  return (
    <div className="flex-1 px-5 py-4 overflow-y-auto">
      {messages.length === 0 && !loading && (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <p className="text-[#8B949E] text-sm">Ask anything about this site.</p>
          <p className="text-[#4B5561] text-xs font-mono mt-1">answers are grounded in crawled pages only</p>
        </div>
      )}

      {messages.map((msg, i) => (
        <Message key={i} msg={msg} />
      ))}

      {loading && (
        <div className="flex items-center gap-2 text-[#5C6672] text-xs font-mono px-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          searching indexed content...
        </div>
      )}
    </div>
  );
}