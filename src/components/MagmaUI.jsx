// components/MagmaUI.jsx
import React from 'react';

// The "Magmaglow" border effect
export const MagmaCard = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    {/* Glowing animated border background */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
    
    {/* The Obsidian Card */}
    <div className="relative flex flex-col items-center bg-slate-950 border border-slate-800 rounded-lg p-8 shadow-2xl">
      {children}
    </div>
  </div>
);

export const MagmaButton = ({ onClick, children, secondary = false }) => {
  if (secondary) {
    return (
      <button 
        onClick={onClick}
        className="w-full mt-3 px-4 py-2 text-slate-400 bg-slate-900 border border-slate-700 hover:text-white hover:border-slate-500 rounded transition-colors text-sm"
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="w-full px-6 py-3 font-bold text-white transition-all duration-300 rounded bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 shadow-[0_0_15px_rgba(234,88,12,0.5)] hover:shadow-[0_0_25px_rgba(234,88,12,0.8)]"
    >
      {children}
    </button>
  );
};

export const InputField = ({ type, placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full p-3 mb-4 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder-slate-500"
  />
);
// World of Tethys || D.C. Barletta
