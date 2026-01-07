'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Fingerprint, Ghost, X, Sprout, Wind, Eye } from 'lucide-react';

// Ravel's whispers while the system loads/authenticates
const WHISPERS = [
  "The soil remembers your footfall...",
  "Listening for the pulse...",
  "Are you of the Iron, or the Root?",
  "The Pith are watching form the canopy...",
  "Weaving the connection...",
  "Quiet. The Kith speaks?",
  "Left ear roots, right ear blooms...",
  "The story is written in vines, not ink...",
  "Offer a signal to be remembered..."
];

export default function IdentityAirLock({ isOpen, onClose }) {
  const { loginGoogle, loginGhost } = useAuth();
  const [status, setStatus] = useState('dormant'); // dormant | sensing | woven | drifting
  const [whisper, setWhisper] = useState(WHISPERS[0]);

  // Cycle Ravel's whispers during the "Sensing" phase
  useEffect(() => {
    if (status === 'sensing') {
      const interval = setInterval(() => {
        setWhisper(WHISPERS[Math.floor(Math.random() * WHISPERS.length)]);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleGoogle = async () => {
    setStatus('sensing');
    // Cinematic delay to let the "Whispers" play out
    await new Promise(r => setTimeout(r, 2500));
    try {
      await loginGoogle();
      setStatus('woven');
      setTimeout(onClose, 500);
    } catch (e) {
      setStatus('dormant'); // Reset on failure
    }
  };

  const handleGhost = async () => {
    setStatus('sensing');
    await new Promise(r => setTimeout(r, 1500));
    await loginGhost();
    setStatus('drifting');
    setTimeout(onClose, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050403]/95 backdrop-blur-sm p-6"
        >
          {/* THE SPORE FIELD (Background Animation) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-emerald-500/20 rounded-full blur-[1px] animate-float"
                style={{
                  width: Math.random() * 4 + 2 + 'px',
                  height: Math.random() * 4 + 2 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animationDuration: Math.random() * 10 + 10 + 's',
                  animationDelay: Math.random() * 5 + 's',
                }}
              />
            ))}
          </div>

          {/* THE RITUAL CARD */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-[#0c0a09] border border-emerald-900/40 rounded-xl shadow-[0_0_80px_rgba(16,185,129,0.15)] relative overflow-hidden group"
          >
            
            {/* 1. Header: Ravel's Gaze */}
            <div className="relative h-48 flex flex-col items-center justify-center border-b border-emerald-900/20 overflow-hidden bg-gradient-to-b from-emerald-950/20 to-transparent">
              <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
              
              {/* The "Eye" Animation */}
              <div className="relative z-10 mb-4">
                <div className={`absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full transition-all duration-1000 ${status === 'sensing' ? 'scale-150 opacity-100' : 'scale-100 opacity-40'}`} />
                <div className={`relative p-4 rounded-full border border-emerald-500/30 bg-[#0c0a09] transition-all duration-500 ${status === 'sensing' ? 'shadow-[0_0_30px_#10b981]' : ''}`}>
                  {status === 'sensing' ? (
                    <Eye size={32} className="text-emerald-400 animate-pulse" />
                  ) : status === 'woven' ? (
                    <Fingerprint size={32} className="text-emerald-400" />
                  ) : (
                    <Sprout size={32} className="text-stone-500 group-hover:text-emerald-500 transition-colors" />
                  )}
                </div>
              </div>
              
              {/* Status Text */}
              <div className="relative z-10 text-center px-6">
                <h2 className="text-lg font-serif text-emerald-100/90 tracking-widest uppercase mb-1">
                  {status === 'sensing' ? 'Ravel is Listening...' : 'Commune with Kith'}
                </h2>
                <p className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-[0.3em] h-4">
                  {status === 'sensing' ? whisper : 'Identity Required'}
                </p>
              </div>
            </div>

            {/* 2. The Choice (Inputs) */}
            <div className="p-8 space-y-6 relative z-10 bg-[#0c0a09]">
              {status === 'dormant' && (
                <>
                  <p className="text-xs text-stone-500 text-center font-serif italic leading-relaxed">
                    "The archive is written in memory, not ink.<br/>
                    Offer a signal to be remembered."
                  </p>

                  {/* PRIMARY: GOOGLE (Entangle) */}
                  <button
                    onClick={handleGoogle}
                    className="group/btn w-full relative flex items-center justify-center gap-3 bg-[#161311] hover:bg-[#1f1c19] border border-emerald-800/40 hover:border-emerald-500/60 text-emerald-50 py-4 transition-all duration-500 rounded-sm overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-emerald-900/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
                    <Fingerprint size={16} className="text-emerald-600 group-hover/btn:text-emerald-400 transition-colors relative z-10" />
                    <span className="text-xs font-bold uppercase tracking-[0.25em] relative z-10">
                      Entangle Soul-Sig
                    </span>
                  </button>

                  <div className="flex items-center gap-2 opacity-30">
                    <div className="h-px bg-stone-700 flex-1" />
                    <span className="text-[9px] text-stone-500 uppercase tracking-widest">Or</span>
                    <div className="h-px bg-stone-700 flex-1" />
                  </div>

                  {/* SECONDARY: GHOST (Drift) */}
                  <button
                    onClick={handleGhost}
                    className="w-full flex items-center justify-center gap-2 text-stone-600 hover:text-stone-400 text-[10px] uppercase tracking-[0.2em] transition-colors py-2 group/ghost"
                  >
                    <Wind size={14} className="group-hover/ghost:translate-x-1 transition-transform" /> 
                    Drift as Spore (Guest)
                  </button>
                </>
              )}

              {/* LOADING STATE VIEW */}
              {status === 'sensing' && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-full h-1 bg-stone-900 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 font-mono animate-pulse">
                    Parsing bio-resonance...
                  </p>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 p-2 text-stone-700 hover:text-emerald-500 transition-colors z-20"
            >
              <X size={16} />
            </button>

          </motion.div>
        </motion.div>
      )}

      {/* Global Styles for the Spore Float Animation */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          25% { opacity: 0.5; }
          75% { opacity: 0.5; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </AnimatePresence>
  );
}
