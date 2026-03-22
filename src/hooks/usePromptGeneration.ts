import { useState, useCallback } from 'react';
import { generatePrompts } from '../services/promptService';
import { generatePromptsDirectly, generateAllPromptsBatch, optimizePrompts, refinePrompts } from '../services/gemini';
import { AppSettings, CategoryResult } from '../types';

export function usePromptGeneration(
  settings: AppSettings,
  updateResult: (id: string, updater: (r: CategoryResult) => CategoryResult) => void
) {
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);

  const handleGeneratePrompts = useCallback(async (categoryId: string, categoryName: string, contentType: string) => {
    updateResult(categoryId, c => ({ ...c, isGeneratingPrompts: true }));
    try {
      const prompts = await generatePrompts(categoryName, contentType, settings);
      updateResult(categoryId, c => ({ ...c, generatedPrompts: prompts, isGeneratingPrompts: false }));
    } catch (error) {
      console.error(error);
      updateResult(categoryId, c => ({ ...c, isGeneratingPrompts: false }));
    }
  }, [settings, updateResult]);

  return { isGeneratingPrompts, handleGeneratePrompts };
}
