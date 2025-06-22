
import { useState, useEffect, useCallback } from 'react';
import { SurveyResponse, InterviewSession } from '../types/survey';
import { SURVEY_CATEGORIES } from '../types/survey';
import { SURVEY_QUESTIONS } from '../data/questions';
import { 
  getQuestionStatus, 
  getCategoryStatus, 
  validateAnswer, 
  deduplicateResponses,
  sanitizeResponse 
} from '../utils/surveyUtils';

export interface UseSurveyStateProps {
  sessionId: string;
  interviewerName: string;
  interviewerEmail: string;
  loadedSession?: InterviewSession | null;
}

export const useSurveyState = ({ 
  sessionId, 
  interviewerName, 
  interviewerEmail, 
  loadedSession 
}: UseSurveyStateProps) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize state from loaded session
  useEffect(() => {
    if (loadedSession) {
      setResponses(deduplicateResponses(loadedSession.responses || []));
      setCompletedCategories(loadedSession.completedCategories || []);
      setLastSaved(new Date(loadedSession.lastUpdated));
    }
  }, [loadedSession]);

  // Handle response changes with validation
  const updateResponse = useCallback((questionId: string, answer: string) => {
    const question = SURVEY_QUESTIONS.find(q => q.id === questionId);
    if (!question) {
      console.error(`Question not found: ${questionId}`);
      return false;
    }

    const validation = validateAnswer(question, answer);
    if (!validation.isValid && answer !== "SKIPPED") {
      console.warn(`Invalid answer for ${questionId}:`, validation.error);
      return false;
    }

    const newResponse = sanitizeResponse({
      questionId,
      answer,
      timestamp: new Date()
    });

    setResponses(prev => {
      const filtered = prev.filter(r => r.questionId !== questionId);
      return [...filtered, newResponse];
    });

    setHasUnsavedChanges(true);
    return true;
  }, []);

  // Save session to localStorage
  const saveSession = useCallback(() => {
    try {
      const session: InterviewSession = {
        id: sessionId,
        interviewer: interviewerName,
        interviewerEmail: interviewerEmail,
        interviewDate: loadedSession?.interviewDate || new Date().toLocaleDateString(),
        startTime: loadedSession?.startTime || new Date(),
        lastUpdated: new Date(),
        status: completedCategories.length === SURVEY_CATEGORIES.length ? 'completed' : 'in-progress',
        responses: deduplicateResponses(responses),
        completedCategories: completedCategories,
        platformName: loadedSession?.platformName || "",
        employmentType: loadedSession?.employmentType || "",
        interviewCode: loadedSession?.interviewCode || "",
        currentQuestionIndex: currentQuestionIndex
      };
      
      localStorage.setItem(`interview_session_${sessionId}`, JSON.stringify(session));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      console.log('Session saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to save session:', error);
      return false;
    }
  }, [sessionId, interviewerName, interviewerEmail, loadedSession, completedCategories, responses, currentQuestionIndex]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        saveSession();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [hasUnsavedChanges, saveSession]);

  // Get current position in survey
  const getCurrentPosition = useCallback(() => {
    if (!currentCategory) return null;

    const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === currentCategory);
    const currentQuestion = categoryQuestions[currentQuestionIndex];
    
    return {
      category: currentCategory,
      questionIndex: currentQuestionIndex,
      question: currentQuestion,
      totalQuestions: categoryQuestions.length
    };
  }, [currentCategory, currentQuestionIndex]);

  // Navigation helpers
  const goToNextQuestion = useCallback(() => {
    if (!currentCategory) return false;

    const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === currentCategory);
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      return true;
    }
    return false;
  }, [currentCategory, currentQuestionIndex]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      return true;
    }
    return false;
  }, [currentQuestionIndex]);

  const goToCategory = useCallback((categoryCode: string, questionIndex: number = 0) => {
    setCurrentCategory(categoryCode);
    setCurrentQuestionIndex(questionIndex);
  }, []);

  // Category completion
  const markCategoryCompleted = useCallback((categoryCode: string) => {
    setCompletedCategories(prev => {
      if (!prev.includes(categoryCode)) {
        return [...prev, categoryCode];
      }
      return prev;
    });
  }, []);

  // Get survey statistics
  const getStatistics = useCallback(() => {
    const totalQuestions = SURVEY_QUESTIONS.length;
    const answeredQuestions = responses.filter(r => 
      r.answer.trim() !== "" && r.answer !== "SKIPPED"
    ).length;
    const skippedQuestions = responses.filter(r => r.answer === "SKIPPED").length;
    
    return {
      totalQuestions,
      answeredQuestions,
      skippedQuestions,
      unansweredQuestions: totalQuestions - answeredQuestions - skippedQuestions,
      completionPercentage: (answeredQuestions + skippedQuestions) / totalQuestions * 100,
      completedCategories: completedCategories.length,
      totalCategories: SURVEY_CATEGORIES.length
    };
  }, [responses, completedCategories]);

  return {
    // State
    responses,
    completedCategories,
    currentCategory,
    currentQuestionIndex,
    lastSaved,
    hasUnsavedChanges,
    
    // Actions
    updateResponse,
    saveSession,
    goToNextQuestion,
    goToPreviousQuestion,
    goToCategory,
    markCategoryCompleted,
    
    // Getters
    getCurrentPosition,
    getStatistics,
    
    // Utilities
    getQuestionStatus: (questionId: string) => getQuestionStatus(questionId, responses),
    getCategoryStatus: (categoryCode: string) => getCategoryStatus(categoryCode, responses)
  };
};
