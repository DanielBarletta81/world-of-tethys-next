'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
// Relative import to the firebase config file
import { auth, googleProvider } from '../lib/firebase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for auth state changes
    // This fires whenever the user logs in, logs out, or the page reloads
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- LOGIN ACTIONS ---

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const loginGhost = async () => {
    try {
      // Anonymous login for "Ghost Mode"
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Ghost Login Error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginGoogle, loginGhost, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);