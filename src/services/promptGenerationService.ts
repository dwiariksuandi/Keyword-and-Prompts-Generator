import { AppSettings, ReferenceFile } from '../types';
import { ThinkingLevel } from '@google/genai';
import { getAI, extractJSON, getContentTypeInstructions, getVariationInstructions, generateContentWithRetryAndFallback } from './gemini';
import { PROMPT_TEMPLATES } from '../constants/promptTemplates';
import { PROMPTING_GUIDELINES } from '../constants/promptingGuidelines';
import { getTrendForecast } from './trendService';
import { getEmbedding, cosineSimilarity } from './vectorService';
import { validatePromptAI } from './aiValidationService';

export async function generatePrompts(
  categoryName: string, 
  contentType: string, 
  settings: AppSettings, 
  count: number = 10, 
  referenceFile?: ReferenceFile, 
  referenceUrl?: string
): Promise<string[]> {
  const MAX_PER_CALL = 5; // Reduced from 15 to force higher focus and detail per prompt
  
  // 1. DYNAMIC CONTEXT INJECTION: Fetch trends for the category
  let trendContext = '';
  try {
    const trends = await getTrendForecast(categoryName, settings);
    if (trends && trends.length > 0) {
      trendContext = `
      CURRENT MARKET TRENDS FOR '${categoryName}':
      ${trends.slice(0, 3).map(t => `- ${t.trend}: ${t.forecast} (Visual Style: ${t.visualStyle})`).join('\n')}
      (CRITICAL: Incorporate these trends to maximize commercial utility.)
      `;
    }
  } catch (error) {
    console.warn("Failed to fetch trends for context injection:", error);
  }

  const generateWithQuality = async (targetCount: number, hint?: string) => {
    return generatePromptsDirectly(
      categoryName, 
      contentType, 
      settings, 
      targetCount, 
      referenceFile, 
      referenceUrl,
      hint,
      trendContext
    );
  };

  let allPrompts: string[] = [];

  if (count <= MAX_PER_CALL) {
    allPrompts = await generateWithQuality(count);
  } else {
    // Batch processing for large counts
    const numCalls = Math.ceil(count / MAX_PER_CALL);
    const PARALLEL_LIMIT = 2; // Reduced parallel limit to avoid rate limiting
    
    for (let i = 0; i < numCalls; i += PARALLEL_LIMIT) {
      const chunkPromises = [];
      for (let j = 0; j < PARALLEL_LIMIT && (i + j) < numCalls; j++) {
        const currentCount = Math.min(MAX_PER_CALL, count - (i + j) * MAX_PER_CALL);
        const diversityHint = `Batch Part ${i + j + 1}: Focus on highly unique, diverse, and specific scenarios. Avoid repeating concepts.`;
        chunkPromises.push(generateWithQuality(currentCount, diversityHint));
      }
      
      const results = await Promise.allSettled(chunkPromises);
      results.forEach(res => {
        if (res.status === 'fulfilled') {
          allPrompts.push(...res.value);
        }
      });
      
      if (i + PARALLEL_LIMIT < numCalls) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Increased delay
      }
    }
  }

  // 2. VECTOR EMBEDDING FOR DIVERSITY: Filter out redundant prompts
  if (allPrompts.length > 1) {
    try {
      allPrompts = await filterByDiversity(allPrompts, settings.apiKey);
      
      // If we filtered too many, try to refill a bit (one attempt)
      if (allPrompts.length < count * 0.8 && allPrompts.length > 0) {
        const refillCount = Math.min(MAX_PER_CALL, count - allPrompts.length);
        const refill = await generateWithQuality(refillCount, "REFILL: Focus on entirely new, unexplored angles to ensure maximum diversity.");
        allPrompts.push(...refill);
      }
    } catch (error) {
      console.warn("Diversity filtering failed:", error);
    }
  }

  // 3. AI-DRIVEN POST-PROCESSING: Final audit for quality
  const finalPrompts = allPrompts.slice(0, count);
  const auditedPrompts = await auditPrompts(finalPrompts, settings);

  return auditedPrompts;
}

