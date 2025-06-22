
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, BarChart3, Settings } from "lucide-react";
import { SurveyResponse } from "../types/survey";
import { SURVEY_CATEGORIES } from "../types/survey";
import CategorySelector from "../components/CategorySelector";
import QuestionInterface from "../components/QuestionInterface";

interface InterviewProps {
  interviewerName: string;
  interviewerEmail: string;
  onGoToDashboard: () => void;
  onGoToSetup?: () => void;
  onGoToLanding?: () => void;
}

export const Interview = ({ 
  interviewerName, 
  interviewerEmail, 
  onGoToDashboard,
  onGoToSetup,
  onGoToLanding
}: InterviewProps) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [currentView, setCurrentView] = useState<'categories' | 'questions'>('questions');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);

  // Auto-start with first category on mount
  useEffect(() => {
    if (SURVEY_CATEGORIES.length > 0) {
      setSelectedCategory(SURVEY_CATEGORIES[0].code);
      setCurrentView('questions');
    }
  }, []);

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
    console.log('Saving responses:', responses);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Interview Session</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onGoToDashboard} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            {onGoToSetup && (
              <Button variant="outline" onClick={onGoToSetup} className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Setup
              </Button>
            )}
            {onGoToLanding && (
              <Button variant="outline" onClick={onGoToLanding} className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            )}
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
