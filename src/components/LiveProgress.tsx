import React from "react";
import { Check, Loader2, Sparkles, Youtube, Search, FileText, BarChart3, ShieldCheck, Heart } from "lucide-react";
import { motion } from "motion/react";

interface LiveProgressProps {
  topic: string;
  stage: number;
  message: string;
  percent: number;
}

const STAGES = [
  { id: 1, title: "Query Generation Agent", icon: Sparkles, desc: "Expanding research parameters into multi-angle queries" },
  { id: 2, title: "YouTube Live Search", icon: Search, desc: "Querying YouTube Data API v3 for high-relevance video tracks" },
  { id: 3, title: "Metadata Harvest", icon: Youtube, desc: "Fetching statistical indices, views, publish flags, and lengths" },
  { id: 4, title: "Transcript Extraction", icon: FileText, desc: "Retrieving official and auto-generated video captions" },
  { id: 5, title: "AI Content Analysis", icon: BarChart3, desc: "Parsing transcript chunks to map claims, benefits, and pain points" },
  { id: 6, title: "Business Relevance Scoring", icon: ShieldCheck, desc: "Running semantic alignment rules against corporate profile" },
  { id: 7, title: "Aggregate Summary Synthesis", icon: Heart, desc: "Synthesizing market dashboard and action recommendations" }
];

export default function LiveProgress({ topic, stage, message, percent }: LiveProgressProps) {
  return (
    <div className="max-w-xl mx-auto pt-20 pb-12 px-4 md:py-12 flex flex-col gap-8">
      {/* Visual Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-full text-emerald-600 mb-4 animate-pulse">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Agent Active on: <span className="text-emerald-700">"{topic}"</span></h2>
        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-1">Research Pipeline Executing Live</p>
      </div>

      {/* Modern Progress Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Completion</span>
          <span className="text-sm font-bold text-emerald-600 font-mono">{percent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            style={{ width: `${percent}%` }}
            className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-in-out"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium italic mt-1 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          {message}
        </div>
      </div>

      {/* Step Tracker List */}
      <div className="flex flex-col gap-3">
        {STAGES.map((s) => {
          const isCompleted = s.id < stage;
          const isCurrent = s.id === stage;
          const StepIcon = s.icon;

          return (
            <div
              key={s.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                isCompleted 
                  ? "bg-emerald-50/20 border-emerald-100" 
                  : isCurrent 
                  ? "bg-white border-emerald-500/30 shadow-md ring-1 ring-emerald-500/10 scale-[1.01]" 
                  : "bg-white border-slate-100 opacity-60"
              }`}
            >
              {/* Step Circle Indicator */}
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-xs ${
                isCompleted 
                  ? "bg-emerald-100 text-emerald-700" 
                  : isCurrent 
                  ? "bg-emerald-600 text-white animate-pulse" 
                  : "bg-slate-100 text-slate-400"
              }`}>
                {isCompleted ? (
                  <Check className="h-4.5 w-4.5 stroke-[3]" />
                ) : (
                  <StepIcon className="h-4.5 w-4.5" />
                )}
              </div>

              {/* Step Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`text-xs font-semibold uppercase tracking-wider ${isCurrent ? "text-slate-900" : isCompleted ? "text-emerald-800" : "text-slate-400"}`}>
                    Step {s.id}: {s.title}
                  </h4>
                  {isCurrent && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                      Active
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 ${isCurrent ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
