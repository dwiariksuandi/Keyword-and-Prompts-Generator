import { GoogleGenAI } from '@google/genai';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAI = (apiKey?: string) => {
  const envApiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const finalApiKey = apiKey?.trim() || envApiKey || '';
  
  if (!finalApiKey) {
    throw new Error("API key is missing. Please enter your Gemini API key in the settings.");
  }
  
  return new GoogleGenAI({ apiKey: finalApiKey });
};

export async function validateApiKey(apiKey: string, retries = 3, delay = 1000): Promise<{ isValid: boolean; error?: string }> {
  try {
    const ai = getAI(apiKey);
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: [{ text: 'Say "ok"' }]
    });
    return { isValid: !!response.text };
  } catch (e: any) {
    const isRateLimit = e.status === 429 || e.message?.includes('RESOURCE_EXHAUSTED');
    
    // If it's a quota/rate limit error, the key is actually valid (authentication succeeded)
    if (isRateLimit) {
      console.warn("API Key is valid but hit rate limit/quota during validation:", e);
      return { isValid: true };
    }

    console.error("API Key validation failed:", e);
    return { 
      isValid: false, 
      error: 'Invalid API Key'
    };
  }
}

export async function generateContentWithRetryAndFallback(ai: any, params: any, retries = 5, delay = 2000) {
  if (!ai) {
    throw new Error("AI instance is not initialized. Please check your API key.");
  }
  
  try {
    return await ai.models.generateContent(params);
  } catch (e: any) {
    const errorMessage = e.message || '';
    const isRateLimit = e.status === 429 || errorMessage.includes('RESOURCE_EXHAUSTED');
    const isHardQuota = errorMessage.includes('exceeded your current quota');
    const isTokenLimit = errorMessage.includes('max tokens limit');
    const isInternalError = e.status >= 500 || errorMessage.includes('INTERNAL') || errorMessage.includes('UNAVAILABLE');

    if (retries > 0 && (isRateLimit || isInternalError) && !isHardQuota) {
      console.warn(`${isRateLimit ? 'Rate limit' : 'Internal error'} hit, retrying in ${delay}ms... (${retries} retries left)`);
      await sleep(delay);
      // Exponential backoff: 2s, 4s, 8s, 16s, 32s
      return generateContentWithRetryAndFallback(ai, params, retries - 1, delay * 2);
    }
    
    if (isTokenLimit) {
      console.warn("Token limit reached, attempting with reduced maxOutputTokens...");
      const newParams = {
        ...params,
        config: {
          ...params.config,
          maxOutputTokens: 4096 // More conservative reduction
        }
      };
      // For token limit, we don't necessarily want to retry indefinitely, but one attempt with smaller limit is good
      return await ai.models.generateContent(newParams);
    }

    // If it's not a rate limit or internal error, or we're out of retries, try fallback
    const isImageModel = params.model && params.model.includes('image');
    if (!isImageModel && params.model !== 'gemini-3.1-flash-lite-preview' && !isHardQuota) {
      console.warn("Primary model failed, falling back to flash-lite:", e);
      return await ai.models.generateContent({
        ...params,
        model: 'gemini-3.1-flash-lite-preview'
      });
    }
    
    throw e;
  }
}
