import { getAI, generateContentWithRetryAndFallback } from './gemini';
import { AppSettings } from '../types';

export interface MarketData {
  trends: string[];
  competitorInsights: string;
  marketGaps: string[];
}

export async function fetchRealTimeMarketData(
  keyword: string, 
  contentType: string, 
  settings: AppSettings
): Promise<MarketData> {
  const ai = getAI(settings.apiKey);
  
  const prompt = `Perform a real-time market data search for Adobe Stock and the microstock industry regarding the keyword: '${keyword}' and content type: '${contentType}'.
  
  CRITICAL: Use the Google Search tool to find REAL, CURRENT data, trends, and search volumes.
  
  Respond ONLY with a JSON object containing:
  {
    "trends": ["trend1", "trend2", ...],
    "competitorInsights": "summary of competitor landscape",
    "marketGaps": ["gap1", "gap2", ...]
  }`;

  const response = await generateContentWithRetryAndFallback(ai, {
    model: settings.model || 'gemini-3.1-flash-lite-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json"
    }
  });

  const text = response.text;
  if (!text) throw new Error('No response from market data search');
  
  return JSON.parse(text);
}
