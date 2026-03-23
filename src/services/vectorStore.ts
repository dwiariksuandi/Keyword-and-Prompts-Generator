import { getEmbedding, cosineSimilarity } from './vectorService';
import { AestheticAnalysis } from '../types';

interface VectorEntry {
  analysis: any;
  embedding: number[];
}

const vectorStore: VectorEntry[] = [];

export const vectorStoreService = {
  add: async (analysis: any, apiKey: string) => {
    const textToEmbed = JSON.stringify(analysis);
    const embeddings = await getEmbedding(textToEmbed, apiKey);
    const embedding = embeddings[0];
    if (embedding) {
      vectorStore.push({ analysis, embedding });
    }
  },
  
  findSimilar: async (query: string, apiKey: string, limit = 3) => {
    const queryEmbeddings = await getEmbedding(query, apiKey);
    const queryEmbedding = queryEmbeddings[0];
    if (!queryEmbedding) return [];
    
    return vectorStore
      .map(entry => ({
        analysis: entry.analysis,
        similarity: cosineSimilarity(queryEmbedding, entry.embedding)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
};
