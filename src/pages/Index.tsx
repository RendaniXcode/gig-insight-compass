import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { Interview } from "./Interview";
import { InterviewerSetup } from "./InterviewerSetup";

type View = 'setup' | 'interview' | 'dashboard';

const Index = () => {
  const [searchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState<View>(searchParams.get('view') === 'dashboard' ? 'dashboard' : 'setup');
  const [interviewerName, setInterviewerName] = useState<string>('');
  const [interviewerEmail, setInterviewerEmail] = useState<string>('');
  const navigate = useNavigate();

  const handleInterviewerSetup = (interviewer: string, email?: string) => {
    setInterviewerName(interviewer);
    setInterviewerEmail(email || '');
    setCurrentView('interview');
  };

  const handleGoToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleGoToLanding = () => {
    navigate('/');
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
        />
      )}

      {currentView === 'setup' && (
        <InterviewerSetup 
          onSetup={handleInterviewerSetup}
          onGoToDashboard={handleGoToDashboard}
        />
      )}
    </>
  );
};

export default Index;
