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
  difficultyScore: number;
  opportunityScore: number;
  creativeAdvice: string;
  generatedPrompts: string[];
  promptScores?: PromptScore[];
  isGeneratingPrompts: boolean;
  isUpgrading: boolean;
  isStarred: boolean;
  isGeneratingMetadata?: boolean;
  metadata?: { title: string; keywords: string[] }[];
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
  autoSave: boolean;
}
