import React, { useState } from "react";
import { ReportSummary, VideoAnalysis } from "../types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FileText, Award, TrendingUp, AlertTriangle, Lightbulb, Video, ArrowUpDown, ChevronRight, Eye, ShieldAlert, Sparkles, Filter, CheckCircle2, Download, Check, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface ReportSummaryDashboardProps {
  report: ReportSummary;
  videos: VideoAnalysis[];
  onSelectVideo: (video: VideoAnalysis) => void;
  onExportPDF: () => void;
  apiStatus?: { geminiKeyConfigured: boolean; youtubeKeyConfigured: boolean } | null;
}

const COLORS = ["#059669", "#d97706", "#dc2626", "#475569"]; // Emerald, Amber, Rose, Slate

export default function ReportSummaryDashboard({
  report,
  videos,
  onSelectVideo,
  onExportPDF,
  apiStatus
}: ReportSummaryDashboardProps) {
  const [filterClass, setFilterClass] = useState("All");
  const [filterRelevance, setFilterRelevance] = useState("All");
  const [sortField, setSortField] = useState<"views" | "published_date" | "relevance_score">("views");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // State for aggregate claims browser
  const [claimTypeFilter, setClaimTypeFilter] = useState("All");
  const [claimStatusFilter, setClaimStatusFilter] = useState("All");
  const [claimSearch, setClaimSearch] = useState("");

  // Prepare data for sentiment chart
  const sentimentData = Object.entries(report.sentiment_breakdown)
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0);

  // Prepare data for benefits chart
  const benefitsData = report.top_benefits.map((b) => ({
    name: b.benefit.length > 22 ? b.benefit.substring(0, 22) + "..." : b.benefit,
    count: b.count,
    fullName: b.benefit
  }));

  // Prepare data for classification chart
  const classData = Object.entries(report.classification_counts).map(([name, count]) => ({
    name,
    count
  }));

  // Filter & Sort video lists
  const filteredVideos = videos
    .filter((v) => {
      const matchClass = filterClass === "All" || v.video_classification.includes(filterClass);
      const matchRelevance = filterRelevance === "All" || v.business_relevance.tier === filterRelevance;
      return matchClass && matchRelevance;
    })
    .sort((a, b) => {
      let multiplier = sortOrder === "desc" ? 1 : -1;
      if (sortField === "views") {
        return (b.views - a.views) * multiplier;
      } else if (sortField === "published_date") {
        return (new Date(b.published_date).getTime() - new Date(a.published_date).getTime()) * multiplier;
      } else if (sortField === "relevance_score") {
        return (b.business_relevance.score - a.business_relevance.score) * multiplier;
      }
      return 0;
    });

  const toggleSort = (field: "views" | "published_date" | "relevance_score") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getRelevanceBadge = (tier: "High" | "Medium" | "Low") => {
    if (tier === "High") return "bg-emerald-100 text-emerald-800 border-emerald-200/50";
    if (tier === "Medium") return "bg-amber-100 text-amber-800 border-amber-200/50";
    return "bg-slate-100 text-slate-700 border-slate-200/50";
  };

  const getSentimentBadge = (sentiment: "Positive" | "Neutral" | "Negative" | "Mixed") => {
    if (sentiment === "Positive") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (sentiment === "Neutral") return "bg-slate-50 text-slate-500 border-slate-100";
    if (sentiment === "Negative") return "bg-rose-50 text-rose-700 border-rose-100";
    return "bg-slate-50 text-slate-500 border-slate-100";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 pb-16">
      {/* Report Header Block */}
      <div className="bg-white border-b border-slate-200/80 pl-20 pr-4 sm:pr-8 py-5 sm:py-6 sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm shadow-slate-100">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase flex flex-wrap items-center gap-2">
            Market Intelligence Dashboard
            {apiStatus?.youtubeKeyConfigured ? (
              <span className="bg-emerald-50 text-emerald-800 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                YouTube v3 Live
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-slate-200 flex items-center gap-1">
                Interactive Scraped Mode
              </span>
            )}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 truncate" title={report.topic}>
            Topic Report: {report.topic}
          </h1>
        </div>
        <button
          onClick={onExportPDF}
          className="flex items-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all rounded-lg text-white font-medium text-sm shadow-sm w-full sm:w-auto justify-center flex-shrink-0"
        >
          <Download className="h-4 w-4" />
          Export Report as PDF
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* KPI Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Videos */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Videos Scoped</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{report.total_videos}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
              <Video className="h-5 w-5" />
            </div>
          </div>

          {/* High Relevance Counts */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Relevance</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{report.business_relevance_counts.High}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <Award className="h-5 w-5" />
            </div>
          </div>

          {/* Core Positive Sentiment */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Positive Tracks</span>
              <p className="text-2xl font-bold text-teal-600 mt-1">
                {report.total_videos > 0 ? Math.round(((report.sentiment_breakdown.Positive || 0) / report.total_videos) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          {/* Transcript Availability Rate */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transcript Coverage</span>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {report.total_videos > 0 ? Math.round((videos.filter(v => v.transcript_status === "available").length / report.total_videos) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Executive Summary & Strategic Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Executive Summary Card */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-4">
              <FileText className="h-4.5 w-4.5 text-slate-400" />
              Executive Research Summary
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {report.executive_summary}
            </p>
          </div>

          {/* Strategic Opportunities Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-4">
                <Lightbulb className="h-4.5 w-4.5 text-amber-500" />
                Uncovered Market Gaps
              </h3>
              <div className="space-y-3">
                {report.opportunities.map((opp, idx) => (
                  <div key={idx} className="flex gap-2.5">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 h-5 w-5 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-slate-600 text-xs leading-relaxed">{opp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Business Recommendations Card */}
        <div className="bg-white border border-emerald-200/50 bg-emerald-50/10 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-4">
            <Sparkles className="h-4.5 w-4.5 text-emerald-600" />
            Strategic Action Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.recommendations.map((rec, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-4 bg-white border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 self-start px-2 py-0.5 rounded-full">
                  Action 0{idx + 1}
                </span>
                <p className="text-slate-700 text-xs font-medium leading-relaxed mt-1">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Claims Verification Sentinel */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldAlert className="h-4.5 w-4.5 text-emerald-600" />
                  Clinical & Scientific Claims Sentinel
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Aggregated claims extracted from YouTube video transcripts and vetted against clinical alignment rules by the Gemini model.
              </p>
            </div>

            {/* Claims Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <input
                type="text"
                value={claimSearch}
                onChange={(e) => setClaimSearch(e.target.value)}
                placeholder="Search claims & notes..."
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-1.5 px-3 focus:border-emerald-500 outline-none w-full sm:flex-1 lg:w-44 font-sans"
              />
              <select
                value={claimTypeFilter}
                onChange={(e) => setClaimTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-1.5 px-2 focus:border-emerald-500 outline-none font-sans w-full sm:flex-1 lg:w-auto"
              >
                <option value="All">All Claim Types</option>
                <option value="Scientific">Scientific Only</option>
                <option value="Medical">Medical Only</option>
                <option value="Marketing">Marketing Only</option>
                <option value="Personal Experience">Personal Experience</option>
              </select>
              <select
                value={claimStatusFilter}
                onChange={(e) => setClaimStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-1.5 px-2 focus:border-emerald-500 outline-none font-sans w-full sm:flex-1 lg:w-auto"
              >
                <option value="All">All Statuses</option>
                <option value="Aligned">Evidence Aligned</option>
                <option value="Unsubstantiated">Unsubstantiated</option>
              </select>
            </div>
          </div>

          {/* Claims Counter Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Extracted Claims</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {videos.flatMap((v) => v.claims || []).length}
              </p>
            </div>
            <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-slate-200/60 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Clinical Evidence Aligned</span>
              <p className="text-xl font-bold text-emerald-600 mt-0.5">
                {videos.flatMap((v) => v.claims || []).filter(c => c.evidence_supported).length}
              </p>
            </div>
            <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-slate-200/60 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Unsubstantiated / Hype Claims</span>
              <p className="text-xl font-bold text-rose-600 mt-0.5">
                {videos.flatMap((v) => v.claims || []).filter(c => !c.evidence_supported).length}
              </p>
            </div>
          </div>

          {/* Claims Cards Grid */}
          {videos.flatMap((v) => (v.claims || []).map((c) => ({ ...c, videoTitle: v.title, channelName: v.channel_name, video: v }))).filter((c) => {
            const matchesType = claimTypeFilter === "All" || c.claim_type === claimTypeFilter;
            const matchesStatus =
              claimStatusFilter === "All" ||
              (claimStatusFilter === "Aligned" && c.evidence_supported) ||
              (claimStatusFilter === "Unsubstantiated" && !c.evidence_supported);
            const matchesSearch =
              c.claim_text.toLowerCase().includes(claimSearch.toLowerCase()) ||
              c.supporting_notes.toLowerCase().includes(claimSearch.toLowerCase()) ||
              c.videoTitle.toLowerCase().includes(claimSearch.toLowerCase());
            return matchesType && matchesStatus && matchesSearch;
          }).length === 0 ? (
            <div className="text-center py-12 bg-slate-50/30 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
              No matching audited claims found in this video scope.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
              {videos.flatMap((v) => (v.claims || []).map((c) => ({ ...c, videoTitle: v.title, channelName: v.channel_name, video: v }))).filter((c) => {
                const matchesType = claimTypeFilter === "All" || c.claim_type === claimTypeFilter;
                const matchesStatus =
                  claimStatusFilter === "All" ||
                  (claimStatusFilter === "Aligned" && c.evidence_supported) ||
                  (claimStatusFilter === "Unsubstantiated" && !c.evidence_supported);
                const matchesSearch =
                  c.claim_text.toLowerCase().includes(claimSearch.toLowerCase()) ||
                  c.supporting_notes.toLowerCase().includes(claimSearch.toLowerCase()) ||
                  c.videoTitle.toLowerCase().includes(claimSearch.toLowerCase());
                return matchesType && matchesStatus && matchesSearch;
              }).map((claim, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectVideo(claim.video)}
                  className="group hover:border-emerald-500/30 hover:shadow-md cursor-pointer transition-all duration-200 bg-white border border-slate-150 p-4 rounded-xl flex flex-col justify-between space-y-3.5 relative overflow-hidden"
                >
                  <div className="space-y-2">
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                        {claim.claim_type}
                      </span>

                      {claim.evidence_supported ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-100">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Evidence Aligned
                        </span>
                      ) : (
                        <span className="bg-rose-50 text-rose-700 text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-rose-100">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          Unsubstantiated
                        </span>
                      )}
                    </div>

                    {/* Claim text */}
                    <p className="text-slate-800 text-xs font-semibold leading-relaxed line-clamp-3">
                      "{claim.claim_text}"
                    </p>
                  </div>

                  {/* Supporting verify note from AI model */}
                  <div className="bg-slate-50 p-2.5 rounded-lg text-[11px] leading-relaxed text-slate-500 border border-slate-100/80">
                    <span className="font-bold text-slate-600 block text-[9px] uppercase tracking-wider mb-0.5">Verification Note:</span>
                    <p className="line-clamp-2">{claim.supporting_notes}</p>
                  </div>

                  {/* Source identifier line */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium gap-2">
                    <span className="truncate flex-1 min-w-0 group-hover:text-emerald-700 transition-all" title={claim.videoTitle}>
                      Source: {claim.videoTitle}
                    </span>
                    <span className="text-[9px] uppercase tracking-wide font-bold bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-700 px-1.5 py-0.5 rounded transition-all whitespace-nowrap flex-shrink-0">
                      Open Player →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recharts Analytics Charts Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Chart 1: Benefits Discussion Frequency */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col h-96">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase tracking-wider text-xs mb-4">
              Discussed Benefits Frequency (Videos)
            </h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benefitsData} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 5 }}>
                  <XAxis type="number" allowDecimals={false} stroke="#94a3b8" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={120} />
                  <Tooltip
                    formatter={(value: any, name: any, props: any) => [value, "Videos Discussed"]}
                    labelFormatter={(label, items) => items[0]?.payload?.fullName || label}
                  />
                  <Bar dataKey="count" fill="#059669" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Sentiment Distribution & Classification */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col h-auto min-h-[26rem] lg:min-h-[24rem]">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase tracking-wider text-xs mb-5 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Consumer Sentiment & Video Categories
            </h3>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center pb-2">
              
              {/* Sentiment Pie Section */}
              <div className="flex flex-col items-center justify-center h-full min-h-[220px] bg-slate-50/40 border border-slate-100 rounded-xl p-4">
                <div className="text-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audited Audience Sentiment</span>
                  {(() => {
                    const dominant = sentimentData.length > 0 
                      ? sentimentData.reduce((prev, current) => (prev.value > current.value ? prev : current), sentimentData[0]).name
                      : "Neutral";
                    const styles = 
                      dominant === "Positive" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      dominant === "Negative" ? "bg-rose-50 text-rose-700 border-rose-100" :
                      dominant === "Neutral" ? "bg-slate-100 text-slate-600 border-slate-200" :
                      "bg-amber-50 text-amber-700 border-amber-100";
                    return (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wide">
                        <span className="text-slate-500 font-normal lowercase">dominant:</span>
                        <span className={styles}>{dominant}</span>
                      </div>
                    );
                  })()}
                </div>

                <div className="h-36 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={55}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 justify-center text-[10px] font-semibold text-slate-500">
                  {sentimentData.map((entry, index) => (
                    <span key={entry.name} className="flex items-center gap-1 bg-white border border-slate-100 px-2 py-0.5 rounded-md shadow-2xs">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      {entry.name}: {entry.value}
                    </span>
                  ))}
                </div>
              </div>

              {/* Classification list */}
              <div className="flex flex-col justify-center gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Video Class Distribution</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{report.total_videos} Analyzed Videos</span>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(report.classification_counts).map(([cat, count]) => {
                    const pct = report.total_videos > 0 ? Math.round((count / report.total_videos) * 100) : 0;
                    
                    // Dynamic icon and color styling based on category name
                    const normalized = cat.toLowerCase();
                    let CatIcon = Video;
                    let colorClass = "text-slate-600 bg-slate-50 border-slate-150";
                    let barColor = "bg-emerald-600";
                    
                    if (normalized.includes("educational") || normalized.includes("science")) {
                      CatIcon = BookOpen;
                      colorClass = "text-blue-600 bg-blue-50 border-blue-100";
                      barColor = "bg-blue-600";
                    } else if (normalized.includes("doctor") || normalized.includes("expert") || normalized.includes("medical")) {
                      CatIcon = Award;
                      colorClass = "text-emerald-600 bg-emerald-50 border-emerald-100";
                      barColor = "bg-emerald-600";
                    } else if (normalized.includes("review") || normalized.includes("influencer")) {
                      CatIcon = Sparkles;
                      colorClass = "text-purple-600 bg-purple-50 border-purple-100";
                      barColor = "bg-purple-600";
                    } else if (normalized.includes("recipe") || normalized.includes("cook")) {
                      CatIcon = FileText;
                      colorClass = "text-amber-600 bg-amber-50 border-amber-100";
                      barColor = "bg-amber-500";
                    } else if (normalized.includes("news") || normalized.includes("alert")) {
                      CatIcon = ShieldAlert;
                      colorClass = "text-rose-600 bg-rose-50 border-rose-100";
                      barColor = "bg-rose-500";
                    }

                    return (
                      <div key={cat} className="flex items-start gap-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/60 p-2.5 rounded-xl transition-all">
                        <div className={`p-1.5 rounded-lg border ${colorClass} flex-shrink-0 flex items-center justify-center`}>
                          <CatIcon className="h-3.5 w-3.5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs mb-1 gap-2">
                            <span className="font-semibold text-slate-700 truncate flex-1 min-w-0" title={cat}>
                              {cat}
                            </span>
                            <span className="font-bold text-slate-900 font-mono text-[10px] bg-white px-1.5 py-0.5 border border-slate-100 rounded-md shadow-2xs whitespace-nowrap flex-shrink-0">
                              {count} {count === 1 ? "video" : "videos"} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${pct}%` }}
                              className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`} 
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Video Table Section with Controls */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Table Header Controls */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Video className="h-4.5 w-4.5 text-slate-400" />
              Analyzed Video Breakdown
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                Showing {filteredVideos.length} of {videos.length}
              </span>
            </h3>

             {/* Controls */}
             <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
               {/* Category Filter */}
               <div className="flex items-center gap-1.5 w-full sm:w-auto">
                 <Filter className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                 <select
                   value={filterClass}
                   onChange={(e) => setFilterClass(e.target.value)}
                   className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-1.5 px-2 focus:border-emerald-500 outline-none w-full sm:w-auto"
                 >
                   <option value="All">All Categories</option>
                   {Object.keys(report.classification_counts).map((cat) => (
                     <option key={cat} value={cat}>{cat}</option>
                   ))}
                 </select>
               </div>
 
               {/* Relevance Filter */}
               <select
                 value={filterRelevance}
                 onChange={(e) => setFilterRelevance(e.target.value)}
                 className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-1.5 px-2 focus:border-emerald-500 outline-none w-full sm:w-auto"
               >
                 <option value="All">All Relevance</option>
                 <option value="High">High Only</option>
                 <option value="Medium">Medium Only</option>
                 <option value="Low">Low Only</option>
               </select>
 
               {/* Sort field trigger */}
               <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-3 w-full sm:w-auto justify-end sm:justify-start">
                 <button
                   onClick={() => toggleSort("views")}
                   className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 flex-1 sm:flex-initial justify-center ${
                     sortField === "views" ? "bg-slate-900 text-white border-slate-950" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                   }`}
                 >
                   Views
                   <ArrowUpDown className="h-3 w-3" />
                 </button>
                 <button
                   onClick={() => toggleSort("relevance_score")}
                   className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 flex-1 sm:flex-initial justify-center ${
                     sortField === "relevance_score" ? "bg-slate-900 text-white border-slate-950" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                   }`}
                 >
                   Relevance
                   <ArrowUpDown className="h-3 w-3" />
                 </button>
               </div>
             </div>
          </div>

          {/* Actual Table */}
          {filteredVideos.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No videos match the current filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Video Details</th>
                    <th className="px-6 py-4">Relevance Index</th>
                    <th className="px-6 py-4">Category / Audience</th>
                    <th className="px-6 py-4">Sentiment</th>
                    <th className="px-6 py-4">Insights</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredVideos.map((v) => (
                    <tr key={v.video_id} className="hover:bg-slate-50/50 transition-all group">
                      {/* Video Detail Title & Thumb */}
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex gap-3">
                          <img
                            src={v.thumbnail_url}
                            alt="thumbnail"
                            className="h-12 w-20 object-cover rounded-lg flex-shrink-0 border border-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-slate-900 truncate leading-snug hover:text-emerald-700 cursor-pointer" onClick={() => onSelectVideo(v)}>
                              {v.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 truncate">{v.channel_name}</p>
                            <div className="flex gap-2 items-center text-[10px] text-slate-400 mt-1.5">
                              <span>{formatNumber(v.views)} views</span>
                              <span>•</span>
                              <span>{Math.round(v.duration_seconds / 60)}m length</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Relevance Score Card */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRelevanceBadge(v.business_relevance.tier)}`}>
                              {v.business_relevance.tier}
                            </span>
                            <span className="font-mono font-bold text-slate-700 text-[11px]">{v.business_relevance.score}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[150px]">{v.business_relevance.reasoning}</span>
                        </div>
                      </td>

                      {/* Class / Audience */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 max-w-[150px]">
                          <div className="flex flex-wrap gap-1">
                            {v.video_classification.slice(0, 2).map((cls) => (
                              <span key={cls} className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-medium">
                                {cls}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {v.audience_type.slice(0, 2).map((aud) => (
                              <span key={aud} className="bg-blue-50 text-blue-700 text-[9px] px-1.5 py-0.5 rounded font-medium">
                                {aud}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Sentiment Indices */}
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSentimentBadge(v.sentiment.overall)}`}>
                          {v.sentiment.overall}
                        </span>
                      </td>

                      {/* Summarized Quick Metrics */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-[10px] text-slate-500 font-medium">
                          <span>✅ {v.benefits_discussed.length} Benefits</span>
                          <span>⚠️ {v.pain_points.length} Pain Points</span>
                          <span>📜 {v.claims.length} Scientific Claims</span>
                        </div>
                      </td>

                      {/* Row Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onSelectVideo(v)}
                          className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="text-[11px] font-semibold">Verify</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Double check - Bottom Print Export as PDF per the absolute requirements */}
        <div className="pt-8 border-t border-slate-200/50 flex flex-col items-center gap-4 text-center">
          <p className="text-slate-400 text-xs leading-relaxed max-w-md">
            All extracted YouTube metrics, claims, and analysis coordinates are preserved in the export. Click below to generate your offline executive deck.
          </p>
          <button
            onClick={onExportPDF}
            className="flex items-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all rounded-xl text-white font-semibold text-sm shadow-sm"
          >
            <Download className="h-4.5 w-4.5" />
            Export Comprehensive Report (PDF)
          </button>
        </div>

      </div>
    </div>
  );
}
