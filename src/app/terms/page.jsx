import PrimaryNav from '@/components/layout/navigation/PrimaryNav';

const UPDATED_AT = 'February 19, 2026';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif">
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <PrimaryNav className="mb-6" />
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">World of Tethys</p>
          <h1 className="text-3xl md:text-5xl font-semibold text-stone-100 mt-3">Terms of Service</h1>
          <p className="text-xs text-stone-500 mt-2">Last updated: {UPDATED_AT}</p>
        </div>

        <div className="space-y-8 text-sm text-stone-300 leading-relaxed">
          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Agreement</h2>
            <p>
              These Terms govern your use of World of Tethys on worldoftethys.com. By accessing the
              service, you agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Use of the Service</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Use the service lawfully and respectfully.</li>
              <li>Do not attempt to disrupt, reverse‑engineer, or abuse the service.</li>
              <li>Do not upload or transmit unlawful or infringing content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Accounts</h2>
            <p>
              If you create an account, you are responsible for safeguarding your credentials and for activity under
              your account.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Content</h2>
            <p>
              World of Tethys content is owned by D.C. Barletta and collaborators unless otherwise stated. You may use
              it for personal, non‑commercial purposes unless explicit permission is granted.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Availability</h2>
            <p>
              The service is provided “as is.” We may modify, suspend, or discontinue the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Disclaimer</h2>
            <p>
              We disclaim all warranties to the maximum extent permitted by law. We are not liable for indirect,
              incidental, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Contact</h2>
            <p>
              Questions about these Terms? Contact
              {' '}
              <a className="text-stone-200 underline decoration-stone-600" href="mailto:dbarletta1981@outlook.com">
                dbarletta1981@outlook.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
