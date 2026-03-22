import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { AppSettings, PromptTemplate, ReferenceFile, PromptScore, AestheticAnalysis } from '../types';
import { fetchRealTimeMarketData } from './ragService';
import { cacheService } from './cacheService';
import { getEmbedding } from './vectorService';
import { vectorStoreService } from './vectorStore';

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
    return JSON.parse(text);
  } catch (e) {
    const startArr = text.indexOf('[');
    const endArr = text.lastIndexOf(']');
    const startObj = text.indexOf('{');
    const endObj = text.lastIndexOf('}');
    
    if (startArr !== -1 && endArr !== -1 && (startObj === -1 || startArr < startObj)) {
      return JSON.parse(text.substring(startArr, endArr + 1));
    } else if (startObj !== -1 && endObj !== -1) {
      return JSON.parse(text.substring(startObj, endObj + 1));
    }
    throw new Error("Could not find valid JSON in response");
  }
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
    "suggestions": ["suggestion 1", "suggestion 2", ...]
  }

  Suggestions should be specific to the '${contentType}' category, focusing on commercial utility, technical precision, and high-end aesthetic standards.
  
  Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
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
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedContentType: { type: Type.STRING },
            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
            lighting: { type: Type.STRING },
            mood: { type: Type.STRING },
            artisticStyle: { type: Type.STRING },
            composition: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["detectedContentType", "colorPalette", "lighting", "mood", "artisticStyle", "composition", "suggestions"]
        },
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
      }
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini');
    
    return JSON.parse(text);
  } catch (error) {
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
    "suggestions": ["suggestion 1", "suggestion 2", ...]
  }

  Suggestions should be specific to the '${contentType}' category, focusing on commercial utility, technical precision, and high-end aesthetic standards.
  
  Respond strictly in ${settings.language === 'id' ? 'Indonesian' : 'English'}.`;

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: [{ text: promptText }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedContentType: { type: Type.STRING },
            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
            lighting: { type: Type.STRING },
            mood: { type: Type.STRING },
            artisticStyle: { type: Type.STRING },
            composition: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["detectedContentType", "colorPalette", "lighting", "mood", "artisticStyle", "composition", "suggestions"]
        },
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
      }
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini');
    
    return JSON.parse(text);
  } catch (error) {
    console.error("URL Aesthetic analysis failed:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
       throw new Error("Gagal memproses data estetika URL. Silakan coba lagi.");
    }
    throw new Error(handleGeminiError(error));
  }
}

export async function analyzePortfolioAesthetic(url: string, settings: AppSettings): Promise<string> {
  const ai = getAI(settings.apiKey);
  
  const promptText = `Analyze the creator portfolio at this URL: ${url}.
  Extract their 'Aesthetic DNA'. Identify their primary visual styles, recurring themes, color palettes, and technical strengths (e.g., minimalist vector illustrations, moody cinematic photography, etc.).
  Provide a concise, 2-3 paragraph summary of their unique creative identity. Focus on what makes their work distinct and what kind of commercial assets they are best suited to produce.`;

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3.1-pro-preview',
      contents: [{ text: promptText }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are an expert Creative Director and Art Critic. Analyze the provided portfolio URL and extract the creator's Aesthetic DNA.",
        thinkingConfig: (settings.model || 'gemini-3.1-pro-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
      }
    });

    return response.text || 'Unable to extract Aesthetic DNA from the provided URL.';
  } catch (error) {
    console.error("Portfolio analysis failed:", error);
    throw new Error(handleGeminiError(error));
  }
}

export async function analyzeKeyword(keyword: string, contentType: string, settings: AppSettings, referenceFile?: ReferenceFile, referenceUrl?: string) {
  const cacheKey = `${keyword}-${contentType}-${settings.language}`;
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

  let text = response.text;
  if (!text) throw new Error('No response from Gemini');
  
  text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
  
  try {
    const result = extractJSON(text);
    cacheService.set(cacheKey, result);
    return result;
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Failed to parse the response from the AI. Please try again.");
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

  const portfolioContext = settings.creatorProfile?.aestheticDNA ? `
  CREATOR AESTHETIC DNA:
  ${settings.creatorProfile.aestheticDNA}
  (CRITICAL EVALUATION CRITERIA: Evaluate how well the prompt aligns with this creator's specific Aesthetic DNA. Does it feel like something they would produce?)
  ` : '';

  for (const chunk of chunks) {
    const promptText = `Analyze the selected prompts and provide specific suggestions for improving their quality, focusing on technical details like lighting, composition, and resolution. Evaluate the quality of the following ${chunk.length} image generation prompts for Adobe Stock. 
    Target Asset Type: '${contentType}'
    Niche: '${categoryName}'
    ${buyerPersona ? `Buyer Persona: '${buyerPersona}'` : ''}
    ${visualTrends && visualTrends.length > 0 ? `Visual Trends: '${visualTrends.join(', ')}'` : ''}
    ${creativeAdvice ? `Creative Advice: '${creativeAdvice}'` : ''}

    ${portfolioContext}
    ${getContentTypeInstructions(contentType)}

    CRITICAL EVALUATION CRITERIA (Score 0-100 for each):
    1. Keyword Density: Are the keywords relevant and well-distributed? (Avoid stuffing, but ensure essential terms are present).
    2. Clarity: Is the prompt easy for an AI to understand? Is the subject clear?
    3. Specificity: Does it provide enough detail (lighting, composition, textures, resolution) to generate a high-quality, unique image?
    4. Adobe Stock Adherence: Does it follow commercial utility rules (copy space, diversity, authentic lifestyle) and AI compliance (no brands, no text)?
    5. Market Alignment: Does the prompt align with the Buyer Persona, Visual Trends, and Creative Advice provided for this niche?
    ${settings.creatorProfile?.aestheticDNA ? '6. Aesthetic DNA Alignment: Does the prompt strongly reflect the creator\'s established style, color grading, and visual identity?' : ''}

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
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              prompt: { type: Type.STRING },
              score: { type: Type.INTEGER },
              density: { type: Type.INTEGER },
              clarity: { type: Type.INTEGER },
              specificity: { type: Type.INTEGER },
              adherence: { type: Type.NUMBER },
              feedback: { type: Type.STRING },
              keywordFeedback: { type: Type.STRING },
              clarityFeedback: { type: Type.STRING },
              specificityFeedback: { type: Type.STRING },
              adherenceFeedback: { type: Type.STRING }
            },
            required: ["prompt", "score", "density", "clarity", "specificity", "adherence", "feedback", "keywordFeedback", "clarityFeedback", "specificityFeedback", "adherenceFeedback"]
          }
        },
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
      }
    });

    let text = response.text;
    if (!text) continue;
    
    try {
      const parsed = extractJSON(text);
      allScores = [...allScores, ...parsed];
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
  creativeAdvice?: string
) {
  const ai = getAI(settings.apiKey);
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'midjourney-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  const portfolioContext = settings.creatorProfile?.aestheticDNA ? `
  CREATOR AESTHETIC DNA:
  ${settings.creatorProfile.aestheticDNA}
  (CRITICAL: You MUST infuse these prompts with the creator's specific Aesthetic DNA. The lighting, composition, color palette, and overall vibe MUST strongly reflect their established style to ensure the generated assets fit seamlessly into their portfolio.)
  ` : '';

  // For large counts, use a combinatorial approach to avoid LLM output token limits and guarantee uniqueness
  if (count > 30) {
    const promptText = `Generate a rich set of prompt components for the niche '${categoryName}' based on the core keyword '${keyword}'. The target asset type is '${contentType}' and the target platform is '${template.name}'.
      
      ${getContentTypeInstructions(contentType)}

      CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for this niche. Ensure your generated components reflect REAL market demand and current design trends.

      ${portfolioContext}
      ${buyerPersona ? `TARGET BUYER PERSONA: ${buyerPersona}\n      Tailor the subjects, environments, and overall vibe to appeal directly to this specific audience and their commercial needs.` : ''}
      ${visualTrends && visualTrends.length > 0 ? `CURRENT VISUAL TRENDS: ${visualTrends.join(', ')}\n      Integrate these specific aesthetic trends into the lighting, color grading, and styling of the prompts.` : ''}
      ${creativeAdvice ? `STRATEGIC DIRECTIVE: ${creativeAdvice}\n      Ensure the prompts execute on this specific creative advice.` : ''}

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
      2. 30 specific and varied details/actions/camera angles. ${contentType === 'Video' ? 'Include Cinematography (Camera movement, Composition, Lens & focus) and Action.' : 'Include Action, Location/context, and Composition.'} You MUST rotate through diverse camera angles (e.g., low angle, high angle, bird's eye view, dutch angle, macro, wide shot, extreme close-up, eye level) and compositions (e.g., rule of thirds, leading lines, symmetry, minimalist, dynamic action, flat lay, top-down).
      3. 20 distinct and trending lighting styles based on current market analysis (e.g., "soft morning sunlight", "dramatic studio lighting", "neon cyberpunk glow", "chiaroscuro", "golden hour backlighting", "cinematic rim lighting").
      4. 15 mood/atmosphere descriptions (e.g., "energetic and focused", "calm and serene", "mysterious and dark"). ${contentType === 'Video' ? 'Include Soundstage details (Dialogue, SFX, Ambient noise).' : ''}
      5. 20 diverse artistic styles/mediums based on current visual trends (e.g., "photorealistic", "cinematic photography", "3D render", "flat vector illustration", "synthwave aesthetic", "minimalist line art", "hyper-detailed digital painting").
      6. 5 aspect ratios (e.g., "16:9", "4:3", "3:2", "1:1", "9:16")
      
      CRITICAL ADOBE STOCK RULES:
      - ALGORITHM OPTIMIZATION: To rank high and sell, concepts must have high commercial utility. Prioritize "authentic lifestyle", "diverse representation", "copy space", and "clean compositions".
      - KEYWORD WEAVING & DENSITY STRATEGY: To maximize search visibility without keyword stuffing, you MUST weave 5-8 high-value commercial synonyms and LSI (Latent Semantic Indexing) keywords naturally across the components (subject, details, lighting, mood, style). 
        - Do NOT repeat the exact same words. Use varied adjectives and nouns (e.g., instead of repeating "business", use "corporate, executive, professional, commercial, enterprise").
        - The combined final prompt should read as a natural, highly descriptive sentence that inherently contains a dense cluster of unique, searchable stock keywords.
      - NO SIMILAR CONTENT: The components must be vastly different from each other to avoid generating repetitive images. Adobe Stock rejects batches of similar images. 
        - VARIATION STRATEGY: Rotate through diverse camera angles (e.g., low angle, high angle, bird's eye view, dutch angle, macro, wide shot, extreme close-up, eye level) and compositions (e.g., rule of thirds, leading lines, symmetry, minimalist, dynamic action, flat lay, top-down).
      - NO TEXT/TYPOGRAPHY: Absolutely no text, words, letters, signatures, or watermarks should be mentioned or implied in the components. The output must be purely visual.
      - AESTHETIC DNA ALIGNMENT: You MUST ensure the generated components (especially lighting, mood, and style) align with the provided CREATOR AESTHETIC DNA. The components MUST be "tepat sasaran" based on their portfolio.
      - GENERATIVE AI COMPLIANCE: Absolutely NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands, NO recognizable characters, and NO real known restricted places/buildings. Use generic terms (e.g., "generic modern luxury car" instead of "Tesla").
      - QUALITY: Ensure descriptions naturally lead to high-quality outputs without deformed limbs or bad anatomy.
      ${contentType === 'Video' ? `- SPECIAL VIDEO INSTRUCTION: For this category, you MUST incorporate specific cinematic camera movements and techniques in the 'details/actions' section. Use terms like 'slow-motion tracking shot', 'dynamic drone footage', 'handheld camera effect', 'stabilized gimbal shot', 'crane shot', 'dolly zoom', and 'rack focus'.` : ''}
      - ${getVariationInstructions(settings.variationLevel)}
      - Ensure all components are perfectly suited for ${contentType} and optimized for the ${template.name} platform.
      
      Respond strictly with a JSON object following this schema:
      {
        "subjects": string[],
        "details": string[],
        "lightings": string[],
        "moods": string[],
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
        Respond ONLY with valid JSON.`,
        tools: [{ googleSearch: {} }],
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
      }
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    
    try {
      const components = extractJSON(text);
      const generatedPrompts = new Set<string>();
      const negativePrompt = settings.includeNegative ? ` ${settings.customNegativePrompt || '--no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy'}` : '';
      
      // Generate combinations, ensuring uniqueness
      let attempts = 0;
      const maxAttempts = count * 5;
      
      while (generatedPrompts.size < count && attempts < maxAttempts) {
        const subject = components.subjects[Math.floor(Math.random() * components.subjects.length)] || "subject";
        const detail = components.details[Math.floor(Math.random() * components.details.length)] || "detail";
        const lighting = components.lightings[Math.floor(Math.random() * components.lightings.length)] || "lighting";
        const mood = components.moods[Math.floor(Math.random() * components.moods.length)] || "mood";
        const style = components.styles[Math.floor(Math.random() * components.styles.length)] || "style";
        const aspect = components.aspects[Math.floor(Math.random() * components.aspects.length)] || "16:9";
        
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
      return Array.from(generatedPrompts);
    } catch (e) {
      console.error("Failed to parse JSON response:", text);
      throw new Error("Failed to parse the response from the AI. Please try again.");
    }
  }

  // Standard generation for smaller counts
  const promptTextSmall = `Generate exactly ${count} highly detailed, commercial-grade image generation prompts for the niche '${categoryName}' based on the core keyword '${keyword}'. The target asset type is '${contentType}' and the target platform is '${template.name}'.

${getContentTypeInstructions(contentType)}

CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for this niche. Ensure your generated prompts reflect REAL market demand and current design trends.

${portfolioContext}
${buyerPersona ? `TARGET BUYER PERSONA: ${buyerPersona}\nTailor the subjects, environments, and overall vibe to appeal directly to this specific audience and their commercial needs.` : ''}
${visualTrends && visualTrends.length > 0 ? `CURRENT VISUAL TRENDS: ${visualTrends.join(', ')}\nIntegrate these specific aesthetic trends into the lighting, color grading, and styling of the prompts.` : ''}
${creativeAdvice ? `STRATEGIC DIRECTIVE: ${creativeAdvice}\nEnsure the prompts execute on this specific creative advice.` : ''}

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
8. AESTHETIC DNA ALIGNMENT: You MUST ensure the generated prompts (especially lighting, composition, and color palette) align with the provided CREATOR AESTHETIC DNA. The prompts MUST be "tepat sasaran" based on their portfolio.
9. ${getVariationInstructions(settings.variationLevel)}
10. STRICT Template Alignment: You MUST strictly format each prompt using this exact template structure for ${template.name}:
"${template.template}"
Replace the bracketed placeholders (e.g., {subject}, {details}, {lighting}) with your generated content. Do not add conversational text.
11. FORMATTING: Each prompt MUST be a single, continuous line of text. Do not use line breaks, newlines, or paragraphs within a single prompt.

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
        ADOBE STOCK ALGORITHM: Focus on high-demand commercial utility and technical perfection.`,
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
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
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'midjourney-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  const portfolioContext = settings.creatorProfile?.aestheticDNA ? `
  CREATOR AESTHETIC DNA:
  ${settings.creatorProfile.aestheticDNA}
  (CRITICAL: You MUST infuse these prompts with the creator's specific Aesthetic DNA. The lighting, composition, color palette, and overall vibe MUST strongly reflect their established style to ensure the generated assets fit seamlessly into their portfolio.)
  ` : '';

  const promptText = `Generate exactly ${count} highly detailed, commercial-grade image generation prompts. The target asset type is '${contentType}' and the target platform is '${template.name}'.
  
  ${getContentTypeInstructions(contentType)}

  CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for this asset type. Ensure your generated prompts reflect REAL market demand and current design trends.

  ${portfolioContext}
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
  1. ALGORITHM OPTIMIZATION & Commercial Utility: Ensure concepts are highly usable for designers and agencies. You MUST include concepts with 'copy space', 'authentic lifestyle', 'diverse representation', 'modern aesthetics', or 'clean backgrounds' where appropriate.
  2. KEYWORD DENSITY & SEO: Weave 5-7 highly relevant, commercial keywords naturally into the descriptive flow of EACH prompt. 
     - DO NOT keyword stuff (e.g., do not just add a list of words at the end).
     - Instead, integrate them into the visual description (e.g., "A successful corporate business team collaborating in a modern sunlit office..."). 
     - Ensure the keywords accurately describe the visual elements so the AI generates them.
  3. Technical Precision: Specify lighting, camera angles, and aesthetic quality appropriate for the ${template.name} platform.
  4. NO SIMILAR CONTENT: Adobe Stock rejects batches of similar images. Each prompt MUST have a distinct composition, camera angle, subject, or core action. Avoid repetitive concepts.
     - VARIATION STRATEGY: Rotate through diverse camera angles (e.g., low angle, high angle, bird's eye view, dutch angle, macro, wide shot, extreme close-up, eye level) and compositions (e.g., rule of thirds, leading lines, symmetry, minimalist, dynamic action, flat lay, top-down).
  5. AESTHETIC DNA ALIGNMENT: You MUST ensure the generated prompts (especially lighting, composition, and color palette) align with the provided CREATOR AESTHETIC DNA. The prompts MUST be "tepat sasaran" based on their portfolio.
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
        tools: [{ googleSearch: {} }],
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
      }
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    
    const parsed = extractJSON(text);
    if (Array.isArray(parsed)) {
      return parsed.map(p => typeof p === 'string' ? p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : p);
    }
    return parsed;
  } catch (error) {
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
  
  const portfolioContext = settings.creatorProfile?.aestheticDNA ? `
  CREATOR AESTHETIC DNA:
  ${settings.creatorProfile.aestheticDNA}
  (CRITICAL: During optimization, you MUST align the technical and aesthetic modifiers with the creator's specific Aesthetic DNA. Ensure the upgraded prompts reflect their established style, color grading, and visual identity.)
  ` : '';

  // If the array is very large, we use a programmatic approach but with stricter preservation of original content
  if (prompts.length > 30) {
    const sample = prompts.slice(0, 10);
    
    const promptText = `Analyze these sample prompts: ${JSON.stringify(sample)}.
      
      We need to perform a "Technical Upgrade" on a large batch of similar prompts for Adobe Stock (${contentType}) specifically for the '${template.name}' platform.
      GOAL: Enhance the technical quality (lighting, camera, resolution) WITHOUT changing the core visual subject or scene of each prompt.
      
      ${getContentTypeInstructions(contentType)}

      CRITICAL: Use Google Search to research current technical standards, popular aesthetic modifiers, and high-demand commercial styles on Adobe Stock. Ensure your enhancements reflect REAL market demand and current professional photography/illustration trends.

      ${portfolioContext}
      ${keyword || categoryName ? `The niche context is: '${categoryName || keyword}'.` : ''}
      ${buyerPersona ? `TARGET BUYER PERSONA: ${buyerPersona}\n      Ensure the technical enhancements appeal directly to this specific audience.` : ''}
      ${visualTrends && visualTrends.length > 0 ? `CURRENT VISUAL TRENDS: ${visualTrends.join(', ')}\n      Integrate these specific aesthetic trends into the technical upgrade.` : ''}
      ${creativeAdvice ? `STRATEGIC DIRECTIVE: ${creativeAdvice}\n      Ensure the enhancements execute on this specific creative advice.` : ''}

      ${referenceUrl ? `CRITICAL REFERENCE URL INSTRUCTION: ${referenceUrl}
      You MUST use the Google Search tool to deeply analyze the visual style, topic, lighting, and keywords from this URL. 
      This URL is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for the technical upgrade.
      1. Identify the specific content type, niche, and CORE TOPIC of the asset in the URL.
      2. Use it as the absolute benchmark for style, lighting, camera settings, and overall aesthetic.
      3. ALIGNMENT: If the original prompts deviate significantly from the topic or style of this URL, you MUST adjust them to be "on target" with the URL's essence while maintaining the original intent where possible.
      
      ADOBE STOCK ALGORITHM: Ensure the technical upgrade maximizes commercial appeal (copy space, authentic lifestyle, technical perfection).` : ''}
      ${referenceFile ? `CRITICAL REFERENCE FILE INSTRUCTION: Analyze the provided reference file.
      This reference file is the PRIMARY SOURCE OF INSPIRATION and the MAIN IDEA for the technical upgrade.
      1. Extract the visual DNA: style, topic, lighting, and key visual elements.
      2. Use it as the absolute benchmark for technical quality and aesthetic alignment.
      3. ALIGNMENT: Adjust the prompts to precisely match the style, lighting, and thematic keywords found in this file.` : ''}

      Provide a comprehensive set of "Neural Enhancement Layers" for a high-complexity technical upgrade:
      1. 20 Elite Technical Modifiers: Focus on advanced optics, rendering technologies, and sensory details derived from the reference if provided.
      2. 20 Cinematic Lighting Arrays: Use complex physics-based lighting that matches the reference's atmosphere.
      3. 15 Masterpiece Quality Signatures: Use high-end industry terms that align with the reference's style.
      4. 15 Subject Alignment Modifiers: Thematic keywords and topic-specific descriptors that align the original subject with the reference's topic and keywords.
      
      CRITICAL RULES:
      - REFERENCE FIDELITY: If a reference is provided, it takes precedence as the "Main Idea". The modifiers must elevate the prompts to match the reference's elite standards and topic essence.
      - AESTHETIC DNA ALIGNMENT: You MUST ensure the generated modifiers (especially lighting and quality signatures) align with the provided CREATOR AESTHETIC DNA. The modifiers MUST be "tepat sasaran" based on their portfolio.
      - NO TEXT/TYPOGRAPHY: Ensure all modifiers avoid text, watermarks, or logos.
      - ADOBE STOCK COMPLIANCE: Use generic high-end terms instead of specific restricted brands.
      
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
            type: Type.OBJECT,
            properties: {
              technicals: { type: Type.ARRAY, items: { type: Type.STRING } },
              lightings: { type: Type.ARRAY, items: { type: Type.STRING } },
              qualities: { type: Type.ARRAY, items: { type: Type.STRING } },
              alignments: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["technicals", "lightings", "qualities", "alignments"]
          },
          thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
        }
      });

      let text = response.text;
      if (!text) throw new Error('No response from Gemini');
      
      const layers = extractJSON(text);
      const optimizedPrompts = new Set<string>();
      const negativePrompt = settings.includeNegative ? ` ${settings.customNegativePrompt || '--no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy'}` : '';
      
      for (const originalPrompt of prompts) {
        let cleanPrompt = originalPrompt.split('--no')[0].trim();
        
        // More intelligent splitting
        let parts = cleanPrompt.split(/[,.]/).map(p => p.trim()).filter(p => p.length > 0);
        
        // Extract the original subject (usually the first part)
        let coreSubject = parts[0] || "subject";
        // Combine the rest of the original details to preserve theme
        let originalDetails = parts.slice(1).join(', ');
        
        const technical = layers.technicals[Math.floor(Math.random() * layers.technicals.length)] || "high quality";
        const lighting = layers.lightings[Math.floor(Math.random() * layers.lightings.length)] || "professional lighting";
        const quality = layers.qualities[Math.floor(Math.random() * layers.qualities.length)] || "masterpiece";
        const alignment = layers.alignments[Math.floor(Math.random() * layers.alignments.length)] || "";
        
        // Reconstruct using the template but prioritizing original content and reference alignment
        let prompt = template.template
          .replace(/{subject}/g, `${coreSubject}${alignment ? `, ${alignment}` : ''}`)
          .replace(/{details}/g, originalDetails || "highly detailed")
          .replace(/{lighting}/g, lighting)
          .replace(/{mood}/g, quality)
          .replace(/{style}/g, technical)
          .replace(/{aspect}/g, "16:9");
          
        prompt += negativePrompt;
        prompt = prompt.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        optimizedPrompts.add(prompt);
      }
      return Array.from(optimizedPrompts);
    } catch (error) {
      console.error("Batch prompt optimization failed:", error);
      throw new Error(handleGeminiError(error));
    }
  }

  // Standard optimization for smaller arrays
  const promptTextSmall = `Optimize the following list of image generation prompts for Adobe Stock (${contentType}) specifically for the '${template.name}' platform.
  
  ${getContentTypeInstructions(contentType)}

  CRITICAL: Use Google Search to research current technical standards, popular aesthetic modifiers, and high-demand commercial styles on Adobe Stock. Ensure your enhancements reflect REAL market demand and current professional photography/illustration trends.

  ${portfolioContext}
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
  5. Aesthetic DNA Alignment: You MUST ensure the generated modifiers (especially lighting and quality signatures) align with the provided CREATOR AESTHETIC DNA. The modifiers MUST be "tepat sasaran" based on their portfolio.

Original Prompts:
${JSON.stringify(prompts)}

CRITICAL REQUIREMENTS:
1. ZERO SUBJECT DRIFT: Keep the subject and scene exactly as described.
2. NO TEXT/LOGOS: Strictly avoid any mention of text, typography, or watermarks.
3. ADOBE STOCK COMPLIANCE: Use generic high-end terms.
4. POWERFUL MODIFIERS: Use terms like "8K UHD", "hyper-detailed textures", "physically based rendering (PBR)", "ray-traced reflections", and "cinematic color grading".
5. STRICT Template Alignment: Format each prompt using this exact structure:
"${template.template}"
6. FORMATTING: Each prompt MUST be a single, continuous line of text. Do not use line breaks, newlines, or paragraphs within a single prompt.

Respond strictly with a JSON array of strings.
Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.
${settings.includeNegative ? 'Append a strong negative prompt at the end of each optimized prompt (e.g., "--no text, typography, words, letters, watermark, signature, blurry, logos, deformed, bad anatomy").' : ''}`;

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
        systemInstruction: `You are a Master Neural Prompt Architect. Your specialty is 'Hyper-Optimization'—injecting extreme technical complexity and descriptive power into existing prompts while maintaining absolute fidelity to the original subject and style. 
        CORE ENGINE: ${settings.model || 'gemini-3-flash-preview'}.
        SYNTHESIS BLUEPRINT: ${template.name}.
        ENTROPY LEVEL: ${getVariationInstructions(settings.variationLevel)}.
        ADOBE STOCK ALGORITHM: Use advanced optics, lighting physics, and digital rendering terminology to elevate prompts to 'Masterpiece' status for Adobe Stock.`,
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
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
    console.error("Prompt optimization failed:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
       throw new Error("Gagal memproses hasil optimasi. Silakan coba lagi.");
    }
    throw new Error(handleGeminiError(error));
  }
}

export async function generateAllPromptsBatch(
  keyword: string, 
  categories: any[], 
  totalCount: number, 
  settings: AppSettings, 
  contentType: string
): Promise<Map<string, string[]>> {
  const ai = getAI(settings.apiKey);
  const currentTemplateId = typeof settings.templateId === 'string' 
    ? settings.templateId 
    : (settings.templateId?.[contentType] || 'nanobanana-photo');
  const template = promptTemplates.find(t => t.id === currentTemplateId) || promptTemplates[0];
  
  const countPerCategory = Math.max(1, Math.floor(totalCount / categories.length));
  const itemsNeeded = Math.max(5, Math.ceil(Math.sqrt(countPerCategory) * 1.5));

  const portfolioContext = settings.creatorProfile?.aestheticDNA ? `
  CREATOR AESTHETIC DNA:
  ${settings.creatorProfile.aestheticDNA}
  (CRITICAL: You MUST infuse these batch prompts with the creator's specific Aesthetic DNA. Ensure the generated assets fit seamlessly into their portfolio. The prompts MUST be "tepat sasaran" based on their portfolio.)
  ` : '';

  const categoryNames = categories.map(c => c.categoryName).join("', '");
  const categoryDetails = categories.map(c => 
    `- Niche: ${c.categoryName}
      Buyer Persona: ${c.buyerPersona || 'N/A'}
      Visual Trends: ${c.visualTrends ? c.visualTrends.join(', ') : 'N/A'}
      Creative Advice: ${c.creativeAdvice || 'N/A'}`
  ).join('\n    ');

  try {
    const response = await ai.models.generateContent({
      model: settings.model || 'gemini-3-flash-preview',
      contents: `Generate rich prompt components for multiple niches based on the core keyword '${keyword}'. The target asset type is '${contentType}'.
      
      ${getContentTypeInstructions(contentType)}

      The niches and their market analysis are:
      ${categoryDetails}
      
      CRITICAL: Use Google Search to research current visual trends, popular aesthetics, and high-demand concepts on Adobe Stock for these niches. Ensure your generated components reflect REAL market demand and current design trends, specifically tailoring the subjects, environments, and overall vibe to appeal directly to the Buyer Persona and Creative Advice provided for each niche.

      ${portfolioContext}
      For EACH niche, provide:
      1. ${itemsNeeded} highly distinct subjects.
      2. ${itemsNeeded} specific and varied details/actions/camera angles. ${contentType === 'Video' ? 'Include Cinematography (Camera movement, Composition, Lens & focus) and Action.' : 'Include Action, Location/context, and Composition.'}
      3. ${itemsNeeded} distinct lighting styles.
      4. ${itemsNeeded} mood/atmosphere descriptions. ${contentType === 'Video' ? 'Include Soundstage details (Dialogue, SFX, Ambient noise).' : ''}
      5. ${itemsNeeded} artistic styles/mediums.
      6. 5 aspect ratios (e.g., "16:9", "4:3", "1:1").
      
      CRITICAL ADOBE STOCK RULES:
      - ALGORITHM OPTIMIZATION: To rank high and sell, components must lead to high commercial utility. Prioritize "authentic lifestyle", "diverse representation", "copy space", and "clean compositions".
      - KEYWORD WEAVING & DENSITY STRATEGY: To maximize search visibility without keyword stuffing, you MUST weave 5-8 high-value commercial synonyms and LSI (Latent Semantic Indexing) keywords naturally across the components (subject, details, lighting, mood, style). 
        - Do NOT repeat the exact same words. Use varied adjectives and nouns (e.g., instead of repeating "business", use "corporate, executive, professional, commercial, enterprise").
        - The combined final prompt should read as a natural, highly descriptive sentence that inherently contains a dense cluster of unique, searchable stock keywords.
      - NO SIMILAR CONTENT: Components must be vastly different to avoid rejection for similarity.
      - AESTHETIC DNA ALIGNMENT: You MUST ensure the generated components (especially lighting, mood, and style) align with the provided CREATOR AESTHETIC DNA. The components MUST be "tepat sasaran" based on their portfolio.
      - ${getVariationInstructions(settings.variationLevel)}
      - GENERATIVE AI COMPLIANCE: NO real people's names, NO trademarked/copyrighted elements, NO logos, NO specific brands.

      Respond strictly with a JSON object following this schema:
      {
        "categories": [
          {
            "categoryName": string,
            "subjects": string[],
            "details": string[],
            "lightings": string[],
            "moods": string[],
            "styles": string[],
            "aspects": string[]
          }
        ]
      }

      Language: ${settings.language === 'id' ? 'Indonesian' : 'English'}.`,
      config: {
        systemInstruction: `You are an elite AI Image Prompt Engineer and Top-Selling Adobe Stock Contributor. 
        CORE ENGINE: ${settings.model || 'gemini-3-flash-preview'}.
        SYNTHESIS BLUEPRINT: ${template.name}.
        ENTROPY LEVEL: ${getVariationInstructions(settings.variationLevel)}.
        ADOBE STOCK ALGORITHM: Use real-world data to inform your aesthetic choices. Respond ONLY with valid JSON.`,
        tools: [{ googleSearch: {} }],
        thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
      }
    });

    let text = response.text;
    if (!text) throw new Error('No response from Gemini');
    
    const data = extractJSON(text);
    const negativePrompt = settings.includeNegative ? ` ${settings.customNegativePrompt || '--no text, watermark, deformed, blurry, logos'}` : '';
    
    const resultsMap = new Map<string, string[]>();
    
    for (const catData of data.categories) {
      const generatedPrompts = new Set<string>();
      let attempts = 0;
      const maxAttempts = countPerCategory * 5;
      
      while (generatedPrompts.size < countPerCategory && attempts < maxAttempts) {
        const subject = catData.subjects[Math.floor(Math.random() * catData.subjects.length)] || "subject";
        const detail = catData.details[Math.floor(Math.random() * catData.details.length)] || "detail";
        const lighting = catData.lightings[Math.floor(Math.random() * catData.lightings.length)] || "lighting";
        const mood = catData.moods[Math.floor(Math.random() * catData.moods.length)] || "mood";
        const style = catData.styles[Math.floor(Math.random() * catData.styles.length)] || "style";
        const aspect = catData.aspects[Math.floor(Math.random() * catData.aspects.length)] || "16:9";
        
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
      resultsMap.set(catData.categoryName, Array.from(generatedPrompts));
    }
    
    return resultsMap;
  } catch (error) {
    console.error("Batch generation failed:", error);
    throw new Error(handleGeminiError(error));
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

  const portfolioContext = settings.creatorProfile?.aestheticDNA ? `
  CREATOR AESTHETIC DNA:
  ${settings.creatorProfile.aestheticDNA}
  (CRITICAL: When generating keywords, include relevant stylistic and thematic terms derived from the creator's Aesthetic DNA to ensure the metadata accurately reflects their unique style. The metadata MUST be "tepat sasaran" based on their portfolio.)
  ` : '';

  for (const chunk of chunks) {
    const promptText = `Generate highly optimized metadata for Adobe Stock for the following ${chunk.length} image generation prompts in the niche '${categoryName}'. The target asset type is '${contentType}'.
    
    ${getContentTypeInstructions(contentType)}

CRITICAL ADOBE STOCK SEO ALGORITHM RULES:
1. TITLE: Write a natural, descriptive title (5-10 words, max 200 chars). Include the main subject, action, and setting. Do not keyword stuff the title. Must be in English.
2. KEYWORDS: Provide exactly 40-50 highly relevant keywords. Must be in English.
3. KEYWORD ORDER IS CRITICAL: The Adobe Stock search algorithm heavily weighs the FIRST 10 KEYWORDS. Place the most accurate, descriptive, and important keywords at the very beginning of the array.
4. KEYWORD TYPES: Include who, what, where, action, mood, and technical concepts (e.g., 'copy space', 'background', 'authentic').
5. COMPLIANCE: NO trademarks, NO brand names, NO camera brands (like Nikon, Sony). No spammy words.

${portfolioContext}

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
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "keywords"]
            }
          },
          thinkingConfig: (settings.model || 'gemini-3-flash-preview').startsWith('gemini-3') ? { thinkingLevel: ThinkingLevel.LOW } : undefined
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
