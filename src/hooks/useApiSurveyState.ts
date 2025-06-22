
import { useState, useEffect, useCallback } from 'react';
import { SurveyResponse, InterviewSession } from '../types/survey';
import { surveyApi, ApiSession, ApiResponse, ApiQuestion } from '../services/surveyApi';
import { SurveyError, ERROR_CODES } from '../utils/errorHandling';
import { useToast } from './use-toast';

export interface UseApiSurveyStateProps {
  sessionId?: string;
  interviewerName: string;
  interviewerEmail: string;
  platformName?: string;
  employmentType?: string;
  interviewCode?: string;
}

export const useApiSurveyState = ({ 
  sessionId,
  interviewerName, 
  interviewerEmail,
  platformName = '',
  employmentType = '',
  interviewCode = ''
}: UseApiSurveyStateProps) => {
  const [session, setSession] = useState<ApiSession | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<ApiQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Convert API response to internal format
  const convertApiResponseToInternal = useCallback((apiResponse: ApiResponse): SurveyResponse => ({
    questionId: apiResponse.questionId,
    answer: apiResponse.answer,
    timestamp: new Date(apiResponse.timestamp)
  }), []);

  // Convert API session to internal format
  const convertApiSessionToInternal = useCallback((apiSession: ApiSession): InterviewSession => ({
    id: apiSession.id,
    platformName: apiSession.platformName,
    employmentType: apiSession.employmentType,
    interviewCode: apiSession.interviewCode,
    interviewDate: apiSession.interviewDate,
    interviewer: apiSession.interviewer,
    interviewerEmail: apiSession.interviewerEmail,
    status: apiSession.status === 'in-progress' ? 'in-progress' : apiSession.status as 'not-started' | 'completed',
    responses: [],
    currentQuestionIndex: apiSession.currentQuestionIndex,
    completedCategories: apiSession.completedCategories,
    startTime: new Date(apiSession.startTime),
    endTime: apiSession.endTime ? new Date(apiSession.endTime) : undefined,
    lastUpdated: new Date(apiSession.lastUpdated)
  }), []);

  // Initialize or load session
  const initializeSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let currentSession: ApiSession;

      if (sessionId) {
        // Load existing session
        currentSession = await surveyApi.getSession(sessionId);
      } else {
        // Create new session
        currentSession = await surveyApi.createSession({
          interviewer: interviewerName,
          interviewerEmail: interviewerEmail,
          interviewDate: new Date().toLocaleDateString(),
          platformName: platformName,
          employmentType: employmentType,
          interviewCode: interviewCode
        });
      }

      setSession(currentSession);

      // Load responses for this session
      const responsesData = await surveyApi.getResponses(currentSession.id);
      const convertedResponses = responsesData.responses.map(convertApiResponseToInternal);
      setResponses(convertedResponses);

      // Load all questions
      const questionsData = await surveyApi.getQuestions();
      setQuestions(questionsData.questions);

      // Get next question
      const nextQuestionData = await surveyApi.getNextQuestion(currentSession.id);
      if (nextQuestionData.question) {
        setCurrentQuestion(nextQuestionData.question);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize session';
      setError(errorMessage);
      toast({
        title: "Session Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, interviewerName, interviewerEmail, platformName, employmentType, interviewCode, convertApiResponseToInternal, toast]);

  // Update response
  const updateResponse = useCallback(async (questionId: string, answer: string) => {
    if (!session) {
      throw new SurveyError('No active session', ERROR_CODES.SESSION_CORRUPTED);
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if response already exists
      const existingResponse = responses.find(r => r.questionId === questionId);
      
      let apiResponse: ApiResponse;
      if (existingResponse) {
        // Update existing response
        apiResponse = await surveyApi.updateResponse(session.id, questionId, answer);
      } else {
        // Create new response
        apiResponse = await surveyApi.createResponse(session.id, { questionId, answer });
      }

      // Update local state
      const newResponse = convertApiResponseToInternal(apiResponse);
      setResponses(prev => {
        const filtered = prev.filter(r => r.questionId !== questionId);
        return [...filtered, newResponse];
      });

      // Get next question
      const nextQuestionData = await surveyApi.getNextQuestion(session.id);
      if (nextQuestionData.question) {
        setCurrentQuestion(nextQuestionData.question);
      } else if (nextQuestionData.categoryComplete) {
        // Category completed, update session
        const updatedSession = await surveyApi.updateSession(session.id, {
          completedCategories: [...session.completedCategories, nextQuestionData.currentCategory]
        });
        setSession(updatedSession);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save response';
      setError(errorMessage);
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, responses, convertApiResponseToInternal, toast]);

  // Complete session
  const completeSession = useCallback(async () => {
    if (!session) return false;

    setIsLoading(true);
    try {
      await surveyApi.updateSession(session.id, {
        status: 'completed',
        endTime: new Date().toISOString()
      });
      
      toast({
        title: "Session Completed",
        description: "Survey has been successfully completed",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete session';
      setError(errorMessage);
      toast({
        title: "Completion Error",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, toast]);

  // Initialize on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Get statistics
  const getStatistics = useCallback(() => {
    const totalQuestions = questions.length;
    const answeredQuestions = responses.filter(r => 
      r.answer.trim() !== "" && r.answer !== "SKIPPED"
    ).length;
    const skippedQuestions = responses.filter(r => r.answer === "SKIPPED").length;
    
    return {
      totalQuestions,
      answeredQuestions,
      skippedQuestions,
      unansweredQuestions: totalQuestions - answeredQuestions - skippedQuestions,
      completionPercentage: totalQuestions > 0 ? (answeredQuestions + skippedQuestions) / totalQuestions * 100 : 0,
      completedCategories: session?.completedCategories.length || 0,
      totalCategories: questions.reduce((acc, q) => {
        if (!acc.includes(q.categoryCode)) acc.push(q.categoryCode);
        return acc;
      }, [] as string[]).length
    };
  }, [responses, questions, session]);

  return {
    // State
    session: session ? convertApiSessionToInternal(session) : null,
    responses,
    questions,
    currentQuestion,
    isLoading,
    error,
    
    // Actions
    updateResponse,
    completeSession,
    initializeSession,
    
    // Getters
    getStatistics
  };
};
