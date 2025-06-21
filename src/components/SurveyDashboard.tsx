
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, Clock, CheckCircle } from "lucide-react";
import { InterviewSession, SurveyResponse } from "../types/survey";
import { SURVEY_QUESTIONS } from "../data/questions";
import { SURVEY_CATEGORIES } from "../types/survey";

interface SurveyDashboardProps {
  session: InterviewSession;
  onExport: () => void;
}

const SurveyDashboard = ({ session, onExport }: SurveyDashboardProps) => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    completionPercentage: 0,
    categoriesCompleted: 0
  });

  useEffect(() => {
    const totalQuestions = SURVEY_QUESTIONS.length;
    const answeredQuestions = session.responses.filter(r => r.answer.trim() !== "").length;
    const completionPercentage = (answeredQuestions / totalQuestions) * 100;
    const categoriesCompleted = session.completedCategories.length;

    setStats({
      totalQuestions,
      answeredQuestions,
      completionPercentage,
      categoriesCompleted
    });
  }, [session]);

  const formatDuration = (startTime: Date, endTime: Date) => {
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`;
    }
    return `${diffMins}m`;
  };

  const getCategoryStats = () => {
    return SURVEY_CATEGORIES.map(category => {
      const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === category.code);
      const answeredInCategory = session.responses.filter(r => 
        categoryQuestions.some(q => q.id === r.questionId) && r.answer.trim() !== ""
      ).length;
      
      return {
        ...category,
        total: categoryQuestions.length,
        answered: answeredInCategory,
        completion: (answeredInCategory / categoryQuestions.length) * 100
      };
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Dashboard</h1>
        <p className="text-gray-600">Survey progress and session overview</p>
      </div>

      {/* Session Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Session Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Platform</label>
              <p className="text-lg font-semibold">{session.platformName || "Not specified"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Employment Type</label>
              <p className="text-lg font-semibold">{session.employmentType || "Not specified"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Interview Code</label>
              <p className="text-lg font-semibold">{session.interviewCode || session.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Duration</label>
              <p className="text-lg font-semibold flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(session.startTime, session.lastUpdated)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Questions Answered</span>
              <span className="text-sm text-gray-600">
                {stats.answeredQuestions} / {stats.totalQuestions}
              </span>
            </div>
            <Progress value={stats.completionPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{stats.completionPercentage.toFixed(1)}% Complete</span>
              <span>{stats.categoriesCompleted} / {SURVEY_CATEGORIES.length} Categories</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Progress */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Category Progress</CardTitle>
            <Button onClick={onExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCategoryStats().map((category) => (
              <Card key={category.code} className="border-l-4" style={{ borderLeftColor: category.color.replace('bg-', '#') }}>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{category.name}</span>
                      {category.completion === 100 && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{category.answered} / {category.total}</span>
                      <span>{category.completion.toFixed(0)}%</span>
                    </div>
                    <Progress value={category.completion} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyDashboard;
