import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Stethoscope } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center shadow-health">
        <CardContent className="p-12">
          <div className="mb-6">
            <div className="p-4 rounded-xl bg-gradient-primary text-primary-foreground w-fit mx-auto mb-4">
              <Stethoscope className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
            <p className="text-elderly text-muted-foreground mb-8">
              Sorry, we couldn't find the page you're looking for. 
              It may have been moved or doesn't exist.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link to="/" className="w-full">
              <Button variant="elderly" size="elderly" className="w-full">
                <Home className="h-5 w-5 mr-2" />
                Return Home
              </Button>
            </Link>
            
            <Button 
              variant="elderly-secondary" 
              size="elderly" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
