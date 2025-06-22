import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, BarChart3, Settings } from "lucide-react";
import { SurveyResponse, InterviewSession } from "../types/survey";
import { SURVEY_CATEGORIES } from "../types/survey";
import { SURVEY_QUESTIONS } from "../data/questions";
import CategorySelector from "../components/CategorySelector";
import QuestionInterface from "../components/QuestionInterface";

interface InterviewProps {
  interviewerName: string;
  interviewerEmail: string;
  loadedSession?: InterviewSession | null;
  onGoToDashboard: () => void;
  onGoToSetup?: () => void;
  onGoToLanding?: () => void;
}

export const Interview = ({ 
  interviewerName, 
  interviewerEmail, 
  loadedSession,
  onGoToDashboard,
  onGoToSetup,
  onGoToLanding
}: InterviewProps) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [currentView, setCurrentView] = useState<'categories' | 'questions'>('questions');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>('');

  // Helper function to find the current category and question based on responses
  const findCurrentPosition = (sessionResponses: SurveyResponse[]) => {
    if (sessionResponses.length === 0) {
      // No responses yet, start with first category
      return {
        categoryCode: SURVEY_CATEGORIES[0].code,
        questionIndex: 0
      };
    }

    // Find the last answered question that's not skipped or empty
    const answeredResponses = sessionResponses.filter(r => 
      r.answer.trim() !== "" && r.answer !== "SKIPPED"
    );

    if (answeredResponses.length === 0) {
      // All responses are empty or skipped, start from beginning
      return {
        categoryCode: SURVEY_CATEGORIES[0].code,
        questionIndex: 0
      };
    }

    // Get the last answered question
    const lastAnsweredResponse = answeredResponses[answeredResponses.length - 1];
    const lastAnsweredQuestion = SURVEY_QUESTIONS.find(q => q.id === lastAnsweredResponse.questionId);
    
    if (!lastAnsweredQuestion) {
      return {
        categoryCode: SURVEY_CATEGORIES[0].code,
        questionIndex: 0
      };
    }

    // Find all questions in the same category
    const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === lastAnsweredQuestion.categoryCode);
    const questionIndex = categoryQuestions.findIndex(q => q.id === lastAnsweredQuestion.id);

    // If this was the last question in the category, move to next category
    if (questionIndex === categoryQuestions.length - 1) {
      const currentCategoryIndex = SURVEY_CATEGORIES.findIndex(c => c.code === lastAnsweredQuestion.categoryCode);
      if (currentCategoryIndex < SURVEY_CATEGORIES.length - 1) {
        // Move to next category
        return {
          categoryCode: SURVEY_CATEGORIES[currentCategoryIndex + 1].code,
          questionIndex: 0
        };
      } else {
        // This was the last category, stay on the last question
        return {
          categoryCode: lastAnsweredQuestion.categoryCode,
          questionIndex: questionIndex
        };
      }
    } else {
      // Move to next question in the same category
      return {
        categoryCode: lastAnsweredQuestion.categoryCode,
        questionIndex: questionIndex + 1
      };
    }
  };

  // Initialize session data
  useEffect(() => {
    if (loadedSession) {
      // Load data from the specific session
      console.log('Loading session data:', loadedSession);
      setResponses(loadedSession.responses || []);
      setCompletedCategories(loadedSession.completedCategories || []);
      setSessionId(loadedSession.id);
      
      // Find where the user left off
      const currentPosition = findCurrentPosition(loadedSession.responses || []);
      console.log('Resuming at position:', currentPosition);
      
      setSelectedCategory(currentPosition.categoryCode);
      setCurrentView('questions');
    } else {
      // Auto-start with first category for new sessions
      if (SURVEY_CATEGORIES.length > 0) {
        setSelectedCategory(SURVEY_CATEGORIES[0].code);
        setCurrentView('questions');
        setSessionId(`session_${Date.now()}`);
      }
    }
  }, [loadedSession]);

  const handleResponseChange = (questionId: string, answer: string) => {
    setResponses(prev => {
      const existing = prev.findIndex(r => r.questionId === questionId);
      const newResponse = { questionId, answer, timestamp: new Date() };
      
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newResponse;
        return updated;
      } else {
        return [...prev, newResponse];
      }
    });
  };

  const handleSave = () => {
    // Create or update session in localStorage
    const session: InterviewSession = {
      id: sessionId,
      interviewer: interviewerName,
      interviewerEmail: interviewerEmail,
      interviewDate: loadedSession?.interviewDate || new Date().toLocaleDateString(),
      startTime: loadedSession?.startTime || new Date(),
      lastUpdated: new Date(),
      status: 'in-progress',
      responses: responses,
      completedCategories: completedCategories,
      platformName: loadedSession?.platformName || "",
      employmentType: loadedSession?.employmentType || "",
      interviewCode: loadedSession?.interviewCode || "",
      currentQuestionIndex: 0
    };
    
    localStorage.setItem(`interview_session_${sessionId}`, JSON.stringify(session));
    console.log('Session saved:', session);
  };

  const handleCategorySelect = (categoryCode: string) => {
    setSelectedCategory(categoryCode);
    setCurrentView('questions');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
  };

  const handleCategorySaveAndNext = (categoryCode: string) => {
    if (!completedCategories.includes(categoryCode)) {
      setCompletedCategories(prev => [...prev, categoryCode]);
    }
  };

  const handleMoveToNextCategory = (currentCategoryCode: string) => {
    const currentIndex = SURVEY_CATEGORIES.findIndex(c => c.code === currentCategoryCode);
    if (currentIndex < SURVEY_CATEGORIES.length - 1) {
      const nextCategory = SURVEY_CATEGORIES[currentIndex + 1];
      setSelectedCategory(nextCategory.code);
    } else {
      // All categories completed, go to dashboard
      onGoToDashboard();
    }
  };

  const handleNavigateToPreviousCategory = () => {
    if (selectedCategory) {
      const currentIndex = SURVEY_CATEGORIES.findIndex(c => c.code === selectedCategory);
      if (currentIndex > 0) {
        const previousCategory = SURVEY_CATEGORIES[currentIndex - 1];
        setSelectedCategory(previousCategory.code);
      }
    }
  };

  const handleNavigateToNextCategory = () => {
    if (selectedCategory) {
      const currentIndex = SURVEY_CATEGORIES.findIndex(c => c.code === selectedCategory);
      if (currentIndex < SURVEY_CATEGORIES.length - 1) {
        const nextCategory = SURVEY_CATEGORIES[currentIndex + 1];
        setSelectedCategory(nextCategory.code);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Mobile-optimized header with increased top spacing */}
        <div className="pt-4 pb-2 space-y-2">
          {/* Title - centered on mobile with 5% spacing from top */}
          <div className="text-center">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">Interview Session</h1>
            {loadedSession && (
              <p className="text-xs text-gray-600 mt-1">
                Continuing: {loadedSession.interviewer} - {loadedSession.interviewDate}
              </p>
            )}
          </div>
          
          {/* Navigation buttons - centered and compact on mobile */}
          <div className="flex justify-center">
            <div className="flex gap-1.5">
              <Button variant="outline" onClick={onGoToDashboard} className="flex items-center gap-1.5 text-xs h-8 px-3">
                <BarChart3 className="h-3 w-3" />
                Dashboard
              </Button>
              {onGoToSetup && (
                <Button variant="outline" onClick={onGoToSetup} className="flex items-center gap-1.5 text-xs h-8 px-3">
                  <Settings className="h-3 w-3" />
                  Setup
                </Button>
              )}
              {onGoToLanding && (
                <Button variant="outline" onClick={onGoToLanding} className="flex items-center gap-1.5 text-xs h-8 px-3">
                  <Home className="h-3 w-3" />
                  Home
                </Button>
              )}
            </div>
          </div>
        </div>

        {currentView === 'categories' && (
          <CategorySelector
            selectedCategory={selectedCategory}
            completedCategories={completedCategories}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {currentView === 'questions' && selectedCategory && (
          <QuestionInterface
            categoryCode={selectedCategory}
            responses={responses}
            onResponseChange={handleResponseChange}
            onBack={handleBackToCategories}
            onSave={handleSave}
            onCategorySaveAndNext={handleCategorySaveAndNext}
            onMoveToNextCategory={handleMoveToNextCategory}
            onNavigateToPreviousCategory={handleNavigateToPreviousCategory}
            onNavigateToNextCategory={handleNavigateToNextCategory}
            initialQuestionIndex={loadedSession ? findCurrentPosition(loadedSession.responses || []).questionIndex : 0}
          />
        )}
      </div>
    </div>
  );
};
