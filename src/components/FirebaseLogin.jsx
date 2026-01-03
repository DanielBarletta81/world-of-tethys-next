'use client';

import { useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { LogIn, LogOut, User } from 'lucide-react';

export default function FirebaseLogin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      setError('');
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError('Login failed. Check Firebase config and allowed domains.');
    }
  };

  const handleLogout = async () => {
    setError('');
    try {
      await signOut(auth);
    } catch (err) {
      setError('Logout failed.');
    }
  };

  return (
    <div className="bg-[#0c0a09] border border-stone-800 rounded-sm p-4 shadow-lg space-y-3">
      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">Identity</p>

      {loading ? (
        <div className="text-xs text-stone-500">Checking sigil...</div>
      ) : user ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {user.photoURL ? (
            <img src={user.photoURL} alt="avatar" className="w-10 h-10 rounded-full border border-stone-700" />
          ) : (
            <div className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-400">
              <User size={16} />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-stone-200">{user.displayName || 'Traveler'}</p>
            <p className="text-[11px] text-stone-500">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-[11px] uppercase tracking-[0.15em] border border-stone-700 text-stone-300 rounded-sm hover:border-amber-500 flex items-center gap-2"
          >
            <LogOut size={14} /> Exit
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 bg-amber-900/30 border border-amber-700/50 text-amber-200 uppercase tracking-[0.15em] text-xs rounded-sm hover:bg-amber-900/50 transition flex items-center justify-center gap-2"
        >
          <LogIn size={14} /> Identify with Google
        </button>
      )}

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <p className="text-[11px] text-stone-500">
        Syncs your resin, paths, and expedition notes to Firebase. Ensure env vars `NEXT_PUBLIC_FIREBASE_*` are set.
      </p>
    </div>
  );
}
