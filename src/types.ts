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

export interface CategoryResult {
  id: string;
  categoryName: string;
  contentType: string;
  mainKeywords: string[];
  longTailKeywords?: string[];
  volumeLevel: 'High' | 'Medium' | 'Low';
  volumeNumber: number;
  competition: 'High' | 'Medium' | 'Low';
  competitionScore: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  difficultyScore: number;
  opportunityScore: number;
  nicheScore?: number;
  demandVariance?: 'Stable' | 'Seasonal' | 'Viral';
  keiScore?: number;
  commercialIntent?: string;
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

export interface AppSettings {
  apiKey: string;
  model: string;
  templateId: string | Record<string, string>;
  promptCount: number;
  language: string;
  includeNegative: boolean;
  customNegativePrompt?: string;
  autoSave: boolean;
  variationLevel: 'Low' | 'Medium' | 'High';
}
