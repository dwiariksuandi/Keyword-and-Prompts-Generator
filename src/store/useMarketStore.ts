import { create } from 'zustand';
import { CategoryResult, HistoryItem, TrendForecast, SalesRecord } from '../types';

interface MarketState {
  results: CategoryResult[];
  history: HistoryItem[];
  forecasts: TrendForecast[];
  salesRecords: SalesRecord[];
  isAnalyzingCompetitor: boolean;
  isMonitoring: boolean;
  isRefreshingForecasts: boolean;
  isParsingSalesCSV: boolean;
  sortBy: string;
  filterCompetition: string;

  // Actions
  setResults: (results: CategoryResult[] | ((prev: CategoryResult[]) => CategoryResult[])) => void;
  setHistory: (history: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])) => void;
  setForecasts: (forecasts: TrendForecast[] | ((prev: TrendForecast[]) => TrendForecast[])) => void;
  setSalesRecords: (records: SalesRecord[] | ((prev: SalesRecord[]) => SalesRecord[])) => void;
  setIsAnalyzingCompetitor: (analyzing: boolean) => void;
  setIsMonitoring: (monitoring: boolean) => void;
  setIsRefreshingForecasts: (refreshing: boolean) => void;
  setIsParsingSalesCSV: (parsing: boolean) => void;
  setSortBy: (sortBy: string) => void;
  setFilterCompetition: (filter: string) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  results: [],
  history: [],
  forecasts: [],
  salesRecords: [],
  isAnalyzingCompetitor: false,
  isMonitoring: false,
  isRefreshingForecasts: false,
  isParsingSalesCSV: false,
  sortBy: 'date',
  filterCompetition: 'All',

  setResults: (results) => set((state) => ({ results: typeof results === 'function' ? results(state.results) : results })),
  setHistory: (history) => set((state) => ({ history: typeof history === 'function' ? history(state.history) : history })),
  setForecasts: (forecasts) => set((state) => ({ forecasts: typeof forecasts === 'function' ? forecasts(state.forecasts) : forecasts })),
  setSalesRecords: (records) => set((state) => ({ salesRecords: typeof records === 'function' ? records(state.salesRecords) : records })),
  setIsAnalyzingCompetitor: (analyzing) => set({ isAnalyzingCompetitor: analyzing }),
  setIsMonitoring: (monitoring) => set({ isMonitoring: monitoring }),
  setIsRefreshingForecasts: (refreshing) => set({ isRefreshingForecasts: refreshing }),
  setIsParsingSalesCSV: (parsing) => set({ isParsingSalesCSV: parsing }),
  setSortBy: (sortBy) => set({ sortBy }),
  setFilterCompetition: (filterCompetition) => set({ filterCompetition }),
}));
