import { analyzeMarketNiches, analyzeAestheticReference, analyzeUrlAesthetic, handleGeminiError } from '../services/gemini';
import { useMarketStore } from '../store/useMarketStore';
import { usePromptStore } from '../store/usePromptStore';
import { useUIStore } from '../store/useUIStore';
import { vectorStoreService } from '../services/vectorStore';

export const useAnalysis = () => {
  const {
    keyword, setKeyword,
    contentType, setContentType,
    referenceFile, setReferenceFile,
    referenceUrl, setReferenceUrl,
    settings
  } = usePromptStore();

  const {
    setResults,
    setHistory
  } = useMarketStore();

  const {
    setErrorModal,
    setToast,
    setIsAnalyzing,
    setIsAnalyzingAesthetic,
    setAestheticAnalysis,
    isAnalyzing,
    isAnalyzingAesthetic,
    aestheticAnalysis
  } = useUIStore();

  const handleAnalyzeAesthetic = async () => {
    if (!referenceFile && !referenceUrl) return;
    setAestheticAnalysis(null);
    setIsAnalyzingAesthetic(true);
    try {
      let analysis;
      if (referenceFile) {
        analysis = await analyzeAestheticReference(referenceFile, contentType, settings);
      } else {
        analysis = await analyzeUrlAesthetic(referenceUrl, contentType, settings);
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

  const handleAnalyze = async () => {
    if (!(keyword || '').trim() && !referenceFile && !(referenceUrl || '').trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeMarketNiches(keyword, contentType, settings, referenceFile || undefined, referenceUrl || undefined);
      
      // Vector Store: Add to vector store for future recommendations
      await vectorStoreService.add(data, settings.apiKey);

      const formattedResults = data.map((item: any) => ({
        id: Math.random().toString(36).substring(7),
        categoryName: item.categoryName,
        contentType: contentType,
        mainKeywords: item.mainKeywords,
        volumeLevel: item.volumeLevel,
        volumeNumber: item.volumeNumber,
        competition: item.competition,
        competitionScore: item.competitionScore,
        trend: item.trend,
        trendPercent: item.trendPercent,
        trendForecast: item.trendForecast,
        riskLevel: item.riskLevel,
        riskFactors: item.riskFactors,
        difficultyScore: item.difficultyScore,
        opportunityScore: item.opportunityScore,
        buyerPersona: item.buyerPersona,
        visualTrends: item.visualTrends,
        creativeAdvice: item.creativeAdvice,
        generatedPrompts: [],
        isGeneratingPrompts: false,
        isUpgrading: false,
        isStarred: false,
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

  return {
    keyword, setKeyword,
    contentType, setContentType,
    referenceFile, setReferenceFile,
    referenceUrl, setReferenceUrl,
    isAnalyzing,
    isAnalyzingAesthetic,
    aestheticAnalysis, setAestheticAnalysis,
    handleAnalyzeAesthetic,
    handleAnalyze
  };
};
