import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Database, 
  CheckCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  SkipForward
} from "lucide-react";
import { SurveyResponse } from "../types/survey";
import { SURVEY_QUESTIONS } from "../data/questions";
import { SURVEY_CATEGORIES } from "../types/survey";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QuestionInterfaceProps {
  categoryCode: string;
  responses: SurveyResponse[];
  onResponseChange: (questionId: string, answer: string) => void;
  onBack: () => void;
  onSave: () => void;
  onCategorySaveAndNext: (categoryCode: string) => void;
  onMoveToNextCategory: (currentCategoryCode: string) => void;
  onNavigateToPreviousCategory: () => void;
  onNavigateToNextCategory: () => void;
  initialQuestionIndex?: number;
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
  onNavigateToNextCategory,
  initialQuestionIndex = 0
}: QuestionInterfaceProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialQuestionIndex);
  const [currentAnswer, setCurrentAnswer] = useState('');

  // Get questions for the current category
  const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === categoryCode);
  const currentQuestion = categoryQuestions[currentQuestionIndex];
  const category = SURVEY_CATEGORIES.find(c => c.code === categoryCode);

  // Update question index when initialQuestionIndex changes
  useEffect(() => {
    setCurrentQuestionIndex(initialQuestionIndex);
  }, [initialQuestionIndex]);

  // Load existing response when question changes
  useEffect(() => {
    if (currentQuestion) {
      const existingResponse = responses.find(r => r.questionId === currentQuestion.id);
      setCurrentAnswer(existingResponse?.answer || '');
    }
  }, [currentQuestion, responses]);

  // Auto-save response when answer changes
  useEffect(() => {
    if (currentQuestion && currentAnswer !== '') {
      onResponseChange(currentQuestion.id, currentAnswer);
      onSave();
    }
  }, [currentAnswer, currentQuestion, onResponseChange, onSave]);

  const handleNext = () => {
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSaveAndNext = () => {
    // Save current category progress
    onCategorySaveAndNext(categoryCode);
    
    // Move to next category
    onMoveToNextCategory(categoryCode);
  };

  const handleSkip = () => {
    setCurrentAnswer("SKIPPED");
  };

  const isLastQuestion = currentQuestionIndex === categoryQuestions.length - 1;

  const getAnswerStatus = () => {
    if (!currentAnswer || currentAnswer.trim() === "") {
      return "unanswered";
    }
    if (currentAnswer === "SKIPPED") {
      return "skipped";
    }
    return "answered";
  };

  // Render the input for the current question
  const renderQuestionInput = () => {
    // Don't render input if question is skipped
    if (currentAnswer === "SKIPPED") {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Question Skipped</span>
          </div>
          <p className="text-sm text-yellow-600 mt-1">This question was skipped and won't be included in the analysis.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentAnswer('')}
            className="mt-2 text-xs"
          >
            Resume Question
          </Button>
        </div>
      );
    }

    switch (currentQuestion.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-sm font-medium">Your Answer</Label>
            <Input
              id="answer"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full"
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-sm font-medium">Your Answer</Label>
            <Textarea
              id="answer"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Provide a detailed answer..."
              rows={4}
              className="w-full resize-none"
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select an Option</Label>
            <Select value={currentAnswer} onValueChange={setCurrentAnswer}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an option..." />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-sm font-medium">Enter Amount</Label>
            <Input
              id="answer"
              type="number"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Enter a number..."
              className="w-full"
            />
          </div>
        );

      case 'boolean':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Yes or No</Label>
            <Select value={currentAnswer} onValueChange={setCurrentAnswer}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose Yes or No..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-sm font-medium">Your Answer</Label>
            <Input
              id="answer"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full"
            />
          </div>
        );
    }
  };

  if (!currentQuestion) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Question Not Found</h3>
            <p className="text-gray-600 mb-4">The requested question could not be loaded.</p>
            <Button onClick={onBack}>Back to Categories</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Category Navigation */}
      <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateToPreviousCategory}
          className="flex items-center gap-1 text-xs"
        >
          <ChevronLeft className="h-3 w-3" />
          Prev Category
        </Button>
        
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${category?.color || 'bg-blue-500'}`}
          />
          <span className="font-medium text-sm">{category?.name}</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateToNextCategory}
          className="flex items-center gap-1 text-xs"
        >
          Next Category
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Question Card */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight">
                {currentQuestion.question}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.id}
                </Badge>
                <Badge 
                  className={`text-xs ${
                    getAnswerStatus() === 'answered' ? 'bg-green-500 hover:bg-green-600' :
                    getAnswerStatus() === 'skipped' ? 'bg-yellow-500 hover:bg-yellow-600' :
                    'bg-gray-500 hover:bg-gray-600'
                  }`}
                >
                  {getAnswerStatus() === 'answered' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {getAnswerStatus() === 'skipped' && <AlertCircle className="h-3 w-3 mr-1" />}
                  {getAnswerStatus().charAt(0).toUpperCase() + getAnswerStatus().slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 flex items-center gap-1 text-xs"
              >
                <SkipForward className="h-3 w-3" />
                Skip
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                className="flex items-center gap-1 text-xs"
              >
                <Save className="h-3 w-3" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Question Input */}
          <div className="bg-gray-50 p-4 rounded-lg">
            {renderQuestionInput()}
          </div>

          {/* Help Text */}
          {currentQuestion.helpText && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Helper Information</p>
                  <p className="text-sm text-blue-700 mt-1">{currentQuestion.helpText}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation - Updated for better mobile layout */}
          <div className="flex items-center justify-between gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 flex-1 max-w-[120px]"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="text-sm text-gray-500 text-center px-2 flex-shrink-0">
              Question {currentQuestionIndex + 1} of {categoryQuestions.length}
            </div>
            
            {!isLastQuestion ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 flex-1 max-w-[120px]"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    onClick={handleSaveAndNext}
                    className="flex items-center gap-2 flex-1 max-w-[120px] bg-green-600 hover:bg-green-700 text-xs"
                  >
                    <Database className="h-4 w-4" />
                    Complete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[75%] max-w-[300px] sm:max-w-[350px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base">Complete Category</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                      You've reached the end of this category. Would you like to save your progress and move to the next category?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="text-xs h-8">Stay Here</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleSaveAndNext}
                      className="bg-green-600 hover:bg-green-700 text-xs h-8"
                    >
                      Continue to Next Category
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionInterface;
