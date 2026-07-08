export default function Footer({ profile = {} }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line/30 bg-paper py-10">
      <div className="max-w-[850px] mx-auto px-6 md:px-16 flex flex-col gap-6 items-center">
        
        {/* Top: Social Links Badge Stack */}
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

        {/* Bottom: Designed & Developed Attribution with Golden Name */}
        <p className="font-mono text-xs md:text-sm font-extrabold tracking-widest text-ink text-center leading-normal uppercase">
          © {currentYear} // DESIGNED &amp; DEVELOPED BY <span className="bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] bg-clip-text text-transparent font-black drop-shadow-[0_1px_2px_rgba(252,246,186,0.08)] inline-block">ANURAG SINHA</span>
        </p>

      </div>
    </footer>
  );
}
