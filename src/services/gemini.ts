import { GoogleGenAI, Type } from '@google/genai';
import { AppSettings, PromptTemplate } from '../types';

export const promptTemplates: PromptTemplate[] = [
  {
    id: "midjourney",
    name: "Midjourney v6",
    template: "{style} {subject}, {details}, {lighting}, {mood} atmosphere, professional quality, high detail. --ar {aspect} --style raw --v 6",
    description: "Optimized for Midjourney v6 with style raw"
  },
  {
    id: "dalle",
    name: "DALL-E 3",
    template: "A {style} image of {subject}. {details}. The scene features {lighting} with a {mood} atmosphere. High resolution, photorealistic details.",
    description: "Natural language prompts for DALL-E 3"
  },
  {
    id: "stable",
    name: "Stable Diffusion XL",
    template: "{subject}, {style}, {details}, {lighting}, {mood}, masterpiece, best quality, highly detailed, 8k uhd",
    description: "Tag-based prompts for SDXL"
  },
  {
    id: "stock",
    name: "Stock Photography",
    template: "Professional stock photo: {subject}. {details}. Shot with {lighting}, conveying {mood}. Commercial use, editorial quality, diverse representation.",
    description: "Optimized for stock photography sites"
  },
  {
    id: "nanobanana",
    name: "Nano Banana Pro",
    template: "Generate a stunning {style} visual of {subject}. Key elements: {details}. Lighting setup: {lighting}. Overall mood: {mood}. Ultra-high definition, cinematic composition, award-winning quality, trending on ArtStation, octane render, volumetric lighting, ray tracing.",
    description: "Advanced multimodal prompt for Nano Banana Pro AI"
  }
];

const getAI = (apiKey?: string) => {
  const envApiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const finalApiKey = apiKey?.trim() || envApiKey || '';
  
  if (!finalApiKey) {
    throw new Error("API key is missing. Please enter your Gemini API key in the settings.");
  }
  
  return new GoogleGenAI({ apiKey: finalApiKey });
};

export function handleGeminiError(error: any): string {
  let errorString = '';
  if (error instanceof Error) {
    errorString = error.message;
  } else if (typeof error === 'object' && error !== null) {
    try {
      errorString = JSON.stringify(error);
    } catch {
      errorString = String(error);
    }
  } else {
    errorString = String(error);
  }
  
  if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('quota')) {
    return "Kuota API Key Anda telah habis (RESOURCE_EXHAUSTED). Ingat: Kuota dihitung per Project, bukan per API Key. Silakan buat API Key baru di dalam PROJECT BARU di Google AI Studio.";
  }
  
  if (errorString.includes('API key not valid') || errorString.includes('API_KEY_INVALID')) {
    return "Your API key is invalid. Please check your settings and try again.";
  }

  return `An error occurred: ${errorString}`;
}

export async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const ai = getAI(apiKey);
    // A simple, fast call to verify the key
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'hi',
      config: { maxOutputTokens: 1 }
    });
    return { isValid: true };
  } catch (error) {
    console.error("API Key validation failed:", error);
    return { isValid: false, error: handleGeminiError(error) };
  }
}

export async function analyzeKeyword(keyword: string, contentType: string, settings: AppSettings) {
  const ai = getAI(settings.apiKey);
  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3.1-pro-preview',
    contents: `Perform an in-depth, data-driven microstock market analysis for the keyword: '${keyword}' specifically for the content type: '${contentType}'.

Your task is to identify 3 to 5 highly specific, commercially viable niches or sub-categories related to this keyword and content type. Do not provide generic categories; focus on targeted concepts that actual buyers (agencies, designers, marketers) are searching for right now in the '${contentType}' category.

For each niche, provide:
1. categoryName: A highly specific and descriptive niche name.
2. mainKeywords: 3-4 long-tail, high-converting keywords (e.g., instead of "business", use "sustainable corporate office teamwork").
3. volumeLevel & volumeNumber: Realistic search volume estimates.
4. competition & competitionScore: Realistic competition metrics (0-100).
5. trend & trendPercent: Current market trajectory.
6. difficultyScore: 0-100 (Higher score means it's harder to rank. Should correlate with high competition).
7. opportunityScore: 0-100 (Higher score means better potential. Should be high if volume is good, competition is manageable, and trend is up).
8. creativeAdvice: Actionable advice on what exactly to create (e.g., specific lighting, authentic casting, modern color palettes, or unique angles) to stand out in this specific niche for ${contentType}.

Ensure all metrics are logically consistent. For example, a niche with 90/100 competition should NOT have a 90/100 opportunity score unless the volume is astronomically high. Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`,
    config: {
      systemInstruction: "You are a Senior Microstock Market Analyst and SEO Expert specializing in Adobe Stock, Shutterstock, and Getty Images. Your goal is to provide highly accurate, data-driven, and commercially valuable keyword analysis for stock contributors. Do not provide random or hallucinated metrics; ensure your estimates reflect real-world market dynamics, buyer search intent, and current visual trends.",
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            categoryName: { type: Type.STRING },
            mainKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            volumeLevel: { type: Type.STRING, description: "High, Medium, or Low" },
            volumeNumber: { type: Type.INTEGER },
            competition: { type: Type.STRING, description: "High, Medium, or Low" },
            competitionScore: { type: Type.INTEGER },
            trend: { type: Type.STRING, description: "up, down, or stable" },
            trendPercent: { type: Type.INTEGER },
            difficultyScore: { type: Type.INTEGER },
            opportunityScore: { type: Type.INTEGER },
            creativeAdvice: { type: Type.STRING },
          },
          required: ['categoryName', 'mainKeywords', 'volumeLevel', 'volumeNumber', 'competition', 'competitionScore', 'trend', 'trendPercent', 'difficultyScore', 'opportunityScore', 'creativeAdvice'],
        },
      },
    },
  });

  let text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  // Strip markdown formatting if present
  text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Failed to parse the response from the AI. Please try again.");
  }
}

