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
    // Automatically trigger print on mount
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs z-[9999] overflow-y-auto p-4 sm:p-8 flex flex-col items-center print:bg-white print:p-0 print:block print:static print:overflow-visible" id="printable-report-wrapper">
      {/* PRINT-ONLY CSS STYLING OVERRIDES */}
      <style>{`
        @media print {
          /* Hide all other primary layout columns of the app */
          .no-print {
            display: none !important;
          }
          
          /* Reset root layout constraints to prevent clipping */
          html, body, #root, div.h-screen, div.w-screen {
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }

          /* Ensure the printable report wrapper covers the page cleanly */
          #printable-report-wrapper {
            display: block !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            background: white !important;
            box-shadow: none !important;
          }

          /* Ensure the printable report container covers the page cleanly */
          #printable-report {
            display: block !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            background: white !important;
            box-shadow: none !important;
          }
          
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
          }
        }
      `}</style>

      {/* Sticky header container for screen only (marked with no-print) */}
      <div className="no-print w-full max-w-5xl bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between gap-4 mb-6 shadow-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="text-xs font-medium text-slate-300">Document ready for print/export</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => window.print()}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white px-4 py-2 rounded-lg font-bold transition-all cursor-pointer shadow-md shadow-emerald-900/20"
          >
            Trigger Print again
          </button>
          <button
            onClick={onClose}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer border border-slate-700"
          >
            Close Preview
          </button>
        </div>
      </div>

      {/* --- PRINTABLE CONTAINER SHEET --- */}
      <div className="w-full max-w-5xl bg-white text-slate-800 p-8 sm:p-16 rounded-2xl shadow-2xl relative print:shadow-none print:p-0 print:max-w-none print:rounded-none" id="printable-report">

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
                      {v.claims.map((c, i) => (
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

      {/* --- SECTION 4.0: DETAILED VIDEO DEEP-DIVES --- */}
      <div className="page-break pt-12 space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Section 4.0</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-400" /> Individual Video Deep-Dives
          </h2>
        </div>

        <div className="space-y-12">
          {videos.map((v, idx) => (
            <div key={v.video_id} className="page-break border border-slate-200 p-6 sm:p-8 rounded-2xl bg-slate-50/20 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Video #{idx + 1}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{v.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">
                    Channel: <span className="text-slate-700">{v.channel_name}</span> • Published: <span className="text-slate-700">{new Date(v.published_date).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:text-right">
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-100 uppercase">
                    Relevance: {v.business_relevance.tier} ({v.business_relevance.score})
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md uppercase">
                    Sentiment: {v.sentiment.overall} ({Math.round(v.sentiment.score * 100)}%)
                  </span>
                </div>
              </div>

              {/* Relevance Reasoning */}
              <div className="text-xs text-slate-600 font-medium">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Brand Relevance Reasoning</span>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 italic">"{v.business_relevance.reasoning}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Benefits Discussed */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Benefits Discussed
                  </h4>
                  {v.benefits_discussed.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No specific benefits highlighted in transcript.</p>
                  ) : (
                    <ul className="space-y-2">
                      {v.benefits_discussed.map((b, i) => (
                        <li key={i} className="text-xs text-slate-600 font-medium">
                          <p className="font-semibold text-slate-800">• {b.benefit}</p>
                          {b.evidence_snippet && (
                            <p className="text-[11px] text-slate-500 pl-3 mt-0.5 border-l-2 border-emerald-500/20 italic">
                              "{b.evidence_snippet}" {b.timestamp && <span className="text-[10px] text-emerald-600 font-mono">[{b.timestamp}]</span>}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Pain Points Discussed */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Pain Points & Drawbacks
                  </h4>
                  {v.pain_points.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No major pain points highlighted in transcript.</p>
                  ) : (
                    <ul className="space-y-2">
                      {v.pain_points.map((p, i) => (
                        <li key={i} className="text-xs text-slate-600 font-medium">
                          <p className="font-semibold text-slate-800">• {p.pain_point}</p>
                          {p.evidence_snippet && (
                            <p className="text-[11px] text-slate-500 pl-3 mt-0.5 border-l-2 border-amber-500/20 italic">
                              "{p.evidence_snippet}" {p.timestamp && <span className="text-[10px] text-amber-600 font-mono">[{p.timestamp}]</span>}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Scientific & General Claims Audited */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-600" /> Audited Scientific Claims
                  </h4>
                  {v.claims.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No specific scientific claims audited from this video.</p>
                  ) : (
                    <div className="space-y-3">
                      {v.claims.map((c, i) => (
                        <div key={i} className="text-xs p-3 border border-slate-100 bg-slate-50/50 rounded-xl space-y-1">
                          <p className="font-semibold text-slate-800">"{c.claim_text}"</p>
                          <div className="flex flex-wrap gap-1.5 py-0.5">
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded-sm">
                              {c.claim_type}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm ${c.evidence_supported ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                              {c.evidence_supported ? "Evidence Supported" : "Not Supported / Marketing"}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-sm">
                              Confidence: {c.confidence_level}
                            </span>
                          </div>
                          {c.supporting_notes && (
                            <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100/60 mt-1">
                              Verification Notes: {c.supporting_notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Consumer Questions Raised */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-indigo-600" /> Consumer Questions Raised
                  </h4>
                  {v.consumer_questions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No explicit consumer questions detected.</p>
                  ) : (
                    <ul className="space-y-2">
                      {v.consumer_questions.map((q, i) => (
                        <li key={i} className="text-xs text-slate-600 font-medium bg-indigo-50/30 border border-indigo-100/30 p-2.5 rounded-lg">
                          <p className="text-slate-800 font-semibold">❓ {q}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
    </div>
  );
}
