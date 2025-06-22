
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, BarChart3, Settings } from "lucide-react";
import { InterviewSession } from "../types/survey";
import { SURVEY_CATEGORIES } from "../types/survey";
import CategorySelector from "../components/CategorySelector";
import QuestionInterface from "../components/QuestionInterface";
import { useApiSurveyState } from "../hooks/useApiSurveyState";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
  const [currentView, setCurrentView] = useState<'categories' | 'questions'>('questions');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Use the API-based survey state
  const {
    session,
    responses,
    currentQuestion,
    isLoading,
    error,
    updateResponse,
    completeSession,
    getStatistics
  } = useApiSurveyState({
    sessionId: loadedSession?.id,
    interviewerName,
    interviewerEmail,
    platformName: loadedSession?.platformName || "",
    employmentType: loadedSession?.employmentType || "",
    interviewCode: loadedSession?.interviewCode || ""
  });

  // Set initial category when session loads
  useEffect(() => {
    if (currentQuestion && !selectedCategory) {
      setSelectedCategory(currentQuestion.categoryCode);
      setCurrentView('questions');
    }
  }, [currentQuestion, selectedCategory]);

  const handleResponseChange = async (questionId: string, answer: string) => {
    await updateResponse(questionId, answer);
  };

  const handleSave = async () => {
    // Auto-save is handled by the API hook
    console.log('Save triggered - handled automatically by API');
  };

  const handleCategorySelect = (categoryCode: string) => {
    setSelectedCategory(categoryCode);
    setCurrentView('questions');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
  };

  const handleCategorySaveAndNext = async (categoryCode: string) => {
    // Category completion is handled by the API
    const stats = getStatistics();
    if (stats.completionPercentage >= 100) {
      await completeSession();
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

  // Loading state
  if (isLoading && !session) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 md:p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="w-full">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Loading Survey...</h3>
              <p className="text-gray-600">Setting up your interview session</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 md:p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="w-full">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 text-lg mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">Connection Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-x-2">
                <Button onClick={onGoToDashboard} variant="outline">
                  Go to Dashboard
                </Button>
                {onGoToLanding && (
                  <Button onClick={onGoToLanding}>
                    Back to Home
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="pt-4 pb-2 space-y-2">
          <div className="text-center">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">Interview Session</h1>
            {session && (
              <p className="text-xs text-gray-600 mt-1">
                {session.interviewer} - {session.interviewDate} {session.status === 'in_progress' && isLoading && (
                  <Loader2 className="h-3 w-3 animate-spin inline ml-1" />
                )}
              </p>
            )}
          </div>
          
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
            completedCategories={session?.completedCategories || []}
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
            initialQuestionIndex={0}
          />
        )}
      </div>
    </div>
  );
};
