'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserType {
  id: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // For development bypass, we'll use a simple mock auth
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Mock authentication - in a real app this would connect to your auth provider
    if (password === 'admin123') { // Same password as in login page
      setUser({ id: '1', email });
      document.cookie = 'is-admin=true; path=/';
      // Check if there's a redirect query parameter, otherwise default to admin
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect') || '/admin';
      router.push(redirect);
      router.refresh();
      setLoading(false);
      return { data: { user: { id: '1', email } }, error: null };
    } else {
      setLoading(false);
      return { data: null, error: { message: 'Invalid credentials' } };
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    // Mock sign up - in real app this would connect to your auth provider
    if (password.length >= 6) {
      setLoading(false);
      return { data: { user: { id: 'new', email } }, error: null };
    } else {
      setLoading(false);
      return { data: null, error: { message: 'Password too short' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    document.cookie = 'is-admin=; Max-Age=0; path=/';
    router.push('/login');
    router.refresh();
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}