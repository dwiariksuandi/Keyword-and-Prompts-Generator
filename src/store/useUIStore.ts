import { create } from 'zustand';
import { Tab } from '../types';

interface UIState {
  isSessionActive: boolean;
  isValidating: boolean;
  validationError: string | null;
  activeTab: Tab;
  prefsSaved: boolean;
  prefsValidationMessage: { type: 'success' | 'error'; text: string } | null;
  errorModal: { show: boolean; title: string; message: string };
  toast: { show: boolean; message: string };
  progress: { current: number; total: number; message: string } | null;

  // Actions
  setIsSessionActive: (active: boolean) => void;
  setIsValidating: (validating: boolean) => void;
  setValidationError: (error: string | null) => void;
  setActiveTab: (tab: Tab) => void;
  setPrefsSaved: (saved: boolean) => void;
  setPrefsValidationMessage: (message: { type: 'success' | 'error'; text: string } | null) => void;
  setErrorModal: (modal: { show: boolean; title: string; message: string }) => void;
  setToast: (toast: { show: boolean; message: string }) => void;
  setProgress: (progress: { current: number; total: number; message: string } | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSessionActive: false,
  isValidating: false,
  validationError: null,
  activeTab: 'top',
  prefsSaved: false,
  prefsValidationMessage: null,
  errorModal: { show: false, title: '', message: '' },
  toast: { show: false, message: '' },
  progress: null,

  setIsSessionActive: (active) => set({ isSessionActive: active }),
  setIsValidating: (validating) => set({ isValidating: validating }),
  setValidationError: (error) => set({ validationError: error }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPrefsSaved: (saved) => set({ prefsSaved: saved }),
  setPrefsValidationMessage: (message) => set({ prefsValidationMessage: message }),
  setErrorModal: (modal) => set({ errorModal: modal }),
  setToast: (toast) => set({ toast }),
  setProgress: (progress) => set({ progress }),
}));
