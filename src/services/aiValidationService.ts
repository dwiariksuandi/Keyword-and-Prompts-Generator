import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function validatePromptAI(prompt: string): Promise<{ isValid: boolean; score: number; reason: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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

    const result = JSON.parse(response.text || "{}");
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