async function filterByDiversity(prompts: string[], apiKey: string): Promise<string[]> {
  const SIMILARITY_THRESHOLD = 0.85;
  const uniquePrompts: string[] = [];
  const embeddings: number[][] = [];

  try {
    // Get all embeddings in one batch call
    const allEmbeddings = await getEmbedding(prompts, apiKey);
    
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      const embedding = allEmbeddings[i];
      let isTooSimilar = false;

      for (const existingEmbedding of embeddings) {
        const similarity = cosineSimilarity(embedding, existingEmbedding);
        if (similarity > SIMILARITY_THRESHOLD) {
          isTooSimilar = true;
          break;
        }
      }

      if (!isTooSimilar) {
        uniquePrompts.push(prompt);
        embeddings.push(embedding);
      }
    }
  } catch (error) {
    console.warn("Diversity filtering failed, falling back to original list:", error);
    return prompts;
  }

  return uniquePrompts;
}

async function auditPrompts(prompts: string[], settings: AppSettings): Promise<string[]> {
  // Audit in small batches to avoid long waits
  const audited: string[] = [];
  const BATCH_SIZE = 5;

  for (let i = 0; i < prompts.length; i += BATCH_SIZE) {
    const chunk = prompts.slice(i, i + BATCH_SIZE);
    const auditPromises = chunk.map(async (p) => {
      const validation = await validatePromptAI(p, settings.apiKey);
      if (validation.score >= 6) {
        return p;
      }
      // If low quality, try one quick optimization
      try {
        const optimized = await optimizePrompts([p], settings);
        return optimized[0] || p;
      } catch {
        return p;
      }
    });

    const results = await Promise.all(auditPromises);
    audited.push(...results);
  }

  return audited;
}

function buildPromptContext(
  settings: AppSettings,
  referenceFile?: ReferenceFile,
  referenceUrl?: string
): string {
  const referenceContext = referenceFile ? `
  REFERENCE FILE ANALYSIS (Aesthetic DNA):
  - Use the visual DNA from the provided reference file to guide the aesthetic of these prompts.
  - Prioritize the color palette, lighting, and mood from the reference.
  ` : '';

  const urlContext = referenceUrl ? `
  REFERENCE URL ANALYSIS (Market Trends):
  - Use the visual trends and commercial utility from the provided URL: ${referenceUrl}
  ` : '';

  const aestheticContext = settings.creatorProfile?.aestheticDNA ? `
  CREATOR AESTHETIC DNA:
  ${settings.creatorProfile.aestheticDNA}
  (CRITICAL: All generated prompts MUST align with this creator's Aesthetic DNA. Use their signature styles, themes, and technical strengths as a baseline.)
  ` : '';

  return `${referenceContext}${urlContext}${aestheticContext}`;
}

