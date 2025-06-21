
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SURVEY_CATEGORIES } from "../types/survey";
import { SURVEY_QUESTIONS } from "../data/questions";
import { CheckCircle, Circle } from "lucide-react";

interface CategorySelectorProps {
  selectedCategory: string | null;
  completedCategories: string[];
  onCategorySelect: (categoryCode: string) => void;
}

const CategorySelector = ({ selectedCategory, completedCategories, onCategorySelect }: CategorySelectorProps) => {
  const getCategoryQuestionCount = (categoryCode: string) => {
    return SURVEY_QUESTIONS.filter(q => q.categoryCode === categoryCode).length;
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital Platform Worker Survey</h1>
        <p className="text-gray-600">Comprehensive research tool for studying platform work conditions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SURVEY_CATEGORIES.map((category) => {
          const questionCount = getCategoryQuestionCount(category.code);
          const isCompleted = completedCategories.includes(category.code);
          const isSelected = selectedCategory === category.code;
          
          return (
            <Card 
              key={category.code}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                isSelected 
                  ? 'border-blue-500 shadow-lg' 
                  : isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onCategorySelect(category.code)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-900">
                    {category.name}
                  </CardTitle>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {category.code}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {questionCount} questions
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
