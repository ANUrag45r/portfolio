import { useState, useEffect } from 'react';

const LINKS = [
  { href: '#top', label: 'Home' },
  { href: '#profile', label: 'Profile' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#analytics', label: 'Analytics' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] md:w-auto select-none">
      <div className="flex items-center justify-between gap-5 rounded-full bg-paper/90 dark:bg-panel/95 backdrop-blur-md border border-line px-5 py-2.5 shadow-[0_12px_35px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.4)] transition-all duration-300">
        
        {/* Brand Logo */}
        <a href="#top" className="font-mono text-xs tracking-tight text-ink font-black pr-3 border-r border-line/60 flex items-center gap-1">
          A.SINHA<span className="text-blue">/</span>ENG
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-4 font-mono text-[10.5px] text-slate">
          {LINKS.map((l) => (
            <a 
              key={l.href} 
              href={l.href} 
              className="hover:text-blue transition-colors px-2 py-1 rounded-full hover:bg-panel/50 dark:hover:bg-paper/5"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-slate hover:text-ink hover:bg-panel/50 dark:hover:bg-paper/5 transition-all flex items-center justify-center"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41l1.06-1.06z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-8.9 8.2-9.8.6-.1 1.2.3 1.3.9.1.6-.2 1.2-.8 1.4-3.5 1.3-5.8 4.7-5.8 8.5 0 4.4 3.6 8 8 8 3.8 0 7.2-2.3 8.5-5.8.2-.6.8-.9 1.4-.8.6.1 1 .7.9 1.3-.9 4.7-5 8.2-9.8 8.3z" />
              </svg>
            )}
          </button>
          
          {/* Hire Button */}
          <a
            href="#contact"
            className="font-mono text-[9px] bg-ink text-paper px-4 py-2 rounded-full hover:bg-blue hover:text-white transition-all font-bold"
          >
            Hire →
          </a>
        </div>
      </div>
    </header>
  );
}
