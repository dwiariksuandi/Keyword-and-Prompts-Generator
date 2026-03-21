export interface Trend {
  id: string;
  niche: string;
  forecastScore: number; // 0-100
  seasonality: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Year-round';
  description: string;
  recommendedAction: string;
}

import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { AppSettings } from '../types';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import { generateContentWithFallback, getAI } from './gemini';

function zodToJsonSchemaNoSchema(schema: any) {
  const jsonSchema = zodToJsonSchema(schema) as any;
  delete jsonSchema.$schema;
  return jsonSchema;
}

export const TrendSchema = z.object({
  id: z.string().optional().transform(val => val || Math.random().toString(36).substring(7)),
  niche: z.string(),
  forecastScore: z.preprocess((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
      return isNaN(num) ? 0 : num;
    }
    return val;
  }, z.number()),
  seasonality: z.preprocess((val) => {
    const allowed = ['Spring', 'Summer', 'Autumn', 'Winter', 'Year-round'];
    if (typeof val === 'string' && allowed.includes(val)) return val;
    if (typeof val === 'string') {
      const lowVal = val.toLowerCase();
      if (lowVal.includes('spring')) return 'Spring';
      if (lowVal.includes('summer')) return 'Summer';
      if (lowVal.includes('autumn') || lowVal.includes('fall')) return 'Autumn';
      if (lowVal.includes('winter')) return 'Winter';
    }
    return 'Year-round';
  }, z.enum(['Spring', 'Summer', 'Autumn', 'Winter', 'Year-round'])),
  description: z.string(),
  recommendedAction: z.string(),
});

export const TrendListSchema = z.array(TrendSchema);

export async function getTrendForecast(niche: string | undefined, settings: AppSettings): Promise<Trend[]> {
  const ai = getAI();
  
  const promptText = `Perform an advanced, data-driven Market Trend Intelligence analysis for the niche: '${niche || 'general microstock'}'.
  
  CRITICAL INSTRUCTIONS:
  1. USE GOOGLE SEARCH to identify REAL, CURRENT, and EMERGING trends for 2026 in the microstock industry (Adobe Stock, Shutterstock, etc.).
  2. Analyze consumer behavior shifts, technological advancements (AI integration), and cultural movements (e.g., "Authenticity via Specificity", "Honest Sustainability").
  3. Identify "Blue Ocean" opportunities where demand is high but high-quality supply is lacking.
  4. For each trend, provide:
     - id: A unique string identifier.
     - niche: A hyper-specific, commercially viable name.
     - forecastScore: A probability score (0-100) of this trend dominating in 2026.
     - seasonality: The peak demand period. MUST be one of: 'Spring', 'Summer', 'Autumn', 'Winter', 'Year-round'.
     - description: A detailed analysis of WHY this trend is emerging.
     - recommendedAction: Specific art direction or content strategy to capitalize on this trend.
  
  Respond strictly with a JSON array of 5-8 objects. Ensure all fields are present and valid.`;

  try {
    const response = await generateContentWithFallback(ai, {
      model: settings.model || 'gemini-3.1-pro-preview',
      contents: [{ text: promptText }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: zodToJsonSchemaNoSchema(TrendListSchema as any) as any,
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });

    return TrendListSchema.parse(JSON.parse(response.text || '[]')) as Trend[];
  } catch (error) {
    console.error("Trend analysis failed:", error);
    return [];
  }
}

export async function refineTrendForecast(previousTrends: Trend[], feedback: string, settings: AppSettings): Promise<Trend[]> {
  const ai = getAI();
  
  const promptText = `Review and refine the following trend analysis: ${JSON.stringify(previousTrends)}.
  
  User Feedback: '${feedback}'.
  
  CRITICAL INSTRUCTIONS:
  1. Address the user's feedback directly while maintaining data integrity.
  2. USE GOOGLE SEARCH to re-verify trends and find new data points that support or challenge the current forecast.
  3. Provide an updated, hyper-specific list of trending niches for 2026.
  4. Ensure each trend is commercially viable for Adobe Stock.
  5. For each trend, provide:
     - id: A unique string identifier.
     - niche: A hyper-specific, commercially viable name.
     - forecastScore: A probability score (0-100) of this trend dominating in 2026.
     - seasonality: The peak demand period. MUST be one of: 'Spring', 'Summer', 'Autumn', 'Winter', 'Year-round'.
     - description: A detailed analysis of WHY this trend is emerging.
     - recommendedAction: Specific art direction or content strategy to capitalize on this trend.
  
  Respond strictly with a JSON array of 5-8 objects. Ensure all fields are present and valid.`;

  try {
    const response = await generateContentWithFallback(ai, {
      model: settings.model || 'gemini-3.1-pro-preview',
      contents: [{ text: promptText }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: zodToJsonSchemaNoSchema(TrendListSchema as any) as any,
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });

    return TrendListSchema.parse(JSON.parse(response.text || '[]')) as Trend[];
  } catch (error) {
    console.error("Trend refinement failed:", error);
    return previousTrends;
  }
}
