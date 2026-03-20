export class AppError extends Error {
  constructor(public message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleAppError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
}
