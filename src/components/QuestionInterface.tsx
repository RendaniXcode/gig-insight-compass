
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Home } from "lucide-react";
import { Question, SurveyResponse } from "../types/survey";
import { SURVEY_QUESTIONS } from "../data/questions";
import { SURVEY_CATEGORIES } from "../types/survey";

interface QuestionInterfaceProps {
  categoryCode: string;
  responses: SurveyResponse[];
  onResponseChange: (questionId: string, answer: string) => void;
  onBack: () => void;
  onSave: () => void;
}

const QuestionInterface = ({ 
  categoryCode, 
  responses, 
  onResponseChange, 
  onBack,
  onSave 
}: QuestionInterfaceProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.categoryCode === categoryCode);
  const currentQuestion = categoryQuestions[currentQuestionIndex];
  const category = SURVEY_CATEGORIES.find(c => c.code === categoryCode);
  
  const progress = ((currentQuestionIndex + 1) / categoryQuestions.length) * 100;

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

  const isBasicInfo = categoryCode === 'BI' && (currentQuestion?.id === 'BI_01' || currentQuestion?.id === 'BI_02' || currentQuestion?.id === 'BI_03');

  if (!currentQuestion || !category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Back to Categories
        </Button>
        <Button onClick={onSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Progress
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{category.name}</span>
          <span>{currentQuestionIndex + 1} of {categoryQuestions.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
            <CardTitle className="text-xl">
              {currentQuestion.id}: {currentQuestion.question}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isBasicInfo ? (
            <Input
              placeholder="Enter your answer..."
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="text-lg"
            />
          ) : (
            <Textarea
              placeholder="Please provide a detailed response..."
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="min-h-[150px] text-lg resize-none"
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="text-sm text-gray-500 flex items-center">
              Question {currentQuestionIndex + 1} of {categoryQuestions.length}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={currentQuestionIndex === categoryQuestions.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {categoryQuestions.map((question, index) => {
              const hasResponse = responses.some(r => r.questionId === question.id && r.answer.trim() !== "");
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <Button
                  key={question.id}
                  variant={isCurrent ? "default" : hasResponse ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`h-10 ${isCurrent ? 'ring-2 ring-blue-500' : ''}`}
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
