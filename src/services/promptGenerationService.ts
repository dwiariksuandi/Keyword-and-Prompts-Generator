import { AppSettings, ReferenceFile } from '../types';
import { ThinkingLevel } from '@google/genai';
import { getAI, extractJSON, getContentTypeInstructions, getVariationInstructions, generateContentWithRetryAndFallback } from './gemini';
import { PROMPT_TEMPLATES } from '../constants/promptTemplates';
import { PROMPTING_GUIDELINES } from '../constants/promptingGuidelines';

export async function generatePrompts(
  categoryName: string, 
  contentType: string, 
  settings: AppSettings, 
  count: number = 10, 
  referenceFile?: ReferenceFile, 
  referenceUrl?: string
): Promise<string[]> {
  if (count > 30) {
    return generatePromptsBatch(categoryName, contentType, settings, count, referenceFile, referenceUrl);
  }
  return generatePromptsDirectly(categoryName, contentType, settings, count, referenceFile, referenceUrl);
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
  referenceUrl?: string
): Promise<string[]> {
  const ai = getAI(settings.apiKey);
  
  const isVideo = contentType === 'Video';
  const formula = isVideo ? PROMPTING_GUIDELINES.videoFormula : PROMPTING_GUIDELINES.imageFormula;
  
  const promptText = `Generate ${count} unique, high-end AI prompts for the specific niche/keyword: '${categoryName}'.
  Target Content Type: ${contentType}
  
  CRITICAL REQUIREMENT: The generated prompts MUST strictly align with the niche/keyword '${categoryName}' and be designed specifically for commercial microstock platforms.
  
  USE THIS PROMPTING FORMULA (CRITICAL):
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
  
  ${buildPromptContext(settings, referenceFile, referenceUrl)}
  ${getContentTypeInstructions(contentType)}
  ${getVariationInstructions(settings.variationLevel || 'Medium')}
  
  Respond strictly with a JSON array of strings. Each string is a complete, ready-to-use AI prompt following the formula.`;

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
    model: settings.model || 'gemini-3-flash-preview',
    contents,
    config: {
      systemInstruction: "You are an elite AI Prompt Engineer specializing in Adobe Stock optimization. You generate commercially lucrative, technically superior, and unique prompts that strictly follow the provided formulas and guidelines. Respond ONLY with valid JSON.",
      thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
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
  const ai = getAI(settings.apiKey);
  
  const isVideo = contentType === 'Video';
  const formula = isVideo ? PROMPTING_GUIDELINES.videoFormula : PROMPTING_GUIDELINES.imageFormula;
  
  const promptText = `Generate a highly diverse, combinatorial set of prompt components for the specific niche/keyword: '${categoryName}'.
  Target Content Type: ${contentType}
  Total Prompts Needed: ${count}
  
  CRITICAL REQUIREMENT: The components MUST strictly align with the niche/keyword '${categoryName}' and be designed specifically for commercial microstock platforms.
  
  USE THIS PROMPTING FORMULA (CRITICAL):
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
  
  CRITICAL DIVERSITY INSTRUCTIONS:
  - Do NOT repeat concepts. Every base concept must be distinctly different.
  - Explore different sub-niches and emotional tones within the category.
  - Ensure the components can be mixed and matched to create coherent, commercially viable stock assets.
  
  Provide highly unique, extremely detailed options for the components:
  1. baseConcepts: 30-50 highly unique, coherent, and VERY DETAILED scenarios. Each MUST include a highly descriptive Subject, a specific Action, and a complex Context that make logical sense together. Do not use simple phrases. Use rich, descriptive language. (e.g., "A diverse female precision machinist in a high-tech workshop touching a semi-transparent holographic AI interface that displays real-time diagnostic data over a robotic milling machine"). DO NOT separate them; write them as one cohesive, highly descriptive phrase.
  ${isVideo ? `
  2. cinematographies: 20-30 Detailed camera movements and angles (e.g., "Mid-shot at a low-angle to emphasize authority, featuring a shallow depth of field").
  3. styles: 20-30 Detailed lighting, color grading, and ambiance (e.g., "Industrial studio lighting with cool blue accents and sharp highlights on metallic surfaces, cinematic color grading with muted teal and orange tones").
  ` : `
  2. compositions: 20-30 Detailed camera angles, framing, and lenses (e.g., "Mid-shot at a low-angle to emphasize authority, featuring a shallow depth of field, shot on a 50mm f/1.8 lens").
  3. styles: 20-30 Detailed lighting, color grading, and materiality (e.g., "Industrial studio lighting with cool blue accents and sharp highlights on metallic surfaces, cinematic color grading with muted teal and orange tones").
  `}
  
  Respond strictly with a JSON object:
  ${isVideo ? `
  {
    "baseConcepts": string[],
    "cinematographies": string[],
    "styles": string[]
  }
  ` : `
  {
    "baseConcepts": string[],
    "compositions": string[],
    "styles": string[]
  }
  `}`;

  const response = await generateContentWithRetryAndFallback(ai, {
    model: settings.model || 'gemini-3-flash-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are a Prompt Component Architect. You provide high-quality, extremely diverse building blocks for combinatorial prompt generation that strictly follow the provided formulas and commercial guidelines. Respond ONLY with valid JSON.",
      temperature: 0.9, // Higher temperature for more diversity in batch generation
      thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  try {
    const components = extractJSON(text);
    const prompts: Set<string> = new Set(); // Use Set to prevent exact duplicates
    
    let attempts = 0;
    const maxAttempts = count * 3;

    while (prompts.size < count && attempts < maxAttempts) {
      let prompt = '';
      
      if (isVideo) {
        const concept = components.baseConcepts[Math.floor(Math.random() * components.baseConcepts.length)];
        const c = components.cinematographies[Math.floor(Math.random() * components.cinematographies.length)];
        const style = components.styles[Math.floor(Math.random() * components.styles.length)];
        prompt = `${c}, ${concept}, ${style}, 4k resolution, professional stock video`;
      } else {
        const concept = components.baseConcepts[Math.floor(Math.random() * components.baseConcepts.length)];
        const comp = components.compositions[Math.floor(Math.random() * components.compositions.length)];
        const style = components.styles[Math.floor(Math.random() * components.styles.length)];
        
        if (contentType === 'Photo') {
          prompt = `${concept}, ${comp}, ${style}, 8k resolution, highly detailed, commercial stock photography`;
        } else if (contentType === 'Illustration' || contentType === 'Vector') {
          prompt = `${concept}, ${comp}, ${style}, clean lines, vibrant colors, commercial vector art`;
        } else if (contentType === '3D Render') {
          prompt = `${concept}, ${comp}, ${style}, octane render, unreal engine 5, ray tracing, highly detailed`;
        } else {
          prompt = `${concept}, ${comp}, ${style}, high quality, professional stock style`;
        }
      }

      prompts.add(prompt);
      attempts++;
    }
    
    return Array.from(prompts);
  } catch (e) {
    throw new Error("Failed to generate batch prompts.");
  }
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
    model: settings.model || 'gemini-3-flash-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are a Prompt Optimization Specialist. You take raw prompts and elevate them to professional, commercially viable assets that strictly follow commercial microstock guidelines. Respond ONLY with valid JSON.",
      thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
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
    "totalScore": number (0-100),
    "criteriaScores": {
      "keywordDensity": number,
      "clarity": number,
      "specificity": number,
      "compliance": number,
      "marketAlignment": number,
      "aestheticAlignment": number
    },
    "feedback": string (concise improvement advice)
  }`;

  const response = await generateContentWithRetryAndFallback(ai, {
    model: settings.model || 'gemini-3-flash-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are an elite Prompt Auditor. You provide objective, data-driven scores for AI prompts based on commercial and technical excellence. Respond ONLY with valid JSON.",
      thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
    },
  });

  const text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  try {
    return extractJSON(text);
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
    model: settings.model || 'gemini-3-flash-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are an elite Adobe Stock Metadata Specialist. You generate SEO-optimized titles and keywords that maximize discoverability and sales. Respond ONLY with valid JSON.",
      thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
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
