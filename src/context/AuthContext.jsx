'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInAnonymously
} from 'firebase/auth';
import { auth, googleProvider, hasFirebaseConfig, registerPlayer, loginPlayer, logoutPlayer } from '@/lib/firebase';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hasFirebaseConfig || !auth) {
      setError('Firebase not initialized. Check your .env.local file for NEXT_PUBLIC_ keys.');
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);


  const registerEmail = async (email, password) => {
    if (!auth) return null;
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  const loginEmail = async (email, password) => {
    if (!auth) return null;
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  const loginGoogle = async () => {
    if (!auth) return;
    const provider = googleProvider || new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Link Failed:", error);
    }
  };

  const loginGhost = async () => {
    if (!auth) return;
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Ghost Link Failed:", error);
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sever Failed:", error);
    }
  };

  // 2. RENDER ERROR STATE ON SCREEN
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
    <AuthContext.Provider value={{ user, loading, loginEmail, registerEmail,loginGoogle, loginGhost, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
