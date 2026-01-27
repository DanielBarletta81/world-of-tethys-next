// src/components/SystemDebug.jsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { useTethys } from '@/context/TethysContext';

export default function SystemDebug() {
  const { user, loading: authLoading } = useAuth();
  const { stats, isGuest, loadingData: dataLoading, inventory } = useTethys();

  if (process.env.NODE_ENV === 'production') return null; // Hide on live site

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-black/90 border border-red-500 text-green-400 font-mono text-[10px] z-[9999] max-w-sm overflow-hidden">
      <h3 className="text-red-500 font-bold border-b border-red-900 mb-2">SYSTEM DIAGNOSTIC</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span>Auth Loading:</span> <span className={authLoading ? 'text-yellow-400' : 'text-white'}>{String(authLoading)}</span>
        <span>User ID:</span> <span className="text-white">{user ? user.uid.slice(0,8)+'...' : 'NULL'}</span>
        <span>Data Loading:</span> <span className={dataLoading ? 'text-yellow-400' : 'text-white'}>{String(dataLoading)}</span>
        <span>Mode:</span> <span className={isGuest ? 'text-orange-400' : 'text-cyan-400'}>{isGuest ? 'GUEST (Local)' : 'CLOUD (Firestore)'}</span>
        <span>Inventory:</span> <span className="text-white">{inventory.length} Items</span>
        <span>Resin:</span> <span className="text-white">{stats.resin}</span>
      </div>
      {!user && !authLoading && (
        <div className="mt-2 text-red-400 italic">
          * If Login fails, check Console for Firebase Config errors.
        </div>
      )}
    </div>
  );
}
// World of Tethys || D.C. Barletta
