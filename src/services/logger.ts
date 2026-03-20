export interface LogEntry {
  timestamp: string;
  functionName: string;
  input: any;
  output: any;
  status: 'success' | 'error' | 'validation_failed';
  latencyMs: number;
  error?: string;
}

export const logger = {
  log: (entry: LogEntry) => {
    console.log(`[LLM_OBSERVABILITY] ${JSON.stringify(entry)}`);
    // In a real production app, you would send this to Firestore or a logging service
  }
};
