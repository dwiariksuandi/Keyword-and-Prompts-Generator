import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KeywordAnalysisSchema, AestheticAnalysisSchema, PromptSchema, PromptDirectSchema, type Prompt, type PromptDirect } from '../schemas';
import { AppSettings, PromptTemplate, ReferenceFile, PromptScore, AestheticAnalysis, CategoryResult } from '../types';
import { logger } from './logger';

// ... (rest of the file)

async function criticizeAnalysis<T>(data: T, schema: any, settings: AppSettings, categoryName: string): Promise<T> {
  const ai = getAI(settings.apiKey);
  const prompt = `Data: ${JSON.stringify(data)}`;

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3.1-pro-preview',
    contents: [{ text: prompt }],
    config: {
      systemInstruction: `Validate the following JSON data against its schema and logic. 
      Ensure all fields are present, types are correct, and the content is logical and grounded.
      If the data is valid, return it as is. If it's invalid, return a corrected version.
      
      CRITICAL: The user has requested a VARIATION LEVEL of ${settings.variationLevel}.
      ${settings.variationLevel === 'High' ? 'Be EXTREMELY strict about anomalies, hallucinations, and logical inconsistencies. Ensure maximum diversity without compromising quality.' : 'Ensure consistency and quality.'}
      
      ADOBE STOCK PRE-FLIGHT VALIDATOR:
      Analyze the content for potential Adobe Stock rejection risks (e.g., trademarked items, text, poor anatomy, low commercial utility).
      Provide a rejectionRisk object: { riskLevel: 'Low' | 'Medium' | 'High', reason: string }.
      
      MARKET TREND INTELLIGENCE:
      Analyze the niche '${categoryName}' and provide a brief market trend insight that makes this content commercially relevant.
      
      Respond ONLY with valid JSON following the schema.`,
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(schema) as any,
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    }
  });

  const text = response.text;
  if (!text) throw new Error('Critic agent returned no response');
  
  const parsed = extractJSON(text);
  return schema.parse(parsed);
}

export const promptTemplates: PromptTemplate[] = [
  // --- PHOTO ---
  {
    id: "nanobanana-photo",
    name: "Nano Banana Pro (Photo)",
    template: "{subject}, {details}, {lighting}, {mood} atmosphere, {style}. Shot on medium format camera, 50mm lens, f/1.8. Cinematic composition, hyper-detailed textures, 8k resolution, no text.",
    description: "Advanced multimodal prompt for Nano Banana Pro AI using [Subject] + [Action] + [Location] + [Composition] + [Style]",
    contentTypes: ["Photo"]
  },
  {
    id: "midjourney-photo",
    name: "Midjourney v6 (Photo)",
    template: "{style} {subject}, {details}, {lighting}, {mood} atmosphere, professional quality, high detail, no text, no watermark, commercial photography. --ar {aspect} --style raw --v 6.0",
    description: "Optimized for Midjourney v6 with style raw",
    contentTypes: ["Photo"]
  },
  {
    id: "dalle-photo",
    name: "DALL-E 3 (Photo)",
    template: "A {style} image of {subject}. {details}. The scene features {lighting} with a {mood} atmosphere. High resolution, photorealistic details, commercial stock photography style, no text, no logos.",
    description: "Natural language prompts for DALL-E 3",
    contentTypes: ["Photo"]
  },
  {
    id: "stable-photo",
    name: "Stable Diffusion XL (Photo)",
    template: "{subject}, {style}, {details}, {lighting}, {mood}, masterpiece, best quality, highly detailed, 8k uhd, commercial stock photo, clean background",
    description: "Tag-based prompts for SDXL",
    contentTypes: ["Photo"]
  },
  {
    id: "stock-photo",
    name: "Stock Photography",
    template: "Professional stock photo: {subject}. {details}. Shot with {lighting}, conveying {mood}. Commercial use, editorial quality, diverse representation, authentic lifestyle, 8k resolution.",
    description: "Optimized for stock photography sites",
    contentTypes: ["Photo"]
  },

  // --- BACKGROUND ---
  {
    id: "nanobanana-background",
    name: "Nano Banana Pro (Background)",
    template: "{subject}, {details}, {lighting}, {mood} color palette, {style}. 8k resolution, seamless composition, ample copy space, subtle depth of field, clean and modern aesthetic, out of focus elements.",
    description: "Premium background generation for Nano Banana Pro using [Subject] + [Action] + [Location] + [Composition] + [Style]",
    contentTypes: ["Background"]
  },
  {
    id: "midjourney-background",
    name: "Midjourney v6 (Background)",
    template: "Abstract {style} background of {subject}, {details}, {lighting}, {mood} atmosphere, ample copy space, minimalist composition, commercial background asset, 8k, highly detailed. --ar {aspect} --style raw --v 6.0",
    description: "Optimized for Midjourney v6 backgrounds",
    contentTypes: ["Background"]
  },
  {
    id: "dalle-background",
    name: "DALL-E 3 (Background)",
    template: "A clean, modern {style} background image featuring {subject}. {details}. {lighting}, {mood} atmosphere. Designed with ample negative space for text overlays, commercial stock background style, high resolution.",
    description: "Natural language background prompts for DALL-E 3",
    contentTypes: ["Background"]
  },

  // --- VECTOR ---
  {
    id: "nanobanana-vector",
    name: "Nano Banana Pro (Vector)",
    template: "{subject}, {details}, {lighting}, {mood} color palette, {style}. Flat design, clean SVG style, minimalist curves, no gradients, solid colors, isolated on white background.",
    description: "Advanced vector prompt for Nano Banana Pro using [Subject] + [Action] + [Location] + [Composition] + [Style]",
    contentTypes: ["Vector"]
  },
  {
    id: "midjourney-vector",
    name: "Midjourney v6 (Vector Style)",
    template: "Flat {style} vector illustration of {subject}, {details}, {lighting}, {mood}, clean lines, solid colors, minimal shading, white background, commercial quality, no text. --ar {aspect} --v 6.0",
    description: "Midjourney prompts designed to look like vectors",
    contentTypes: ["Vector"]
  },
  {
    id: "recraft-vector",
    name: "Recraft (Vector)",
    template: "Vector art of {subject}, {details}, {lighting}, {mood}, {style}, clean SVG style, flat colors, commercial design, no text.",
    description: "Optimized for Recraft vector generation",
    contentTypes: ["Vector"]
  },
  {
    id: "leonardo-vector",
    name: "Leonardo AI (Vector)",
    template: "Vector illustration of {subject}, {details}, {lighting}, {mood}, {style}, flat design, vibrant colors, clean edges, commercial vector asset, white background.",
    description: "Optimized for Leonardo AI vector style",
    contentTypes: ["Vector"]
  },

  // --- ILLUSTRATION ---
  {
    id: "nanobanana-illustration",
    name: "Nano Banana Pro (Illustration)",
    template: "{subject}, {details}, {lighting}, {mood} atmosphere, {style}. Intricate details, vibrant colors, commercial editorial illustration, 8k resolution.",
    description: "High-end illustration prompt for Nano Banana Pro using [Subject] + [Action] + [Location] + [Composition] + [Style]",
    contentTypes: ["Illustration"]
  },
  {
    id: "nanobanana-ai-art",
    name: "Nano Banana Pro (AI Art)",
    template: "{subject}, {details}, {lighting}, {mood} color palette, {style}. Intricate generative patterns, fluid forms, digital dreamscape, high-concept creativity, 8k resolution.",
    description: "Conceptual and creative AI art prompt for Nano Banana Pro using [Subject] + [Action] + [Location] + [Composition] + [Style]",
    contentTypes: ["AI Art & Creativity"]
  },
  {
    id: "midjourney-ai-art",
    name: "Midjourney v6 (AI Art)",
    template: "Conceptual {style} AI art of {subject}, {details}, {lighting}, {mood}, surrealism, abstract expressionism, intricate details, professional quality, high-concept, no text. --ar {aspect} --v 6.0 --stylize 750",
    description: "High-stylization prompts for Midjourney AI art",
    contentTypes: ["AI Art & Creativity"]
  },
  {
    id: "dalle-ai-art",
    name: "DALL-E 3 (AI Art)",
    template: "A highly creative and conceptual {style} AI art piece depicting {subject}. {details}. The scene features {lighting} with a {mood} atmosphere. Surreal elements, digital art masterpiece, high resolution, no text.",
    description: "Creative and conceptual prompts for DALL-E 3",
    contentTypes: ["AI Art & Creativity"]
  },
  {
    id: "stock-ai-art",
    name: "Adobe Stock AI Art",
    template: "Conceptual AI art: {subject}. {details}. {style} aesthetic, {lighting}, {mood}. High commercial utility for creative projects, clean composition, 8k resolution, masterpiece.",
    description: "Optimized for Adobe Stock's AI art category",
    contentTypes: ["AI Art & Creativity"]
  },
  {
    id: "midjourney-niji",
    name: "Midjourney Niji (Illustration)",
    template: "{style} illustration of {subject}, {details}, {lighting}, {mood} atmosphere, professional quality, high detail, no text, no watermark, commercial illustration. --ar {aspect} --niji 6",
    description: "Optimized for Midjourney Niji 6",
    contentTypes: ["Illustration"]
  },
  {
    id: "dalle-illustration",
    name: "DALL-E 3 (Illustration)",
    template: "A {style} illustration of {subject}. {details}. The scene features {lighting} with a {mood} atmosphere. High resolution, commercial stock illustration style, no text, no logos.",
    description: "Natural language illustration prompts for DALL-E 3",
    contentTypes: ["Illustration"]
  },
  {
    id: "firefly-illustration",
    name: "Adobe Firefly (Illustration)",
    template: "{subject}, {details}, {lighting}, {mood}, {style} illustration, highly detailed, commercial use, clean background, vibrant colors",
    description: "Optimized for Adobe Firefly",
    contentTypes: ["Illustration"]
  },

  // --- VIDEO ---
  {
    id: "veo-video",
    name: "Veo 3.1 (Video)",
    template: "{style} shot of {subject}, {details}, {lighting}, {mood} atmosphere. SFX: appropriate ambient sounds. 4k resolution, smooth motion.",
    description: "Optimized for Google Veo 3.1 using [Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]",
    contentTypes: ["Video"]
  },
  {
    id: "sora-video",
    name: "Sora (Video)",
    template: "A highly detailed, photorealistic {style} video of {subject}. {details}. The camera moves smoothly, capturing the {lighting} and {mood} atmosphere. 8k resolution, commercial stock footage style.",
    description: "Natural language prompts for OpenAI Sora",
    contentTypes: ["Video"]
  },
  {
    id: "wan-video",
    name: "WAN (Video)",
    template: "High quality {style} video of {subject}, {details}, {lighting}, {mood}, cinematic lighting, photorealistic, 4k resolution, smooth camera movement, commercial stock footage.",
    description: "Optimized for WAN Video AI",
    contentTypes: ["Video"]
  },
  {
    id: "kling-video",
    name: "Kling (Video)",
    template: "{subject}, {details}, {lighting}, {mood}, {style}, cinematic motion, 4k, ultra realistic, professional stock video, clean composition.",
    description: "Optimized for Kling AI",
    contentTypes: ["Video"]
  },
  {
    id: "runway-video",
    name: "Runway Gen-2 (Video)",
    template: "{subject}, {details}, {lighting}, {mood}, {style}, cinematic, highly detailed, 4k, photorealistic, slow motion, commercial stock footage.",
    description: "Tag-based prompts for Runway Gen-2",
    contentTypes: ["Video"]
  },

  // --- 3D RENDER ---
  {
    id: "nanobanana-3d",
    name: "Nano Banana Pro (3D Render)",
    template: "{subject}, {details}, {lighting}, {mood} atmosphere, {style}. Created in Unreal Engine 5, path tracing, global illumination, hyper-realistic textures, 8k resolution, clean background.",
    description: "Premium 3D render prompt for Nano Banana Pro using [Subject] + [Action] + [Location] + [Composition] + [Style]",
    contentTypes: ["3D Render"]
  },
  {
    id: "midjourney-3d",
    name: "Midjourney v6 (3D Render)",
    template: "{style} 3D render of {subject}, {details}, {lighting}, {mood}, Octane Render, Unreal Engine 5, ray tracing, highly detailed, commercial quality, clean background. --ar {aspect} --v 6.0",
    description: "Optimized for 3D style in Midjourney",
    contentTypes: ["3D Render"]
  },
  {
    id: "dalle-3d",
    name: "DALL-E 3 (3D Render)",
    template: "A high-quality {style} 3D render of {subject}. {details}. The scene features {lighting} with a {mood} atmosphere. Created in Blender, Octane Render style, commercial stock 3D asset, no text.",
    description: "Natural language 3D prompts for DALL-E 3",
    contentTypes: ["3D Render"]
  },
  {
    id: "leonardo-3d",
    name: "Leonardo AI (3D Render)",
    template: "3D illustration of {subject}, {details}, {lighting}, {mood}, {style}, isometric view, clay render style, soft lighting, pastel colors, commercial 3D asset, clean background.",
    description: "Optimized for Leonardo AI 3D style",
    contentTypes: ["3D Render"]
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
  let errorCode = 0;
  let errorMessage = '';

  if (error instanceof Error) {
    errorString = error.message;
  } else if (typeof error === 'object' && error !== null) {
    try {
      errorString = JSON.stringify(error);
      // Try to extract status code/message if available in the error object
      if ('status' in error) errorCode = (error as any).status;
      if ('statusCode' in error) errorCode = (error as any).statusCode;
      
      // Check if it's a JSON string that can be parsed
      const parsed = typeof error === 'string' ? JSON.parse(error) : error;
      if (parsed?.error) {
        errorCode = parsed.error.code || errorCode;
        errorMessage = parsed.error.message || '';
        errorString = errorMessage || errorString;
      }
    } catch {
      errorString = String(error);
    }
  } else {
    errorString = String(error);
  }
  
  // Specific: URL Limit Error (20 URLs limit)
  if (errorString.includes('urls to lookup exceeds the limit') || errorString.includes('21 > 20')) {
    return "⚠️ Terlalu Banyak URL (Error 400)\n\n" +
           "Penyebab: Permintaan mengandung terlalu banyak URL untuk dianalisis (maksimal 20).\n\n" +
           "Solusi: Kurangi jumlah URL dalam prompt atau gunakan satu URL referensi saja.";
  }

  // 429 - Resource Exhausted / Quota
  if (errorCode === 429 || errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('quota')) {
    return "⚠️ Batas Penggunaan Terlampaui (Error 429)\n\n" +
           "Penyebab:\n" +
           "1. Limit Per Menit: Akun gratis dibatasi 15 request/menit.\n" +
           "2. Kuota Harian: Anda mungkin telah mencapai batas harian Google.\n\n" +
           "Solusi:\n" +
           "• Tunggu 1-2 menit sebelum mencoba lagi.\n" +
           "• Jika tetap gagal, gunakan API Key dari Project Google Cloud yang berbeda.";
  }
  
  // 401 - Unauthorized (Definitely API Key)
  if (errorCode === 401 || errorString.includes('401') || errorString.includes('API_KEY_INVALID')) {
    return "❌ API Key Tidak Valid (Error 401)\n\n" +
           "Penyebab:\n" +
           "• API Key salah atau tidak memiliki izin.\n" +
           "• API Key telah dihapus atau dinonaktifkan di Google AI Studio.\n\n" +
           "Solusi:\n" +
           "• Periksa kembali API Key Anda.\n" +
           "• Pastikan API Key berasal dari 'Google AI Studio'.";
  }

  // 400 - Bad Request (Could be API Key or something else)
  if (errorCode === 400 || errorString.includes('400')) {
    if (errorString.includes('API key not valid') || errorString.includes('invalid API key')) {
      return "❌ API Key Tidak Valid (Error 400)\n\n" +
             "Penyebab:\n" +
             "• API Key salah ketik atau ada spasi tambahan.\n\n" +
             "Solusi:\n" +
             "• Periksa kembali API Key Anda.";
    }
    // Generic 400
    return `⚠️ Permintaan Tidak Valid (Error 400)\n\nDetail: ${errorString.substring(0, 300)}`;
  }

  // 403 - Permission Denied
  if (errorCode === 403 || errorString.includes('403') || errorString.includes('PERMISSION_DENIED')) {
    return "🚫 Akses Ditolak (Error 403)\n\n" +
           "Penyebab:\n" +
           "• API Key tidak memiliki izin untuk mengakses model ini.\n" +
           "• Project Google Cloud Anda mungkin memiliki batasan wilayah.\n\n" +
           "Solusi:\n" +
           "• Pastikan Generative Language API sudah diaktifkan di Google Cloud Console.\n" +
           "• Coba buat API Key baru di project yang berbeda.";
  }

  // 404 - Not Found
  if (errorString.includes('404') || errorString.includes('NOT_FOUND')) {
    return "🔍 Model Tidak Ditemukan (Error 404)\n\n" +
           "Penyebab:\n" +
           "• Nama model yang dipilih tidak tersedia atau salah.\n\n" +
           "Solusi:\n" +
           "• Coba ganti model ke 'gemini-3-flash-preview' di Pengaturan.";
  }

  // Safety Blocks
  if (errorString.includes('SAFETY') || errorString.includes('blocked')) {
    return "🛡️ Konten Diblokir (Safety Filter)\n\n" +
           "Penyebab:\n" +
           "• AI mendeteksi konten yang melanggar kebijakan keamanan (misal: konten dewasa, kekerasan, atau hak cipta).\n\n" +
           "Solusi:\n" +
           "• Ubah kata kunci atau deskripsi Anda agar lebih umum dan tidak melanggar kebijakan.";
  }

  // 500/503 - Server Error
  if (errorString.includes('500') || errorString.includes('503') || errorString.includes('INTERNAL') || errorString.includes('SERVICE_UNAVAILABLE')) {
    return "☁️ Masalah Server Google (Error 500/503)\n\n" +
           "Penyebab:\n" +
           "• Server Google sedang sibuk atau mengalami gangguan teknis.\n\n" +
           "Solusi:\n" +
           "• Tunggu beberapa saat dan coba lagi. Ini biasanya bersifat sementara.";
  }

  return `⚠️ Terjadi Kesalahan Tak Terduga\n\nDetail: ${errorString.substring(0, 200)}${errorString.length > 200 ? '...' : ''}\n\nSaran: Coba muat ulang halaman atau periksa koneksi internet Anda.`;
}

function extractJSON(text: string) {
  try {
    // Remove markdown code block formatting if present
    const cleanedText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    // Try to find the first complete JSON block
    let start = -1;
    let end = -1;
    
    const startArr = text.indexOf('[');
    const startObj = text.indexOf('{');
    
    if (startArr !== -1 && (startObj === -1 || startArr < startObj)) {
        start = startArr;
        // Find matching ']'
        let count = 0;
        for (let i = start; i < text.length; i++) {
            if (text[i] === '[') count++;
            if (text[i] === ']') count--;
            if (count === 0) {
                end = i;
                break;
            }
        }
    } else if (startObj !== -1) {
        start = startObj;
        // Find matching '}'
        let count = 0;
        for (let i = start; i < text.length; i++) {
            if (text[i] === '{') count++;
            if (text[i] === '}') count--;
            if (count === 0) {
                end = i;
                break;
            }
        }
    }
    
    if (start !== -1 && end !== -1) {
        return JSON.parse(text.substring(start, end + 1));
    }
    
    throw new Error("Could not find valid JSON in response");
  }
}

export async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const ai = getAI(apiKey);
    // A simple, fast call to verify the key
    await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: 'hi',
      config: { maxOutputTokens: 1 }
    });
    return { isValid: true };
  } catch (error) {
    console.error("API Key validation failed:", error);
    return { isValid: false, error: handleGeminiError(error) };
  }
}

