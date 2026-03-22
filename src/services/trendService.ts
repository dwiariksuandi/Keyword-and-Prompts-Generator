import { AppSettings, TrendForecast } from '../types';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { getAI } from './geminiUtils';
import { ThinkingLevel } from '@google/genai';

function zodToJsonSchemaNoSchema(schema: any) {
  const jsonSchema = zodToJsonSchema(schema) as any;
  delete jsonSchema.$schema;
  return jsonSchema;
}

export const TrendSchema = z.object({
  id: z.string().optional().transform(val => `trend-${val || Math.random().toString(36).substring(7)}`),
  trend: z.string(),
  forecast: z.string(),
  niche: z.string(),
  isHighPriority: z.boolean().default(false),
  predictionDate: z.string().default(() => new Date().toLocaleDateString()),
  confidence: z.number().min(0).max(100),
  growthPotential: z.number().min(0).max(500),
  reasoning: z.string(),
  marketGap: z.string(),
  visualStyle: z.string(),
  recommendedKeywords: z.array(z.string()),
});

export const TrendListSchema = z.array(TrendSchema);

export async function getTrendForecast(niche: string | undefined, settings: AppSettings): Promise<TrendForecast[]> {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Perform an advanced, data-driven Market Trend Intelligence analysis for the niche: '${niche || 'general microstock'}'.
  
  CRITICAL INSTRUCTIONS:
  1. USE GOOGLE SEARCH to identify REAL, CURRENT, and EMERGING trends for 2026 in the microstock industry.
  2. Provide for each trend:
     - niche: Specific niche name.
     - isHighPriority: boolean.
     - confidence: 0-100.
     - growthPotential: 0-500 (percentage).
     - reasoning: Why this trend?
     - marketGap: What is missing?
     - visualStyle: Art direction.
     - recommendedKeywords: string[].
  
  Respond strictly with a JSON array of 5-8 objects.`;

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: [{ text: promptText }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: zodToJsonSchemaNoSchema(TrendListSchema as any) as any,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });

    return TrendListSchema.parse(JSON.parse(response.text || '[]')) as TrendForecast[];
  } catch (error) {
    console.error("Trend analysis failed:", error);
    return [];
  }
}

export async function refineTrendForecast(previousTrends: TrendForecast[], feedback: string, settings: AppSettings): Promise<TrendForecast[]> {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Review and refine the following trend analysis: ${JSON.stringify(previousTrends)}.
  
  User Feedback: '${feedback}'.
  
  CRITICAL INSTRUCTIONS:
  1. Address the user's feedback directly while maintaining data integrity.
  2. USE GOOGLE SEARCH to re-verify trends and find new data points.
  3. Provide:
     - niche: Specific niche name.
     - isHighPriority: boolean.
     - confidence: 0-100.
     - growthPotential: 0-500.
     - reasoning: Why this trend?
     - marketGap: What is missing?
     - visualStyle: Art direction.
     - recommendedKeywords: string[].
  
  Respond strictly with a JSON array of 5-8 objects.`;

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: [{ text: promptText }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: zodToJsonSchemaNoSchema(TrendListSchema as any) as any,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });

    return TrendListSchema.parse(JSON.parse(response.text || '[]')) as TrendForecast[];
  } catch (error) {
    console.error("Trend refinement failed:", error);
    return previousTrends;
  }
}
