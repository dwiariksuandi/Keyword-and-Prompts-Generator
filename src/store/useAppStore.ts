import { create } from 'zustand';
import { CategoryResult, AppSettings, HistoryItem, ReferenceFile, AestheticAnalysis, Tab, TrendForecast, SalesRecord, AgentTask } from '../types';

interface AppState {
  tempApiKey: string;
  selectedPromptCategoryId: string | null;
  keyword: string;
  contentType: string;
  referenceFile: ReferenceFile | null;
  referenceUrl: string;
  isAnalyzing: boolean;
  isAnalyzingAesthetic: boolean;
  aestheticAnalysis: AestheticAnalysis | null;
  results: CategoryResult[];
  history: HistoryItem[];
  settings: AppSettings;
  sortBy: string;
  filterCompetition: string;
  isPipelineRunning: boolean;
  pipelineTasks: AgentTask[];
  promptsCount: number;
  isAnalyzingCompetitor: boolean;
  isMonitoring: boolean;
  forecasts: TrendForecast[];
  isRefreshingForecasts: boolean;
  salesRecords: SalesRecord[];
  isParsingSalesCSV: boolean;

  // Actions
  setTempApiKey: (key: string) => void;
  setSelectedPromptCategoryId: (id: string | null) => void;
  setKeyword: (keyword: string) => void;
  setContentType: (type: string) => void;
  setReferenceFile: (file: ReferenceFile | null) => void;
  setReferenceUrl: (url: string) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setIsAnalyzingAesthetic: (analyzing: boolean) => void;
  setAestheticAnalysis: (analysis: AestheticAnalysis | null) => void;
  setResults: (results: CategoryResult[] | ((prev: CategoryResult[]) => CategoryResult[])) => void;
  setHistory: (history: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])) => void;
  setSettings: (settings: AppSettings | ((prev: AppSettings) => AppSettings)) => void;
  setSortBy: (sortBy: string) => void;
  setFilterCompetition: (filter: string) => void;
  setIsPipelineRunning: (running: boolean) => void;
  setPipelineTasks: (tasks: AgentTask[] | ((prev: AgentTask[]) => AgentTask[])) => void;
  setPromptsCount: (count: number) => void;
  setIsAnalyzingCompetitor: (analyzing: boolean) => void;
  setIsMonitoring: (monitoring: boolean) => void;
  setForecasts: (forecasts: TrendForecast[] | ((prev: TrendForecast[]) => TrendForecast[])) => void;
  setIsRefreshingForecasts: (refreshing: boolean) => void;
  setSalesRecords: (records: SalesRecord[] | ((prev: SalesRecord[]) => SalesRecord[])) => void;
  setIsParsingSalesCSV: (parsing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  tempApiKey: '',
  selectedPromptCategoryId: null,
  keyword: '',
  contentType: 'Photo',
  referenceFile: null,
  referenceUrl: '',
  isAnalyzing: false,
  isAnalyzingAesthetic: false,
  aestheticAnalysis: null,
  results: [],
  history: [],
  settings: {
    apiKey: '',
    model: 'gemini-2.5-flash',
    templateId: {
      'Photo': 'nanobanana-photo',
      'Illustration': 'nanobanana-illustration',
      'Vector': 'nanobanana-vector',
      'Background': 'nanobanana-background',
      'Video': 'veo-video',
      '3D Render': 'nanobanana-3d',
      'AI Art & Creativity': 'nanobanana-ai-art'
    },
    promptCount: 100,
    language: 'en',
    includeNegative: false,
    customNegativePrompt: '--no text, typography, words, letters, watermark, signature, logos, brands, trademark, copyright, recognizable characters, real people, celebrity, deformed, bad anatomy, extra limbs, missing fingers, mutated hands, poorly drawn face, asymmetrical eyes, blurry, out of focus, noise, artifacts, low resolution, pixelated, overexposed, underexposed, artificial look, plastic skin',
    autoSave: true,
    variationLevel: 'Medium'
  },
  sortBy: 'opportunity',
  filterCompetition: 'all',
  isPipelineRunning: false,
  pipelineTasks: [],
  promptsCount: 100,
  isAnalyzingCompetitor: false,
  isMonitoring: false,
  forecasts: [],
  isRefreshingForecasts: false,
  salesRecords: [],
  isParsingSalesCSV: false,

  setTempApiKey: (key) => set({ tempApiKey: key }),
  setSelectedPromptCategoryId: (id) => set({ selectedPromptCategoryId: id }),
  setKeyword: (keyword) => set({ keyword }),
  setContentType: (type) => set({ contentType: type }),
  setReferenceFile: (file) => set({ referenceFile: file }),
  setReferenceUrl: (url) => set({ referenceUrl: url }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setIsAnalyzingAesthetic: (analyzing) => set({ isAnalyzingAesthetic: analyzing }),
  setAestheticAnalysis: (analysis) => set({ aestheticAnalysis: analysis }),
  setResults: (results) => set((state) => ({ results: typeof results === 'function' ? results(state.results) : results })),
  setHistory: (history) => set((state) => ({ history: typeof history === 'function' ? history(state.history) : history })),
  setSettings: (settings) => set((state) => ({ settings: typeof settings === 'function' ? settings(state.settings) : settings })),
  setSortBy: (sortBy) => set({ sortBy }),
  setFilterCompetition: (filter) => set({ filterCompetition: filter }),
  setIsPipelineRunning: (running) => set({ isPipelineRunning: running }),
  setPipelineTasks: (tasks) => set((state) => ({ pipelineTasks: typeof tasks === 'function' ? tasks(state.pipelineTasks) : tasks })),
  setPromptsCount: (count) => set({ promptsCount: count }),
  setIsAnalyzingCompetitor: (analyzing) => set({ isAnalyzingCompetitor: analyzing }),
  setIsMonitoring: (monitoring) => set({ isMonitoring: monitoring }),
  setForecasts: (forecasts) => set((state) => ({ forecasts: typeof forecasts === 'function' ? forecasts(state.forecasts) : forecasts })),
  setIsRefreshingForecasts: (refreshing) => set({ isRefreshingForecasts: refreshing }),
  setSalesRecords: (records) => set((state) => ({ salesRecords: typeof records === 'function' ? records(state.salesRecords) : records })),
  setIsParsingSalesCSV: (parsing) => set({ isParsingSalesCSV: parsing }),
}));