export async function fetchTrendingKeywords(keyword: string, settings: AppSettings, contentType: string): Promise<{ keyword: string; relevanceScore: number }[]> {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Analyze the keyword '${keyword}' for the content type '${contentType}' and provide 5-10 highly relevant, trending, and commercially valuable microstock keyword suggestions for the GLOBAL market on Adobe Stock.

  CRITICAL: 
  1. Use Google Search to ensure these keywords are currently trending or in high demand globally.
  2. Ensure commercial safety: Exclude recognizable celebrity faces, copyrighted logos, or trademarked architectural designs.
  3. Contextualize for '${contentType}': Provide keywords specifically relevant to this technical format (e.g., for Video: motion, frame rate; for Vector: flat, scalable).
  
  Respond strictly with a JSON array of objects, each with 'keyword' (string) and 'relevanceScore' (number 1-10).`;

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: [{ text: promptText }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              keyword: { type: "STRING" },
              relevanceScore: { type: "NUMBER" }
            },
            required: ["keyword", "relevanceScore"]
          },
        },
      },
    });

    return extractJSON(response.text || '[]');
  } catch (error) {
    logger.log({
      timestamp: new Date().toISOString(),
      functionName: 'fetchTrendingKeywords',
      input: { keyword, contentType },
      output: null,
      status: 'error',
      latencyMs: 0,
      error: error instanceof Error ? error.message : String(error)
    });
    return [];
  }
}

export function generateVeoPrompt(
  cinematography: string,
  subject: string,
  action: string,
  context: string,
  style: string
): string {
  return `${cinematography} shot, ${subject} ${action}, in ${context}, ${style}.`;
}

export function generateNanoBananaPrompt(
  subject: string,
  action: string,
  location: string,
  composition: string,
  style: string
): string {
  return `${subject} ${action}, ${location}, ${composition}, ${style}.`;
}

export async function refinePrompt(prompt: string, contentType: string, settings: AppSettings): Promise<string> {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Review the following prompt for Adobe Stock commercial viability: '${prompt}' for content type '${contentType}'. 
  
  CRITICAL:
  1. Improve the prompt to be more commercially viable, focusing on high-quality, professional aesthetics.
  2. Ensure it follows the required format: Subject, action, environment, lighting, camera angle, film stock.
  3. If the prompt is already excellent, return it as is.
  
  Respond ONLY with the refined prompt string.`;

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: [{ text: promptText }],
    });

    return response.text?.trim() || prompt;
  } catch (error) {
    return prompt;
  }
}

