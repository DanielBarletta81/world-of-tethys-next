'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signInAnonymously, signOut, isSignInWithEmailLink, signInWithEmailLink, sendSignInLinkToEmail } from 'firebase/auth';
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

  // Handle email link completion if user landed via magic link
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const href = window.location.href;
    if (!isSignInWithEmailLink(auth, href)) return;

    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      email = window.prompt('Confirm your email to finish sign-in');
    }
    if (!email) return;

    signInWithEmailLink(auth, email, href)
      .then(() => {
        window.localStorage.removeItem('emailForSignIn');
      })
      .catch((error) => {
        console.error('Email link sign-in failed:', error);
      });
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

  const loginEmailLink = async (email) => {
    if (typeof window === 'undefined') return;
    try {
      const actionCodeSettings = {
        url: process.env.NEXT_PUBLIC_SITE_URL || window.location.origin,
        handleCodeInApp: true
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      return true;
    } catch (error) {
      console.error("Email link send error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginGoogle, loginGhost, loginEmailLink, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
