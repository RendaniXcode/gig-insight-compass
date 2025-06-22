
import { describe, it, expect } from 'vitest';
import { validateQuestion, validateAllQuestions } from '../questionValidation';
import { Question } from '../../types/survey';

describe('Question Validation', () => {
  describe('validateQuestion', () => {
    it('should validate a correct question', () => {
      const question: Question = {
        id: 'TEST_01',
        question: 'Test question?',
        category: 'Test Category',
        categoryCode: 'TEST',
        type: 'text'
      };

      const result = validateQuestion(question);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should catch missing required fields', () => {
      const question = {
        id: 'TEST_01',
        question: '',
        category: 'Test Category',
        categoryCode: 'TEST',
        type: 'text'
      } as Question;

      const result = validateQuestion(question);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('question'))).toBe(true);
    });

    it('should validate multiple choice questions need options', () => {
      const question: Question = {
        id: 'TEST_01',
        question: 'Test question?',
        category: 'Test Category',
        categoryCode: 'TEST',
        type: 'multiple_choice'
      };

      const result = validateQuestion(question);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('options'))).toBe(true);
    });

    it('should warn about invalid ID format', () => {
      const question: Question = {
        id: 'invalid-id',
        question: 'Test question?',
        category: 'Test Category',
        categoryCode: 'TEST',
        type: 'text'
      };

      const result = validateQuestion(question);
      expect(result.warnings.some(w => w.includes('ID format'))).toBe(true);
    });

    it('should validate invalid question types', () => {
      const question = {
        id: 'TEST_01',
        question: 'Test question?',
        category: 'Test Category',
        categoryCode: 'TEST',
        type: 'invalid_type'
      } as Question;

      const result = validateQuestion(question);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid question type'))).toBe(true);
    });
  });

  describe('validateAllQuestions', () => {
    it('should validate the entire question set', () => {
      const result = validateAllQuestions();
      
      if (!result.isValid) {
        console.log('Validation errors:', result.errors);
        console.log('Validation warnings:', result.warnings);
      }
      
      // The test will pass if there are no critical errors
      // Warnings are acceptable for existing data
      expect(result.errors.filter(e => !e.includes('warning'))).toHaveLength(0);
    });
  });
});
