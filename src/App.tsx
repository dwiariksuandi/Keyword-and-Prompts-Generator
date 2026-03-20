import React, { useState, useEffect } from 'react';
import { Sparkles, Key, ArrowRight, Loader2, AlertCircle, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeKeyword, generatePrompts, generatePromptsDirectly, generateAllPromptsBatch, optimizePrompts, validateApiKey, handleGeminiError, generateAdobeStockMetadata, scorePrompts, analyzeAestheticReference, analyzeUrlAesthetic, refinePrompt, refinePrompts, analyzeCompetitorIntel } from './services/gemini';
import { validateAdobeMetadata } from './services/validator';
import { CategoryResult, AppSettings, HistoryItem, ReferenceFile, AestheticAnalysis } from './types';
import Settings from './components/Settings';
import TopTab from './components/TopTab';
import AnalysisTab from './components/AnalysisTab';
import ResultsTab from './components/ResultsTab';
import DonateTab from './components/DonateTab';
import PromptTab from './components/PromptTab';
import PromptWizard from './components/PromptWizard';
import ChangelogTab from './components/ChangelogTab';
import GuideTab from './components/GuideTab';
import PipelineTab from './components/PipelineTab';
import IntelligenceTab from './components/IntelligenceTab';
import { ResultRow } from './components/ResultRow';

type Tab = "top" | "analysis" | "results" | "settings" | "donate" | "prompt" | "changelog" | "guide" | "pipeline" | "wizard" | "intelligence";

const WORKFLOW_STEPS = [
  { id: 'top', label: '01. RESEARCH', description: 'Cari Niche Menguntungkan' },
  { id: 'intelligence', label: '02. INTEL', description: 'Bedah Strategi Kompetitor' },
  { id: 'pipeline', label: '03. PRODUCTION', description: 'Produksi Aset Otomatis' },
  { id: 'prompt', label: '04. VAULT', description: 'Hasil & Metadata' }
];

