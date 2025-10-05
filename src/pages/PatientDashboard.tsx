import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HealthCard } from "@/components/HealthCard";
import { mockHealthData, getTimeAgo } from "@/lib/mockData";
import { useAuth } from "@/hooks/useAuth";
import { Phone, Activity, TrendingUp, Clock, Shield, LogOut } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  emergency_contact: string | null;
}

export default function PatientDashboard() {
  const { user, signOut } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const healthData = mockHealthData;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        // Get user data from localStorage
        const users = JSON.parse(localStorage.getItem('app_users') || '[]');
        const foundUser = users.find((u: any) => u.id === user.id);
        
        if (foundUser) {
          setUserProfile({
            id: foundUser.id,
            first_name: foundUser.user_metadata?.first_name || null,
            last_name: foundUser.user_metadata?.last_name || null,
            phone: foundUser.user_metadata?.phone || null,
            emergency_contact: foundUser.user_metadata?.emergency_contact || null,
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  // Prepare chart data
  const chartData = healthData.heartRate.history.map((metric, index) => ({
    day: `Day ${index + 1}`,
    heartRate: metric.value,
    steps: healthData.steps.history[index]?.value || 0,
    sleep: healthData.sleep.history[index]?.value || 0,
  }));

  const displayName = userProfile?.first_name && userProfile?.last_name 
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : userProfile?.first_name || 'Patient';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const handleEmergencyCall = () => {
    // In a real app, this would initiate an emergency call
    setShowEmergencyModal(false);
    alert("Emergency contact has been notified. Help is on the way!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 shadow-card">
        <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome back, {displayName}
                </h1>
                <p className="text-elderly text-muted-foreground">
                  Here's your health overview for today
                </p>
              </div>
              <div className="flex gap-4">
                <Dialog open={showEmergencyModal} onOpenChange={setShowEmergencyModal}>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="destructive" className="elderly-xl">
                      <Phone className="h-5 w-5 mr-2" />
                      Emergency
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl text-center">Emergency Contact</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-center text-elderly">
                        Do you need to contact your caregiver immediately?
                      </p>
                      <div className="text-center space-y-2">
                        <p className="font-semibold">Emergency Contact:</p>
                        <p className="text-lg text-primary font-mono">{userProfile?.emergency_contact || 'Not set'}</p>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <Button 
                          onClick={handleEmergencyCall}
                          size="lg" 
                          variant="destructive"
                          className="elderly"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                        <Button 
                          onClick={() => setShowEmergencyModal(false)}
                          size="lg" 
                          variant="secondary"
                          className="elderly"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  onClick={signOut}
                  size="lg" 
                  variant="elderly-secondary"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Button>
              </div>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <HealthCard
            title="Heart Rate"
            value={healthData.heartRate.current}
            unit="BPM"
            status={healthData.heartRate.status}
            icon="heart"
            subtitle="Resting heart rate"
            trend="stable"
          />
          
          <HealthCard
            title="Daily Steps"
            value={healthData.steps.current.toLocaleString()}
            unit="steps"
            status={healthData.steps.status}
            icon="steps"
            goal={healthData.steps.goal}
            current={healthData.steps.current}
            trend="up"
          />
          
          <HealthCard
            title="Sleep Duration"
            value={healthData.sleep.current}
            unit="hours"
            status={healthData.sleep.status}
            icon="sleep"
            goal={healthData.sleep.goal}
            current={healthData.sleep.current}
            subtitle="Last night"
            trend="stable"
          />
          
          <HealthCard
            title="Fall Detection"
            value={healthData.fallDetection.status === 'active' ? 'Active' : 'Inactive'}
            status={healthData.fallDetection.status === 'active' ? 'normal' : 'warning'}
            icon="fall"
            subtitle={
              healthData.fallDetection.lastIncident 
                ? `Last incident: ${getTimeAgo(healthData.fallDetection.lastIncident)}`
                : 'No recent incidents'
            }
          />
        </div>

        {/* Health Trends Chart */}
        <Card className="mb-8 shadow-health">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-elderly-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
              Weekly Health Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                    name="Heart Rate (BPM)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="steps" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    name="Steps (Daily)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sleep" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    name="Sleep (Hours)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <Card className="shadow-health">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-elderly-lg">
              <Clock className="h-6 w-6 text-primary" />
              Today's Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-elderly text-foreground">Health Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-success" />
                    <span className="text-elderly">Fall detection is active and monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-elderly">
                      {Math.round(((healthData.steps.current / healthData.steps.goal) * 100))}% of daily step goal completed
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-elderly text-foreground">Recommendations</h3>
                <div className="space-y-2">
                  {healthData.steps.current < healthData.steps.goal && (
                    <p className="text-elderly text-muted-foreground">
                      • Try a short walk to reach your daily step goal
                    </p>
                  )}
                  {healthData.sleep.current < healthData.sleep.goal && (
                    <p className="text-elderly text-muted-foreground">
                      • Consider going to bed earlier tonight
                    </p>
                  )}
                  {healthData.heartRate.status === 'normal' && (
                    <p className="text-elderly text-muted-foreground">
                      • Your heart rate looks great today!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}