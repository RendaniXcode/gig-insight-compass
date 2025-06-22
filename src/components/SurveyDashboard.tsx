import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, Clock, CheckCircle, User, Mail, Calendar, Play, SkipForward, List } from "lucide-react";
import { InterviewSession, SurveyResponse } from "../types/survey";
import { SURVEY_QUESTIONS } from "../data/questions";
import { SURVEY_CATEGORIES } from "../types/survey";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SurveyDashboardProps {
  session: InterviewSession;
  onExport: () => void;
  onContinueInterview?: () => void;
  onCategorySelect?: (categoryCode: string) => void;
  onSkipCategory?: (categoryCode: string) => void;
  onLoadInterview?: (sessionId: string) => void;
}

const SurveyDashboard = ({ 
  session, 
  onExport, 
  onContinueInterview, 
  onCategorySelect,
  onSkipCategory,
  onLoadInterview
}: SurveyDashboardProps) => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    completionPercentage: 0,
    categoriesCompleted: 0
  });
  const [allInterviews, setAllInterviews] = useState<InterviewSession[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<InterviewSession | null>(null);

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

  useEffect(() => {
    // Load all interview sessions from localStorage
    const loadAllInterviews = () => {
      const interviews: InterviewSession[] = [];
      
      // Get all keys from localStorage that start with 'interview_session_'
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('interview_session_')) {
          try {
            const savedSession = localStorage.getItem(key);
            if (savedSession) {
              const parsed = JSON.parse(savedSession);
              const restoredSession = {
                ...parsed,
                startTime: new Date(parsed.startTime),
                endTime: parsed.endTime ? new Date(parsed.endTime) : undefined,
                lastUpdated: new Date(parsed.lastUpdated)
              };
              interviews.push(restoredSession);
            }
          } catch (error) {
            console.error('Error loading interview session:', error);
          }
        }
      }
      
      // Sort by last updated (most recent first)
      interviews.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
      setAllInterviews(interviews);
    };

    loadAllInterviews();
  }, [session.lastUpdated]);

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const diffMs = end.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`;
    }
    return `${diffMins}m`;
  };

  const getStatusBadge = () => {
    switch (session.status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'in-progress':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={onContinueInterview}
            className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 hover:border-yellow-600 flex items-center gap-1"
          >
            <Play className="h-3 w-3" />
            In Progress - Continue
          </Button>
        );
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Not Started</Badge>;
    }
  };

  const getInterviewStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600 text-xs">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">In Progress</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600 text-xs">Not Started</Badge>;
    }
  };

  const getInterviewProgress = (interview: InterviewSession) => {
    const answeredQuestions = interview.responses.filter(r => r.answer.trim() !== "").length;
    return Math.round((answeredQuestions / SURVEY_QUESTIONS.length) * 100);
  };

  const getCategoryStats = () => {
    const targetSession = selectedInterview || session;
    return SURVEY_CATEGORIES.map(category => {
      const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === category.code);
      const categoryResponses = targetSession.responses.filter(r => 
        categoryQuestions.some(q => q.id === r.questionId)
      );
      
      const answeredInCategory = categoryResponses.filter(r => r.answer.trim() !== "").length;
      
      // Check if category was skipped (all questions answered with "N/A")
      const skippedInCategory = categoryResponses.filter(r => r.answer.trim() === "N/A").length;
      const isSkipped = skippedInCategory === categoryQuestions.length && skippedInCategory > 0;
      
      // Category is completed if all questions are answered OR if it's skipped
      const isCompleted = answeredInCategory === categoryQuestions.length || isSkipped;
      
      // Determine status for coloring
      let status = 'not-answered';
      if (isSkipped) {
        status = 'skipped';
      } else if (isCompleted) {
        status = 'completed';
      } else if (answeredInCategory > 0) {
        status = 'partial';
      }
      
      return {
        ...category,
        total: categoryQuestions.length,
        answered: answeredInCategory,
        skipped: isSkipped,
        completion: (answeredInCategory / categoryQuestions.length) * 100,
        isCompleted,
        status
      };
    });
  };

  const handleCategoryClick = (categoryCode: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryCode);
    }
  };

  const handleSkipCategory = (categoryCode: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent category click
    if (onSkipCategory) {
      onSkipCategory(categoryCode);
    }
  };

  const handleInterviewClick = (interview: InterviewSession) => {
    if (selectedInterview?.id === interview.id) {
      // If clicking the same interview, deselect it
      setSelectedInterview(null);
    } else {
      // Select the new interview
      setSelectedInterview(interview);
    }
    
    // Only load the interview if it's different from current session
    if (onLoadInterview && interview.id !== session.id) {
      onLoadInterview(interview.id);
    }
  };

  const getSelectedInterviewStats = () => {
    if (!selectedInterview) return null;
    
    const totalQuestions = SURVEY_QUESTIONS.length;
    const answeredQuestions = selectedInterview.responses.filter(r => r.answer.trim() !== "").length;
    const completionPercentage = (answeredQuestions / totalQuestions) * 100;
    const categoriesCompleted = selectedInterview.completedCategories.length;

    return {
      totalQuestions,
      answeredQuestions,
      completionPercentage,
      categoriesCompleted
    };
  };

  const getSelectedStatusBadge = () => {
    if (!selectedInterview) return null;
    
    switch (selectedInterview.status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'in-progress':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectedInterview.id === session.id ? onContinueInterview?.() : onLoadInterview?.(selectedInterview.id)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 hover:border-yellow-600 flex items-center gap-1"
          >
            <Play className="h-3 w-3" />
            In Progress - Continue
          </Button>
        );
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Not Started</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Dashboard</h1>
        <p className="text-gray-600">Survey progress and session overview</p>
      </div>

      {/* Interview List Section with Accordion */}
      <Card>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="interviews" className="border-none">
            <CardHeader className="pb-0">
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  All Interviews
                </CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent>
                {allInterviews.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Interviewer</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Interview Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allInterviews.map((interview, index) => (
                        <TableRow 
                          key={interview.id} 
                          className={`cursor-pointer hover:bg-gray-50 ${
                            selectedInterview?.id === interview.id ? 'bg-blue-100' : 
                            interview.id === session.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleInterviewClick(interview)}
                        >
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{interview.interviewer}</TableCell>
                          <TableCell>{interview.platformName || "Not specified"}</TableCell>
                          <TableCell>{interview.interviewCode || interview.id.slice(-8)}</TableCell>
                          <TableCell>{getInterviewStatusBadge(interview.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={getInterviewProgress(interview)} className="w-16 h-2" />
                              <span className="text-xs text-gray-600">{getInterviewProgress(interview)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{interview.interviewDate}</TableCell>
                          <TableCell>{formatDuration(interview.startTime, interview.endTime)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No interviews found</p>
                  </div>
                )}
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Current Interview Status - Only show when an interview is selected */}
      {selectedInterview && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Current Interview Status
              </CardTitle>
              {getSelectedStatusBadge()}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Interviewer Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Interviewer</label>
                  <p className="text-lg font-semibold">{selectedInterview.interviewer}</p>
                </div>
              </div>
              {selectedInterview.interviewerEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg font-semibold">{selectedInterview.interviewerEmail}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-lg font-semibold">{selectedInterview.interviewDate}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Session Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Platform</label>
                <p className="text-lg font-semibold">{selectedInterview.platformName || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employment Type</label>
                <p className="text-lg font-semibold">{selectedInterview.employmentType || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Interview Code</label>
                <p className="text-lg font-semibold">{selectedInterview.interviewCode || selectedInterview.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Duration</label>
                <p className="text-lg font-semibold flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDuration(selectedInterview.startTime, selectedInterview.endTime)}
                </p>
              </div>
            </div>
            
            {/* Time Tracking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Started At</label>
                <p className="text-sm">{selectedInterview.startTime.toLocaleString()}</p>
              </div>
              {selectedInterview.endTime && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Completed At</label>
                  <p className="text-sm">{selectedInterview.endTime.toLocaleString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Progress - Show for selected interview or current session */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedInterview ? 'Selected Interview Progress' : 'Overall Progress'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(() => {
              const currentStats = selectedInterview ? getSelectedInterviewStats() : stats;
              if (!currentStats) return null;
              
              return (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Questions Answered</span>
                    <span className="text-sm text-gray-600">
                      {currentStats.answeredQuestions} / {currentStats.totalQuestions}
                    </span>
                  </div>
                  <Progress value={currentStats.completionPercentage} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{currentStats.completionPercentage.toFixed(1)}% Complete</span>
                    <span>{currentStats.categoriesCompleted} / {SURVEY_CATEGORIES.length} Categories</span>
                  </div>
                </>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Category Progress */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {selectedInterview ? 'Selected Interview Categories' : 'Category Progress'}
            </CardTitle>
            <Button onClick={onExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCategoryStats().map((category) => {
              // Determine card background and border color based on status
              let cardClasses = "border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ";
              let borderColor = category.color.replace('bg-', '#');
              
              switch (category.status) {
                case 'completed':
                  cardClasses += "bg-green-50 border-green-500";
                  borderColor = '#22c55e';
                  break;
                case 'skipped':
                  cardClasses += "bg-gray-100 border-gray-400";
                  borderColor = '#9ca3af';
                  break;
                case 'partial':
                  cardClasses += "bg-yellow-50 border-yellow-500";
                  borderColor = '#eab308';
                  break;
                default:
                  cardClasses += "bg-white border-gray-300 hover:bg-blue-50";
                  borderColor = '#d1d5db';
              }
              
              return (
                <Card 
                  key={category.code} 
                  className={cardClasses}
                  style={{ borderLeftColor: borderColor }}
                  onClick={() => handleCategoryClick(category.code)}
                >
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm leading-tight pr-2">{category.name}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {category.isCompleted && !category.skipped && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {category.skipped && (
                            <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700">
                              Skipped
                            </Badge>
                          )}
                          {category.status === 'partial' && (
                            <Badge variant="secondary" className="text-xs bg-yellow-200 text-yellow-800">
                              Partial
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>
                          {category.skipped ? 'N/A' : `${category.answered} / ${category.total}`}
                        </span>
                        <span>
                          {category.skipped ? 'Skipped' : `${category.completion.toFixed(0)}%`}
                        </span>
                      </div>
                      
                      {!category.skipped && (
                        <Progress value={category.completion} className="h-2" />
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs h-7"
                          onClick={() => handleCategoryClick(category.code)}
                        >
                          {category.isCompleted ? 'Review' : 'Start'}
                        </Button>
                        
                        {!category.isCompleted && !category.skipped && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex items-center gap-1 text-xs h-7 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            onClick={(e) => handleSkipCategory(category.code, e)}
                          >
                            <SkipForward className="h-3 w-3" />
                            Skip
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyDashboard;
