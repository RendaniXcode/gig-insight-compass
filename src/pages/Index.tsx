
import { useState, useEffect } from "react";
import { toast } from "sonner";
import CategorySelector from "../components/CategorySelector";
import QuestionInterface from "../components/QuestionInterface";
import SurveyDashboard from "../components/SurveyDashboard";
import { InterviewSession, SurveyResponse, SURVEY_CATEGORIES } from "../types/survey";
import { SURVEY_QUESTIONS } from "../data/questions";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Home } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<'categories' | 'questions' | 'dashboard'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [session, setSession] = useState<InterviewSession>({
    id: `interview_${Date.now()}`,
    platformName: '',
    employmentType: '',
    interviewCode: '',
    interviewDate: new Date().toISOString().split('T')[0],
    responses: [],
    currentQuestionIndex: 0,
    completedCategories: [],
    startTime: new Date(),
    lastUpdated: new Date()
  });

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('survey_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSession({
          ...parsed,
          startTime: new Date(parsed.startTime),
          lastUpdated: new Date(parsed.lastUpdated)
        });
      } catch (error) {
        console.error('Error loading saved session:', error);
      }
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('survey_session', JSON.stringify(session));
  }, [session]);

  const handleCategorySelect = (categoryCode: string) => {
    setSelectedCategory(categoryCode);
    setCurrentView('questions');
  };

  const handleResponseChange = (questionId: string, answer: string) => {
    setSession(prev => {
      const existingResponseIndex = prev.responses.findIndex(r => r.questionId === questionId);
      const newResponse: SurveyResponse = {
        questionId,
        answer,
        timestamp: new Date()
      };

      let newResponses;
      if (existingResponseIndex >= 0) {
        newResponses = [...prev.responses];
        newResponses[existingResponseIndex] = newResponse;
      } else {
        newResponses = [...prev.responses, newResponse];
      }

      // Update basic info fields
      let updates: Partial<InterviewSession> = { responses: newResponses };
      if (questionId === 'BI_01') updates.platformName = answer;
      if (questionId === 'BI_02') updates.employmentType = answer;
      if (questionId === 'BI_03') updates.interviewCode = answer;

      // Check if category is completed
      const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === selectedCategory);
      const categoryResponses = newResponses.filter(r => 
        categoryQuestions.some(q => q.id === r.questionId) && r.answer.trim() !== ""
      );
      
      if (categoryResponses.length === categoryQuestions.length && selectedCategory) {
        if (!prev.completedCategories.includes(selectedCategory)) {
          updates.completedCategories = [...prev.completedCategories, selectedCategory];
        }
      }

      return {
        ...prev,
        ...updates,
        lastUpdated: new Date()
      };
    });
  };

  const handleSave = () => {
    toast.success("Progress saved successfully!");
  };

  const handleCategorySaveAndNext = (currentCategoryCode: string) => {
    // Mark current category as completed
    setSession(prev => {
      if (!prev.completedCategories.includes(currentCategoryCode)) {
        return {
          ...prev,
          completedCategories: [...prev.completedCategories, currentCategoryCode],
          lastUpdated: new Date()
        };
      }
      return prev;
    });

    // Save to database (simulated with localStorage for now)
    const categoryResponses = session.responses.filter(r => {
      const question = SURVEY_QUESTIONS.find(q => q.id === r.questionId);
      return question?.categoryCode === currentCategoryCode;
    });

    // Simulate database save
    const saveData = {
      categoryCode: currentCategoryCode,
      sessionId: session.id,
      responses: categoryResponses,
      timestamp: new Date(),
      platformName: session.platformName,
      employmentType: session.employmentType
    };

    localStorage.setItem(`category_${currentCategoryCode}_${session.id}`, JSON.stringify(saveData));
    
    toast.success(`${SURVEY_CATEGORIES.find(c => c.code === currentCategoryCode)?.name} saved successfully!`);

    // Find next category
    const currentIndex = SURVEY_CATEGORIES.findIndex(c => c.code === currentCategoryCode);
    if (currentIndex < SURVEY_CATEGORIES.length - 1) {
      const nextCategory = SURVEY_CATEGORIES[currentIndex + 1];
      setSelectedCategory(nextCategory.code);
      toast.info(`Moving to: ${nextCategory.name}`);
    } else {
      // All categories completed, go to dashboard
      setCurrentView('dashboard');
      toast.success("All categories completed! Check your dashboard.");
    }
  };

  const handleExport = () => {
    const exportData = {
      sessionInfo: {
        id: session.id,
        platformName: session.platformName,
        employmentType: session.employmentType,
        interviewCode: session.interviewCode,
        interviewDate: session.interviewDate,
        startTime: session.startTime,
        lastUpdated: session.lastUpdated,
        duration: session.lastUpdated.getTime() - session.startTime.getTime()
      },
      responses: session.responses.map(response => {
        const question = SURVEY_QUESTIONS.find(q => q.id === response.questionId);
        return {
          questionId: response.questionId,
          category: question?.category,
          question: question?.question,
          answer: response.answer,
          timestamp: response.timestamp
        };
      }),
      summary: {
        totalQuestions: SURVEY_QUESTIONS.length,
        answeredQuestions: session.responses.filter(r => r.answer.trim() !== "").length,
        completedCategories: session.completedCategories.length,
        completionPercentage: (session.responses.filter(r => r.answer.trim() !== "").length / SURVEY_QUESTIONS.length) * 100
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform_worker_survey_${session.interviewCode || session.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Survey data exported successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-2 md:px-4">
      {/* Navigation */}
      <div className="max-w-6xl mx-auto mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Button
              variant={currentView === 'categories' ? 'default' : 'outline'}
              onClick={() => setCurrentView('categories')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Home className="h-4 w-4" />
              Categories
            </Button>
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
          
          {session.responses.length > 0 && (
            <div className="text-sm text-gray-600 text-center sm:text-right">
              Progress: {Math.round((session.responses.filter(r => r.answer.trim()).length / SURVEY_QUESTIONS.length) * 100)}%
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {currentView === 'categories' && (
          <CategorySelector
            selectedCategory={selectedCategory}
            completedCategories={session.completedCategories}
            onCategorySelect={handleCategorySelect}
          />
        )}
        
        {currentView === 'questions' && selectedCategory && (
          <QuestionInterface
            categoryCode={selectedCategory}
            responses={session.responses}
            onResponseChange={handleResponseChange}
            onBack={() => setCurrentView('categories')}
            onSave={handleSave}
            onCategorySaveAndNext={handleCategorySaveAndNext}
          />
        )}
        
        {currentView === 'dashboard' && (
          <SurveyDashboard
            session={session}
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
