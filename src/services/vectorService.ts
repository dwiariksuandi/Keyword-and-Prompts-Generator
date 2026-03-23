import { getAI } from './gemini';

export async function getEmbedding(text: string | string[], apiKey: string): Promise<number[][]> {
  const ai = getAI(apiKey);
  const result = await ai.models.embedContent({
    model: 'gemini-embedding-2-preview',
    contents: Array.isArray(text) ? text : [text],
  });
  return result.embeddings.map(e => e.values);
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
