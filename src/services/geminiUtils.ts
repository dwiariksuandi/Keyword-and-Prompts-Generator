import { GoogleGenAI } from '@google/genai';
import { AgentTask } from '../types';

export const getAI = (apiKey?: string) => {
  const envApiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const finalApiKey = apiKey?.trim() || envApiKey || '';
  
  if (!finalApiKey) {
    throw new Error("API key is missing. Please enter your Gemini API key in the settings.");
  }
  
  return new GoogleGenAI({ apiKey: finalApiKey });
};

export function handleGeminiError(error: any): string {
  const errorString = error instanceof Error ? error.message : String(error);
  
  const errorMap: Record<string, string> = {
    'urls to lookup exceeds the limit': "⚠️ Terlalu Banyak URL (Error 400)\n\nPenyebab: Permintaan mengandung terlalu banyak URL untuk dianalisis (maksimal 20).\n\nSolusi: Kurangi jumlah URL dalam prompt atau gunakan satu URL referensi saja.",
    '429': "⚠️ Batas Penggunaan Terlampaui (Error 429)\n\nPenyebab:\n1. Limit Per Menit: Akun gratis dibatasi 15 request/menit.\n2. Kuota Harian: Anda mungkin telah mencapai batas harian Google.\n\nSolusi:\n• Tunggu 1-2 menit sebelum mencoba lagi.\n• Jika tetap gagal, gunakan API Key dari Project Google Cloud yang berbeda.",
    'RESOURCE_EXHAUSTED': "⚠️ Batas Penggunaan Terlampaui (Error 429)\n\nPenyebab:\n1. Limit Per Menit: Akun gratis dibatasi 15 request/menit.\n2. Kuota Harian: Anda mungkin telah mencapai batas harian Google.\n\nSolusi:\n• Tunggu 1-2 menit sebelum mencoba lagi.\n• Jika tetap gagal, gunakan API Key dari Project Google Cloud yang berbeda.",
    '401': "❌ API Key Tidak Valid (Error 401)\n\nPenyebab:\n• API Key salah atau tidak memiliki izin.\n• API Key telah dihapus atau dinonaktifkan di Google AI Studio.\n\nSolusi:\n• Periksa kembali API Key Anda.\n• Pastikan API Key berasal dari 'Google AI Studio'.",
    'API_KEY_INVALID': "❌ API Key Tidak Valid (Error 401)\n\nPenyebab:\n• API Key salah atau tidak memiliki izin.\n• API Key telah dihapus atau dinonaktifkan di Google AI Studio.\n\nSolusi:\n• Periksa kembali API Key Anda.\n• Pastikan API Key berasal dari 'Google AI Studio'.",
    '403': "🚫 Akses Ditolak (Error 403)\n\nPenyebab:\n• API Key tidak memiliki izin untuk mengakses model ini.\n• Project Google Cloud Anda mungkin memiliki batasan wilayah.\n\nSolusi:\n• Pastikan Generative Language API sudah diaktifkan di Google Cloud Console.\n• Coba buat API Key baru di project yang berbeda.",
    'PERMISSION_DENIED': "🚫 Akses Ditolak (Error 403)\n\nPenyebab:\n• API Key tidak memiliki izin untuk mengakses model ini.\n• Project Google Cloud Anda mungkin memiliki batasan wilayah.\n\nSolusi:\n• Pastikan Generative Language API sudah diaktifkan di Google Cloud Console.\n• Coba buat API Key baru di project yang berbeda.",
    '404': "🔍 Model Tidak Ditemukan (Error 404)\n\nPenyebab:\n• Nama model yang dipilih tidak tersedia atau salah.\n\nSolusi:\n• Coba ganti model ke 'gemini-3-flash-preview' di Pengaturan.",
    'NOT_FOUND': "🔍 Model Tidak Ditemukan (Error 404)\n\nPenyebab:\n• Nama model yang dipilih tidak tersedia atau salah.\n\nSolusi:\n• Coba ganti model ke 'gemini-3-flash-preview' di Pengaturan.",
    'SAFETY': "🛡️ Konten Diblokir (Safety Filter)\n\nPenyebab:\n• AI mendeteksi konten yang melanggar kebijakan keamanan.\n\nSolusi:\n• Ubah kata kunci atau deskripsi Anda agar lebih umum."
  };

  for (const [key, message] of Object.entries(errorMap)) {
    if (errorString.includes(key)) {
      return message;
    }
  }

  return `⚠️ Terjadi Kesalahan Tak Terduga\n\nDetail: ${errorString.substring(0, 200)}`;
}

export async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const ai = getAI(apiKey);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ text: 'Say "ok"' }]
    });
    return { isValid: !!response.text };
  } catch (e) {
    console.error("API Key validation failed:", e);
    return { 
      isValid: false, 
      error: handleGeminiError(e)
    };
  }
}

export async function generateContentWithFallback(ai: any, params: any) {
  try {
    return await ai.models.generateContent(params);
  } catch (e) {
    console.warn("Primary model failed, falling back to flash:", e);
    return await ai.models.generateContent({
      ...params,
      model: 'gemini-3-flash-preview'
    });
  }
}

export function zodToJsonSchemaNoSchema(schema: any) {
  // Simple wrapper for zod-to-json-schema if needed, 
  // but for Gemini responseSchema we often just need the raw object
  return schema; 
}

export function extractJSON(text: string) {
  try {
    // Clean up markdown if present
    const cleaned = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    return JSON.parse(cleaned);
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
      - Design your lighting: Specify Studio setups (e.g., "three-point softbox setup") or Dramatic effects.
      - Choose camera, lens, and focus: Dictate hardware (e.g., "50mm lens, f/1.8").`;
    case 'Illustration':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on sophisticated illustrative techniques: complex brushwork, layered textures, intricate line art.`;
    case 'Vector':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on high-end vector aesthetics: perfect geometric precision, clean SVG-compliant paths.`;
    case 'Background':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on atmospheric and textural depth: multi-layered bokeh, expansive copy space.`;
    case 'Video':
      return `VEO 3.1 PROMPTING FRAMEWORK:
      Formula: [Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]
      - Cinematography: Define camera movement (Dolly shot, tracking shot, crane shot, aerial view).`;
    case '3D Render':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on state-of-the-art rendering: Unreal Engine 5.4 Path Tracing, OctaneRender.`;
    case 'AI Art & Creativity':
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]
      - Focus on boundary-pushing conceptualism: generative patterns, fluid organic forms.`;
    default:
      return `NANO BANANA PROMPTING FRAMEWORK:
      Formula: [Subject] + [Action] + [Location/context] + [Composition] + [Style]`;
  }
}

export function getVariationInstructions(level: 'Low' | 'Medium' | 'High'): string {
  switch (level) {
    case 'Low':
      return "VARIATION LEVEL: LOW. Focus on a highly cohesive set of prompts that explore a specific, narrow theme.";
    case 'High':
      return "VARIATION LEVEL: HIGH. MAXIMUM CREATIVE DIVERSITY REQUIRED. Each prompt must explore a radically different concept.";
    default:
      return "VARIATION LEVEL: MEDIUM. Standard professional variation.";
  }
}