function getContentTypeInstructions(contentType: string): string {
  switch (contentType) {
    case 'Photo':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Be specific: Provide concrete details on subject, lighting, and composition.
      - Use positive framing: Describe what you want, not what you don't want.
      - Control the camera: Use photographic terms like "low angle" and "aerial view".
      - Design your lighting: Specify Studio setups (e.g., "three-point softbox setup") or Dramatic effects (e.g., "Chiaroscuro lighting with harsh, high contrast", "Golden hour backlighting creating long shadows").
      - Choose camera, lens, and focus: Dictate hardware (e.g., "GoPro", "Fujifilm", "disposable camera") and Lens (e.g., "low-angle shot with a shallow depth of field (f/1.8)", "wide-angle lens", "macro lens").
      - Define color grading and film stock: e.g., "1980s color film, slightly grainy", "Cinematic color grading with muted teal tones".
      - Emphasize materiality and texture: Define physical makeup (e.g., "minimalist ceramic coffee mug").
      - Text rendering: If text is needed, use quotes (e.g., "Happy Birthday") and choose a font (e.g., "bold, white, sans-serif font").`;
    case 'Illustration':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on sophisticated illustrative techniques: complex brushwork, layered textures, intricate line art, and advanced color theory.
      - Define color grading and film stock: Set the emotional tone through color palettes.
      - Emphasize materiality and texture: Define the physical makeup of the illustration (e.g., "cel animation style", "plushie style", "claymation style").
      - Text rendering: If text is needed, use quotes (e.g., "URBAN EXPLORER") and choose a font.
      - Be specific and use positive framing.`;
    case 'Vector':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on high-end vector aesthetics: perfect geometric precision, complex gradients (mesh gradients), isometric perspectives, and clean SVG-compliant paths.
      - Emphasize scalability, minimalist elegance, and elite UI/UX design standards.
      - Text rendering: If text is needed, use quotes and choose a font (e.g., "Century Gothic 12px font").`;
    case 'Background':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on atmospheric and textural depth: multi-layered bokeh, complex procedural textures, subtle light leaks, and expansive copy space.
      - Design your lighting: Specify Dramatic effects (e.g., "Chiaroscuro lighting", "Golden hour backlighting").
      - Choose camera, lens, and focus: Use "wide-angle lens" for vast scale or "macro lens" for intricate details.
      - Define color grading and film stock: e.g., "Cinematic color grading with muted teal tones".`;
    case 'Video':
      return `VEO 3.1 PROMPTING FRAMEWORK:
      Formula: [Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]
      - Cinematography: Define camera movement (Dolly shot, tracking shot, crane shot, aerial view, slow pan, POV shot), Composition (Wide shot, close-up, extreme close-up, low angle, two-shot), and Lens & focus (Shallow depth of field, wide-angle lens, soft focus, macro lens, deep focus).
      - Directing the soundstage: Veo 3.1 generates audio. Include Dialogue (e.g., A woman says, "We have to leave now."), Sound effects (e.g., SFX: thunder cracks in the distance), and Ambient noise (e.g., Ambient noise: the quiet hum of a starship bridge).
      - Be specific and use positive framing (e.g., "desolate landscape with no buildings or roads" instead of "no man-made structures").
      - Focus on cinematic mastery and professional storytelling.`;
    case '3D Render':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on state-of-the-art rendering: Unreal Engine 5.4 Path Tracing, OctaneRender, physically based rendering (PBR) materials, subsurface scattering (SSS), and global illumination.
      - Design your lighting: Specify Studio setups (e.g., "three-point softbox setup") to evenly light a product.
      - Emphasize materiality and texture: Define physical makeup (e.g., "anisotropic metal", "refractive glass", "high-fidelity 3D armchair render").
      - Choose camera, lens, and focus: Dictate the exact camera type and lens perspective.`;
    case 'AI Art & Creativity':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on boundary-pushing conceptualism: generative patterns, fluid organic forms, surrealist dreamscapes, and innovative digital alchemy.
      - Design your lighting: Specify Dramatic effects (e.g., "Chiaroscuro lighting with harsh, high contrast").
      - Define color grading and film stock: Set the emotional tone with unique color palettes.
      - Emphasize materiality and texture: Define the physical makeup of the abstract elements.`;
    default:
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on high-fidelity, commercially elite visual descriptors appropriate for this specific asset class.
      - Design your lighting, choose your camera/lens, define color grading, and emphasize materiality.`;
  }
}

function getVariationInstructions(level: 'Low' | 'Medium' | 'High'): string {
  switch (level) {
    case 'Low':
      return "VARIATION LEVEL: LOW. Focus on a highly cohesive set of prompts that explore a specific, narrow theme with subtle variations in lighting or angle. The resulting images should look like they belong to the same specific photoshoot or series. Ideal for creating consistent character sets or product variations.";
    case 'High':
      return "VARIATION LEVEL: HIGH. MAXIMUM CREATIVE DIVERSITY REQUIRED. Each prompt must explore a radically different concept, environment, lighting setup, and composition within the niche. Force the AI to use diverse subjects, unexpected angles, and contrasting moods. This is CRITICAL for large batches to avoid 'similar content' rejection by Adobe Stock. No two prompts should share more than 20% of their descriptive DNA.";
    default:
      return "VARIATION LEVEL: MEDIUM. Standard professional variation. Ensure a balanced mix of different subjects, camera angles, and lighting styles while maintaining relevance to the core theme. Provides enough variety for a standard stock submission.";
  }
}

export async function analyzeAestheticReference(referenceFile: ReferenceFile, settings: AppSettings, contentType: string): Promise<AestheticAnalysis> {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Analyze the provided image reference and extract its "Aesthetic DNA" optimized for the '${contentType}' category. 
  Focus on identifying the core visual elements that define its unique style and suggest how to incorporate them into high-quality image generation prompts for Adobe Stock.

  CRITICAL: Also identify the specific content type or niche of this asset (e.g., "Niche Background", "Video Background", "Photo Landscape", "Technology", "Lifestyle", "Abstract Art", etc.).

  Provide your analysis in the following JSON format:
  {
    "detectedContentType": "specific content type identified",
    "colorPalette": ["color1", "color2", ...],
    "lighting": "description of lighting",
    "mood": "description of mood/atmosphere",
    "artisticStyle": "description of the artistic style/medium",
    "composition": "description of the composition and framing",
    "suggestions": ["suggestion 1", "suggestion 2", ...],
    "marketGaps": ["gap 1", "gap 2", ...]
  }

  Suggestions should be specific to the '${contentType}' category, focusing on commercial utility, technical precision, and high-end aesthetic standards.
  Market Gaps should identify what is missing in the current market or how this aesthetic can be uniquely positioned for higher sales.
  
  Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

  const startTime = Date.now();
  try {
    const response = await ai.models.generateContent({
      model: referenceFile ? 'gemini-3.1-flash-image-preview' : (settings.model || 'gemini-3.1-pro-preview'),
      contents: [
        { text: promptText },
        {
          inlineData: {
            data: referenceFile.data,
            mimeType: referenceFile.mimeType
          }
        }
      ],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            detectedContentType: { type: "STRING" },
            colorPalette: { type: "ARRAY", items: { type: "STRING" } },
            lighting: { type: "STRING" },
            mood: { type: "STRING" },
            artisticStyle: { type: "STRING" },
            composition: { type: "STRING" },
            suggestions: { type: "ARRAY", items: { type: "STRING" } },
            marketGaps: { type: "ARRAY", items: { type: "STRING" } }
          },
          required: ["detectedContentType", "colorPalette", "lighting", "mood", "artisticStyle", "composition", "suggestions", "marketGaps"]
        },
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
      }
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini');
    
    const parsed = JSON.parse(text);
    
    // Validate with Zod and Critic Agent
    const validatedData = await criticizeAnalysis(AestheticAnalysisSchema.parse(parsed), AestheticAnalysisSchema, settings, 'Aesthetic Reference');
    
    // Extract grounding sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      const sources = chunks
        .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
        .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title }));
      
      if (sources.length > 0) {
        validatedData.groundingSources = sources;
      }
    }
    
    logger.log({
      timestamp: new Date().toISOString(),
      functionName: 'analyzeAestheticReference',
      input: { referenceFile: referenceFile.name, contentType },
      output: validatedData,
      status: 'success',
      latencyMs: Date.now() - startTime
    });
    
    return validatedData;
  } catch (error) {
    logger.log({
      timestamp: new Date().toISOString(),
      functionName: 'analyzeAestheticReference',
      input: { referenceFile: referenceFile.name, contentType },
      output: null,
      status: 'error',
      latencyMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error)
    });
    console.error("Aesthetic analysis failed:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
       throw new Error("Gagal memproses data estetika. Silakan coba lagi.");
    }
    throw new Error(handleGeminiError(error));
  }
}

export async function analyzeUrlAesthetic(url: string, settings: AppSettings, contentType: string): Promise<AestheticAnalysis> {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Analyze the content and visual style of this specific URL: ${url}
  You MUST use the Google Search tool to fetch and deeply analyze the content of this URL.
  
  Extract its "Aesthetic DNA" optimized for the '${contentType}' category. 
  Focus on identifying the core visual elements that define its unique style and suggest how to incorporate them into high-quality image generation prompts for Adobe Stock.

  CRITICAL: Also identify the specific content type or niche of this asset (e.g., "Niche Background", "Video Background", "Photo Landscape", "Technology", "Lifestyle", "Abstract Art", etc.).

  Provide your analysis in the following JSON format:
  {
    "detectedContentType": "specific content type identified",
    "colorPalette": ["color1", "color2", ...],
    "lighting": "description of lighting",
    "mood": "description of mood/atmosphere",
    "artisticStyle": "description of the artistic style/medium",
    "composition": "description of the composition and framing",
    "suggestions": ["suggestion 1", "suggestion 2", ...],
    "marketGaps": ["gap 1", "gap 2", ...]
  }

  Suggestions should be specific to the '${contentType}' category, focusing on commercial utility, technical precision, and high-end aesthetic standards.
  Market Gaps should identify what is missing in the current market or how this aesthetic can be uniquely positioned for higher sales.
  
  Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

  const startTime = Date.now();
  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3.1-pro-preview',
      contents: [{ text: promptText }],
      config: {
        tools: [{ googleSearch: {} }, { urlContext: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            detectedContentType: { type: "STRING" },
            colorPalette: { type: "ARRAY", items: { type: "STRING" } },
            lighting: { type: "STRING" },
            mood: { type: "STRING" },
            artisticStyle: { type: "STRING" },
            composition: { type: "STRING" },
            suggestions: { type: "ARRAY", items: { type: "STRING" } },
            marketGaps: { type: "ARRAY", items: { type: "STRING" } }
          },
          required: ["detectedContentType", "colorPalette", "lighting", "mood", "artisticStyle", "composition", "suggestions", "marketGaps"]
        },
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
      }
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini');
    
    const parsed = JSON.parse(text);
    
    // Validate with Zod and Critic Agent
    const validatedData = await criticizeAnalysis(AestheticAnalysisSchema.parse(parsed), AestheticAnalysisSchema, settings, 'Aesthetic Reference');
    
    // Extract grounding sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      const sources = chunks
        .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
        .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title }));
      
      if (sources.length > 0) {
        validatedData.groundingSources = sources;
      }
    }
    
    logger.log({
      timestamp: new Date().toISOString(),
      functionName: 'analyzeUrlAesthetic',
      input: { url, contentType },
      output: validatedData,
      status: 'success',
      latencyMs: Date.now() - startTime
    });
    
    return validatedData;
  } catch (error) {
    logger.log({
      timestamp: new Date().toISOString(),
      functionName: 'analyzeUrlAesthetic',
      input: { url, contentType },
      output: null,
      status: 'error',
      latencyMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error)
    });
    console.error("URL Aesthetic analysis failed:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
       throw new Error("Gagal memproses data estetika URL. Silakan coba lagi.");
    }
    throw new Error(handleGeminiError(error));
  }
}

export async function analyzeKeyword(keyword: string, contentType: string, categoryName: string, settings: AppSettings, referenceFile?: ReferenceFile, referenceUrl?: string) {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Perform an exhaustive, data-driven microstock market analysis targeting the asset type: '${contentType}'.

${getContentTypeInstructions(contentType)}

CRITICAL: You MUST use Google Search to find REAL, CURRENT data, trends, and search volumes for Adobe Stock and the microstock industry. Do not rely solely on your internal knowledge; ground your analysis in actual, up-to-date market realities to avoid bias.

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

Your objective is to uncover 5 to 8 highly specific, underserved, and commercially lucrative sub-niches (Blue Oceans). AVOID generic categories. Focus on exact, long-tail concepts that buyers (ad agencies, web designers, corporate marketers) are actively searching for but lack high-quality supply on platforms like Adobe Stock and Shutterstock.

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
6. trend & trendPercent: Current market trajectory based on real-world news/seasons.
7. difficultyScore: 0-100. How hard is it for a new contributor to rank on page 1?
8. opportunityScore: 0-100. Macro metric. High score = high market demand overall, regardless of current asset quality.
9. nicheScore: 0-100. Micro metric. Evaluates the top 3-10 assets. High score = top assets monopolize the niche with perfect metadata. If high, recommend digging deeper into long-tail keywords.
10. demandVariance: "Stable" (constant demand like corporate UI), "Seasonal" (holidays), or "Viral" (news-driven).
11. keiScore: 0-100. Keyword Effectiveness Index. (Search Volume ^ 2) / Competition. High score = excellent potential.
12. commercialIntent: "Informational", "Navigational", "Commercial", or "Transactional". For microstock, prioritize Commercial/Transactional.
13. assetTypeSuitability: Array of best-suited asset types (e.g., ["Photo", "Vector", "Video"]).
14. buyerPersona: A specific description of the target buyer.
15. visualTrends: An array of 3-5 specific 2026 visual trends dominating this niche.
16. creativeAdvice: Highly specific art direction based on current design trends AND your Visual Gap Analysis.
17. metadataStrategy: Specific advice on structuring the Title (50-60 chars, front-loaded with primary intent) and Description (140-160 chars, radical specificity) for this niche.

CRITICAL: Ensure mathematical and logical consistency. If competition is 95/100 (oversaturated), the opportunity score MUST be low (under 40) unless the volume is exceptionally massive. Prioritize finding "Blue Ocean" niches (High Opportunity).

SELF-CORRECTION PROTOCOL: Before finalizing each niche analysis, evaluate it against these criteria:
1. Is the niche specific enough to be a "Blue Ocean"? (Avoid generic categories).
2. Are the metrics (volume, competition, opportunity) logically consistent?
3. Does the creative advice directly address the identified "Visual Gap"?
4. Is the metadata strategy front-loaded with primary intent?
5. If it fails any check, refine the analysis immediately before finalizing the JSON output.

Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

  const parts: any[] = [{ text: promptText }];

  if (referenceFile) {
    parts.push({
      inlineData: {
        data: referenceFile.data,
        mimeType: referenceFile.mimeType
      }
    });
  }

  const tools: any[] = [{ googleSearch: {} }];
  if (referenceUrl) {
    tools.push({ urlContext: {} });
  }

  const response = await ai.models.generateContent({
    model: settings.model || 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      systemInstruction: "You are an elite Microstock Market Data Analyst (Adobe Stock, Shutterstock). Your job is to provide highly accurate, data-backed estimates for search volume and competition based on REAL, current market trends using Google Search. YOU MUST USE GOOGLE SEARCH TO FIND THE EXACT NUMBER OF SEARCH RESULTS FOR THESE KEYWORDS ON ADOBE STOCK OR SHUTTERSTOCK. Use these real numbers for volumeNumber and competitionScore. NEVER provide generic keywords. ALWAYS find underserved, high-converting long-tail niches. When a reference URL is provided, you MUST deeply analyze its content to extract its visual and conceptual DNA. Respond ONLY with valid JSON.",
      tools: tools,
      thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
    },
  });

  let text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  // Strip markdown formatting if present
  text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
  
  const startTime = Date.now();
  try {
    const parsed = extractJSON(text);
    
    // Validate with Zod and Critic Agent
    const validatedData = await criticizeAnalysis(KeywordAnalysisSchema.parse(parsed), KeywordAnalysisSchema, settings, categoryName);
    
    // Extract grounding sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      const sources = chunks
        .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
        .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title }));
      
      if (sources.length > 0) {
        // Attach grounding sources to each category result
        if (Array.isArray(validatedData)) {
          validatedData.forEach(item => {
            item.groundingSources = sources;
          });
        }
      }
    }
    
    logger.log({
      timestamp: new Date().toISOString(),
      functionName: 'analyzeKeyword',
      input: { keyword, contentType, categoryName },
      output: validatedData,
      status: 'success',
      latencyMs: Date.now() - startTime
    });
    
    return validatedData;
  } catch (e) {
    logger.log({
      timestamp: new Date().toISOString(),
      functionName: 'analyzeKeyword',
      input: { keyword, contentType, categoryName },
      output: null,
      status: 'error',
      latencyMs: Date.now() - startTime,
      error: e instanceof Error ? e.message : String(e)
    });
    console.error("Failed to parse or validate JSON response:", text, e);
    throw new Error("Failed to parse or validate the response from the AI. Please try again.");
  }
}

export async function scorePrompts(
  prompts: string[], 
  settings: AppSettings, 
  contentType: string, 
  categoryName: string,
  buyerPersona?: string,
  visualTrends?: string[],
  creativeAdvice?: string
): Promise<PromptScore[]> {
  const ai = getAI(settings.apiKey);
  
  // Chunking to avoid token limits (max 15 per request for scoring)
  const chunkSize = 15;
  const chunks = [];
  for (let i = 0; i < prompts.length; i += chunkSize) {
    chunks.push(prompts.slice(i, i + chunkSize));
  }

  let allScores: PromptScore[] = [];

  for (const chunk of chunks) {
    const promptText = `Analyze the selected prompts and provide specific suggestions for improving their quality, focusing on technical details like lighting, composition, and resolution. Evaluate the quality of the following ${chunk.length} image generation prompts for Adobe Stock. 
    Target Asset Type: '${contentType}'
    Niche: '${categoryName}'
    ${buyerPersona ? `Buyer Persona: '${buyerPersona}'` : ''}
    ${visualTrends && visualTrends.length > 0 ? `Visual Trends: '${visualTrends.join(', ')}'` : ''}
    ${creativeAdvice ? `Creative Advice: '${creativeAdvice}'` : ''}

    ${getContentTypeInstructions(contentType)}

    CRITICAL EVALUATION CRITERIA (Score 0-100 for each):
    1. Keyword Density: Are the keywords relevant and well-distributed? (Avoid stuffing, but ensure essential terms are present).
    2. Clarity: Is the prompt easy for an AI to understand? Is the subject clear?
    3. Specificity: Does it provide enough detail (lighting, composition, textures, resolution) to generate a high-quality, unique image?
    4. Adobe Stock Adherence: Does it follow commercial utility rules (copy space, diversity, authentic lifestyle) and AI compliance (no brands, no text)?
    5. Market Alignment: Does the prompt align with the Buyer Persona, Visual Trends, and Creative Advice provided for this niche? Use Google Search to verify if the concepts in the prompt are currently trending or in demand.

    Prompts to evaluate:
    ${chunk.map((p, i) => `[${i + 1}] ${p}`).join('\n')}

    Respond strictly with a JSON array of objects, one for each prompt in the same order.
    Each object MUST have:
    - prompt: (the original prompt string)
    - score: (overall quality score 0-100)
    - density: (0-100)
    - clarity: (0-100)
    - specificity: (0-100)
    - adherence: (0-100)
    - feedback: (A concise summary of the evaluation, including market alignment)
    - keywordFeedback: (Specific suggestions for keyword usage and density)
    - clarityFeedback: (Specific suggestions for improving clarity and subject definition)
    - specificityFeedback: (Specific suggestions for adding technical details like lighting, composition, textures, and resolution)
    - adherenceFeedback: (Specific suggestions for improving Adobe Stock commercial utility, AI compliance, and market alignment)
    
    Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: promptText,
      config: {
        systemInstruction: "You are an expert Adobe Stock Quality Reviewer and AI Prompt Auditor. Your job is to provide harsh but fair evaluations of image prompts to ensure they meet the highest commercial and technical standards of Adobe Stock. Provide detailed, actionable feedback for each evaluation criterion.",
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              prompt: { type: "STRING" },
              score: { type: "INTEGER" },
              density: { type: "INTEGER" },
              clarity: { type: "INTEGER" },
              specificity: { type: "INTEGER" },
              adherence: { type: "NUMBER" },
              feedback: { type: "STRING" },
              keywordFeedback: { type: "STRING" },
              clarityFeedback: { type: "STRING" },
              specificityFeedback: { type: "STRING" },
              adherenceFeedback: { type: "STRING" }
            },
            required: ["prompt", "score", "density", "clarity", "specificity", "adherence", "feedback", "keywordFeedback", "clarityFeedback", "specificityFeedback", "adherenceFeedback"]
          }
        },
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
      }
    });

    let text = response.text;
    if (!text) continue;
    
    try {
      const parsed = extractJSON(text);
      
      // Extract grounding sources
      let groundingSources = undefined;
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const sources = chunks
          .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
          .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title }));
        if (sources.length > 0) {
          groundingSources = sources;
        }
      }

      if (Array.isArray(parsed)) {
        const parsedWithSources = parsed.map(p => ({
          ...p,
          groundingSources
        }));
        allScores = [...allScores, ...parsedWithSources];
      }
    } catch (e) {
      console.error("Failed to parse JSON response for scoring chunk:", text);
    }
  }

  return allScores;
}

