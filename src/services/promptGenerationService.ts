import { AppSettings, ReferenceFile } from '../types';
import { ThinkingLevel } from '@google/genai';
import { getAI, extractJSON, getContentTypeInstructions, getVariationInstructions } from './gemini';
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
  
  const formula = contentType === 'Video' ? PROMPTING_GUIDELINES.videoFormula : PROMPTING_GUIDELINES.imageFormula;
  
  const promptText = `Generate ${count} unique, high-end AI prompts for the category: '${categoryName}'.
  Target Content Type: ${contentType}
  
  USE THIS PROMPTING FORMULA (CRITICAL):
  ${formula}
  
  CREATIVE DIRECTOR CONTROLS:
  - Lighting: ${PROMPTING_GUIDELINES.creativeDirectorTips.lighting}
  - Camera/Lens: ${PROMPTING_GUIDELINES.creativeDirectorTips.camera}
  - Materiality: ${PROMPTING_GUIDELINES.creativeDirectorTips.materiality}
  
  ADOBE STOCK COMPLIANCE (CRITICAL):
  - No "similar content": Each prompt must be distinct.
  - Commercial utility: Focus on concepts that buyers actually need.
  - AI Transparency: Do not use real artist names or copyrighted brands.
  - Quality: Use technical keywords appropriate for ${contentType}.
  
  ${buildPromptContext(settings, referenceFile, referenceUrl)}
  ${getContentTypeInstructions(contentType)}
  ${getVariationInstructions(settings.variationLevel || 'Medium')}
  
  Respond strictly with a JSON array of strings. Each string is a complete, ready-to-use AI prompt.`;

  const contents: any[] = [{ text: promptText }];
  if (referenceFile) {
    contents.unshift({
      inlineData: {
        mimeType: referenceFile.mimeType,
        data: referenceFile.data
      }
    });
  }

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents,
    config: {
      systemInstruction: "You are an elite AI Prompt Engineer specializing in Adobe Stock optimization. You generate commercially lucrative, technically superior, and unique prompts. Respond ONLY with valid JSON.",
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
  
  const promptText = `Generate a highly diverse, combinatorial set of prompt components for the category: '${categoryName}'.
  Target Content Type: ${contentType}
  Total Prompts Needed: ${count}
  
  CRITICAL DIVERSITY INSTRUCTIONS:
  - Do NOT repeat concepts. Every subject and action must be distinctly different.
  - Explore different sub-niches, lighting setups, and emotional tones within the category.
  - Ensure the components can be mixed and matched to create coherent, commercially viable stock assets.
  
  Provide:
  1. Subjects: 15-20 highly unique and specific subjects (e.g., "A cyberpunk botanist", not just "A person").
  2. Actions/Contexts: 15-20 unique, dynamic scenarios or environments.
  3. Technical Modifiers: 15-20 specific camera angles, lighting setups, or rendering techniques for ${contentType}.
  4. Aesthetic/Mood Modifiers: 15-20 distinct moods or color palettes based on ${settings.creatorProfile?.aestheticDNA || 'professional stock'}.
  
  Respond strictly with a JSON object:
  {
    "subjects": string[],
    "actions": string[],
    "technical": string[],
    "aesthetic": string[]
  }`;

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are a Prompt Component Architect. You provide high-quality, extremely diverse building blocks for combinatorial prompt generation. Respond ONLY with valid JSON.",
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
      const s = components.subjects[Math.floor(Math.random() * components.subjects.length)];
      const a = components.actions[Math.floor(Math.random() * components.actions.length)];
      const t = components.technical[Math.floor(Math.random() * components.technical.length)];
      const aes = components.aesthetic[Math.floor(Math.random() * components.aesthetic.length)];
      
      let prompt = '';
      if (contentType === 'Photo') {
        prompt = `A professional photograph of ${s} ${a}, ${aes}, ${t}, 8k resolution, highly detailed, commercial stock photography`;
      } else if (contentType === 'Illustration' || contentType === 'Vector') {
        prompt = `High quality ${contentType.toLowerCase()} of ${s} ${a}, ${aes}, ${t}, clean lines, vibrant colors, commercial vector art`;
      } else if (contentType === 'Video') {
        prompt = `Cinematic video shot of ${s} ${a}, ${aes}, ${t}, 4k resolution, smooth motion, professional color grading`;
      } else if (contentType === '3D Render') {
        prompt = `High-end 3D render of ${s} ${a}, ${aes}, ${t}, octane render, unreal engine 5, ray tracing, highly detailed`;
      } else {
        prompt = `${s} ${a}, ${t}, ${aes}, high quality, professional stock style`;
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
  
  const promptText = `Optimize and refine these ${prompts.length} AI prompts for maximum quality and Adobe Stock compliance.
  
  TECHNICAL UPGRADE:
  - Analyze each prompt and apply "Neural Enhancement Layers" (specific modifiers, lighting, quality signatures).
  - Ensure prompts are optimized for the latest AI models (Midjourney v6, DALL-E 3, etc.).
  - Prioritize reference fidelity and Aesthetic DNA alignment if provided.
  
  Prompts to optimize:
  ${prompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}
  
  Respond strictly with a JSON array of strings (the optimized prompts).`;

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are a Prompt Optimization Specialist. You take raw prompts and elevate them to professional, commercially viable assets. Respond ONLY with valid JSON.",
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

  const response = await ai.models.generateContent({
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

  const response = await ai.models.generateContent({
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
