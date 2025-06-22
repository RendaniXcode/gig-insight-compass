
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { Interview } from "./Interview";
import { InterviewerSetup } from "./InterviewerSetup";

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

  // Handle URL changes
  useEffect(() => {
    const newView = getInitialView();
    setCurrentView(newView);
  }, [searchParams]);

  const handleInterviewerSetup = (interviewer: string, email?: string) => {
    setInterviewerName(interviewer);
    setInterviewerEmail(email || '');
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
