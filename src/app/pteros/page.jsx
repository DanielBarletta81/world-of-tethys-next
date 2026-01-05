'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Droplets, Anchor, Navigation, Waves, Flame, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const PterosPage = () => {
  const [mounted, setMounted] = useState(false);
  const [flowRate, setFlowRate] = useState(8500); 
  const [turbulence, setTurbulence] = useState(45);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setFlowRate(prev => Math.max(8000, prev + (Math.random() * 400 - 200)));
      setTurbulence(prev => Math.min(100, Math.max(0, prev + (Math.random() * 10 - 5))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- CHART CONFIG (MAGMA STYLE) ---
  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'Estuary Violence',
        data: [20, 25, 45, 90, 85, 50, 30],
        borderColor: '#ea580c', // Orange-600
        backgroundColor: 'rgba(234, 88, 12, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#0c0a09',
        pointBorderColor: '#ea580c',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: { color: '#292524' },
        ticks: { color: '#78716c', font: { family: 'serif' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#78716c', font: { family: 'serif' } }
      }
    },
    plugins: { legend: { display: false } }
  };

  if (!mounted) return <div className="min-h-screen bg-[#0c0a09]"></div>;

  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif bg-stone-grain p-4 md:p-8">
      
      {/* NAV */}
      <div className="max-w-6xl mx-auto mb-8">
     
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#78716c] hover:text-orange-500 transition-colors">
          <ArrowLeft size={14} /> Return to Map
        </Link>
      </div>

      {/* HEADER: IRON & OBSIDIAN */}
      <header className="max-w-6xl mx-auto border-b-2 border-[#1c1917] pb-8 mb-12 flex flex-col md:flex-row justify-between items-end">
        <div>
          <div className="flex items-center gap-3 text-orange-900 mb-2">
            <Anchor size={24} />
            <span className="text-xs uppercase tracking-[0.4em] font-sans">Sector: Twin Straits</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-forge uppercase tracking-tighter">
            Pteros Watch
          </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-[#1c1917] p-4 border-l-4 border-orange-700 shadow-xl mt-6 md:mt-0">
          <div className="text-right">
            <div className="text-[10px] text-[#78716c] uppercase tracking-widest font-sans">Tide Status</div>
            <div className="text-xl font-bold text-orange-500 flex items-center justify-end gap-2">
              RISING <Waves size={18} className="animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COL 1: SENSORS (The Instruments) */}
        <div className="space-y-8">
          
          {/* River Inflow */}
          <div className="bg-[#1c1917] border border-[#292524] p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Navigation size={80} /></div>
            <h3 className="text-orange-800 text-s uppercase tracking-[0.2em] font-bold mb-4 font-sans border-b border-[#292524] pb-2">
              Danian River Inflow
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-[#e7e5e4]">{Math.floor(flowRate)}</span>
              <span className="text-sm text-[#78716c] font-sans">m³/s</span>
            </div>
            <div className="w-full bg-[#0c0a09] h-2 border border-[#292524]">
              <div className="h-full bg-orange-700 w-[75%] animate-pulse"></div>
            </div>
            <p className="text-s text-[#57534e] mt-4 italic">
              "Sediment plume thickening. The river brings bones from the north."
            </p>
          </div>

          {/* Turbulence/Threat */}
          <div className="bg-[#1c1917] border border-[#292524] p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={80} /></div>
            <h3 className="text-red-900 text-s uppercase tracking-[0.2em] font-bold mb-4 font-sans border-b border-[#292524] pb-2">
              Turbulence
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-5xl font-black ${turbulence > 80 ? 'text-red-600 animate-pulse' : 'text-[#e7e5e4]'}`}>
                {Math.floor(turbulence)}%
              </span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#57534e] flex justify-between mt-1">
              <span>Calm</span>
              <span>Violent</span>
            </div>
          </div>

        </div>

        {/* COL 2: THE CHART (The Seismograph) */}
        <div className="lg:col-span-2 bg-[#0c0a09] border-2 border-[#1c1917] p-8 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] relative">
          {/* Corner Brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#292524]"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#292524]"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#292524]"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#292524]"></div>

          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[#57534e] text-s uppercase tracking-[0.3em] font-sans">
              Biomass Activity Log
            </h3>
            <div className="flex items-center gap-2 text-orange-900 text-[10px] uppercase tracking-widest bg-orange-950/10 px-2 py-1 border border-orange-900/20">
              <Flame size={10} /> Live Feed
            </div>
          </div>
          
          <div className="h-[350px] w-full mix-blend-screen">
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="mt-6 pt-6 border-t border-[#1c1917] grid grid-cols-2 gap-4 text-center">
             <div>
               <div className="text-[9px] text-[#57534e] uppercase tracking-widest mb-1">Apex Sightings</div>
               <div className="text-lg font-bold text-red-700">Confirmed</div>
             </div>
             <div>
               <div className="text-[9px] text-[#57534e] uppercase tracking-widest mb-1">Water Clarity</div>
               <div className="text-lg font-bold text-[#78716c]">Murky</div>
             </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default PterosPage;