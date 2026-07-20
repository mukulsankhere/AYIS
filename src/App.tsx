import React, { useState, useEffect, useRef } from "react";
import HistorySidebar from "./components/HistorySidebar";
import TopicSetup from "./components/TopicSetup";
import LiveProgress from "./components/LiveProgress";
import ReportSummaryDashboard from "./components/ReportSummaryDashboard";
import VideoDetailDrawer from "./components/VideoDetailDrawer";
import PrintableReport from "./components/PrintableReport";
import { ResearchRun, VideoAnalysis, ReportSummary } from "./types";
import { AlertCircle, Loader2, Sparkles, RefreshCw, ChevronLeft, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [runs, setRuns] = useState<ResearchRun[]>([]);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [activeRun, setActiveRun] = useState<ResearchRun | null>(null);
  const [activeReport, setActiveReport] = useState<ReportSummary | null>(null);
  const [activeVideos, setActiveVideos] = useState<VideoAnalysis[]>([]);
  
  const [apiStatus, setApiStatus] = useState<{ geminiKeyConfigured: boolean; youtubeKeyConfigured: boolean; geminiQuotaExhausted?: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoAnalysis | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth >= 1024 : true;
  });
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Load: Fetch history and API key status
  useEffect(() => {
    async function init() {
      try {
        const [historyRes, configRes] = await Promise.all([
          fetch("/api/topics/history"),
          fetch("/api/config-status")
        ]);

        if (historyRes.ok && configRes.ok) {
          const historyData = await historyRes.json() as ResearchRun[];
          const configData = await configRes.json();
          
          setRuns(historyData);
          setApiStatus(configData);

          // If runs exist, auto-select the first one
          if (historyData.length > 0) {
            handleSelectRun(historyData[0].id);
          } else {
            setShowNewForm(true);
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setErrorMsg("Failed to connect to the backend server. Please verify the server is running.");
      } finally {
        setLoading(false);
      }
    }

    init();
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // 2. Poll Active Run Progress
  useEffect(() => {
    if (activeRun && activeRun.status === "running") {
      // Start polling
      if (!pollIntervalRef.current) {
        pollIntervalRef.current = setInterval(async () => {
          try {
            const res = await fetch(`/api/runs/${activeRun.id}`);
            if (res.ok) {
              const runData = await res.json() as ResearchRun;
              
              // Update state
              setActiveRun(runData);
              setRuns((prev) => prev.map((r) => (r.id === runData.id ? runData : r)));

              // Check if pipeline is complete or failed
              if (runData.status === "completed" || runData.status === "failed") {
                if (pollIntervalRef.current) {
                  clearInterval(pollIntervalRef.current);
                  pollIntervalRef.current = null;
                }

                // Fetch final outputs
                if (runData.status === "completed") {
                  const [reportRes, videosRes, historyRes, configRes] = await Promise.all([
                    fetch(`/api/runs/${runData.id}/report`),
                    fetch(`/api/runs/${runData.id}/videos`),
                    fetch("/api/topics/history"),
                    fetch("/api/config-status")
                  ]);

                  if (reportRes.ok && videosRes.ok) {
                    const rData = await reportRes.json() as ReportSummary;
                    const vData = await videosRes.json() as VideoAnalysis[];
                    setActiveReport(rData);
                    setActiveVideos(vData);
                  }
                  
                  if (historyRes.ok) {
                    const hData = await historyRes.json();
                    setRuns(hData);
                  }

                  if (configRes.ok) {
                    const configData = await configRes.json();
                    setApiStatus(configData);
                  }
                } else if (runData.status === "failed") {
                  setErrorMsg(`Research Pipeline Failed: ${runData.progress.message || "Unknown analysis error."}`);
                }
              }
            }
          } catch (err) {
            console.error("Error polling run progress:", err);
          }
        }, 1500);
      }
    } else {
      // Clear polling if not running
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [activeRun]);

  // 3. Selection of a run
  const handleSelectRun = async (id: string) => {
    try {
      setErrorMsg(null);
      setActiveRunId(id);
      setShowNewForm(false);
      
      // Auto-collapse sidebar on smaller screens
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
      
      // Reset details first
      setActiveReport(null);
      setActiveVideos([]);

      const runRes = await fetch(`/api/runs/${id}`);
      if (!runRes.ok) return;
      const runData = await runRes.json() as ResearchRun;
      setActiveRun(runData);

      if (runData.status === "completed") {
        const [reportRes, videosRes] = await Promise.all([
          fetch(`/api/runs/${id}/report`),
          fetch(`/api/runs/${id}/videos`)
        ]);

        if (reportRes.ok && videosRes.ok) {
          const rData = await reportRes.json() as ReportSummary;
          const vData = await videosRes.json() as VideoAnalysis[];
          setActiveReport(rData);
          setActiveVideos(vData);
        }
      }
    } catch (err) {
      console.error("Failed to select run:", err);
      setErrorMsg("Failed to load run details.");
    }
  };

  // 4. Launching new research run
  const handleCreateRun = async (formData: {
    topic: string;
    search_prompts: string[];
    country: string;
    language: string;
    max_results: number;
    date_range: { from: string; to: string };
    require_transcript: boolean;
  }) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const res = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const newRun = await res.json() as ResearchRun;
        
        // Update states
        setRuns((prev) => [newRun, ...prev]);
        setActiveRunId(newRun.id);
        setActiveRun(newRun);
        setActiveReport(null);
        setActiveVideos([]);
        setShowNewForm(false);
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.error || "Failed to launch research run.");
      }
    } catch (err) {
      console.error("Failed to launch run:", err);
      setErrorMsg("Connection failure while starting run. Check server console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Deleting research run
  const handleDeleteRun = async (id: string) => {
    try {
      const res = await fetch(`/api/runs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRuns((prev) => prev.filter((r) => r.id !== id));
        if (activeRunId === id) {
          setActiveRunId(null);
          setActiveRun(null);
          setActiveReport(null);
          setActiveVideos([]);
          setShowNewForm(true);
        }
      }
    } catch (err) {
      console.error("Failed to delete run:", err);
    }
  };

  // 6. Navigate to clean form
  const handleNewResearchClick = () => {
    setActiveRunId(null);
    setActiveRun(null);
    setActiveReport(null);
    setActiveVideos([]);
    setShowNewForm(true);
    setErrorMsg(null);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Initializing YouTube Intelligence Applet...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#FAF9F6] flex overflow-hidden font-sans relative antialiased">
      {/* 1. PAST SESSIONS HISTORY PANEL */}
      <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "w-80 border-r border-slate-200/80 translate-x-0" : "w-0 overflow-hidden border-r-0 -translate-x-full lg:translate-x-0"} absolute lg:relative z-30 h-full bg-white`}>
        <HistorySidebar
          runs={runs}
          activeRunId={activeRunId}
          onSelectRun={handleSelectRun}
          onDeleteRun={handleDeleteRun}
          onNewResearch={handleNewResearchClick}
          apiStatus={apiStatus}
        />
      </div>

      {/* Backdrop overlay for mobile screen when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-25 transition-all duration-300 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. MAIN APPLICATION CONTENT VIEWPORTS */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Floating Collapsible Sidebar Trigger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-6 top-6 z-20 p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-emerald-700 rounded-lg shadow-sm transition-all flex items-center justify-center cursor-pointer"
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {/* Global Floating Error Alert Banner */}
        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3.5 text-xs font-semibold text-rose-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button 
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-rose-700 font-bold px-1"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex-1 overflow-hidden flex flex-col relative bg-slate-50/20">
          {showNewForm ? (
            /* Layout A: Form Topic Setup */
            <div className="flex-1 overflow-y-auto">
              <TopicSetup onSubmit={handleCreateRun} isSubmitting={isSubmitting} />
            </div>
          ) : activeRun ? (
            activeRun.status === "running" ? (
              /* Layout B: Realtime Stepper and Skeletons */
              <div className="flex-1 overflow-y-auto">
                <LiveProgress
                  topic={activeRun.topic}
                  stage={activeRun.progress.stage}
                  message={activeRun.progress.message}
                  percent={activeRun.progress.percent}
                />
              </div>
            ) : activeRun.status === "completed" && activeReport ? (
              /* Layout C: Complete BI Analytics Dashboard */
              <ReportSummaryDashboard
                report={activeReport}
                videos={activeVideos}
                onSelectVideo={(video) => setSelectedVideo(video)}
                onExportPDF={() => setIsPrinting(true)}
                apiStatus={apiStatus}
              />
            ) : activeRun.status === "failed" ? (
              /* Layout D: Run crashed state */
              <div className="max-w-md mx-auto my-auto text-center p-8 bg-white border border-rose-100 rounded-2xl shadow-sm space-y-4">
                <div className="p-3 bg-rose-50 rounded-full text-rose-600 inline-block">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Analysis Pipeline Failed</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The worker node crashed while analyzing {activeRun.topic}. This is usually caused by missing API credentials, rate-limiting, or private caption restrictions.
                </p>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-left text-[11px] text-rose-700 font-mono break-all leading-normal">
                  Error: {activeRun.error || "Check server terminal logs."}
                </div>
                <button
                  onClick={handleNewResearchClick}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-all"
                >
                  Configure New Research Run
                </button>
              </div>
            ) : (
              /* Loading report state fallback */
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
                <span className="text-xs text-slate-500 font-medium">Assembling database indexes...</span>
              </div>
            )
          ) : (
            /* Fallback screen if nothing selected */
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
              <div className="p-4 bg-emerald-50 rounded-full text-emerald-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">Agentic Market Intelligence System</h3>
              <p className="text-slate-400 text-xs max-w-sm">
                Select a completed topic from the history list, or launch a live agent scanner to extract clinical claims and objections.
              </p>
              <button
                onClick={handleNewResearchClick}
                className="py-2 px-4 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-all"
              >
                Create First Run
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. SIDE SHEET DETAIL DRAWER (SLIDES IN ON DEMAND) */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoDetailDrawer
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>

      {/* 4. PRINT-READY COVERAGE PREVIEW (INVOKED ON PRINT) */}
      {isPrinting && activeReport && (
        <PrintableReport
          report={activeReport}
          videos={activeVideos}
          onClose={() => setIsPrinting(false)}
        />
      )}
    </div>
  );
}
