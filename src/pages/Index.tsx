
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { Interview } from "./Interview";
import { InterviewerSetup } from "./InterviewerSetup";
import { InterviewSession } from "@/types/survey";

type View = 'setup' | 'interview' | 'dashboard';

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get initial view from URL params
  const getInitialView = (): View => {
    const viewParam = searchParams.get('view');
    const categoryParam = searchParams.get('category');
    const sessionParam = searchParams.get('session');
    
    if (viewParam === 'dashboard') return 'dashboard';
    if (categoryParam || sessionParam) return 'interview';
    return 'setup';
  };

  const [currentView, setCurrentView] = useState<View>(getInitialView);
  const [interviewerName, setInterviewerName] = useState<string>('');
  const [interviewerEmail, setInterviewerEmail] = useState<string>('');
  const [loadedSession, setLoadedSession] = useState<InterviewSession | null>(null);

  // Handle URL changes and load specific sessions
  useEffect(() => {
    const newView = getInitialView();
    setCurrentView(newView);
    
    // Check if we need to load a specific session
    const sessionParam = searchParams.get('session');
    if (sessionParam && newView === 'interview') {
      loadSpecificSession(sessionParam);
    }
  }, [searchParams]);

  const loadSpecificSession = async (sessionId: string) => {
    try {
      console.log(`Attempting to load session: ${sessionId}`);
      const savedSession = localStorage.getItem(`interview_session_${sessionId}`);
      
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        const restoredSession: InterviewSession = {
          ...parsed,
          startTime: new Date(parsed.startTime),
          endTime: parsed.endTime ? new Date(parsed.endTime) : undefined,
          lastUpdated: new Date(parsed.lastUpdated)
        };
        
        console.log(`Successfully loaded session:`, restoredSession);
        setLoadedSession(restoredSession);
        setInterviewerName(restoredSession.interviewer);
        setInterviewerEmail(restoredSession.interviewerEmail || '');
      } else {
        console.error(`Session not found: ${sessionId}`);
        // If session not found, redirect to setup
        navigate('/interview', { replace: true });
      }
    } catch (error) {
      console.error('Error loading specific session:', error);
      navigate('/interview', { replace: true });
    }
  };

  const handleInterviewerSetup = (interviewer: string, email?: string) => {
    setInterviewerName(interviewer);
    setInterviewerEmail(email || '');
    setLoadedSession(null); // Clear any loaded session when setting up new interview
    setCurrentView('interview');
    // Update URL without the view param to show we're in interview mode
    navigate('/interview', { replace: true });
  };

  const handleGoToDashboard = () => {
    setCurrentView('dashboard');
    navigate('/interview?view=dashboard', { replace: true });
  };

  const handleGoToLanding = () => {
    navigate('/');
  };

  const handleGoToSetup = () => {
    setCurrentView('setup');
    setLoadedSession(null); // Clear loaded session when going to setup
    navigate('/interview', { replace: true });
  };

  return (
    <>
      {currentView === 'dashboard' && (
        <Dashboard 
          onGoToLanding={handleGoToLanding}
        />
      )}

      {currentView === 'interview' && (
        <Interview 
          interviewerName={interviewerName}
          interviewerEmail={interviewerEmail}
          loadedSession={loadedSession}
          onGoToDashboard={handleGoToDashboard}
          onGoToSetup={handleGoToSetup}
          onGoToLanding={handleGoToLanding}
        />
      )}

      {currentView === 'setup' && (
        <InterviewerSetup 
          onSetup={handleInterviewerSetup}
          onGoToDashboard={handleGoToDashboard}
          onGoToLanding={handleGoToLanding}
        />
      )}
    </>
  );
};

export default Index;
