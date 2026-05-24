import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  auth_id: string;
  role: 'collector' | 'resident' | 'admin';
  full_name: string;
  email: string;
  phone: string | null;
  nin: string | null;
  verified: boolean;
  avatar_url: string | null;
  created_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  //  Fetch or create profile safely
  const fetchUserProfile = async (authId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();

      if (error) throw error;

      // ✅ FIX: if profile doesn't exist, create it
      if (!data) {
        const { data: authUser } = await supabase.auth.getUser();

        if (!authUser?.user) return;

        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert({
            auth_id: authUser.user.id,
            email: authUser.user.email,
            role: 'resident',
            full_name: '',
            verified: false,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setUser(newProfile as User);
        return;
      }

      setUser(data as User);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Init session + auth listener
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      const session = data.session;
      setSession(session);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  //  SIGN UP
  const signUp = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (authError) throw authError;
      if (!authData.user)
        throw new Error('No user returned from signup');

      const { error: profileError } = await supabase
        .from('users')
        .insert({
          auth_id: authData.user.id,
          email,
          full_name: userData.full_name || '',
          phone: userData.phone || null,
          nin: userData.nin || null,
          role: userData.role || 'resident',
          verified: false,
        });

      if (profileError) throw profileError;
    } finally {
      setLoading(false);
    }
  };

  //  SIGN IN
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  //  SIGN OUT
  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, user, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}