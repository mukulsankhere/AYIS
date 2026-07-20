import React, { useState } from "react";
import { VideoAnalysis } from "../types";
import { X, Youtube, Star, ShieldCheck, Heart, AlertTriangle, HelpCircle, Lightbulb, Play, BookOpen, User, CheckCircle2, AlertOctagon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VideoDetailDrawerProps {
  video: VideoAnalysis | null;
  onClose: () => void;
}

export default function VideoDetailDrawer({ video, onClose }: VideoDetailDrawerProps) {
  if (!video) return null;

  const [activeTab, setActiveTab] = useState<"insights" | "claims" | "transcript">("insights");
  const [videoTime, setVideoTime] = useState<number>(0);
  const [autoplay, setAutoplay] = useState<number>(0);

  const playerRef = React.useRef<any>(null);
  const playerContainerId = `youtube-player-${video.video_id}`;

  // Helper to parse "02:15" -> 135 seconds
  const timestampToSeconds = (timestamp: string): number => {
    if (!timestamp) return 0;
    const parts = timestamp.split(":").map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  const handleSeek = (timestampStr: string) => {
    if (!timestampStr) return;
    const seconds = timestampToSeconds(timestampStr);
    setVideoTime(seconds);
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(seconds, true);
      playerRef.current.playVideo();
    } else {
      setAutoplay(1);
    }
  };

  // Reset playhead and initialize YouTube Player API on video change
  React.useEffect(() => {
    setVideoTime(0);
    setAutoplay(0);
    playerRef.current = null;

    let player: any = null;
    let isDestroyed = false;

    const initPlayer = () => {
      if (isDestroyed) return;
      const YT = (window as any).YT;
      if (YT && YT.Player && document.getElementById(playerContainerId)) {
        player = new YT.Player(playerContainerId, {
          height: "100%",
          width: "100%",
          videoId: video.video_id,
          playerVars: {
            autoplay: autoplay,
            start: videoTime,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (!isDestroyed) {
                playerRef.current = event.target;
              }
            },
          },
        });
      }
    };

    const YT = (window as any).YT;
    if (YT && YT.Player && typeof YT.Player === "function") {
      // Give a tiny timeout to ensure the container DOM element is fully painted
      const timer = setTimeout(initPlayer, 50);
      return () => {
        clearTimeout(timer);
        isDestroyed = true;
        if (player && typeof player.destroy === "function") {
          try { player.destroy(); } catch (e) {}
        }
        playerRef.current = null;
      };
    } else {
      // Inject API script if not present
      if (!document.getElementById("youtube-iframe-api-script")) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api-script";
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Hook callback and poll
      if (!(window as any).onYouTubeIframeAPIReady) {
        (window as any).onYouTubeIframeAPIReady = () => {
          initPlayer();
        };
      }

      const intervalId = setInterval(() => {
        const currentYT = (window as any).YT;
        if (currentYT && currentYT.Player && typeof currentYT.Player === "function") {
          clearInterval(intervalId);
          initPlayer();
        }
      }, 100);

      return () => {
        clearInterval(intervalId);
        isDestroyed = true;
        if (player && typeof player.destroy === "function") {
          try { player.destroy(); } catch (e) {}
        }
        playerRef.current = null;
      };
    }
  }, [video.video_id]);

  const getRelevanceColor = (tier: "High" | "Medium" | "Low") => {
    if (tier === "High") return "bg-emerald-50 text-emerald-800 border-emerald-100";
    if (tier === "Medium") return "bg-amber-50 text-amber-800 border-amber-100";
    return "bg-slate-50 text-slate-700 border-slate-100";
  };

  const getClaimBadgeColor = (type: string) => {
    switch (type) {
      case "Scientific": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Medical": return "bg-rose-50 text-rose-700 border-rose-100";
      case "Marketing": return "bg-amber-50 text-amber-700 border-amber-100";
      default: return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const getConfidenceBadge = (confidence: "High" | "Medium" | "Low") => {
    if (confidence === "High") return "bg-emerald-100 text-emerald-800";
    if (confidence === "Medium") return "bg-amber-100 text-amber-800";
    return "bg-rose-100 text-rose-800";
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Drawer body */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 180 }}
          className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <Youtube className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate max-w-[400px]">Video AI Analysis</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{video.channel_name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto">
            
            {/* Embedded YouTube Player */}
            <div className="relative aspect-video w-full bg-black shadow-inner overflow-hidden">
              <div 
                id={playerContainerId}
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Video Meta info */}
            <div className="p-6 border-b border-slate-100">
              <h1 className="text-base font-bold text-slate-900 leading-snug">{video.title}</h1>
              <div className="flex flex-wrap gap-2.5 items-center mt-3 text-xs text-slate-400 font-medium">
                <span>By {video.channel_name}</span>
                <span>•</span>
                <span>{video.views.toLocaleString()} views</span>
                <span>•</span>
                <span>{new Date(video.published_date).toLocaleDateString()}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${video.transcript_status === "available" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                  Transcript {video.transcript_status}
                </span>
              </div>
            </div>

            {/* Segment tabs */}
            <div className="border-b border-slate-100 bg-slate-50/50 flex px-6">
              <button
                onClick={() => setActiveTab("insights")}
                className={`py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "insights" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-400 hover:text-slate-600"
                } mr-6`}
              >
                Core Insights & Context
              </button>
              <button
                onClick={() => setActiveTab("claims")}
                className={`py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "claims" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-400 hover:text-slate-600"
                } mr-6`}
              >
                Scientific claims ({video.claims.length})
              </button>
              <button
                onClick={() => setActiveTab("transcript")}
                className={`py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "transcript" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Questions & Opportunities
              </button>
            </div>

            {/* Tab Panes */}
            <div className="p-6 space-y-6">
              
              {/* TAB 1: INSIGHTS & CONTEXT */}
              {activeTab === "insights" && (
                <>
                  {/* Business Relevance Box */}
                  <div className={`p-4 rounded-xl border flex flex-col gap-2 ${getRelevanceColor(video.business_relevance.tier)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Business Relevance Index
                      </span>
                      <div className="flex items-center gap-1 font-mono font-bold">
                        <span>Score: {video.business_relevance.score}</span>
                        <span className="text-[10px] font-semibold">({video.business_relevance.tier})</span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed mt-1 font-medium">{video.business_relevance.reasoning}</p>
                  </div>

                  {/* Classification & Audience grids */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Classification */}
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        Classification Taxonomy
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {video.video_classification.map((cls) => (
                          <span key={cls} className="bg-white text-slate-700 text-[10px] px-2.5 py-1 border border-slate-150 rounded-md font-medium">
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Audience */}
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        Audience Segment
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {video.audience_type.map((aud) => (
                          <span key={aud} className="bg-white text-slate-700 text-[10px] px-2.5 py-1 border border-slate-150 rounded-md font-medium">
                            {aud}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Benefits Discussed Block */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-rose-500" />
                      Discussed Benefits (Click time to play)
                    </h4>
                    {video.benefits_discussed.length === 0 ? (
                      <p className="text-slate-400 text-xs italic">No specific benefits extracted.</p>
                    ) : (
                      <div className="space-y-3">
                        {video.benefits_discussed.map((benefit, idx) => (
                          <div key={idx} className="p-3 bg-white border border-slate-100 rounded-lg flex flex-col gap-1 shadow-xs hover:border-emerald-100 transition-all">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-slate-900 text-xs">{benefit.benefit}</span>
                              {benefit.timestamp && (
                                <button 
                                  onClick={() => handleSeek(benefit.timestamp)}
                                  className="font-mono text-[9px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 hover:border-emerald-200 px-2 py-0.5 rounded font-extrabold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                                  title={`Play from ${benefit.timestamp}`}
                                >
                                  <Play className="h-2 w-2 fill-emerald-600 stroke-none" />
                                  {benefit.timestamp}
                                </button>
                              )}
                            </div>
                            <p className="text-slate-500 text-xs italic leading-relaxed mt-1">
                              "{benefit.evidence_snippet}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pain Points Discussed Block */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      Pain Points & Consumer Objections
                    </h4>
                    {video.pain_points.length === 0 ? (
                      <p className="text-slate-400 text-xs italic">No active consumer pain points extracted.</p>
                    ) : (
                      <div className="space-y-3">
                        {video.pain_points.map((p, idx) => (
                          <div key={idx} className="p-3 bg-white border border-slate-100 rounded-lg flex flex-col gap-1 shadow-xs hover:border-amber-100 transition-all">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-slate-900 text-xs">{p.pain_point}</span>
                              {p.timestamp && (
                                <button 
                                  onClick={() => handleSeek(p.timestamp)}
                                  className="font-mono text-[9px] bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 hover:border-amber-200 px-2 py-0.5 rounded font-extrabold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                                  title={`Play from ${p.timestamp}`}
                                >
                                  <Play className="h-2 w-2 fill-amber-600 stroke-none" />
                                  {p.timestamp}
                                </button>
                              )}
                            </div>
                            <p className="text-slate-500 text-xs italic leading-relaxed mt-1">
                              "{p.evidence_snippet}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* TAB 2: CLAIMS AUDIT */}
              {activeTab === "claims" && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-slate-500 leading-relaxed">
                      Our intelligence model audits claims made in the content, classifications their type, and checks if they align with general scientific literature.
                    </div>
                  </div>

                  {video.claims.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs italic">
                      No primary health or marketing claims audited from this video context.
                    </div>
                  ) : (
                    video.claims.map((claim, idx) => (
                      <div key={idx} className="border border-slate-100 rounded-xl p-4 space-y-3.5 shadow-xs bg-white">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getClaimBadgeColor(claim.claim_type)}`}>
                              {claim.claim_type} Claim
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${getConfidenceBadge(claim.confidence_level)}`}>
                              {claim.confidence_level} Confidence
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {claim.evidence_supported ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <CheckCircle2 className="h-3 w-3" />
                                Evidence Aligned
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                                <AlertOctagon className="h-3 w-3" />
                                Unsubstantiated
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-slate-800 text-xs font-semibold leading-relaxed">
                            "{claim.claim_text}"
                          </p>
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs mt-3.5">
                            <span className="font-bold text-slate-600 block text-[10px] uppercase tracking-wider mb-1">Scientific Verification Note:</span>
                            <p className="text-slate-500 text-xs leading-relaxed">{claim.supporting_notes}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: QUESTIONS & OPPORTUNITIES */}
              {activeTab === "transcript" && (
                <>
                  {/* Consumer Questions */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-blue-500" />
                      Active Consumer Inquiries
                    </h4>
                    {video.consumer_questions.length === 0 ? (
                      <p className="text-slate-400 text-xs italic">No consumer questions found.</p>
                    ) : (
                      <div className="space-y-2">
                        {video.consumer_questions.map((q, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex gap-2.5">
                            <span className="text-blue-500 font-bold">Q:</span>
                            <p>{q}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Opportunities */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                      Unlocked Business Opportunities
                    </h4>
                    {video.opportunities.length === 0 ? (
                      <p className="text-slate-400 text-xs italic">No opportunities flagged.</p>
                    ) : (
                      <div className="space-y-2">
                        {video.opportunities.map((opp, idx) => (
                          <div key={idx} className="p-3 bg-emerald-50/10 border border-emerald-100/40 rounded-xl text-xs font-medium text-slate-700 flex gap-2.5">
                            <span className="text-emerald-600">💡</span>
                            <p className="leading-relaxed">{opp}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>
          </div>
        </motion.div>
      </div>
  );
}
