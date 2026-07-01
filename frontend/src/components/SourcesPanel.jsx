import { FileText } from "lucide-react";

export default function SourcesPanel({ sources }) {
  return (
    <>
    <div className="p-4">
      <h3 className="text-[#8B949E] text-xs font-mono tracking-widest uppercase mb-3">
        Sources
      </h3>

      {(!sources || sources.length === 0) && (
        <p className="text-[#4B5561] text-sm">No sources yet — ask a question first.</p>
      )}

      <div className="space-y-2">
        {sources?.map((s) => (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-2 p-3 rounded-md border border-[#181C24] bg-[#12161C] hover:border-[#3ADB76]/40 transition-colors group"
          >
            <FileText className="w-3.5 h-3.5 text-[#3ADB76] mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[#EDEDED] text-sm truncate group-hover:text-[#3ADB76]">
                [{s.id}] {s.title}
              </p>
              <p className="text-[#4B5561] text-xs font-mono truncate">{s.url}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
    </>
  );
}