
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Home } from "lucide-react";

interface DashboardProps {
  onGoToLanding: () => void;
}

export const Dashboard = ({ onGoToLanding }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Interview Dashboard</h1>
          <Button variant="outline" onClick={onGoToLanding} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No interviews found</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Analytics coming soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
