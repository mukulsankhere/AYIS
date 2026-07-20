import React from "react";
import { ResearchRun } from "../types";
import { Search, History, Trash2, Calendar, Play, AlertCircle, CheckCircle2, Loader2, Plus } from "lucide-react";
import { motion } from "motion/react";

interface HistorySidebarProps {
  runs: ResearchRun[];
  activeRunId: string | null;
  onSelectRun: (id: string) => void;
  onDeleteRun: (id: string) => void;
  onNewResearch: () => void;
  apiStatus: { geminiKeyConfigured: boolean; youtubeKeyConfigured: boolean; geminiQuotaExhausted?: boolean } | null;
}

export default function HistorySidebar({
  runs,
  activeRunId,
  onSelectRun,
  onDeleteRun,
  onNewResearch,
  apiStatus
}: HistorySidebarProps) {
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200/80 flex flex-col h-full flex-shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/80 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 tracking-tight text-lg">YouTube Intelligence</h1>
            <p className="text-xs text-slate-500 font-medium">Agentic Insights Platform</p>
          </div>
        </div>

        <button
          onClick={onNewResearch}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all rounded-lg text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/10"
        >
          <Plus className="h-4 w-4" />
          New Research Run
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Research History</h3>
        
        {runs.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-400 text-xs">
            No previous research runs. Start one above!
          </div>
        ) : (
          runs.map((run) => {
            const isActive = run.id === activeRunId;
            return (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group relative flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-50 border-emerald-500/30 shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                }`}
                onClick={() => onSelectRun(run.id)}
              >
                <div className="flex items-start gap-2.5 pr-6 w-full overflow-hidden">
                  <div className="mt-1">
                    {run.status === "completed" && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    )}
                    {run.status === "running" && (
                      <Loader2 className="h-4 w-4 text-emerald-600 animate-spin flex-shrink-0" />
                    )}
                    {run.status === "failed" && (
                      <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium text-sm truncate ${isActive ? "text-slate-950 font-semibold" : "text-slate-700"}`}>
                      {run.topic}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(run.created_at)}
                    </p>
                    {run.status === "running" && (
                      <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full transition-all duration-300" 
                          style={{ width: `${run.progress.percent}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRun(run.id);
                  }}
                  className="absolute right-2 opacity-0 group-hover:opacity-100 hover:text-rose-600 p-1.5 text-slate-400 hover:bg-rose-50 rounded-md transition-all"
                  title="Delete run"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      {/* API Key Status Banner at the bottom */}
      {apiStatus && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 text-xs flex-shrink-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 font-medium whitespace-nowrap">Gemini AI Engine:</span>
              {apiStatus.geminiQuotaExhausted ? (
                <span className="px-1.5 py-0.5 rounded font-semibold text-[10px] bg-amber-50 text-amber-800 border border-amber-200 truncate" title="Demo Mode (Quota Exhausted)">
                  Demo (Quota Maxed)
                </span>
              ) : apiStatus.geminiKeyConfigured ? (
                <span className="px-1.5 py-0.5 rounded font-semibold text-[10px] bg-emerald-100 text-emerald-800 truncate">
                  Active (Gemini 3.5)
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded font-semibold text-[10px] bg-slate-200 text-slate-700 truncate">
                  Demo Fallback
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">YouTube Data v3:</span>
              <span className={`px-1.5 py-0.5 rounded font-semibold text-[10px] ${apiStatus.youtubeKeyConfigured ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>
                {apiStatus.youtubeKeyConfigured ? "Live API" : "Live Scrape"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
