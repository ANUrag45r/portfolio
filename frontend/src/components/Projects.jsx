import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Vector logo mapping based on project primary technologies
const TECH_LOGO_MAPPING = {
  1: 'https://cdn.simpleicons.org/pytorch',     // PyTorch for Deep Fake News Detection
  2: 'https://cdn.simpleicons.org/socketdotio'  // Socket.io for Social Nexus Hub
};

export default function Projects({ projects = [], accordionMode = true }) {
  const [openCards, setOpenCards] = useState({ 1: true }); // Project 1 open by default

  const handleToggle = (id) => {
    setOpenCards((prev) => {
      if (accordionMode) {
        return prev[id] ? {} : { [id]: true };
      } else {
        return { ...prev, [id]: !prev[id] };
      }
    });
  };

  const normalizedProjects = projects.map(proj => ({
    ...proj,
    logoUrl: TECH_LOGO_MAPPING[proj.id] || null
  }));

  return (
    <section 
      id="projects" 
      className="relative w-full bg-[#0a0e17] bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] border-y border-line/30 py-24 select-none"
    >
      <div className="max-w-[1000px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-[60px_1fr] gap-6 relative">
        
        {/* Left vertical rotated sidebar text */}
        <div className="hidden md:flex flex-col items-center justify-start pt-2 select-none font-mono">
          <span className="uppercase tracking-[0.3em] rotate-180 whitespace-nowrap text-slate/30 text-[9px] font-extrabold [writing-mode:vertical-lr] text-center">
            AI/ML &amp; FULL-STACK ENGINEER
          </span>
          <div className="w-[1px] h-24 bg-blue/20 mt-6"></div>
        </div>

        {/* Main Content Area */}
        <div>
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-line/20 pb-6 mb-12">
            <div>
              <p className="font-mono text-[10px] text-blue tracking-[0.25em] mb-1.5">03 // PROJECT_SPECS</p>
              <h2 className="font-serif text-3xl md:text-4xl text-ink font-semibold tracking-tight">
                Project Specs
              </h2>
            </div>
            <span className="font-mono text-[9px] text-slate/50 tracking-widest uppercase">
              STACK / RESULTS / SOURCE
            </span>
          </div>

          {/* Timeline + Stack of Project cards */}
          <div className="relative pl-6 md:pl-8 border-l border-line/20 space-y-8">
            
            {normalizedProjects.map((proj) => {
              const isOpen = !!openCards[proj.id];
              return (
                <div key={proj.id} className="relative">
                  
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

                  {/* Project Card */}
                  <ProjectCard 
                    project={proj} 
                    isOpen={isOpen} 
                    onToggle={() => handleToggle(proj.id)} 
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

function ProjectCard({ project, isOpen, onToggle }) {
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

  const initials = project.title
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <motion.div 
      layout
      onClick={!isOpen ? onToggle : undefined}
      className={`relative border border-line/60 bg-[#0d121f]/45 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 shadow-sm cursor-pointer overflow-hidden ${
        isOpen ? 'cursor-default border-blue/30 bg-[#0d121f]/80 shadow-[0_4px_30px_rgba(0,0,0,0.15)]' : 'hover:border-blue/45 hover:bg-[#0d121f]/65 hover:shadow-[0_4px_20px_rgba(42,92,219,0.06)]'
      }`}
    >
      {/* Centered logo reveal landing overlay */}
      <AnimatePresence>
        {isOpen && isIntroRunning && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e17]/85 backdrop-blur-[1px] z-20 pointer-events-none">
            <motion.div
              layoutId={`proj-logo-${project.id}`}
              className="w-24 h-24 rounded-2xl bg-[#141b2e] border-2 border-blue/40 shadow-[0_0_40px_rgba(42,92,219,0.3)] flex items-center justify-center p-4 backdrop-blur-sm"
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {project.logoUrl && !logoFailed ? (
                <img 
                  src={project.logoUrl} 
                  alt={project.title} 
                  className="w-14 h-14 object-contain filter brightness-110" 
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
            <p className="font-mono text-[9px] text-slate/50 uppercase tracking-widest">{project.start_date}</p>
            <h4 className="font-serif text-lg text-ink font-semibold mt-1 tracking-tight">{project.title}</h4>
            <p className="text-[10px] font-mono text-blue/70 uppercase tracking-widest mt-0.5 max-w-[500px] truncate">{project.tech_stack}</p>
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
                    layoutId={`proj-logo-${project.id}`}
                    className="w-full h-full rounded-lg flex items-center justify-center"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {project.logoUrl && !logoFailed ? (
                      <img 
                        src={project.logoUrl} 
                        alt={project.title} 
                        className="w-6 h-6 object-contain" 
                        onError={() => setLogoFailed(true)}
                      />
                    ) : (
                      <span className="text-xs font-extrabold text-blue font-mono">{initials}</span>
                    )}
                  </motion.div>
                )}
              </div>
              
              <div>
                <h4 className="font-serif text-lg text-ink font-bold leading-tight">{project.title}</h4>
                <p className="text-[10px] font-mono text-slate/40 mt-1 uppercase">{project.start_date}</p>
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
          <div className="mt-6 pl-0 sm:pl-[56px] min-h-[120px]">
            <p className="text-xs md:text-sm text-ink/90 leading-relaxed mb-6 font-sans">
              {project.summary}
            </p>
            
            <AnimatePresence>
              {!isIntroRunning && (
                <div className="space-y-6">
                  {/* Staggered Bullets */}
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
                    {project.bullets?.map((bullet, idx) => (
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
                        <span className="text-blue font-mono font-bold shrink-0">·</span>
                        <span>{bullet}</span>
                      </motion.li>
                    ))}
                  </motion.ul>

                  {/* Metrics/Results Row */}
                  {project.metrics?.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="flex flex-wrap gap-6 pt-6 border-t border-line/30"
                    >
                      {project.metrics.map((m, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="font-mono text-lg md:text-xl text-amber font-extrabold leading-none">
                            {m.value}
                          </span>
                          <span className="font-mono text-[9px] text-slate/50 mt-1 uppercase tracking-wider">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Tech stack and GitHub link */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="pt-6 border-t border-line/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <p className="font-mono text-[10px] text-blue leading-relaxed max-w-[80%]">
                      {project.tech_stack}
                    </p>
                    {project.github_url && (
                      <a 
                        href={project.github_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="font-mono text-xs text-blue hover:text-blue/80 hover:underline shrink-0 flex items-center gap-1"
                      >
                        Source →
                      </a>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}
