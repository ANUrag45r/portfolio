export default function Footer({ profile = {} }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line/30 bg-[#0a0e17] py-12">
      <div className="max-w-[850px] mx-auto px-6 md:px-16 flex flex-col gap-10 items-center">
        
        {/* Top Row: Attribution & Socials */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-mono text-xs md:text-sm font-extrabold tracking-widest text-ink text-center md:text-left leading-normal uppercase">
            © {currentYear} // DESIGNED &amp; DEVELOPED BY ANURAG SINHA
          </p>

          {/* Social Links Badge Stack */}
          <div className="flex flex-wrap justify-center gap-3 font-mono text-[10px]">
            {profile.github_url && (
              <a 
                href={profile.github_url} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 border border-line bg-panel/30 px-3 py-1.5 text-ink hover:text-white hover:bg-[#24292F] hover:border-[#24292F] hover:shadow-[0_0_12px_rgba(36,41,47,0.25)] transition-all duration-300 rounded-lg"
              >
                GitHub
              </a>
            )}
            {profile.linkedin_url && (
              <a 
                href={profile.linkedin_url} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 border border-line bg-panel/30 px-3 py-1.5 text-ink hover:text-white hover:bg-[#0077B5] hover:border-[#0077B5] hover:shadow-[0_0_12px_rgba(0,119,181,0.25)] transition-all duration-300 rounded-lg"
              >
                LinkedIn
              </a>
            )}
            {profile.leetcode_url && (
              <a 
                href={profile.leetcode_url} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 border border-line bg-panel/30 px-3 py-1.5 text-ink hover:text-white hover:bg-[#FFA116] hover:border-[#FFA116] hover:shadow-[0_0_12px_rgba(255,161,22,0.25)] transition-all duration-300 rounded-lg"
              >
                LeetCode
              </a>
            )}
          </div>
        </div>

        {/* Separator Divider Line with a golden fade */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent"></div>

        {/* Bottom Row: JAI SHIV SAMBHU in golden Devanagari script */}
        <div className="flex flex-col items-center">
          <p className="font-serif text-xl md:text-3xl font-extrabold tracking-[0.25em] bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(252,246,186,0.18)] select-none text-center leading-none">
            जय शिव शंभू
          </p>
        </div>

      </div>
    </footer>
  );
}
