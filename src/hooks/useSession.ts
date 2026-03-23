import React from 'react';
import { validateApiKey } from '../services/gemini';
import { usePromptStore } from '../store/usePromptStore';
import { useUIStore } from '../store/useUIStore';
import { useSessionStore } from '../store/useSessionStore';

export const useSession = () => {
  const {
    tempApiKey, setTempApiKey
  } = useSessionStore();

  const {
    setSettings
  } = usePromptStore();

  const {
    isSessionActive, setIsSessionActive,
    isValidating, setIsValidating,
    validationError, setValidationError
  } = useUIStore();

  const handleStartSession = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!tempApiKey.trim()) return;
    
    setIsValidating(true);
    setValidationError(null);
    
    const validationResult = await validateApiKey(tempApiKey);
    setIsValidating(false);

    if (validationResult.isValid) {
      setSettings(prev => ({ ...prev, apiKey: tempApiKey }));
      setIsSessionActive(true);
    } else {
      setValidationError(validationResult.error || 'Invalid API Key. Please check and try again.');
    }
  };

  const handleEndSession = () => {
    setSettings(prev => ({ ...prev, apiKey: '' }));
    setTempApiKey('');
    setIsSessionActive(false);
  };

  return {
    isSessionActive,
    tempApiKey,
    setTempApiKey,
    isValidating,
    validationError,
    handleStartSession,
    handleEndSession
  };
};
