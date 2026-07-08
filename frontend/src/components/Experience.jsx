import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// High-quality public brand vector logo mapping
const LOGO_MAPPING = {
  'Accenture': 'https://cdn.simpleicons.org/accenture',
  'Motilal Nehru College, Delhi University': null
};

export default function Experience({ experience = [], accordionMode = true }) {
  const [openCards, setOpenCards] = useState({ 1: true }); // Accenture open by default

  const handleToggle = (id) => {
    setOpenCards((prev) => {
      if (accordionMode) {
        return prev[id] ? {} : { [id]: true };
      } else {
        return { ...prev, [id]: !prev[id] };
      }
    });
  };

  const normalizedExperiences = experience.map(exp => ({
    ...exp,
    logoUrl: LOGO_MAPPING[exp.organization] || exp.logoUrl || null
  }));

  return (
    <section 
      id="experience" 
      className="relative w-full bg-paper border-y border-line/30 py-24 select-none"
    >
      <div className="max-w-[850px] mx-auto px-6 md:px-16 relative">
        {/* Main Content Area */}
        <div>
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-line/20 pb-6 mb-12">
            <div>
              <p className="font-mono text-[10px] text-blue tracking-[0.25em] mb-1.5">02 // EXPERIENCE_LOG</p>
              <h2 className="font-serif text-3xl md:text-4xl text-ink font-semibold tracking-tight">
                Experience Log
              </h2>
            </div>
            <span className="font-mono text-[9px] text-slate/50 tracking-widest uppercase">
              ROLE / ORG / IMPACT
            </span>
          </div>

          {/* Timeline + Stack of cards */}
          <div className="relative pl-6 md:pl-8 border-l border-line/20 space-y-8">
            
            {normalizedExperiences.map((exp, idx) => {
              const isOpen = !!openCards[exp.id];
              return (
                <div key={exp.id} className="relative">
                  
                  {/* Glowing/pulsing timeline dot indicator */}
                  <div className="absolute -left-[31px] md:-left-[39px] top-7 z-10 flex items-center justify-center">
                    {isOpen ? (
                      <span className="relative flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue shadow-[0_0_8px_rgba(42,92,219,0.8)]"></span>
                      </span>
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-line border border-line/80 transition-all duration-300"></span>
                    )}
                  </div>

                  {/* Experience Card */}
                  <ExperienceCard 
                    experience={exp} 
                    isOpen={isOpen} 
                    onToggle={() => handleToggle(exp.id)} 
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ experience, isOpen, onToggle }) {
  const [isIntroRunning, setIsIntroRunning] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsIntroRunning(true);
      const timer = setTimeout(() => {
        setIsIntroRunning(false);
      }, 500); // duration of the centered logo reveal
      return () => clearTimeout(timer);
    } else {
      setIsIntroRunning(false);
    }
  }, [isOpen]);

  const initials = experience.organization
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <motion.div 
      layout
      onClick={!isOpen ? onToggle : undefined}
      className={`relative border border-line/60 bg-panel/30 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 shadow-sm cursor-pointer overflow-hidden ${
        isOpen ? 'cursor-default border-blue/30 bg-panel/75 shadow-[0_4px_30px_rgba(0,0,0,0.15)]' : 'hover:border-blue/45 hover:bg-panel/50 hover:shadow-[0_4px_20px_rgba(42,92,219,0.06)]'
      }`}
    >
      {/* Centered logo reveal landing overlay */}
      <AnimatePresence>
        {isOpen && isIntroRunning && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper/85 backdrop-blur-[1px] z-20 pointer-events-none">
            <motion.div
              layoutId={`logo-${experience.id}`}
              className="w-24 h-24 rounded-2xl bg-panel border-2 border-blue/40 shadow-[0_0_40px_rgba(42,92,219,0.3)] flex items-center justify-center p-3"
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {experience.logoUrl && !logoFailed ? (
                <img 
                  src={experience.logoUrl} 
                  alt={experience.organization} 
                  className="w-16 h-16 object-contain" 
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span className="text-xl font-extrabold text-blue font-mono text-center leading-none">
                  {initials}
                </span>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Collapsed Card State */}
      {!isOpen && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] text-slate/50 uppercase tracking-widest">{experience.start_date} — {experience.end_date}</p>
            <h4 className="font-serif text-lg text-ink font-semibold mt-1 tracking-tight">{experience.role}</h4>
            <p className="text-[11px] font-mono text-blue uppercase tracking-widest mt-0.5">{experience.organization}</p>
          </div>
          <span className="text-slate/40 text-[10px] font-mono hover:text-blue transition-colors self-end sm:self-center">
            Click to expand ↗
          </span>
        </div>
      )}

      {/* Expanded Card State */}
      {isOpen && (
        <div>
          {/* Header Row - Instantly visible to avoid blank spaces */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              
              {/* Logo container (acts as target placeholder during morphing) */}
              <div className="w-10 h-10 rounded-lg bg-blue/10 border border-blue/30 flex items-center justify-center shrink-0">
                {!isIntroRunning && (
                  <motion.div
                    layoutId={`logo-${experience.id}`}
                    className="w-full h-full rounded-lg flex items-center justify-center"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {experience.logoUrl && !logoFailed ? (
                      <img 
                        src={experience.logoUrl} 
                        alt={experience.organization} 
                        className="w-7 h-7 object-contain" 
                        onError={() => setLogoFailed(true)}
                      />
                    ) : (
                      <span className="text-xs font-extrabold text-blue font-mono">{initials}</span>
                    )}
                  </motion.div>
                )}
              </div>
              
              <div>
                <h4 className="font-serif text-lg text-ink font-bold leading-tight">{experience.role}</h4>
                <p className="text-[11px] font-mono text-blue uppercase tracking-widest mt-0.5">{experience.organization}</p>
              </div>
            </div>

            {/* Close button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="text-slate/40 hover:text-blue hover:bg-blue/10 px-2 py-1 rounded-md transition-colors font-mono text-[10px] uppercase tracking-wider"
            >
              [close]
            </button>
          </div>

          {/* Details & bullets wrapper - mounts and staggers in after the intro finishes */}
          <div className="mt-6 pl-0 sm:pl-[56px] min-h-[80px]">
            <p className="font-mono text-[9px] text-slate/40 mb-4">{experience.start_date} — {experience.end_date}</p>
            
            <AnimatePresence>
              {!isIntroRunning && (
                <motion.ul
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.08 }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {experience.bullets.map((bullet, idx) => (
                    <motion.li
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                        }
                      }}
                      className="text-xs md:text-sm text-ink/80 font-sans leading-relaxed flex gap-2.5 items-start"
                    >
                      <span className="text-amber font-mono font-bold shrink-0">→</span>
                      <span>{bullet}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}
