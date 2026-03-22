import { ABTestConfig, ABTestVariant } from '../types';

const STORAGE_KEY = 'app_ab_tests';

export const abTestingService = {
  getAssignments: (): Record<string, ABTestVariant> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    try {
      return JSON.parse(stored);
    } catch (e) {
      return {};
    }
  },

  getVariant: (testId: string, defaultVariant: ABTestVariant = 'A'): ABTestVariant => {
    const assignments = abTestingService.getAssignments();
    if (assignments[testId]) return assignments[testId];
    
    // Assign randomly if not set
    const variant: ABTestVariant = Math.random() > 0.5 ? 'B' : 'A';
    abTestingService.setVariant(testId, variant);
    return variant;
  },

  setVariant: (testId: string, variant: ABTestVariant) => {
    const assignments = abTestingService.getAssignments();
    assignments[testId] = variant;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  },

  trackEvent: (testId: string, variant: ABTestVariant, event: string, metadata?: any) => {
    console.log(`[A/B Test] ${testId} (${variant}) - Event: ${event}`, metadata);
    
    const logEntry = {
      testId,
      variant,
      event,
      metadata,
      timestamp: new Date().toISOString()
    };

    // Send to backend analytics
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry)
    }).catch(err => console.error('Failed to send analytics:', err));

    // Keep local logs for debug overlay
    const logs = JSON.parse(localStorage.getItem('ab_test_logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('ab_test_logs', JSON.stringify(logs.slice(-100))); // Keep last 100
  },

  getLogs: () => {
    return JSON.parse(localStorage.getItem('ab_test_logs') || '[]');
  },

  clearLogs: () => {
    localStorage.removeItem('ab_test_logs');
  }
};
