import { GoogleGenAI } from '@google/genai';

import { GoogleGenAI } from '@google/genai';

export const getAI = (apiKey?: string) => {
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
      if ('status' in error) errorCode = (error as any).status;
      if ('statusCode' in error) errorCode = (error as any).statusCode;
      
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
  
  if (errorString.includes('urls to lookup exceeds the limit') || errorString.includes('21 > 20')) {
    return "⚠️ Terlalu Banyak URL (Error 400)\n\n" +
           "Penyebab: Permintaan mengandung terlalu banyak URL untuk dianalisis (maksimal 20).\n\n" +
           "Solusi: Kurangi jumlah URL dalam prompt atau gunakan satu URL referensi saja.";
  }

  if (errorCode === 429 || errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('quota')) {
    return "⚠️ Batas Penggunaan Terlampaui (Error 429)\n\n" +
           "Penyebab:\n" +
           "1. Limit Per Menit: Akun gratis dibatasi 15 request/menit.\n" +
           "2. Kuota Harian: Anda mungkin telah mencapai batas harian Google.\n\n" +
           "Solusi:\n" +
           "• Tunggu 1-2 menit sebelum mencoba lagi.\n" +
           "• Jika tetap gagal, gunakan API Key dari Project Google Cloud yang berbeda.";
  }
  
  if (errorCode === 401 || errorString.includes('401') || errorString.includes('API_KEY_INVALID')) {
    return "❌ API Key Tidak Valid (Error 401)\n\n" +
           "Penyebab:\n" +
           "• API Key salah atau tidak memiliki izin.\n" +
           "• API Key telah dihapus atau dinonaktifkan di Google AI Studio.\n\n" +
           "Solusi:\n" +
           "• Periksa kembali API Key Anda.\n" +
           "• Pastikan API Key berasal dari 'Google AI Studio'.";
  }

  if (errorCode === 400 || errorString.includes('400')) {
    if (errorString.includes('API key not valid') || errorString.includes('invalid API key')) {
      return "❌ API Key Tidak Valid (Error 400)\n\n" +
             "Penyebab:\n" +
             "• API Key salah ketik atau ada spasi tambahan.\n\n" +
             "Solusi:\n" +
             "• Periksa kembali API Key Anda.";
    }
    return `⚠️ Permintaan Tidak Valid (Error 400)\n\nDetail: ${errorString.substring(0, 300)}`;
  }

  if (errorCode === 403 || errorString.includes('403') || errorString.includes('PERMISSION_DENIED')) {
    return "🚫 Akses Ditolak (Error 403)\n\n" +
           "Penyebab:\n" +
           "• API Key tidak memiliki izin untuk mengakses model ini.\n" +
           "• Project Google Cloud Anda mungkin memiliki batasan wilayah.\n\n" +
           "Solusi:\n" +
           "• Pastikan Generative Language API sudah diaktifkan di Google Cloud Console.\n" +
           "• Coba buat API Key baru di project yang berbeda.";
  }

  if (errorString.includes('404') || errorString.includes('NOT_FOUND')) {
    return "🔍 Model Tidak Ditemukan (Error 404)\n\n" +
           "Penyebab:\n" +
           "• Nama model yang dipilih tidak tersedia atau salah.\n\n" +
           "Solusi:\n" +
           "• Coba ganti model ke 'gemini-3-flash-preview' di Pengaturan.";
  }

  if (errorString.includes('SAFETY') || errorString.includes('blocked')) {
    return "🛡️ Konten Diblokir (Safety Filter)\n\n" +
           "Penyebab:\n" +
           "• AI mendeteksi konten yang melanggar kebijakan keamanan (misal: konten dewasa, kekerasan, atau hak cipta).\n\n" +
           "Solusi:\n" +
           "• Ubah kata kunci atau deskripsi Anda agar lebih umum dan tidak melanggar kebijakan.";
  }

  if (errorString.includes('500') || errorString.includes('503') || errorString.includes('INTERNAL') || errorString.includes('SERVICE_UNAVAILABLE')) {
    return "☁️ Masalah Server Google (Error 500/503)\n\n" +
           "Penyebab:\n" +
           "• Server Google sedang sibuk atau mengalami gangguan teknis.\n\n" +
           "Solusi:\n" +
           "• Tunggu beberapa saat dan coba lagi. Ini biasanya bersifat sementara.";
  }

  return `⚠️ Terjadi Kesalahan Tak Terduga\n\nDetail: ${errorString.substring(0, 200)}${errorString.length > 200 ? '...' : ''}\n\nSaran: Coba muat ulang halaman atau periksa koneksi internet Anda.`;
}

export function extractJSON(text: string) {
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

export function getContentTypeInstructions(contentType: string): string {
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

export function getVariationInstructions(level: 'Low' | 'Medium' | 'High'): string {
  switch (level) {
    case 'Low':
      return "VARIATION LEVEL: LOW. Focus on a highly cohesive set of prompts that explore a specific, narrow theme with subtle variations in lighting or angle. The resulting images should look like they belong to the same specific photoshoot or series. Ideal for creating consistent character sets or product variations.";
    case 'High':
      return "VARIATION LEVEL: HIGH. MAXIMUM CREATIVE DIVERSITY REQUIRED. Each prompt must explore a radically different concept, environment, lighting setup, and composition within the niche. Force the AI to use diverse subjects, unexpected angles, and contrasting moods. This is CRITICAL for large batches to avoid 'similar content' rejection by Adobe Stock. No two prompts should share more than 20% of their descriptive DNA.";
    default:
      return "VARIATION LEVEL: MEDIUM. Standard professional variation. Ensure a balanced mix of different subjects, camera angles, and lighting styles while maintaining relevance to the core theme. Provides enough variety for a standard stock submission.";
  }
}
