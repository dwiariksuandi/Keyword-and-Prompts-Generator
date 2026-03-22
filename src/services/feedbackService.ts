import { PromptFeedback } from '../types';

const FEEDBACK_KEY = 'prompt_feedback_v1';

export const feedbackService = {
  saveFeedback: (feedback: Omit<PromptFeedback, 'id' | 'timestamp'>) => {
    const currentFeedback = feedbackService.getAllFeedback();
    const newFeedback: PromptFeedback = {
      ...feedback,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    
    // If prompt already exists, update it (e.g., increment selection count or update rating)
    const existingIndex = currentFeedback.findIndex(f => f.prompt === feedback.prompt);
    if (existingIndex > -1) {
      currentFeedback[existingIndex] = {
        ...currentFeedback[existingIndex],
        rating: (currentFeedback[existingIndex].rating + feedback.rating) / 2, // Simple average
        selectionCount: currentFeedback[existingIndex].selectionCount + feedback.selectionCount,
        timestamp: new Date().toISOString()
      };
    } else {
      currentFeedback.push(newFeedback);
    }
    
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(currentFeedback));
  },

  getAllFeedback: (): PromptFeedback[] => {
    const stored = localStorage.getItem(FEEDBACK_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse feedback', e);
      return [];
    }
  },

  getSuccessfulFeedback: (minRating = 4): PromptFeedback[] => {
    return feedbackService.getAllFeedback().filter(f => f.rating >= minRating);
  },

  clearFeedback: () => {
    localStorage.removeItem(FEEDBACK_KEY);
  }
};
