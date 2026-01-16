'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const registerEmail = async (email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || 'Registration failed.');
    }
    const json = await res.json();
    setUser(json.user || null);
    return json.user;
  };

  const loginEmail = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || 'Login failed.');
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

  return (
    <AuthContext.Provider value={{ user, loading, loginEmail, registerEmail, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
