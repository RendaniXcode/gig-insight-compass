
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const navigationOptions = [
    {
      title: "New Interview",
      description: "Start platform worker survey",
      icon: FileText,
      action: () => navigate("/interview"),
      variant: "default" as const
    },
    {
      title: "Dashboard",
      description: "View interviews & analytics",
      icon: BarChart3,
      action: () => navigate("/interview?view=dashboard"),
      variant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Research Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 border border-slate-200">
            <Search className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Gig Insight Compass
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Platform worker research tool
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid gap-4 mb-6">
          {navigationOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-200 cursor-pointer border-slate-200" onClick={option.action}>
              <CardHeader className="text-center pb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-50 rounded-lg mb-3 mx-auto">
                  <option.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold">{option.title}</CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  variant={option.variant} 
                  size="sm"
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
        <div className="text-center text-xs text-slate-400">
          <p>Research Survey System</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
