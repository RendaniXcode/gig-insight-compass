import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, BarChart3, Settings } from "lucide-react";
import { SurveyResponse, InterviewSession } from "../types/survey";
import { SURVEY_CATEGORIES } from "../types/survey";
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

  // Initialize session data
  useEffect(() => {
    if (loadedSession) {
      // Load data from the specific session
      console.log('Loading session data:', loadedSession);
      setResponses(loadedSession.responses || []);
      setCompletedCategories(loadedSession.completedCategories || []);
      setSessionId(loadedSession.id);
      
      // Set initial category based on session progress
      if (loadedSession.responses.length > 0) {
        // Find the last answered question to determine current category
        const lastResponse = loadedSession.responses[loadedSession.responses.length - 1];
        // This would need to be implemented based on your question data structure
        setSelectedCategory(SURVEY_CATEGORIES[0].code);
      } else {
        setSelectedCategory(SURVEY_CATEGORIES[0].code);
      }
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
          />
        )}
      </div>
    </div>
  );
};
