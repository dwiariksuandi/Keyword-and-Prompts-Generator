import { useState } from 'react';
import { analyzeKeyword, analyzeCompetitorIntel, predictSalesPotential, handleGeminiError } from '../services/gemini';
import { CategoryResult, AppSettings, SalesRecord } from '../types';

export function useMarketAnalysis(settings: AppSettings, salesRecords: SalesRecord[]) {
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorModal, setErrorModal] = useState<{show: boolean, title: string, message: string}>({
    show: false,
    title: '',
    message: ''
  });

  const handleAnalyze = async (keyword: string, contentType: string, referenceFile: any, referenceUrl: string) => {
    setIsAnalyzing(true);
    try {
      const data = await analyzeKeyword(keyword, contentType, settings, referenceFile || undefined, referenceUrl || undefined);
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
    } catch (error) {
      setErrorModal({
        show: true,
        title: 'Analisis Gagal',
        message: handleGeminiError(error)
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeCompetitor = async (category: CategoryResult) => {
    setIsAnalyzing(true);
    try {
      const intel = await analyzeCompetitorIntel(category.categoryName, category.contentType, settings);
      setResults(prev => prev.map(r => r.id === category.id ? { ...r, competitorIntel: intel } : r));
    } catch (error) {
      setErrorModal({ show: true, title: 'Gagal Analisis Intelijen', message: handleGeminiError(error) });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePredictSales = async (id: string) => {
    const result = results.find(r => r.id === id);
    if (!result) return;
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

  return {
    results, setResults,
    isAnalyzing,
    errorModal, setErrorModal,
    handleAnalyze,
    handleAnalyzeCompetitor,
    handlePredictSales
  };
}
