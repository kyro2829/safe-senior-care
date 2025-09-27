import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  Heart, 
  Activity, 
  Moon, 
  Shield, 
  Users, 
  Stethoscope,
  ArrowRight,
  CheckCircle,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const { user, userRole, signOut } = useAuth();
  
  const features = [
    {
      icon: Heart,
      title: "Heart Rate Monitoring",
      description: "Real-time heart rate tracking with instant alerts for abnormal readings",
      color: "text-destructive"
    },
    {
      icon: Activity,
      title: "Activity Tracking",
      description: "Daily step counting and activity goals to maintain healthy movement",
      color: "text-primary"
    },
    {
      icon: Moon,
      title: "Sleep Analysis",
      description: "Monitor sleep patterns and duration for optimal rest and recovery",
      color: "text-success"
    },
    {
      icon: Shield,
      title: "Fall Detection",
      description: "Advanced fall detection with immediate caregiver notifications",
      color: "text-warning"
    }
  ];

  const benefits = [
    "24/7 health monitoring and alerts",
    "Instant emergency contact system", 
    "Large, easy-to-read displays",
    "Secure data with healthcare compliance",
    "Multi-patient caregiver dashboard",
    "Real-time family notifications"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border/50 shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-primary text-primary-foreground">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Elder Watch</h1>
            </div>
            <div className="flex gap-4">
              {user ? (
                <>
                  <Link to={userRole === 'caregiver' ? '/caregiver' : '/patient'}>
                    <Button variant="elderly" size="elderly">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button variant="elderly-secondary" size="elderly" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth?type=patient">
                    <Button variant="elderly-secondary" size="elderly">
                      Patient Login
                    </Button>
                  </Link>
                  <Link to="/auth?type=caregiver">
                    <Button variant="elderly" size="elderly">
                      Caregiver Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 text-sm font-medium px-4 py-2">
            Healthcare Technology for Everyone
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Keep Your Loved Ones{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Safe & Healthy
            </span>
          </h1>
          
          <p className="text-elderly-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Elder Watch provides comprehensive health monitoring for seniors with real-time tracking, 
            fall detection, and instant caregiver alerts. Designed with large, clear interfaces 
            that are easy to use and understand.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link to={userRole === 'caregiver' ? '/caregiver' : '/patient'}>
                <Button variant="elderly-xl" className="w-full sm:w-auto">
                  <Users className="h-6 w-6 mr-3" />
                  Go to Dashboard
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth?type=patient">
                  <Button variant="elderly-xl" className="w-full sm:w-auto">
                    <Users className="h-6 w-6 mr-3" />
                    Patient Dashboard
                    <ArrowRight className="h-6 w-6 ml-3" />
                  </Button>
                </Link>
                <Link to="/auth?type=caregiver">
                  <Button variant="elderly-secondary" size="elderly-xl" className="w-full sm:w-auto">
                    <Stethoscope className="h-6 w-6 mr-3" />
                    Caregiver Dashboard
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Health Monitoring
          </h2>
          <p className="text-elderly-lg text-muted-foreground max-w-2xl mx-auto">
            Our advanced monitoring system tracks vital health metrics around the clock, 
            providing peace of mind for families and caregivers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="text-center shadow-health hover:shadow-alert transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className={`mx-auto p-3 rounded-xl bg-${feature.color.replace('text-', '')}/10 w-fit mb-4`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-elderly-lg font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-elderly text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-primary/5 to-success/5 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose Elder Watch?
              </h2>
              <p className="text-elderly-lg text-muted-foreground">
                Designed specifically for seniors and their caregivers with focus on 
                simplicity, reliability, and peace of mind.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-card/50 rounded-xl shadow-card">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0" />
                  <span className="text-elderly text-foreground font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-16">
        <Card className="max-w-4xl mx-auto text-center shadow-health bg-gradient-to-br from-primary/10 to-success/10 border-primary/20">
          <CardContent className="p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-elderly-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of families who trust Elder Watch to keep their loved ones 
              safe and healthy. Start monitoring today with our easy-to-use system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to={userRole === 'caregiver' ? '/caregiver' : '/patient'}>
                  <Button variant="elderly-xl" className="w-full sm:w-auto">
                    <Heart className="h-6 w-6 mr-3" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth?type=patient">
                    <Button variant="elderly-xl" className="w-full sm:w-auto">
                      <Heart className="h-6 w-6 mr-3" />
                      View Patient Demo
                    </Button>
                  </Link>
                  <Link to="/register/caregiver">
                    <Button variant="elderly-secondary" size="elderly-xl" className="w-full sm:w-auto">
                      <Users className="h-6 w-6 mr-3" />
                      Register as Caregiver
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur-sm border-t border-border/50 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-primary text-primary-foreground">
                <Stethoscope className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-foreground">Elder Watch</span>
            </div>
            <p className="text-elderly text-muted-foreground">
              Comprehensive elderly health monitoring • Designed for safety and peace of mind
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              © 2024 Elder Watch. Healthcare technology you can trust.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}