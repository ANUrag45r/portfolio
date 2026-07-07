import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('english'); // 'english', 'hindi', 'exit'

  useEffect(() => {
    // English welcome phase: 1.8s
    const timer1 = setTimeout(() => {
      setPhase('hindi');
    }, 2000);

    // Hindi welcome phase: 1.8s
    const timer2 = setTimeout(() => {
      setPhase('exit');
    }, 4000);

    // Fade out and finish phase: 4.6s
    const timer3 = setTimeout(() => {
      onComplete();
    }, 4600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${phase === 'exit' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
      
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none"></div>

      <div className="max-w-md w-full px-6 text-center space-y-8 z-10">
        {/* High-Tech Terminal Header */}
        <div className="font-mono text-[9px] text-blue tracking-[0.25em] uppercase animate-pulse">
          INITIALIZING_PORTFOLIO_CORE // BOOT_LOADER
        </div>

        {/* Typewriter/Fade Message Box */}
        <div className="min-h-[100px] flex items-center justify-center">
          {phase === 'english' && (
            <h1 
              style={{ animation: 'fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} 
              className="font-display text-2xl md:text-3xl text-[#F4F6F3] leading-tight font-medium"
            >
              Welcome to <span className="text-blue font-bold">Anurag Sinha's</span> Portfolio
            </h1>
          )}
          {phase === 'hindi' && (
            <h1 
              style={{ animation: 'fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} 
              className="font-body text-2xl md:text-3xl text-[#F4F6F3] leading-tight font-medium"
            >
              अनुराग सिन्हा के <span className="text-blue font-bold">पोर्टफोलियो</span> में आपका स्वागत है
            </h1>
          )}
        </div>

        {/* Techy Loading Progress Bar */}
        <div className="relative w-full h-[2px] bg-white/10 overflow-hidden">
          <div 
            style={{ animation: 'progressBar 4s linear forwards' }} 
            className="absolute top-0 bottom-0 left-0 bg-blue"
          ></div>
        </div>

        {/* Metadata System Logs */}
        <div className="flex items-center justify-between font-mono text-[9px] text-slate-500/80 px-1">
          <span>STATUS: OK</span>
          <span>LANG: EN // HI</span>
          <span>LOAD: 4.6S</span>
        </div>
      </div>
    </div>
  );
}
