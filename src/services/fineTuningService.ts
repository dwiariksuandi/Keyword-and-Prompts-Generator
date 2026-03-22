import { CategoryResult } from '../types';

export interface FineTuningData {
  input: string;
  output: string;
}

export function validatePrompt(prompt: string): boolean {
  if (!prompt || prompt.length < 10 || prompt.length > 2000) return false;
  
  const invalidPatterns = [/insert prompt here/i, /enter prompt/i, /placeholder/i];
  for (const pattern of invalidPatterns) {
    if (pattern.test(prompt)) return false;
  }
  
  return true;
}

export function transformToJSONL(results: CategoryResult[]): string {
  const data: FineTuningData[] = [];

  results.forEach(category => {
    if (category.promptScores) {
      category.promptScores.forEach((score) => {
        const promptToValidate = score.optimizedPrompt || score.prompt;
        
        // Only include high-rated prompts (e.g., rating >= 4) and valid prompts
        if (score.rating && score.rating >= 4 && validatePrompt(promptToValidate)) {
          data.push({
            input: `Generate a prompt for category: ${category.categoryName} and content type: ${category.contentType}`,
            output: promptToValidate
          });
        }
      });
    }
  });

  return data.map(entry => JSON.stringify(entry)).join('\n');
}
