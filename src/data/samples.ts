import { VideoAnalysis, ReportSummary } from "../types";

export interface SampleTopic {
  topic: string;
  search_prompts: string[];
  report: ReportSummary;
  videos: VideoAnalysis[];
}

export const SAMPLE_TOPICS: { [key: string]: SampleTopic } = {
  millets: {
    topic: "Millets",
    search_prompts: [
      "Benefits of Millets",
      "Millets vs Rice Nutrition",
      "Millet diabetes benefits",
      "Why eat millets daily"
    ],
    report: {
      topic: "Millets",
      total_videos: 5,
      sentiment_breakdown: {
        Positive: 4,
        Neutral: 1,
        Negative: 0,
        Mixed: 0
      },
      top_benefits: [
        { benefit: "Low Glycemic Index / Diabetes Control", count: 5 },
        { benefit: "High Dietary Fiber & Gut Health", count: 4 },
        { benefit: "Rich in Essential Minerals (Iron, Calcium, Magnesium)", count: 4 },
        { benefit: "Gluten-Free Alternative to Wheat", count: 3 },
        { benefit: "High Antioxidant Content", count: 2 }
      ],
      top_pain_points: [
        { pain_point: "Requires overnight soaking or longer cooking times", count: 4 },
        { pain_point: "Slightly bitter or earthy taste which children may reject", count: 3 },
        { pain_point: "Can cause thyroid issues (goitrogenic properties) if consumed raw/excessively", count: 2 },
        { pain_point: "Lower availability in standard western supermarkets", count: 2 }
      ],
      classification_counts: {
        "Educational": 3,
        "Doctor / Expert Opinion": 2,
        "Influencer Review": 1,
        "Recipe / Cooking": 1
      },
      audience_counts: {
        "Consumers": 5,
        "Diabetics": 3,
        "Nutritionists": 2,
        "Fitness Enthusiasts": 2
      },
      opportunities: [
        "Development of instant-cook or pre-soaked millet products to eliminate the 8-hour soaking barrier.",
        "Creating child-friendly millet-based snacks (puffs, cookies, noodles) to address the taste objection.",
        "Educational marketing focusing on the specific benefits of Ragi (Finger Millet) for calcium and Bajra (Pearl Millet) for iron.",
        "Formulating multi-millet flour blends that mimic the elasticity of wheat for easier baking."
      ],
      business_relevance_counts: {
        High: 3,
        Medium: 2,
        Low: 0
      },
      executive_summary: "The consumer and scientific conversation around Millets is overwhelmingly positive, driven by a growing global focus on metabolic health and diabetes management. Experts and nutritionists heavily promote millets as a superior, gluten-free alternative to rice and wheat due to their low glycemic index and high dietary fiber. However, significant product adoption barriers persist, particularly concerning preparation complexity (soaking requirements) and palatability. Brands that can innovate in the 'instant-ready' or pre-treated millet space stand to capture a highly lucrative and health-conscious consumer demographic.",
      recommendations: [
        "Launch a line of pre-soaked, quick-cooking millet grains to solve the primary consumer pain point of preparation time.",
        "Create high-energy, Ragi-based breakfast cereals targeted at parents seeking nutritious, gluten-free options for children.",
        "Partner with endocrinologists and metabolic health influencers to produce content showing how replacing rice with Foxtail millet stabilizes blood sugar."
      ]
    },
    videos: [
      {
        video_id: "qY_tI0-yB20",
        title: "Why Millets are the Ultimate Superfood | Full Nutritional Breakdown",
        channel_name: "Dr. Rachel's Health Guide",
        video_url: "https://www.youtube.com/watch?v=qY_tI0-yB20",
        published_date: "2026-05-12T10:00:00Z",
        views: 145000,
        duration_seconds: 642,
        thumbnail_url: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=300&auto=format&fit=crop",
        transcript_status: "available",
        video_classification: ["Educational", "Doctor / Expert Opinion"],
        audience_type: ["Consumers", "Diabetics", "Nutritionists"],
        benefits_discussed: [
          { benefit: "Diabetes Control", evidence_snippet: "Millets have a very low glycemic index, meaning they release glucose slowly into the bloodstream, preventing those dangerous insulin spikes.", timestamp: "02:15" },
          { benefit: "High Fiber", evidence_snippet: "With twice the fiber of white rice, millets promote a healthy gut microbiome and long-term satiety.", timestamp: "04:30" }
        ],
        pain_points: [
          { pain_point: "Preparation Time", evidence_snippet: "You cannot just boil millets like rice. They require at least 6 to 8 hours of soaking to break down the phytic acid." }
        ],
        consumer_questions: [
          "Can I eat millets for all three meals?",
          "Are millets safe for people with thyroid issues?"
        ],
        claims: [
          {
            claim_text: "Replacing white rice with Foxtail millet for 3 months reduces HbA1c levels significantly.",
            claim_type: "Medical",
            confidence_level: "High",
            evidence_supported: true,
            supporting_notes: "Multiple clinical trials support that whole grain millets improve insulin sensitivity."
          }
        ],
        sentiment: { overall: "Positive", score: 0.85 },
        opportunities: ["Create a pre-soaked or steamed ready-to-heat millet pack for busy professionals."],
        business_relevance: {
          score: 95,
          tier: "High",
          reasoning: "Directly validates the medical and nutritional claims of our target millet products."
        }
      },
      {
        video_id: "295_L3gWnsc",
        title: "I Replaced Rice with Millets for 30 Days (Real Results!)",
        channel_name: "Fitness Explorer",
        video_url: "https://www.youtube.com/watch?v=295_L3gWnsc",
        published_date: "2026-06-01T08:30:00Z",
        views: 320000,
        duration_seconds: 780,
        thumbnail_url: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=300&auto=format&fit=crop",
        transcript_status: "available",
        video_classification: ["Influencer Review", "Lifestyle"],
        audience_type: ["Consumers", "Fitness Enthusiasts"],
        benefits_discussed: [
          { benefit: "Weight Loss", evidence_snippet: "I felt full for much longer. I didn't get those 4 PM sugar cravings because my energy levels stayed completely flat.", timestamp: "05:10" },
          { benefit: "Gluten-Free", evidence_snippet: "My bloating completely disappeared after week one, proving how great a gluten-free diet can be.", timestamp: "03:40" }
        ],
        pain_points: [
          { pain_point: "Earthy Taste", evidence_snippet: "Honestly, the taste is very dry and earthy at first. It takes some getting used to if you're used to fluffy jasmine rice." }
        ],
        consumer_questions: [
          "How do you cook millets so they aren't sticky?",
          "What is the best millet for weight loss?"
        ],
        claims: [
          {
            claim_text: "Millets completely cure gluten sensitivity in 30 days.",
            claim_type: "Personal Experience",
            confidence_level: "Medium",
            evidence_supported: false,
            supporting_notes: "While they eliminate gluten intake, they don't 'cure' underlying celiac disease."
          }
        ],
        sentiment: { overall: "Positive", score: 0.70 },
        opportunities: ["Developing tastier millet recipes or seasoning mixes designed specifically for savory millet bowls."],
        business_relevance: {
          score: 82,
          tier: "High",
          reasoning: "Highlights consumer taste resistance and weight-loss motivations, valuable for branding."
        }
      },
      {
        video_id: "kG9G3vW4vXQ",
        title: "How to Cook Perfect Fluffy Millets - Indian Recipe Tutorial",
        channel_name: "The Organic Kitchen",
        video_url: "https://www.youtube.com/watch?v=kG9G3vW4vXQ",
        published_date: "2026-04-18T14:15:00Z",
        views: 89000,
        duration_seconds: 412,
        thumbnail_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop",
        transcript_status: "available",
        video_classification: ["Recipe / Cooking", "Educational"],
        audience_type: ["Consumers"],
        benefits_discussed: [
          { benefit: "Versatility in cooking", evidence_snippet: "You can make pulao, porridge, or even grind it into flour for soft rotis.", timestamp: "01:20" }
        ],
        pain_points: [
          { pain_point: "Cooking Complexity", evidence_snippet: "If you don't get the water ratio exactly right, millets either turn into a mushy paste or remain hard as pebbles." }
        ],
        consumer_questions: [
          "Can we mix different types of millets together?",
          "Do you cook ragi the same way as foxtail millet?"
        ],
        claims: [
          {
            claim_text: "Soaking millets for 8 hours is essential to deactivate enzyme inhibitors.",
            claim_type: "Scientific",
            confidence_level: "High",
            evidence_supported: true,
            supporting_notes: "Soaking reduces phytates and lectins, which increases mineral absorption."
          }
        ],
        sentiment: { overall: "Positive", score: 0.90 },
        opportunities: ["Launch a multi-millet flour blend that is formulated to rise and bake easily like wheat flour."],
        business_relevance: {
          score: 65,
          tier: "Medium",
          reasoning: "Great culinary insights, highlighting the need for easy-to-cook formulations."
        }
      },
      {
        video_id: "7Xp6C2XfUxo",
        title: "Why Doctors Recommend Millets for Diabetes Patients",
        channel_name: "Dr. Sunil's Clinic",
        video_url: "https://www.youtube.com/watch?v=7Xp6C2XfUxo",
        published_date: "2026-02-10T09:00:00Z",
        views: 450000,
        duration_seconds: 580,
        thumbnail_url: "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?q=80&w=300&auto=format&fit=crop",
        transcript_status: "available",
        video_classification: ["Doctor / Expert Opinion", "Educational"],
        audience_type: ["Diabetics", "Elderly", "Consumers"],
        benefits_discussed: [
          { benefit: "Glycemic control", evidence_snippet: "Millets have slow-release carbohydrates. This helps maintain stable HbA1c levels, which is crucial for diabetic patients.", timestamp: "03:10" },
          { benefit: "Mineral rich", evidence_snippet: "High in magnesium, which directly helps in insulin secretion and metabolic efficiency.", timestamp: "05:45" }
        ],
        pain_points: [
          { pain_point: "Thyroid warning", evidence_snippet: "People with hypothyroidism should consume millets in moderation, as certain millets contain goitrogens." }
        ],
        consumer_questions: [
          "Is Ragi safe for thyroid patients?",
          "How many grams of millets should a diabetic eat per day?"
        ],
        claims: [
          {
            claim_text: "Eating Pearl Millet (Bajra) helps cure iron deficiency anemia.",
            claim_type: "Medical",
            confidence_level: "High",
            evidence_supported: true,
            supporting_notes: "Pearl millet is exceptionally high in bioavailable iron compared to other grains."
          }
        ],
        sentiment: { overall: "Neutral", score: 0.50 },
        opportunities: ["Develop goitrogen-free or fermented millet products that are safer for thyroid patients."],
        business_relevance: {
          score: 92,
          tier: "High",
          reasoning: "Crucial medical guidelines that we must represent in our product warning labels and ingredient sourcing."
        }
      },
      {
        video_id: "e-eG_Rj8Rcs",
        title: "Millet Farming: The Climate-Resilient Future of Agriculture",
        channel_name: "Green Earth Agritech",
        video_url: "https://www.youtube.com/watch?v=e-eG_Rj8Rcs",
        published_date: "2026-03-24T11:30:00Z",
        views: 52000,
        duration_seconds: 940,
        thumbnail_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=300&auto=format&fit=crop",
        transcript_status: "available",
        video_classification: ["Educational", "Documentary"],
        audience_type: ["Farmers", "Food Manufacturers"],
        benefits_discussed: [
          { benefit: "Low water consumption", evidence_snippet: "Millets require up to 70% less water than rice and grow in poor, dry soil, making them perfect for climate change adaptation.", timestamp: "04:15" },
          { benefit: "Short growing cycle", evidence_snippet: "They can be harvested in just 60 to 90 days, allowing farmers to grow multiple crops.", timestamp: "07:20" }
        ],
        pain_points: [
          { pain_point: "Low market price", evidence_snippet: "Despite being environmentally friendly, procurement prices for farmers are low due to weak commercial supply chains." }
        ],
        consumer_questions: [
          "Where can I buy direct-from-farmer millets?",
          "Are these millets organically certified?"
        ],
        claims: [
          {
            claim_text: "Millets can survive severe droughts that would completely destroy rice or corn crops.",
            claim_type: "Scientific",
            confidence_level: "High",
            evidence_supported: true,
            supporting_notes: "Millets are C4 grasses with superior water-use efficiency and heat tolerance."
          }
        ],
        sentiment: { overall: "Positive", score: 0.80 },
        opportunities: ["Direct-to-consumer ethical sourcing partnerships with millet farming cooperatives to command premium pricing."],
        business_relevance: {
          score: 58,
          tier: "Medium",
          reasoning: "Excellent for environmental sustainability claims and raw material sourcing security."
        }
      }
    ]
  },
  aloe_vera: {
    topic: "Aloe Vera",
    search_prompts: [
      "Aloe Vera benefits",
      "Is drinking Aloe Vera safe",
      "Aloe Vera skincare scientific review"
    ],
    report: {
      topic: "Aloe Vera",
      total_videos: 4,
      sentiment_breakdown: {
        Positive: 2,
        Neutral: 1,
        Negative: 1,
        Mixed: 0
      },
      top_benefits: [
        { benefit: "Skin hydration and sunburn soothing", count: 4 },
        { benefit: "Digestive relief and acid reflux reduction", count: 3 },
        { benefit: "Anti-inflammatory and wound healing properties", count: 2 },
        { benefit: "Hair growth and scalp health", count: 2 }
      ],
      top_pain_points: [
        { pain_point: "Laxative toxicity (Aloin) in raw yellow latex", count: 3 },
        { pain_point: "Sticky, messy texture of fresh home-harvested gel", count: 2 },
        { pain_point: "Short shelf life and oxidation of natural gel", count: 2 },
        { pain_point: "Pungent, bitter taste of pure juice", count: 2 }
      ],
      classification_counts: {
        "Educational": 2,
        "Doctor / Expert Opinion": 2,
        "Influencer Review": 1,
        "Lifestyle": 1
      },
      audience_counts: {
        "Consumers": 4,
        "Nutritionists": 1,
        "Doctors": 1
      },
      opportunities: [
        "Aloin-free certified drinking juices targeting acid reflux sufferers with pleasant natural flavors (e.g., peach, ginger).",
        "Formulating cosmetic gel that retains 100% natural efficacy but absorbs cleanly without standard stickiness.",
        "On-the-go organic aloe soothing sprays for travel and beach bags."
      ],
      business_relevance_counts: {
        High: 2,
        Medium: 1,
        Low: 1
      },
      executive_summary: "Aloe Vera represents a dual-market goldmine covering both topical skincare and digestive beverages. On the topical side, consumer enthusiasm is high and undisputed. However, the ingestion market is highly fragmented and plagued by safety concerns regarding Aloin toxicity. Brands that offer certified aloin-free, pleasant-tasting digestive aloe formulas can capture a major market of digestive-health seekers.",
      recommendations: [
        "Develop an aloin-free certified Aloe beverage blended with ginger or mint to target acid reflux and GERD.",
        "Market a fast-absorbing, non-sticky Aloe gel utilizing natural gelling agents to solve the stickiness pain point.",
        "Educate consumers on the difference between the soothing inner leaf gel and the toxic outer leaf latex."
      ]
    },
    videos: [
      {
        video_id: "1HMCgT0P7eU",
        title: "The Dangerous Side of Drinking Aloe Vera Gel",
        channel_name: "Scientific Health Review",
        video_url: "https://www.youtube.com/watch?v=1HMCgT0P7eU",
        published_date: "2026-04-10T15:00:00Z",
        views: 280000,
        duration_seconds: 520,
        thumbnail_url: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=300&auto=format&fit=crop",
        transcript_status: "available",
        video_classification: ["Educational", "Doctor / Expert Opinion"],
        audience_type: ["Consumers", "Doctors"],
        benefits_discussed: [
          { benefit: "Acid reflux relief", evidence_snippet: "Purified, decolorized aloe vera juice has been shown to reduce heartburn symptoms without adverse side effects.", timestamp: "03:45" }
        ],
        pain_points: [
          { pain_point: "Aloin toxicity", evidence_snippet: "The yellow sap right underneath the leaf skin contains Aloin, a powerful laxative that can cause severe diarrhea, electrolyte loss, and kidney damage if consumed regularly.", timestamp: "01:50" }
        ],
        consumer_questions: [
          "How do I remove the yellow sap from aloe at home?",
          "Are commercial aloe juices safe to drink daily?"
        ],
        claims: [
          {
            claim_text: "Raw unpurified aloe latex causes cancer and liver damage upon long-term ingestion.",
            claim_type: "Medical",
            confidence_level: "High",
            evidence_supported: true,
            supporting_notes: "Classified as potentially carcinogenic by WHO due to the laxative compound aloin."
          }
        ],
        sentiment: { overall: "Negative", score: -0.60 },
        opportunities: ["Commercial opportunity for brands to prominently display 'Certified Aloin-Free' on bottle labels."],
        business_relevance: {
          score: 88,
          tier: "High",
          reasoning: "Extremely critical safety guardrails. We must ensure our product is 100% decolorized and aloin-free."
        }
      },
      {
        video_id: "9NEXX_SgRxs",
        title: "Science-Backed Benefits of Aloe Vera for Skin and Hair",
        channel_name: "Dermatology Decoded",
        video_url: "https://www.youtube.com/watch?v=9NEXX_SgRxs",
        published_date: "2026-05-20T11:00:00Z",
        views: 195000,
        duration_seconds: 430,
        thumbnail_url: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?q=80&w=300&auto=format&fit=crop",
        transcript_status: "available",
        video_classification: ["Educational", "Doctor / Expert Opinion"],
        audience_type: ["Consumers"],
        benefits_discussed: [
          { benefit: "Wound and Burn Healing", evidence_snippet: "Aloe accelerates skin regeneration by stimulating fibroblasts and collagen synthesis, healing minor burns 9 days faster.", timestamp: "02:10" },
          { benefit: "Hydration", evidence_snippet: "Rich in mucopolysaccharides, which help bind moisture into the skin.", timestamp: "04:30" }
        ],
        pain_points: [
          { pain_point: "Short shelf life", evidence_snippet: "Fresh gel oxidizes and turns brown in 2 days, losing all its beneficial vitamins." }
        ],
        consumer_questions: [
          "Does aloe fade acne scars?",
          "Is store-bought aloe gel as good as the raw plant?"
        ],
        claims: [
          {
            claim_text: "Applying aloe vera to the scalp completely halts hair loss and triggers new hair follicles.",
            claim_type: "Marketing",
            confidence_level: "Low",
            evidence_supported: false,
            supporting_notes: "It relieves dry scalp and itching, but there is no scientific evidence that it reverses genetic hair loss."
          }
        ],
        sentiment: { overall: "Positive", score: 0.80 },
        opportunities: ["Formulate stabilized, cold-processed organic aloe gels that do not require aggressive chemical preservatives."],
        business_relevance: {
          score: 90,
          tier: "High",
          reasoning: "Validates our cosmetic Aloe formulation and identifies preservation as a key selling point."
        }
      }
    ]
  },
  protein_powder: {
    topic: "Protein Powder",
    search_prompts: [
      "Is protein powder bad for kidneys",
      "Plant protein vs Whey protein",
      "Which protein powder is best"
    ],
    report: {
      topic: "Protein Powder",
      total_videos: 3,
      sentiment_breakdown: {
        Positive: 2,
        Neutral: 1,
        Negative: 0,
        Mixed: 0
      },
      top_benefits: [
        { benefit: "Muscle synthesis and hypertrophy", count: 3 },
        { benefit: "Convenience and rapid meal-replacement", count: 3 },
        { benefit: "Satiety and weight-management", count: 2 }
      ],
      top_pain_points: [
        { pain_point: "Heavy metals contamination in cheaper powders", count: 3 },
        { pain_point: "Bloating and digestive discomfort from lactose/whey", count: 2 },
        { pain_point: "Chalky texture and earthy flavor of plant proteins", count: 2 },
        { pain_point: "Artificial sweeteners and fillers", count: 2 }
      ],
      classification_counts: {
        "Educational": 1,
        "Doctor / Expert Opinion": 1,
        "Influencer Review": 1
      },
      audience_counts: {
        "Consumers": 3,
        "Fitness Enthusiasts": 3,
        "Nutritionists": 1
      },
      opportunities: [
        "Developing clean-label plant protein without artificial sweeteners or thickeners.",
        "Third-party certified heavy-metal-free whey isolates targeting safety-conscious gym-goers.",
        "Digestive-enzyme-infused protein powders to solve the bloating pain point."
      ],
      business_relevance_counts: {
        High: 2,
        Medium: 1,
        Low: 0
      },
      executive_summary: "The protein powder market is shifting rapidly from pure bodybuilding demographics to mainstream health seekers. While Whey remain the gold standard for amino acid profile, lactose intolerance and bloating are driving huge adoption of plant-based proteins. However, plant proteins suffer from poor texture (chalkiness) and heavy metal concerns. Delivering a delicious, digestively optimized, clean-label plant protein is the single biggest market opportunity.",
      recommendations: [
        "Launch an organic, non-chalky plant protein blend (Pea, Rice, Sacha Inchi) flavored with real cocoa.",
        "Prominently market 'Tested for Heavy Metals' and 'Zero Bloating' on packaging to solve major buyer fears.",
        "Incorporate digestive enzymes (Bromelain and Papain) to guarantee easy digestability."
      ]
    },
    videos: [
      {
        video_id: "P2M1f_512yA",
        title: "The Truth About Heavy Metals in Protein Powders",
        channel_name: "Clean Label Project",
        video_url: "https://www.youtube.com/watch?v=P2M1f_512yA",
        published_date: "2026-03-05T12:00:00Z",
        views: 310000,
        duration_seconds: 610,
        thumbnail_url: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=300&auto=format&fit=crop",
        transcript_status: "available",
        video_classification: ["Educational", "News"],
        audience_type: ["Consumers", "Fitness Enthusiasts"],
        benefits_discussed: [
          { benefit: "Muscle repair", evidence_snippet: "Proteins are vital for tissue building, but not all protein powders are created clean.", timestamp: "01:05" }
        ],
        pain_points: [
          { pain_point: "Heavy metals", evidence_snippet: "Our testing revealed arsenic, cadmium, and lead in over 70% of leading plant protein powders, likely absorbed through agricultural soil.", timestamp: "03:40" }
        ],
        consumer_questions: [
          "Which brands are certified lead-free?",
          "Are organic plant proteins safer than conventional whey?"
        ],
        claims: [
          {
            claim_text: "Many plant-based organic protein powders have higher heavy metal levels than non-organic whey.",
            claim_type: "Scientific",
            confidence_level: "High",
            evidence_supported: true,
            supporting_notes: "Plant roots aggressively absorb metals from organic-soil composts. Whey undergoes extensive filtration."
          }
        ],
        sentiment: { overall: "Neutral", score: 0.10 },
        opportunities: ["Provide verifiable batch-testing certificates directly on the product's QR code."],
        business_relevance: {
          score: 85,
          tier: "High",
          reasoning: "A massive trust risk for our brand. Our plant protein must be rigorously tested and marketed as certified heavy-metal-free."
        }
      }
    ]
  }
};
