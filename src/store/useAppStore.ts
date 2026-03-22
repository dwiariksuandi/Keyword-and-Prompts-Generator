import { create } from 'zustand';
import { CategoryResult, AppSettings, HistoryItem, ReferenceFile, AestheticAnalysis, Tab, TrendForecast, SalesRecord, AgentTask } from '../types';

interface AppState {
  isSessionActive: boolean;
  tempApiKey: string;
  isValidating: boolean;
  validationError: string | null;
  activeTab: Tab;
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
  prefsSaved: boolean;
  prefsValidationMessage: { type: 'success' | 'error'; text: string } | null;
  sortBy: string;
  filterCompetition: string;
  errorModal: { show: boolean; title: string; message: string };
  toast: { show: boolean; message: string };
  isPipelineRunning: boolean;
  pipelineTasks: AgentTask[];
  progress: { current: number; total: number; message: string } | null;
  promptsCount: number;
  isAnalyzingCompetitor: boolean;
  isMonitoring: boolean;
  forecasts: TrendForecast[];
  isRefreshingForecasts: boolean;
  salesRecords: SalesRecord[];
  isParsingSalesCSV: boolean;

  // Actions
  setIsSessionActive: (active: boolean) => void;
  setTempApiKey: (key: string) => void;
  setIsValidating: (validating: boolean) => void;
  setValidationError: (error: string | null) => void;
  setActiveTab: (tab: Tab) => void;
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
  setPrefsSaved: (saved: boolean) => void;
  setPrefsValidationMessage: (message: { type: 'success' | 'error'; text: string } | null) => void;
  setSortBy: (sortBy: string) => void;
  setFilterCompetition: (filter: string) => void;
  setErrorModal: (modal: { show: boolean; title: string; message: string }) => void;
  setToast: (toast: { show: boolean; message: string }) => void;
  setIsPipelineRunning: (running: boolean) => void;
  setPipelineTasks: (tasks: AgentTask[] | ((prev: AgentTask[]) => AgentTask[])) => void;
  setProgress: (progress: { current: number; total: number; message: string } | null) => void;
  setPromptsCount: (count: number) => void;
  setIsAnalyzingCompetitor: (analyzing: boolean) => void;
  setIsMonitoring: (monitoring: boolean) => void;
  setForecasts: (forecasts: TrendForecast[] | ((prev: TrendForecast[]) => TrendForecast[])) => void;
  setIsRefreshingForecasts: (refreshing: boolean) => void;
  setSalesRecords: (records: SalesRecord[] | ((prev: SalesRecord[]) => SalesRecord[])) => void;
  setIsParsingSalesCSV: (parsing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSessionActive: false,
  tempApiKey: '',
  isValidating: false,
  validationError: null,
  activeTab: 'top',
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
  prefsSaved: false,
  prefsValidationMessage: null,
  sortBy: 'opportunity',
  filterCompetition: 'all',
  errorModal: { show: false, title: '', message: '' },
  toast: { show: false, message: '' },
  isPipelineRunning: false,
  pipelineTasks: [],
  progress: null,
  promptsCount: 100,
  isAnalyzingCompetitor: false,
  isMonitoring: false,
  forecasts: [],
  isRefreshingForecasts: false,
  salesRecords: [],
  isParsingSalesCSV: false,

  setIsSessionActive: (active) => set({ isSessionActive: active }),
  setTempApiKey: (key) => set({ tempApiKey: key }),
  setIsValidating: (validating) => set({ isValidating: validating }),
  setValidationError: (error) => set({ validationError: error }),
  setActiveTab: (tab) => set({ activeTab: tab }),
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
  setPrefsSaved: (saved) => set({ prefsSaved: saved }),
  setPrefsValidationMessage: (message) => set({ prefsValidationMessage: message }),
  setSortBy: (sortBy) => set({ sortBy }),
  setFilterCompetition: (filter) => set({ filterCompetition: filter }),
  setErrorModal: (modal) => set({ errorModal: modal }),
  setToast: (toast) => set({ toast }),
  setIsPipelineRunning: (running) => set({ isPipelineRunning: running }),
  setPipelineTasks: (tasks) => set((state) => ({ pipelineTasks: typeof tasks === 'function' ? tasks(state.pipelineTasks) : tasks })),
  setProgress: (progress) => set({ progress }),
  setPromptsCount: (count) => set({ promptsCount: count }),
  setIsAnalyzingCompetitor: (analyzing) => set({ isAnalyzingCompetitor: analyzing }),
  setIsMonitoring: (monitoring) => set({ isMonitoring: monitoring }),
  setForecasts: (forecasts) => set((state) => ({ forecasts: typeof forecasts === 'function' ? forecasts(state.forecasts) : forecasts })),
  setIsRefreshingForecasts: (refreshing) => set({ isRefreshingForecasts: refreshing }),
  setSalesRecords: (records) => set((state) => ({ salesRecords: typeof records === 'function' ? records(state.salesRecords) : records })),
  setIsParsingSalesCSV: (parsing) => set({ isParsingSalesCSV: parsing }),
}));
