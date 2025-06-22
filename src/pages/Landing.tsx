
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const navigationOptions = [
    {
      title: "Start New Interview",
      description: "Begin a fresh platform worker survey",
      icon: FileText,
      action: () => navigate("/interview"),
      variant: "default" as const
    },
    {
      title: "View Dashboard",
      description: "Access existing interviews and analytics",
      icon: BarChart3,
      action: () => navigate("/interview?view=dashboard"),
      variant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6">
            <Users className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gig Insight Compass
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional platform worker survey tool for comprehensive interviews and data analysis
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {navigationOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={option.action}>
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 mx-auto">
                  <option.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <CardDescription className="text-base">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  variant={option.variant} 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    option.action();
                  }}
                >
                  {option.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Platform Worker Survey System • Professional Interview Tool</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
