import { generateAllPromptsBatch } from '../services/gemini';

self.onmessage = async (e) => {
  const { type, payload } = e.data;
  if (type === 'START_BATCH') {
    const { keyword, results, count, settings, contentType, referenceUrl } = payload;
    
    try {
      const { promptsMap, groundingSources } = await generateAllPromptsBatch(
        keyword,
        results,
        count,
        settings,
        contentType,
        referenceUrl,
        (progress) => {
          self.postMessage({ type: 'PROGRESS', payload: progress });
        }
      );
      self.postMessage({ type: 'COMPLETE', payload: { promptsMap, groundingSources } });
    } catch (error) {
      self.postMessage({ type: 'ERROR', payload: error instanceof Error ? error.message : String(error) });
    }
  }
};
