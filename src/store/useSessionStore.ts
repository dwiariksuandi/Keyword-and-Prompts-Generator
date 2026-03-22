import { create } from 'zustand';

interface SessionState {
  tempApiKey: string;
  setTempApiKey: (key: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  tempApiKey: '',
  setTempApiKey: (key) => set({ tempApiKey: key }),
}));
