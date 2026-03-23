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
      model: 'gemini-3-flash-preview',
      contents: [{ text: 'Say "ok"' }]
    });
    return { isValid: !!response.text };
  } catch (e: any) {
    if (retries > 0 && (e.status === 429 || e.message?.includes('RESOURCE_EXHAUSTED'))) {
      console.warn(`Rate limit hit during validation, retrying in ${delay}ms...`);
      await sleep(delay);
      return validateApiKey(apiKey, retries - 1, delay * 2);
    }
    console.error("API Key validation failed:", e);
    return { 
      isValid: false, 
      error: 'Invalid API Key'
    };
  }
}

export async function generateContentWithRetryAndFallback(ai: any, params: any, retries = 3, delay = 1000) {
  try {
    return await ai.models.generateContent(params);
  } catch (e: any) {
    const errorMessage = e.message || '';
    const isRateLimit = e.status === 429 || errorMessage.includes('RESOURCE_EXHAUSTED');
    const isTokenLimit = errorMessage.includes('max tokens limit');

    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limit hit, retrying in ${delay}ms... (${retries} retries left)`);
      await sleep(delay);
      return generateContentWithRetryAndFallback(ai, params, retries - 1, delay * 2);
    }
    
    if (isTokenLimit) {
      console.warn("Token limit reached, attempting with reduced maxOutputTokens...");
      // Coba dengan mengurangi maxOutputTokens jika tersedia di config
      const newParams = {
        ...params,
        config: {
          ...params.config,
          maxOutputTokens: 8192 // Kurangi setengah dari limit default
        }
      };
      return await ai.models.generateContent(newParams);
    }

    console.warn("Primary model failed, falling back to flash:", e);
    return await ai.models.generateContent({
      ...params,
      model: 'gemini-3-flash-preview'
    });
  }
}