export default function App() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>("top");
  const [selectedPromptCategoryId, setSelectedPromptCategoryId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [contentType, setContentType] = useState('Photo');
  const [referenceFile, setReferenceFile] = useState<ReferenceFile | null>(null);
  const [referenceUrl, setReferenceUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<{ current: number, total: number, message: string } | null>(null);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [isAnalyzingAesthetic, setIsAnalyzingAesthetic] = useState(false);
  const [aestheticAnalysis, setAestheticAnalysis] = useState<AestheticAnalysis | null>(null);
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    model: 'gemini-3.1-pro-preview',
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
    includeNegative: true,
    customNegativePrompt: '--no text, typography, words, letters, watermark, signature, logos, brands, trademark, copyright, recognizable characters, real people, celebrity, deformed, bad anatomy, extra limbs, missing fingers, mutated hands, poorly drawn face, asymmetrical eyes, blurry, out of focus, noise, artifacts, low resolution, pixelated, overexposed, underexposed, artificial look, plastic skin',
    autoSave: true,
    variationLevel: 'Medium'
  });

  const [prefsSaved, setPrefsSaved] = useState(false);
  const [prefsValidationMessage, setPrefsValidationMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Filters and Sort
  const [sortBy, setSortBy] = useState("opportunity");
  const [filterCompetition, setFilterCompetition] = useState("all");

  const [errorModal, setErrorModal] = useState<{show: boolean, title: string, message: string}>({
    show: false,
    title: '',
    message: ''
  });
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ''});

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('app_preferences');
    
    setSettings(s => {
      const newSettings = { ...s, apiKey: '' }; // Always reset API key on load
      if (savedPrefs) {
        try {
          const parsed = JSON.parse(savedPrefs);
          Object.assign(newSettings, parsed);
          
          // Migrate old string templateId to Record
          if (typeof newSettings.templateId === 'string') {
            const oldId = newSettings.templateId;
            // Map old generic IDs to specific new ones if needed, or just use defaults
            newSettings.templateId = {
              'Photo': oldId === 'midjourney' ? 'midjourney-photo' : oldId === 'dalle' ? 'dalle-photo' : oldId === 'stable' ? 'stable-photo' : 'nanobanana-photo',
              'Illustration': oldId === 'midjourney' ? 'midjourney-niji' : oldId === 'dalle' ? 'dalle-illustration' : 'nanobanana-illustration',
              'Vector': oldId === 'midjourney' ? 'midjourney-vector' : 'nanobanana-vector',
              'Background': oldId === 'midjourney' ? 'midjourney-background' : oldId === 'dalle' ? 'dalle-background' : oldId === 'stable' ? 'stable-photo' : 'nanobanana-background',
              'Video': 'veo-video',
              '3D Render': oldId === 'midjourney' ? 'midjourney-3d' : oldId === 'dalle' ? 'dalle-3d' : 'nanobanana-3d'
            };
          } else if (newSettings.templateId) {
            // Also migrate existing objects that might have old IDs
            const t = newSettings.templateId as Record<string, string>;
            if (t['Photo'] === 'midjourney') t['Photo'] = 'midjourney-photo';
            if (t['Illustration'] === 'midjourney') t['Illustration'] = 'midjourney-niji';
            if (t['Vector'] === 'midjourney') t['Vector'] = 'midjourney-vector';
            if (t['Background'] === 'midjourney') t['Background'] = 'midjourney-background';
            if (t['Video'] === 'midjourney') t['Video'] = 'veo-video';
            if (t['3D Render'] === 'midjourney') t['3D Render'] = 'midjourney-3d';
            
            if (t['Photo'] === 'dalle') t['Photo'] = 'dalle-photo';
            if (t['Illustration'] === 'dalle') t['Illustration'] = 'dalle-illustration';
            if (t['Background'] === 'dalle') t['Background'] = 'dalle-background';
            if (t['3D Render'] === 'dalle') t['3D Render'] = 'dalle-3d';
            
            if (t['Photo'] === 'stable') t['Photo'] = 'stable-photo';
            if (t['Background'] === 'stable') t['Background'] = 'stable-photo';
            
            if (t['Photo'] === 'stock') t['Photo'] = 'stock-photo';
            if (t['Photo'] === 'nanobanana') t['Photo'] = 'nanobanana-photo';
          }

          if (!newSettings.variationLevel) {
            newSettings.variationLevel = 'Medium';
          }
        } catch (e) {
          console.error("Failed to parse saved preferences");
        }
      }
      return newSettings;
    });

    // Load saved history and results
    try {
      const savedHistory = localStorage.getItem('app_history');
      const savedResults = localStorage.getItem('app_results');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedResults) setResults(JSON.parse(savedResults));
    } catch (e) {
      console.error("Failed to load saved history/results");
    }
  }, []);

  // Auto-save history and results when they change, if autoSave is enabled
  useEffect(() => {
    if (settings.autoSave) {
      localStorage.setItem('app_history', JSON.stringify(history));
      localStorage.setItem('app_results', JSON.stringify(results));
    } else {
      localStorage.removeItem('app_history');
      localStorage.removeItem('app_results');
    }
  }, [history, results, settings.autoSave]);

  const handleAnalyzeAesthetic = async () => {
    if (!referenceFile && !referenceUrl) return;
    setAestheticAnalysis(null);
    setIsAnalyzingAesthetic(true);
    try {
      let analysis: AestheticAnalysis;
      if (referenceFile) {
        analysis = await analyzeAestheticReference(referenceFile, settings, contentType);
      } else {
        analysis = await analyzeUrlAesthetic(referenceUrl, settings, contentType);
      }
      setAestheticAnalysis(analysis);
      setToast({ show: true, message: 'Analisis estetika berhasil!' });
    } catch (error) {
      console.error("Aesthetic analysis failed:", error);
      setErrorModal({
        show: true,
        title: 'Analisis Estetika Gagal',
        message: handleGeminiError(error)
      });
    } finally {
      setIsAnalyzingAesthetic(false);
    }
  };

  const handleStartSession = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!tempApiKey.trim()) return;
    
    setIsValidating(true);
    setValidationError(null);
    
    const validationResult = await validateApiKey(tempApiKey);
    setIsValidating(false);

    if (validationResult.isValid) {
      setSettings(prev => ({ ...prev, apiKey: tempApiKey }));
      setIsSessionActive(true);
    } else {
      setValidationError(validationResult.error || 'Invalid API Key. Please check and try again.');
    }
  };

  const handleEndSession = () => {
    setSettings(prev => ({ ...prev, apiKey: '' }));
    setTempApiKey('');
    setIsSessionActive(false);
    setActiveTab('top');
  };

  const handleSavePreferences = () => {
    const prefsToSave = {
      model: settings.model,
      templateId: settings.templateId,
      promptCount: settings.promptCount,
      language: settings.language,
      includeNegative: settings.includeNegative,
      autoSave: settings.autoSave
    };
    
    localStorage.setItem('app_preferences', JSON.stringify(prefsToSave));
    setPrefsSaved(true);
    setPrefsValidationMessage({ type: 'success', text: 'Preferences saved successfully!' });
    
    setTimeout(() => {
      setPrefsSaved(false);
      setPrefsValidationMessage(null);
    }, 3000);
  };

  const handleAnalyze = async (prompt?: string) => {
    const searchKeyword = (typeof prompt === 'string' ? prompt : keyword) || '';
    const safeReferenceUrl = (typeof referenceUrl === 'string' ? referenceUrl : '') || '';

    if (!searchKeyword.trim() && !referenceFile && !safeReferenceUrl.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeKeyword(searchKeyword, contentType, 'General Market', settings, referenceFile || undefined, safeReferenceUrl || undefined);
      const formattedResults: CategoryResult[] = data.map((item: any) => ({
        id: Math.random().toString(36).substring(7),
        categoryName: item.categoryName,
        contentType: contentType,
        mainKeywords: item.mainKeywords,
        longTailKeywords: item.longTailKeywords,
        volumeLevel: item.volumeLevel,
        volumeNumber: item.volumeNumber,
        competition: item.competition,
        competitionScore: item.competitionScore,
        trend: item.trend,
        trendPercent: item.trendPercent,
        difficultyScore: item.difficultyScore,
        opportunityScore: item.opportunityScore,
        nicheScore: item.nicheScore,
        demandVariance: item.demandVariance,
        keiScore: item.keiScore,
        commercialIntent: item.commercialIntent,
        assetTypeSuitability: item.assetTypeSuitability,
        buyerPersona: item.buyerPersona,
        visualTrends: item.visualTrends,
        creativeAdvice: item.creativeAdvice,
        metadataStrategy: item.metadataStrategy,
        generatedPrompts: [],
        isGeneratingPrompts: false,
        isUpgrading: false,
        isStarred: false,
        groundingSources: item.groundingSources
      }));
      setResults(formattedResults);
      
      setHistory(prev => [{
        id: Date.now().toString(),
        query: keyword || (referenceUrl ? `URL: ${referenceUrl}` : `Visual Analysis (${referenceFile?.name || 'File'})`),
        contentType: contentType,
        timestamp: new Date().toISOString(),
        categoryCount: formattedResults.length,
        promptCount: 0
      }, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error("Analysis failed:", error);
      setErrorModal({
        show: true,
        title: 'Analisis Gagal',
        message: handleGeminiError(error)
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickGenerate = async () => {
    if (!keyword.trim() && !referenceFile && !referenceUrl.trim()) return;
    setIsAnalyzing(true);
    try {
      const actualCountToGenerate = Math.min(settings.promptCount, 1500);
      const { prompts } = await generatePromptsDirectly(
        actualCountToGenerate, 
        settings, 
        contentType, 
        keyword || undefined, 
        referenceFile || undefined, 
        referenceUrl || undefined
      );

      const quickResult: CategoryResult = {
        id: 'quick-' + Math.random().toString(36).substring(7),
        categoryName: keyword || (referenceFile ? referenceFile.name : 'Quick Generation'),
        contentType: contentType,
        mainKeywords: keyword ? [keyword] : [],
        volumeLevel: 'Medium',
        volumeNumber: 0,
        competition: 'Medium',
        competitionScore: 0,
        trend: 'stable',
        trendPercent: 0,
        difficultyScore: 0,
        opportunityScore: 100,
        creativeAdvice: 'Directly generated from reference.',
        generatedPrompts: prompts,
        isGeneratingPrompts: true, // Temporarily true while scoring
        isUpgrading: false,
        isStarred: true,
      };

      setResults(prev => [quickResult, ...prev]);
      setActiveTab('prompt');

      // Score the prompts
      try {
        const scores = await scorePrompts(
          prompts, 
          settings, 
          contentType, 
          quickResult.categoryName,
          quickResult.buyerPersona,
          quickResult.visualTrends,
          quickResult.creativeAdvice
        );
        setResults(prev => prev.map(r => r.id === quickResult.id ? { ...r, promptScores: scores, isGeneratingPrompts: false } : r));
      } catch (scoreError) {
        console.error("Scoring failed:", scoreError);
        setResults(prev => prev.map(r => r.id === quickResult.id ? { ...r, isGeneratingPrompts: false } : r));
      }
      
      setHistory(prev => [{
        id: Date.now().toString(),
        query: `Quick: ${keyword || (referenceUrl ? referenceUrl : referenceFile?.name)}`,
        contentType: contentType,
        timestamp: new Date().toISOString(),
        categoryCount: 1,
        promptCount: prompts.length
      }, ...prev.slice(0, 9)]);

    } catch (error) {
      console.error("Quick generation failed:", error);
      setErrorModal({
        show: true,
        title: 'Gagal Generate Prompt',
        message: handleGeminiError(error)
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGeneratePrompts = async (id: string) => {
    const result = results.find(r => r.id === id);
    if (!result) return;

    setResults(prev => prev.map(r => r.id === id ? { ...r, isGeneratingPrompts: true } : r));
    
    try {
      const actualCountToGenerate = Math.min(settings.promptCount, 1500); 
      const prompts = await generatePrompts(
        keyword, 
        result.categoryName, 
        actualCountToGenerate, 
        settings, 
        result.contentType,
        referenceFile || undefined,
        referenceUrl || undefined,
        result.buyerPersona,
        result.visualTrends,
        result.creativeAdvice,
        result.demandVariance,
        result.commercialIntent,
        result.assetTypeSuitability,
        setProgress
      );

      // Score the prompts
      const scores = await scorePrompts(
        prompts, 
        settings, 
        result.contentType, 
        result.categoryName,
        result.buyerPersona,
        result.visualTrends,
        result.creativeAdvice
      );

      setResults(prev => prev.map(r => r.id === id ? { 
        ...r, 
        generatedPrompts: prompts,
        promptScores: scores,
        isGeneratingPrompts: false 
      } : r));
    } catch (error) {
      console.error("Prompt generation failed:", error);
      setErrorModal({
        show: true,
        title: 'Pembuatan Prompt Gagal',
        message: handleGeminiError(error)
      });
      setResults(prev => prev.map(r => r.id === id ? { ...r, isGeneratingPrompts: false } : r));
    }
  };

  const handleUpgradePrompts = async (categoryId: string) => {
    const category = results.find(c => c.id === categoryId);
    if (!category || category.generatedPrompts.length === 0) return;

    setResults(prev => prev.map(c => c.id === categoryId ? { ...c, isUpgrading: true } : c));
    
    try {
      const optimizedPrompts = await optimizePrompts(
        category.generatedPrompts, 
        settings, 
        category.contentType,
        keyword || undefined,
        category.categoryName,
        referenceFile || undefined,
        referenceUrl || undefined,
        category.buyerPersona,
        category.visualTrends,
        category.creativeAdvice
      );

      // Refine the prompts for commercial viability in batch
      const refinedPrompts = await refinePrompts(optimizedPrompts, category.contentType, settings);
      
      // Re-score the refined prompts
      const scores = await scorePrompts(
        refinedPrompts, 
        settings, 
        category.contentType, 
        category.categoryName,
        category.buyerPersona,
        category.visualTrends,
        category.creativeAdvice
      );

      setResults(prev => prev.map(c => {
        if (c.id === categoryId) {
          return { ...c, generatedPrompts: refinedPrompts, promptScores: scores, isUpgrading: false };
        }
        return c;
      }));
    } catch (error) {
      console.error("Prompt optimization failed:", error);
      setErrorModal({
        show: true,
        title: 'Optimasi Gagal',
        message: handleGeminiError(error)
      });
      setResults(prev => prev.map(c => c.id === categoryId ? { ...c, isUpgrading: false } : c));
    }
  };

  const handleGenerateMetadata = async (categoryId: string) => {
    const category = results.find(c => c.id === categoryId);
    if (!category || category.generatedPrompts.length === 0) return;

    setResults(prev => prev.map(c => c.id === categoryId ? { ...c, isGeneratingMetadata: true } : c));
    
    try {
      const metadata = await generateAdobeStockMetadata(
        category.generatedPrompts, 
        category.categoryName,
        settings,
        contentType
      );
      
      // Validate the metadata
      metadata.forEach(m => {
        const validation = validateAdobeMetadata(m.title, m.keywords);
        if (!validation.isValid) {
          throw new Error(`Metadata tidak valid: ${validation.errors.join(', ')}`);
        }
      });
      
      setResults(prev => prev.map(c => {
        if (c.id === categoryId) {
          return { ...c, metadata, isGeneratingMetadata: false };
        }
        return c;
      }));
      setToast({ show: true, message: 'Metadata Adobe Stock berhasil dibuat!' });
    } catch (error) {
      console.error("Metadata generation failed:", error);
      setErrorModal({
        show: true,
        title: 'Metadata Gagal',
        message: handleGeminiError(error)
      });
      setResults(prev => prev.map(c => c.id === categoryId ? { ...c, isGeneratingMetadata: false } : c));
    }
  };

  const handleGenerateAllPrompts = async () => {
    if (results.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const actualTotalCount = Math.min(settings.promptCount * results.length, 5000);
      const { promptsMap, groundingSources } = await generateAllPromptsBatch(
        keyword,
        results,
        actualTotalCount,
        settings,
        contentType,
        referenceUrl,
        setProgress
      );

      const updatedResults = [...results];
      
      for (const result of updatedResults) {
        const prompts = promptsMap.get(result.categoryName) || [];
        if (prompts.length > 0) {
          result.generatedPrompts = prompts;
          result.isGeneratingPrompts = true;
          if (groundingSources) {
            result.groundingSources = groundingSources;
          }
        }
      }
      
      setResults([...updatedResults]);
      setActiveTab('prompt');

      // Score each category's prompts
      for (let i = 0; i < updatedResults.length; i++) {
        const result = updatedResults[i];
        if (result.generatedPrompts.length > 0) {
          try {
            const scores = await scorePrompts(
              result.generatedPrompts, 
              settings, 
              result.contentType, 
              result.categoryName,
              result.buyerPersona,
              result.visualTrends,
              result.creativeAdvice
            );
            setResults(prev => prev.map(r => r.id === result.id ? { ...r, promptScores: scores, isGeneratingPrompts: false } : r));
          } catch (scoreError) {
            console.error(`Scoring failed for ${result.categoryName}:`, scoreError);
            setResults(prev => prev.map(r => r.id === result.id ? { ...r, isGeneratingPrompts: false } : r));
          }
        }
      }

      setToast({ show: true, message: 'Semua prompt berhasil dibuat dan dinilai!' });
    } catch (error) {
      console.error("Batch generation failed:", error);
      setErrorModal({
        show: true,
        title: 'Gagal Generate Massal',
        message: handleGeminiError(error)
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleStar = (id: string) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, isStarred: !r.isStarred } : r));
  };

  const handleDownloadPrompts = (category: CategoryResult) => {
    const content = `Category: ${category.categoryName}\nKeywords: ${category.mainKeywords.join(", ")}\nGenerated: ${new Date().toLocaleString()}\n\n${"-".repeat(50)}\n\n${category.generatedPrompts.join('\n\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category.categoryName.replace(/\s+/g, '_')}_prompts.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAllPrompts = (category: CategoryResult) => {
    navigator.clipboard.writeText(category.generatedPrompts.join('\n\n'));
    setToast({ show: true, message: 'Berhasil disalin ke clipboard!' });
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setKeyword(item.query);
    setContentType(item.contentType || 'Photo');
    setActiveTab("top");
  };

  const handleViewPrompts = (id: string) => {
    setSelectedPromptCategoryId(id);
    setActiveTab("prompt");
  };

  const handleTrendToPrompts = async (niche: string) => {
    setKeyword(niche);
    setActiveTab('analysis');
    setIsAnalyzing(true);
    
    try {
      // 1. Deep Analysis
      const data = await analyzeKeyword(niche, contentType, 'General Market', settings, referenceFile || undefined, referenceUrl || undefined);
      const formattedResults: CategoryResult[] = data.map((item: any) => ({
        id: Math.random().toString(36).substring(7),
        categoryName: item.categoryName,
        contentType: contentType,
        mainKeywords: item.mainKeywords,
        longTailKeywords: item.longTailKeywords,
        volumeLevel: item.volumeLevel,
        volumeNumber: item.volumeNumber,
        competition: item.competition,
        competitionScore: item.competitionScore,
        trend: item.trend,
        trendPercent: item.trendPercent,
        difficultyScore: item.difficultyScore,
        opportunityScore: item.opportunityScore,
        nicheScore: item.nicheScore,
        demandVariance: item.demandVariance,
        keiScore: item.keiScore,
        commercialIntent: item.commercialIntent,
        assetTypeSuitability: item.assetTypeSuitability,
        buyerPersona: item.buyerPersona,
        visualTrends: item.visualTrends,
        creativeAdvice: item.creativeAdvice,
        metadataStrategy: item.metadataStrategy,
        generatedPrompts: [],
        isGeneratingPrompts: false,
        isUpgrading: false,
        isStarred: false,
        groundingSources: item.groundingSources
      }));
      setResults(formattedResults);
      
      // 2. Generate All Prompts automatically
      if (formattedResults.length > 0) {
        setToast({ show: true, message: 'Analisis selesai, mulai membuat prompt...' });
        
        const actualTotalCount = Math.min(settings.promptCount * formattedResults.length, 5000);
        const { promptsMap, groundingSources } = await generateAllPromptsBatch(
          niche,
          formattedResults,
          actualTotalCount,
          settings,
          contentType,
          referenceUrl,
          setProgress
        );

        const updatedResults = [...formattedResults];
        for (const result of updatedResults) {
          const prompts = promptsMap.get(result.categoryName) || [];
          if (prompts.length > 0) {
            result.generatedPrompts = prompts;
            result.isGeneratingPrompts = true;
            if (groundingSources) {
              result.groundingSources = groundingSources;
            }
          }
        }
        
        setResults([...updatedResults]);
        setActiveTab('prompt');

        // Score each category's prompts (async background)
        for (let i = 0; i < updatedResults.length; i++) {
          const result = updatedResults[i];
          if (result.generatedPrompts.length > 0) {
            try {
              const scores = await scorePrompts(
                result.generatedPrompts, 
                settings, 
                result.contentType, 
                result.categoryName,
                result.buyerPersona,
                result.visualTrends,
                result.creativeAdvice
              );
              setResults(prev => prev.map(r => r.id === result.id ? { ...r, promptScores: scores, isGeneratingPrompts: false } : r));
            } catch (scoreError) {
              console.error(`Scoring failed for ${result.categoryName}:`, scoreError);
              setResults(prev => prev.map(r => r.id === result.id ? { ...r, isGeneratingPrompts: false } : r));
            }
          }
        }
        setToast({ show: true, message: 'Semua prompt berhasil dibuat!' });
      }
    } catch (error) {
      console.error("Trend to Prompts workflow failed:", error);
      setErrorModal({
        show: true,
        title: 'Workflow Gagal',
        message: handleGeminiError(error)
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeCompetitor = async (category: CategoryResult) => {
    setIsAnalyzing(true);
    setToast({ show: true, message: `Membedah strategi kompetitor untuk ${category.categoryName}...` });
    
    try {
      const intel = await analyzeCompetitorIntel(category.categoryName, category.contentType, settings);
      setResults(prev => prev.map(r => r.id === category.id ? { ...r, competitorIntel: intel } : r));
      setToast({ show: true, message: 'Analisis Intelijen Selesai!' });
    } catch (error) {
      console.error("Competitor analysis failed:", error);
      setErrorModal({
        show: true,
        title: 'Gagal Analisis Intelijen',
        message: handleGeminiError(error)
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunPipeline = async (steps: string[]) => {
    if (!keyword.trim() && !referenceFile && !referenceUrl.trim()) {
      setErrorModal({ show: true, title: 'Input Diperlukan', message: 'Masukkan kata kunci atau referensi sebelum menjalankan pipeline.' });
      return;
    }

    setIsPipelineRunning(true);
    setIsAnalyzing(true);
    setProgress({ current: 0, total: steps.length, message: 'Memulai Pipeline...' });

    try {
      let currentResults = [...results];
      let stepIndex = 0;

      // STEP 1: ANALYZE
      if (steps.includes('analyze')) {
        stepIndex++;
        setProgress({ current: stepIndex, total: steps.length, message: 'Menganalisis Tren Pasar...' });
        const data = await analyzeKeyword(keyword, contentType, 'General Market', settings, referenceFile || undefined, referenceUrl || undefined);
        currentResults = data.map((item: any) => ({
          id: Math.random().toString(36).substring(7),
          categoryName: item.categoryName,
          contentType: contentType,
          mainKeywords: item.mainKeywords,
          longTailKeywords: item.longTailKeywords,
          volumeLevel: item.volumeLevel,
          volumeNumber: item.volumeNumber,
          competition: item.competition,
          competitionScore: item.competitionScore,
          trend: item.trend,
          trendPercent: item.trendPercent,
          difficultyScore: item.difficultyScore,
          opportunityScore: item.opportunityScore,
          nicheScore: item.nicheScore,
          demandVariance: item.demandVariance,
          keiScore: item.keiScore,
          commercialIntent: item.commercialIntent,
          assetTypeSuitability: item.assetTypeSuitability,
          buyerPersona: item.buyerPersona,
          visualTrends: item.visualTrends,
          creativeAdvice: item.creativeAdvice,
          metadataStrategy: item.metadataStrategy,
          generatedPrompts: [],
          isGeneratingPrompts: false,
          isUpgrading: false,
          isStarred: false,
          groundingSources: item.groundingSources
        }));
        setResults(currentResults);
      }

      // STEP 2: GENERATE PROMPTS
      if (steps.includes('generate') && currentResults.length > 0) {
        stepIndex++;
        setProgress({ current: stepIndex, total: steps.length, message: 'Membuat Prompt Massal...' });
        const actualTotalCount = Math.min(settings.promptCount * currentResults.length, 5000);
        const { promptsMap, groundingSources } = await generateAllPromptsBatch(
          keyword,
          currentResults,
          actualTotalCount,
          settings,
          contentType,
          referenceUrl,
          setProgress
        );

        currentResults = currentResults.map(result => {
          const prompts = promptsMap.get(result.categoryName) || [];
          return {
            ...result,
            generatedPrompts: prompts,
            isGeneratingPrompts: prompts.length > 0,
            groundingSources: groundingSources || result.groundingSources
          };
        });
        setResults(currentResults);
      }

      // STEP 3: SCORE PROMPTS (Parallel Processing)
      if (steps.includes('score') && currentResults.length > 0) {
        stepIndex++;
        setProgress({ current: stepIndex, total: steps.length, message: 'Menilai Kualitas Prompt (Paralel)...' });
        
        const scoringPromises = currentResults.map(async (result) => {
          if (result.generatedPrompts.length > 0) {
            try {
              const scores = await scorePrompts(
                result.generatedPrompts, 
                settings, 
                result.contentType, 
                result.categoryName,
                result.buyerPersona,
                result.visualTrends,
                result.creativeAdvice
              );
              return { id: result.id, scores };
            } catch (e) {
              console.error(`Scoring failed for ${result.categoryName}:`, e);
              return { id: result.id, scores: [] };
            }
          }
          return { id: result.id, scores: [] };
        });

        const allScores = await Promise.all(scoringPromises);
        currentResults = currentResults.map(result => {
          const scoreData = allScores.find(s => s.id === result.id);
          return {
            ...result,
            promptScores: scoreData?.scores || [],
            isGeneratingPrompts: false
          };
        });
        setResults(currentResults);
      }

      // STEP 4: GENERATE METADATA (Parallel Processing)
      if (steps.includes('metadata') && currentResults.length > 0) {
        stepIndex++;
        setProgress({ current: stepIndex, total: steps.length, message: 'Membuat Metadata Adobe Stock (Paralel)...' });
        
        const metadataPromises = currentResults.map(async (result) => {
          if (result.generatedPrompts.length > 0) {
            try {
              const metadata = await generateAdobeStockMetadata(
                result.generatedPrompts, 
                result.categoryName,
                settings,
                contentType
              );
              return { id: result.id, metadata };
            } catch (e) {
              console.error(`Metadata failed for ${result.categoryName}:`, e);
              return { id: result.id, metadata: [] };
            }
          }
          return { id: result.id, metadata: [] };
        });

        const allMetadata = await Promise.all(metadataPromises);
        currentResults = currentResults.map(result => {
          const metaData = allMetadata.find(m => m.id === result.id);
          return {
            ...result,
            metadata: metaData?.metadata || [],
            isGeneratingMetadata: false
          };
        });
        setResults(currentResults);
      }

      setToast({ show: true, message: 'Pipeline Berhasil Diselesaikan!' });
      setActiveTab('prompt');
    } catch (error) {
      console.error("Pipeline execution failed:", error);
      setErrorModal({
        show: true,
        title: 'Pipeline Gagal',
        message: handleGeminiError(error)
      });
    } finally {
      setIsPipelineRunning(false);
      setIsAnalyzing(false);
      setProgress(null);
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case "opportunity": return b.opportunityScore - a.opportunityScore;
      case "volume": return b.volumeNumber - a.volumeNumber;
      case "trend": return b.trendPercent - a.trendPercent;
      case "difficulty": return a.difficultyScore - b.difficultyScore;
      default: return 0;
    }
  }).filter(c => filterCompetition === "all" || c.competition === filterCompetition);

  if (!isSessionActive) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-cyan-500/30 relative overflow-hidden font-sans">
        {/* Atmospheric Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-panel rounded-[2rem] p-10 shadow-2xl relative z-10 overflow-hidden scanline"
        >
          <div className="relative mb-10 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-3xl flex items-center justify-center mb-6 mx-auto futuristic-glow"
            >
              <Sparkles className="w-10 h-10 text-cyan-400" />
            </motion.div>
            
            <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
              MICROSTOCK<span className="text-cyan-400">.</span>AI
            </h1>
            <p className="text-slate-400 text-sm font-light leading-relaxed max-w-[280px] mx-auto">
              Advanced market intelligence for elite stock contributors.
            </p>
          </div>
          
          <form onSubmit={handleStartSession} className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Access Protocol</label>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] text-cyan-500/70 hover:text-cyan-400 transition-colors uppercase tracking-wider">Get Key</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Enter Gemini API Key"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl text-white pl-11 pr-12 py-4 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-slate-600 font-mono text-sm"
                />
                {tempApiKey && (
                  <button
                    type="button"
                    onClick={() => setTempApiKey('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {validationError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{validationError}</p>
                </motion.div>
              )}
            </div>

            <button
              type="submit"
              disabled={!tempApiKey.trim() || isValidating}
              className="w-full group relative flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                {isValidating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> INITIALIZING...</>
                ) : (
                  <>AUTHORIZE ACCESS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
            </button>
            
            <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest">
              Secure Environment • v1.3.0
            </p>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-cyan-500/30 relative">
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] bg-cyan-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[25%] h-[25%] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      <nav className="sticky top-0 z-50 flex items-center justify-center p-6 pointer-events-none">
        <div className="flex items-center space-x-1 glass-panel rounded-full p-1.5 pointer-events-auto shadow-2xl">
          <div className="p-2 bg-white/5 rounded-full text-cyan-400 mr-2">
            <Sparkles size={14} />
          </div>
          <div className="flex items-center gap-1">
            {WORKFLOW_STEPS.map((step) => (
              <button 
                key={step.id}
                onClick={() => {
                  setActiveTab(step.id as Tab);
                  if (step.id === 'prompt') setSelectedPromptCategoryId(null);
                }} 
                className={`group relative px-5 py-2 rounded-full transition-all duration-500 ${
                  activeTab === step.id 
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black tracking-[0.2em]">{step.label}</span>
                  <span className={`text-[7px] font-bold uppercase tracking-widest mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6 whitespace-nowrap pointer-events-none ${activeTab === step.id ? 'text-white' : 'text-slate-500'}`}>
                    {step.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="w-px h-6 bg-white/10 mx-4" />
          
          <div className="flex items-center gap-1">
            {[
              { id: 'results', label: 'HISTORY' },
              { id: 'settings', label: 'CONFIG' },
              { id: 'guide', label: 'HELP' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-4 py-2 rounded-full text-[9px] font-bold tracking-widest transition-all ${
                  activeTab === tab.id ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-500 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-white/10 mx-2" />
          <button 
            onClick={() => setActiveTab('donate')}
            className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] transition-all ${
              activeTab === 'donate' ? 'text-pink-400 bg-pink-400/10' : 'text-slate-500 hover:text-pink-400'
            }`}
          >
            SUPPORT
          </button>
        </div>
      </nav>

      <main className="relative z-10 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
        {activeTab === 'pipeline' && (
          <PipelineTab 
            results={results}
            settings={settings}
            onRunPipeline={handleRunPipeline}
            isPipelineRunning={isPipelineRunning}
          />
        )}

        {activeTab === 'intelligence' && (
          <IntelligenceTab 
            results={results}
            onAnalyzeCompetitor={handleAnalyzeCompetitor}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'settings' && (
          <Settings 
            settings={settings} 
            setSettings={setSettings} 
            onEndSession={handleEndSession}
            onSavePreferences={handleSavePreferences}
            prefsSaved={prefsSaved}
            prefsValidationMessage={prefsValidationMessage}
          />
        )}

        {activeTab === 'wizard' && (
          <PromptWizard 
            keyword={keyword}
            setKeyword={setKeyword}
            contentType={contentType}
            setContentType={setContentType}
            onGenerate={(prompt) => handleAnalyze(prompt)}
            isGenerating={isAnalyzing}
            settings={settings}
            progress={progress}
            onSelectTrend={handleTrendToPrompts}
          />
        )}
        
        {activeTab === 'top' && (
          <>
            <TopTab 
              keyword={keyword}
              setKeyword={setKeyword}
              contentType={contentType}
              setContentType={setContentType}
              onAnalyze={handleAnalyze}
              onQuickGenerate={handleQuickGenerate}
              onAnalyzeAesthetic={handleAnalyzeAesthetic}
              isAnalyzing={isAnalyzing}
              isAnalyzingAesthetic={isAnalyzingAesthetic}
              aestheticAnalysis={aestheticAnalysis}
              setAestheticAnalysis={setAestheticAnalysis}
              results={results}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterCompetition={filterCompetition}
              setFilterCompetition={setFilterCompetition}
              referenceFile={referenceFile}
              setReferenceFile={setReferenceFile}
              referenceUrl={referenceUrl}
              setReferenceUrl={setReferenceUrl}
              settings={settings}
              onSelectTrend={handleTrendToPrompts}
            />

            {results.length > 0 && (
              <div className="max-w-6xl mx-auto px-6 pb-20">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel overflow-hidden border-white/10"
                >
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[1000px] text-left text-sm border-collapse">
                      <thead className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold border-b border-white/5 bg-white/[0.02]">
                        <tr>
                          <th className="px-6 py-4 font-bold">Neural Sector</th>
                          <th className="px-6 py-4 font-bold">Data Vectors</th>
                          <th className="px-6 py-4 font-bold">Volume</th>
                          <th className="px-6 py-4 font-bold">Competition</th>
                          <th className="px-6 py-4 font-bold">Trend</th>
                          <th className="px-6 py-4 font-bold text-center">Opportunity</th>
                          <th className="px-6 py-4 font-bold text-right">Protocol</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {sortedResults.map((result) => (
                          <ResultRow 
                            key={result.id} 
                            result={result} 
                            onToggleStar={handleToggleStar}
                            onViewPrompts={handleViewPrompts}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            )}
          </>
        )}

        {activeTab === 'analysis' && (
          <AnalysisTab 
            results={results} 
            onToggleStar={handleToggleStar} 
            onGenerateAll={handleGenerateAllPrompts}
            isGeneratingAll={isAnalyzing}
            settings={settings}
            setResults={setResults}
            onSelect={handleTrendToPrompts}
          />
        )}
        
        {activeTab === 'results' && (
          <ResultsTab 
            results={results} 
            history={history} 
            onClearHistory={handleClearHistory} 
            onLoadHistory={handleLoadHistory} 
            onGenerateMetadata={handleGenerateMetadata}
            onUpgrade={handleUpgradePrompts}
          />
        )}
        
        {activeTab === 'donate' && (
          <DonateTab />
        )}

        {activeTab === 'changelog' && (
          <ChangelogTab />
        )}

        {activeTab === 'guide' && (
          <GuideTab />
        )}

        {activeTab === 'prompt' && (
          <PromptTab 
            results={results} 
            selectedCategoryId={selectedPromptCategoryId} 
            onBack={() => setActiveTab('top')} 
            onGenerate={handleGeneratePrompts}
            onUpgrade={handleUpgradePrompts}
            promptsCount={settings.promptCount}
            setPromptsCount={(count) => setSettings(s => ({ ...s, promptCount: typeof count === 'function' ? count(s.promptCount) : count }))}
            onShowToast={(msg) => setToast({ show: true, message: msg })}
            progress={progress}
          />
        )}
        </motion.div>
        </AnimatePresence>
      </main>

      {/* Error Modal Overlay */}
      <AnimatePresence>
        {errorModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setErrorModal({ ...errorModal, show: false })}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-panel border border-red-500/30 rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white">{errorModal.title}</h3>
                </div>
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 mb-8">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {errorModal.message}
                  </p>
                </div>
                <button
                  onClick={() => setErrorModal({ ...errorModal, show: false })}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-xs"
                >
                  DISMISS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold shadow-2xl futuristic-glow"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] tracking-[0.2em] uppercase">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
