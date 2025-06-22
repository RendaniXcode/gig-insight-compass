
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail } from "lucide-react";

interface InterviewerSetupProps {
  onSetup: (interviewer: string, email?: string) => void;
}

const InterviewerSetup = ({ onSetup }: InterviewerSetupProps) => {
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
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Setup Interview Session</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interviewer-select" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Interviewer Name *
              </Label>
              <Select value={interviewerType} onValueChange={handleInterviewerChange}>
                <SelectTrigger>
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
                <Label htmlFor="custom-interviewer">
                  Custom Interviewer Name *
                </Label>
                <Input
                  id="custom-interviewer"
                  type="text"
                  value={customInterviewer}
                  onChange={(e) => setCustomInterviewer(e.target.value)}
                  placeholder="Enter interviewer name"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                readOnly={interviewerType === "rendani"}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={!isFormValid()}>
              Start Interview Session
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewerSetup;
