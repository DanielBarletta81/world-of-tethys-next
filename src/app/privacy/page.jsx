
const UPDATED_AT = 'February 19, 2026';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif">
      <div className="max-w-5xl mx-auto px-6 pt-10">
        
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">World of Tethys</p>
          <h1 className="text-3xl md:text-5xl font-semibold text-stone-100 mt-3">Privacy Policy</h1>
          <p className="text-xs text-stone-500 mt-2">Last updated: {UPDATED_AT}</p>
        </div>

        <div className="space-y-8 text-sm text-stone-300 leading-relaxed">
          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Scope</h2>
            <p>
              This Privacy Policy describes how World of Tethys (a project by D.C. Barletta) collects, uses, and
              shares information when you use our site and related services on worldoftethys.com.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Account data: email address, display name, and authentication identifiers if you sign in.</li>
              <li>Usage data: pages viewed, clicks, and interactions to improve the experience.</li>
              <li>Technical data: device type, browser, IP address, and basic diagnostics.</li>
              <li>Content you submit: prompts, feedback, or other inputs you provide.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">How We Use Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Operate, maintain, and improve the site and its features.</li>
              <li>Provide authentication, personalization, and security.</li>
              <li>Analyze aggregate usage to guide product decisions.</li>
              <li>Respond to requests, support, or legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Sharing</h2>
            <p>
              We share information only with trusted service providers that help us run the site (hosting, analytics,
              authentication, and storage). We may also share information if required by law or to protect users and the
              integrity of the service. We do not sell your data.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Retention</h2>
            <p>
              We retain data only as long as needed for the purposes described above, unless a longer retention period
              is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Your Choices</h2>
            <p>
              You can request access, correction, or deletion of your data by contacting us at
              {' '}
              <a className="text-stone-200 underline decoration-stone-600" href="mailto:dbarletta1981@outlook.com">
                dbarletta1981@outlook.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Children</h2>
            <p>The service is not intended for children under 13, and we do not knowingly collect their data.</p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Changes</h2>
            <p>
              We may update this policy from time to time. We will post updates on this page and revise the “Last
              updated” date.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
