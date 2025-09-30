import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HealthCard } from "@/components/HealthCard";
import { CreatePatientModal } from "@/components/CreatePatientModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { mockAlerts, mockHealthData, getTimeAgo, getHealthStatusColor, type Alert } from "@/lib/mockData";
import { 
  Users, 
  AlertTriangle, 
  Phone, 
  Clock, 
  Activity,
  Eye,
  UserPlus,
  Bell,
  Heart,
  LogOut
} from "lucide-react";

interface PatientProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  emergency_contact: string | null;
}

export default function CaregiverDashboard() {
  const { user, signOut } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAlertDetails, setShowAlertDetails] = useState<Alert | null>(null);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [alerts] = useState<Alert[]>(mockAlerts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.id) return;
      
      try {
        // First get the patient relationships
        const { data: relationships, error: relError } = await supabase
          .from('caregiver_patients')
          .select('patient_id')
          .eq('caregiver_id', user.id);
        
        if (relError) {
          console.error('Error fetching relationships:', relError);
          setLoading(false);
          return;
        }
        
        const patientIds = relationships?.map(r => r.patient_id) || [];
        
        if (patientIds.length > 0) {
          // Then get the profiles for those patient IDs
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, user_id, first_name, last_name, phone, emergency_contact')
            .in('user_id', patientIds);
          
          if (profileError) {
            console.error('Error fetching profiles:', profileError);
          } else if (profiles) {
            setPatients(profiles);
          }
        } else {
          setPatients([]);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user?.id]);

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');

  const refreshPatients = async () => {
    if (!user?.id) return;
    
    try {
      // Manual join approach
      const { data: relationships, error: relError } = await supabase
        .from('caregiver_patients')
        .select('patient_id')
        .eq('caregiver_id', user.id);
      
      if (relError || !relationships) {
        console.error('Error fetching relationships:', relError);
        return;
      }
      
      const patientIds = relationships.map(r => r.patient_id);
      
      if (patientIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, user_id, first_name, last_name, phone, emergency_contact')
          .in('user_id', patientIds);
        
        if (profileError) {
          console.error('Error fetching profiles:', profileError);
        } else if (profiles) {
          setPatients(profiles);
        }
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    // In a real app, this would update the alert status in the database
    alert("Alert acknowledged and logged.");
  };

  const getPatientDisplayName = (patient: PatientProfile) => {
    if (patient.first_name && patient.last_name) {
      return `${patient.first_name} ${patient.last_name}`;
    }
    return patient.first_name || 'Patient';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Caregiver Dashboard
              </h1>
              <p className="text-elderly text-muted-foreground">
                Monitoring {patients.length} patients
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                size="lg" 
                onClick={() => setShowAddPatient(true)}
                className="elderly"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
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
        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-elderly">
                <Bell className="h-5 w-5 text-warning" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-2">
                {unacknowledgedAlerts.length}
              </div>
              <p className="text-sm text-muted-foreground">
                {criticalAlerts.length} critical alerts
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-elderly">
                <Users className="h-5 w-5 text-primary" />
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-2">
                {patients.length}
              </div>
              <p className="text-sm text-muted-foreground">
                All patients active
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-elderly">
                <Activity className="h-5 w-5 text-success" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success mb-2">
                Online
              </div>
              <p className="text-sm text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        {unacknowledgedAlerts.length > 0 && (
          <Card className="mb-8 shadow-alert border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-elderly-lg text-destructive">
                <AlertTriangle className="h-6 w-6" />
                Recent Alerts ({unacknowledgedAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unacknowledgedAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 bg-destructive-light rounded-lg border border-destructive/20"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive" className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="font-semibold text-destructive">
                          {alert.patientName}
                        </span>
                      </div>
                      <p className="text-elderly text-foreground">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {getTimeAgo(alert.timestamp)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAlertDetails(alert)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patient List */}
        <Card className="shadow-health">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-elderly-lg">
              <Users className="h-6 w-6 text-primary" />
              Patient Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {patients.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-elderly text-muted-foreground">No patients assigned yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Click "Add Patient" to create a new patient account.</p>
                </div>
              ) : (
                patients.map((patient) => (
                  <Card 
                    key={patient.id} 
                    className="p-4 shadow-card hover:shadow-health transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-elderly text-foreground">
                          {getPatientDisplayName(patient)}
                        </h3>
                        <Badge 
                          variant="default"
                          className="text-xs"
                        >
                          Active
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-semibold text-xs">
                            {patient.phone || 'Not set'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Emergency</p>
                          <p className="font-semibold text-xs">
                            {patient.emergency_contact || 'Not set'}
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full elderly"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatient(patient);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patient Details Modal */}
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedPatient && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {getPatientDisplayName(selectedPatient)} - Health Overview
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-elderly font-mono">{selectedPatient.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                      <p className="text-elderly font-mono">{selectedPatient.emergency_contact || 'Not set'}</p>
                    </div>
                  </div>

                  {/* Health Metrics */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Current Health Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 border-l-4 border-l-destructive">
                        <div className="flex items-center gap-3">
                          <Heart className="h-8 w-8 text-destructive" />
                          <div>
                            <p className="text-sm text-muted-foreground">Heart Rate</p>
                            <p className="text-2xl font-bold">{mockHealthData.heartRate.current} BPM</p>
                            <p className="text-xs text-muted-foreground capitalize">Status: {mockHealthData.heartRate.status}</p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 border-l-4 border-l-primary">
                        <div className="flex items-center gap-3">
                          <Activity className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Daily Steps</p>
                            <p className="text-2xl font-bold">{mockHealthData.steps.current.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Goal: {mockHealthData.steps.goal.toLocaleString()}</p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 border-l-4 border-l-success">
                        <div className="flex items-center gap-3">
                          <Clock className="h-8 w-8 text-success" />
                          <div>
                            <p className="text-sm text-muted-foreground">Sleep Duration</p>
                            <p className="text-2xl font-bold">{mockHealthData.sleep.current} hrs</p>
                            <p className="text-xs text-muted-foreground">Goal: {mockHealthData.sleep.goal} hrs</p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 border-l-4 border-l-warning">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-8 w-8 text-warning" />
                          <div>
                            <p className="text-sm text-muted-foreground">Fall Detection</p>
                            <p className="text-2xl font-bold capitalize">{mockHealthData.fallDetection.status}</p>
                            <p className="text-xs text-muted-foreground">
                              {mockHealthData.fallDetection.lastIncident 
                                ? `Last: ${getTimeAgo(mockHealthData.fallDetection.lastIncident)}`
                                : 'No incidents'}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Alert Details Modal */}
        <Dialog open={!!showAlertDetails} onOpenChange={() => setShowAlertDetails(null)}>
          <DialogContent className="sm:max-w-md">
            {showAlertDetails && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">Alert Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Badge variant="destructive" className="text-sm">
                      {showAlertDetails.severity.toUpperCase()}
                    </Badge>
                    <h3 className="font-semibold text-elderly">
                      {showAlertDetails.patientName}
                    </h3>
                    <p className="text-elderly text-foreground">
                      {showAlertDetails.message}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {getTimeAgo(showAlertDetails.timestamp)}
                    </p>
                  </div>
                  <div className="flex gap-3 justify-end pt-4">
                    <Button 
                      onClick={() => setShowAlertDetails(null)}
                      variant="secondary"
                      className="elderly"
                    >
                      Close
                    </Button>
                    <Button 
                      onClick={() => {
                        acknowledgeAlert(showAlertDetails.id);
                        setShowAlertDetails(null);
                      }}
                      className="elderly"
                    >
                      Acknowledge
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Patient Modal */}
        <CreatePatientModal 
          open={showAddPatient} 
          onOpenChange={setShowAddPatient}
          onPatientCreated={() => {
            refreshPatients();
          }}
        />
      </main>
    </div>
  );
}