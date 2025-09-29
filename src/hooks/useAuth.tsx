import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: 'caregiver' | 'patient' | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  createPatientAccount: (email: string, password: string, metadata: any) => Promise<{ error: any; data?: any }>;
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

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
      
      return (data?.role as 'caregiver' | 'patient' | undefined) ?? null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  const ensureUserRole = async (userId: string): Promise<'caregiver' | 'patient' | null> => {
    // Try to get role first
    const currentRole = await fetchUserRole(userId);
    if (currentRole) return currentRole;

    // If no role exists, default to caregiver for existing accounts and persist it
    try {
      const { error } = await supabase.from('user_roles').insert({
        user_id: userId,
        role: 'caregiver',
      });
      if (error) {
        console.error('Error assigning default role:', error);
        return null;
      }
      return 'caregiver';
    } catch (e) {
      console.error('Error assigning default role:', e);
      return null;
    }
  };


  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role asynchronously
          setTimeout(async () => {
            const role = await ensureUserRole(session.user.id);
            setUserRole(role);
            setLoading(false);
          }, 0);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user role for existing session
        setTimeout(async () => {
          const role = await ensureUserRole(session.user.id);
          setUserRole(role);
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.user) {
        // Create user role as caregiver by default for signup
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'caregiver'
          });

        if (roleError) {
          console.error('Error creating user role:', roleError);
        }
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Successfully signed in!');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Successfully signed out!');
        setUser(null);
        setSession(null);
        setUserRole(null);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const createPatientAccount = async (email: string, password: string, metadata: any) => {
    try {
      // Call the edge function to create patient account
      const { data, error } = await supabase.functions.invoke('create-patient', {
        body: {
          email,
          password,
          metadata
        }
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data?.error) {
        toast.error(data.error);
        return { error: data.error };
      }

      if (data?.success) {
        toast.success('Patient account created successfully!');
        return { error: null, data: data.user };
      }

      return { error: 'Unknown error occurred' };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create patient account');
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
    createPatientAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};