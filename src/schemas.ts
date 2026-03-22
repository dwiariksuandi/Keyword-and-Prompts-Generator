import { z } from 'zod';

export const CategoryResultSchema = z.object({
  id: z.string(),
  categoryName: z.string(),
  contentType: z.string(),
  mainKeywords: z.array(z.string()),
  longTailKeywords: z.array(z.string()).optional(),
  volumeLevel: z.enum(['High', 'Medium', 'Low', 'Extreme']),
  volumeNumber: z.number(),
  competition: z.enum(['High', 'Medium', 'Low', 'Saturated']),
  competitionScore: z.number(),
  trend: z.enum(['up', 'down', 'stable', 'explosive', 'cyclical']),
  trendPercent: z.number(),
  difficultyScore: z.number(),
  opportunityScore: z.number(),
  nicheScore: z.number().optional(),
  demandVariance: z.enum(['Stable', 'Seasonal', 'Viral', 'Emerging']).optional(),
  assetTypeSuitability: z.array(z.string()).optional(),
  creativeAdvice: z.string(),
  metadataStrategy: z.string().optional(),
  buyerPersona: z.string().optional(),
  visualTrends: z.array(z.string()).optional(),
  generatedPrompts: z.array(z.string()),
  promptScores: z.array(z.any()).optional(),
  isGeneratingPrompts: z.boolean(),
  isUpgrading: z.boolean(),
  isStarred: z.boolean(),
  isGeneratingMetadata: z.boolean().optional(),
  metadata: z.array(z.object({ title: z.string(), description: z.string().optional(), keywords: z.array(z.string()) })).optional(),
  groundingSources: z.array(z.object({ uri: z.string(), title: z.string() })).optional(),
  groundingScore: z.number().optional(),
  rejectionRisk: z.object({ riskLevel: z.enum(['Low', 'Medium', 'High']), reason: z.string() }).optional(),
  competitorIntel: z.any().optional(),
  salesData: z.object({
    estimatedMonthlySales: z.number(),
    confidenceScore: z.number(),
    topSellingFactors: z.array(z.string()),
  }).optional(),
});
export const AestheticAnalysisSchema = z.object({
  colorPalette: z.array(z.string()),
  lighting: z.string(),
  mood: z.string(),
  artisticStyle: z.string(),
  composition: z.string(),
  visualStyle: z.string().optional(),
  suggestions: z.array(z.string()),
  detectedContentType: z.string().optional(),
  marketGaps: z.array(z.string()).optional(),
  groundingSources: z.array(z.object({ uri: z.string(), title: z.string() })).optional(),
  groundingScore: z.number().optional(),
  rejectionRisk: z.object({ riskLevel: z.enum(['Low', 'Medium', 'High']), reason: z.string() }).optional(),
});

export const KeywordAnalysisSchema = z.array(z.object({
  categoryName: z.string(),
  mainKeywords: z.array(z.string()),
  longTailKeywords: z.array(z.string()),
  volumeLevel: z.enum(['High', 'Medium', 'Low']),
  volumeNumber: z.number(),
  competition: z.enum(['High', 'Medium', 'Low']),
  competitionScore: z.number(),
  trend: z.enum(['up', 'down', 'stable']),
  trendPercent: z.number(),
  difficultyScore: z.number(),
  opportunityScore: z.number(),
  nicheScore: z.number(),
  demandVariance: z.enum(['Stable', 'Seasonal', 'Viral']),
  keiScore: z.number(),
  commercialIntent: z.enum(['Informational', 'Navigational', 'Commercial', 'Transactional']),
  assetTypeSuitability: z.array(z.string()),
  buyerPersona: z.string(),
  visualTrends: z.array(z.string()),
  creativeAdvice: z.string(),
  metadataStrategy: z.string(),
  groundingSources: z.array(z.object({ uri: z.string(), title: z.string() })).optional(),
  groundingScore: z.number().optional(),
  rejectionRisk: z.object({ riskLevel: z.enum(['Low', 'Medium', 'High']), reason: z.string() }).optional()
}));

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
});
export type Prompt = z.infer<typeof PromptSchema>;

export const PromptDirectSchema = z.object({
  prompts: z.array(z.string()),
  groundingSources: z.array(z.object({ uri: z.string(), title: z.string() })).optional()
});
export type PromptDirect = z.infer<typeof PromptDirectSchema>;

export const TrendForecastSchema = z.array(z.object({
  id: z.string(),
  niche: z.string(),
  predictionDate: z.string(),
  confidence: z.number(),
  growthPotential: z.number(),
  reasoning: z.string(),
  recommendedKeywords: z.array(z.string()),
  visualStyle: z.string(),
  marketGap: z.string(),
  isHighPriority: z.boolean()
}));
