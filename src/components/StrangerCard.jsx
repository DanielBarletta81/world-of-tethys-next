'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Fingerprint } from 'lucide-react';
import useSoundFX from '@/hooks/useSoundFX'; // Import the hook

export default function StrangerCard({ stranger }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  

  const rotateX = useTransform(mouseY, [-200, 200], [15, -15]);
  const rotateY = useTransform(mouseX, [-200, 200], [-15, 15]);
  const { playWhine } = useSoundFX(); // Destructure the whine sound effect


  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  return (
    <div 
      className="perspective-1000 w-72 h-96"
      onMouseEnter={playWhine} // <--- TRIGGER: The High Pitched Whine
    >
      <motion.div
        style={{ rotateX: useTransform(mouseY, [-200, 200], [15, -15]), rotateY: useTransform(mouseX, [-200, 200], [-15, 15]) }}
        onMouseMove={onMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        className="w-full h-full relative preserve-3d transition-all duration-200 ease-out" >
        {/* CARD BASE (Obsidian) */}
        <div className="absolute inset-0 bg-[#0f0b09] border border-stone-800 rounded-xl shadow-2xl overflow-hidden group">
          
          {/* IMAGE LAYER */}
          <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-100 transition-opacity duration-500 mix-blend-luminosity"
               style={{ backgroundImage: `url(${stranger.image})` }} 
          />
          
          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

          {/* CONTENT LAYER (Floating) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-z-20">
            <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
              <Fingerprint size={12} className="text-amber-500" />
              <span className="text-[9px] uppercase tracking-[0.3em] text-amber-500/80 font-mono">
                Origin: {stranger.origin}
              </span>
            </div>
            
            <h3 className="text-2xl font-display text-stone-100 mb-1 tracking-wide group-hover:text-amber-100 transition-colors">
              {stranger.name}
            </h3>
            
            <p className="text-xs text-stone-500 font-serif italic leading-relaxed line-clamp-2 group-hover:text-stone-300 transition-colors">
              "{stranger.quote}"
            </p>
          </div>

          {/* HOLOGRAPHIC SHINE */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none bg-gradient-to-tr from-transparent via-white to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:animate-shine" />
        </div>
      </motion.div>
    </div>
  );
}