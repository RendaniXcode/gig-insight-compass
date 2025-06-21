
import { useState, useEffect } from "react";
import { toast } from "sonner";
import CategorySelector from "../components/CategorySelector";
import QuestionInterface from "../components/QuestionInterface";
import SurveyDashboard from "../components/SurveyDashboard";
import InterviewerSetup from "../components/InterviewerSetup";
import { InterviewSession, SurveyResponse, SURVEY_CATEGORIES } from "../types/survey";
import { SURVEY_QUESTIONS } from "../data/questions";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Home } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<'setup' | 'categories' | 'questions' | 'dashboard'>('setup');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [session, setSession] = useState<InterviewSession>({
    id: `interview_${Date.now()}`,
    platformName: '',
    employmentType: '',
    interviewCode: '',
    interviewDate: new Date().toISOString().split('T')[0],
    interviewer: '',
    interviewerEmail: '',
    status: 'not-started',
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
        const restoredSession = {
          ...parsed,
          startTime: new Date(parsed.startTime),
          endTime: parsed.endTime ? new Date(parsed.endTime) : undefined,
          lastUpdated: new Date(parsed.lastUpdated)
        };
        setSession(restoredSession);
        
        // If interviewer is set, skip setup
        if (restoredSession.interviewer) {
          // If completed, show dashboard; otherwise show categories
          setCurrentView(restoredSession.status === 'completed' ? 'dashboard' : 'categories');
        }
      } catch (error) {
        console.error('Error loading saved session:', error);
      }
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('survey_session', JSON.stringify(session));
  }, [session]);

  const handleInterviewerSetup = (interviewer: string, email?: string) => {
    const startTime = new Date();
    setSession(prev => ({
      ...prev,
      interviewer,
      interviewerEmail: email,
      status: 'in-progress',
      startTime,
      lastUpdated: startTime
    }));
    setCurrentView('categories');
    toast.success(`Interview session started by ${interviewer}`);
    
    // Here you would normally save to database
    console.log('Interview started at:', startTime.toISOString());
  };

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

      // Check if all categories are completed
      const totalCompleted = updates.completedCategories || prev.completedCategories;
      if (totalCompleted.length === SURVEY_CATEGORIES.length) {
        const endTime = new Date();
        updates.status = 'completed';
        updates.endTime = endTime;
        
        // Here you would normally save end time to database
        console.log('Interview completed at:', endTime.toISOString());
        toast.success('Interview completed successfully!');
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
    console.log("Starting category save for:", currentCategoryCode);
    
    // Mark current category as completed
    setSession(prev => {
      const updatedSession = {
        ...prev,
        completedCategories: prev.completedCategories.includes(currentCategoryCode) 
          ? prev.completedCategories 
          : [...prev.completedCategories, currentCategoryCode],
        lastUpdated: new Date()
      };
      console.log("Updated session with completed categories:", updatedSession.completedCategories);
      return updatedSession;
    });

    // Save to database (simulated with localStorage for now)
    const categoryResponses = session.responses.filter(r => {
      const question = SURVEY_QUESTIONS.find(q => q.id === r.questionId);
      return question?.categoryCode === currentCategoryCode;
    });

    const saveData = {
      categoryCode: currentCategoryCode,
      sessionId: session.id,
      responses: categoryResponses,
      timestamp: new Date(),
      platformName: session.platformName,
      employmentType: session.employmentType
    };

    localStorage.setItem(`category_${currentCategoryCode}_${session.id}`, JSON.stringify(saveData));
    
    const categoryName = SURVEY_CATEGORIES.find(c => c.code === currentCategoryCode)?.name;
    console.log("Category saved successfully:", categoryName);
    
    // Just show success message - no auto navigation
    toast.success(`${categoryName} saved successfully!`);
  };

  const handleMoveToNextCategory = (currentCategoryCode: string) => {
    const currentIndex = SURVEY_CATEGORIES.findIndex(c => c.code === currentCategoryCode);
    console.log("Moving to next category from index:", currentIndex);
    
    if (currentIndex < SURVEY_CATEGORIES.length - 1) {
      const nextCategory = SURVEY_CATEGORIES[currentIndex + 1];
      console.log("Moving to next category:", nextCategory);
      
      setSelectedCategory(nextCategory.code);
      setCurrentView('questions');
      toast.info(`Moving to: ${nextCategory.name}`);
    } else {
      // All categories completed, go to dashboard
      console.log("All categories completed, going to dashboard");
      const endTime = new Date();
      setSession(prev => ({ 
        ...prev, 
        status: 'completed',
        endTime
      }));
      setCurrentView('dashboard');
      setSelectedCategory(null);
      
      // Here you would normally save end time to database
      console.log('Interview completed at:', endTime.toISOString());
      toast.success("All categories completed! Check your dashboard.");
    }
  };

  const handleContinueInterview = () => {
    if (session.status === 'completed') {
      toast.info("This interview is already completed and cannot be edited.");
      return;
    }
    
    setCurrentView('categories');
    toast.info("Continuing interview where you left off...");
  };

  const handleExport = () => {
    const exportData = {
      sessionInfo: {
        id: session.id,
        platformName: session.platformName,
        employmentType: session.employmentType,
        interviewCode: session.interviewCode,
        interviewDate: session.interviewDate,
        interviewer: session.interviewer,
        interviewerEmail: session.interviewerEmail,
        status: session.status,
        startTime: session.startTime,
        endTime: session.endTime,
        lastUpdated: session.lastUpdated,
        duration: (session.endTime || session.lastUpdated).getTime() - session.startTime.getTime()
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

  // Show setup if no interviewer is set
  if (currentView === 'setup' || !session.interviewer) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <InterviewerSetup onSetup={handleInterviewerSetup} />
      </div>
    );
  }

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
              disabled={session.status === 'completed'}
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
            onContinueInterview={handleContinueInterview}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