export async function generatePrompts(
  keyword: string, 
  categoryName: string, 
  count: number, 
  settings: AppSettings, 
  contentType: string, 
  referenceFile?: ReferenceFile, 
  referenceUrl?: string,
  buyerPersona?: string,
  visualTrends?: string[],
  creativeAdvice?: string,
  demandVariance?: string,
  commercialIntent?: string,
  assetTypeSuitability?: string[]
) {
  const ai = getAI(settings.apiKey);
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'midjourney-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  // For large counts, use a combinatorial approach to avoid LLM output token limits and guarantee uniqueness
  if (count > 30) {
    const promptText = `Generate a rich set of prompt components for the niche '${categoryName}' based on the core keyword '${keyword}'. The target asset type is '${contentType}' and the target platform is '${template.name}'.
    
    Think step-by-step about the market saturation, visual gaps, and commercial utility of your generated prompts before generating the components.
      
      ${getContentTypeInstructions(contentType)}

      CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for this niche. Ensure your generated components reflect REAL market demand and current design trends.

      ${buyerPersona ? `TARGET BUYER PERSONA: ${buyerPersona}\n      Tailor the subjects, environments, and overall vibe to appeal directly to this specific audience and their commercial needs.` : ''}
      ${visualTrends && visualTrends.length > 0 ? `CURRENT VISUAL TRENDS: ${visualTrends.join(', ')}\n      Integrate these specific aesthetic trends into the lighting, color grading, and styling of the prompts.` : ''}
      ${creativeAdvice ? `STRATEGIC DIRECTIVE: ${creativeAdvice}\n      Ensure the prompts execute on this specific creative advice.` : ''}
      ${demandVariance ? `DEMAND VARIANCE: ${demandVariance}\n      Adjust the thematic elements to suit this type of demand.` : ''}
      ${commercialIntent ? `COMMERCIAL INTENT: ${commercialIntent}\n      Ensure the prompts are highly optimized for this specific commercial intent.` : ''}
      ${assetTypeSuitability && assetTypeSuitability.length > 0 ? `ASSET TYPE SUITABILITY: ${assetTypeSuitability.join(', ')}\n      Ensure the prompts are well-suited for these asset types.` : ''}

      ${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
      You MUST use the Google Search tool to deeply analyze the visual style, trends, topic, lighting, and keywords from this URL. 
      This URL is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for these prompts.
      1. Identify the specific content type, niche, and CORE TOPIC of the asset in the URL.
      2. Extract its "Visual DNA" (lighting, color palette, mood, composition, subject matter, and thematic keywords).
      The niche '${categoryName}' should be used as a SECONDARY context to adapt the primary visual DNA and topic from the URL into a highly commercial stock asset.
      
      ADOBE STOCK ALGORITHM OPTIMIZATION: Ensure the resulting prompts are "tepat sasaran" (perfectly targeted) to the URL's aesthetic DNA while maximizing commercial appeal (copy space, authentic lifestyle).` : ''}
      ${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: Analyze the provided ${referenceFile.mimeType.startsWith('image/') ? 'image' : 'video'} reference.
      This reference file is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for these prompts.
      1. Extract its "Visual DNA": style, topic, lighting, and key visual elements.
      The niche '${categoryName}' should be used as a SECONDARY context to adapt the primary visual DNA from the file into a highly commercial stock asset.` : ''}

      We need to programmatically generate ${count} unique combinations. Please provide:
      1. 30 highly distinct subjects (e.g., "a young professional woman", "a modern office desk", "a diverse team of engineers"). MUST be diverse in age, ethnicity, and core concept.
      2. 30 specific and varied actions. (e.g., "posing with a confident stance", "typing on a laptop", "walking through a park").
      3. 30 specific and varied contexts/locations/background elements. (e.g., "cluttered office late at night", "sun-drenched minimalist living room", "bustling city street").
      4. 30 specific and varied cinematography/composition/camera techniques. ${contentType === 'Video' ? 'Include Camera movement (e.g., dolly shot, tracking shot, crane shot, slow pan, POV shot), Composition (e.g., wide shot, close-up, extreme close-up, low angle, two-shot), and Lens/focus (e.g., shallow depth of field, macro lens, deep focus).' : 'Include Composition (e.g., rule of thirds, leading lines, symmetry, minimalist, dynamic action, flat lay, top-down) and Camera angles (e.g., low angle, high angle, bird\'s eye view, dutch angle, macro, eye level).'}
      5. 20 distinct and trending lighting styles (e.g., "soft morning sunlight", "dramatic studio lighting", "neon cyberpunk glow", "chiaroscuro", "golden hour backlighting", "cinematic rim lighting").
      6. 15 mood/atmosphere descriptions (e.g., "energetic and focused", "calm and serene", "mysterious and dark").
      7. 20 diverse artistic styles/mediums/materiality/texture descriptions (e.g., "photorealistic", "cinematic photography", "3D render", "flat vector illustration", "minimalist line art", "hyper-detailed digital painting", "pronounced grain", "high saturation", "brushed metal texture", "soft fabric texture").
      8. 5 aspect ratios (e.g., "16:9", "4:3", "3:2", "1:1", "9:16")
      ${contentType === 'Video' ? '9. 15 Soundstage details (Dialogue, SFX, Ambient noise) (e.g., "SFX: thunder cracks in the distance", "Ambient noise: the quiet hum of a starship bridge", "A woman says, \\"We have to leave now.\\"").' : ''}
      
      CRITICAL ADOBE STOCK RULES:
      - ZERO HALLUCINATION & ZERO SUBJECT DRIFT: You MUST NOT invent new subjects, objects, or core concepts that are not explicitly requested by the user's input or the reference material. The core semantic meaning MUST remain identical to the user's intent.
      - ALGORITHM OPTIMIZATION: To rank high and sell, concepts must have high commercial utility. Prioritize "authentic lifestyle", "diverse representation", "copy space", and "clean compositions".
      - KEYWORD WEAVING & DENSITY STRATEGY: To maximize search visibility without keyword stuffing, you MUST weave 5-8 high-value commercial synonyms and LSI (Latent Semantic Indexing) keywords naturally across the components (subject, action, context, cinematography, lighting, mood, style). 
        - Do NOT repeat the exact same words. Use varied adjectives and nouns (e.g., instead of repeating "business", use "corporate, executive, professional, commercial, enterprise").
        - The combined final prompt should read as a natural, highly descriptive sentence that inherently contains a dense cluster of unique, searchable stock keywords.
      - NO SIMILAR CONTENT: The components must be vastly different from each other to avoid generating repetitive images. Adobe Stock rejects batches of similar images. 
      - NO TEXT/TYPOGRAPHY: Absolutely no text, words, letters, signatures, or watermarks should be mentioned or implied in the components. The output must be purely visual.
      - GENERATIVE AI COMPLIANCE: Absolutely NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands, NO recognizable characters, and NO real known restricted places/buildings. Use generic terms (e.g., "generic modern luxury car" instead of "Tesla").
      - QUALITY: Ensure descriptions naturally lead to high-quality outputs without deformed limbs or bad anatomy.
      ${contentType === 'Video' ? `- SPECIAL VIDEO INSTRUCTION: For this category, you MUST incorporate specific cinematic camera movements and techniques in the 'cinematography' section. Use terms like 'slow-motion tracking shot', 'dynamic drone footage', 'handheld camera effect', 'stabilized gimbal shot', 'crane shot', 'dolly zoom', and 'rack focus'.` : ''}
      - ${getVariationInstructions(settings.variationLevel)}
      - Ensure all components are perfectly suited for ${contentType} and optimized for the ${template.name} platform.
      
      Respond strictly with a JSON object following this schema:
      {
        "subjects": string[],
        "actions": string[],
        "contexts": string[],
        "cinematography": string[],
        "lightings": string[],
        "moods": string[],
        "styles": string[],
        "aspects": string[],
        ${contentType === 'Video' ? '"soundstage": string[],' : ''}
      }        "moods": string[],
        "styles": string[],
        "aspects": string[]
      }

      Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

    const parts: any[] = [{ text: promptText }];
    if (referenceFile) {
      parts.push({
        inlineData: {
          data: referenceFile.data,
          mimeType: referenceFile.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: `You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in crafting highly detailed, commercially successful image generation components that strictly adhere to Adobe Stock's Generative AI and Similar Content guidelines. 
        CORE ENGINE: You are operating on the ${settings.model || 'gemini-3-flash-preview'} model.
        SYNTHESIS BLUEPRINT: You are generating components for the ${template.name} platform using its specific structural logic.
        ENTROPY LEVEL: ${getVariationInstructions(settings.variationLevel)}
        ADOBE STOCK ALGORITHM: Prioritize high-demand commercial themes, authentic representation, and technical excellence.
        
        CHAIN-OF-THOUGHT: Before generating the final JSON, perform a step-by-step analysis of the market saturation, visual gaps, and commercial utility of your generated prompts within a <thinking> block.
        Respond with the <thinking> block followed by ONLY valid JSON.`,
        tools: [{ googleSearch: {} }],
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
      }
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    const startTime = Date.now();
    try {
      const parsed = extractJSON(text);
      
      // Validate with Zod and Critic Agent
      const validatedData = await criticizeAnalysis(PromptSchema.parse(parsed), PromptSchema, settings, categoryName) as Prompt;
      
      const generatedPrompts = new Set<string>();
      const negativePrompt = settings.includeNegative ? ` ${settings.customNegativePrompt || '--no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy'}` : '';
      
      // Generate combinations, ensuring uniqueness
      let attempts = 0;
      const maxAttempts = count * 5;
      
      while (generatedPrompts.size < count && attempts < maxAttempts) {
        const subject = validatedData.subjects[Math.floor(Math.random() * validatedData.subjects.length)] || "subject";
        const action = validatedData.actions[Math.floor(Math.random() * validatedData.actions.length)] || "action";
        const context = validatedData.contexts[Math.floor(Math.random() * validatedData.contexts.length)] || "context";
        const cinematography = validatedData.cinematography[Math.floor(Math.random() * validatedData.cinematography.length)] || "cinematography";
        const lighting = validatedData.lightings[Math.floor(Math.random() * validatedData.lightings.length)] || "lighting";
        const mood = validatedData.moods[Math.floor(Math.random() * validatedData.moods.length)] || "mood";
        const style = validatedData.styles[Math.floor(Math.random() * validatedData.styles.length)] || "style";
        const aspect = validatedData.aspects[Math.floor(Math.random() * validatedData.aspects.length)] || "16:9";
        
        let prompt = template.template
          .replace(/{subject}/g, subject)
          .replace(/{action}/g, action)
          .replace(/{context}/g, context)
          .replace(/{cinematography}/g, cinematography)
          .replace(/{lighting}/g, lighting)
          .replace(/{mood}/g, mood)
          .replace(/{style}/g, style)
          .replace(/{aspect}/g, aspect);
        
        if (contentType === 'Video' && validatedData.soundstage) {
          const soundstage = validatedData.soundstage[Math.floor(Math.random() * validatedData.soundstage.length)] || "Ambient noise: quiet";
          prompt += ` ${soundstage}`;
        }
        
        prompt += negativePrompt;
        
        // Ensure single line
        prompt = prompt.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        
        generatedPrompts.add(prompt);
        attempts++;
      }
      
      logger.log({
        timestamp: new Date().toISOString(),
        functionName: 'generatePrompts',
        input: { keyword, count },
        output: Array.from(generatedPrompts),
        status: 'success',
        latencyMs: Date.now() - startTime
      });
      
      return Array.from(generatedPrompts);
    } catch (e) {
      logger.log({
        timestamp: new Date().toISOString(),
        functionName: 'generatePrompts',
        input: { keyword, count },
        output: null,
        status: 'error',
        latencyMs: Date.now() - startTime,
        error: e instanceof Error ? e.message : String(e)
      });
      console.error("Failed to parse JSON response:", text);
      throw new Error("Failed to parse the response from the AI. Please try again.");
    }
  }

  // Standard generation for smaller counts
  const promptTextSmall = `Generate exactly ${count} highly detailed, commercial-grade image generation prompts for the niche '${categoryName}' based on the core keyword '${keyword}'. The target asset type is '${contentType}' and the target platform is '${template.name}'.

${getContentTypeInstructions(contentType)}

CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for this niche. Ensure your generated prompts reflect REAL market demand and current design trends.

${buyerPersona ? `TARGET BUYER PERSONA: ${buyerPersona}\nTailor the subjects, environments, and overall vibe to appeal directly to this specific audience and their commercial needs.` : ''}
${visualTrends && visualTrends.length > 0 ? `CURRENT VISUAL TRENDS: ${visualTrends.join(', ')}\nIntegrate these specific aesthetic trends into the lighting, color grading, and styling of the prompts.` : ''}
${creativeAdvice ? `STRATEGIC DIRECTIVE: ${creativeAdvice}\nEnsure the prompts execute on this specific creative advice.` : ''}
${demandVariance ? `DEMAND VARIANCE: ${demandVariance}\nAdjust the thematic elements to suit this type of demand.` : ''}
${commercialIntent ? `COMMERCIAL INTENT: ${commercialIntent}\nEnsure the prompts are highly optimized for this specific commercial intent.` : ''}
${assetTypeSuitability && assetTypeSuitability.length > 0 ? `ASSET TYPE SUITABILITY: ${assetTypeSuitability.join(', ')}\nEnsure the prompts are well-suited for these asset types.` : ''}

${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
You MUST use the Google Search tool to analyze this URL. 
LOGIC: Use this URL as the PRIMARY SOURCE for style, topic, lighting, and thematic keywords.
The niche '${categoryName}' provides additional context. 
TASK: Generate prompts that are "tepat sasaran" (perfectly targeted) according to the URL's essence.
ADOBE STOCK ALGORITHM: Maximize commercial utility (copy space, authentic lifestyle, diverse representation).
ADOBE STOCK SAFETY: Do not replicate specific characters, but capture the exact visual and conceptual DNA.` : ''}
${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: Analyze the provided ${referenceFile.mimeType.startsWith('image/') ? 'image' : 'video'}.
LOGIC: Use this file as the PRIMARY SOURCE for style, topic, lighting, and thematic keywords.
The niche '${categoryName}' provides additional context. 
TASK: Generate prompts that precisely match the visual and conceptual DNA of the file.` : ''}

${contentType === 'AI Art & Creativity' ? `SPECIAL AI ART INSTRUCTION: For this category, prioritize surrealism, abstract concepts, and innovative digital aesthetics. If a reference is provided, deeply analyze its 'Aesthetic Soul'—not just the subject, but the emotional resonance, the texture of the light, and the complexity of the forms. Incorporate these into the prompts to create something that feels like a creative evolution of the reference.` : ''}
${contentType === 'Video' ? `SPECIAL VIDEO INSTRUCTION: For this category, you MUST incorporate specific cinematic camera movements and techniques. Use terms like 'slow-motion tracking shot', 'dynamic drone footage', 'handheld camera effect', 'stabilized gimbal shot', 'crane shot', 'dolly zoom', and 'rack focus'. Specify frame rates like '60fps' for slow motion or '24fps' for a cinematic look. Ensure the action described is dynamic and visually engaging. Include Soundstage details (Dialogue, SFX, Ambient noise).` : ''}

CRITICAL REQUIREMENTS FOR ADOBE STOCK:
1. ALGORITHM OPTIMIZATION & Commercial Utility: Ensure concepts are highly usable for designers and agencies. You MUST include concepts with 'copy space', 'authentic lifestyle', 'diverse representation', 'modern aesthetics', or 'clean backgrounds' where appropriate.
2. KEYWORD WEAVING & DENSITY STRATEGY: To maximize search visibility without keyword stuffing, you MUST weave 5-8 high-value commercial synonyms and LSI (Latent Semantic Indexing) keywords naturally across the descriptive flow of EACH prompt. 
   - DO NOT repeat the exact same words. Use varied adjectives and nouns (e.g., instead of repeating "business", use "corporate, executive, professional, commercial, enterprise").
   - The combined final prompt should read as a natural, highly descriptive sentence that inherently contains a dense cluster of unique, searchable stock keywords.
3. Technical Precision: Specify lighting, camera angles, and aesthetic quality appropriate for a ${contentType} on the ${template.name} platform.
4. NO SIMILAR CONTENT: Adobe Stock rejects batches of similar images. Do not generate prompts that are practically identical. Each prompt MUST have a distinct composition, camera angle, subject, or core action.
   - VARIATION STRATEGY: You MUST explicitly rotate through a wide range of camera angles (e.g., low angle, high angle, bird's eye view, dutch angle, macro, wide shot, extreme close-up, eye level, over-the-shoulder) and compositions (e.g., rule of thirds, leading lines, symmetry, minimalist, dynamic action, flat lay, top-down).
   - LIGHTING & STYLE DIVERSITY: Ensure each prompt uses a unique combination of trending lighting conditions (e.g., golden hour, cinematic rim lighting, neon glow, soft diffused, harsh shadows) and artistic styles relevant to the market.
5. GENERATIVE AI COMPLIANCE: Absolutely NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands, NO recognizable characters, and NO real known restricted places/buildings. Use generic terms only.
6. QUALITY: Ensure descriptions naturally lead to high-quality outputs.
7. NO TEXT: Strictly avoid any mention of text, typography, words, letters, signatures, or watermarks. The image must be clean and free of any literal text.
8. ${getVariationInstructions(settings.variationLevel)}
9. STRICT Template Alignment: You MUST strictly format each prompt using this exact template structure for ${template.name}:
"${template.template}"
Replace the bracketed placeholders (e.g., {subject}, {details}, {lighting}) with your generated content. Do not add conversational text.
10. FORMATTING: Each prompt MUST be a single, continuous line of text. Do not use line breaks, newlines, or paragraphs within a single prompt.

Respond strictly with a JSON array of strings, where each string is a complete, ready-to-use image generation prompt tailored for a ${contentType}.
Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.
${settings.includeNegative ? 'Append a strong negative prompt at the end of each prompt (e.g., "--no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy").' : ''}`;

  const partsSmall: any[] = [{ text: promptTextSmall }];
  if (referenceFile) {
    partsSmall.push({
      inlineData: {
        data: referenceFile.data,
        mimeType: referenceFile.mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: { parts: partsSmall },
      config: {
        systemInstruction: `You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in crafting highly detailed, commercially successful image generation prompts that strictly adhere to Adobe Stock's Generative AI and Similar Content guidelines. 
        
        CORE ENGINE: ${settings.model || 'gemini-3-flash-preview'}.
        SYNTHESIS BLUEPRINT: ${template.name}.
        ENTROPY LEVEL: ${getVariationInstructions(settings.variationLevel)}.
        ADOBE STOCK ALGORITHM: Focus on high-demand commercial utility and technical perfection.
        
        SELF-CORRECTION PROTOCOL: Before finalizing each prompt, evaluate it against these criteria:
        1. Does it strictly avoid trademarked/copyrighted elements?
        2. Is it free of any literal text, watermarks, or signatures?
        3. Does it include high-value commercial synonyms and LSI keywords?
        4. Is the composition and lighting technically precise and commercially viable?
        5. If it fails any check, refine the prompt immediately before finalizing the JSON output.`,
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: "ARRAY",
          items: { type: "STRING" },
        },
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
      },
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    
    // Strip markdown formatting if present
    text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    
    const parsed = extractJSON(text);
    if (Array.isArray(parsed)) {
      return parsed.map(p => typeof p === 'string' ? p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : p);
    }
    return parsed;
  } catch (error) {
    console.error("Prompt generation failed:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
       throw new Error("Gagal memproses hasil prompt. Silakan coba lagi.");
    }
    throw new Error(handleGeminiError(error));
  }
}

export async function generatePromptsDirectly(count: number, settings: AppSettings, contentType: string, keyword?: string, referenceFile?: ReferenceFile, referenceUrl?: string) {
  const ai = getAI(settings.apiKey);
  const startTime = Date.now();
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'midjourney-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  const promptText = `Generate exactly ${count} highly detailed, commercial-grade image generation prompts. The target asset type is '${contentType}' and the target platform is '${template.name}'.
  
  Think step-by-step about the market saturation, visual gaps, and commercial utility of your generated prompts before generating the components.
  
  ${getContentTypeInstructions(contentType)}

  CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for this asset type. Ensure your generated prompts reflect REAL market demand and current design trends.

  ${keyword ? `The core theme/keyword is: '${keyword}'.` : ''}
  ${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
  You MUST use the Google Search tool to analyze this URL. 
  LOGIC: Use this URL as the PRIMARY SOURCE for style, topic, lighting, and thematic keywords.
  Identify the specific content type, niche, and CORE TOPIC of the asset in the URL.
  TASK: Apply the style, topic, lighting, and keywords from the URL to the subject matter. 
  ADOBE STOCK ALGORITHM: Ensure prompts are "tepat sasaran" (perfectly targeted) to the URL's aesthetic while maintaining high commercial utility.
  ADOBE STOCK SAFETY: Capture the 'vibe' and conceptual DNA without infringing on IP.` : ''}
  ${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: Analyze the provided ${referenceFile.mimeType.startsWith('image/') ? 'image' : 'video'}.
  LOGIC: Use this file as the PRIMARY SOURCE for style, topic, lighting, and thematic keywords.
  TASK: Apply the style, topic, lighting, and keywords from the file to the subject matter.` : ''}

${contentType === 'AI Art & Creativity' ? `SPECIAL AI ART INSTRUCTION: For this category, prioritize surrealism, abstract concepts, and innovative digital aesthetics. If a reference is provided, deeply analyze its 'Aesthetic Soul'—not just the subject, but the emotional resonance, the texture of the light, and the complexity of the forms. Incorporate these into the prompts to create something that feels like a creative evolution of the reference.` : ''}
${contentType === 'Video' ? `SPECIAL VIDEO INSTRUCTION: For this category, you MUST incorporate specific cinematic camera movements and techniques. Use terms like 'slow-motion tracking shot', 'dynamic drone footage', 'handheld camera effect', 'stabilized gimbal shot', 'crane shot', 'dolly zoom', and 'rack focus'. Specify frame rates like '60fps' for slow motion or '24fps' for a cinematic look. Ensure the action described is dynamic and visually engaging. Include Soundstage details (Dialogue, SFX, Ambient noise).` : ''}

  CRITICAL REQUIREMENTS FOR ADOBE STOCK:
  1. ZERO HALLUCINATION & ZERO SUBJECT DRIFT: You MUST NOT invent new subjects, objects, or core concepts that are not explicitly requested by the user's input or the reference material. The core semantic meaning MUST remain identical to the user's intent.
  2. ALGORITHM OPTIMIZATION & Commercial Utility: Ensure concepts are highly usable for designers and agencies. You MUST include concepts with 'copy space', 'authentic lifestyle', 'diverse representation', 'modern aesthetics', or 'clean backgrounds' where appropriate.
  3. KEYWORD DENSITY & SEO: Weave 5-7 highly relevant, commercial keywords naturally into the descriptive flow of EACH prompt. 
     - DO NOT keyword stuff (e.g., do not just add a list of words at the end).
     - Instead, integrate them into the visual description (e.g., "A successful corporate business team collaborating in a modern sunlit office..."). 
     - Ensure the keywords accurately describe the visual elements so the AI generates them.
  4. Technical Precision: Specify lighting, camera angles, and aesthetic quality appropriate for the ${template.name} platform.
  5. NO SIMILAR CONTENT: Adobe Stock rejects batches of similar images. Each prompt MUST have a distinct composition, camera angle, subject, or core action. Avoid repetitive concepts.
     - VARIATION STRATEGY: Rotate through diverse camera angles (e.g., low angle, high angle, bird's eye view, dutch angle, macro, wide shot, extreme close-up, eye level) and compositions (e.g., rule of thirds, leading lines, symmetry, minimalist, dynamic action, flat lay, top-down).
  6. GENERATIVE AI COMPLIANCE: Absolutely NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands, NO recognizable characters, and NO real known restricted places/buildings. Use generic terms only (e.g., "generic modern smartphone").
  7. QUALITY: Ensure descriptions naturally lead to high-quality outputs.
  8. NO TEXT: Strictly avoid any mention of text, typography, words, letters, signatures, or watermarks.
  9. ${getVariationInstructions(settings.variationLevel)}
  10. STRICT Template Alignment: You MUST strictly format each prompt using this exact template structure for ${template.name}:
  "${template.template}"
  Replace the bracketed placeholders (e.g., {subject}, {details}, {lighting}) with your generated content. Do not add conversational text.
  11. FORMATTING: Each prompt MUST be a single, continuous line of text. Do not use line breaks, newlines, or paragraphs within a single prompt.

  Respond strictly with a JSON array of strings, where each string is a complete, ready-to-use image generation prompt tailored for a ${contentType}.
  Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.
  ${settings.includeNegative ? 'Append a strong negative prompt at the end of each prompt (e.g., "--no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy").' : ''}`;

  const parts: any[] = [{ text: promptText }];

  if (referenceFile) {
    parts.push({
      inlineData: {
        data: referenceFile.data,
        mimeType: referenceFile.mimeType
      }
    });
  }

  const tools: any[] = [{ googleSearch: {} }];
  if (referenceUrl) {
    tools.push({ urlContext: {} });
  }

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: `You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. Your expertise lies in crafting highly detailed, commercially successful image generation prompts based on visual or textual references and real-world market data. 
        CORE ENGINE: ${settings.model || 'gemini-3-flash-preview'}.
        SYNTHESIS BLUEPRINT: ${template.name}.
        ENTROPY LEVEL: ${getVariationInstructions(settings.variationLevel)}.
        ADOBE STOCK ALGORITHM: Extract aesthetic essence and apply it to commercially viable concepts.
        Respond ONLY with valid JSON.`,
        tools: tools,
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
      }
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    
    const parsed = extractJSON(text);
    
    // Validate with Zod and Critic Agent
    const validatedData = await criticizeAnalysis(PromptDirectSchema.parse({ prompts: Array.isArray(parsed) ? parsed : parsed.prompts }), PromptDirectSchema, settings, 'General Market');
    
    const generatedPrompts = validatedData.prompts.map(p => {
      let prompt = p;
      if (settings.includeNegative) {
        prompt += ` ${settings.customNegativePrompt || '--no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy'}`;
      }
      return prompt.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    });
    
    logger.log({
      timestamp: new Date().toISOString(),
      functionName: 'generatePromptsDirectly',
      input: { keyword, count },
      output: generatedPrompts,
      status: 'success',
      latencyMs: Date.now() - startTime
    });
    
    return { prompts: generatedPrompts };
  } catch (error) {
    logger.log({
      timestamp: new Date().toISOString(),
      functionName: 'generatePromptsDirectly',
      input: { keyword, count },
      output: null,
      status: 'error',
      latencyMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error)
    });
    console.error("Direct prompt generation failed:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
       throw new Error("Gagal memproses hasil prompt. Silakan coba lagi.");
    }
    throw new Error(handleGeminiError(error));
  }
}

export async function optimizePrompts(
  prompts: string[], 
  settings: AppSettings, 
  contentType: string, 
  keyword?: string, 
  categoryName?: string, 
  referenceFile?: ReferenceFile, 
  referenceUrl?: string,
  buyerPersona?: string,
  visualTrends?: string[],
  creativeAdvice?: string
) {
  const ai = getAI(settings.apiKey);
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'midjourney-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  // Chunking to avoid token limits and ensure high-quality optimization for every prompt
  const chunkSize = 15;
  const chunks = [];
  for (let i = 0; i < prompts.length; i += chunkSize) {
    chunks.push(prompts.slice(i, i + chunkSize));
  }

  let allOptimizedPrompts: string[] = [];
  const startTime = Date.now();

  for (const chunk of chunks) {
    const promptText = `You are a Master Neural Prompt Architect. Your task is to perform a "Hyper-Technical Optimization" on the following list of ${chunk.length} image generation prompts for Adobe Stock (${contentType}) specifically for the '${template.name}' platform.
    
    Think step-by-step about the technical details (lighting, composition, resolution) and commercial utility of these prompts before optimizing them.
    
    ${getContentTypeInstructions(contentType)}

    CRITICAL: Use Google Search to research current technical standards, popular aesthetic modifiers, and high-demand commercial styles on Adobe Stock. Ensure your enhancements reflect REAL market demand and current professional photography/illustration trends.

    ${keyword || categoryName ? `The niche context is: '${categoryName || keyword}'.` : ''}
    ${buyerPersona ? `TARGET BUYER PERSONA: ${buyerPersona}\n  Ensure the technical enhancements appeal directly to this specific audience.` : ''}
    ${visualTrends && visualTrends.length > 0 ? `CURRENT VISUAL TRENDS: ${visualTrends.join(', ')}\n  Integrate these specific aesthetic trends into the technical upgrade.` : ''}
    ${creativeAdvice ? `STRATEGIC DIRECTIVE: ${creativeAdvice}\n  Ensure the enhancements execute on this specific creative advice.` : ''}

    ${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
    You MUST use the Google Search tool to deeply analyze the visual style, topic, lighting, and keywords from this URL. 
    This URL is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for the technical upgrade.
    1. Identify the specific content type, niche, and CORE TOPIC of the asset in the URL.
    2. Use it as the absolute benchmark for style, lighting, camera settings, and overall aesthetic.
    3. ALIGNMENT: You MUST optimize the prompts to be "on target" with the URL's style, topic, lighting, and keywords. If the original prompt subject differs slightly, align it with the URL's essence to ensure a cohesive commercial set.
    
    ADOBE STOCK ALGORITHM: Ensure the hyper-technical optimization maximizes commercial utility and technical rating.` : ''}
    ${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: Analyze the provided reference file.
    This reference file is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for the technical upgrade.
    1. Extract the visual DNA: style, topic, lighting, and key visual elements.
    2. Use it as the absolute benchmark for technical quality and aesthetic alignment.
    3. ALIGNMENT: Adjust the prompts to precisely match the style, lighting, and thematic keywords found in this file.` : ''}

    STRICT RULE: If NO reference is provided, you MUST preserve the original visual subject exactly. If a reference IS provided, you MUST prioritize alignment with the reference's topic and style while respecting the original prompt's intent.
    
    YOUR TASK: Perform a "Hyper-Technical Optimization" by:
    1. Injecting Extreme Technical Precision: Use advanced camera settings, elite rendering engines, and complex lighting physics that match the reference's quality.
    2. Enhancing Descriptive Power & Keyword Weaving: Use sophisticated vocabulary to describe textures, materials, and atmospheric effects derived from the reference. You MUST weave 5-8 high-value commercial synonyms and LSI keywords naturally into the upgraded prompt to maximize search visibility without keyword stuffing.
    3. Optimizing for Adobe Stock Algorithms: Ensure the prompt structure maximizes commercial appeal and technical rating.
    4. Targeted Alignment: Ensure the resulting prompts are "tepat sasaran" (perfectly targeted) according to the reference's style, topic, and keywords.

  Original Prompts:
  ${JSON.stringify(chunk)}

  CRITICAL REQUIREMENTS FOR 80+ QUALITY INDEX:
  1. ZERO HALLUCINATION & ZERO SUBJECT DRIFT (CRITICAL): You MUST NOT change the core subject, action, or main elements of the original prompt. 
     - If the original prompt says "A cat sitting on a mat", DO NOT change it to "A dog sitting on a mat" or "A cat running in a field".
     - DO NOT add random characters, objects, or settings that were not present.
     - ONLY enhance the descriptive quality, lighting, composition, and technical parameters of the EXISTING elements.
     - The core semantic meaning MUST remain 100% identical.
  2. GUARANTEED 80+ SCORE: The resulting prompt must be so detailed, commercially viable, and technically perfect that it is guaranteed to score above 80% on a strict Adobe Stock quality index. To achieve this, you MUST maximize:
     - Keyword Density: Weave 5-8 high-value commercial synonyms and LSI keywords naturally.
     - Clarity: Ensure the subject and action are unmistakable.
     - Specificity: Provide exhaustive detail on lighting, composition, textures, and resolution.
     - Adobe Stock Adherence: Ensure high commercial utility (copy space, authentic lifestyle) and strict AI compliance (no brands, no text).
     - Market Alignment: Perfectly target the Buyer Persona, Visual Trends, and Creative Advice.
  3. NO TEXT/LOGOS: Strictly avoid any mention of text, typography, or watermarks.
  4. ADOBE STOCK COMPLIANCE: Use generic high-end terms.
  5. POWERFUL MODIFIERS: Use terms like "8K UHD", "hyper-detailed textures", "physically based rendering (PBR)", "ray-traced reflections", and "cinematic color grading".
  6. STRICT Template Alignment: Format each prompt using this exact structure:
  "${template.template}"
  7. FORMATTING: Each prompt MUST be a single, continuous line of text. Do not use line breaks, newlines, or paragraphs within a single prompt.

  Respond strictly with a JSON object containing a 'prompts' array of strings, containing exactly ${chunk.length} optimized prompts in the same order.
  Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.
  ${settings.includeNegative ? 'Append a strong negative prompt at the end of each optimized prompt (e.g., "--no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy").' : ''}`;

    const parts: any[] = [{ text: promptText }];
    if (referenceFile) {
      parts.push({
        inlineData: {
          data: referenceFile.data,
          mimeType: referenceFile.mimeType
        }
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: settings.model || 'gemini-3-flash-preview',
        contents: { parts },
        config: {
          systemInstruction: `You are a Master Neural Prompt Architect. Your specialty is 'Hyper-Optimization'—injecting extreme technical complexity and descriptive power into existing prompts while maintaining absolute fidelity to the original subject and style. 
          CORE ENGINE: ${settings.model || 'gemini-3-flash-preview'}.
          SYNTHESIS BLUEPRINT: ${template.name}.
          ENTROPY LEVEL: ${getVariationInstructions(settings.variationLevel)}.
          ADOBE STOCK ALGORITHM: Use advanced optics, lighting physics, and digital rendering terminology to elevate prompts to 'Masterpiece' status for Adobe Stock.`,
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: {
            type: "OBJECT",
            properties: {
              prompts: { type: "ARRAY", items: { type: "STRING" } },
              groundingSources: { 
                type: "ARRAY", 
                items: { 
                  type: "OBJECT", 
                  properties: { uri: { type: "STRING" }, title: { type: "STRING" } },
                  required: ["uri", "title"]
                }
              }
            },
            required: ["prompts"]
          },
          thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
        },
      });

      let text = response.text;
      if (!text) throw new Error('No response from Gemini');
      
      // Strip markdown formatting if present
      text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
      
      const parsed = extractJSON(text);
      console.log("Parsed:", parsed);
      
      // Handle case where Gemini returns an array instead of the expected object
      const dataToValidate = Array.isArray(parsed) ? { prompts: parsed } : parsed;
      
      // Validate with Zod and Critic Agent
      const validatedData = await criticizeAnalysis(PromptDirectSchema.parse(dataToValidate), PromptDirectSchema, settings, categoryName) as PromptDirect;
      
      const optimizedPrompts = validatedData.prompts;
      
      logger.log({
        timestamp: new Date().toISOString(),
        functionName: 'optimizePrompts',
        input: { prompts: chunk },
        output: optimizedPrompts,
        status: 'success',
        latencyMs: Date.now() - startTime
      });
      
      allOptimizedPrompts = [...allOptimizedPrompts, ...optimizedPrompts];
    } catch (error) {
      logger.log({
        timestamp: new Date().toISOString(),
        functionName: 'optimizePrompts',
        input: { prompts: chunk },
        output: null,
        status: 'error',
        latencyMs: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error)
      });
      console.error("Prompt optimization failed for chunk:", error);
      if (error instanceof Error && error.message.includes('JSON')) {
         throw new Error("Gagal memproses hasil optimasi. Silakan coba lagi.");
      }
      throw new Error(handleGeminiError(error));
    }
  }

  return allOptimizedPrompts;
}

export async function generateAllPromptsBatch(
  keyword: string, 
  categories: any[], 
  totalCount: number, 
  settings: AppSettings, 
  contentType: string,
  referenceUrl?: string,
  progressCallback?: (progress: { current: number, total: number, message: string }) => void
): Promise<{ promptsMap: Map<string, string[]>, groundingSources?: { uri: string, title: string }[] }> {
  const ai = getAI(settings.apiKey);
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'nanobanana-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  const countPerCategory = Math.max(1, Math.floor(totalCount / categories.length));
  const itemsNeeded = Math.max(5, Math.ceil(Math.sqrt(countPerCategory) * 1.5));

  const categoryDetails = categories.map(c => 
    `- Niche: ${c.categoryName}
      Buyer Persona: ${c.buyerPersona || 'N/A'}
      Visual Trends: ${c.visualTrends ? c.visualTrends.join(', ') : 'N/A'}
      Creative Advice: ${c.creativeAdvice || 'N/A'}
      Demand Variance: ${c.demandVariance || 'N/A'}
      Commercial Intent: ${c.commercialIntent || 'N/A'}
      Asset Type Suitability: ${c.assetTypeSuitability ? c.assetTypeSuitability.join(', ') : 'N/A'}`
  ).join('\n    ');

  let response: any;
  progressCallback?.({ current: 0, total: 1, message: 'Memulai pembuatan prompt...' });

  try {
    response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: `Generate rich prompt components for multiple niches based on the core keyword '${keyword}'. The target asset type is '${contentType}'.
      ${referenceUrl ? `\nReference URL to analyze for context: ${referenceUrl}` : ''}
      
      ${getContentTypeInstructions(contentType)}

      The niches and their market analysis are:
      ${categoryDetails}
      
      CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for these niches. Ensure your generated components reflect REAL market demand and current design trends, specifically tailoring the subjects, environments, and overall vibe to appeal directly to the Buyer Persona and Creative Advice provided for each niche.

      For EACH niche, provide:
      1. ${itemsNeeded} highly distinct subjects.
      2. ${itemsNeeded} specific and varied details/actions/camera angles. ${contentType === 'Video' ? 'Include Cinematography (Camera movement, Composition, Lens & focus) and Action.' : 'Include Action, Location/context, and Composition.'}
      3. ${itemsNeeded} distinct lighting styles.
      4. ${itemsNeeded} mood/atmosphere descriptions. ${contentType === 'Video' ? 'Include Soundstage details (Dialogue, SFX, Ambient noise).' : ''}
      5. ${itemsNeeded} artistic styles/mediums.
      6. 5 aspect ratios (e.g., "16:9", "4:3", "1:1").
      
      Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.`,
      config: {
        systemInstruction: `You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. 
        CORE ENGINE: ${settings.model || 'gemini-3-flash-preview'}.
        SYNTHESIS BLUEPRINT: ${template.name}.
        ENTROPY LEVEL: ${getVariationInstructions(settings.variationLevel)}.
        ADOBE STOCK ALGORITHM: Use real-world data to inform your aesthetic choices. Respond ONLY with valid JSON.`,
        tools: referenceUrl ? [{ googleSearch: {} }, { urlContext: {} }] : [{ googleSearch: {} }],
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
      }
    });

    console.log("Gemini raw response:", response.text);
    const result = extractJSON(response.text || '{}');
    const negativePrompt = settings.includeNegative ? ` ${settings.customNegativePrompt || '--no text, watermark, deformed, blurry, logos'}` : '';
    
    const resultsMap = new Map<string, string[]>();
    
    for (const [nicheName, catData] of Object.entries(result)) {
      const generatedPrompts = new Set<string>();
      let attempts = 0;
      const maxAttempts = countPerCategory * 5;
      
      while (generatedPrompts.size < countPerCategory && attempts < maxAttempts) {
        const subjectList = (catData as any).subjects || [];
        const subject = subjectList[Math.floor(Math.random() * subjectList.length)] || "subject";
        
        const detailList = (catData as any).details_actions_composition || [];
        const detail = detailList[Math.floor(Math.random() * detailList.length)] || "detail";
        
        const lightingList = (catData as any).lighting_styles || [];
        const lighting = lightingList[Math.floor(Math.random() * lightingList.length)] || "lighting";
        
        const moodList = (catData as any).mood_atmosphere || [];
        const mood = moodList[Math.floor(Math.random() * moodList.length)] || "mood";
        
        const styleList = (catData as any).artistic_styles_mediums || [];
        const style = styleList[Math.floor(Math.random() * styleList.length)] || "style";
        
        const aspectList = (catData as any).aspect_ratios || [];
        const aspect = aspectList[Math.floor(Math.random() * aspectList.length)] || "16:9";
        
        let prompt = template.template
          .replace(/{subject}/g, subject)
          .replace(/{details}/g, detail)
          .replace(/{lighting}/g, lighting)
          .replace(/{mood}/g, mood)
          .replace(/{style}/g, style)
          .replace(/{aspect}/g, aspect);
          
        prompt += negativePrompt;
        
        // Ensure single line
        prompt = prompt.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        
        generatedPrompts.add(prompt);
        attempts++;
      }
      resultsMap.set(nicheName, Array.from(generatedPrompts));
    }
    
    progressCallback?.({ current: 1, total: 1, message: 'Selesai!' });
    return { promptsMap: resultsMap, groundingSources: result.groundingSources };
  } catch (error) {
    console.error("Batch generation failed:", error);
    throw new Error(`Batch generation failed. Raw response: ${response?.text || 'No response'}. Error: ${error}`);
  }
}

export async function generateAdobeStockMetadata(
  prompts: string[], 
  categoryName: string, 
  settings: AppSettings,
  contentType: string
): Promise<{ title: string, keywords: string[] }[]> {
  const ai = getAI(settings.apiKey);
  
  // Chunk prompts to avoid token limits (max 10 per request)
  const chunkSize = 10;
  const chunks = [];
  for (let i = 0; i < prompts.length; i += chunkSize) {
    chunks.push(prompts.slice(i, i + chunkSize));
  }

  let allMetadata: { title: string, keywords: string[] }[] = [];

  for (const chunk of chunks) {
    const promptText = `Generate highly optimized metadata for Adobe Stock for the following ${chunk.length} image generation prompts in the niche '${categoryName}'. The target asset type is '${contentType}'.
    
    ${getContentTypeInstructions(contentType)}

CRITICAL ADOBE STOCK SEO ALGORITHM RULES:
1. ZERO HALLUCINATION: You MUST NOT invent subjects, objects, or concepts that are not explicitly present in the provided prompt. The metadata MUST accurately reflect ONLY what is described.
2. TITLE: Write a natural, descriptive title (5-10 words, max 200 chars). Include the main subject, action, and setting. Do not keyword stuff the title. Must be in English.
3. KEYWORDS: Provide exactly 40-50 highly relevant keywords. Must be in English.
4. KEYWORD ORDER IS CRITICAL: The Adobe Stock search algorithm heavily weighs the FIRST 10 KEYWORDS. Place the most accurate, descriptive, and important keywords at the very beginning of the array.
5. KEYWORD TYPES: Include who, what, where, action, mood, and technical concepts (e.g., 'copy space', 'background', 'authentic').
6. COMPLIANCE: NO trademarks, NO brand names, NO camera brands (like Nikon, Sony). No spammy words.

Prompts:
${chunk.map((p, i) => `[${i + 1}] ${p}`).join('\n')}
`;

    try {
      const response = await ai.models.generateContent({
        model: settings.model || 'gemini-3-flash-preview',
        contents: promptText,
        config: {
          systemInstruction: `You are an elite Microstock SEO Expert and Top-Selling Adobe Stock Contributor. 
          CORE ENGINE: ${settings.model || 'gemini-3-flash-preview'}.
          ADOBE STOCK ALGORITHM: You know exactly how to write titles and 50 keywords that rank #1 on Adobe Stock search. You use real-world search data to inform your keywords.`,
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                keywords: { type: "ARRAY", items: { type: "STRING" } }
              },
              required: ["title", "keywords"]
            }
          },
          thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.HIGH } : undefined
        }
      });

      let text = response.text;
      if (!text) throw new Error('No response from Gemini');
      
      const parsed = extractJSON(text);
      allMetadata = [...allMetadata, ...parsed];
    } catch (error) {
      console.error("Metadata generation failed for chunk:", error);
      if (error instanceof Error && error.message.includes('JSON')) {
         throw new Error("Gagal memproses hasil metadata. Silakan coba lagi.");
      }
      throw new Error(handleGeminiError(error));
    }
  }

  return allMetadata;
}


