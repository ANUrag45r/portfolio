import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const contactSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message cannot exceed 2000 characters" })
});

export default function Contact({ profile = {} }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' }
  });

  const [submitStatus, setSubmitStatus] = useState({ state: 'idle', message: '', error: '' });

  const onSubmit = async (data) => {
    setSubmitStatus({ state: 'sending', message: '', error: '' });
    try {
      const response = await axios.post(`${API_BASE}/contact`, data);
      setSubmitStatus({
        state: 'sent',
        message: 'Your message has been sent successfully.',
        error: ''
      });
      reset();
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to send message. Please try again.';
      setSubmitStatus({
        state: 'error',
        message: '',
        error: errMsg
      });
    }
  };

  // Icons
  const mailIcon = (
    <svg className="w-5 h-5 text-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );

  const phoneIcon = (
    <svg className="w-5 h-5 text-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.622c0-1.03.94-1.884 1.972-1.68l2.923.577a1.979 1.979 0 011.614 1.42l.779 2.923a1.979 1.979 0 01-1.423 2.4l-1.31.23a15.507 15.507 0 006.52 6.52l.23-1.31a1.979 1.979 0 012.4-1.423l2.923.779a1.979 1.979 0 011.42 1.614l.577 2.923c.204 1.033-.65 1.972-1.68 1.972h-1.607a21.458 21.458 0 01-20.893-20.893V6.622z" />
    </svg>
  );

  const locationIcon = (
    <svg className="w-5 h-5 text-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );

  const paperPlaneIcon = (
    <svg className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );

  return (
    <section 
      id="contact" 
      className="relative w-full bg-[#0a0e17] bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] border-t border-line/30 py-24 select-none"
    >
      <div className="max-w-[850px] mx-auto px-6 md:px-16 relative">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-line/20 pb-6 mb-12">
          <div>
            <p className="font-mono text-[10px] text-blue tracking-[0.25em] mb-1.5">05 // CONTACT_ENDPOINT</p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink font-semibold tracking-tight">
              Contact Endpoint
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-[9px] bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 px-2.5 py-1 rounded-md">
            <span className="font-bold">POST</span>
            <span className="text-slate/60">/api/contact</span>
          </div>
        </div>

        {/* Form and info grid */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Details Column */}
          <div className="space-y-6">
            <p className="text-xs md:text-sm text-slate leading-relaxed font-sans max-w-sm">
              Reach out about internships, full-time roles, or collaboration. Messages are stored directly in the database below.
            </p>

            <div className="space-y-4">
              {profile.email && (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-line/60 bg-panel/30 shadow-sm hover:border-blue/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center shrink-0">
                    {mailIcon}
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-slate/50 uppercase tracking-widest">Email Address</p>
                    <a href={`mailto:${profile.email}`} className="text-xs md:text-sm font-mono text-ink hover:text-blue hover:underline mt-0.5 block">
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile.phone && (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-line/60 bg-panel/30 shadow-sm hover:border-blue/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center shrink-0">
                    {phoneIcon}
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-slate/50 uppercase tracking-widest">Phone Number</p>
                    <p className="text-xs md:text-sm font-mono text-ink mt-0.5">
                      {profile.phone}
                    </p>
                  </div>
                </div>
              )}

              {profile.location && (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-line/60 bg-panel/30 shadow-sm hover:border-blue/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center shrink-0">
                    {locationIcon}
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-slate/50 uppercase tracking-widest">Office Location</p>
                    <p className="text-xs md:text-sm font-mono text-ink mt-0.5">
                      {profile.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Column */}
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="border border-line/60 bg-[#0d121f]/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl space-y-5 shadow-sm hover:border-blue/30 transition-all duration-300"
          >
            <div>
              <label className="font-mono text-[9px] text-slate/60 tracking-wider uppercase">NAME</label>
              <input
                {...register('name')}
                className={`w-full mt-1.5 bg-[#0a0e17]/50 border ${errors.name ? 'border-red-500' : 'border-line/50'} rounded-lg px-4 py-3 text-xs md:text-sm text-ink placeholder-slate/40 focus:border-blue focus:shadow-[0_0_12px_rgba(59,130,246,0.15)] outline-none transition-all duration-200`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-red-500 font-mono text-[10px] mt-1">⚠️ {errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="font-mono text-[9px] text-slate/60 tracking-wider uppercase">EMAIL</label>
              <input
                {...register('email')}
                className={`w-full mt-1.5 bg-[#0a0e17]/50 border ${errors.email ? 'border-red-500' : 'border-line/50'} rounded-lg px-4 py-3 text-xs md:text-sm text-ink placeholder-slate/40 focus:border-blue focus:shadow-[0_0_12px_rgba(59,130,246,0.15)] outline-none transition-all duration-200`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 font-mono text-[10px] mt-1">⚠️ {errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="font-mono text-[9px] text-slate/60 tracking-wider uppercase">MESSAGE</label>
              <textarea
                {...register('message')}
                rows={4}
                className={`w-full mt-1.5 bg-[#0a0e17]/50 border ${errors.message ? 'border-red-500' : 'border-line/50'} rounded-lg px-4 py-3 text-xs md:text-sm text-ink placeholder-slate/40 focus:border-blue focus:shadow-[0_0_12px_rgba(59,130,246,0.15)] outline-none resize-none transition-all duration-200`}
                placeholder="What would you like to discuss?"
              />
              {errors.message && (
                <p className="text-red-500 font-mono text-[10px] mt-1">⚠️ {errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full font-mono text-xs bg-blue hover:bg-blue/85 hover:shadow-[0_4px_20px_rgba(59,130,246,0.35)] text-white rounded-lg py-3 px-6 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 font-bold cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending…</span>
                </div>
              ) : (
                <>
                  <span>Send message</span>
                  {paperPlaneIcon}
                </>
              )}
            </button>

            {submitStatus.state === 'sent' && (
              <p className="font-mono text-xs text-[#10b981] mt-2 flex items-center gap-1.5 bg-[#10b981]/15 border border-[#10b981]/25 p-3 rounded-lg">
                <span>✓</span> {submitStatus.message}
              </p>
            )}
            {submitStatus.state === 'error' && (
              <p className="font-mono text-xs text-red-400 mt-2 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                ⚠️ {submitStatus.error}
              </p>
            )}
          </form>

        </div>
      </div>
    </section>
  );
}
