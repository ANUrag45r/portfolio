import { useState } from 'react';

export default function Hero({ profile }) {
  const p = profile || {};

  return (
    <section 
      id="top" 
      className="max-w-[1200px] mx-auto px-6 md:px-16 pt-32 pb-20 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center min-h-[90vh] relative select-none"
    >
      
      {/* Left Column: Stats, Greeting, Taglines, Socials, Status */}
      <div className="flex flex-col justify-between py-4 z-10 h-full">
        <div>
          {/* Top Left Stats */}
          <div className="flex gap-8 mb-8 select-none">
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink leading-none">
                500+
              </span>
              <span className="text-[9px] font-mono text-slate/60 uppercase tracking-wider mt-2.5">
                DSA Solved
              </span>
            </div>
          </div>

          {/* Huge Hello. Greeting */}
          <h1 className="font-display text-[5.5rem] sm:text-[7.2rem] md:text-[8.5rem] lg:text-[9.5rem] xl:text-[11rem] font-black tracking-tighter leading-[0.85] text-ink select-none mb-6">
            Hello.
          </h1>

          {/* Subheading Tagline */}
          <p className="text-slate text-base md:text-lg font-light tracking-wide font-sans mb-8 max-w-md leading-relaxed">
            — I'm Anurag, an aspiring <span className="text-ink font-semibold">AI/ML &amp; Full-Stack Engineer</span>. I build intelligent automations and high-performance web systems.
          </p>

          {/* Brand-Colored Social Hover Badges */}
          <div className="flex flex-wrap gap-4 mb-10">
            {/* GitHub */}
            {p.github_url && (
              <a 
                href={p.github_url} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="GitHub"
                className="grid size-14 place-items-center rounded-xl border border-line bg-panel/30 text-slate hover:text-white hover:bg-[#24292F] hover:border-[#24292F] hover:shadow-[0_0_15px_rgba(36,41,47,0.3)] transition-all duration-300"
              >
                <svg className="w-[24px] h-[24px] fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
            )}
            {/* LinkedIn */}
            {p.linkedin_url && (
              <a 
                href={p.linkedin_url} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="LinkedIn"
                className="grid size-14 place-items-center rounded-xl border border-line bg-panel/30 text-slate hover:text-white hover:bg-[#0077B5] hover:border-[#0077B5] hover:shadow-[0_0_15px_rgba(0,119,181,0.3)] transition-all duration-300"
              >
                <svg className="w-[23px] h-[23px] fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
            {/* LeetCode */}
            {p.leetcode_url && (
              <a 
                href={p.leetcode_url} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="LeetCode"
                className="grid size-14 place-items-center rounded-xl border border-line bg-panel/30 text-slate hover:text-white hover:bg-[#FFA116] hover:border-[#FFA116] hover:shadow-[0_0_15px_rgba(255,161,22,0.3)] transition-all duration-300"
              >
                <svg className="w-[23px] h-[23px] fill-current" viewBox="0 0 24 24">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0z"/>
                </svg>
              </a>
            )}
            {/* GfG */}
            {p.gfg_url && (
              <a 
                href={p.gfg_url} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="GeeksforGeeks"
                className="grid size-14 place-items-center rounded-xl border border-line bg-panel/30 text-slate hover:text-white hover:bg-[#2F8D46] hover:border-[#2F8D46] hover:shadow-[0_0_15px_rgba(47,141,70,0.3)] transition-all duration-300"
              >
                <svg className="w-[23px] h-[23px] fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.8 13.7c-.5.4-1 .6-1.7.6-.8 0-1.4-.3-1.8-.8s-.6-1.2-.6-2.1c0-.9.2-1.6.6-2.1s1-.8 1.8-.8c.7 0 1.2.2 1.7.6l.7-1.1c-.7-.6-1.6-.9-2.4-.9-1.3 0-2.3.5-3 1.4S6.5 11.5 6.5 13s.3 2.6 1 3.5c.7.9 1.7 1.4 3 1.4.8 0 1.7-.3 2.4-.9l-.7-1.3zm7.3-4.9c-.5-.4-1-.6-1.7-.6-.8 0-1.4.3-1.8.8s-.6 1.2-.6 2.1c0 .9.2 1.6.6 2.1s1 .8 1.8 .8c.7 0 1.2-.2 1.7-.6l.7 1.1c-.7.6-1.6.9-2.4.9-1.3 0-2.3-.5-3-1.4s-1-2.1-1-3.6.3-2.6 1-3.5c.7-.9 1.7-1.4 3-1.4.8 0 1.7.3 2.4.9l-.7 1.2z" />
                </svg>
              </a>
            )}
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/anurag__sinha__w?igsh=cHo1dGdtb2I0czRy" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="Instagram"
              className="grid size-14 place-items-center rounded-xl border border-line bg-panel/30 text-slate hover:text-white hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-transparent hover:shadow-[0_0_15px_rgba(238,42,123,0.35)] transition-all duration-300"
            >
              <svg className="w-[24px] h-[24px] fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            {/* Email */}
            {p.email && (
              <a 
                href={`mailto:${p.email}`} 
                aria-label="Email"
                className="grid size-14 place-items-center rounded-xl border border-line bg-panel/30 text-slate hover:text-white hover:bg-blue hover:border-blue hover:shadow-[0_0_15px_rgba(59,130,246,0.35)] transition-all duration-300"
              >
                <svg className="w-[24px] h-[24px] fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            )}
            {/* Resume */}
            {p.resume_url && (
              <a 
                href={p.resume_url} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Resume"
                className="grid size-14 place-items-center rounded-xl border border-line bg-panel/30 text-slate hover:text-white hover:bg-[#10b981] hover:border-[#10b981] hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all duration-300"
              >
                <svg className="w-[23px] h-[23px] fill-current" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6zm2-5h8v1.5H8V15zm0-3h8v1.5H8V12zm0-3h4v1.5H8V9z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Scroll Indicators & Open to Work Status Badge */}
        <div className="flex items-center gap-5 text-slate/50 font-mono text-[9.5px] select-none mt-4">
          <span 
            onClick={() => document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' })}
            className="uppercase tracking-widest cursor-pointer hover:text-blue transition-colors flex items-center gap-1.5"
          >
            Scroll down <span className="animate-bounce">↓</span>
          </span>
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/5 px-3.5 py-1.5 shadow-[0_0_15px_rgba(16,185,129,0.04)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative flex">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[8.5px] font-bold text-[#10b981] uppercase tracking-widest">Open to work</span>
          </div>
        </div>
      </div>

      {/* Right Column: Portrait Frame with animated background accents */}
      <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden select-none pointer-events-none group rounded-2xl flex items-center justify-center">
        
        {/* Animated Background Radar Rings & Soft Glow */}
        <div className="absolute w-[340px] h-[340px] rounded-full border border-blue/10 animate-[spin_35s_linear_infinite] z-0 pointer-events-none"></div>
        <div className="absolute w-[440px] h-[440px] rounded-full border border-dashed border-blue/5 animate-[spin_55s_linear_infinite_reverse] z-0 pointer-events-none"></div>
        <div className="absolute w-[240px] h-[240px] rounded-full bg-blue/[0.04] blur-[80px] z-0 pointer-events-none"></div>

        <img 
          src="/profile_nobg.png" 
          alt="Anurag Sinha Portrait" 
          className="absolute inset-0 w-full h-full object-contain object-bottom transition-all duration-700 ease-out origin-bottom-right drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)] drop-shadow-[0_0_50px_rgba(42,92,219,0.18)] z-10"
        />
        
        {/* Seamless blends based on theme background variables */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper via-paper/40 to-transparent z-20"></div>
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-paper via-paper/70 to-transparent z-20"></div>
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-paper/30 to-transparent z-20"></div>
      </div>
      
    </section>
  );
}
