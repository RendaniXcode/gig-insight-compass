import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Clock, CheckCircle, User, Mail, Calendar, Play, SkipForward, List, Edit2, Save, X } from "lucide-react";
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
  onUpdateSession?: (updates: Partial<InterviewSession>) => void;
}

const PLATFORM_OPTIONS = [
  "UBER",
  "BOLT", 
  "iDrive",
  "Shesha",
  "Other"
];

const EMPLOYMENT_TYPE_OPTIONS = [
  "Employee",
  "Freelancer", 
  "Contractor",
  "Other"
];

const SurveyDashboard = ({ 
  session, 
  onExport, 
  onContinueInterview, 
  onCategorySelect,
  onSkipCategory,
  onLoadInterview,
  onUpdateSession
}: SurveyDashboardProps) => {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    completionPercentage: 0,
    categoriesCompleted: 0
  });
  const [allInterviews, setAllInterviews] = useState<InterviewSession[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<InterviewSession | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    platformName: '',
    employmentType: '',
    interviewCode: ''
  });
  const [customPlatform, setCustomPlatform] = useState('');
  const [customEmploymentType, setCustomEmploymentType] = useState('');
  const [showCustomPlatform, setShowCustomPlatform] = useState(false);
  const [showCustomEmploymentType, setShowCustomEmploymentType] = useState(false);

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

  // Initialize edit values when selectedInterview changes
  useEffect(() => {
    const targetSession = selectedInterview || session;
    setEditValues({
      platformName: targetSession.platformName || '',
      employmentType: targetSession.employmentType || '',
      interviewCode: targetSession.interviewCode || ''
    });
    
    // Check if current values are custom (not in predefined options)
    const isCustomPlatform = targetSession.platformName && !PLATFORM_OPTIONS.includes(targetSession.platformName);
    const isCustomEmployment = targetSession.employmentType && !EMPLOYMENT_TYPE_OPTIONS.includes(targetSession.employmentType);
    
    setShowCustomPlatform(isCustomPlatform);
    setShowCustomEmploymentType(isCustomEmployment);
    
    if (isCustomPlatform) {
      setCustomPlatform(targetSession.platformName || '');
    }
    if (isCustomEmployment) {
      setCustomEmploymentType(targetSession.employmentType || '');
    }
  }, [selectedInterview, session]);

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    const targetSession = selectedInterview || session;
    setEditValues({
      platformName: targetSession.platformName || '',
      employmentType: targetSession.employmentType || '',
      interviewCode: targetSession.interviewCode || ''
    });
    
    // Reset custom input states
    const isCustomPlatform = targetSession.platformName && !PLATFORM_OPTIONS.includes(targetSession.platformName);
    const isCustomEmployment = targetSession.employmentType && !EMPLOYMENT_TYPE_OPTIONS.includes(targetSession.employmentType);
    
    setShowCustomPlatform(isCustomPlatform);
    setShowCustomEmploymentType(isCustomEmployment);
    setCustomPlatform(isCustomPlatform ? targetSession.platformName || '' : '');
    setCustomEmploymentType(isCustomEmployment ? targetSession.employmentType || '' : '');
    
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    // Determine final values (use custom input if "Other" is selected)
    const finalPlatformName = showCustomPlatform ? customPlatform : editValues.platformName;
    const finalEmploymentType = showCustomEmploymentType ? customEmploymentType : editValues.employmentType;
    
    if (selectedInterview) {
      // Update the selected interview
      const updatedInterview = {
        ...selectedInterview,
        platformName: finalPlatformName,
        employmentType: finalEmploymentType,
        interviewCode: editValues.interviewCode,
        lastUpdated: new Date()
      };
      
      // Save to localStorage
      localStorage.setItem(`interview_session_${selectedInterview.id}`, JSON.stringify(updatedInterview));
      
      // Update the selected interview state
      setSelectedInterview(updatedInterview);
      
      // Update the interviews list
      setAllInterviews(prev => prev.map(interview => 
        interview.id === selectedInterview.id ? updatedInterview : interview
      ));
    } else {
      // Update the current session
      if (onUpdateSession) {
        onUpdateSession({
          platformName: finalPlatformName,
          employmentType: finalEmploymentType,
          interviewCode: editValues.interviewCode
        });
      }
    }
    
    setIsEditing(false);
  };

  const handlePlatformChange = (value: string) => {
    if (value === "Other") {
      setShowCustomPlatform(true);
      setEditValues(prev => ({ ...prev, platformName: "Other" }));
    } else {
      setShowCustomPlatform(false);
      setEditValues(prev => ({ ...prev, platformName: value }));
    }
  };

  const handleEmploymentTypeChange = (value: string) => {
    if (value === "Other") {
      setShowCustomEmploymentType(true);
      setEditValues(prev => ({ ...prev, employmentType: "Other" }));
    } else {
      setShowCustomEmploymentType(false);
      setEditValues(prev => ({ ...prev, employmentType: value }));
    }
  };

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

  const getInterviewStatusBadge = (interview: InterviewSession) => {
    switch (interview.status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600 text-xs">Done</Badge>;
      case 'in-progress':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (interview.id === session.id) {
                onContinueInterview?.();
              } else {
                onLoadInterview?.(interview.id);
              }
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 hover:border-yellow-600 flex items-center gap-1 text-xs h-6 px-2"
          >
            <Play className="h-3 w-3" />
            Continue
          </Button>
        );
      case 'not-started':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (interview.id === session.id) {
                onContinueInterview?.();
              } else {
                onLoadInterview?.(interview.id);
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600 flex items-center gap-1 text-xs h-6 px-2"
          >
            <Play className="h-3 w-3" />
            Start
          </Button>
        );
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600 text-xs">Unknown</Badge>;
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
    // Only allow navigation for the current active session, not for selected interview viewing
    if (!selectedInterview && onCategorySelect) {
      onCategorySelect(categoryCode);
    }
  };

  const handleSkipCategory = (categoryCode: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent category click
    // Only allow skipping for the current active session, not for selected interview viewing
    if (!selectedInterview && onSkipCategory) {
      onSkipCategory(categoryCode);
    }
  };

  const handleInterviewClick = (interview: InterviewSession) => {
    if (selectedInterview?.id === interview.id) {
      // If clicking the same interview, deselect it
      setSelectedInterview(null);
    } else {
      // Select the new interview for viewing details only
      setSelectedInterview(interview);
    }
    
    // Reset editing state when switching interviews
    setIsEditing(false);
    
    // Don't automatically load/navigate - just show the details
    // Users can click the "Continue" button if they want to actually load it
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
        return <Badge className="bg-green-500 hover:bg-green-600">Completed (View Only)</Badge>;
      case 'in-progress':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Only load the interview when the Continue button is clicked
              if (selectedInterview.id === session.id) {
                onContinueInterview?.();
              } else {
                onLoadInterview?.(selectedInterview.id);
              }
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500 hover:border-yellow-600 flex items-center gap-1"
          >
            <Play className="h-3 w-3" />
            In Progress - Continue
          </Button>
        );
      case 'not-started':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Only load the interview when the Start button is clicked
              if (selectedInterview.id === session.id) {
                onContinueInterview?.();
              } else {
                onLoadInterview?.(selectedInterview.id);
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600 flex items-center gap-1"
          >
            <Play className="h-3 w-3" />
            Start Interview
          </Button>
        );
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown Status</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-2">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Interview Dashboard</h1>
        <p className="text-sm text-gray-600">Survey progress and session overview</p>
      </div>

      {/* Interview List Section with Accordion - Mobile Optimized */}
      <Card>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="interviews" className="border-none">
            <CardHeader className="pb-0">
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <List className="h-4 w-4" />
                  All Interviews
                </CardTitle>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="p-2">
                {allInterviews.length > 0 ? (
                  <div className="space-y-2">
                    {/* Mobile Card Layout - Replace Table */}
                    <div className="block">
                      {allInterviews.map((interview, index) => (
                        <div 
                          key={interview.id} 
                          className={`border rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedInterview?.id === interview.id ? 'bg-blue-100 border-blue-300' : 
                            interview.id === session.id ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                          }`}
                          onClick={() => handleInterviewClick(interview)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">#{index + 1}</span>
                              <span className="text-sm font-medium truncate">{interview.interviewer}</span>
                            </div>
                            {getInterviewStatusBadge(interview)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>
                              <span className="font-medium">Platform:</span> {interview.platformName || "Not specified"}
                            </div>
                            <div>
                              <span className="font-medium">Code:</span> {interview.interviewCode || interview.id.slice(-8)}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {interview.interviewDate}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {formatDuration(interview.startTime, interview.endTime)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Progress value={getInterviewProgress(interview)} className="flex-1 h-1.5" />
                            <span className="text-xs text-gray-600 min-w-fit">{getInterviewProgress(interview)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-4 w-4" />
                Current Interview Status
              </CardTitle>
              <div className="flex items-center gap-2">
                {getSelectedStatusBadge()}
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStartEdit}
                    className="flex items-center gap-1 text-xs h-7"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1 text-xs h-7 text-green-600 border-green-500 hover:bg-green-50"
                    >
                      <Save className="h-3 w-3" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 text-xs h-7 text-red-600 border-red-500 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {/* Interviewer Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                <div>
                  <label className="text-xs font-medium text-gray-500">Interviewer</label>
                  <p className="text-sm font-semibold">{selectedInterview.interviewer}</p>
                </div>
              </div>
              {selectedInterview.interviewerEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <div>
                    <label className="text-xs font-medium text-gray-500">Email</label>
                    <p className="text-sm font-semibold truncate">{selectedInterview.interviewerEmail}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div>
                  <label className="text-xs font-medium text-gray-500">Date</label>
                  <p className="text-sm font-semibold">{selectedInterview.interviewDate}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Session Information - Editable Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs font-medium text-gray-500">Platform</Label>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    <Select value={showCustomPlatform ? "Other" : editValues.platformName} onValueChange={handlePlatformChange}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {PLATFORM_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {showCustomPlatform && (
                      <Input
                        value={customPlatform}
                        onChange={(e) => setCustomPlatform(e.target.value)}
                        placeholder="Enter custom platform"
                        className="h-8 text-xs"
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-semibold mt-1">{selectedInterview.platformName || "Not specified"}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-500">Employment Type</Label>
                {isEditing ? (
                  <div className="space-y-2 mt-1">
                    <Select value={showCustomEmploymentType ? "Other" : editValues.employmentType} onValueChange={handleEmploymentTypeChange}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {showCustomEmploymentType && (
                      <Input
                        value={customEmploymentType}
                        onChange={(e) => setCustomEmploymentType(e.target.value)}
                        placeholder="Enter custom employment type"
                        className="h-8 text-xs"
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-semibold mt-1">{selectedInterview.employmentType || "Not specified"}</p>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-500">Interview Code</Label>
                {isEditing ? (
                  <Input
                    value={editValues.interviewCode}
                    onChange={(e) => setEditValues(prev => ({ ...prev, interviewCode: e.target.value }))}
                    placeholder="Enter interview code"
                    className="mt-1 h-8 text-xs"
                  />
                ) : (
                  <p className="text-sm font-semibold mt-1">{selectedInterview.interviewCode || selectedInterview.id}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Duration</label>
                <p className="text-sm font-semibold flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(selectedInterview.startTime, selectedInterview.endTime)}
                </p>
              </div>
            </div>
            
            {/* Time Tracking Details - Read Only */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-medium text-gray-500">Started At</label>
                <p className="text-xs">{selectedInterview.startTime.toLocaleString()}</p>
              </div>
              {selectedInterview.endTime && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Completed At</label>
                  <p className="text-xs">{selectedInterview.endTime.toLocaleString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Progress - Show for selected interview or current session */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {selectedInterview ? 'Selected Interview Progress' : 'Overall Progress'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
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
                  <Progress value={currentStats.completionPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-600">
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
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              {selectedInterview ? 'Selected Interview Categories' : 'Category Progress'}
            </CardTitle>
            <Button onClick={onExport} className="flex items-center gap-2 text-xs h-8">
              <Download className="h-3 w-3" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {getCategoryStats().map((category) => {
              // Determine card background and border color based on status
              let cardClasses = "border-l-4 transition-all duration-200 hover:shadow-md ";
              let borderColor = category.color.replace('bg-', '#');
              
              // Only make clickable if not viewing a selected interview
              if (!selectedInterview) {
                cardClasses += "cursor-pointer hover:scale-[1.02] ";
              }
              
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
                  cardClasses += "bg-white border-gray-300";
                  if (!selectedInterview) {
                    cardClasses += " hover:bg-blue-50";
                  }
                  borderColor = '#d1d5db';
              }
              
              return (
                <Card 
                  key={category.code} 
                  className={cardClasses}
                  style={{ borderLeftColor: borderColor }}
                  onClick={() => handleCategoryClick(category.code)}
                >
                  <CardContent className="pt-3 p-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-xs leading-tight pr-2">{category.name}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {category.isCompleted && !category.skipped && (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                          {category.skipped && (
                            <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700 px-1 py-0 h-4">
                              Skipped
                            </Badge>
                          )}
                          {category.status === 'partial' && (
                            <Badge variant="secondary" className="text-xs bg-yellow-200 text-yellow-800 px-1 py-0 h-4">
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
                        <Progress value={category.completion} className="h-1.5" />
                      )}
                      
                      {/* Only show action buttons if not viewing a selected interview */}
                      {!selectedInterview && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs h-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryClick(category.code);
                            }}
                          >
                            {category.isCompleted ? 'Review' : 'Start'}
                          </Button>
                          
                          {!category.isCompleted && !category.skipped && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex items-center gap-1 text-xs h-6 text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-2"
                              onClick={(e) => handleSkipCategory(category.code, e)}
                            >
                              <SkipForward className="h-3 w-3" />
                              Skip
                            </Button>
                          )}
                        </div>
                      )}
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
