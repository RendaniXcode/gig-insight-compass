
import { describe, it, expect, beforeEach } from 'vitest';
import { SurveyResponse } from '../../types/survey';
import { 
  getQuestionStatus, 
  getCategoryStatus, 
  validateAnswer, 
  deduplicateResponses,
  sanitizeResponse 
} from '../surveyUtils';
import { SURVEY_QUESTIONS } from '../../data/questions';

describe('Survey Utils', () => {
  let mockResponses: SurveyResponse[];

  beforeEach(() => {
    mockResponses = [
      { questionId: 'BI_01', answer: 'Uber', timestamp: new Date() },
      { questionId: 'BI_02', answer: 'Employee', timestamp: new Date() },
      { questionId: 'BI_03', answer: 'SKIPPED', timestamp: new Date() },
    ];
  });

  describe('getQuestionStatus', () => {
    it('should return "answered" for questions with valid answers', () => {
      const status = getQuestionStatus('BI_01', mockResponses);
      expect(status).toBe('answered');
    });

    it('should return "skipped" for skipped questions', () => {
      const status = getQuestionStatus('BI_03', mockResponses);
      expect(status).toBe('skipped');
    });

    it('should return "unanswered" for questions without responses', () => {
      const status = getQuestionStatus('BI_04', mockResponses);
      expect(status).toBe('unanswered');
    });

    it('should return "unanswered" for questions with empty answers', () => {
      const responsesWithEmpty = [...mockResponses, { questionId: 'BI_04', answer: '', timestamp: new Date() }];
      const status = getQuestionStatus('BI_04', responsesWithEmpty);
      expect(status).toBe('unanswered');
    });
  });

  describe('getCategoryStatus', () => {
    it('should return "in-progress" for partially completed categories', () => {
      const status = getCategoryStatus('BI', mockResponses);
      expect(status).toBe('in-progress');
    });

    it('should return "not-started" for categories with no responses', () => {
      const status = getCategoryStatus('PB', mockResponses);
      expect(status).toBe('not-started');
    });
  });

  describe('validateAnswer', () => {
    it('should validate multiple choice answers correctly', () => {
      const question = SURVEY_QUESTIONS.find(q => q.id === 'BI_01')!;
      const result = validateAnswer(question, 'Uber');
      expect(result.isValid).toBe(true);
    });

    it('should validate "Other" answers with text', () => {
      const question = SURVEY_QUESTIONS.find(q => q.id === 'BI_01')!;
      const result = validateAnswer(question, 'Other: Custom Platform');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid multiple choice answers', () => {
      const question = SURVEY_QUESTIONS.find(q => q.id === 'BI_01')!;
      const result = validateAnswer(question, 'InvalidOption');
      expect(result.isValid).toBe(false);
    });

    it('should validate yes/no questions', () => {
      const question = { id: 'test', question: 'Test', category: 'Test', categoryCode: 'T', type: 'yes_no' as const };
      expect(validateAnswer(question, 'Yes').isValid).toBe(true);
      expect(validateAnswer(question, 'No').isValid).toBe(true);
      expect(validateAnswer(question, 'Maybe').isValid).toBe(false);
    });

    it('should validate number inputs', () => {
      const question = { id: 'test', question: 'Test', category: 'Test', categoryCode: 'T', type: 'number' as const };
      expect(validateAnswer(question, '123').isValid).toBe(true);
      expect(validateAnswer(question, 'abc').isValid).toBe(false);
    });
  });

  describe('deduplicateResponses', () => {
    it('should remove duplicate responses, keeping the latest', () => {
      const duplicateResponses = [
        { questionId: 'BI_01', answer: 'Uber', timestamp: new Date('2023-01-01') },
        { questionId: 'BI_01', answer: 'Bolt', timestamp: new Date('2023-01-02') },
        { questionId: 'BI_02', answer: 'Employee', timestamp: new Date('2023-01-01') }
      ];

      const result = deduplicateResponses(duplicateResponses);
      expect(result).toHaveLength(2);
      expect(result.find(r => r.questionId === 'BI_01')?.answer).toBe('Bolt');
    });
  });

  describe('sanitizeResponse', () => {
    it('should trim whitespace from responses', () => {
      const response = {
        questionId: '  BI_01  ',
        answer: '  Uber  ',
        timestamp: new Date()
      };

      const sanitized = sanitizeResponse(response);
      expect(sanitized.questionId).toBe('BI_01');
      expect(sanitized.answer).toBe('Uber');
    });

    it('should handle invalid timestamps', () => {
      const response = {
        questionId: 'BI_01',
        answer: 'Uber',
        timestamp: '2023-01-01' as any
      };

      const sanitized = sanitizeResponse(response);
      expect(sanitized.timestamp).toBeInstanceOf(Date);
    });
  });
});
