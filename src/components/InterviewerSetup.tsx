
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail } from "lucide-react";

interface InterviewerSetupProps {
  onSetup: (interviewer: string, email?: string) => void;
}

const InterviewerSetup = ({ onSetup }: InterviewerSetupProps) => {
  const [interviewer, setInterviewer] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interviewer.trim()) {
      onSetup(interviewer.trim(), email.trim() || undefined);
    }
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
              <Label htmlFor="interviewer" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Interviewer Name *
              </Label>
              <Input
                id="interviewer"
                type="text"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                placeholder="Enter interviewer name"
                required
              />
            </div>
            
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
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={!interviewer.trim()}>
              Start Interview Session
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewerSetup;
