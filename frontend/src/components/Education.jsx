import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic descriptive details mapped to education IDs to populate the expanded view
const EDUCATION_DETAILS = {
  1: [
    'B.Tech CSE student specializing in AI/ML orchestrations and full-stack software development.',
    'Key Coursework: Data Structures & Algorithms, Database Management Systems, Operating Systems, Machine Learning.',
    'Maintained a strong academic record with active participation in development sprints and project builds.'
  ],
  2: [
    'Completed Senior Secondary Education under CBSE board with Science stream.',
    'Achieved a score of 91.7% in Class 12th Board Examinations.',
    'Focused on Mathematics, Physics, Chemistry, and Computer Science.'
  ],
  3: [
    'Completed Secondary School Education under CBSE board.',
    'Achieved a score of 89.4% in Class 10th Board Examinations.',
    'Developed foundation in sciences, mathematics, and analytical reasoning.'
  ]
};

export default function Education({ education = [], accordionMode = true }) {
  const [openCards, setOpenCards] = useState({ 1: true }); // NIT Patna open by default

  const handleToggle = (id) => {
    setOpenCards((prev) => {
      if (accordionMode) {
        return prev[id] ? {} : { [id]: true };
      } else {
        return { ...prev, [id]: !prev[id] };
      }
    });
  };

  return (
    <section 
      id="education" 
      className="relative w-full bg-paper border-y border-line/30 py-24 select-none"
    >
      <div className="max-w-[850px] mx-auto px-6 md:px-16 relative">
        {/* Main Content Area */}
        <div>
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-line/20 pb-6 mb-12">
            <div>
              <p className="font-mono text-[10px] text-blue tracking-[0.25em] mb-1.5">01 // EDUCATION_LOG</p>
              <h2 className="font-serif text-3xl md:text-4xl text-ink font-semibold tracking-tight">
                Education Log
              </h2>
            </div>
            <span className="font-mono text-[9px] text-slate/50 tracking-widest uppercase">
              INSTITUTION / SCORE / TIMELINE
            </span>
          </div>

          {/* Timeline + Stack of Education cards */}
          <div className="relative pl-6 md:pl-8 border-l border-line/20 space-y-8">
            
            {education.map((edu) => {
              const isOpen = !!openCards[edu.id];
              return (
                <div key={edu.id} className="relative">
                  
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

                  {/* Education Card */}
                  <EducationCard 
                    education={edu} 
                    isOpen={isOpen} 
                    onToggle={() => handleToggle(edu.id)} 
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

function EducationCard({ education, isOpen, onToggle }) {
  const [isIntroRunning, setIsIntroRunning] = useState(false);

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

  const initials = education.institution
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  // Graduation Cap Icon SVG
  const renderCapIcon = (sizeClass) => (
    <svg className={`${sizeClass} stroke-blue fill-none`} viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12v7a1 1 0 01-1 1h-2a1 1 0 01-1-1v-7"/>
    </svg>
  );

  const bullets = EDUCATION_DETAILS[education.id] || [];

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
              layoutId={`edu-logo-${education.id}`}
              className="w-24 h-24 rounded-2xl bg-panel border-2 border-blue/40 shadow-[0_0_40px_rgba(42,92,219,0.3)] flex items-center justify-center p-4 backdrop-blur-sm"
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderCapIcon("w-14 h-14")}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Collapsed Card State */}
      {!isOpen && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] text-slate/50 uppercase tracking-widest">
              {education.start_date ? `${education.start_date} — ` : ''}{education.end_date}
            </p>
            <h4 className="font-serif text-lg text-ink font-semibold mt-1 tracking-tight">{education.institution}</h4>
            <p className="text-[11px] font-mono text-blue/70 uppercase tracking-widest mt-0.5">{education.degree}</p>
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
                    layoutId={`edu-logo-${education.id}`}
                    className="w-full h-full rounded-lg flex items-center justify-center"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {renderCapIcon("w-6 h-6")}
                  </motion.div>
                )}
              </div>
              
              <div>
                <h4 className="font-serif text-lg text-ink font-bold leading-tight">{education.institution}</h4>
                <p className="text-[11px] font-mono text-blue uppercase tracking-widest mt-0.5">{education.degree}</p>
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

          {/* Details & stats wrapper - mounts and staggers in after the intro finishes */}
          <div className="mt-6 pl-0 sm:pl-[56px] min-h-[100px]">
            <p className="font-mono text-[9px] text-slate/40 mb-4">
              {education.start_date ? `${education.start_date} — ` : ''}{education.end_date}
            </p>
            
            <AnimatePresence>
              {!isIntroRunning && (
                <div className="space-y-6">
                  {/* Staggered Coursework Bullets */}
                  {bullets.length > 0 && (
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
                      {bullets.map((bullet, idx) => (
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
                          className="text-xs md:text-sm text-slate leading-relaxed flex gap-2.5 items-start"
                        >
                          <span className="text-amber font-mono font-bold shrink-0">→</span>
                          <span>{bullet}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}

                  {/* Highlights/Academic score */}
                  {education.score && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.4 }}
                      className="pt-6 border-t border-line/30 flex flex-col"
                    >
                      <span className="font-mono text-lg md:text-xl text-amber font-extrabold leading-none">
                        {education.score}
                      </span>
                      <span className="font-mono text-[9px] text-slate/50 mt-1.5 uppercase tracking-wider">
                        Academic Performance Score
                      </span>
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}
