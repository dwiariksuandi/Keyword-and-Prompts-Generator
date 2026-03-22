import { GoogleGenAI } from '@google/genai';

export const getAI = (apiKey?: string) => {
  const envApiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const finalApiKey = apiKey?.trim() || envApiKey || '';
  
  if (!finalApiKey) {
    throw new Error("API key is missing. Please enter your Gemini API key in the settings.");
  }
  
  return new GoogleGenAI({ apiKey: finalApiKey });
};

export async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const ai = getAI(apiKey);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ text: 'Say "ok"' }]
    });
    return { isValid: !!response.text };
  } catch (e) {
    console.error("API Key validation failed:", e);
    return { 
      isValid: false, 
      error: 'Invalid API Key'
    };
  }
}

export async function generateContentWithFallback(ai: any, params: any) {
  try {
    return await ai.models.generateContent(params);
  } catch (e) {
    console.warn("Primary model failed, falling back to flash:", e);
    return await ai.models.generateContent({
      ...params,
      model: 'gemini-3-flash-preview'
    });
  }
}
