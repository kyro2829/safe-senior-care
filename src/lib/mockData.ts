// Mock data structure for Elder Watch health monitoring

export interface HealthMetric {
  id: string;
  value: number;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
}

export interface HealthData {
  heartRate: {
    current: number;
    status: 'normal' | 'warning' | 'critical';
    history: HealthMetric[];
  };
  steps: {
    current: number;
    goal: number;
    status: 'normal' | 'warning' | 'critical';
    history: HealthMetric[];
  };
  sleep: {
    current: number;
    goal: number;
    status: 'normal' | 'warning' | 'critical';
    history: HealthMetric[];
  };
  fallDetection: {
    status: 'active' | 'inactive';
    lastIncident: Date | null;
    incidentCount: number;
  };
}

export interface Patient {
  id: string;
  displayName: string;
  phone: string;
  emergencyContact: string;
  healthData: HealthData;
  lastActive: Date;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: 'heart_rate' | 'fall_detected' | 'inactivity' | 'low_battery';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

// Generate mock health history for the last 7 days
const generateHealthHistory = (baseValue: number, variance: number): HealthMetric[] => {
  const history: HealthMetric[] = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const value = baseValue + (Math.random() - 0.5) * variance;
    const metric: HealthMetric = {
      id: `metric_${i}_${Date.now()}`,
      value: Math.round(value),
      timestamp: date,
      status: value > baseValue * 1.2 ? 'warning' : value < baseValue * 0.8 ? 'warning' : 'normal'
    };
    
    history.push(metric);
  }
  
  return history;
};

// Mock current user profile
export const mockCurrentUser = {
  id: 'user_123',
  displayName: 'John Smith',
  role: 'patient' as const,
  phone: '+1 (555) 123-4567',
  emergencyContact: '+1 (555) 987-6543'
};

// Mock health data for current patient
export const mockHealthData: HealthData = {
  heartRate: {
    current: 72,
    status: 'normal',
    history: generateHealthHistory(72, 10)
  },
  steps: {
    current: 3420,
    goal: 5000,
    status: 'warning',
    history: generateHealthHistory(3500, 800)
  },
  sleep: {
    current: 6.5,
    goal: 8,
    status: 'warning',
    history: generateHealthHistory(7, 2)
  },
  fallDetection: {
    status: 'active',
    lastIncident: null,
    incidentCount: 0
  }
};

// Mock patients for caregiver dashboard
export const mockPatients: Patient[] = [
  {
    id: 'patient_1',
    displayName: 'Margaret Johnson',
    phone: '+1 (555) 234-5678',
    emergencyContact: '+1 (555) 876-5432',
    lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    healthData: {
      heartRate: {
        current: 78,
        status: 'normal',
        history: generateHealthHistory(78, 8)
      },
      steps: {
        current: 4200,
        goal: 5000,
        status: 'normal',
        history: generateHealthHistory(4000, 600)
      },
      sleep: {
        current: 7.5,
        goal: 8,
        status: 'normal',
        history: generateHealthHistory(7.5, 1.5)
      },
      fallDetection: {
        status: 'active',
        lastIncident: null,
        incidentCount: 0
      }
    }
  },
  {
    id: 'patient_2',
    displayName: 'Robert Chen',
    phone: '+1 (555) 345-6789',
    emergencyContact: '+1 (555) 765-4321',
    lastActive: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    healthData: {
      heartRate: {
        current: 95,
        status: 'warning',
        history: generateHealthHistory(85, 15)
      },
      steps: {
        current: 2100,
        goal: 5000,
        status: 'warning',
        history: generateHealthHistory(2500, 400)
      },
      sleep: {
        current: 5.2,
        goal: 8,
        status: 'critical',
        history: generateHealthHistory(6, 2)
      },
      fallDetection: {
        status: 'active',
        lastIncident: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        incidentCount: 1
      }
    }
  },
  {
    id: 'patient_3',
    displayName: 'Dorothy Williams',
    phone: '+1 (555) 456-7890',
    emergencyContact: '+1 (555) 654-3210',
    lastActive: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    healthData: {
      heartRate: {
        current: 68,
        status: 'normal',
        history: generateHealthHistory(68, 6)
      },
      steps: {
        current: 5840,
        goal: 5000,
        status: 'normal',
        history: generateHealthHistory(5200, 700)
      },
      sleep: {
        current: 8.2,
        goal: 8,
        status: 'normal',
        history: generateHealthHistory(8, 1)
      },
      fallDetection: {
        status: 'active',
        lastIncident: null,
        incidentCount: 0
      }
    }
  }
];

// Mock alerts for caregiver dashboard
export const mockAlerts: Alert[] = [
  {
    id: 'alert_1',
    patientId: 'patient_2',
    patientName: 'Robert Chen',
    type: 'fall_detected',
    severity: 'critical',
    message: 'Fall detected at 2:15 PM. Patient may need immediate assistance.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    acknowledged: false
  },
  {
    id: 'alert_2',
    patientId: 'patient_2',
    patientName: 'Robert Chen',
    type: 'heart_rate',
    severity: 'high',
    message: 'Elevated heart rate detected: 95 BPM (above normal range)',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    acknowledged: false
  },
  {
    id: 'alert_3',
    patientId: 'patient_1',
    patientName: 'Margaret Johnson',
    type: 'inactivity',
    severity: 'medium',
    message: 'Low activity detected: Only 2,100 steps today',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    acknowledged: true
  }
];

// Utility functions
export const getHealthStatusColor = (status: 'normal' | 'warning' | 'critical') => {
  switch (status) {
    case 'normal':
      return 'success';
    case 'warning':
      return 'warning';
    case 'critical':
      return 'destructive';
    default:
      return 'muted';
  }
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};