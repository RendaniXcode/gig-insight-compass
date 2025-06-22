
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
  SESSION_CORRUPTED: 'SESSION_CORRUPTED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR'
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
    // Handle fetch/network errors
    if (error.message.includes('fetch')) {
      return {
        code: ERROR_CODES.NETWORK_ERROR,
        message: 'Network connection failed. Please check your internet connection.',
        context
      };
    }
    
    // Handle HTTP errors
    if (error.message.includes('HTTP error')) {
      const statusMatch = error.message.match(/status: (\d+)/);
      const status = statusMatch ? parseInt(statusMatch[1]) : 0;
      
      if (status >= 500) {
        return {
          code: ERROR_CODES.SERVER_ERROR,
          message: 'Server error. Please try again later.',
          context: { ...context, status }
        };
      }
      
      if (status === 401 || status === 403) {
        return {
          code: ERROR_CODES.AUTHENTICATION_ERROR,
          message: 'Authentication failed. Please check your credentials.',
          context: { ...context, status }
        };
      }
      
      return {
        code: ERROR_CODES.API_ERROR,
        message: `API error (${status}). Please try again.`,
        context: { ...context, status }
      };
    }
    
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

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof Error && (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('NetworkError')
  );
};

export const getErrorMessage = (error: unknown): string => {
  const errorInfo = handleError(error);
  return errorInfo.message;
};
