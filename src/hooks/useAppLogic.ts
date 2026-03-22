import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useSession } from './useSession';
import { useAnalysis } from './useAnalysis';
import { usePromptGeneration } from './usePromptGeneration';
import { useHistory } from './useHistory';

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
    filterCompetition, setFilterCompetition
  } = useAppStore();

  const session = useSession();
  const analysis = useAnalysis();
  const promptGen = usePromptGeneration();
  const historyLogic = useHistory();

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

  const handleLoadHistory = (item: any) => {
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
    handleViewPrompts
  };
};
