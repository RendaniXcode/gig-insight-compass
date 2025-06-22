
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import SurveyDashboard from "@/components/SurveyDashboard";
import { InterviewSession } from "@/types/survey";

interface DashboardProps {
  onGoToLanding: () => void;
}

export const Dashboard = ({ onGoToLanding }: DashboardProps) => {
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load the most recent session or create a default one
    const loadOrCreateSession = () => {
      try {
        // Get all sessions from localStorage
        const sessions: InterviewSession[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('interview_session_')) {
            const savedSession = localStorage.getItem(key);
            if (savedSession) {
              const parsed = JSON.parse(savedSession);
              sessions.push({
                ...parsed,
                startTime: new Date(parsed.startTime),
                endTime: parsed.endTime ? new Date(parsed.endTime) : undefined,
                lastUpdated: new Date(parsed.lastUpdated)
              });
            }
          }
        }

        if (sessions.length > 0) {
          // Sort by last updated and get the most recent
          sessions.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
          setCurrentSession(sessions[0]);
        } else {
          // Create a default session for dashboard viewing
          const defaultSession: InterviewSession = {
            id: `session_${Date.now()}`,
            interviewer: "Dashboard View",
            interviewerEmail: "",
            interviewDate: new Date().toLocaleDateString(),
            startTime: new Date(),
            lastUpdated: new Date(),
            status: 'not-started',
            responses: [],
            completedCategories: [],
            platformName: "",
            employmentType: "",
            interviewCode: "",
            currentQuestionIndex: 0
          };
          setCurrentSession(defaultSession);
        }
      } catch (error) {
        console.error('Error loading session:', error);
        // Create a fallback session
        const fallbackSession: InterviewSession = {
          id: `fallback_${Date.now()}`,
          interviewer: "Dashboard View",
          interviewerEmail: "",
          interviewDate: new Date().toLocaleDateString(),
          startTime: new Date(),
          lastUpdated: new Date(),
          status: 'not-started',
          responses: [],
          completedCategories: [],
          platformName: "",
          employmentType: "",
          interviewCode: "",
          currentQuestionIndex: 0
        };
        setCurrentSession(fallbackSession);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrCreateSession();
  }, []);

  const handleExport = () => {
    console.log("Export functionality would be implemented here");
    // Export logic would go here
  };

  const handleContinueInterview = () => {
    // Navigate to interview setup or interview page
    window.location.href = '/interview';
  };

  const handleCategorySelect = (categoryCode: string) => {
    // Navigate to interview with specific category
    window.location.href = `/interview?category=${categoryCode}`;
  };

  const handleSkipCategory = (categoryCode: string) => {
    if (!currentSession) return;
    
    // Mark category as skipped
    console.log(`Skipping category: ${categoryCode}`);
  };

  const handleLoadInterview = (sessionId: string) => {
    // Load specific interview session
    window.location.href = `/interview?session=${sessionId}`;
  };

  const handleUpdateSession = (updates: Partial<InterviewSession>) => {
    if (!currentSession) return;
    
    const updatedSession = {
      ...currentSession,
      ...updates,
      lastUpdated: new Date()
    };
    
    setCurrentSession(updatedSession);
    
    // Save to localStorage
    localStorage.setItem(`interview_session_${updatedSession.id}`, JSON.stringify(updatedSession));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load dashboard</p>
          <Button onClick={onGoToLanding}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end items-center mb-6">
          <Button variant="outline" onClick={onGoToLanding} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
        
        <SurveyDashboard
          session={currentSession}
          onExport={handleExport}
          onContinueInterview={handleContinueInterview}
          onCategorySelect={handleCategorySelect}
          onSkipCategory={handleSkipCategory}
          onLoadInterview={handleLoadInterview}
          onUpdateSession={handleUpdateSession}
        />
      </div>
    </div>
  );
};
