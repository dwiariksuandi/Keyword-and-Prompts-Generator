import { useState } from 'react';
import { CategoryResult } from '../types';
import { generatePrompts, generatePromptsDirectly, generateAllPromptsBatch, optimizePrompts, scorePrompts, handleGeminiError, generateAdobeStockMetadata } from '../services/gemini';
import { usePromptStore } from '../store/usePromptStore';
import { useMarketStore } from '../store/useMarketStore';
import { useUIStore } from '../store/useUIStore';

export const usePromptGeneration = () => {
  const {
    keyword,
    contentType,
    referenceFile,
    referenceUrl,
    settings
  } = usePromptStore();

  const {
    results, setResults,
    setHistory
  } = useMarketStore();

  const {
    setErrorModal,
    setToast,
    setIsAnalyzing
  } = useUIStore();

  const handleQuickGenerate = async () => {
    if (!keyword.trim() && !referenceFile && !referenceUrl.trim()) return;
    setIsAnalyzing(true);
    try {
      const actualCountToGenerate = Math.min(settings.promptCount, 5000);
      const prompts = await generatePromptsDirectly(
        keyword || (referenceFile ? referenceFile.name : 'Quick Generation'),
        contentType,
        settings,
        actualCountToGenerate,
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
        trendForecast: 'stable',
        riskLevel: 'Medium',
        riskFactors: [],
        difficultyScore: 0,
        opportunityScore: 100,
        buyerPersona: 'General',
        visualTrends: [],
        creativeAdvice: 'Directly generated from reference.',
        generatedPrompts: prompts,
        isGeneratingPrompts: true, 
        isUpgrading: false,
        isStarred: true,
      };

      setResults(prev => [quickResult, ...prev]);
      // setActiveTab('prompt'); // This should be handled in App.tsx

      try {
        const scores = await scorePrompts(
          prompts, 
          settings
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
      const actualCountToGenerate = Math.min(settings.promptCount, 5000); 
      const prompts = await generatePrompts(
        result.categoryName,
        result.contentType,
        settings,
        actualCountToGenerate,
        referenceFile || undefined,
        referenceUrl || undefined
      );

      const scores = await scorePrompts(
        prompts, 
        settings
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
        settings
      );
      
      const scores = await scorePrompts(
        optimizedPrompts, 
        settings
      );

      setResults(prev => prev.map(c => {
        if (c.id === categoryId) {
          return { ...c, generatedPrompts: optimizedPrompts, promptScores: scores, isUpgrading: false };
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
      const metadata = await Promise.all(
        category.generatedPrompts.map(prompt => 
          generateAdobeStockMetadata(prompt, contentType, settings)
        )
      );
      
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
      const { promptsMap } = await generateAllPromptsBatch(
        keyword,
        results,
        actualTotalCount,
        settings,
        contentType
      );

      const updatedResults = [...results];
      
      for (const result of updatedResults) {
        const prompts = promptsMap[result.categoryName] || [];
        if (prompts.length > 0) {
          result.generatedPrompts = prompts;
          result.isGeneratingPrompts = true;
        }
      }
      
      setResults([...updatedResults]);
      // setActiveTab('prompt'); // Handle in App.tsx

      for (let i = 0; i < updatedResults.length; i++) {
        const result = updatedResults[i];
        if (result.generatedPrompts.length > 0) {
          try {
            const scores = await scorePrompts(
              result.generatedPrompts, 
              settings
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

  return {
    handleQuickGenerate,
    handleGeneratePrompts,
    handleUpgradePrompts,
  handleGenerateMetadata,
    handleGenerateAllPrompts,
    handlePolishMetadata: async (categoryId: string) => {
      const category = results.find(c => c.id === categoryId);
      if (!category || !category.metadata) return;
      setResults(prev => prev.map(c => c.id === categoryId ? { ...c, isGeneratingMetadata: true } : c));
      try {
        // Mock polish logic for now, in real app would call AI
        const polished = category.metadata.map(m => ({
          title: m.title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          keywords: m.keywords.sort()
        }));
        setResults(prev => prev.map(c => c.id === categoryId ? { ...c, metadata: polished, isGeneratingMetadata: false } : c));
        setToast({ show: true, message: 'Metadata dipoles!' });
      } catch (error) {
        setResults(prev => prev.map(c => c.id === categoryId ? { ...c, isGeneratingMetadata: false } : c));
      }
    },
    handleVisualizePrompt: async (prompt: string) => {
      setToast({ show: true, message: `Visualizing: ${prompt.substring(0, 30)}...` });
      // Logic for visualization would go here
    },
    handleRatePrompt: async (categoryId: string, promptIndex: number, rating: number) => {
      setResults(prev => prev.map(c => {
        if (c.id === categoryId && c.promptScores) {
          const newScores = [...c.promptScores];
          newScores[promptIndex] = { ...newScores[promptIndex], rating };
          return { ...c, promptScores: newScores };
        }
        return c;
      }));
    },
    handleOptimizePrompt: async (prompt: string) => {
      setToast({ show: true, message: 'Optimizing prompt...' });
      // Logic for single prompt optimization
    }
  };
};
