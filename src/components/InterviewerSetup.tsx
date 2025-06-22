
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, BarChart3 } from "lucide-react";

interface InterviewerSetupProps {
  onSetup: (interviewer: string, email?: string) => void;
  onGoToDashboard?: () => void;
}

const InterviewerSetup = ({ onSetup, onGoToDashboard }: InterviewerSetupProps) => {
  const [interviewerType, setInterviewerType] = useState("");
  const [customInterviewer, setCustomInterviewer] = useState("");
  const [email, setEmail] = useState("");

  const handleInterviewerChange = (value: string) => {
    setInterviewerType(value);
    if (value === "rendani") {
      setEmail("u24897664@tuks.co.za");
    } else if (value === "other") {
      setEmail("");
    }
  };

  const getInterviewerName = () => {
    if (interviewerType === "rendani") {
      return "Rendani Tshivhangani";
    } else if (interviewerType === "other") {
      return customInterviewer.trim();
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const interviewer = getInterviewerName();
    if (interviewer) {
      onSetup(interviewer, email.trim() || undefined);
    }
  };

  const isFormValid = () => {
    const interviewer = getInterviewerName();
    return interviewer.length > 0;
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-lg sm:text-xl">Setup Interview Session</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interviewer-select" className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 flex-shrink-0" />
                <span>Interviewer Name *</span>
              </Label>
              <Select value={interviewerType} onValueChange={handleInterviewerChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select interviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rendani">Rendani Tshivhangani</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {interviewerType === "other" && (
              <div className="space-y-2">
                <Label htmlFor="custom-interviewer" className="text-sm">
                  Custom Interviewer Name *
                </Label>
                <Input
                  id="custom-interviewer"
                  type="text"
                  value={customInterviewer}
                  onChange={(e) => setCustomInterviewer(e.target.value)}
                  placeholder="Enter interviewer name"
                  className="w-full"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>Email (Optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full"
                readOnly={interviewerType === "rendani"}
              />
            </div>
            
            <div className="space-y-3 pt-2">
              <Button type="submit" className="w-full" disabled={!isFormValid()}>
                Start Interview Session
              </Button>
              
              {onGoToDashboard && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center gap-2" 
                  onClick={onGoToDashboard}
                >
                  <BarChart3 className="h-4 w-4" />
                  View Existing Interviews
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewerSetup;
