import { useState } from 'react';
import SectionHeading from './SectionHeading.jsx';

export default function Profile({ profile }) {
  const p = profile || {};
  const [isProfessional, setIsProfessional] = useState(false);

  return (
    <section id="profile" className="max-w-content mx-auto px-6 md:px-10 py-20 border-t border-line/30">
      <SectionHeading index="§01" title="Identity & Career Path" note="ACCESS_CARD / TIMELINE" />
      
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start mt-8">
        
        {/* Left Column: Interactive Flip Card */}
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[10px] text-blue tracking-widest uppercase mb-1">Interactive Security Card</p>
          <div className="perspective-1000 w-full h-[255px]">
            <div 
              onClick={() => setIsProfessional(!isProfessional)}
              className={`relative w-full h-full duration-700 preserve-3d cursor-pointer ${isProfessional ? '[transform:rotateY(180deg)]' : ''}`}
            >
              
              {/* FRONT side: Personal Profile */}
              <div className="absolute inset-0 backface-hidden border border-line bg-panel/60 p-5 flex flex-row gap-6 shadow-sm rounded-xl">
                {/* Photo Frame */}
                <div className="relative w-[130px] h-[160px] border border-amber/40 bg-amber/5 shrink-0 self-center overflow-hidden flex items-center justify-center rounded-lg">
                  <img 
                    src="/about.jpg" 
                    alt="Anurag Sinha Personal Profile" 
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div>

                {/* Data Specifications */}
                <div className="flex flex-col justify-between py-1 flex-grow">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] text-amber tracking-wider font-bold">PERSONAL // ACCESS_CARD</span>
                      <span className="flex items-center gap-1.5 font-mono text-[9px] text-amber/80 font-bold bg-amber/10 px-1.5 py-0.5 border border-amber/30 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></span>
                        STANDBY
                      </span>
                    </div>
                    <h2 className="font-display text-2xl text-ink leading-tight font-bold">Anurag Sinha</h2>
                    
                    <div className="mt-4 space-y-1.5 font-mono text-[10px] text-ink/80">
                      <p><span className="text-slate">AGE:</span> 21 Years</p>
                      <p><span className="text-slate">LOC:</span> Patna, India</p>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-line pt-2.5 flex items-center justify-between">
                    <a 
                      href="https://www.instagram.com/anurag__sinha__w?igsh=cHo1dGdtb2I0czRy" 
                      onClick={(e) => e.stopPropagation()} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-1.5 border border-line bg-panel/30 px-3 py-1.5 text-[9px] font-mono text-ink rounded-lg hover:text-white hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-transparent hover:shadow-[0_0_12px_rgba(238,42,123,0.3)] transition-all duration-300"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                      Instagram
                    </a>
                    <span className="font-mono text-[8px] text-slate opacity-40">SPEC_REV_3</span>
                  </div>

                  {/* Floating attractive bouncing button */}
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="flex items-center gap-1.5 bg-blue text-paper px-3.5 py-1 border border-line font-mono text-[8.5px] tracking-widest font-bold uppercase shadow-[0_0_12px_rgba(42,92,219,0.55)] animate-bounce select-none rounded-full">
                      SWAP TO SPEC SHEET 🔄
                    </span>
                  </div>
                </div>
              </div>

              {/* BACK side: Professional Profile */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 border border-line bg-panel/60 p-5 flex flex-row gap-6 shadow-sm rounded-xl">
                {/* Photo Frame */}
                <div className="relative w-[130px] h-[160px] border border-ink/40 bg-ink/10 shrink-0 self-center overflow-hidden flex items-center justify-center rounded-lg">
                  <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-blue"></div>
                  <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-blue"></div>
                  <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-blue"></div>
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-blue"></div>
                  <img 
                    src="/profile.jpg" 
                    alt="Anurag Sinha Professional Profile" 
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div>

                {/* Data Specifications */}
                <div className="flex flex-col justify-between py-1 flex-grow">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] text-blue tracking-wider font-bold">CANDIDATE_ID // 067</span>
                      <span className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/30 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        ON_LINE
                      </span>
                    </div>
                    <h2 className="font-display text-2xl text-ink leading-tight font-bold">Anurag Sinha</h2>
                    <p className="font-mono text-[9px] text-slate tracking-tight mt-0.5">SWE (AI/ML & FULL-STACK)</p>
                    
                    <div className="mt-2.5 space-y-1 font-mono text-[9px] text-ink/80">
                      <p><span className="text-slate">ORG:</span> NIT Patna (B.Tech CSE)</p>
                      <p><span className="text-slate">EXP:</span> Accenture AIH Intern</p>
                      <p><span className="text-slate">LOC:</span> 25.6110° N, 85.1440° E</p>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-line pt-2 flex flex-col gap-1.5">
                    {/* Grid of Professional links */}
                    <div className="flex flex-wrap gap-1.5">
                      {p.github_url && (
                        <a 
                          href={p.github_url} 
                          onClick={(e) => e.stopPropagation()} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1 border border-line bg-panel/30 px-2 py-1 text-[8px] font-mono text-ink rounded hover:text-white hover:bg-[#24292F] hover:border-[#24292F] hover:shadow-[0_0_10px_rgba(36,41,47,0.2)] transition-all duration-300"
                        >
                          GH
                        </a>
                      )}
                      {p.linkedin_url && (
                        <a 
                          href={p.linkedin_url} 
                          onClick={(e) => e.stopPropagation()} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1 border border-line bg-panel/30 px-2 py-1 text-[8px] font-mono text-ink rounded hover:text-white hover:bg-[#0077B5] hover:border-[#0077B5] hover:shadow-[0_0_10px_rgba(0,119,181,0.2)] transition-all duration-300"
                        >
                          IN
                        </a>
                      )}
                      {p.leetcode_url && (
                        <a 
                          href={p.leetcode_url} 
                          onClick={(e) => e.stopPropagation()} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1 border border-line bg-panel/30 px-2 py-1 text-[8px] font-mono text-ink rounded hover:text-white hover:bg-[#FFA116] hover:border-[#FFA116] hover:shadow-[0_0_10px_rgba(255,161,22,0.2)] transition-all duration-300"
                        >
                          LC
                        </a>
                      )}
                      {p.gfg_url && (
                        <a 
                          href={p.gfg_url} 
                          onClick={(e) => e.stopPropagation()} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1 border border-line bg-panel/30 px-2 py-1 text-[8px] font-mono text-ink rounded hover:text-white hover:bg-[#2F8D46] hover:border-[#2F8D46] hover:shadow-[0_0_10px_rgba(47,141,70,0.2)] transition-all duration-300"
                        >
                          GFG
                        </a>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-slate text-[8px] font-mono border-t border-line border-dashed pt-1 mt-0.5">
                      <span>SPEC_REV_3</span>
                      <span className="opacity-40">ENCRYPTED</span>
                    </div>
                  </div>

                  {/* Floating attractive bouncing button */}
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="flex items-center gap-1.5 bg-amber text-paper px-3.5 py-1 border border-line font-mono text-[8.5px] tracking-widest font-bold uppercase shadow-[0_0_12px_rgba(245,158,11,0.55)] animate-bounce select-none rounded-full">
                      SWAP TO IDENTITY 🔄
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Flowchart Timeline */}
        <div className="border border-line bg-panel/60 p-6 rounded-xl flex flex-col justify-between">
          <p className="font-mono text-[10px] text-slate mb-4 tracking-widest uppercase">FIG. 1 — CANDIDATE CAREER PATH TIMELINE</p>
          <svg viewBox="0 0 420 410" className="w-full h-auto" role="img" aria-label="Timeline of Anurag Sinha's career path.">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-blue)" />
              </marker>
              <marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-amber)" />
              </marker>
            </defs>

            {/* corner brackets */}
            <path d="M6,6 L6,20 M6,6 L20,6" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-ink" />
            <path d="M414,6 L414,20 M414,6 L400,6" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-ink" />
            <path d="M6,404 L6,390 M6,404 L20,404" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-ink" />
            <path d="M414,404 L414,390 M414,404 L400,404" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-ink" />

            {/* STEP 1 */}
            <g className="timeline-node">
              <rect x="30" y="16" width="360" height="56" rx="6" stroke="currentColor" strokeWidth="1.2" className="fill-paper stroke-ink" />
              <text x="210" y="37" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12.5" fill="currentColor" className="text-blue font-bold node-title">01 // JEE MAINS & ADVANCED</text>
              <text x="210" y="55" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fill="currentColor" className="text-ink">JEE Mains: 99.096%ile · Advanced Qualified</text>
              <circle cx="52" cy="37" r="4.5" className="fill-emerald-500 animate-pulse" />
            </g>

            <path d="M210,72 L210,94" stroke="currentColor" strokeWidth="1.4" fill="none" className="dash-flow-fast text-blue" markerEnd="url(#arrow)" />

            {/* STEP 2 */}
            <g className="timeline-node">
              <rect x="30" y="96" width="360" height="56" rx="6" stroke="currentColor" strokeWidth="1.2" className="fill-paper stroke-ink" />
              <text x="210" y="117" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12.5" fill="currentColor" className="text-blue font-bold node-title">02 // NIT PATNA CSE</text>
              <text x="210" y="135" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fill="currentColor" className="text-ink">Got into NIT Patna (B.Tech Computer Science)</text>
              <circle cx="52" cy="117" r="4.5" className="fill-emerald-500 animate-pulse" />
            </g>

            <path d="M210,152 L210,174" stroke="currentColor" strokeWidth="1.4" fill="none" className="dash-flow-fast text-blue" markerEnd="url(#arrow)" />

            {/* STEP 3 */}
            <g className="timeline-node">
              <rect x="30" y="176" width="360" height="56" rx="6" stroke="currentColor" strokeWidth="1.2" className="fill-paper stroke-ink" />
              <text x="210" y="197" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12.5" fill="currentColor" className="text-blue font-bold node-title">03 // DEVELOPED IT SKILLS</text>
              <text x="210" y="215" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fill="currentColor" className="text-ink">AI/ML Dev, Full-Stack & 500+ DSA Problems</text>
              <circle cx="52" cy="197" r="4.5" className="fill-emerald-500 animate-pulse" />
            </g>

            <path d="M210,232 L210,254" stroke="currentColor" strokeWidth="1.4" fill="none" className="dash-flow-fast text-blue" markerEnd="url(#arrow)" />

            {/* STEP 4 */}
            <g className="timeline-node">
              <rect x="30" y="256" width="360" height="56" rx="6" stroke="currentColor" strokeWidth="1.2" className="fill-paper stroke-ink" />
              <text x="210" y="277" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12.5" fill="currentColor" className="text-blue font-bold node-title">04 // ACCENTURE INTERNSHIP</text>
              <text x="210" y="295" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fill="currentColor" className="text-ink">AEH Intern (LLM Enterprise Automation)</text>
              <circle cx="52" cy="277" r="4.5" className="fill-emerald-500 animate-pulse" />
            </g>

            <path d="M210,312 L210,334" stroke="currentColor" strokeWidth="1.4" fill="none" className="dash-flow-fast text-amber" markerEnd="url(#arrow-amber)" />

            {/* STEP 5 */}
            <g className="timeline-node-future">
              <rect x="90" y="336" width="240" height="56" rx="6" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" className="fill-paper stroke-ink" />
              <text x="210" y="357" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12.5" fill="currentColor" className="text-amber font-bold node-title">05 // NEXT MILESTONE</text>
              <text x="210" y="375" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="13" fill="currentColor" className="text-ink font-bold">?</text>
              <circle cx="112" cy="357" r="4.5" className="fill-amber animate-pulse" />
            </g>
          </svg>
        </div>

      </div>
    </section>
  );
}
