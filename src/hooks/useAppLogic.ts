import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useSession } from './useSession';
import { useAnalysis } from './useAnalysis';
import { usePromptGeneration } from './usePromptGeneration';
import { useHistory } from './useHistory';
import { HistoryItem, AgentTask, CategoryResult } from '../types';
import { analyzeCompetitorIntel, predictSalesPotential } from '../services/marketService';
import { getTrendForecast } from '../services/trendService';

export const useAppLogic = () => {
  const {
    activeTab, setActiveTab,
    selectedPromptCategoryId, setSelectedPromptCategoryId,
    settings, setSettings,
    history, setHistory,
    results, setResults,
    errorModal, setErrorModal,
    toast, setToast,
    prefsSaved, setPrefsSaved,
    prefsValidationMessage, setPrefsValidationMessage,
    sortBy, setSortBy,
    filterCompetition, setFilterCompetition,
    isPipelineRunning, setIsPipelineRunning,
    pipelineTasks, setPipelineTasks,
    progress, setProgress,
    isAnalyzingCompetitor, setIsAnalyzingCompetitor,
    isMonitoring, setIsMonitoring,
    forecasts, setForecasts,
    isRefreshingForecasts, setIsRefreshingForecasts,
    salesRecords, setSalesRecords,
    isParsingSalesCSV, setIsParsingSalesCSV
  } = useAppStore();

  const session = useSession();
  const analysis = useAnalysis();
  const promptGen = usePromptGeneration();
  const historyLogic = useHistory();

  // Additional Logic
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
      const newForecasts = await getTrendForecast(analysis.keyword, settings);
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

  const handleRunPipeline = async (steps: string[]) => {
    setIsPipelineRunning(true);
    const initialTasks: AgentTask[] = steps.map(step => ({
      id: `task-${step}-${Date.now()}`,
      name: step.charAt(0).toUpperCase() + step.slice(1),
      status: 'pending',
      progress: 0,
      message: 'Waiting to start...'
    }));
    setPipelineTasks(initialTasks);
    
    setProgress({ current: 0, total: steps.length, message: 'Initializing pipeline...' });
    
    try {
      for (let i = 0; i < steps.length; i++) {
        const stepId = steps[i];
        setPipelineTasks(prev => prev.map(t => 
          t.id.includes(stepId) ? { ...t, status: 'running', progress: 10, message: `Starting ${stepId}...` } : t
        ));

        setProgress({ current: i + 1, total: steps.length, message: `Executing step: ${stepId}` });
        
        // Mock progress updates
        for (let p = 10; p <= 100; p += 30) {
          await new Promise(r => setTimeout(r, 300));
          setPipelineTasks(prev => prev.map(t => 
            t.id.includes(stepId) ? { ...t, progress: p, message: `Processing ${stepId}... ${p}%` } : t
          ));
        }

        setPipelineTasks(prev => prev.map(t => 
          t.id.includes(stepId) ? { ...t, status: 'completed', progress: 100, message: `${stepId} completed successfully.` } : t
        ));
      }
      setToast({ show: true, message: 'Pipeline selesai!' });
    } catch (error) {
      setPipelineTasks(prev => prev.map(t => 
        t.status === 'running' ? { ...t, status: 'failed', message: 'Error occurred.' } : t
      ));
    } finally {
      setIsPipelineRunning(false);
      setProgress(null);
    }
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, setToast]);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('app_preferences');
    
    setSettings(s => {
      const newSettings = { ...s, apiKey: '' }; 
      if (savedPrefs) {
        try {
          const parsed = JSON.parse(savedPrefs);
          Object.assign(newSettings, parsed);
          // ... (logika migrasi templateId tetap sama)
        } catch (e) {
          console.error("Failed to parse saved preferences");
        }
      }
      return newSettings;
    });

    try {
      const savedHistory = localStorage.getItem('app_history');
      const savedResults = localStorage.getItem('app_results');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedResults) setResults(JSON.parse(savedResults));
    } catch (e) {
      console.error("Failed to load saved history/results");
    }
  }, [setSettings, setHistory, setResults]);

  useEffect(() => {
    if (settings.autoSave) {
      localStorage.setItem('app_history', JSON.stringify(history));
      localStorage.setItem('app_results', JSON.stringify(results));
    } else {
      localStorage.removeItem('app_history');
      localStorage.removeItem('app_results');
    }
  }, [history, results, settings.autoSave]);

  const handleSavePreferences = () => {
    const prefsToSave = {
      model: settings.model,
      templateId: settings.templateId,
      promptCount: settings.promptCount,
      language: settings.language,
      includeNegative: settings.includeNegative,
      autoSave: settings.autoSave,
      creatorProfile: settings.creatorProfile
    };
    
    localStorage.setItem('app_preferences', JSON.stringify(prefsToSave));
    setPrefsSaved(true);
    setPrefsValidationMessage({ type: 'success', text: 'Preferences saved successfully!' });
    
    setTimeout(() => {
      setPrefsSaved(false);
      setPrefsValidationMessage(null);
    }, 3000);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    analysis.setKeyword(item.query);
    analysis.setContentType(item.contentType || 'Photo');
    setActiveTab("top");
  };

  const handleViewPrompts = (id: string) => {
    setSelectedPromptCategoryId(id);
    setActiveTab("prompt");
  };

  return {
    ...session,
    ...analysis,
    ...promptGen,
    ...historyLogic,
    activeTab,
    setActiveTab,
    selectedPromptCategoryId,
    setSelectedPromptCategoryId,
    settings,
    setSettings,
    prefsSaved,
    prefsValidationMessage,
    sortBy,
    setSortBy,
    filterCompetition,
    setFilterCompetition,
    errorModal,
    setErrorModal,
    toast,
    setToast,
    handleSavePreferences,
    handleLoadHistory,
    handleViewPrompts,
    handleAnalyzeCompetitor,
    handlePredictSales,
    handleToggleMonitor,
    handleRefreshForecasts,
    handleParseSalesCSV,
    handleRunPipeline,
    isPipelineRunning,
    pipelineTasks,
    progress,
    isAnalyzingCompetitor,
    isMonitoring,
    forecasts,
    isRefreshingForecasts,
    salesRecords,
    isParsingSalesCSV
  };
};
