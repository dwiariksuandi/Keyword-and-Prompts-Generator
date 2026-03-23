export type Tab = "top" | "analysis" | "results" | "settings" | "donate" | "prompt" | "changelog" | "guide" | "visual" | "intelligence" | "pipeline" | "sales";

export interface ReferenceFile {
  data: string; // base64
  mimeType: string;
  name: string;
  previewUrl: string;
}

export interface PromptScore {
  prompt: string;
  optimizedPrompt?: string;
  rating?: number;
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
  groundingSources?: { uri: string; title?: string }[];
  aiValidation?: {
    isValid: boolean;
    score: number;
    reason: string;
  };
}

export interface AestheticAnalysis {
  colorPalette: string[];
  lighting: string;
  mood: string;
  artisticStyle: string;
  composition: string;
  suggestions: string[];
  detectedContentType?: string;
}

export interface CategoryResult {
  id: string;
  categoryName: string;
  contentType: string;
  mainKeywords: string[];
  volumeLevel: 'High' | 'Medium' | 'Low';
  volumeNumber: number;
  competition: 'High' | 'Medium' | 'Low';
  competitionScore: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  trendForecast: 'up' | 'down' | 'stable';
  riskLevel: 'High' | 'Medium' | 'Low';
  riskFactors: string[];
  difficultyScore: number;
  opportunityScore: number;
  creativeAdvice: string;
  buyerPersona?: string;
  visualTrends?: string[];
  generatedPrompts: string[];
  promptScores?: PromptScore[];
  isGeneratingPrompts: boolean;
  isUpgrading: boolean;
  isStarred: boolean;
  isGeneratingMetadata?: boolean;
  metadata?: { title: string; keywords: string[] }[];
  competitorIntel?: CompetitorAnalysis;
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

export interface AnalysisIntent {
  targetPlatform: string;
  primaryGoal: string;
  timeCommitment: string;
}

export interface CreatorProfile {
  portfolioUrl: string;
  aestheticDNA: string;
  lastAnalyzed?: string;
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
  intent?: AnalysisIntent;
  creatorProfile?: CreatorProfile;
}

// Missing types
export type ABTestVariant = 'A' | 'B';

export interface ABTestConfig {
  id: string;
  name: string;
  variants: ABTestVariant[];
  active: boolean;
}

export interface ABTestLog { id: string; testId: string; variant: string; timestamp: string; }
export interface CompetitorAnalysis { 
  id: string; 
  timestamp: string;
  aestheticDNA: {
    lighting: string;
    composition: string;
    colorPalette: string[];
  };
  counterStrategy: {
    dominantStyle: string;
    recommendedPivot: string;
    pivotReason: string;
  };
  keywordHijack: {
    winningKeywords: string[];
    missedGaps: string[];
  };
  marketVelocity: {
    status: 'Aggressive' | 'Steady' | 'Slow';
    trendAlert: string;
  };
  metadataBenchmark: {
    titleScore: number;
    descriptionScore: number;
    recommendations: string[];
  };
}
export interface AgentTask { 
  id: string; 
  name: string; 
  status: 'pending' | 'running' | 'completed' | 'failed'; 
  progress: number;
  message: string;
}
export interface PromptOptimizationRequest { 
  originalPrompt: string; 
  desiredOutcome: string;
  targetAudience: string;
}
export interface TrendForecast {
  id: string;
  trend: string;
  forecast: string;
  niche: string;
  isHighPriority: boolean;
  predictionDate: string;
  confidence: number;
  growthPotential: number;
  reasoning: string;
  marketGap: string;
  visualStyle: string;
  recommendedKeywords: string[];
}

export interface SalesRecord {
  id: string;
  amount: number;
  date: string;
  earnings: number;
  downloads: number;
  assetId: string;
  title: string;
}

export interface FeatureFlag {
  id: string;
  enabled: boolean;
  isEnabled?: boolean; // For backward compatibility
  rolloutPercentage: number;
}

export interface PromptFeedback {
  id: string;
  promptId: string;
  rating: number;
  comment: string;
  timestamp: string;
  selectionCount: number;
}
export const WORKFLOW_STEPS = [
  { id: "top", label: "01. Input" },
  { id: "analysis", label: "02. Analysis" },
  { id: "results", label: "03. Results" },
  { id: "prompt", label: "04. Prompt" }
];
