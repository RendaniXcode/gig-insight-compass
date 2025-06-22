
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, User, BarChart3, Settings } from "lucide-react";

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
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Interviewer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {interviewerName}</p>
              {interviewerEmail && <p><strong>Email:</strong> {interviewerEmail}</p>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Interview Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Interview interface coming soon</p>
            <div className="mt-4 space-y-2">
              <Button onClick={onGoToDashboard} className="w-full">
                Go to Dashboard to View All Interviews
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
