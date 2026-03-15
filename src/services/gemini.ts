import { GoogleGenAI, Type } from '@google/genai';
import { AppSettings, PromptTemplate } from '../types';

export const promptTemplates: PromptTemplate[] = [
  {
    id: "midjourney",
    name: "Midjourney v6",
    template: "{style} {subject}, {details}, {lighting}, {mood} atmosphere, professional quality, high detail, no text, no watermark, commercial photography. --ar {aspect} --style raw --v 6.0",
    description: "Optimized for Midjourney v6 with style raw"
  },
  {
    id: "dalle",
    name: "DALL-E 3",
    template: "A {style} image of {subject}. {details}. The scene features {lighting} with a {mood} atmosphere. High resolution, photorealistic details, commercial stock photography style, no text, no logos.",
    description: "Natural language prompts for DALL-E 3"
  },
  {
    id: "stable",
    name: "Stable Diffusion XL",
    template: "{subject}, {style}, {details}, {lighting}, {mood}, masterpiece, best quality, highly detailed, 8k uhd, commercial stock photo, clean background",
    description: "Tag-based prompts for SDXL"
  },
  {
    id: "stock",
    name: "Stock Photography",
    template: "Professional stock photo: {subject}. {details}. Shot with {lighting}, conveying {mood}. Commercial use, editorial quality, diverse representation, authentic lifestyle, 8k resolution.",
    description: "Optimized for stock photography sites"
  },
  {
    id: "nanobanana",
    name: "Nano Banana Pro",
    template: "Generate a stunning {style} visual of {subject}. Key elements: {details}. Lighting setup: {lighting}. Overall mood: {mood}. Ultra-high definition, cinematic composition, award-winning quality, commercial stock asset, no text.",
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
    contents: `Perform an exhaustive, data-driven microstock market analysis for the broad keyword: '${keyword}' targeting the asset type: '${contentType}'.

Your objective is to uncover 4 to 6 highly specific, underserved, and commercially lucrative sub-niches (Blue Oceans). AVOID generic categories. Focus on exact, long-tail concepts that buyers (ad agencies, web designers, corporate marketers) are actively searching for but lack high-quality supply on platforms like Adobe Stock and Shutterstock.

For each niche, you MUST provide realistic, simulated market data:
1. categoryName: A highly specific, commercial niche name (e.g., "Gen Z Sustainable Office Lifestyle" instead of "Business People").
2. mainKeywords: 5-7 exact-match, long-tail keywords that buyers actually type into search bars.
3. volumeLevel & volumeNumber: Simulated monthly search volume on major stock platforms. Make this a highly realistic number reflecting actual market demand (e.g., 12500, not just 100).
4. competition & competitionScore: Simulated number of existing assets (0-100 score). 100 means millions of assets (oversaturated), 10 means very few assets (blue ocean).
5. trend & trendPercent: Current market trajectory (e.g., +45% due to recent news/seasons).
6. difficultyScore: 0-100. How hard is it for a new contributor to rank on page 1?
7. opportunityScore: 0-100. The ultimate metric. High volume + Low competition = High Opportunity (80-100).
8. creativeAdvice: Highly specific art direction. What exact visual elements, lighting, colors, or compositions are missing in the current market for this niche?

CRITICAL: Ensure mathematical and logical consistency. If competition is 95/100 (oversaturated), the opportunity score MUST be low (under 40) unless the volume is exceptionally massive and growing rapidly. Prioritize finding "Blue Ocean" niches (High Opportunity).
Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`,
    config: {
      systemInstruction: "You are an elite Microstock Market Data Analyst (Adobe Stock, Shutterstock). Your job is to simulate real-world keyword research tools. You must provide highly accurate, data-backed estimates for search volume and competition based on current market trends. NEVER provide generic keywords. ALWAYS find underserved, high-converting long-tail niches.",
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
5. STRICT Template Alignment: You MUST strictly format each prompt using this exact template structure:
"${template.template}"
Replace the bracketed placeholders (e.g., {subject}, {details}, {lighting}) with your generated content. Do not add conversational text.

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
  const template = promptTemplates.find(t => t.id === settings.templateId) || promptTemplates[0];
  
  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3.1-pro-preview',
    contents: `Optimize the following list of image generation prompts to make them more detailed, commercial-grade, and highly targeted for the '${contentType}' category on microstock platforms like Adobe Stock.

Original Prompts:
${JSON.stringify(prompts)}

CRITICAL REQUIREMENTS FOR OPTIMIZATION (ADOBE STOCK):
1. Enhance Technical Precision: Add specific lighting, camera angles, lens types, and aesthetic quality appropriate for a ${contentType}.
2. Improve Commercial Utility: Ensure concepts are highly usable for designers and agencies. Add elements like 'copy space', 'authentic lifestyle', 'modern aesthetics', or 'clean backgrounds' where appropriate.
3. Safe for Microstock: Ensure the optimized prompts naturally avoid requesting branded items, text, or recognizable logos.
4. Maintain Original Intent: Keep the core subject and action of the original prompt, but elevate its quality and marketability.
5. STRICT Template Alignment: You MUST strictly format each optimized prompt using this exact template structure:
"${template.template}"
Replace the bracketed placeholders with your optimized content. Do not add conversational text.

Respond strictly with a JSON array of strings, where each string is the optimized version of the corresponding original prompt. The output array must have exactly the same length as the input array.
Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.
${settings.includeNegative ? 'Append a strong negative prompt at the end of each optimized prompt (e.g., "--no text, watermark, deformed, blurry, logos").' : ''}`,
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
