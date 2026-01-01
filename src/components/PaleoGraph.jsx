'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Save, CheckCircle } from 'lucide-react';
import RecentMarks from './RecentMarks';

export default function PaleoGraph() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | signing | signed | error

  const signTheSlate = async (e) => {
    e.preventDefault();
    setStatus('signing');
    try {
      const res = await fetch('/api/tethys/sign_slate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: name, content: message })
      });
      if (!res.ok) throw new Error('Etching failed');
      setStatus('signed');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="bg-[#f2eadd] border-2 border-[#3d2b1f] p-1 shadow-[6px_6px_0_rgba(61,43,31,0.15)] relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-50 pointer-events-none" />

      <div className="p-5 relative z-10 flex flex-col gap-4">
        <header className="flex justify-between items-center border-b-2 border-[#3d2b1f]/10 pb-3">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#8a3c23] block mb-1">
              Field Recorder
            </span>
            <h3 className="font-display text-lg text-[#1a1510] leading-none">The Paleo-Graph</h3>
          </div>
          <div className="bg-[#3d2b1f] text-[#e6ded0] p-2 rounded-full">
            <PenTool className="w-4 h-4" />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {status === 'signed' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center space-y-2"
            >
              <CheckCircle className="w-8 h-8 text-[#10b981] mx-auto" />
              <p className="font-display text-xl text-[#1a1510]">Mark Recorded</p>
              <p className="text-xs font-mono text-[#5c4f43]">The archive remembers you.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={signTheSlate}
              className="space-y-3"
            >
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#5c4f43] mb-1 block">
                  Explorer Handle
                </label>
                <input
                  required
                  maxLength={40}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Igzier"
                  className="w-full bg-[#e6ded0] border border-[#3d2b1f]/30 p-2 text-sm font-display text-[#1a1510] placeholder:text-[#5c4f43]/50 focus:border-[#8a3c23] outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#5c4f43] mb-1 block">
                  Inscription
                </label>
                <textarea
                  required
                  rows={2}
                  maxLength={140}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I stood at the Weep..."
                  className="w-full bg-[#e6ded0] border border-[#3d2b1f]/30 p-2 text-sm font-serif italic text-[#1a1510] placeholder:text-[#5c4f43]/50 focus:border-[#8a3c23] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'signing'}
                className="w-full py-3 bg-[#1a1510] text-[#e6ded0] font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-[#8a3c23] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'signing' ? (
                  'Etching...'
                ) : (
                  <>
                    <Save className="w-3 h-3" />
                    Etch into Stone
                  </>
                )}
              </button>

              {status === 'error' && (
                <p className="text-[9px] text-red-700 text-center font-mono">
                  ERROR: Chisel broke. Try again.
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <RecentMarks />
    </div>
  );
}
