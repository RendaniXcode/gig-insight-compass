
import { useState, useEffect } from "react";
import { toast } from "sonner";
import CategorySelector from "../components/CategorySelector";
import QuestionInterface from "../components/QuestionInterface";
import SurveyDashboard from "../components/SurveyDashboard";
import { InterviewSession, SurveyResponse } from "../types/survey";
import { SURVEY_QUESTIONS } from "../data/questions";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Home }

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Navigation */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={currentView === 'categories' ? 'default' : 'outline'}
              onClick={() => setCurrentView('categories')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Categories
            </Button>
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
          
          {session.responses.length > 0 && (
            <div className="text-sm text-gray-600">
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
