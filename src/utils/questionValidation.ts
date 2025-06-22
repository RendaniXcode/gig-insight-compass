
import { Question } from "../types/survey";
import { SURVEY_QUESTIONS } from "../data/questions";

// Schema validation for questions
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const VALID_QUESTION_TYPES = ['text', 'textarea', 'number', 'date', 'multiple_choice', 'yes_no'] as const;
const REQUIRED_FIELDS = ['id', 'question', 'category', 'categoryCode', 'type'] as const;

export const validateQuestion = (question: Question): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  REQUIRED_FIELDS.forEach(field => {
    if (!question[field] || (typeof question[field] === 'string' && question[field].trim() === '')) {
      errors.push(`Question ${question.id || 'unknown'}: Missing required field '${field}'`);
    }
  });

  // Validate question type
  if (question.type && !VALID_QUESTION_TYPES.includes(question.type as any)) {
    errors.push(`Question ${question.id}: Invalid question type '${question.type}'`);
  }

  // Validate multiple choice questions
  if (question.type === 'multiple_choice') {
    if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
      errors.push(`Question ${question.id}: Multiple choice questions must have options array`);
    } else {
      const emptyOptions = question.options.filter(opt => !opt || opt.trim() === '');
      if (emptyOptions.length > 0) {
        warnings.push(`Question ${question.id}: Contains empty options`);
      }
    }
  }

  // Validate follow-up questions
  if (question.followUpTo) {
    const parentQuestion = SURVEY_QUESTIONS.find(q => q.id === question.followUpTo);
    if (!parentQuestion) {
      errors.push(`Question ${question.id}: Follow-up parent question '${question.followUpTo}' not found`);
    }
  }

  // Validate ID format
  if (question.id && !/^[A-Z]+_\d+[a-z]*$/.test(question.id)) {
    warnings.push(`Question ${question.id}: ID doesn't follow expected format (CATEGORY_NUMBER[letter])`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateAllQuestions = (): ValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const questionIds = new Set<string>();

  SURVEY_QUESTIONS.forEach(question => {
    const result = validateQuestion(question);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);

    // Check for duplicate IDs
    if (questionIds.has(question.id)) {
      allErrors.push(`Duplicate question ID found: ${question.id}`);
    } else {
      questionIds.add(question.id);
    }
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};

// Runtime validation on module load
const validationResult = validateAllQuestions();
if (!validationResult.isValid) {
  console.error('Question validation failed:', validationResult.errors);
  console.warn('Question validation warnings:', validationResult.warnings);
}

export const getValidationResult = () => validationResult;
