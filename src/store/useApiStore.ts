import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptKey, decryptKey } from '../services/crypto';

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  isActive: boolean;
  lastUsed: string;
}

interface ApiStore {
  apiKey: string; // Current active key
  apiKeys: ApiKey[]; // All stored keys
  setApiKey: (key: string, name?: string) => void;
  clearApiKey: () => void;
  switchKey: (id: string) => void;
  removeKey: (id: string) => void;
}

export const useApiStore = create<ApiStore>()(
  persist(
    (set, get) => ({
      apiKey: '',
      apiKeys: [],
      setApiKey: (key: string, name = 'Default Key') => {
        const encryptedKey = encryptKey(key);
        const newKey: ApiKey = {
          id: Math.random().toString(36).substring(7),
          key: encryptedKey,
          name,
          isActive: true,
          lastUsed: new Date().toISOString()
        };
        
        const updatedKeys = get().apiKeys.map(k => ({ ...k, isActive: false }));
        updatedKeys.push(newKey);
        
        set({ apiKey: key, apiKeys: updatedKeys });
      },
      clearApiKey: () => {
        set({ apiKey: '', apiKeys: [] });
      },
      switchKey: (id: string) => {
        const updatedKeys = get().apiKeys.map(k => ({
          ...k,
          isActive: k.id === id,
          lastUsed: k.id === id ? new Date().toISOString() : k.lastUsed
        }));
        const activeKeyObj = updatedKeys.find(k => k.id === id);
        if (activeKeyObj) {
          const decrypted = decryptKey(activeKeyObj.key);
          set({ apiKey: decrypted, apiKeys: updatedKeys });
        }
      },
      removeKey: (id: string) => {
        const updatedKeys = get().apiKeys.filter(k => k.id !== id);
        const wasActive = get().apiKeys.find(k => k.id === id)?.isActive;
        
        if (wasActive && updatedKeys.length > 0) {
          updatedKeys[0].isActive = true;
          const decrypted = decryptKey(updatedKeys[0].key);
          set({ apiKey: decrypted, apiKeys: updatedKeys });
        } else if (wasActive) {
          set({ apiKey: '', apiKeys: [] });
        } else {
          set({ apiKeys: updatedKeys });
        }
      }
    }),
    {
      name: 'api-storage-v2',
      onRehydrateStorage: () => (state) => {
        if (state && state.apiKeys.length > 0) {
          const activeKey = state.apiKeys.find(k => k.isActive);
          if (activeKey) {
            state.apiKey = decryptKey(activeKey.key);
          }
        }
      }
    }
  )
);
