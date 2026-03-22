import { FeatureFlag } from '../types';

const STORAGE_KEY = 'app_feature_flags';

export const featureFlagService = {
  getFlags: async (): Promise<FeatureFlag[]> => {
    try {
      const response = await fetch('/api/feature-flags');
      if (!response.ok) throw new Error('Failed to fetch flags');
      const flags = await response.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
      return flags;
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  },

  isEnabled: (flags: FeatureFlag[], flagId: string): boolean => {
    const flag = flags.find(f => f.id === flagId);
    if (!flag || !flag.isEnabled) return false;

    // Rollout logic based on user ID or random seed
    let userId = localStorage.getItem('app_user_id');
    if (!userId) {
      userId = Math.random().toString(36).substring(7);
      localStorage.setItem('app_user_id', userId);
    }

    // Simple deterministic hash of userId + flagId
    const hash = Array.from(userId + flagId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rolloutValue = hash % 100;

    return rolloutValue < flag.rolloutPercentage;
  }
};
