'use client'; // 1. CRITICAL FIX: Tells Next.js this is a Client Component

import React, { useState, useEffect } from 'react';
import { Activity, Droplets, Anchor, Navigation, Waves, Fish, AlertTriangle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const PterosDashboard = () => {
  // 2. CRITICAL FIX: Hydration Mismatch Prevention
  // We use a 'mounted' state to ensure we only render the complex interactive parts 
  // (like random numbers and Charts) after the client has fully loaded.
  const [mounted, setMounted] = useState(false);

  const [salinity, setSalinity] = useState(15); 
  const [flowRate, setFlowRate] = useState(8500); 
  const [threatLevel, setThreatLevel] = useState('ELEVATED');
  
  useEffect(() => {
    setMounted(true); // Signal that we are on the client
    
    const interval = setInterval(() => {
      // Logic remains the same, but now safe from SSR mismatch
      setSalinity(prev => Math.min(35, Math.max(0, prev + (Math.random() - 0.5))));
      setFlowRate(prev => Math.max(8000, prev + (Math.random() * 200 - 100)));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const activityData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'Bait Biomass (Tons)',
        data: [120, 115, 200, 350, 340, 180, 130],
        borderColor: '#06b6d4', 
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Apex Activity',
        data: [10, 5, 15, 85, 90, 40, 20],
        borderColor: '#f43f5e', 
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: { color: '#292524' },
        ticks: { color: '#78716c' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#78716c' }
      }
    },
    plugins: {
      legend: { labels: { color: '#a8a29e' } }
    }
  };

  // If not mounted yet (Server Side), render a simplified static version 
  // or a loading skeleton to prevent the HTML mismatch.
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0c0a09] p-8 flex items-center justify-center">
        <div className="text-amber-600 animate-pulse uppercase tracking-widest text-xs">
          Initializing Pteros Sensor Array...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-mono p-4 md:p-8">
      
      {/* Top Bar: Station Info */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#292524] pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-amber-500 uppercase flex items-center gap-3">
            <Anchor className="w-8 h-8" /> Outpost: Pteros Central
          </h1>
          <p className="text-xs text-[#78716c] uppercase tracking-[0.2em] mt-1">
            Twin Straits Monitoring Station • Estuary Sector Alpha
          </p>
        </div>
        <div className="flex items-center gap-4 bg-[#1c1917] p-3 rounded border border-[#292524]">
          <div className="text-right">
            <div className="text-[10px] text-[#78716c] uppercase">Current Era</div>
            <div className="font-bold text-amber-500">111.4 M.Y.A.</div>
          </div>
          <div className="h-8 w-[1px] bg-[#44403c]"></div>
          <div className="text-right">
            <div className="text-[10px] text-[#78716c] uppercase">Threat Status</div>
            <div className={`font-bold ${threatLevel === 'CRITICAL' ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`}>
              {threatLevel}
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Hydro-Dynamics */}
        <div className="space-y-6">
          
          <div className="bg-[#1c1917] border border-[#292524] p-6 rounded-lg relative overflow-hidden group hover:border-cyan-800 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Waves size={64} /></div>
            <h3 className="text-cyan-500 text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
              <Navigation className="w-4 h-4" /> Danian River Inflow
            </h3>
            <div className="flex items-end gap-2 mb-2">
              {/* Data is safe to render now because of 'mounted' check */}
              <span className="text-4xl font-bold text-white">{Math.floor(flowRate)}</span>
              <span className="text-sm text-[#78716c] mb-1">m³/s</span>
            </div>
            <div className="w-full bg-[#0c0a09] h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-600 w-[75%] animate-pulse"></div>
            </div>
            <p className="text-[10px] text-[#78716c] mt-3">
              Freshwater pulse detected from Ironwoods watershed. Nutrient load increasing.
            </p>
          </div>

          <div className="bg-[#1c1917] border border-[#292524] p-6 rounded-lg relative overflow-hidden group hover:border-emerald-800 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Droplets size={64} /></div>
            <h3 className="text-emerald-500 text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Estuary Salinity
            </h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-white">{salinity.toFixed(1)}</span>
              <span className="text-sm text-[#78716c] mb-1">PPT</span>
            </div>
            <div className="flex text-[10px] uppercase tracking-wider justify-between text-[#57534e] mt-2">
              <span>Fresh (0)</span>
              <span>Brackish (15)</span>
              <span>Marine (35)</span>
            </div>
            <div className="w-full h-2 rounded-full mt-1 bg-gradient-to-r from-cyan-300 via-emerald-500 to-blue-900 relative">
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-2 h-4 bg-white border border-black shadow"
                style={{ left: `${(salinity / 35) * 100}%`, transition: 'left 1s ease' }}
              ></div>
            </div>
          </div>

        </div>

        {/* Column 2: The Feeding Frenzy (Central Chart) */}
        <div className="lg:col-span-2 bg-[#1c1917] border border-[#292524] p-6 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#a8a29e] text-xs uppercase tracking-widest font-bold flex items-center gap-2">
              <Fish className="w-4 h-4" /> Biomass Interaction Log
            </h3>
            <span className="px-2 py-1 bg-[#292524] text-[10px] uppercase text-rose-400 border border-rose-900/30 rounded animate-pulse">
              Frenzy Imminent
            </span>
          </div>
          
          <div className="h-[300px] w-full">
            <Line data={activityData} options={chartOptions} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#292524]">
             <div>
               <div className="text-[10px] text-[#78716c] uppercase">Dominant Bait</div>
               <div className="text-cyan-400 font-bold">Silver-Scale Schools</div>
             </div>
             <div>
               <div className="text-[10px] text-[#78716c] uppercase">Dominant Predator</div>
               <div className="text-rose-400 font-bold">Spinosaurus Aegyptiacus</div>
             </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: The Twin Straits Status */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-[#1c1917] border border-[#292524] p-4 rounded flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#0c0a09] flex items-center justify-center border border-[#292524] text-[#57534e]">W</div>
            <div>
              <h4 className="font-bold text-sm text-[#e7e5e4]">West Strait</h4>
              <p className="text-[10px] text-[#78716c] uppercase">Turbidity: High (River Plume)</p>
            </div>
          </div>
          <div className="text-emerald-500 text-xs font-bold bg-emerald-950/30 px-3 py-1 rounded border border-emerald-900">
            SAFE PASSAGE
          </div>
        </div>

        <div className="bg-[#1c1917] border-l-4 border-rose-600 p-4 rounded flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#0c0a09] flex items-center justify-center border border-[#292524] text-rose-800">E</div>
            <div>
              <h4 className="font-bold text-sm text-[#e7e5e4]">East Strait</h4>
              <p className="text-[10px] text-[#78716c] uppercase">Marine Influx Detected</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-950/30 px-3 py-1 rounded border border-rose-900">
            <AlertTriangle size={12} />
            APEX BREACH
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default PterosDashboard;
