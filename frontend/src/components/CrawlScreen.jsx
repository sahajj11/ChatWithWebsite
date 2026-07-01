import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Compass, Scissors, Database, Check } from "lucide-react";

const STAGES = [
  { key: "connect", label: "Connecting to site", icon: ShieldCheck, log: "reading robots.txt, resolving crawl scope" },
  { key: "discover", label: "Mapping pages", icon: Compass, log: "discovering in-domain links, respecting depth limit" },
  { key: "chunk", label: "Chunking content", icon: Scissors, log: "stripping boilerplate, splitting into passages" },
  { key: "index", label: "Building index", icon: Database, log: "embedding chunks, writing to vector store" },
];

// Stays on the visual cue tied to real progress; only auto-advances through
// early stages while waiting, then jumps to done once the API call resolves.
export default function CrawlScreen({ url, task, onComplete, onError }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [logLines, setLogLines] = useState([]);
  const resolvedRef = useRef(false);

  useEffect(() => {
    const advance = setInterval(() => {
      setStageIndex((i) => {
        const next = i < STAGES.length - 2 ? i + 1 : i; // hold before last stage
        return resolvedRef.current ? i : next;
      });
    }, 1400);

    let mounted = true;
    (async () => {
      try {
        const result = await task(url);
        resolvedRef.current = true;
        setStageIndex(STAGES.length - 1);
        setTimeout(() => mounted && onComplete(result), 900);
      } catch (err) {
        resolvedRef.current = true;
        mounted && onError(err);
      }
    })();

    return () => {
      mounted = false;
      clearInterval(advance);
    };
  }, [url]);

  useEffect(() => {
    setLogLines((prev) => [...prev, STAGES[stageIndex].log]);
  }, [stageIndex]);

  const progressPct = ((stageIndex + 1) / STAGES.length) * 100;

  return (
    <div className="fixed inset-0 bg-[#0B0E11] flex items-center justify-center px-6 z-50">
      <div className="w-full max-w-lg">
        {/* Signature: orbiting scan ring */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border border-[#232833]" />
          <div className="absolute inset-0 rounded-full border-t-2 border-[#3ADB76] animate-spin [animation-duration:1.6s]" />
          <div className="absolute inset-3 rounded-full border border-[#3ADB76]/20 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#3ADB76] font-mono text-xs">{Math.round(progressPct)}%</span>
          </div>
        </div>

        <p className="text-center text-[#8B949E] text-xs font-mono tracking-widest uppercase mb-1">
          Indexing target
        </p>
        <p className="text-center text-[#EDEDED] font-mono text-sm mb-8 truncate">
          {url}
        </p>

        {/* Stage list */}
        <div className="space-y-2.5 mb-6">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const state = i < stageIndex ? "done" : i === stageIndex ? "active" : "pending";
            return (
              <div
                key={stage.key}
                className={`flex items-center gap-3 px-3 py-2 rounded-md border text-sm font-mono transition-all ${
                  state === "active"
                    ? "border-[#3ADB76]/40 bg-[#3ADB76]/5 text-[#EDEDED]"
                    : state === "done"
                    ? "border-[#232833] text-[#5C6672]"
                    : "border-[#181C24] text-[#4B5561]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {stage.label}
                {state === "active" && (
                  <span className="ml-auto flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#3ADB76] animate-bounce [animation-delay:0ms]" />
                    <span className="w-1 h-1 rounded-full bg-[#3ADB76] animate-bounce [animation-delay:150ms]" />
                    <span className="w-1 h-1 rounded-full bg-[#3ADB76] animate-bounce [animation-delay:300ms]" />
                  </span>
                )}
                {state === "done" && <Check className="w-3.5 h-3.5 ml-auto text-[#3ADB76]" />}
              </div>
            );
          })}
        </div>

        {/* Live log */}
        <div className="bg-[#0F1319] border border-[#181C24] rounded-md px-4 py-3 h-20 overflow-hidden font-mono text-[11px] text-[#5C6672] leading-5">
          {logLines.slice(-4).map((line, i) => (
            <div key={i} className="truncate">
              <span className="text-[#3ADB76]/60">›</span> {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}