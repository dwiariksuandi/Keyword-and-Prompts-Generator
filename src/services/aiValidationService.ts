import { Type } from "@google/genai";
import { getAI, extractJSON } from "./gemini";

export async function validatePromptAI(prompt: string, apiKey: string): Promise<{ isValid: boolean; score: number; reason: string }> {
  try {
    const ai = getAI(apiKey);
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: `Evaluate the following prompt for quality, clarity, and safety. Return a JSON object with isValid (boolean), score (0-10), and reason (string).
      Prompt: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            score: { type: Type.NUMBER },
            reason: { type: Type.STRING },
          },
          required: ["isValid", "score", "reason"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const result = extractJSON(text);
    return {
      isValid: result.isValid ?? false,
      score: result.score ?? 0,
      reason: result.reason ?? "No reason provided",
    };
  } catch (error) {
    console.error("AI Validation error:", error);
    return { isValid: false, score: 0, reason: "Validation service unavailable" };
  }
}
