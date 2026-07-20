import React from "react";
import { ReportSummary, VideoAnalysis } from "../types";
import { Sparkles, Calendar, BookOpen, AlertTriangle, FileText, Globe } from "lucide-react";

interface PrintableReportProps {
  report: ReportSummary;
  videos: VideoAnalysis[];
  onClose: () => void;
}

export default function PrintableReport({ report, videos, onClose }: PrintableReportProps) {
  React.useEffect(() => {
    // Automatically trigger print on mount, then close print layout
    const timer = setTimeout(() => {
      window.print();
      onClose();
    }, 500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="absolute inset-0 bg-white z-[9999] min-h-screen text-slate-800 p-12 overflow-y-auto print:p-0" id="printable-report">
      {/* PRINT-ONLY CSS STYLING OVERRIDES */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: #1e293b !important;
          }
          #printable-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            z-index: 99999 !important;
          }
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Close button for safety before print is invoked */}
      <div className="no-print flex justify-between items-center mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-600">Generating PDF Layout... Your browser's print utility will open.</span>
        </div>
        <button
          onClick={onClose}
          className="text-xs bg-slate-200 hover:bg-slate-300 px-4 py-2 rounded-lg font-bold transition-all text-slate-700"
        >
          Cancel & Close Preview
        </button>
      </div>

      {/* --- PAGE 1: PROFESSIONAL COVER PAGE --- */}
      <div className="min-h-[90vh] flex flex-col justify-between border-4 border-emerald-600/30 p-12 rounded-3xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              YT
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-lg">YouTube Intelligence</span>
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Confidential / Internal Report</span>
        </div>

        <div className="space-y-4 my-auto">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">AI-Powered Market Intelligence Briefing</span>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-none uppercase">
            {report.topic} Research Report
          </h1>
          <p className="text-lg text-slate-500 max-w-xl font-medium leading-relaxed">
            Continuous consumer sentiment mapping, clinical claim auditing, and competitive R&D gap analysis extracted from active YouTube media channels.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-8 grid grid-cols-2 gap-8 text-xs font-semibold text-slate-500">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Generated On</p>
            <p className="text-slate-800 text-sm">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Scoped Dataset</p>
            <p className="text-slate-800 text-sm">{report.total_videos} Videos Analyzed</p>
          </div>
        </div>
      </div>

      {/* --- PAGE 2: EXECUTIVE SUMMARY --- */}
      <div className="page-break pt-12 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Section 1.0</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-400" /> Executive Intelligence Summary
          </h2>
        </div>

        <div className="text-slate-700 text-sm leading-relaxed space-y-4 max-w-3xl whitespace-pre-line">
          {report.executive_summary}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="border border-slate-100 p-5 rounded-xl bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Primary Discussed Benefits
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {report.top_benefits.map((b) => (
                <li key={b.benefit} className="flex justify-between font-medium">
                  <span>• {b.benefit}</span>
                  <span className="font-bold text-slate-800">{b.count} videos</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-slate-100 p-5 rounded-xl bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Critical Consumer Objections
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {report.top_pain_points.map((p) => (
                <li key={p.pain_point} className="flex justify-between font-medium">
                  <span>• {p.pain_point}</span>
                  <span className="font-bold text-slate-800">{p.count} videos</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* --- PAGE 3: OPPORTUNITIES & ACTIONS --- */}
      <div className="page-break pt-12 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Section 2.0</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" /> Strategic Actions & Market Gaps
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Identified Market & R&D Gaps</h3>
            <div className="grid grid-cols-1 gap-3">
              {report.opportunities.map((opp, idx) => (
                <div key={idx} className="p-4 border border-slate-100 bg-slate-50/30 rounded-xl flex gap-3 text-xs leading-relaxed text-slate-600 font-medium">
                  <span className="font-bold text-emerald-600 bg-emerald-50 h-5 w-5 flex items-center justify-center rounded-full flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p>{opp}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Action Recommendations</h3>
            <div className="grid grid-cols-1 gap-3">
              {report.recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 border border-emerald-100/50 bg-emerald-50/10 rounded-xl flex gap-3 text-xs leading-relaxed text-slate-700 font-semibold">
                  <span className="font-bold text-emerald-800 bg-emerald-100 h-5 w-5 flex items-center justify-center rounded-full flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- PAGE 4: DETAILED VIDEO LEDGER --- */}
      <div className="page-break pt-12 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Section 3.0</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Globe className="h-5 w-5 text-slate-400" /> Analyzed Video Ledger
          </h2>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3">Video Title & Creator</th>
              <th className="px-4 py-3">Relevance</th>
              <th className="px-4 py-3">Sentiment</th>
              <th className="px-4 py-3">Audited Scientific Claims</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {videos.map((v) => (
              <tr key={v.video_id} className="align-top">
                <td className="px-4 py-3 max-w-xs font-semibold text-slate-900">
                  <p>{v.title}</p>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">{v.channel_name} • {v.views.toLocaleString()} views</span>
                </td>
                <td className="px-4 py-3 text-[10px] font-bold text-slate-700">
                  <p className="uppercase">{v.business_relevance.tier} ({v.business_relevance.score})</p>
                  <span className="text-[9px] text-slate-400 font-normal mt-1 block">{v.business_relevance.reasoning}</span>
                </td>
                <td className="px-4 py-3 text-[10px] font-bold text-slate-700">
                  <span className="uppercase">{v.sentiment.overall}</span>
                </td>
                <td className="px-4 py-3">
                  {v.claims.length === 0 ? (
                    <span className="text-slate-400 italic text-[10px]">No major claims audited.</span>
                  ) : (
                    <div className="space-y-2">
                      {v.claims.slice(0, 2).map((c, i) => (
                        <div key={i} className="text-[10px] leading-relaxed">
                          <p className="font-bold text-slate-700">
                            • "{c.claim_text}" ({c.claim_type})
                          </p>
                          <p className="text-slate-400 italic">Verify: {c.supporting_notes}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
