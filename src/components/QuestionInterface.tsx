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
import { ArrowLeft, ArrowRight, Save, Home, Database, CheckCircle } from "lucide-react";
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
}

const QuestionInterface = ({ 
  categoryCode, 
  responses, 
  onResponseChange, 
  onBack,
  onSave,
  onCategorySaveAndNext,
  onMoveToNextCategory
}: QuestionInterfaceProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === categoryCode);
  const currentQuestion = categoryQuestions[currentQuestionIndex];
  const category = SURVEY_CATEGORIES.find(c => c.code === categoryCode);
  
  const progress = ((currentQuestionIndex + 1) / categoryQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === categoryQuestions.length - 1;
  const hasAnsweredCurrentQuestion = currentAnswer && currentAnswer.trim() !== "";

  useEffect(() => {
    if (currentQuestion) {
      const existingResponse = responses.find(r => r.questionId === currentQuestion.id);
      setCurrentAnswer(existingResponse?.answer || "");
    }
  }, [currentQuestion, responses]);

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
    if (currentQuestion) {
      onResponseChange(currentQuestion.id, value);
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

  const renderQuestionInput = () => {
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
      
      case 'dropdown':
        return (
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
        );
      
      case 'yesno':
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

  if (!currentQuestion || !category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 self-start">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Categories</span>
          <span className="sm:hidden">Back</span>
        </Button>
        <Button onClick={onSave} className="flex items-center gap-2 self-start sm:self-auto">
          <Save className="h-4 w-4" />
          Save Progress
        </Button>
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
                    disabled={!hasAnsweredCurrentQuestion}
                    className="flex items-center gap-2 w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                  >
                    <Database className="h-4 w-4" />
                    {hasAnsweredCurrentQuestion ? "Save & Complete Category" : "Answer Question to Continue"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                      Category Saved Successfully!
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-gray-600 space-y-3">
                      <p>Great work! You've completed the <strong>{category.name}</strong> category.</p>
                      {!isLastCategory() ? (
                        <p>Ready to continue to the next category: <strong>{getNextCategoryName()}</strong>?</p>
                      ) : (
                        <p>You've completed all categories! Ready to view your dashboard?</p>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <AlertDialogCancel className="sm:mr-2">
                      Stay Here
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleContinueToNext}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLastCategory() ? "Go to Dashboard" : `Continue to ${getNextCategoryName()}`}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {categoryQuestions.map((question, index) => {
              const hasResponse = responses.some(r => r.questionId === question.id && r.answer.trim() !== "");
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <Button
                  key={question.id}
                  variant={isCurrent ? "default" : hasResponse ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`h-10 text-xs md:text-sm ${isCurrent ? 'ring-2 ring-blue-500' : ''}`}
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
