import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HealthCard } from "@/components/HealthCard";
import { CreatePatientModal } from "@/components/CreatePatientModal";
import { useAuth } from "@/hooks/useAuth";
import { mockPatients, mockAlerts, getTimeAgo, getHealthStatusColor, type Patient, type Alert } from "@/lib/mockData";
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

export default function CaregiverDashboard() {
  const { user, signOut } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAlertDetails, setShowAlertDetails] = useState<Alert | null>(null);
  const [patients] = useState<Patient[]>(mockPatients);
  const [alerts] = useState<Alert[]>(mockAlerts);

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');

  const handleAddPatient = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, this would call the create-patient edge function
    setShowAddPatient(false);
    alert("Patient account created successfully! Temporary password sent via SMS.");
  };

  const acknowledgeAlert = (alertId: string) => {
    // In a real app, this would update the alert status in the database
    alert("Alert acknowledged and logged.");
  };

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
              {patients.map((patient) => (
                <Card 
                  key={patient.id} 
                  className="p-4 shadow-card hover:shadow-health transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-elderly text-foreground">
                        {patient.displayName}
                      </h3>
                      <Badge 
                        variant={
                          patient.healthData.heartRate.status === 'normal' ? 'default' :
                          patient.healthData.heartRate.status === 'warning' ? 'secondary' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {patient.healthData.heartRate.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Heart Rate</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Heart className="h-3 w-3 text-destructive" />
                          {patient.healthData.heartRate.current} BPM
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Steps</p>
                        <p className="font-semibold">
                          {patient.healthData.steps.current.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Sleep</p>
                        <p className="font-semibold">
                          {patient.healthData.sleep.current}h
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Last Active</p>
                        <p className="font-semibold text-xs">
                          {getTimeAgo(patient.lastActive)}
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
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Details Modal */}
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedPatient && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {selectedPatient.displayName} - Health Details
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-elderly font-mono">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                      <p className="text-elderly font-mono">{selectedPatient.emergencyContact}</p>
                    </div>
                  </div>

                  {/* Health Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <HealthCard
                      title="Heart Rate"
                      value={selectedPatient.healthData.heartRate.current}
                      unit="BPM"
                      status={selectedPatient.healthData.heartRate.status}
                      icon="heart"
                      trend="stable"
                    />
                    <HealthCard
                      title="Daily Steps"
                      value={selectedPatient.healthData.steps.current.toLocaleString()}
                      unit="steps"
                      status={selectedPatient.healthData.steps.status}
                      icon="steps"
                      goal={selectedPatient.healthData.steps.goal}
                      current={selectedPatient.healthData.steps.current}
                    />
                    <HealthCard
                      title="Sleep"
                      value={selectedPatient.healthData.sleep.current}
                      unit="hours"
                      status={selectedPatient.healthData.sleep.status}
                      icon="sleep"
                      goal={selectedPatient.healthData.sleep.goal}
                      current={selectedPatient.healthData.sleep.current}
                    />
                    <HealthCard
                      title="Fall Detection"
                      value={selectedPatient.healthData.fallDetection.status === 'active' ? 'Active' : 'Inactive'}
                      status={selectedPatient.healthData.fallDetection.status === 'active' ? 'normal' : 'warning'}
                      icon="fall"
                      subtitle={
                        selectedPatient.healthData.fallDetection.incidentCount > 0
                          ? `${selectedPatient.healthData.fallDetection.incidentCount} incidents`
                          : 'No incidents'
                      }
                    />
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
            // In a real app, this would refresh the patient list
            console.log('Patient created successfully');
          }}
        />
      </main>
    </div>
  );
}