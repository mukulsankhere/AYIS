/**
 * Shared Type Definitions for Agentic YouTube Intelligence System
 */

export interface BenefitDiscussed {
  benefit: string;
  evidence_snippet: string;
  timestamp: string; // e.g., "02:15"
}

export interface PainPoint {
  pain_point: string;
  evidence_snippet: string;
  timestamp?: string; // Optional timing anchor for objection
}

export interface Claim {
  claim_text: string;
  claim_type: "Scientific" | "Personal Experience" | "Marketing" | "Medical";
  confidence_level: "High" | "Medium" | "Low";
  evidence_supported: boolean;
  supporting_notes: string;
}

export interface VideoSentiment {
  overall: "Positive" | "Neutral" | "Negative" | "Mixed";
  score: number; // -1.0 to 1.0
}

export interface BusinessRelevance {
  score: number; // 0 to 100
  tier: "High" | "Medium" | "Low";
  reasoning: string;
}

export interface VideoAnalysis {
  video_id: string;
  title: string;
  channel_name: string;
  video_url: string;
  published_date: string;
  views: number;
  duration_seconds: number;
  thumbnail_url?: string;
  transcript_status: "available" | "unavailable";
  video_classification: string[];
  audience_type: string[];
  benefits_discussed: BenefitDiscussed[];
  pain_points: PainPoint[];
  consumer_questions: string[];
  claims: Claim[];
  sentiment: VideoSentiment;
  opportunities: string[];
  business_relevance: BusinessRelevance;
}

export interface ResearchRun {
  id: string;
  topic: string;
  search_prompts: string[];
  country: string;
  language: string;
  max_results: number;
  date_range: {
    from: string;
    to: string;
  };
  status: "idle" | "running" | "completed" | "failed";
  progress: {
    stage: number; // 1 to 7
    message: string;
    percent: number;
  };
  created_at: string;
  videos_count: number;
  error?: string;
  require_transcript?: boolean;
}

export interface ReportSummary {
  topic: string;
  total_videos: number;
  sentiment_breakdown: {
    Positive: number;
    Neutral: number;
    Negative: number;
    Mixed: number;
  };
  top_benefits: { benefit: string; count: number }[];
  top_pain_points: { pain_point: string; count: number }[];
  classification_counts: { [category: string]: number };
  audience_counts: { [audience: string]: number };
  opportunities: string[];
  business_relevance_counts: {
    High: number;
    Medium: number;
    Low: number;
  };
  executive_summary: string;
  recommendations: string[];
}
