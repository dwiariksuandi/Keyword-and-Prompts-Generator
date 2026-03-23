import { usePromptStore } from '../store/usePromptStore';
import { useUIStore } from '../store/useUIStore';
import { useMarketStore } from '../store/useMarketStore';
import { generatePrompts } from '../services/promptGenerationService';

export const usePromptGeneration = () => {
  const { keyword, contentType, settings, referenceFile, referenceUrl } = usePromptStore();
  const { setToast, setIsAnalyzing } = useUIStore();
  const { setResults } = useMarketStore();

  const handleQuickGenerate = async () => {
    setIsAnalyzing(true);
    try {
      const prompts = await generatePrompts(keyword, contentType, settings, 1, referenceFile, referenceUrl || undefined);
      
      // Update results if there's a matching keyword/content type
      setResults(prev => prev.map(r => 
        (r.categoryName === keyword && r.contentType === contentType) 
          ? { ...r, generatedPrompts: [...r.generatedPrompts, ...prompts] } 
          : r
      ));

      setToast({ show: true, message: 'Quick generate successful!' });
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: 'Quick generate failed.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGeneratePrompts = async (id?: string) => {
    setIsAnalyzing(true);
    try {
      const prompts = await generatePrompts(keyword, contentType, settings, settings.promptCount, referenceFile, referenceUrl || undefined);
      
      setResults(prev => prev.map(r => {
        if (id) {
          return r.id === id ? { ...r, generatedPrompts: prompts } : r;
        } else {
          return (r.categoryName === keyword && r.contentType === contentType)
            ? { ...r, generatedPrompts: prompts }
            : r;
        }
      }));

      setToast({ show: true, message: 'Prompts generated successfully!' });
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: 'Prompt generation failed.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpgradePrompts = async () => {
    setToast({ show: true, message: 'Upgrade prompts feature not implemented.' });
  };

  const handleGenerateMetadata = async () => {
    setToast({ show: true, message: 'Generate metadata feature not implemented.' });
  };

  const handleGenerateAllPrompts = async () => {
    setToast({ show: true, message: 'Generate all prompts feature not implemented.' });
  };

  const handlePolishMetadata = async () => {
    setToast({ show: true, message: 'Polish metadata feature not implemented.' });
  };

  const handleVisualizePrompt = async () => {
    setToast({ show: true, message: 'Visualize prompt feature not implemented.' });
  };

  const handleRatePrompt = async () => {
    setToast({ show: true, message: 'Rate prompt feature not implemented.' });
  };

  return {
    handleQuickGenerate,
    handleGeneratePrompts,
    handleUpgradePrompts,
    handleGenerateMetadata,
    handleGenerateAllPrompts,
    handlePolishMetadata,
    handleVisualizePrompt,
    handleRatePrompt
  };
};
