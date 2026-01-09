'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  signInAnonymously
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Ensure this file exists!

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Link Failed:", error);
    }
  };

  const loginGhost = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Ghost Link Failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sever Failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginGoogle, loginGhost, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
// World of Tethys || D.C. Barletta
