
export class SurveyError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'SurveyError';
  }
}

export const ERROR_CODES = {
  QUESTION_NOT_FOUND: 'QUESTION_NOT_FOUND',
  INVALID_ANSWER: 'INVALID_ANSWER',
  SAVE_FAILED: 'SAVE_FAILED',
  LOAD_FAILED: 'LOAD_FAILED',
  NAVIGATION_ERROR: 'NAVIGATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SESSION_CORRUPTED: 'SESSION_CORRUPTED'
} as const;

export const handleError = (error: unknown, context?: Record<string, any>) => {
  console.error('Survey Error:', error, context);
  
  if (error instanceof SurveyError) {
    return {
      code: error.code,
      message: error.message,
      context: { ...error.context, ...context }
    };
  }
  
  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      context
    };
  }
  
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    context
  };
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => R,
  errorContext?: Record<string, any>
) => {
  return (...args: T): R | null => {
    try {
      return fn(...args);
    } catch (error) {
      const errorInfo = handleError(error, errorContext);
      console.error('Function execution failed:', errorInfo);
      return null;
    }
  };
};

export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

export const validateSessionData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  const requiredFields = ['id', 'interviewer', 'responses', 'completedCategories'];
  return requiredFields.every(field => field in data);
};
