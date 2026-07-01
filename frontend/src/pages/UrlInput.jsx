import { useState } from "react";
import axios from "axios";
import { Globe, ArrowRight } from "lucide-react";
import CrawlScreen from "../components/CrawlScreen";
import { API } from "../services/api";


export default function UrlInput({ onSiteReady }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const crawlTask = async (targetUrl) => {
    const res = await axios.post(`${API}/crawl`, { url: targetUrl });
    return res.data;
  };

  const handleCrawl = () => {
    if (!url.trim()) return;
    if (!isValidUrl(url)) {
      setError("Enter a full URL, including https://");
      return;
    }
    setError("");
    setLoading(true);
  };

  if (loading) {
    return (
      <CrawlScreen
        url={url}
        task={crawlTask}
        onComplete={() => {
          setLoading(false);
          onSiteReady(url);
        }}
        onError={(err) => {
          console.error(err);
          setLoading(false);
          setError("Crawl failed. Check the URL and try again.");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center px-6">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 mb-4 justify-center">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3ADB76] animate-pulse" />
          <span className="text-[#8B949E] text-xs font-mono tracking-widest uppercase">
            Chat with a Website
          </span>
        </div>

        <h1 className="text-center text-[#EDEDED] text-3xl font-semibold mb-2">
          Point it at a site.
        </h1>
        <p className="text-center text-[#8B949E] text-sm mb-8">
          We crawl, chunk, and index the pages — then answer with citations.
        </p>

        <div
          className={`flex items-center gap-2 rounded-lg bg-[#12161C] border transition-colors
          ${error ? "border-red-500/60" : "border-[#232833] focus-within:border-[#3ADB76]/60"}`}
        >
          <Globe className="w-4 h-4 text-[#8B949E] ml-4 shrink-0" />
          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleCrawl()}
            placeholder="https://example.com"
            className="flex-1 bg-transparent py-3.5 text-[#EDEDED] placeholder-[#4B5561] font-mono text-sm outline-none"
          />
          <button
            onClick={handleCrawl}
            className="flex items-center gap-1.5 bg-[#3ADB76] text-[#0B0E11] font-medium text-sm px-4 py-2 m-1.5 rounded-md hover:bg-[#4EE888] transition-colors"
          >
            Crawl <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {error && <p className="text-red-400 text-xs font-mono mt-2 pl-1">{error}</p>}

        {!error && (
          <div className="flex items-center justify-center gap-4 mt-4 text-[#4B5561] text-xs font-mono">
            <span>same-domain only</span>
            <span className="w-1 h-1 rounded-full bg-[#232833]" />
            <span>robots.txt respected</span>
            <span className="w-1 h-1 rounded-full bg-[#232833]" />
            <span>rate-limited</span>
          </div>
        )}
      </div>
    </div>
  );
}