import { useState, useEffect, useRef, useCallback } from 'react';
import Papa from 'papaparse';
import { 
  analyzeKeyword, 
  generatePrompts, 
  generatePromptsDirectly, 
  generateAllPromptsBatch, 
  optimizePrompts, 
  handleGeminiError, 
  generateAdobeStockMetadata, 
  polishMetadata, 
  generateImagePreview, 
  scorePrompts, 
  analyzeAestheticReference, 
  analyzeUrlAesthetic, 
  refinePrompts, 
  analyzeCompetitorIntel, 
  predictSalesPotential, 
  forecastSeasonalTrends 
} from '../services/gemini';
import { validateAdobeMetadata } from '../services/validator';
import { 
  CategoryResult, 
  AppSettings, 
  HistoryItem, 
  ReferenceFile, 
  AestheticAnalysis, 
  SalesRecord, 
  TrendForecast,
  Tab
} from '../types';

export function useAppLogic() {
  const userId = 'local-user';
  const [activeTab, setActiveTab] = useState<Tab>("top");
  const [selectedPromptCategoryId, setSelectedPromptCategoryId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [contentType, setContentType] = useState('Photo');
  const [referenceFile, setReferenceFile] = useState<ReferenceFile | null>(null);
  const [referenceUrl, setReferenceUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visualizingPrompt, setVisualizingPrompt] = useState<string | null>(null);
  const [visualizedImage, setVisualizedImage] = useState<string | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [progress, setProgress] = useState<{ current: number, total: number, message: string } | null>(null);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [isAnalyzingAesthetic, setIsAnalyzingAesthetic] = useState(false);
  const [aestheticAnalysis, setAestheticAnalysis] = useState<AestheticAnalysis | null>(null);
  const [results, setResults] = useState<CategoryResult[]>([]);
  const updateResult = (id: string, updater: (r: CategoryResult) => CategoryResult) => {
    setResults(prev => prev.map(r => r.id === id ? updater(r) : r));
  };
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [settings, setSettings] = useState<AppSettings>({
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

  const [sortBy, setSortBy] = useState("opportunity");
  const [filterCompetition, setFilterCompetition] = useState("all");
  
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([]);
  const [isParsingSales, setIsParsingSales] = useState(false);
  const [forecasts, setForecasts] = useState<TrendForecast[]>([]);
  const [isForecasting, setIsForecasting] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const monitorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [errorModal, setErrorModal] = useState<{show: boolean, title: string, message: string}>({
    show: false,
    title: '',
    message: ''
  });
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ''});

  useEffect(() => {
    // Load local preferences as fallback
    const savedPrefs = localStorage.getItem('app_preferences');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setSettings(s => ({ ...s, ...parsed }));
      } catch (e) {
        console.error("Failed to parse local preferences");
      }
    }
  }, []);

  const handleGenerateForecast = async () => {
    setIsForecasting(true);
    setToast({ show: true, message: "Menganalisis pola musiman & sinyal pasar global..." });
    try {
      const data = await forecastSeasonalTrends(settings, salesRecords);
      setForecasts(data);
      setToast({ show: true, message: "Forecast 6 bulan berhasil digenerate!" });
    } catch (error) {
      console.error("Forecasting failed:", error);
      setToast({ show: true, message: "Gagal men-generate forecast." });
    } finally {
      setIsForecasting(false);
    }
  };

  const handleParseSalesCSV = async (file: File) => {
    setIsParsingSales(true);
    setToast({ show: true, message: "Parsing data penjualan..." });

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const records: SalesRecord[] = results.data.map((row: any) => {
            const id = row.id || row.assetId || `sale-${Date.now()}-${Math.random().toString(36).substring(7)}`;
            return {
              id,
              assetId: String(row.assetId || row.id || ''),
              title: String(row.title || ''),
              downloads: Number(row.downloads || row.sales || 0),
              earnings: Number(row.earnings || row.revenue || 0),
              date: String(row.date || new Date().toISOString().split('T')[0]),
              keywords: row.keywords ? String(row.keywords).split(/[;,]/).map((k: string) => k.trim()) : []
            };
          });

          setSalesRecords(records);
          setToast({ show: true, message: `Berhasil mengimpor ${records.length} data penjualan!` });
        } catch (error) {
          console.error("CSV import failed:", error);
          setToast({ show: true, message: "Gagal memproses data CSV." });
        } finally {
          setIsParsingSales(false);
        }
      },
      error: (error) => {
        console.error("PapaParse error:", error);
        setToast({ show: true, message: "Gagal memproses file CSV." });
        setIsParsingSales(false);
      }
    });
  };

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

  const handleSavePreferences = async () => {
    localStorage.setItem('app_preferences', JSON.stringify(settings));
    setPrefsSaved(true);
    setPrefsValidationMessage({ type: 'success', text: 'Preferences saved locally!' });
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
    
    // Caching Strategy: Check backend cache first to save tokens and improve speed
    const cacheKey = `analysis-${searchKeyword}-${contentType}-${safeReferenceUrl}`;
    try {
      const cacheResponse = await fetch(`/api/cache/${encodeURIComponent(cacheKey)}`);
      if (cacheResponse.ok) {
        const { data } = await cacheResponse.json();
        if (data && Array.isArray(data)) {
          setResults(data);
          setToast({ show: true, message: 'Intelligence loaded from neural cache.' });
          setIsAnalyzing(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Cache check failed, proceeding with live analysis.");
    }

    try {
      const data = await analyzeKeyword(searchKeyword, contentType, 'General Market', settings, referenceFile || undefined, safeReferenceUrl || undefined);
      const formattedResults: CategoryResult[] = data.map((item: any) => ({
        id: `res-${Date.now()}-${Math.random().toString(36).substring(7)}`,
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
      
      // Persist to cache
      fetch('/api/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: cacheKey, data: formattedResults })
      }).catch(err => console.error("Failed to persist to cache:", err));
      
      const historyItem: HistoryItem = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        query: keyword || (referenceUrl ? `URL: ${referenceUrl}` : `Visual Analysis (${referenceFile?.name || 'File'})`),
        contentType: contentType,
        timestamp: new Date().toISOString(),
        categoryCount: formattedResults.length,
        promptCount: 0
      };

      setHistory(prev => [historyItem, ...prev]);
      
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
    if (!keyword?.trim() && !referenceFile && !referenceUrl?.trim()) return;
    setIsAnalyzing(true);
    setProgress({ current: 0, total: 100, message: 'Memulai Quick Intelligence...' });
    
    try {
      setProgress({ current: 20, total: 100, message: 'Membedah Strategi Kompetitor...' });
      const intel = await analyzeCompetitorIntel(keyword || (referenceFile ? referenceFile.name : 'Quick Generation'), contentType, settings);

      setProgress({ current: 50, total: 100, message: 'Membuat Prompt Berbasis Intelijen...' });
      const actualCountToGenerate = Math.min(settings.promptCount, 1500);
      const { prompts } = await generatePromptsDirectly(
        actualCountToGenerate, 
        { ...settings, competitorIntel: intel }, 
        contentType, 
        keyword || undefined, 
        referenceFile || undefined, 
        referenceUrl || undefined
      );

      const quickResult: CategoryResult = {
        id: `quick-${Date.now()}-${Math.random().toString(36).substring(7)}`,
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
        creativeAdvice: 'Directly generated from reference with Competitor Intel.',
        generatedPrompts: prompts,
        promptScores: [],
        isGeneratingPrompts: true,
        isUpgrading: false,
        isStarred: true,
        competitorIntel: intel
      };

      setResults(prev => [...prev, quickResult]);
      setActiveTab('prompt');

      setProgress({ current: 90, total: 100, message: 'Menilai Kualitas...' });
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
      
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        query: `Quick Intel: ${keyword || (referenceUrl ? referenceUrl : referenceFile?.name)}`,
        contentType: contentType,
        timestamp: new Date().toISOString(),
        categoryCount: 1,
        promptCount: prompts.length
      };

      setHistory(prev => [historyItem, ...prev]);

    } catch (error) {
      console.error("Quick generation failed:", error);
      setErrorModal({
        show: true,
        title: 'Quick Intelligence Gagal',
        message: handleGeminiError(error)
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(null);
    }
  };

  const handleGeneratePrompts = async (id: string) => {
    const result = results.find(r => r.id === id);
    if (!result) return;
    updateResult(id, r => ({ ...r, isGeneratingPrompts: true }));
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
      const scores = await scorePrompts(prompts, settings, result.contentType, result.categoryName, result.buyerPersona, result.visualTrends, result.creativeAdvice);
      updateResult(id, r => ({ ...r, generatedPrompts: prompts, promptScores: scores, isGeneratingPrompts: false }));
    } catch (error) {
      console.error("Prompt generation failed:", error);
      setErrorModal({ show: true, title: 'Pembuatan Prompt Gagal', message: handleGeminiError(error) });
      updateResult(id, r => ({ ...r, isGeneratingPrompts: false }));
    }
  };

  const handleUpgradePrompts = async (categoryId: string) => {
    const category = results.find(c => c.id === categoryId);
    if (!category || category.generatedPrompts.length === 0) return;
    updateResult(categoryId, c => ({ ...c, isUpgrading: true }));
    try {
      const optimizedPrompts = await optimizePrompts(category.generatedPrompts, settings, category.contentType, keyword || undefined, category.categoryName, referenceFile || undefined, referenceUrl || undefined, category.buyerPersona, category.visualTrends, category.creativeAdvice, category.competitorIntel);
      const refinedPrompts = await refinePrompts(optimizedPrompts, category.contentType, settings);
      const scores = await scorePrompts(refinedPrompts, settings, category.contentType, category.categoryName, category.buyerPersona, category.visualTrends, category.creativeAdvice);
      updateResult(categoryId, r => ({ ...r, generatedPrompts: refinedPrompts, promptScores: scores, isUpgrading: false }));
    } catch (error) {
      console.error("Prompt optimization failed:", error);
      setErrorModal({ show: true, title: 'Optimasi Gagal', message: handleGeminiError(error) });
      updateResult(categoryId, c => ({ ...c, isUpgrading: false }));
    }
  };

  const handleGenerateMetadata = async (categoryId: string) => {
    const category = results.find(c => c.id === categoryId);
    if (!category || category.generatedPrompts.length === 0) return;
    updateResult(categoryId, c => ({ ...c, isGeneratingMetadata: true }));
    try {
      const metadata = await generateAdobeStockMetadata(category.generatedPrompts, category.categoryName, settings, contentType);
      metadata.forEach(m => {
        const validation = validateAdobeMetadata(m.title, m.keywords);
        if (!validation.isValid) throw new Error(`Metadata tidak valid: ${validation.errors.join(', ')}`);
      });
      updateResult(categoryId, r => ({ ...r, metadata, isGeneratingMetadata: false }));
      setToast({ show: true, message: 'Metadata Adobe Stock berhasil dibuat!' });
    } catch (error) {
      console.error("Metadata generation failed:", error);
      setErrorModal({ show: true, title: 'Metadata Gagal', message: handleGeminiError(error) });
      setResults(prev => prev.map(c => c.id === categoryId ? { ...c, isGeneratingMetadata: false } : c));
    }
  };

  const handlePolishMetadata = async (categoryId: string) => {
    const category = results.find(c => c.id === categoryId);
    if (!category || !category.metadata || category.metadata.length === 0) return;
    setResults(prev => prev.map(c => c.id === categoryId ? { ...c, isGeneratingMetadata: true } : c));
    setToast({ show: true, message: 'Polishing Metadata for maximum CTR...' });
    try {
      const polished = await polishMetadata(category.metadata, category.categoryName, settings, category.contentType);
      updateResult(categoryId, r => ({ ...r, metadata: polished, isGeneratingMetadata: false }));
      setToast({ show: true, message: 'Metadata Polishing Selesai!' });
    } catch (error) {
      console.error("Metadata polishing failed:", error);
      setResults(prev => prev.map(c => c.id === categoryId ? { ...c, isGeneratingMetadata: false } : c));
    }
  };

  const handleVisualizePrompt = async (prompt: string) => {
    setVisualizingPrompt(prompt);
    setIsVisualizing(true);
    setVisualizedImage(null);
    try {
      const imageUrl = await generateImagePreview(prompt, settings);
      setVisualizedImage(imageUrl);
    } catch (error) {
      console.error("Visualization failed:", error);
      setToast({ show: true, message: 'Gagal men-generate preview visual.' });
      setIsVisualizing(false);
      setVisualizingPrompt(null);
    }
  };

  const handleGenerateAllPrompts = async () => {
    if (results.length === 0) return;
    setIsAnalyzing(true);
    try {
      const actualTotalCount = Math.min(settings.promptCount * results.length, 5000);
      const { promptsMap, groundingSources } = await generateAllPromptsBatch(keyword, results, actualTotalCount, settings, contentType, referenceUrl, setProgress);
      
      // Use immutable map to update results
      const updatedResults = results.map(result => {
        const prompts = promptsMap.get(result.categoryName) || [];
        if (prompts.length > 0) {
          return {
            ...result,
            generatedPrompts: prompts,
            isGeneratingPrompts: true,
            groundingSources: groundingSources || result.groundingSources
          };
        }
        return result;
      });
      
      setResults(updatedResults);
      setActiveTab('prompt');
      
      // Score prompts sequentially to avoid overwhelming the API
      for (const result of updatedResults) {
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
      setErrorModal({ show: true, title: 'Gagal Generate Massal', message: handleGeminiError(error) });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePredictSales = async (id: string) => {
    const result = results.find(r => r.id === id);
    if (!result) return;
    setToast({ show: true, message: "AI is analyzing market data..." });
    try {
      const prediction = await predictSalesPotential(result.categoryName, result.contentType, settings, salesRecords);
      const updatedResult = { ...result, salesData: prediction };
      setResults(prev => prev.map(r => r.id === id ? updatedResult : r));
      setErrorModal({
        show: true,
        title: "Sales Potential Analysis",
        message: `Estimated Monthly Sales: ${prediction.estimatedMonthlySales} downloads\nConfidence: ${prediction.confidenceScore}%\n\nKey Factors:\n${prediction.topSellingFactors.map(f => `• ${f}`).join('\n')}`
      });
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  const handleToggleStar = (id: string) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, isStarred: !r.isStarred } : r));
  };

  const handleClearHistory = async () => {
    setToast({ show: true, message: 'Fitur hapus riwayat Cloud akan segera hadir.' });
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
      const data = await analyzeKeyword(niche, contentType, 'General Market', settings, referenceFile || undefined, referenceUrl || undefined);
      const formattedResults: CategoryResult[] = data.map((item: any) => ({
        id: `res-${Date.now()}-${Math.random().toString(36).substring(7)}`,
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
      
      if (formattedResults.length > 0) {
        setToast({ show: true, message: 'Analisis selesai, mulai membuat prompt...' });
        const actualTotalCount = Math.min(settings.promptCount * formattedResults.length, 5000);
        const { promptsMap, groundingSources } = await generateAllPromptsBatch(niche, formattedResults, actualTotalCount, settings, contentType, referenceUrl, setProgress);
        
        const updatedResults = formattedResults.map(result => {
          const prompts = promptsMap.get(result.categoryName) || [];
          if (prompts.length > 0) {
            return {
              ...result,
              generatedPrompts: prompts,
              isGeneratingPrompts: true,
              groundingSources: groundingSources || result.groundingSources
            };
          }
          return result;
        });
        
        setResults(updatedResults);
        setActiveTab('prompt');
        
        for (const result of updatedResults) {
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
      setErrorModal({ show: true, title: 'Workflow Gagal', message: handleGeminiError(error) });
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
      setErrorModal({ show: true, title: 'Gagal Analisis Intelijen', message: handleGeminiError(error) });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunPipeline = async (steps: string[]) => {
    if (steps.includes('analyze') && !keyword.trim() && !referenceFile && !referenceUrl.trim()) {
      setErrorModal({ show: true, title: 'Input Diperlukan', message: 'Masukkan kata kunci atau referensi sebelum menjalankan analisis pasar.' });
      return;
    }
    if (!steps.includes('analyze') && results.length === 0) {
      setErrorModal({ show: true, title: 'Data Tidak Ditemukan', message: 'Lakukan riset pasar terlebih dahulu atau aktifkan langkah "Market Research" di pipeline.' });
      return;
    }
    setIsPipelineRunning(true);
    setIsAnalyzing(true);
    setProgress({ current: 0, total: steps.length, message: 'Memulai Pipeline...' });
    try {
      let currentResults = [...results];
      let stepIndex = 0;
      if (steps.includes('analyze')) {
        stepIndex++;
        setProgress({ current: stepIndex, total: steps.length, message: 'Menganalisis Tren Pasar...' });
        const data = await analyzeKeyword(keyword, contentType, 'General Market', settings, referenceFile || undefined, referenceUrl || undefined);
        currentResults = data.map((item: any) => ({
          id: `res-${Date.now()}-${Math.random().toString(36).substring(7)}`,
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
      if (steps.includes('intel') && currentResults.length > 0) {
        stepIndex++;
        setProgress({ current: stepIndex, total: steps.length, message: 'Membedah Strategi Kompetitor (Paralel)...' });
        const intelPromises = currentResults.map(async (result) => {
          try {
            const intel = await analyzeCompetitorIntel(result.categoryName, result.contentType, settings);
            return { id: result.id, intel };
          } catch (e) {
            return { id: result.id, intel: null };
          }
        });
        const allIntel = await Promise.all(intelPromises);
        currentResults = currentResults.map(result => {
          const intelData = allIntel.find(i => i.id === result.id);
          return { ...result, competitorIntel: intelData?.intel || result.competitorIntel };
        });
        setResults(currentResults);
      }
      if (steps.includes('generate') && currentResults.length > 0) {
        stepIndex++;
        setProgress({ current: stepIndex, total: steps.length, message: 'Membuat Prompt Massal...' });
        const actualTotalCount = Math.min(settings.promptCount * currentResults.length, 5000);
        const { promptsMap, groundingSources } = await generateAllPromptsBatch(keyword, currentResults, actualTotalCount, settings, contentType, referenceUrl, setProgress);
        currentResults = currentResults.map(result => {
          const prompts = promptsMap.get(result.categoryName) || [];
          return { ...result, generatedPrompts: prompts, isGeneratingPrompts: prompts.length > 0, groundingSources: groundingSources || result.groundingSources };
        });
        setResults(currentResults);
      }
      if (steps.includes('score') && currentResults.length > 0) {
        stepIndex++;
        setProgress({ current: stepIndex, total: steps.length, message: 'Menilai Kualitas Prompt...' });
        for (let i = 0; i < currentResults.length; i++) {
          const result = currentResults[i];
          if (result.generatedPrompts.length > 0) {
            try {
              const scores = await scorePrompts(result.generatedPrompts, settings, result.contentType, result.categoryName, result.buyerPersona, result.visualTrends, result.creativeAdvice);
              currentResults[i] = { ...result, promptScores: scores, isGeneratingPrompts: false };
            } catch (scoreError) {
              console.error(`Scoring failed for ${result.categoryName}:`, scoreError);
              currentResults[i] = { ...result, isGeneratingPrompts: false };
            }
          }
        }
        setResults([...currentResults]);
      }
      setToast({ show: true, message: 'Pipeline selesai!' });
    } catch (error) {
      console.error("Pipeline failed:", error);
      setErrorModal({ show: true, title: 'Pipeline Gagal', message: handleGeminiError(error) });
    } finally {
      setIsPipelineRunning(false);
      setIsAnalyzing(false);
      setProgress(null);
    }
  };

  const handleToggleMonitor = () => {
    if (isMonitoring) {
      if (monitorIntervalRef.current) clearInterval(monitorIntervalRef.current);
      setIsMonitoring(false);
      setToast({ show: true, message: 'Market Monitor dihentikan.' });
    } else {
      setIsMonitoring(true);
      setToast({ show: true, message: 'Market Monitor diaktifkan! AI akan memantau tren secara berkala.' });
      // Simulate monitoring every 5 minutes
      monitorIntervalRef.current = setInterval(() => {
        console.log("Agentic Monitor: Checking for new market signals...");
        // In a real app, this would call an API or run a background task
      }, 300000);
    }
  };

  useEffect(() => {
    return () => {
      if (monitorIntervalRef.current) clearInterval(monitorIntervalRef.current);
    };
  }, []);

  return {
    activeTab, setActiveTab,
    selectedPromptCategoryId, setSelectedPromptCategoryId,
    keyword, setKeyword,
    contentType, setContentType,
    referenceFile, setReferenceFile,
    referenceUrl, setReferenceUrl,
    isAnalyzing,
    visualizingPrompt,
    visualizedImage,
    isVisualizing, setIsVisualizing,
    progress,
    isPipelineRunning,
    isAnalyzingAesthetic,
    aestheticAnalysis, setAestheticAnalysis,
    results, setResults,
    history,
    settings, setSettings,
    prefsSaved,
    prefsValidationMessage,
    sortBy, setSortBy,
    filterCompetition, setFilterCompetition,
    salesRecords,
    isParsingSales,
    forecasts,
    isMonitoring,
    handleToggleMonitor,
    errorModal, setErrorModal,
    toast, setToast
  };
}
