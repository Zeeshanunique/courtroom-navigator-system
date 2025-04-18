import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { auth, db } from '@/integrations/firebase/client';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateEmail,
  UserCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/integrations/firebase/types';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: UserRole;
}

interface AuthState {
  user: FirebaseUser | null;
  profile: Profile | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata: { first_name: string, last_name: string, role: UserRole }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setState(prev => ({ ...prev, user }));
      
      if (user) {
        await fetchProfile(user.uid);
      } else {
        setState(prev => ({ ...prev, profile: null, isLoading: false }));
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // Get profile data from Firestore
      const profileRef = doc(db, 'profiles', userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        // Profile exists in Firestore
        const profileData = profileSnap.data() as Omit<Profile, 'id'>;
        setState(prev => ({ 
          ...prev, 
          profile: { id: userId, ...profileData },
          isLoading: false
        }));
      } else if (state.user) {
        // No profile in Firestore, create one from user data
        const user = state.user;
        const displayName = user.displayName || '';
        const nameParts = displayName.split(' ');
        
        const newProfile: Omit<Profile, 'id'> = {
          first_name: nameParts[0] || null,
          last_name: nameParts.slice(1).join(' ') || null,
          email: user.email,
          role: 'Public' as UserRole // Default role
        };
        
        // Store profile in Firestore
        await setDoc(profileRef, newProfile);
        
        setState(prev => ({ 
          ...prev, 
          profile: { id: userId, ...newProfile },
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate('/dashboard');
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata: { first_name: string, last_name: string, role: UserRole }) => {
    try {
      // Create user with Firebase Auth
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set display name
      await firebaseUpdateProfile(user, {
        displayName: `${metadata.first_name} ${metadata.last_name}`
      });
      
      // Create profile in Firestore
      const profileRef = doc(db, 'profiles', user.uid);
      await setDoc(profileRef, {
        first_name: metadata.first_name,
        last_name: metadata.last_name,
        email: email,
        role: metadata.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      navigate('/');
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (profile: Partial<Profile>) => {
    if (!state.user || !state.profile) {
      return { error: new Error('Not authenticated') };
    }

    try {
      const user = state.user;
      const updates: Record<string, any> = {};
      let displayNameUpdate = false;
      
      // Prepare updates
      if (profile.first_name !== undefined) {
        updates.first_name = profile.first_name;
        displayNameUpdate = true;
      }
      
      if (profile.last_name !== undefined) {
        updates.last_name = profile.last_name;
        displayNameUpdate = true;
      }
      
      if (profile.role !== undefined) {
        updates.role = profile.role;
      }
      
      updates.updated_at = new Date().toISOString();
      
      // Update display name in Firebase Auth if name changed
      if (displayNameUpdate) {
        const firstName = profile.first_name !== undefined ? profile.first_name : state.profile.first_name;
        const lastName = profile.last_name !== undefined ? profile.last_name : state.profile.last_name;
        
        await firebaseUpdateProfile(user, {
          displayName: `${firstName || ''} ${lastName || ''}`.trim()
        });
      }
      
      // Update email if changed
      if (profile.email !== undefined && profile.email !== state.profile.email && profile.email !== null) {
        await updateEmail(user, profile.email);
        updates.email = profile.email;
      }
      
      // Update profile in Firestore
      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, updates);
      
      // Update local state
      const updatedProfile = {
        ...state.profile,
        ...updates
      };
      
      setState(prev => ({ ...prev, profile: updatedProfile }));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      return { error: null };
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      return { error };
    }
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
  return profile && allowedRoles.includes(profile.role);
};