export async function generatePromptsDirectly(
  categoryName: string, 
  contentType: string, 
  settings: AppSettings, 
  count: number = 10, 
  referenceFile?: ReferenceFile, 
  referenceUrl?: string,
  diversityHint?: string,
  trendContext?: string
): Promise<string[]> {
  const ai = getAI(settings.apiKey);
  
  const isVideo = contentType === 'Video';
  const formula = isVideo ? PROMPTING_GUIDELINES.videoFormula : PROMPTING_GUIDELINES.imageFormula;
  
  const promptText = `Generate ${count} unique, high-end AI prompts for the specific niche/keyword: '${categoryName}'.
  Target Content Type: ${contentType}
  
  CRITICAL REQUIREMENT: The generated prompts MUST strictly align with the niche/keyword '${categoryName}' and be designed specifically for commercial microstock platforms.
  
  QUALITY MANDATE: Each individual prompt in this list MUST be extremely detailed, rich in technical components, and commercially viable. Do NOT generalize. Treat each prompt as if it were the only one being generated. Every prompt must be at least 60-100 words long.
  
  USE THIS PROMPTING FORMULA (CRITICAL - EVERY COMPONENT MUST BE PRESENT IN EVERY PROMPT):
  ${formula}
  
  CREATIVE DIRECTOR CONTROLS:
  ${isVideo ? `
  - Cinematography: ${PROMPTING_GUIDELINES.veoTips.cinematography}
  - Soundstage: ${PROMPTING_GUIDELINES.veoTips.soundstage}
  ` : `
  - Core: ${PROMPTING_GUIDELINES.nanoBananaTips.core}
  - Lighting: ${PROMPTING_GUIDELINES.nanoBananaTips.lighting}
  - Camera/Lens: ${PROMPTING_GUIDELINES.nanoBananaTips.camera}
  - Color/Film: ${PROMPTING_GUIDELINES.nanoBananaTips.color}
  - Materiality: ${PROMPTING_GUIDELINES.nanoBananaTips.materiality}
  `}
  
  COMMERCIAL MICROSTOCK COMPLIANCE (CRITICAL):
  ${PROMPTING_GUIDELINES.commercialMicrostockRules.map(r => `- ${r}`).join('\n  ')}
  
  ${diversityHint ? `DIVERSITY INSTRUCTION: ${diversityHint}\n` : ''}
  ${trendContext ? `TREND CONTEXT: ${trendContext}\n` : ''}
  ${buildPromptContext(settings, referenceFile, referenceUrl)}
  ${getContentTypeInstructions(contentType)}
  ${getVariationInstructions(settings.variationLevel || 'Medium')}
  
  Respond strictly with a JSON array of strings. Each string is a complete, ready-to-use AI prompt following the formula. Each prompt must be a masterpiece of technical detail, sensory richness, and commercial appeal.`;

  const contents: any[] = [{ text: promptText }];
  if (referenceFile) {
    contents.unshift({
      inlineData: {
        mimeType: referenceFile.mimeType,
        data: referenceFile.data
      }
    });
  }

  const response = await generateContentWithRetryAndFallback(ai, {
    model: settings.model || 'gemini-3.1-flash-lite-preview',
    contents,
    config: {
      systemInstruction: "You are an elite AI Prompt Engineer specializing in Adobe Stock optimization. You generate commercially lucrative, technically superior, and unique prompts that strictly follow the provided formulas and guidelines. You never sacrifice detail for quantity. Respond ONLY with valid JSON.",
      thinkingConfig: (settings.model || 'gemini-3.1-flash-lite-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.MINIMAL } : undefined
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  try {
    return extractJSON(text);
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Failed to parse the response from the AI. Please try again.");
  }
}

async function generatePromptsBatch(
  categoryName: string, 
  contentType: string, 
  settings: AppSettings, 
  count: number, 
  referenceFile?: ReferenceFile, 
  referenceUrl?: string
): Promise<string[]> {
  // This function is deprecated in favor of chunked direct generation to maintain high quality.
  // We keep the signature for now to avoid breaking any potential external references, 
  // but redirect to the high-quality path.
  return generatePrompts(categoryName, contentType, settings, count, referenceFile, referenceUrl);
}

export async function optimizePrompts(prompts: string[], settings: AppSettings): Promise<string[]> {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Optimize and refine these ${prompts.length} AI prompts for maximum quality and commercial microstock compliance.
  
  TECHNICAL UPGRADE & COMPLIANCE:
  - Analyze each prompt and apply specific modifiers, lighting, and quality signatures based on professional stock standards.
  - Ensure prompts are optimized for the latest AI models (Veo 3.1 for video, Nano Banana for images).
  - Prioritize reference fidelity and Aesthetic DNA alignment if provided.
  
  COMMERCIAL MICROSTOCK COMPLIANCE (CRITICAL):
  ${PROMPTING_GUIDELINES.commercialMicrostockRules.map(r => `- ${r}`).join('\n  ')}
  
  Prompts to optimize:
  ${prompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}
  
  Respond strictly with a JSON array of strings (the optimized prompts).`;

  const response = await generateContentWithRetryAndFallback(ai, {
    model: settings.model || 'gemini-3.1-flash-lite-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are a Prompt Optimization Specialist. You take raw prompts and elevate them to professional, commercially viable assets that strictly follow commercial microstock guidelines. Respond ONLY with valid JSON.",
      thinkingConfig: (settings.model || 'gemini-3.1-flash-lite-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.MINIMAL } : undefined
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  try {
    return extractJSON(text);
  } catch (e) {
    throw new Error("Failed to optimize prompts.");
  }
}

export async function generateAllPromptsBatch(
  keyword: string,
  categories: any[],
  count: number,
  settings: AppSettings,
  contentType: string,
  referenceUrl?: string,
  onProgress?: (progress: number) => void
): Promise<{ promptsMap: Record<string, string[]>; groundingSources: any[] }> {
  const promptsMap: Record<string, string[]> = {};
  const groundingSources: any[] = [];
  
  // Define chunk size to avoid hitting API rate limits
  const CHUNK_SIZE = 3; 
  let completedCount = 0;

  for (let i = 0; i < categories.length; i += CHUNK_SIZE) {
    const chunk = categories.slice(i, i + CHUNK_SIZE);
    
    // Process chunk in parallel
    const chunkPromises = chunk.map(async (cat) => {
      try {
        const prompts = await generatePrompts(
          cat.categoryName, 
          contentType, 
          settings, 
          Math.ceil(count / categories.length), 
          undefined, 
          referenceUrl
        );
        return { categoryName: cat.categoryName, prompts };
      } catch (error) {
        console.error(`Error generating prompts for ${cat.categoryName}:`, error);
        return { categoryName: cat.categoryName, prompts: [] }; // Fallback
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    
    // Assign results to map
    chunkResults.forEach(result => {
      promptsMap[result.categoryName] = result.prompts;
    });

    completedCount += chunk.length;
    if (onProgress) {
      onProgress(Math.round((completedCount / categories.length) * 100));
    }
    
    // Optional: Add a small delay between chunks if rate limits are strict
    if (i + CHUNK_SIZE < categories.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return { promptsMap, groundingSources };
}

export async function scorePrompts(prompts: string[], settings: AppSettings) {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Evaluate and score these ${prompts.length} AI prompts based on elite stock photography standards.
  
  CRITERIA:
  1. Keyword Density: Are relevant keywords included?
  2. Clarity: Is the subject and action clear?
  3. Specificity: Does it provide enough technical detail?
  4. Adobe Stock Adherence: Does it follow compliance rules?
  5. Market Alignment: Is it commercially lucrative?
  6. Aesthetic DNA Alignment: Does it match the creator's style?
  
  Prompts to score:
  ${prompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}
  
  Respond strictly with a JSON array of objects:
  {
    "promptIndex": number,
    "score": number (0-100),
    "density": number (0-100),
    "clarity": number (0-100),
    "specificity": number (0-100),
    "adherence": number (0-100),
    "feedback": string (concise improvement advice),
    "keywordFeedback": string,
    "clarityFeedback": string,
    "specificityFeedback": string,
    "adherenceFeedback": string
  }`;

  const response = await generateContentWithRetryAndFallback(ai, {
    model: settings.model || 'gemini-3.1-flash-lite-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are an elite Prompt Auditor. You provide objective, data-driven scores for AI prompts based on commercial and technical excellence. Respond ONLY with valid JSON.",
      thinkingConfig: (settings.model || 'gemini-3.1-flash-lite-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.MINIMAL } : undefined
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  try {
    const rawScores = extractJSON(text);
    return rawScores.map((s: any, i: number) => ({
      prompt: prompts[s.promptIndex || i],
      score: s.score || s.totalScore || 0,
      density: s.density || s.criteriaScores?.keywordDensity || 0,
      clarity: s.clarity || s.criteriaScores?.clarity || 0,
      specificity: s.specificity || s.criteriaScores?.specificity || 0,
      adherence: s.adherence || s.criteriaScores?.compliance || 0,
      feedback: s.feedback || "",
      keywordFeedback: s.keywordFeedback || "",
      clarityFeedback: s.clarityFeedback || "",
      specificityFeedback: s.specificityFeedback || "",
      adherenceFeedback: s.adherenceFeedback || ""
    }));
  } catch (e) {
    throw new Error("Failed to score prompts.");
  }
}

export async function generateAdobeStockMetadata(prompt: string, contentType: string, settings: AppSettings) {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Generate optimized metadata (Title and Keywords) for Adobe Stock based on this AI prompt:
  Prompt: "${prompt}"
  Content Type: ${contentType}
  
  METADATA RULES:
  - Title: Concise, descriptive, SEO-friendly (max 100 chars).
  - Keywords: 25-50 highly relevant keywords, comma-separated.
  - AI Compliance: Include "Generative AI" and "AI Generated" if appropriate.
  - Commercial Utility: Use keywords that buyers search for.
  
  Respond strictly with a JSON object:
  {
    "title": string,
    "keywords": string[]
  }
  
  Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

  const response = await generateContentWithRetryAndFallback(ai, {
    model: settings.model || 'gemini-3.1-flash-lite-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are an elite Adobe Stock Metadata Specialist. You generate SEO-optimized titles and keywords that maximize discoverability and sales. Respond ONLY with valid JSON.",
      thinkingConfig: (settings.model || 'gemini-3.1-flash-lite-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.MINIMAL } : undefined
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  try {
    return extractJSON(text);
  } catch (e) {
    throw new Error("Failed to generate metadata.");
  }
}

export async function polishAdobeStockMetadata(metadata: { title: string; keywords: string[] }, settings: AppSettings) {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Polish and improve this Adobe Stock metadata for maximum SEO performance.
  
  CURRENT METADATA:
  Title: "${metadata.title}"
  Keywords: ${metadata.keywords.join(', ')}
  
  POLISHING RULES:
  - Title: Make it more evocative and descriptive while remaining SEO-friendly. Ensure it flows naturally.
  - Keywords: Remove redundant or low-value keywords. Add high-value, conceptually relevant keywords. Ensure the most important keywords are first.
  - Commercial Appeal: Ensure the metadata sounds professional and appeals to high-end buyers.
  
  Respond strictly with a JSON object:
  {
    "title": string,
    "keywords": string[]
  }
  
  Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

  const response = await generateContentWithRetryAndFallback(ai, {
    model: settings.model || 'gemini-3.1-flash-lite-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are an elite SEO and Metadata Optimizer for Adobe Stock. You refine titles and keywords to ensure they are both human-readable and algorithm-friendly. Respond ONLY with valid JSON.",
      thinkingConfig: (settings.model || 'gemini-3.1-flash-lite-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.MINIMAL } : undefined
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  try {
    return extractJSON(text);
  } catch (e) {
    throw new Error("Failed to polish metadata.");
  }
}

export async function generateVeoPrompt(
  cinematography: string,
  subject: string,
  action: string,
  context: string,
  style: string,
  settings: AppSettings
): Promise<string> {
  const categoryName = `${cinematography} ${subject} ${action} in ${context}, style: ${style}`;
  const prompts = await generatePrompts(categoryName, 'Video', settings, 1);
  return prompts[0] || '';
}

export async function generateNanoBananaPrompt(
  subject: string,
  action: string,
  context: string,
  composition: string,
  style: string,
  settings: AppSettings
): Promise<string> {
  const categoryName = `${subject} ${action} in ${context}, ${composition}, style: ${style}`;
  const prompts = await generatePrompts(categoryName, 'Photo', settings, 1);
  return prompts[0] || '';
}
