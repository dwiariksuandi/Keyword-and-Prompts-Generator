import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiStore {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

export const useApiStore = create<ApiStore>()(
  persist(
    (set) => ({
      apiKey: localStorage.getItem('gemini_api_key') || '',
      setApiKey: (key: string) => {
        localStorage.setItem('gemini_api_key', key);
        set({ apiKey: key });
      },
      clearApiKey: () => {
        localStorage.removeItem('gemini_api_key');
        set({ apiKey: '' });
      },
    }),
    {
      name: 'api-storage',
    }
  )
);
