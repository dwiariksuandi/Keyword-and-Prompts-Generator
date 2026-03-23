import { getEmbedding, cosineSimilarity } from './vectorService';

interface VectorEntry {
  analysis: any;
  embedding: number[];
}

const vectorStore: VectorEntry[] = [];

export const vectorStoreService = {
  add: async (analysis: any, apiKey: string) => {
    const textToEmbed = JSON.stringify(analysis);
    const embedding = await getEmbedding(textToEmbed, apiKey);
    vectorStore.push({ analysis, embedding });
  },
  
  findSimilar: async (query: string, apiKey: string, limit = 3) => {
    const queryEmbedding = await getEmbedding(query, apiKey);
    return vectorStore
      .map(entry => ({
        analysis: entry.analysis,
        similarity: cosineSimilarity(queryEmbedding, entry.embedding)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
};
