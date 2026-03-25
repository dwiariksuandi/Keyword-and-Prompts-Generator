import { GoogleGenAI, Type } from "@google/genai";
import { PROMPT_TEMPLATES } from "../constants/promptTemplates";
import { generateContentWithRetryAndFallback } from "./gemini";

const envApiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : (import.meta as any).env?.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: envApiKey || "" });

/**
 * Mengekstrak variabel dari input pengguna menggunakan Gemini.
 */
async function extractPromptVariables(userPrompt: string) {
  const response = await generateContentWithRetryAndFallback(ai, {
    model: "gemini-3.1-flash-lite-preview",
    contents: `Ekstrak komponen berikut dari prompt pengguna: "${userPrompt}". Jika tidak ada, isi dengan string kosong.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          Subject: { type: Type.STRING },
          Action: { type: Type.STRING },
          Location: { type: Type.STRING },
          Composition: { type: Type.STRING },
          Style: { type: Type.STRING },
        },
        required: ["Subject", "Action", "Location", "Composition", "Style"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

/**
 * Mengisi template dengan variabel yang diekstrak.
 */
function fillTemplate(template: string, vars: any) {
  return template
    .replace("[Subject]", vars.Subject || "a subject")
    .replace("[Action]", vars.Action || "doing something")
    .replace("[Location/context]", vars.Location || "in a generic environment")
    .replace("[Composition]", vars.Composition || "wide shot")
    .replace("[Style]", vars.Style || "cinematic");
}

export async function generateImage(userPrompt: string, templateId: string = 'nanobanana-photo') {
  const vars = await extractPromptVariables(userPrompt);
  const templateObj = PROMPT_TEMPLATES.find(t => t.id === templateId) || PROMPT_TEMPLATES[0];
  const enrichedPrompt = fillTemplate(templateObj.template, vars);
  
  const response = await generateContentWithRetryAndFallback(ai, {
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts: [{ text: enrichedPrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Gagal menghasilkan gambar");
}
