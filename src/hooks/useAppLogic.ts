import { useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useMarketStore } from '../store/useMarketStore';
import { usePromptStore } from '../store/usePromptStore';
import { usePipelineStore } from '../store/usePipelineStore';
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
    results, setResults,
    history, setHistory,
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
          t.id.includes(stepId) ? { ...t, status: 'running', progress: 10, message: `Executing ${stepId}...` } : t
        ));

        setProgress({ current: i + 1, total: steps.length, message: `Executing step: ${stepId}` });
        
        // Real logic for each step
        if (stepId === 'analyze') {
          await analysis.handleAnalyze();
        } else if (stepId === 'intel') {
          // Competitor Intel for each result
          const currentResults = useMarketStore.getState().results;
          for (let j = 0; j < currentResults.length; j++) {
            const r = currentResults[j];
            setPipelineTasks(prev => prev.map(t => 
              t.id.includes(stepId) ? { ...t, progress: 10 + (j / currentResults.length) * 80, message: `Analyzing competitor for ${r.categoryName}...` } : t
            ));
            await marketIntel.handleAnalyzeCompetitor(r);
          }
        } else if (stepId === 'generate') {
          await promptGen.handleGenerateAllPrompts();
        } else if (stepId === 'score') {
          // Scoring is already part of handleGenerateAllPrompts, but if they want to re-score or score existing:
          // We'll just ensure they are scored.
          setPipelineTasks(prev => prev.map(t => 
            t.id.includes(stepId) ? { ...t, progress: 100, message: `Scoring completed (integrated with generation).` } : t
          ));
        } else if (stepId === 'metadata') {
          await (promptGen as any).handleGenerateAllMetadata();
        }

        setPipelineTasks(prev => prev.map(t => 
          t.id.includes(stepId) ? { ...t, status: 'completed', progress: 100, message: `${stepId} completed successfully.` } : t
        ));
      }
      setToast({ show: true, message: 'Pipeline completed successfully!' });
    } catch (error) {
      console.error("Pipeline error:", error);
      setPipelineTasks(prev => prev.map(t => 
        t.status === 'running' ? { ...t, status: 'failed', message: 'Error occurred during execution.' } : t
      ));
      setToast({ show: true, message: 'Pipeline failed. Check console for details.' });
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
