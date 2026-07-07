import { useEffect, useState } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Profile from './components/Profile.jsx';
import Education from './components/Education.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import DevConsole from './components/DevConsole.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import { fetchProfile, fetchProjects } from './api.js';
import { fallbackProfile, fallbackProjects } from './data/fallbackData.js';

export default function App() {
  const [data, setData] = useState(fallbackProfile);
  const [projects, setProjects] = useState(fallbackProjects);
  const [usingLiveData, setUsingLiveData] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Custom Cursor coordinates & mobile detection
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(true);

  const loadData = () => {
    let cancelled = false;
    Promise.all([fetchProfile(), fetchProjects()])
      .then(([profileData, projectsData]) => {
        if (!cancelled) {
          setData(profileData);
          setProjects(projectsData);
          setUsingLiveData(true);
        }
      })
      .catch(() => {
        // Backend/MySQL not reachable yet — silently keep fallback data
        setUsingLiveData(false);
      });
    return () => { cancelled = true; };
  };

  useEffect(() => {
    const cancel = loadData();
    return cancel;
  }, []);

  // Monitor mouse movements for trail follower
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 1024px)').matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      {/* Desktop Custom Trail Cursor */}
      {!isMobile && !showSplash && (
        <>
          {/* Inner solid blue dot */}
          <div 
            className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue transition-all duration-[80ms] ease-out shadow-[0_0_8px_rgba(42,92,219,0.6)]"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: '6px',
              height: '6px',
            }}
          />
          {/* Outer lag ring */}
          <div 
            className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue/40 transition-all duration-[180ms] ease-out"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: '30px',
              height: '30px',
            }}
          />
        </>
      )}

      {/* Sticky Vertical Left Sidebar (Desktop Only) */}
      {!showSplash && (
        <div className="hidden xl:flex flex-col items-center justify-center fixed left-2 top-0 h-screen select-none font-mono z-30 pointer-events-none">
          <div className="flex flex-col items-center gap-16">
            <span className="uppercase tracking-[0.25em] -rotate-90 whitespace-nowrap origin-center text-slate/40 text-[9px] font-bold">
              AI/ML &amp; FULL-STACK ENGINEER
            </span>
            <div className="w-[1px] h-32 bg-line/60"></div>
          </div>
        </div>
      )}
      
      <div className="min-h-screen">
        <Nav />
        <Hero profile={data.profile} />
        <Profile profile={data.profile} />
        <Education education={data.education} />
        <Experience experience={data.experience} />
        <Projects projects={projects} />
        <Skills skills={data.skills} achievements={data.achievements} />
        <Contact profile={data.profile} />
        <Footer profile={data.profile} />

        <DevConsole 
          profileData={data} 
          projects={projects} 
          onRefresh={loadData} 
        />

        {!usingLiveData && (
          <div className="fixed bottom-4 right-4 font-mono text-[10px] bg-ink text-paper px-3 py-2 opacity-80 z-40">
            Showing offline data — start the backend to connect MySQL
          </div>
        )}
      </div>
    </>
  );
}
