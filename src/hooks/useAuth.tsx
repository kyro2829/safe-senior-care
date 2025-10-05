import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
}

interface Session {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: 'caregiver' | 'patient' | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  createPatientAccount: (email: string, password: string, metadata: any) => Promise<{ error: any; data?: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  createPatientAccount: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'caregiver' | 'patient' | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    const storedSession = localStorage.getItem('auth_session');
    const storedRole = localStorage.getItem('auth_role');
    
    if (storedUser && storedSession && storedRole) {
      setUser(JSON.parse(storedUser));
      setSession(JSON.parse(storedSession));
      setUserRole(storedRole as 'caregiver' | 'patient');
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    try {
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('app_users') || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        const error = { message: 'User already exists' };
        toast.error(error.message);
        return { error };
      }

      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        user_metadata: metadata
      };

      const newSession: Session = {
        user: newUser,
        access_token: crypto.randomUUID()
      };

      // Store user data
      users.push({
        ...newUser,
        password, // In real app, this would be hashed
        role: 'caregiver'
      });
      localStorage.setItem('app_users', JSON.stringify(users));

      // Set current auth state
      setUser(newUser);
      setSession(newSession);
      setUserRole('caregiver');
      
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      localStorage.setItem('auth_session', JSON.stringify(newSession));
      localStorage.setItem('auth_role', 'caregiver');

      toast.success('Registration successful!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('app_users') || '[]');
      
      // Find user
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        const error = { message: 'Invalid email or password' };
        toast.error(error.message);
        return { error };
      }

      const user: User = {
        id: foundUser.id,
        email: foundUser.email,
        user_metadata: foundUser.user_metadata
      };

      const session: Session = {
        user,
        access_token: crypto.randomUUID()
      };

      // Set current auth state
      setUser(user);
      setSession(session);
      setUserRole(foundUser.role);
      
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_session', JSON.stringify(session));
      localStorage.setItem('auth_role', foundUser.role);

      toast.success('Successfully signed in!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_role');
      
      setUser(null);
      setSession(null);
      setUserRole(null);
      
      toast.success('Successfully signed out!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const createPatientAccount = async (email: string, password: string, metadata: any) => {
    try {
      if (!user || userRole !== 'caregiver') {
        const error = { message: 'Only caregivers can create patient accounts' };
        toast.error(error.message);
        return { error };
      }

      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('app_users') || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        const error = { message: 'User already exists' };
        toast.error(error.message);
        return { error };
      }

      // Create new patient
      const newPatient = {
        id: crypto.randomUUID(),
        email,
        password,
        user_metadata: metadata,
        role: 'patient'
      };

      users.push(newPatient);
      localStorage.setItem('app_users', JSON.stringify(users));

      // Store caregiver-patient relationship
      const relationships = JSON.parse(localStorage.getItem('caregiver_patients') || '[]');
      relationships.push({
        caregiver_id: user.id,
        patient_id: newPatient.id
      });
      localStorage.setItem('caregiver_patients', JSON.stringify(relationships));

      toast.success('Patient account created successfully!');
      return { error: null, data: { id: newPatient.id, email: newPatient.email } };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create patient account');
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Simulate password reset
      const users = JSON.parse(localStorage.getItem('app_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser) {
        const error = { message: 'User not found' };
        toast.error(error.message);
        return { error };
      }

      toast.success('Password reset link sent! (This is a simulation)');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message);
      return { error };
    }
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    createPatientAccount,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
