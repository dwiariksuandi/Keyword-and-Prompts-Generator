import { useState, useEffect } from 'react';
import React from 'react';
import { validateApiKey } from '../services/gemini';
import { useAppStore } from '../store/useAppStore';

export const useSession = () => {
  const {
    isSessionActive, setIsSessionActive,
    tempApiKey, setTempApiKey,
    isValidating, setIsValidating,
    validationError, setValidationError,
    setSettings
  } = useAppStore();

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
