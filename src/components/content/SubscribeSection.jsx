'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SUBSTACK_URL =
  process.env.NEXT_PUBLIC_SUBSTACK_URL ||
  'https://pteroswifts.substack.com';

export default function SubscribeSection({ siteVariant }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const isAuthor = siteVariant === 'author';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg('Enter a valid email address.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    try {
      const form = new URLSearchParams();
      form.append('email', trimmed);
      form.append('first_url', typeof window !== 'undefined' ? window.location.href : '');

      await fetch(`${SUBSTACK_URL}/api/v1/free`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
        mode: 'no-cors',
      });

      setStatus('success');
      setEmail('');
      setTimeout(() => {
        router.push('/subscribe-confirm');
      }, 900);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Try again or subscribe directly.');
    }
  };

  if (isAuthor) {
    return (
      <section
        aria-label="Newsletter subscription"
        className="relative overflow-hidden rounded-[1.85rem] border border-[#8e765b]/25 bg-gradient-to-b from-[#fdf8f2] to-[#f4efe6] p-8 md:p-10 text-center"
        style={{ boxShadow: '0 4px 40px rgba(120,80,40,0.07)' }}
      >
        <div className="max-w-lg mx-auto space-y-5">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#7c6250] font-mono">
            Letters from the Albian Shore
          </p>

          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black text-[#2f1f14] tracking-tight">
              Pteroswifts from Tethys
            </h2>
            <p className="text-[#5c4033] text-sm leading-relaxed">
              Field notes, creature lore, and dispatches from the writing process.
              Free for readers who want to go deeper than the printed page.
            </p>
          </div>

          {status === 'success' ? (
            <div className="rounded-[1.3rem] border border-[#8e765b]/30 bg-[#f9f3e9] px-6 py-5">
              <p className="text-[#3d2b1a] text-sm font-semibold">You're in.</p>
              <p className="text-[#7c6250] text-xs mt-1">
                Check your inbox — your first dispatch is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" noValidate>
              <label htmlFor="subscribe-email-author" className="sr-only">
                Email address
              </label>
              <input
                id="subscribe-email-author"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="your@email.com"
                disabled={status === 'loading'}
                className="flex-1 rounded-[1.3rem] border border-[#8e765b]/30 bg-white/70 px-4 py-3 text-sm text-[#2f1f14] placeholder-[#a08060] outline-none focus:border-[#8e765b] focus:ring-1 focus:ring-[#8e765b]/30 disabled:opacity-50 transition"
                aria-invalid={errorMsg ? 'true' : 'false'}
                aria-describedby={errorMsg ? 'subscribe-error-author' : undefined}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="shrink-0 rounded-[1.3rem] bg-[#7a4f30] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5d3a22] focus:outline-none focus:ring-2 focus:ring-[#7a4f30] focus:ring-offset-2 focus:ring-offset-[#f4efe6] disabled:opacity-50 transition"
              >
                {status === 'loading' ? 'Sending…' : 'Subscribe Free'}
              </button>
            </form>
          )}

          {errorMsg && (
            <p id="subscribe-error-author" role="alert" className="text-red-700 text-xs">
              {errorMsg}{' '}
              <a
                href={`${SUBSTACK_URL}/subscribe`}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-red-600"
              >
                Subscribe on Substack
              </a>
            </p>
          )}

          <p className="text-[10px] text-[#a08060]">
            Free to read. No spam. Unsubscribe any time.{' '}
            <a
              href={SUBSTACK_URL}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-[#7a4f30] transition"
            >
              View on Substack ↗
            </a>
          </p>
        </div>
      </section>
    );
  }

  // Dark/world variant (when used on world site via dcbarletta portal)
  return (
    <section
      aria-label="Newsletter subscription"
      className="relative overflow-hidden rounded-[2rem] border border-amber-900/25 bg-gradient-to-b from-[#110f0e] to-[#0c0a09] p-8 md:p-12 text-center"
    >
      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        <p className="text-[10px] uppercase tracking-[0.5em] text-amber-600/80 font-mono">
          Signal Recovered · From Below the Waterline
        </p>
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#e3dcd2] to-[#9c7e5e] tracking-tight">
            Pteroswifts from Tethys
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            Field dispatches. Hidden lore. Exclusive to subscribers.
          </p>
        </div>

        {status === 'success' ? (
          <div className="rounded-[1.5rem] border border-amber-700/30 bg-amber-950/20 px-6 py-5">
            <p className="text-amber-200 text-sm font-semibold">Signal received.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" noValidate>
            <label htmlFor="subscribe-email-world" className="sr-only">Email address</label>
            <input
              id="subscribe-email-world"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errorMsg) setErrorMsg(''); }}
              placeholder="your@email.com"
              disabled={status === 'loading'}
              className="flex-1 rounded-[1.2rem] border border-white/10 bg-black/40 px-4 py-3 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700/50 disabled:opacity-50 transition"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="shrink-0 rounded-[1.2rem] bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition"
            >
              {status === 'loading' ? 'Sending…' : 'Subscribe Free'}
            </button>
          </form>
        )}

        {errorMsg && (
          <p role="alert" className="text-red-400 text-xs">
            {errorMsg}{' '}
            <a href={`${SUBSTACK_URL}/subscribe`} target="_blank" rel="noreferrer" className="underline">
              Subscribe on Substack
            </a>
          </p>
        )}

        <p className="text-[10px] text-stone-600">
          Free to read. No spam.{' '}
          <a href={SUBSTACK_URL} target="_blank" rel="noreferrer" className="underline hover:text-stone-400 transition">
            View on Substack ↗
          </a>
        </p>
      </div>
    </section>
  );
}
