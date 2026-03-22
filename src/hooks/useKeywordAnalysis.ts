import { useState, useCallback } from 'react';
import { analyzeKeyword } from '../services/keywordService';
import { AppSettings, ReferenceFile, CategoryResult } from '../types';

export function useKeywordAnalysis(
  settings: AppSettings,
  updateResult: (id: string, updater: (r: CategoryResult) => CategoryResult) => void
) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleKeywordAnalysis = useCallback(async (
    keyword: string, 
    contentType: string, 
    categoryName: string, 
    referenceFile: ReferenceFile | null, 
    referenceUrl: string
  ) => {
    setIsAnalyzing(true);
    try {
      const results = await analyzeKeyword(keyword, contentType, categoryName, settings, referenceFile || undefined, referenceUrl);
      // ... update results state ...
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [settings, updateResult]);

  return { isAnalyzing, handleKeywordAnalysis };
}
