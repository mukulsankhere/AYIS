import React, { useState } from "react";
import { Search, Sparkles, Filter, Globe, HelpCircle, ArrowRight, Loader2, Info } from "lucide-react";
import { motion } from "motion/react";

interface TopicSetupProps {
  onSubmit: (formData: {
    topic: string;
    search_prompts: string[];
    country: string;
    language: string;
    max_results: number;
    date_range: { from: string; to: string };
    require_transcript: boolean;
  }) => void;
  isSubmitting: boolean;
}

const COUNTRIES = [
  { code: "", name: "Global (No Filter)" },
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" }
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "hi", name: "Hindi" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" }
];

const DEMO_SUGGESTIONS = [
  { topic: "Millets", prompt: "Benefits of Millets, diabetes benefits, preparation", icon: "🌾" },
  { topic: "Aloe Vera", prompt: "Aloe Vera skincare scientific review, drinking aloin safety", icon: "🌱" },
  { topic: "Plant Protein", prompt: "Heavy metals plant protein, whey vs plant protein", icon: "💪" },
  { topic: "Honey", prompt: "Is raw honey healthy, benefits vs sugar side effects", icon: "🍯" }
];

export default function TopicSetup({ onSubmit, isSubmitting }: TopicSetupProps) {
  const [topic, setTopic] = useState("");
  const [promptInput, setPromptInput] = useState("");
  const [country, setCountry] = useState("US");
  const [language, setLanguage] = useState("en");
  const [maxResults, setMaxResults] = useState(5);
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-07-19");
  const [requireTranscript, setRequireTranscript] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const prompts = promptInput
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    onSubmit({
      topic: topic.trim(),
      search_prompts: prompts,
      country,
      language,
      max_results: maxResults,
      date_range: { from: dateFrom, to: dateTo },
      require_transcript: requireTranscript
    });
  };

  const selectDemo = (demo: typeof DEMO_SUGGESTIONS[0]) => {
    setTopic(demo.topic);
    setPromptInput(demo.prompt);
    // Custom defaults
    if (demo.topic === "Millets") {
      setCountry("IN");
    } else {
      setCountry("US");
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-20 pb-12 px-4 md:py-8 flex flex-col gap-8">
      {/* Visual Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-100 mb-4"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Continuous Market Intelligence
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Agentic YouTube Research</h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
          Unlock structured consumer insights, medical claims, and competitor analysis of any ingredient, product, or agricultural trend in minutes.
        </p>
      </div>

      {/* Suggestion Grid */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Preloaded High-Fidelity Demos</span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DEMO_SUGGESTIONS.map((demo) => (
            <button
              key={demo.topic}
              type="button"
              onClick={() => selectDemo(demo)}
              className="flex flex-col items-start p-3 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-300 rounded-xl text-left transition-all group"
            >
              <span className="text-2xl mb-1.5">{demo.icon}</span>
              <span className="font-semibold text-slate-800 text-xs group-hover:text-emerald-700">{demo.topic}</span>
              <span className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-snug">{demo.prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Research Config Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
        
        {/* Topic Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-800 flex items-center justify-between">
            Research Topic
            <span className="text-[10px] text-slate-400 font-normal">Required</span>
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Millets, Aloe Vera, Ashwagandha, Matcha..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none rounded-xl text-sm transition-all"
              required
            />
          </div>
          <p className="text-[11px] text-slate-400">The core search keyword that the intelligence system expands and monitors.</p>
        </div>

        {/* Custom Prompts Expansion */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-800 flex items-center justify-between">
            Search Prompt Extension
            <span className="text-[10px] text-slate-400 font-normal">Optional</span>
          </label>
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="e.g., Health benefits, cancer claims, cooking instructions, side effects"
            rows={2}
            className="w-full px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none rounded-xl text-sm transition-all resize-none"
          />
          <p className="text-[11px] text-slate-400">Comma-separated angles. The agent will generate specialized queries matching these directives.</p>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="self-start text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 py-1"
        >
          <Filter className="h-3 w-3" />
          {showAdvanced ? "Hide Advanced Search Filters" : "Show Advanced Search Filters"}
        </button>

        {/* Advanced Filters Block */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4"
          >
            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Globe className="h-3 w-3" /> Region (Country Code)
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg text-xs"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg text-xs"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>

            {/* Max Results */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Max Videos to Analyze</label>
              <select
                value={maxResults}
                onChange={(e) => setMaxResults(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg text-xs"
              >
                <option value={3}>3 Videos (Ultra-Fast)</option>
                <option value={5}>5 Videos (Balanced Insight)</option>
                <option value={10}>10 Videos (Deep Sweep)</option>
              </select>
              <p className="text-[10px] text-slate-400">Controls processing duration and Gemini token usage.</p>
            </div>

            {/* Date Range */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Publication Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Transcript Enforcer Checkbox */}
            <div className="flex flex-col gap-1.5 md:col-span-2 border-t border-slate-100 pt-3 mt-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={requireTranscript}
                  onChange={(e) => setRequireTranscript(e.target.checked)}
                  className="h-4.5 w-4.5 accent-emerald-600 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  Use 100% Transcript Option (Highly Recommended)
                  <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[8px] font-extrabold uppercase rounded-full border border-emerald-100">Clean Data</span>
                </span>
              </label>
              <p className="text-[10px] text-slate-400 pl-7 leading-relaxed">
                Appends captions/closed captions constraint to YouTube search query. Guaranteed to only analyze videos that have readable word-by-word text transcripts available.
              </p>
            </div>
          </motion.div>
        )}

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmitting || !topic.trim()}
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all py-3 px-6 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:pointer-events-none shadow-sm shadow-emerald-600/15"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Launching Agent Workers...
            </>
          ) : (
            <>
              Launch Research Pipeline
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Info Notice Box */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start gap-3">
        <Info className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-slate-500 leading-relaxed">
          <span className="font-semibold text-slate-700">How it works:</span> The system activates an agentic workflow that expands your topic, Queries the YouTube Data API in real-time, attempts to crawl caption files/transcripts directly, evaluates scientific claims with the <b>Gemini 3.5 Flash Model</b>, and generates a structured business report.
        </div>
      </div>
    </div>
  );
}
