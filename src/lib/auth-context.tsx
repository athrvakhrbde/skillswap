'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseUser, signIn, signUp, signOutUser, onAuthChange } from './firebase';

type AuthContextType = {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  isFirebaseAvailable: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState<boolean>(
    typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  );

  useEffect(() => {
    // Skip Firebase auth subscription if it's not available (during SSR/build)
    if (!isFirebaseAvailable) {
      setLoading(false);
      return () => {};
    }

    try {
      const unsubscribe = onAuthChange((authUser) => {
        setUser(authUser);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Failed to subscribe to auth changes:', err);
      setLoading(false);
      return () => {};
    }
  }, [isFirebaseAvailable]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!isFirebaseAvailable) {
      setError('Firebase is not available. Check your configuration.');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await signIn(email, password);
      
      if (!result.success) {
        setError(result.error || 'Failed to sign in');
        return false;
      }
      
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    if (!isFirebaseAvailable) {
      setError('Firebase is not available. Check your configuration.');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await signUp(email, password, name);
      
      if (!result.success) {
        setError(result.error || 'Failed to register');
        return false;
      }
      
      return true;
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!isFirebaseAvailable) {
      setError('Firebase is not available. Check your configuration.');
      return;
    }

    try {
      setLoading(true);
      await signOutUser();
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        isFirebaseAvailable,
      }}
    >
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