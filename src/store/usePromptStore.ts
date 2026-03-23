import { create } from 'zustand';
import { AppSettings, ReferenceFile } from '../types';

interface PromptState {
  keyword: string;
  contentType: string;
  referenceFile: ReferenceFile | null;
  referenceUrl: string;
  settings: AppSettings;
  promptsCount: number;
  selectedPromptCategoryId: string | null;

  // Actions
  setKeyword: (keyword: string | ((prev: string) => string)) => void;
  setContentType: (type: string) => void;
  setReferenceFile: (file: ReferenceFile | null) => void;
  setReferenceUrl: (url: string) => void;
  setSettings: (settings: AppSettings | ((prev: AppSettings) => AppSettings)) => void;
  setPromptsCount: (count: number) => void;
  setSelectedPromptCategoryId: (id: string | null) => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  keyword: '',
  contentType: 'Photo',
  referenceFile: null,
  referenceUrl: '',
  promptsCount: 100,
  selectedPromptCategoryId: null,
  settings: {
    apiKey: '',
    model: 'gemini-3.1-flash-lite-preview',
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
    includeNegative: false,
    customNegativePrompt: '--no text, typography, words, letters, watermark, signature, logos, brands, trademark, copyright, recognizable characters, real people, celebrity, deformed, bad anatomy, extra limbs, missing fingers, mutated hands, poorly drawn face, asymmetrical eyes, blurry, out of focus, noise, artifacts, low resolution, pixelated, overexposed, underexposed, artificial look, plastic skin',
    autoSave: true,
    variationLevel: 'Medium'
  },

  setKeyword: (keyword) => set((state) => ({ keyword: typeof keyword === 'function' ? keyword(state.keyword) : keyword })),
  setContentType: (type) => set({ contentType: type }),
  setReferenceFile: (file) => set({ referenceFile: file }),
  setReferenceUrl: (url) => set({ referenceUrl: url }),
  setSettings: (settings) => set((state) => ({ settings: typeof settings === 'function' ? settings(state.settings) : settings })),
  setPromptsCount: (count) => set({ promptsCount: count }),
  setSelectedPromptCategoryId: (id) => set({ selectedPromptCategoryId: id }),
}));
