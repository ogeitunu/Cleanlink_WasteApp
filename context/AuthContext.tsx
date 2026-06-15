import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

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
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (authId: string): Promise<User | null> => {
    try {
      const fetchPromise = supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();

      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 8000)
      );

      const result = await Promise.race([fetchPromise, timeoutPromise]);

      if (!result) return null;

      const { data, error } = result as Awaited<typeof fetchPromise>;
      if (error) throw error;

      if (data) return data as User;

      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser?.user) return null;

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
      return newProfile as User;

    } catch (err) {
      console.error('fetchUserProfile error:', err);
      return null;
    }
  };

  // ========================= NEW useEffect =========================
  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        if (!isMounted) return;

        setSession(newSession);

        if (newSession?.user) {
          // Unblock the app immediately with basic user data
          setUser({
            id: newSession.user.id,
            auth_id: newSession.user.id,
            email: newSession.user.email ?? '',
            role: 'resident',
            full_name: '',
            phone: null,
            nin: null,
            verified: false,
            avatar_url: null,
            created_at: '',
          } as User);

          // Fetch real profile in background — does not block rendering
          fetchUserProfile(newSession.user.id).then((profile) => {
            if (isMounted && profile) setUser(profile);
          });
        } else {
          setUser(null);
        }

        // Always unblock immediately — no waiting for DB
        if (isMounted) setLoading(false);
      }
    );

    // Trigger listener with current session (or null if not logged in)
    supabase.auth.getSession().catch(() => {
      if (isMounted) setLoading(false);
    });

    // Absolute safety net — 5 seconds max wait no matter what
    const safety = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(safety);
      subscription.unsubscribe();
    };
  }, []);
  // =================================================================

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error('Signup failed');

      await supabase.from('users').insert({
        auth_id: data.user.id,
        email,
        full_name: userData.full_name || '',
        phone: userData.phone || null,
        nin: userData.nin || null,
        role: userData.role || 'resident',
        verified: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

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

  const resetPassword = async (email: string): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'myapp://auth/reset-password',
      });
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}