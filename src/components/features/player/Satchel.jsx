'use client';

import { useState } from 'react';
import { X, Package } from 'lucide-react';
import { useTethys } from '@/context/TethysContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Satchel({ isOpen, onClose }) {
  const { inventory } = useTethys();
  const [filter, setFilter] = useState('all');

  const stackedItems = inventory.reduce((acc, item) => {
    const key = item.name;
    if (!acc[key]) {
      acc[key] = { ...item, count: 0 };
    }
    acc[key].count += 1;
    return acc;
  }, {});

  const items = Object.values(stackedItems).filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-[#0c0a09] border border-stone-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-4 border-b border-stone-800 flex justify-between items-center bg-[#15100e]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-800 rounded text-amber-500">
                  <Package size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-200 uppercase tracking-widest">
                    Field Satchel
                  </h3>
                  <p className="text-[10px] text-stone-500 font-mono">
                    Capacity: {inventory.length} / 100
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-stone-800 flex gap-2 overflow-x-auto">
              {['all', 'material', 'starter', 'tool'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border transition-colors ${
                    filter === f
                      ? 'bg-amber-900/30 border-amber-600 text-amber-200'
                      : 'border-stone-700 text-stone-500 hover:border-stone-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.length === 0 ? (
                <div className="col-span-full py-12 text-center text-stone-600 text-xs italic">
                  Satchel is empty. Explore the map to find resources.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.name}
                    className="group relative bg-[#1c1917] border border-stone-800 rounded p-3 hover:border-stone-600 transition-colors"
                  >
                    <div className="aspect-square bg-black/40 rounded mb-3 flex items-center justify-center text-2xl">
                      {item.name.includes('Obsidian')
                        ? '⚫'
                        : item.name.includes('Branch')
                        ? '🌿'
                        : item.name.includes('Basalt')
                        ? '🪨'
                        : '📦'}
                    </div>
                    <div className="text-xs font-bold text-stone-300 truncate">{item.name}</div>
                    <div className="text-[9px] text-stone-500 uppercase tracking-wider mt-1">{item.rarity}</div>

                    <div className="absolute top-2 right-2 bg-stone-800 text-stone-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-stone-700">
                      x{item.count}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
