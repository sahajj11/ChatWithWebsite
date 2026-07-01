export default function Message({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
          isUser
            ? "bg-[#3ADB76]/10 border border-[#3ADB76]/20 text-[#EDEDED]"
            : msg.isError
            ? "bg-red-500/5 border border-red-500/20 text-red-400"
            : "bg-[#12161C] border border-[#181C24] text-[#EDEDED]"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}