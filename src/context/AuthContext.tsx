'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { getFirebaseAuth, getGoogleProvider } from '@/lib/firebaseClient';

type AuthUser = {
  uid: string;
  email?: string;
  displayName?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  loginEmail: (email: string, password: string) => Promise<AuthUser>;
  loginGoogle: () => Promise<AuthUser>;
  registerEmail: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadSession = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) {
          if (active) setUser(null);
        } else {
          const json = await res.json();
          if (active) setUser(json.user || null);
        }
      } catch (err) {
        if (active) {
          setUser(null);
          setError('Session check failed.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadSession();
    return () => {
      active = false;
    };
  }, []);

  const registerEmail = async (email: string, password: string) => {
    let res;
    try {
      res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
    } catch (err) {
      console.error('[auth] register network error', err);
      throw err;
    }
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      console.error('[auth] register failed', res.status, json);
      throw new Error(json.error || 'Registration failed.');
    }
    const json = await res.json();
    setUser(json.user || null);
    return json.user;
  };

  const loginEmail = async (email: string, password: string) => {
    let res;
    try {
      res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
    } catch (err) {
      console.error('[auth] login network error', err);
      throw err;
    }
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      console.error('[auth] login failed', res.status, json);
      throw new Error(json.error || 'Login failed.');
    }
    const json = await res.json();
    setUser(json.user || null);
    return json.user;
  };

  const loginGoogle = async () => {
    let userCredential;
    try {
      const auth = getFirebaseAuth();
      const provider = getGoogleProvider();
      userCredential = await signInWithPopup(auth, provider);
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in window closed.');
      }
      console.error('[auth] google popup error', err);
      throw new Error('Google sign-in failed.');
    }

    const idToken = await userCredential.user.getIdToken();
    let res;
    try {
      res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken })
      });
    } catch (err) {
      console.error('[auth] google network error', err);
      throw err;
    }
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      console.error('[auth] google failed', res.status, json);
      throw new Error(json.error || 'Google sign-in failed.');
    }
    const json = await res.json();
    setUser(json.user || null);
    return json.user;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      setUser(null);
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await fetch('/api/auth/delete', {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Account deletion failed.');
      }
      setUser(null);
    } catch (err) {
      console.error('Account deletion failed:', err);
      throw err;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-mono p-10 border-4 border-red-900">
        <div>
          <h1 className="text-2xl font-bold mb-4">CRITICAL DAMAGES...</h1>
          <p>{error}</p>
          <p className="text-sm text-stone-500 mt-4">Check console for specific missing keys.</p>
        </div>
      </div>
    );
  }

  const value: AuthContextValue = {
    user,
    loading,
    loginEmail,
    loginGoogle,
    registerEmail,
    logout,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
