import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type UserRole = 'Judge' | 'Lawyer' | 'Clerk' | 'Public';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, metadata: { first_name: string, last_name: string, role: UserRole }) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({ ...prev, session, user: session?.user ?? null }));
        
        if (session?.user) {
          setTimeout(async () => {
            await fetchProfile(session.user.id);
          }, 0);
        } else {
          setState(prev => ({ ...prev, profile: null }));
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({ ...prev, session, user: session?.user ?? null, isLoading: false }));
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (data) {
      setState(prev => ({ ...prev, profile: data as Profile }));
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      if (error.message.includes("Email not confirmed")) {
        toast({
          title: "Email Verification",
          description: "Please check your email to verify your account.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      }
      return { error };
    }
    
    toast({
      title: "Login Successful",
      description: "Welcome back!",
    });
    navigate('/dashboard');
    return { error: null };
  };

  const signUp = async (email: string, password: string, metadata: { first_name: string, last_name: string, role: UserRole }) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata
      }
    });

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
    
    toast({
      title: "Registration Successful",
      description: "Your account has been created!",
    });
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const updateProfile = async (profile: Partial<Profile>) => {
    if (!state.user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', state.user.id);

    if (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    await fetchProfile(state.user.id);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      signUp,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useHasAccess = (allowedRoles: UserRole[]) => {
  const { profile } = useAuth();
  return profile && allowedRoles.includes(profile.role as UserRole);
};
