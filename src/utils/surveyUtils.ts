
import { SurveyResponse, Question } from "../types/survey";
import { SURVEY_QUESTIONS } from "../data/questions";

// Status checking utilities
export const getQuestionStatus = (questionId: string, responses: SurveyResponse[]) => {
  const response = responses.find(r => r.questionId === questionId);
  
  if (!response || !response.answer || response.answer.trim() === "") {
    return "unanswered";
  }
  if (response.answer === "SKIPPED") {
    return "skipped";
  }
  return "answered";
};

export const getCategoryStatus = (categoryCode: string, responses: SurveyResponse[]) => {
  const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === categoryCode);
  const answeredQuestions = categoryQuestions.filter(q => 
    getQuestionStatus(q.id, responses) === "answered"
  );
  const skippedQuestions = categoryQuestions.filter(q => 
    getQuestionStatus(q.id, responses) === "skipped"
  );
  
  const totalQuestions = categoryQuestions.length;
  const completedQuestions = answeredQuestions.length + skippedQuestions.length;
  
  if (completedQuestions === 0) return "not-started";
  if (completedQuestions === totalQuestions) return "completed";
  return "in-progress";
};

export const getCategoryProgress = (categoryCode: string, responses: SurveyResponse[]) => {
  const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === categoryCode);
  const answeredQuestions = categoryQuestions.filter(q => 
    getQuestionStatus(q.id, responses) === "answered"
  );
  const skippedQuestions = categoryQuestions.filter(q => 
    getQuestionStatus(q.id, responses) === "skipped"
  );
  
  const totalQuestions = categoryQuestions.length;
  const completedQuestions = answeredQuestions.length + skippedQuestions.length;
  
  return {
    total: totalQuestions,
    answered: answeredQuestions.length,
    skipped: skippedQuestions.length,
    completed: completedQuestions,
    percentage: totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0
  };
};

// Answer validation utilities
export const validateAnswer = (question: Question, answer: string): { isValid: boolean; error?: string } => {
  if (!answer || answer.trim() === "") {
    return { isValid: false, error: "Answer is required" };
  }

  if (answer === "SKIPPED") {
    return { isValid: true };
  }

  switch (question.type) {
    case 'multiple_choice':
      if (answer.startsWith('Other: ')) {
        const otherText = answer.substring(7).trim();
        if (!otherText) {
          return { isValid: false, error: "Please specify the 'Other' option" };
        }
      } else if (question.options && !question.options.includes(answer) && answer !== 'Other') {
        return { isValid: false, error: "Please select a valid option" };
      }
      break;
    
    case 'yes_no':
      if (!['Yes', 'No'].includes(answer)) {
        return { isValid: false, error: "Please select Yes or No" };
      }
      break;
    
    case 'number':
      if (isNaN(Number(answer))) {
        return { isValid: false, error: "Please enter a valid number" };
      }
      break;
    
    case 'date':
      if (isNaN(Date.parse(answer))) {
        return { isValid: false, error: "Please enter a valid date" };
      }
      break;
    
    case 'text':
    case 'textarea':
      if (answer.trim().length < 1) {
        return { isValid: false, error: "Please provide an answer" };
      }
      break;
  }

  return { isValid: true };
};

// Navigation utilities
export const findNextQuestion = (currentQuestionId: string, responses: SurveyResponse[]) => {
  const currentQuestion = SURVEY_QUESTIONS.find(q => q.id === currentQuestionId);
  if (!currentQuestion) return null;

  const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === currentQuestion.categoryCode);
  const currentIndex = categoryQuestions.findIndex(q => q.id === currentQuestionId);
  
  if (currentIndex < categoryQuestions.length - 1) {
    return categoryQuestions[currentIndex + 1];
  }
  
  return null;
};

export const findPreviousQuestion = (currentQuestionId: string) => {
  const currentQuestion = SURVEY_QUESTIONS.find(q => q.id === currentQuestionId);
  if (!currentQuestion) return null;

  const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === currentQuestion.categoryCode);
  const currentIndex = categoryQuestions.findIndex(q => q.id === currentQuestionId);
  
  if (currentIndex > 0) {
    return categoryQuestions[currentIndex - 1];
  }
  
  return null;
};

// Data integrity utilities
export const sanitizeResponse = (response: SurveyResponse): SurveyResponse => {
  return {
    questionId: response.questionId?.trim() || '',
    answer: response.answer?.trim() || '',
    timestamp: response.timestamp instanceof Date ? response.timestamp : new Date(response.timestamp)
  };
};

export const deduplicateResponses = (responses: SurveyResponse[]): SurveyResponse[] => {
  const responseMap = new Map<string, SurveyResponse>();
  
  responses.forEach(response => {
    const sanitized = sanitizeResponse(response);
    const existing = responseMap.get(sanitized.questionId);
    
    if (!existing || sanitized.timestamp > existing.timestamp) {
      responseMap.set(sanitized.questionId, sanitized);
    }
  });
  
  return Array.from(responseMap.values());
};
