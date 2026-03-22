import { getAI, extractJSON, generateContentWithFallback } from './gemini';
import { ThinkingLevel } from '@google/genai';

export interface VisualGap {
  niche: string;
  missingElement: string;
  reasoning: string;
  opportunityScore: number; // 0-100
}

export async function analyzeCompetitorGaps(niche: string): Promise<VisualGap[]> {
  const ai = getAI();
  
  const prompt = `Perform a deep "Visual Gap Analysis" for the microstock niche: '${niche}'.
  
  Your task is to identify 3-5 specific visual gaps where current top-performing assets on Adobe Stock and Shutterstock are lacking.
  
  Think about:
  1. Diversity and Inclusion (Are certain demographics or scenarios missing?)
  2. Technical Aesthetics (Is the lighting, composition, or color palette outdated?)
  3. Contextual Relevance (Does the content lack modern technology, sustainability, or Gen Z cultural context?)
  4. Emotional Authenticity (Are the expressions or interactions too "stock-y" and not genuine?)
  
  For each gap, provide:
  - niche: A specific sub-niche name.
  - missingElement: What exactly is missing or underserved.
  - reasoning: Why this is a gap and why it's a commercial opportunity.
  - opportunityScore: A score from 0-100 based on demand vs. current supply quality.
  
  Respond ONLY with a JSON array of objects following the VisualGap interface.`;

  try {
    const response = await generateContentWithFallback(ai, {
      model: 'gemini-3-flash-preview',
      contents: [{ text: prompt }],
      config: {
        systemInstruction: "You are an expert Microstock Visual Trend Analyst. Your job is to find 'Visual Gaps' in the market that contributors can exploit for high sales. Respond ONLY with valid JSON.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const parsed = extractJSON(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    console.error('Error in analyzeCompetitorGaps:', error);
    if (error.message === 'QUOTA_EXCEEDED') {
      throw error;
    }
    return [];
  }
}
