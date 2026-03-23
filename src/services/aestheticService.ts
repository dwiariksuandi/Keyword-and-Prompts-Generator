import { AppSettings, ReferenceFile } from '../types';
import { getAI, extractJSON, getContentTypeInstructions } from './gemini';
import { ThinkingLevel } from '@google/genai';

export async function analyzeAestheticReference(file: ReferenceFile, contentType: string, settings: AppSettings) {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Analyze this reference file (image/video) to extract its "Aesthetic DNA" for prompt generation.
  Target Content Type: ${contentType}
  
  Identify:
  1. Color Palette: Primary and accent colors.
  2. Lighting: Type, direction, and intensity.
  3. Mood: Emotional tone.
  4. Style: Artistic or photographic style.
  5. Composition: Framing and perspective.
  
  Provide 3-5 specific suggestions for prompt generation that would replicate or complement this aesthetic.
  
  Respond strictly with a JSON object:
  {
    "colorPalette": string[],
    "lighting": string,
    "mood": string,
    "artisticStyle": string,
    "composition": string,
    "suggestions": string[]
  }
  
  ${getContentTypeInstructions(contentType)}
  
  Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: [
      {
        inlineData: {
          mimeType: file.mimeType,
          data: file.data
        }
      },
      { text: promptText }
    ],
    config: {
      systemInstruction: "You are an elite Aesthetic Analysis Agent. You extract the visual DNA from references to inform high-end prompt engineering. Respond ONLY with valid JSON.",
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

export async function analyzeUrlAesthetic(url: string, contentType: string, settings: AppSettings) {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Analyze the visual aesthetic and market trends of this URL: ${url}
  Target Content Type: ${contentType}
  
  Using Google Search, identify:
  1. Artistic Style: Dominant aesthetic trends and visual style.
  2. Lighting: Typical lighting setups used in this style.
  3. Mood: The emotional tone conveyed.
  4. Composition: Typical framing and perspective.
  5. Color Palette: Extract 3-5 dominant colors (e.g., ["#1A1A1A", "Muted Teal", "Neon Pink"]).
  6. Suggestions: 3-5 prompt suggestions to replicate this aesthetic.
  
  Respond strictly with a JSON object:
  {
    "colorPalette": string[],
    "lighting": string,
    "mood": string,
    "artisticStyle": string,
    "composition": string,
    "suggestions": string[]
  }
  
  Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are an elite Visual Trend & Market Analysis Agent. You use web data to extract aesthetic DNA and commercial insights. Respond ONLY with valid JSON.",
      tools: [{ googleSearch: {} }],
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

export async function analyzePortfolioAesthetic(portfolioUrl: string, settings: AppSettings) {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Analyze the creator's portfolio at this URL: ${portfolioUrl}
  
  Using Google Search, identify the creator's "Aesthetic DNA":
  - What are their signature visual styles?
  - What themes do they frequently explore?
  - What are their technical strengths?
  
  Summarize this into a concise "Aesthetic DNA" description that can be used to guide AI prompt generation.
  
  Respond strictly with a JSON object:
  {
    "aestheticDNA": string,
    "signatureStyles": string[],
    "frequentThemes": string[],
    "technicalStrengths": string[]
  }
  
  Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: [{ text: promptText }],
    config: {
      systemInstruction: "You are an elite Portfolio Analysis Agent. You extract a creator's unique visual DNA to ensure AI-generated content remains authentic to their style. Respond ONLY with valid JSON.",
      tools: [{ googleSearch: {} }],
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
