import { useState } from 'react';
import SectionHeading from './SectionHeading.jsx';
import { submitContact } from '../api.js';

export default function Contact({ profile = {} }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', error: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: 'sending', error: '' });
    try {
      await submitContact(form);
      setStatus({ state: 'sent', error: '' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ state: 'error', error: err.message || 'Something went wrong.' });
    }
  }

  return (
    <section id="contact" className="max-w-content mx-auto px-6 md:px-10 py-16">
      <SectionHeading index="§05" title="Contact Endpoint" note="POST /api/contact" />
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-sm text-ink/80 max-w-sm leading-relaxed">
            Reach out about internships, full-time roles, or collaboration. Messages are stored directly to the database below.
          </p>
          <dl className="mt-8 space-y-3 font-mono text-sm">
            {profile.email && (
              <div className="flex gap-3">
                <dt className="text-slate w-16">Email</dt>
                <dd><a href={`mailto:${profile.email}`} className="text-blue hover:underline">{profile.email}</a></dd>
              </div>
            )}
            {profile.phone && (
              <div className="flex gap-3">
                <dt className="text-slate w-16">Phone</dt>
                <dd className="text-ink">{profile.phone}</dd>
              </div>
            )}
            {profile.location && (
              <div className="flex gap-3">
                <dt className="text-slate w-16">Based in</dt>
                <dd className="text-ink">{profile.location}</dd>
              </div>
            )}
          </dl>
        </div>

        <form onSubmit={handleSubmit} className="border border-line bg-panel/40 p-6 space-y-4">
          <div>
            <label className="font-mono text-[10px] text-slate tracking-wide">NAME</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 bg-white border border-line px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-blue outline-none"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] text-slate tracking-wide">EMAIL</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 bg-white border border-line px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-blue outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] text-slate tracking-wide">MESSAGE</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full mt-1 bg-white border border-line px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-blue outline-none resize-none"
              placeholder="What would you like to discuss?"
            />
          </div>

          <button
            type="submit"
            disabled={status.state === 'sending'}
            className="font-mono text-xs bg-ink text-paper px-4 py-2.5 hover:bg-blue transition-colors disabled:opacity-50"
          >
            {status.state === 'sending' ? 'Sending…' : 'Send message →'}
          </button>

          {status.state === 'sent' && (
            <p className="font-mono text-xs text-blue">✓ Message received. Thank you.</p>
          )}
          {status.state === 'error' && (
            <p className="font-mono text-xs text-red-600">
              {status.error} (Is the backend running? Check README — falls back gracefully otherwise.)
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
