import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, Save, Home, Database, CheckCircle, SkipForward, LogOut, Play } from "lucide-react";
import { Question, SurveyResponse } from "../types/survey";
import { SURVEY_QUESTIONS } from "../data/questions";
import { SURVEY_CATEGORIES } from "../types/survey";

interface QuestionInterfaceProps {
  categoryCode: string;
  responses: SurveyResponse[];
  onResponseChange: (questionId: string, answer: string) => void;
  onBack: () => void;
  onSave: () => void;
  onCategorySaveAndNext: (categoryCode: string) => void;
  onMoveToNextCategory?: (categoryCode: string) => void;
  onNavigateToPreviousCategory?: () => void;
  onNavigateToNextCategory?: () => void;
}

const QuestionInterface = ({ 
  categoryCode, 
  responses, 
  onResponseChange, 
  onBack,
  onSave,
  onCategorySaveAndNext,
  onMoveToNextCategory,
  onNavigateToPreviousCategory,
  onNavigateToNextCategory
}: QuestionInterfaceProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === categoryCode);
  const currentQuestion = categoryQuestions[currentQuestionIndex];
  const category = SURVEY_CATEGORIES.find(c => c.code === categoryCode);
  
  const progress = ((currentQuestionIndex + 1) / categoryQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === categoryQuestions.length - 1;
  const hasAnsweredCurrentQuestion = currentAnswer && currentAnswer.trim() !== "";

  // Reset to question 1 when category changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [categoryCode]);

  useEffect(() => {
    if (currentQuestion) {
      const existingResponse = responses.find(r => r.questionId === currentQuestion.id);
      const response = existingResponse?.answer || "";
      
      // Check if it's a custom "Other" response
      if (currentQuestion.options?.includes('Other') && response && !currentQuestion.options.includes(response)) {
        setCurrentAnswer('Other');
        setCustomInput(response);
      } else {
        setCurrentAnswer(response);
        setCustomInput("");
      }
    }
  }, [currentQuestion, responses]);

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
    if (currentQuestion) {
      if (value === 'Other') {
        // Don't save yet, wait for custom input
        setCustomInput("");
      } else {
        onResponseChange(currentQuestion.id, value);
        setCustomInput("");
      }
    }
  };

  const handleCustomInputChange = (value: string) => {
    setCustomInput(value);
    if (currentQuestion && currentAnswer === 'Other') {
      onResponseChange(currentQuestion.id, value);
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestion) {
      onResponseChange(currentQuestion.id, "SKIPPED");
      setCurrentAnswer("SKIPPED");
      setCustomInput("");
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSaveAndNext = () => {
    onCategorySaveAndNext(categoryCode);
    setShowSuccessDialog(true);
  };

  const handleContinueToNext = () => {
    setShowSuccessDialog(false);
    if (onMoveToNextCategory) {
      onMoveToNextCategory(categoryCode);
    }
  };

  const handleSaveProgress = () => {
    onSave();
    setShowSaveDialog(true);
  };

  const handleExitInterview = () => {
    setShowSaveDialog(false);
    onBack();
  };

  const handleContinueInterview = () => {
    setShowSaveDialog(false);
  };

  const getNextCategoryName = () => {
    const currentIndex = SURVEY_CATEGORIES.findIndex(c => c.code === categoryCode);
    if (currentIndex < SURVEY_CATEGORIES.length - 1) {
      return SURVEY_CATEGORIES[currentIndex + 1].name;
    }
    return "Dashboard";
  };

  const isLastCategory = () => {
    const currentIndex = SURVEY_CATEGORIES.findIndex(c => c.code === categoryCode);
    return currentIndex === SURVEY_CATEGORIES.length - 1;
  };

  const isCategorySkipped = () => {
    const categoryResponses = responses.filter(r => 
      categoryQuestions.some(q => q.id === r.questionId)
    );
    return categoryResponses.length > 0 && categoryResponses.every(r => r.answer === "N/A");
  };

  const getQuestionStatus = (questionId: string) => {
    // If the entire category is skipped, all questions should show as skipped
    if (isCategorySkipped()) {
      return "skipped";
    }
    
    const response = responses.find(r => r.questionId === questionId);
    if (!response || response.answer.trim() === "") {
      return "unanswered";
    }
    if (response.answer === "SKIPPED") {
      return "skipped";
    }
    return "answered";
  };

  const renderQuestionInput = () => {
    // Don't render input if question is skipped
    if (currentAnswer === "SKIPPED") {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-4">This question has been skipped</div>
          <Button 
            variant="outline" 
            onClick={() => {
              setCurrentAnswer("");
              onResponseChange(currentQuestion.id, "");
            }}
            className="text-blue-600 hover:text-blue-700"
          >
            Answer This Question
          </Button>
        </div>
      );
    }

    const questionType = currentQuestion.type || 'textarea';
    
    switch (questionType) {
      case 'text':
        return (
          <Input
            placeholder="Enter your answer..."
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="text-base md:text-lg"
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            placeholder="Enter a number..."
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="text-base md:text-lg"
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="text-base md:text-lg"
          />
        );
      
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <Select value={currentAnswer} onValueChange={handleAnswerChange}>
              <SelectTrigger className="text-base md:text-lg">
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {currentAnswer === 'Other' && (
              <Input
                placeholder="Please specify..."
                value={customInput}
                onChange={(e) => handleCustomInputChange(e.target.value)}
                className="text-base md:text-lg"
              />
            )}
          </div>
        );
      
      case 'yes_no':
        return (
          <RadioGroup value={currentAnswer} onValueChange={handleAnswerChange} className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="yes" />
              <Label htmlFor="yes" className="text-base md:text-lg cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="no" />
              <Label htmlFor="no" className="text-base md:text-lg cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        );
      
      case 'textarea':
      default:
        return (
          <Textarea
            placeholder="Please provide a detailed response..."
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="min-h-[120px] md:min-h-[150px] text-base md:text-lg resize-none"
          />
        );
    }
  };

  const navigateToPreviousCategory = () => {
    if (onNavigateToPreviousCategory) {
      onNavigateToPreviousCategory();
    }
  };

  const navigateToNextCategory = () => {
    if (onNavigateToNextCategory) {
      onNavigateToNextCategory();
    }
  };

  if (!currentQuestion || !category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 self-start text-xs h-8 px-2">
          <Home className="h-3 w-3" />
          <span className="hidden sm:inline">Back to Categories</span>
          <span className="sm:hidden">Back</span>
        </Button>
        <Button onClick={handleSaveProgress} className="flex items-center gap-2 self-start sm:self-auto text-xs h-8 px-2">
          <Save className="h-3 w-3" />
          Save Progress
        </Button>
      </div>

      {/* Save Progress Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Progress Saved Successfully!
            </DialogTitle>
            <DialogDescription>
              Your progress has been saved. What would you like to do next?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleExitInterview}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4" />
              Exit & Continue Later
            </Button>
            <Button
              onClick={handleContinueInterview}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Play className="h-4 w-4" />
              Continue Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Navigation - Fixed for mobile */}
      <div className="bg-white rounded-lg shadow-sm p-2">
        <div className="grid grid-cols-3 gap-1 items-center">
          <Button
            variant="outline"
            onClick={navigateToPreviousCategory}
            disabled={SURVEY_CATEGORIES.findIndex(c => c.code === categoryCode) === 0}
            className="flex items-center justify-center gap-1 text-xs px-2 py-1 h-8"
          >
            <ArrowLeft className="h-3 w-3" />
            <span className="hidden xs:inline">Prev</span>
          </Button>
          
          <div className="text-xs font-medium text-gray-700 text-center px-1 leading-tight">
            {category.name}
          </div>
          
          <Button
            variant="outline"
            onClick={navigateToNextCategory}
            disabled={SURVEY_CATEGORIES.findIndex(c => c.code === categoryCode) === SURVEY_CATEGORIES.length - 1}
            className="flex items-center justify-center gap-1 text-xs px-2 py-1 h-8"
          >
            <span className="hidden xs:inline">Next</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium">{category.name}</span>
          <span>{currentQuestionIndex + 1} of {categoryQuestions.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full ${category.color} flex-shrink-0 mt-1`}></div>
            <CardTitle className="text-lg md:text-xl leading-tight">
              {currentQuestion.id}: {currentQuestion.question}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderQuestionInput()}

          {/* Skip Button */}
          {currentAnswer !== "SKIPPED" && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={handleSkipQuestion}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
              >
                <SkipForward className="h-4 w-4" />
                Skip This Question
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="text-sm text-gray-500 text-center sm:order-none order-first">
              Question {currentQuestionIndex + 1} of {categoryQuestions.length}
            </div>
            
            {!isLastQuestion ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    onClick={handleSaveAndNext}
                    className="flex items-center gap-2 w-full sm:w-auto bg-green-600 hover:bg-green-700"
                  >
                    <Database className="h-4 w-4" />
                    Save & Complete Category
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-md text-center">
                  <AlertDialogHeader className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <AlertDialogTitle className="text-2xl font-semibold text-gray-900 text-center">
                      Category Saved!
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-sm text-gray-500 font-light">
                      {isLastCategory() 
                        ? "All categories completed!"
                        : `Continue to ${getNextCategoryName()}`
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex justify-center">
                    <AlertDialogAction 
                      onClick={handleContinueToNext}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 text-lg mx-auto"
                    >
                      {isLastCategory() ? "View Dashboard" : "Continue"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {categoryQuestions.map((question, index) => {
              const status = getQuestionStatus(question.id);
              const isCurrent = index === currentQuestionIndex;
              
              let buttonClasses = "h-10 text-xs md:text-sm ";
              let variant: "default" | "secondary" | "outline" | "ghost" = "outline";
              
              if (isCurrent) {
                variant = "default";
                buttonClasses += "ring-2 ring-blue-500";
              } else if (status === "answered") {
                variant = "secondary";
                buttonClasses += "bg-green-500 hover:bg-green-600 text-white border-green-500";
              } else if (status === "skipped") {
                variant = "ghost";
                buttonClasses += "bg-gray-400 hover:bg-gray-500 text-white border-gray-400";
              } else {
                variant = "outline";
                buttonClasses += "bg-white hover:bg-gray-50 border-gray-300";
              }
              
              return (
                <Button
                  key={question.id}
                  variant={variant}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={buttonClasses}
                >
                  {index + 1}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionInterface;
