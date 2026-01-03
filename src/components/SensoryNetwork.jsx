'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import AtmosphericTotem from './AtmosphericTotem';

// --- THE DATA: SENSORY CHANNELS ---
const CHANNELS = [
  {
    id: 'silurian',
    label: 'Silurian Current',
    icon: '🌊', // Or a custom SVG of a wave/gill
    color: 'text-cyan-500',
    borderColor: 'border-cyan-800',
    bg: 'bg-cyan-950/90',
    messages: [
      "The sediment tastes of copper... fresh blood in the estuary.",
      "The tide brings a message: The Weep is rising.",
      "Smell that? Ozone and fear. A storm approaches the surface.",
      "The water carries the taste of Jairo's perfume... he was here."
    ]
  },
  {
    id: 'thal',
    label: 'Thal Resonance',
    icon: '🪨', 
    color: 'text-stone-400',
    borderColor: 'border-stone-600',
    bg: 'bg-stone-900/90',
    messages: [
      "The stone groans. Heavy machinery moving in the Foundry.",
      "Can you feel the tremor? Two hearts beating as one in the Upper Tier.",
      "The earth remembers the footsteps of the Ancients.",
      "Vibrations in the deep rock... the Sluice Gate has opened."
    ]
  },
  {
    id: 'ironwood',
    label: 'Canopy Rustle',
    icon: '🍂', 
    color: 'text-emerald-400',
    borderColor: 'border-emerald-800',
    bg: 'bg-emerald-950/90',
    messages: [
      "The leaves are whispering... strangers climbing the western stalk.",
      "Pollen counts are high. The madness comes with the wind.",
      "The roots tell of a meeting beneath the Great Bough.",
      "A shiver in the timber. The Ash Drakes are roosting early."
    ]
  },
  {
    id: 'skycity',
    label: 'High Echoes',
    icon: '🏛️', 
    color: 'text-amber-500',
    borderColor: 'border-amber-800',
    bg: 'bg-amber-950/90',
    messages: [
      "Did you see his velvet coat? Pure silk, hiding a serrated blade.",
      "The best dressed are always the first to kill. Watch the Councilman.",
      "Echoes in the Royal Alcove... soft moans and sharp whispers.",
      "Jairo's lover wore a mask at the ball. But I know that walk.",
      "Elegance is a warning in Sky City. Never trust a clean hem."
    ]
  }
];

export default function SensoryNetwork() {
  const [currentChannel, setCurrentChannel] = useState(CHANNELS[3]); // Start with Sky City
  const [msgIndex, setMsgIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // CHANGE CHANNEL & MESSAGE EVERY 10 SECONDS
    const interval = setInterval(() => {
      // 1. Pick a random channel
      const randomChannel = CHANNELS[Math.floor(Math.random() * CHANNELS.length)];
      setCurrentChannel(randomChannel);
      
      // 2. Pick a random message from that channel
      const randomMsgIndex = Math.floor(Math.random() * randomChannel.messages.length);
      setMsgIndex(randomMsgIndex);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm pointer-events-none font-serif">
      <AnimatePresence mode='wait'>
      <AtmosphericTotem className="absolute -top-20 left-1/2 -translate-x-1/2 w-16 h-16 mb-4 pointer-events-auto" />
        <motion.div 
          key={currentChannel.id + msgIndex} // Re-animate on change
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.8 }}
          className="flex items-end gap-3"
        >
          
          {/* THE SENSORY ORGAN (Icon) */}
          <div className={`w-10 h-10 rounded-full ${currentChannel.bg} ${currentChannel.borderColor} border flex items-center justify-center shadow-lg relative overflow-hidden group`}>
            <span className="text-xl filter drop-shadow-md">{currentChannel.icon}</span>
            {/* Unique Pulse Color */}
            <div className={`absolute inset-0 border rounded-full animate-ping opacity-20 ${currentChannel.color.replace('text', 'border')}`}></div>
          </div>

          {/* THE MESSAGE BOX */}
          <div className={`${currentChannel.bg} backdrop-blur-md border-l-2 ${currentChannel.borderColor} px-5 py-4 shadow-2xl rounded-r-lg rounded-tl-lg relative overflow-hidden`}>
            
            {/* Header: "Silurian Current" etc */}
            <div className={`text-[9px] uppercase tracking-[0.2em] mb-2 font-bold ${currentChannel.color} flex justify-between items-center`}>
              {currentChannel.label}
              {/* Signal Strength Dots */}
              <div className="flex gap-0.5">
                <div className={`w-1 h-1 rounded-full ${currentChannel.color} animate-pulse`}></div>
                <div className={`w-1 h-1 rounded-full ${currentChannel.color} opacity-50`}></div>
                <div className={`w-1 h-1 rounded-full ${currentChannel.color} opacity-20`}></div>
              </div>
            </div>

            {/* The Text */}
            <p className="text-sm italic text-stone-200 leading-relaxed min-h-[3rem]">
              "{currentChannel.messages[msgIndex]}"
            </p>
            
            {/* Visual Texture Overlay */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay"></div>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}