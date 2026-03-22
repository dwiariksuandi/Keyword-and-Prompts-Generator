import { AppSettings, ReferenceFile } from '../types';
import { getAI, extractJSON, getContentTypeInstructions } from './gemini';
import { ThinkingLevel } from '@google/genai';
import { fetchRealTimeMarketData } from './ragService';
import { cacheService } from './cacheService';

export async function analyzeKeyword(
  keyword: string, 
  contentType: string, 
  settings: AppSettings, 
  referenceFile?: ReferenceFile, 
  referenceUrl?: string
) {
  const cacheKey = `market-${keyword}-${contentType}-${settings.language}`;
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) return cachedData;

  const ai = getAI(settings.apiKey);
  
  // 1. RAG: Fetch real-time market data
  const marketData = await fetchRealTimeMarketData(keyword, contentType, settings);
  
  // 2. Agentic Workflow: Multi-Agent Analysis
  const intentContext = settings.intent ? `
  USER INTENT & TARGETING:
  - Target Platform: ${settings.intent.targetPlatform} (Optimize keywords and visual styles for this specific platform's algorithm and buyer base).
  - Primary Goal: ${settings.intent.primaryGoal} (Filter recommendations to align with this goal).
  - Time Commitment: ${settings.intent.timeCommitment} (Ensure the difficulty and production effort match this availability).
  ` : '';

  const portfolioContext = settings.creatorProfile?.aestheticDNA ? `
  CREATOR AESTHETIC DNA:
  ${settings.creatorProfile.aestheticDNA}
  (CRITICAL: The Creative Director Agent MUST prioritize niches and visual trends that align with or complement this creator's existing Aesthetic DNA. Do not suggest styles that are completely disconnected from their proven strengths. The recommendations MUST be "tepat sasaran" based on their portfolio.)
  ` : '';

  const promptText = `Perform an elite, multi-agent market analysis targeting asset type: '${contentType}'.
  
  MARKET CONTEXT (Real-Time Data):
  - Trends: ${marketData.trends.join(', ')}
  - Competitor Insights: ${marketData.competitorInsights}
  - Market Gaps: ${marketData.marketGaps.join(', ')}

  ${intentContext}
  ${portfolioContext}
  ${getContentTypeInstructions(contentType)}
  
  AGENT ROLES:
  - Market Analyst Agent: Identify high-volume, low-competition niches based on market data.
  - Creative Director Agent: Define visual trends, buyer personas, and art direction.
  - Trend Forecaster Agent: Predict 6-month trajectory and future market shifts.
  - Risk Assessment Agent: Evaluate saturation, copyright risks, and barrier to entry.
  - Prompt Engineer Agent: Synthesize all insights into actionable, commercially lucrative sub-niches.

  Respond strictly with a JSON array of objects following this schema:
  {
    "categoryName": string,
    "mainKeywords": string[],
    "volumeLevel": "High" | "Medium" | "Low",
    "volumeNumber": number,
    "competition": "High" | "Medium" | "Low",
    "competitionScore": number,
    "trend": "up" | "down" | "stable",
    "trendPercent": number,
    "trendForecast": "up" | "down" | "stable",
    "riskLevel": "High" | "Medium" | "Low",
    "riskFactors": string[],
    "difficultyScore": number,
    "opportunityScore": number,
    "buyerPersona": string,
    "visualTrends": string[],
    "creativeAdvice": string
  }
  
  ${keyword ? `The broad keyword context is: '${keyword}'.` : ''}
  ${referenceUrl ? `Reference URL: ${referenceUrl}` : ''}
  
  Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are an elite Multi-Agent Microstock Market Analysis System. You synthesize real-time market data, creative trends, and commercial utility to uncover 'Blue Ocean' niches. Respond ONLY with valid JSON.",
      thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  try {
    const result = extractJSON(text);
    cacheService.set(cacheKey, result);
    return result;
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Failed to parse the response from the AI. Please try again.");
  }
}

export async function fetchTrendingKeywords(keyword: string, settings: AppSettings, contentType: string) {
  const data = await analyzeKeyword(keyword, contentType, settings);
  return data.flatMap((item: any) => item.mainKeywords);
}

export async function analyzeCompetitorIntel(categoryName: string, contentType: string, settings: AppSettings) {
  const ai = getAI(settings.apiKey);
  const prompt = `Perform a deep competitor intelligence analysis for the niche: '${categoryName}' (${contentType}).
  Identify top-performing assets, their visual characteristics, and gaps we can exploit.
  Respond with a SINGLE JSON object of CompetitorAnalysis.
  
  Schema:
  {
    "timestamp": string,
    "aestheticDNA": {
      "lighting": string,
      "composition": string,
      "colorPalette": string,
      "subjectDiversity": string
    },
    "counterStrategy": {
      "visualGap": string,
      "metadataHijack": string,
      "pricingAngle": string
    },
    "keywordHijack": {
      "primary": string[],
      "secondary": string[],
      "longTail": string[]
    },
    "marketVelocity": {
      "growth": string,
      "demand": string,
      "saturation": string
    },
    "metadataBenchmark": {
      "titleStructure": string,
      "keywordDensity": string,
      "categoryAlignment": string
    }
  }`;
  
  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: [{ text: prompt }],
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
    }
  });
  
  const result = extractJSON(response.text);
  return Array.isArray(result) ? result[0] : result;
}

export async function predictSalesPotential(categoryName: string, contentType: string, settings: AppSettings, salesRecords: any[]) {
  const ai = getAI(settings.apiKey);
  const prompt = `Predict the sales potential for: '${categoryName}' (${contentType}).
  Use the provided sales history as context: ${JSON.stringify(salesRecords.slice(0, 10))}.
  Respond with a JSON object containing estimatedMonthlySales (number), confidenceScore (number 0-100), and topSellingFactors (string[]).`;
  
  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: [{ text: prompt }],
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
    }
  });
  
  return extractJSON(response.text);
}
