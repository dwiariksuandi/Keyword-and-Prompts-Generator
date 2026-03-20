import { z } from 'zod';

export const KeywordAnalysisSchema = z.array(z.object({
  categoryName: z.string(),
  mainKeywords: z.array(z.string()),
  longTailKeywords: z.array(z.string()),
  volumeLevel: z.enum(["High", "Medium", "Low", "Extreme"]),
  volumeNumber: z.number(),
  competition: z.enum(["High", "Medium", "Low", "Saturated", "Very Low"]),
  competitionScore: z.number().min(0).max(100),
  trend: z.enum(["up", "down", "stable", "explosive", "cyclical"]),
  trendPercent: z.number(),
  difficultyScore: z.number().min(0).max(100),
  opportunityScore: z.number().min(0).max(100),
  nicheScore: z.number().min(0).max(100),
  demandVariance: z.enum(["Stable", "Seasonal", "Viral", "Emerging"]),
  keiScore: z.number().min(0),
  commercialIntent: z.enum(["Informational", "Navigational", "Commercial", "Transactional", "Brand Awareness"]),
  assetTypeSuitability: z.array(z.string()),
  buyerPersona: z.string(),
  visualTrends: z.array(z.string()),
  creativeAdvice: z.string(),
  metadataStrategy: z.string(),
  groundingSources: z.array(z.object({
    uri: z.string(),
    title: z.string()
  })).optional()
}));

export type KeywordAnalysis = z.infer<typeof KeywordAnalysisSchema>;

export const AestheticAnalysisSchema = z.object({
  detectedContentType: z.string(),
  colorPalette: z.array(z.string()),
  lighting: z.string(),
  mood: z.string(),
  artisticStyle: z.string(),
  composition: z.string(),
  suggestions: z.array(z.string()),
  marketGaps: z.array(z.string()),
  groundingSources: z.array(z.object({
    uri: z.string(),
    title: z.string()
  })).optional()
});

export type AestheticAnalysis = z.infer<typeof AestheticAnalysisSchema>;

export const PromptSchema = z.object({
  subjects: z.array(z.string()),
  actions: z.array(z.string()),
  contexts: z.array(z.string()),
  cinematography: z.array(z.string()),
  lightings: z.array(z.string()),
  moods: z.array(z.string()),
  styles: z.array(z.string()),
  aspects: z.array(z.string()),
  soundstage: z.array(z.string()).optional(),
  rejectionRisk: z.object({
    riskLevel: z.enum(['Low', 'Medium', 'High']),
    reason: z.string(),
  }),
  marketTrend: z.string(),
});
export type Prompt = z.infer<typeof PromptSchema>;

export const PromptDirectSchema = z.object({
  prompts: z.array(z.string()),
  groundingSources: z.array(z.object({
    uri: z.string(),
    title: z.string()
  })).optional()
});
export type PromptDirect = z.infer<typeof PromptDirectSchema>;
