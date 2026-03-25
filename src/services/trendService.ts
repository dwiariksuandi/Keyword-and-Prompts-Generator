import { AppSettings, TrendForecast } from '../types';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { getAI } from './gemini';
import { ThinkingLevel } from '@google/genai';
import { TREND_ANALYSIS_PROMPT_V1, TREND_REFINEMENT_PROMPT_V1 } from '../prompts/trendPrompts';

function zodToJsonSchemaNoSchema(schema: any) {
  const jsonSchema = zodToJsonSchema(schema) as any;
  delete jsonSchema.$schema;
  return jsonSchema;
}

// Validasi semantik tambahan
function validateTrendData(trends: TrendForecast[]): TrendForecast[] {
  return trends.map(trend => ({
    ...trend,
    growthPotential: Math.min(trend.growthPotential, 500),
    confidence: Math.min(Math.max(trend.confidence, 0), 100),
  }));
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
  
  const promptText = TREND_ANALYSIS_PROMPT_V1.replace('{{niche}}', niche || 'general microstock');

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3.1-flash-lite-preview',
      contents: [{ text: promptText }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: zodToJsonSchemaNoSchema(TrendListSchema as any) as any,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
      }
    });

    const parsed = TrendListSchema.parse(JSON.parse(response.text || '[]')) as TrendForecast[];
    return validateTrendData(parsed);
  } catch (error) {
    console.error("Trend analysis failed:", error);
    return [];
  }
}

export async function refineTrendForecast(previousTrends: TrendForecast[], feedback: string, settings: AppSettings): Promise<TrendForecast[]> {
  const ai = getAI(settings.apiKey);
  
  const promptText = TREND_REFINEMENT_PROMPT_V1
    .replace('{{previousTrends}}', JSON.stringify(previousTrends))
    .replace('{{feedback}}', feedback);

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3.1-flash-lite-preview',
      contents: [{ text: promptText }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: zodToJsonSchemaNoSchema(TrendListSchema as any) as any,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
      }
    });

    const parsed = TrendListSchema.parse(JSON.parse(response.text || '[]')) as TrendForecast[];
    return validateTrendData(parsed);
  } catch (error) {
    console.error("Trend refinement failed:", error);
    return previousTrends;
  }
}
