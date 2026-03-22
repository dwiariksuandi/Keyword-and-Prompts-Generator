export type Tab = "top" | "analysis" | "results" | "settings" | "donate" | "prompt" | "changelog" | "guide" | "pipeline" | "wizard" | "intelligence" | "sales" | "forecast";

export const WORKFLOW_STEPS = [
  { id: 'top', label: '01. RESEARCH', description: 'Cari Niche Menguntungkan' },
  { id: 'intelligence', label: '02. INTEL', description: 'Bedah Strategi Kompetitor' },
  { id: 'forecast', label: '03. FORECAST', description: 'Prediksi Tren Masa Depan' },
  { id: 'pipeline', label: '04. PRODUCTION', description: 'Produksi Aset Otomatis' },
  { id: 'prompt', label: '05. VAULT', description: 'Hasil & Metadata' }
];

export interface ReferenceFile {
  data: string; // base64
  mimeType: string;
  name: string;
  previewUrl: string;
}

export interface PromptScore {
  prompt: string;
  score: number;
  density: number;
  clarity: number;
  specificity: number;
  adherence: number;
  feedback: string;
  keywordFeedback?: string;
  clarityFeedback?: string;
  specificityFeedback?: string;
  adherenceFeedback?: string;
  groundingSources?: { uri: string; title: string }[];
}

export interface AestheticAnalysis {
  colorPalette: string[];
  lighting: string;
  mood: string;
  artisticStyle: string;
  composition: string;
  suggestions: string[];
  detectedContentType?: string;
  marketGaps?: string[];
  groundingSources?: { uri: string; title: string }[];
}

export interface CompetitorAnalysis {
  id: string;
  competitorName: string;
  niche: string;
  aestheticDNA: {
    lighting: string;
    composition: string;
    colorPalette: string[];
    technicalSpecs: string;
  };
  keywordHijack: {
    winningKeywords: string[];
    missedGaps: string[];
  };
  counterStrategy: {
    dominantStyle: string;
    recommendedPivot: string;
    pivotReason: string;
  };
  metadataBenchmark: {
    titleScore: number;
    descriptionScore: number;
    recommendations: string[];
  };
  marketVelocity: {
    status: 'Aggressive' | 'Steady' | 'Declining';
    trendAlert: string;
  };
  timestamp: string;
}

export interface CategoryResult {
  id: string;
  categoryName: string;
  contentType: string;
  mainKeywords: string[];
  longTailKeywords?: string[];
  volumeLevel: 'High' | 'Medium' | 'Low' | 'Extreme';
  volumeNumber: number;
  competition: 'High' | 'Medium' | 'Low' | 'Saturated';
  competitionScore: number;
  trend: 'up' | 'down' | 'stable' | 'explosive' | 'cyclical';
  trendPercent: number;
  difficultyScore: number;
  demandScore?: number;
  opportunityScore: number;
  nicheScore?: number;
  isBlueOcean?: boolean;
  demandVariance?: 'Stable' | 'Seasonal' | 'Viral' | 'Emerging';
  keiScore?: number;
  commercialIntent?: 'Informational' | 'Navigational' | 'Commercial' | 'Transactional' | 'Brand Awareness';
  assetTypeSuitability?: string[];
  creativeAdvice: string;
  metadataStrategy?: string;
  buyerPersona?: string;
  visualTrends?: string[];
  generatedPrompts: string[];
  promptScores?: PromptScore[];
  isGeneratingPrompts: boolean;
  isUpgrading: boolean;
  isStarred: boolean;
  isGeneratingMetadata?: boolean;
  metadata?: { title: string; description?: string; keywords: string[] }[];
  groundingSources?: { uri: string; title: string }[];
  competitorIntel?: CompetitorAnalysis;
  salesData?: {
    estimatedMonthlySales: number;
    confidenceScore: number;
    topSellingFactors: string[];
  };
}

export interface SalesRecord {
  id: string;
  assetId: string;
  title: string;
  downloads: number;
  earnings: number;
  date: string;
  keywords: string[];
}

export interface HistoryItem {
  id: string;
  query: string;
  contentType: string;
  timestamp: string;
  categoryCount: number;
  promptCount: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  description: string;
  contentTypes: string[];
}

export interface TrendForecast {
  id: string;
  niche: string;
  predictionDate: string;
  confidence: number;
  growthPotential: number;
  reasoning: string;
  recommendedKeywords: string[];
  visualStyle: string;
  marketGap: string;
  isHighPriority: boolean;
}

export interface AppSettings {
  model: string;
  templateId: string | Record<string, string>;
  promptCount: number;
  language: string;
  includeNegative: boolean;
  customNegativePrompt?: string;
  autoSave: boolean;
  variationLevel: 'Low' | 'Medium' | 'High';
  competitorIntel?: CompetitorAnalysis;
  geminiApiKey?: string;
}
