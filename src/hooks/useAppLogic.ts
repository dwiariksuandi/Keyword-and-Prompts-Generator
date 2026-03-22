import { useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useMarketStore } from '../store/useMarketStore';
import { usePromptStore } from '../store/usePromptStore';
import { usePipelineStore } from '../store/usePipelineStore';
import { useSessionStore } from '../store/useSessionStore';
import { useSession } from './useSession';
import { useAnalysis } from './useAnalysis';
import { usePromptGeneration } from './usePromptGeneration';
import { useHistory } from './useHistory';
import { useMarketIntelligence } from './useMarketIntelligence';
import { HistoryItem, AgentTask } from '../types';

export const useAppLogic = () => {
  const {
    selectedPromptCategoryId, setSelectedPromptCategoryId,
    settings, setSettings,
    keyword, setKeyword,
    contentType, setContentType,
    referenceFile, setReferenceFile,
    referenceUrl, setReferenceUrl,
    promptsCount, setPromptsCount
  } = usePromptStore();

  const {
    tempApiKey, setTempApiKey
  } = useSessionStore();

  const {
    results, setResults,
    history, setHistory,
    forecasts, setForecasts,
    salesRecords, setSalesRecords,
    isAnalyzingCompetitor, setIsAnalyzingCompetitor,
    isMonitoring, setIsMonitoring,
    isRefreshingForecasts, setIsRefreshingForecasts,
    isParsingSalesCSV, setIsParsingSalesCSV,
    sortBy, setSortBy,
    filterCompetition, setFilterCompetition
  } = useMarketStore();

  const {
    isPipelineRunning, setIsPipelineRunning,
    pipelineTasks, setPipelineTasks
  } = usePipelineStore();

  const {
    activeTab, setActiveTab,
    errorModal, setErrorModal,
    toast, setToast,
    prefsSaved, setPrefsSaved,
    prefsValidationMessage, setPrefsValidationMessage,
    progress, setProgress
  } = useUIStore();

  const session = useSession();
  const analysis = useAnalysis();
  const promptGen = usePromptGeneration();
  const historyLogic = useHistory();
  const marketIntel = useMarketIntelligence();

  // Additional Logic
  const handleToggleMonitor = () => setIsMonitoring(!isMonitoring);

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

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'opportunity') return b.opportunityScore - a.opportunityScore;
    if (sortBy === 'competition') return a.competitionScore - b.competitionScore;
    return 0;
  });

  return {
    ...session,
    ...analysis,
    ...promptGen,
    ...historyLogic,
    ...marketIntel,
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
    handleRunPipeline,
    isPipelineRunning,
    pipelineTasks,
    progress,
    sortedResults
  };
};
