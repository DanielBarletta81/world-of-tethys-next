// app/login/page.js
'use client';
import { useRouter } from 'next/navigation';
import IdentityAirLock from '@/components/forms/IdentityAirLock';

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 relative overflow-hidden">
      <div className="absolute top-10 left-0 right-0 text-center px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-[0.35em] uppercase text-transparent bg-clip-text bg-gradient-to-br from-orange-300 via-amber-200 to-red-600">
          World of Tethys
        </h1>
      </div>

      <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="relative flex items-center gap-4 bg-black/40 border border-emerald-800/40 rounded-full px-4 py-2 backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.18)]">
          <div className="absolute -inset-3 rounded-full kith-aura" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/kith-portrait.jpg"
            alt="Kith portrait"
            className="relative z-10 w-16 h-16 rounded-full object-cover border border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
          />
          <div className="relative z-10 bg-[#0d120f] border border-emerald-900/40 rounded-full px-4 py-2 text-[11px] text-emerald-100 font-mono tracking-wide">
            Are we acquainted, traveler?
            <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0d120f] border-l border-b border-emerald-900/40 rotate-45" />
          </div>
        </div>
      </div>

      <IdentityAirLock isOpen onClose={() => router.push('/')} />

      <style jsx>{`
        .kith-aura {
          background: radial-gradient(circle, rgba(16, 185, 129, 0.35), transparent 70%);
          filter: blur(10px);
          animation: kithPulse 4.8s ease-in-out infinite;
        }
        @keyframes kithPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.92); }
          50% { opacity: 0.9; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
// World of Tethys || D.C. Barletta