export async function generatePrompts(keyword: string, categoryName: string, count: number, settings: AppSettings, contentType: string) {
  const ai = getAI(settings.apiKey);
  const template = promptTemplates.find(t => t.id === settings.templateId) || promptTemplates[0];
  
  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3.1-pro-preview',
    contents: `Generate exactly ${count} highly detailed, commercial-grade image generation prompts for the niche '${categoryName}' based on the core keyword '${keyword}'. The target asset type is '${contentType}'.

CRITICAL REQUIREMENTS FOR ADOBE STOCK:
1. Commercial Utility: Ensure concepts are highly usable for designers and agencies. Include concepts with 'copy space', 'authentic lifestyle', 'modern aesthetics', or 'clean backgrounds' where appropriate.
2. Technical Precision: Specify lighting, camera angles, and aesthetic quality appropriate for a ${contentType}.
3. Safe for Microstock: Ensure prompts naturally avoid requesting branded items, text, or recognizable logos.
4. Variety: Provide a diverse mix of subjects, compositions, and moods within the requested niche.
5. Template Alignment: Use this structure as your primary inspiration: "${template.template}".

Respond strictly with a JSON array of strings, where each string is a complete, ready-to-use image generation prompt tailored for a ${contentType}.
Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.
${settings.includeNegative ? 'Append a strong negative prompt at the end of each prompt (e.g., "--no text, watermark, deformed, blurry, logos").' : ''}`,
    config: {
      systemInstruction: "You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in crafting highly detailed, commercially successful image generation prompts (for Midjourney, DALL-E 3, SDXL) that produce flawless, authentic, and highly usable stock photography and illustrations. You understand lighting, composition, camera settings, and market trends perfectly.",
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });

  let text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  // Strip markdown formatting if present
  text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Failed to parse the response from the AI. Please try again.");
  }
}

export async function optimizePrompts(prompts: string[], settings: AppSettings, contentType: string) {
  const ai = getAI(settings.apiKey);
  
  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3.1-pro-preview',
    contents: `Optimize the following list of image generation prompts to make them more detailed, commercial-grade, and highly targeted for the '${contentType}' category on microstock platforms like Adobe Stock.

Original Prompts:
${JSON.stringify(prompts)}

CRITICAL REQUIREMENTS FOR OPTIMIZATION:
1. Enhance Technical Precision: Add specific lighting, camera angles, lens types, and aesthetic quality appropriate for a ${contentType}.
2. Improve Commercial Utility: Ensure concepts are highly usable for designers and agencies. Add elements like 'copy space', 'authentic lifestyle', 'modern aesthetics', or 'clean backgrounds' where appropriate.
3. Safe for Microstock: Ensure the optimized prompts naturally avoid requesting branded items, text, or recognizable logos.
4. Maintain Original Intent: Keep the core subject and action of the original prompt, but elevate its quality and marketability.

Respond strictly with a JSON array of strings, where each string is the optimized version of the corresponding original prompt. The output array must have exactly the same length as the input array.
Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.`,
    config: {
      systemInstruction: "You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in optimizing and refining image generation prompts to produce flawless, authentic, and highly usable stock photography and illustrations.",
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });

  let text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  // Strip markdown formatting if present
  text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Failed to parse the response from the AI. Please try again.");
  }
}
