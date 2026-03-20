import { z } from 'zod';

export const KeywordAnalysisSchema = z.array(z.object({
  categoryName: z.string(),
  mainKeywords: z.array(z.string()),
  longTailKeywords: z.array(z.string()),
  volumeLevel: z.enum(["High", "Medium", "Low"]),
  volumeNumber: z.number(),
  competition: z.enum(["High", "Medium", "Low"]),
  competitionScore: z.number().min(0).max(100),
  trend: z.enum(["up", "down", "stable"]),
  trendPercent: z.number(),
  difficultyScore: z.number().min(0).max(100),
  opportunityScore: z.number().min(0).max(100),
  nicheScore: z.number().min(0).max(100),
  demandVariance: z.enum(["Stable", "Seasonal", "Viral"]),
  keiScore: z.number().min(0).max(100),
  commercialIntent: z.enum(["Informational", "Navigational", "Commercial", "Transactional"]),
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
