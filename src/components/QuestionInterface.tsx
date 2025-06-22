
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [otherText, setOtherText] = useState('');

  // Get questions for the current category
  const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === categoryCode);
  const currentQuestion = categoryQuestions[currentQuestionIndex];
  const category = SURVEY_CATEGORIES.find(c => c.code === categoryCode);

  // Update question index when initialQuestionIndex changes, but only if it's valid
  useEffect(() => {
    if (initialQuestionIndex >= 0 && initialQuestionIndex < categoryQuestions.length) {
      setCurrentQuestionIndex(initialQuestionIndex);
    }
  }, [initialQuestionIndex, categoryQuestions.length]);

  // Load existing response when question changes - this is the key fix
  useEffect(() => {
    console.log('Question changed, loading response for:', currentQuestion?.id);
    
    // Always reset states first to prevent carryover
    setCurrentAnswer('');
    setOtherText('');
    
    if (currentQuestion) {
      const existingResponse = responses.find(r => r.questionId === currentQuestion.id);
      console.log('Found existing response:', existingResponse);
      
      if (existingResponse && existingResponse.answer && existingResponse.answer.trim() !== '') {
        const answer = existingResponse.answer;
        console.log('Loading answer:', answer);
        
        // Check if it's an "Other:" response for multiple choice
        if (answer.startsWith('Other: ')) {
          setCurrentAnswer('Other');
          setOtherText(answer.substring(7)); // Remove "Other: " prefix
        } else {
          setCurrentAnswer(answer);
        }
      }
    }
  }, [currentQuestion?.id]); // Only depend on question ID to ensure it runs when question changes

  // Auto-save response when answer changes
  useEffect(() => {
    if (currentQuestion && currentAnswer !== '') {
      let finalAnswer = currentAnswer;
      
      // If "Other" is selected and there's text, combine them
      if (currentAnswer === 'Other' && otherText.trim()) {
        finalAnswer = `Other: ${otherText.trim()}`;
      }
      
      console.log('Auto-saving response:', finalAnswer, 'for question:', currentQuestion.id);
      onResponseChange(currentQuestion.id, finalAnswer);
      onSave();
    }
  }, [currentAnswer, otherText, currentQuestion, onResponseChange, onSave]);

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

  const handleQuestionNumberClick = (index: number) => {
    setCurrentQuestionIndex(index);
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

  const getQuestionStatus = (questionIndex: number) => {
    const question = categoryQuestions[questionIndex];
    const response = responses.find(r => r.questionId === question.id);
    
    if (!response || !response.answer || response.answer.trim() === "") {
      return "unanswered";
    }
    if (response.answer === "SKIPPED") {
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
            <Input
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="w-full"
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Provide a detailed answer..."
              rows={4}
              className="w-full resize-none"
            />
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-4">
            <Select value={currentAnswer === 'Other' ? '' : currentAnswer} onValueChange={setCurrentAnswer}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            {currentAnswer === 'Other' && (
              <div className="space-y-2">
                <Label htmlFor="other-input" className="text-sm font-medium">
                  Please specify:
                </Label>
                <Input
                  id="other-input"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Enter your answer..."
                  className="w-full"
                />
              </div>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Enter a number..."
              className="w-full"
            />
          </div>
        );

      case 'yes_no':
        return (
          <div className="space-y-3">
            <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="yes" />
                <Label htmlFor="yes" className="text-sm font-medium cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="no" />
                <Label htmlFor="no" className="text-sm font-medium cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-2">
            <Input
              type="date"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="w-full"
            />
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Input
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
          <span className="hidden sm:inline">Prev Category</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${category?.color || 'bg-blue-500'}`}
          />
          <span className="font-medium text-sm text-center">{category?.name}</span>
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} of {categoryQuestions.length}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateToNextCategory}
          className="flex items-center gap-1 text-xs"
        >
          <span className="hidden sm:inline">Next Category</span>
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Question Card */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="space-y-3">
            {/* Question ID and Title Row */}
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-xs flex-shrink-0">
                {currentQuestion.id}
              </Badge>
              <CardTitle className="text-lg leading-tight flex-1">
                {currentQuestion.question}
              </CardTitle>
            </div>
            
            {/* Action Buttons Row - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 flex items-center gap-1 text-xs order-2 sm:order-1"
              >
                <SkipForward className="h-3 w-3" />
                Skip This Question
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                className="flex items-center gap-1 text-xs order-1 sm:order-2"
              >
                <Save className="h-3 w-3" />
                <span className="hidden sm:inline">Save Progress</span>
                <span className="sm:hidden">Save</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Question Input */}
          <div className="bg-gray-50 p-4 rounded-lg">
            {renderQuestionInput()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            
            <div className="text-sm text-gray-500 text-center">
              Question {currentQuestionIndex + 1} of {categoryQuestions.length}
            </div>
            
            {!isLastQuestion ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Database className="h-4 w-4" />
                    <span className="hidden sm:inline">Complete Category</span>
                    <span className="sm:hidden">Complete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[90vw] max-w-md mx-auto rounded-xl">
                  <AlertDialogHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <AlertDialogTitle className="text-lg">Category Completed!</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex flex-row justify-center gap-4">
                    <AlertDialogCancel className="px-6 py-2 min-w-[100px]">Stay Here</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleSaveAndNext}
                      className="px-6 py-2 min-w-[100px] bg-green-600 hover:bg-green-700"
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Overview - Numbers at Bottom */}
      <Card className="w-full">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Question Overview</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {categoryQuestions.map((_, index) => {
              const status = getQuestionStatus(index);
              return (
                <Button
                  key={index}
                  variant={currentQuestionIndex === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuestionNumberClick(index)}
                  className={`
                    h-10 w-10 p-0 text-sm font-semibold
                    ${currentQuestionIndex === index 
                      ? 'bg-blue-600 text-white' 
                      : status === 'answered' 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : status === 'skipped'
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-white text-gray-600 border hover:bg-gray-50'
                    }
                  `}
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
