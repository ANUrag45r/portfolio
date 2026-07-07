import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [typedCommand, setTypedCommand] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show prompt header
    const t1 = setTimeout(() => setVisibleLines(1), 100);
    // Show prompt path line
    const t2 = setTimeout(() => setVisibleLines(2), 250);

    // Typewriter effect for "$ npm run dev"
    const commandText = '$ npm run dev';
    let currentTyped = '';
    let charIndex = 0;

    const t3 = setTimeout(() => {
      setVisibleLines(3); // Start typing command line
      const typeInterval = setInterval(() => {
        if (charIndex < commandText.length) {
          currentTyped += commandText[charIndex];
          setTypedCommand(currentTyped);
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Proceed to print server boot logs
          triggerServerLogs();
        }
      }, 60);
    }, 450);

    const triggerServerLogs = () => {
      setTimeout(() => setVisibleLines(4), 150);  // Blank line
      setTimeout(() => setVisibleLines(5), 250);  // > your-project@0.1.0 dev
      setTimeout(() => setVisibleLines(6), 350);  // > next dev
      setTimeout(() => setVisibleLines(7), 650);  // ▲ Next.js 14.2.3 (Turbopack)
      setTimeout(() => setVisibleLines(8), 850);  //   - Local:    http://localhost:3000
      setTimeout(() => setVisibleLines(9), 1000); //   - Network:  http://192.168.1.15:3000
      setTimeout(() => {
        setVisibleLines(10); // ✓ Ready in 628ms
        
        // Pause for 1.8s while ready, then fade out
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 600); // transition length
        }, 1800);
      }, 1250);
    };

    // Blinking terminal block cursor
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(cursorInterval);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] [background-size:24px_24px] transition-all duration-[600ms] ease-in-out ${
        isFadingOut ? 'opacity-0 scale-95 pointer-events-none translate-y-4' : 'opacity-100 scale-100'
      }`}
    >
      {/* Terminal Window container */}
      <div className="w-[90%] max-w-[620px] rounded-xl border border-[#d1d5db] bg-[#0d0d0d] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22)] overflow-hidden font-mono text-left select-none">
        
        {/* macOS Style Title Bar */}
        <div className="flex items-center justify-between bg-[#1e1e1e] border-b border-[#2d2d2d] px-4 py-3">
          {/* Traffic Lights buttons */}
          <div className="flex items-center gap-2 w-1/4">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dfa123]"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></span>
          </div>

          {/* Centered Shell path info */}
          <div className="text-[10px] md:text-xs text-[#a3a3a3] font-normal tracking-tight text-center w-2/4 truncate">
            MINGW64: /c/Users/anurag/portfolio
          </div>
          
          <div className="w-1/4"></div>
        </div>

        {/* Terminal Body */}
        <div className="p-5 text-xs md:text-sm space-y-1.5 min-h-[290px] leading-relaxed text-[#f4f4f5]">
          
          {/* Line 0: prompt header */}
          {visibleLines >= 1 && (
            <div>
              <span className="text-[#10b981] font-bold">anurag</span>
              <span className="text-white">@</span>
              <span className="text-[#c084fc] font-bold">ANURAG-PC</span>
              <span className="text-slate-400 font-bold ml-2">MINGW64</span>
            </div>
          )}

          {/* Line 1: prompt path */}
          {visibleLines >= 2 && (
            <div>
              <span className="text-[#f59e0b]">~/Desktop/EVERYTHING/projects/anurag-portfolio/portfolio</span>
              <span className="text-[#60a5fa] ml-1.5">(main)</span>
            </div>
          )}

          {/* Line 2: command input */}
          {visibleLines >= 3 && (
            <div>
              <span>{typedCommand}</span>
              {visibleLines === 3 && (
                <span className="font-bold text-[#f4f4f5] animate-pulse">
                  {showCursor ? '█' : ' '}
                </span>
              )}
            </div>
          )}

          {/* Line 3: Blank line spacer */}
          {visibleLines >= 4 && <div className="h-2"></div>}

          {/* Line 4: > your-project@0.1.0 dev */}
          {visibleLines >= 5 && (
            <div className="text-neutral-400">
              &gt; portfolio-frontend@1.0.0 dev
            </div>
          )}

          {/* Line 5: > next dev */}
          {visibleLines >= 6 && (
            <div className="text-neutral-400">
              &gt; next dev
            </div>
          )}

          {/* Line 6: Next.js logo and version info */}
          {visibleLines >= 7 && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[#c084fc] font-black">▲</span>
              <span className="font-bold text-white">Next.js 14.2.3</span>
              <span className="text-neutral-500">(Turbopack)</span>
            </div>
          )}

          {/* Line 7: Local address */}
          {visibleLines >= 8 && (
            <div className="text-[#60a5fa]">
              &nbsp;&nbsp;- Local:&nbsp;&nbsp;&nbsp;&nbsp;http://localhost:3000
            </div>
          )}

          {/* Line 8: Network address */}
          {visibleLines >= 9 && (
            <div className="text-[#60a5fa]">
              &nbsp;&nbsp;- Network:&nbsp;&nbsp;http://192.168.1.15:3000
            </div>
          )}

          {/* Line 9: ✓ Ready in ms with blinking cursor */}
          {visibleLines >= 10 && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[#10b981] font-bold">✓</span>
              <span className="font-bold text-white">Ready in 628ms</span>
              {visibleLines === 10 && (
                <span className="font-bold text-[#f4f4f5]">
                  {showCursor ? '█' : ' '}
                </span>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
