import { KeywordAnalysisSchema } from '../schemas';
import { z } from 'zod';

type KeywordAnalysis = z.infer<typeof KeywordAnalysisSchema>;
import { AppSettings, ReferenceFile } from '../types';
import { logger } from './logger';
import { getAI, extractJSON, zodToJsonSchemaNoSchema, generateContentWithRetryAndFallback, getContentTypeInstructions } from './gemini';

export async function analyzeKeyword(
  keyword: string, 
  contentType: string, 
  categoryName: string, 
  settings: AppSettings, 
  referenceFile?: ReferenceFile, 
  referenceUrl?: string
): Promise<KeywordAnalysis[]> {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Perform an exhaustive, data-driven microstock market analysis targeting the asset type: '${contentType}'.

${getContentTypeInstructions(contentType)}

CRITICAL: You MUST use Google Search to find REAL, CURRENT data, trends, and search volumes for Adobe Stock and the microstock industry. Do not rely solely on your internal knowledge; ground your analysis in actual, up-to-date market realities to avoid bias.

${categoryName ? `REFINEMENT MODE: You are refining the existing niche analysis for: '${categoryName}'. 
The user has provided a specific keyword or feedback: '${keyword}'.
Your task is to DEEPEN the analysis of this specific niche. 
1. Provide 3-5 highly specialized variations or sub-segments of this specific niche.
2. Ensure the creative advice and metadata strategy are significantly more detailed and targeted based on the refinement feedback.
3. If the feedback suggests a specific direction, prioritize that direction in the analysis.` : `Your objective is to uncover 5 to 8 highly specific, underserved, and commercially lucrative sub-niches (Blue Oceans). AVOID generic categories. Focus on exact, long-tail concepts that buyers (ad agencies, web designers, corporate marketers) are actively searching for but lack high-quality supply on platforms like Adobe Stock and Shutterstock.`}

VISUAL GAP ANALYSIS: For each potential niche, you MUST perform a simulated "Visual Gap Analysis":
1. Search for the top-performing assets in this niche on Adobe Stock (via Google Search).
2. Analyze their visual characteristics: lighting, composition, subject diversity, and aesthetic style.
3. Identify what is MISSING or outdated in these top assets (e.g., "too generic", "lacks diverse representation", "outdated lighting/aesthetic", "missing modern technology context").
4. Your "creativeAdvice" MUST directly address these gaps to provide a competitive advantage.

Respond strictly with a JSON array of objects. Each object MUST follow this schema:
{
  "categoryName": string,
  "mainKeywords": string[],
  "longTailKeywords": string[],
  "volumeLevel": "High" | "Medium" | "Low",
  "volumeNumber": number,
  "competition": "High" | "Medium" | "Low",
  "competitionScore": number (0-100),
  "trend": "up" | "down" | "stable",
  "trendPercent": number,
  "difficultyScore": number (0-100),
  "opportunityScore": number (0-100),
  "nicheScore": number (0-100),
  "demandVariance": "Stable" | "Seasonal" | "Viral",
  "keiScore": number (0-100),
  "commercialIntent": "Informational" | "Navigational" | "Commercial" | "Transactional",
  "assetTypeSuitability": string[],
  "buyerPersona": string,
  "visualTrends": string[],
  "creativeAdvice": string,
  "metadataStrategy": string
}

${keyword ? `The broad keyword context is: '${keyword}'.` : 'No specific keyword was provided.'}
${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
You MUST use the Google Search tool to fetch and deeply analyze the content of this URL. 
This URL is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for this analysis.
1. Identify the specific content type or niche of the asset in the URL (e.g., "Niche Background", "Video Background", "Photo Landscape", "Technology", "Lifestyle", "Abstract Art", etc.).
2. Extract the core visual themes, color palettes, lighting styles, subject matter, and underlying concepts from the URL.
3. The generated niches MUST be directly derived from, or highly complementary to, the specific content found in this URL. Do not deviate into unrelated topics.
4. Identify the target audience and commercial purpose of the content in the URL.
5. Use Google Search to cross-reference these extracted themes with current market demand on Adobe Stock to find profitable angles based on the URL's core concept.` : ''}
${!keyword && !referenceUrl && referenceFile ? 'Please derive the niche opportunities primarily from the visual content of the provided reference.' : ''}

CRITICAL ANALYSIS REQUIREMENT: Identify specific "Content Gaps" in the current market. What are buyers searching for that yields outdated, low-quality, or irrelevant results? Base your niches on these gaps.
- CROSS-NICHE STRATEGY: Look for opportunities to combine two distinct concepts (e.g., Technology + Sustainability, Healthcare + Remote Work) to create unique, high-demand micro-niches.
- COMMERCIAL MODIFIERS: Ensure the niches and keywords naturally incorporate high-intent commercial modifiers (e.g., "background", "template", "mockup", "isolated", "copy space", "infographic").

${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: I have provided an ${referenceFile.mimeType.startsWith('image/') ? 'image' : 'video'} reference. 
This reference file is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for this analysis.
1. Extract the core visual themes, color palettes, lighting styles, subject matter, and underlying concepts from the file.
2. The generated niches MUST be directly derived from, or highly complementary to, the specific content found in this file. Do not deviate into unrelated topics.
3. Identify the target audience and commercial purpose of the content in the file.
4. Use Google Search to cross-reference these extracted themes with current market demand on Adobe Stock to find profitable angles based on the file's core concept.` : ''}

CRITICAL ADOBE STOCK RULES & 2026 MICROSTOCK ECONOMICS:
- GENERATIVE AI COMPLIANCE: The niches MUST NOT rely on trademarked/copyrighted elements, specific brands, recognizable characters, or real known restricted places/buildings. Focus on generic, commercially safe concepts.
- ZERO-CLICK DOMINANCE & AI SEARCH: Traditional SEO is dead. Focus on semantic relevance, emotional context, and hyper-specificity.
- 2026 VISUAL TRENDS: Integrate trends like "Appstinence" (All the Feels, Connectioneering, Surreal Silliness, Local Flavor), "Contextualized AI", "Authenticity via Specificity", and "Honest Sustainability". If targeting Indonesia, consider "Phygital Retail", "Archipelago Logistics", and "Gen Z Subcultures".

For each niche, you MUST provide realistic, data-backed market metrics based on your search:
1. categoryName: A highly specific, commercial niche name (e.g., "Gen Z Sustainable Office Lifestyle").
2. mainKeywords: 5-7 exact-match, broad keywords.
3. longTailKeywords: 5-8 hyper-specific, medium-to-low competition phrases with high buyer intent (Smart Keywording Heuristic, e.g., "boardroom brainstorm", "cashless qris digital wallet transaction").
4. volumeLevel & volumeNumber: Estimated monthly search volume on major stock platforms.
5. competition & competitionScore: Estimated number of existing assets (0-100 score).
6. trend & trendPercent: Current market trajectory based on real-world news/seasons.`;

  try {
    const response = await generateContentWithRetryAndFallback(ai, {
      model: referenceFile ? 'gemini-3.1-flash-image-preview' : (settings.model || 'gemini-3.1-pro-preview'),
      contents: referenceFile ? [
        { text: promptText },
        {
          inlineData: {
            data: referenceFile.data,
            mimeType: referenceFile.mimeType
          }
        }
      ] : [{ text: promptText }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: zodToJsonSchemaNoSchema(KeywordAnalysisSchema),
      },
    });

    const parsed = extractJSON(response.text || '[]');
    return parsed;
  } catch (error) {
    logger.log({
      timestamp: new Date().toISOString(),
      functionName: 'analyzeKeyword',
      input: { keyword, contentType },
      output: null,
      status: 'error',
      latencyMs: 0,
      error: error instanceof Error ? error.message : String(error)
    });
    return [];
  }
}
