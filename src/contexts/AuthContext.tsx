
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      return !!data;
    } catch (err) {
      console.error('Error checking admin role:', err);
      return false;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          const admin = await checkAdminRole(currentUser.id);
          setIsAdmin(admin);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          const admin = await checkAdminRole(currentUser.id);
          setIsAdmin(admin);
        }
      })
      .catch((err) => {
        console.error('Auth getSession failed:', err);
      })
      .finally(() => {
        setLoading(false);
      });

    // Safety timeout — if Supabase never responds (e.g. blocked by an
    // ad-blocker or network filter), still release the loading gate so the
    // UI can render the login screen instead of hanging on "Loading...".
    const timeout = window.setTimeout(() => setLoading(false), 4000);

    const unsub = subscription.unsubscribe.bind(subscription);
    subscription.unsubscribe = () => {
      window.clearTimeout(timeout);
      unsub();
    };

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) return false;
    const admin = await checkAdminRole(data.user.id);
    setIsAdmin(admin);
    return admin;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isAdmin, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
