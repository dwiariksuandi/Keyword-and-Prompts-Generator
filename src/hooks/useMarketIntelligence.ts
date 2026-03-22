import { useAppStore } from '../store/useAppStore';
import { useUIStore } from '../store/useUIStore';
import { analyzeCompetitorIntel, predictSalesPotential } from '../services/marketService';
import { getTrendForecast } from '../services/trendService';
import { CategoryResult } from '../types';

export const useMarketIntelligence = () => {
  const {
    settings,
    keyword,
    results, setResults,
    isAnalyzingCompetitor, setIsAnalyzingCompetitor,
    isMonitoring, setIsMonitoring,
    forecasts, setForecasts,
    isRefreshingForecasts, setIsRefreshingForecasts,
    salesRecords,
    isParsingSalesCSV, setIsParsingSalesCSV
  } = useAppStore();

  const {
    setToast,
    setErrorModal
  } = useUIStore();

  const handleAnalyzeCompetitor = async (category: CategoryResult) => {
    setIsAnalyzingCompetitor(true);
    try {
      const analysisData = await analyzeCompetitorIntel(category.categoryName, category.contentType, settings);
      setResults(prev => prev.map(r => 
        r.id === category.id ? { ...r, competitorIntel: analysisData } : r
      ));
      setToast({ show: true, message: 'Competitor analysis complete!' });
    } catch (error) {
      setErrorModal({ show: true, title: 'Analysis Failed', message: 'Could not analyze competitor.' });
    } finally {
      setIsAnalyzingCompetitor(false);
    }
  };

  const handlePredictSales = async (category: CategoryResult) => {
    try {
      const prediction = await predictSalesPotential(category.categoryName, category.contentType, settings, salesRecords);
      setResults(prev => prev.map(r => 
        r.id === category.id ? { ...r, salesPotential: prediction } : r
      ));
      setToast({ show: true, message: 'Sales potential predicted!' });
    } catch (error) {
      setErrorModal({ show: true, title: 'Prediction Failed', message: 'Could not predict sales potential.' });
    }
  };

  const handleToggleMonitor = () => setIsMonitoring(!isMonitoring);

  const handleRefreshForecasts = async () => {
    setIsRefreshingForecasts(true);
    try {
      const newForecasts = await getTrendForecast(keyword, settings);
      setForecasts(newForecasts);
      setToast({ show: true, message: 'Trend forecasts updated!' });
    } catch (error) {
      setErrorModal({ show: true, title: 'Refresh Failed', message: 'Could not update trend forecasts.' });
    } finally {
      setIsRefreshingForecasts(false);
    }
  };

  const handleParseSalesCSV = async (file: File) => {
    setIsParsingSalesCSV(true);
    try {
      // Logic for parsing CSV
      setToast({ show: true, message: 'Data penjualan diimpor!' });
    } finally {
      setIsParsingSalesCSV(false);
    }
  };

  return {
    handleAnalyzeCompetitor,
    handlePredictSales,
    handleToggleMonitor,
    handleRefreshForecasts,
    handleParseSalesCSV,
    isAnalyzingCompetitor,
    isMonitoring,
    isRefreshingForecasts,
    isParsingSalesCSV,
    results,
    setResults,
    forecasts,
    salesRecords
  };
};
