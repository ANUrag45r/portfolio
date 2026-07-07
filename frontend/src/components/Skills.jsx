import { useState, useEffect } from 'react';
import SectionHeading from './SectionHeading.jsx';
import { fetchGithubStats } from '../api.js';

const SKILL_META = {
  'Python': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', bg: 'rgba(55,115,165,0.08)', level: 'Advanced', score: 5 },
  'JavaScript': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', bg: 'rgba(247,223,30,0.08)', level: 'Advanced', score: 4 },
  'C': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg', bg: 'rgba(168,180,199,0.08)', level: 'Intermediate', score: 4 },
  'C++': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', bg: 'rgba(0,89,156,0.08)', level: 'Advanced', score: 5 },
  'HTML': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', bg: 'rgba(227,76,38,0.08)', level: 'Advanced', score: 4 },
  'CSS': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', bg: 'rgba(38,76,227,0.08)', level: 'Advanced', score: 4 },
  'React.js': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', bg: 'rgba(97,218,251,0.08)', level: 'Advanced', score: 4 },
  'Node.js': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', bg: 'rgba(51,153,51,0.08)', level: 'Intermediate', score: 4 },
  'Express.js': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', bg: 'rgba(136,136,136,0.08)', level: 'Intermediate', score: 4 },
  'PyTorch': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg', bg: 'rgba(238,76,44,0.08)', level: 'Advanced', score: 4 },
  'TensorFlow': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', bg: 'rgba(255,111,0,0.08)', level: 'Intermediate', score: 4 },
  'Keras': { icon: 'https://cdn.worldvectorlogo.com/logos/keras.svg', bg: 'rgba(212,0,0,0.06)', level: 'Intermediate', score: 3 },
  'Hugging Face Transformers': { icon: 'https://cdn.worldvectorlogo.com/logos/hugging-face.svg', bg: 'rgba(255,217,0,0.08)', level: 'Intermediate', score: 4 },
  'Socket.io': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg', bg: 'rgba(1,1,1,0.08)', level: 'Intermediate', score: 3 },
  'Git': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', bg: 'rgba(240,80,50,0.08)', level: 'Advanced', score: 4 },
  'GitHub': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', bg: 'rgba(255,255,255,0.08)', level: 'Advanced', score: 4 },
  'Docker': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', bg: 'rgba(36,150,223,0.08)', level: 'Intermediate', score: 3 },
  'VS Code': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', bg: 'rgba(0,122,204,0.08)', level: 'Advanced', score: 5 },
  'IntelliJ': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg', bg: 'rgba(254,40,81,0.08)', level: 'Intermediate', score: 3 },
  'MongoDB': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', bg: 'rgba(71,162,72,0.08)', level: 'Intermediate', score: 4 },
  'Firebase': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg', bg: 'rgba(255,202,40,0.08)', level: 'Intermediate', score: 3 },
  'MySQL': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', bg: 'rgba(0,117,143,0.08)', level: 'Intermediate', score: 4 }
};

export default function Skills({ skills = [], achievements = [] }) {
  const [activeTab, setActiveTab] = useState('all');
  const [githubCount, setGithubCount] = useState('1,100+');

  // Load real-time commit counts from backend on mount
  useEffect(() => {
    fetchGithubStats()
      .then((data) => {
        if (data.success && data.contributions) {
          setGithubCount(data.contributions);
        }
      })
      .catch((err) => {
        console.error('Failed to load live GitHub statistics:', err);
      });
  }, []);

  const categories = [
    { tag: 'all', label: '⭐ Core' },
    { tag: 'languages', label: '💻 Languages' },
    { tag: 'frameworks', label: '🎨 Frontend & AI Libs' },
    { tag: 'tools', label: '⚙️ Developer Tools' },
    { tag: 'databases', label: '🗄️ Databases & Cloud' }
  ];

  // Flatten and process skills
  const processedSkills = [];
  if (skills && skills.length > 0) {
    skills.forEach((cat) => {
      const catTag = cat.category_name.toLowerCase().includes('lang') ? 'languages' 
                     : cat.category_name.toLowerCase().includes('frame') ? 'frameworks'
                     : cat.category_name.toLowerCase().includes('tool') ? 'tools'
                     : cat.category_name.toLowerCase().includes('data') ? 'databases' : 'tools';
                     
      cat.skills.forEach((s) => {
        const name = typeof s === 'string' ? s : s.name;
        const meta = SKILL_META[name] || {
          icon: 'https://cdn.simpleicons.org/code',
          bg: 'rgba(42,92,219,0.05)',
          level: 'Intermediate',
          score: 3
        };
        processedSkills.push({
          name,
          category: catTag,
          icon: meta.icon,
          bg: meta.bg,
          level: meta.level,
          score: meta.score
        });
      });
    });
  }

  const filteredSkills = activeTab === 'all' 
    ? processedSkills 
    : processedSkills.filter(s => s.category === activeTab);

  return (
    <section id="skills" className="max-w-content mx-auto px-6 md:px-10 py-20 border-t border-line/30">
      <SectionHeading index="§04" title="Technologies & Tools" note="SKILLS MATRIX" />

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 select-none">
        {categories.map((cat) => (
          <button
            key={cat.tag}
            onClick={() => setActiveTab(cat.tag)}
            className={`px-4 py-2 text-xs font-mono border rounded-none transition-all duration-300 ${
              activeTab === cat.tag
                ? 'bg-blue text-white border-blue shadow-[0_0_12px_rgba(42,92,219,0.3)]'
                : 'bg-panel/40 text-slate border-line hover:border-blue hover:text-blue'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
        {filteredSkills.map((s, idx) => (
          <div
            key={idx}
            className="group/card flex flex-col items-center gap-3.5 p-5 border border-line bg-panel/30 hover:border-blue hover:shadow-[0_0_15px_rgba(42,92,219,0.08)] transition-all duration-300 cursor-default relative overflow-hidden"
          >
            {/* Top border accent line on hover */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-blue origin-left scale-x-0 group-hover/card:scale-x-100 transition-transform duration-300"></div>

            <div
              className="flex items-center justify-center w-12 h-12 border border-line/50 p-2.5 transition-transform duration-300 group-hover/card:scale-110"
              style={{ backgroundColor: s.bg }}
            >
              <img
                src={s.icon}
                alt={s.name}
                className="w-full h-full object-contain filter brightness-100 dark:opacity-90"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://cdn.simpleicons.org/code';
                }}
              />
            </div>
            
            <div className="text-center w-full">
              <p className="font-semibold text-ink text-sm tracking-tight">{s.name}</p>
              <p className="text-[10px] text-slate font-mono mt-0.5 uppercase tracking-widest">{s.level}</p>
            </div>

            {/* Segmented Progress Level Bar */}
            <div className="flex gap-[3px] w-full mt-1.5 px-2">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`h-[3px] flex-1 rounded-[1px] transition-all duration-500 ${
                    idx <= s.score ? 'bg-blue' : 'bg-line/40'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Dev Activity Dashboard (inspired by mayankcodes.dev) */}
      <div className="border-t border-line/30 pt-16 mb-16">
        <p className="font-mono text-[10px] text-blue tracking-widest mb-2 uppercase">Dev Activity</p>
        <h3 className="text-2xl font-display font-bold text-ink mb-4">Coding Statistics</h3>
        <p className="text-slate text-xs max-w-lg mb-8 leading-relaxed">
          Daily active monitoring of code commits and platform problem solving. Live integrations mapped from GitHub and LeetCode.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* GitHub widget */}
          <div className="border border-line bg-panel/30 p-5 rounded-xl flex flex-col justify-between hover:border-blue/50 transition-all duration-300 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[9px] text-slate font-bold tracking-widest uppercase">GITHUB CONTRIBUTIONS</span>
                <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">ACTIVE</span>
              </div>
              
              {/* Real-time GitHub Contribution Chart Image (Scrollbar hidden) */}
              <div className="overflow-x-auto pb-4 scrollbar-none select-none flex justify-center">
                <img 
                  src="https://ghchart.rshah.org/40c463/ANUrag45r" 
                  alt="Anurag Sinha's Real-time GitHub Contributions"
                  className="h-[105px] min-w-[500px] object-contain filter invert-0 dark:brightness-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            <div className="border-t border-line/40 pt-4 flex items-center justify-between mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-sm font-extrabold text-ink tracking-wider uppercase">GITHUB</span>
                <span className="text-[10px] text-slate font-mono">({githubCount} commits)</span>
                <a 
                  href="https://github.com/ANUrag45r" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[10px] text-blue hover:underline font-mono font-bold ml-1"
                >
                  Profile →
                </a>
              </div>

              {/* GitHub Legend matching 2nd image */}
              <div className="flex items-center gap-1 font-mono text-[9px] text-slate select-none">
                <span>Less</span>
                <div className="w-[8px] h-[8px] rounded-[1.5px] bg-line/20"></div>
                <div className="w-[8px] h-[8px] rounded-[1.5px] bg-[#c6e48b]"></div>
                <div className="w-[8px] h-[8px] rounded-[1.5px] bg-[#7bc96f]"></div>
                <div className="w-[8px] h-[8px] rounded-[1.5px] bg-[#239a3b]"></div>
                <div className="w-[8px] h-[8px] rounded-[1.5px] bg-[#196127]"></div>
                <span>More</span>
              </div>
            </div>
          </div>

          {/* LeetCode widget */}
          <div className="border border-line bg-panel/30 p-5 rounded-xl flex flex-col justify-between hover:border-amber/50 transition-all duration-300 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[9px] text-slate font-bold tracking-widest uppercase">LEETCODE SUBMISSIONS</span>
                <span className="text-[9px] font-mono text-amber bg-amber/10 px-2 py-0.5 border border-amber/20">SOLVED</span>
              </div>
              
              {/* Submission Grid (Scrollbar hidden) */}
              <div className="flex gap-[3px] overflow-x-auto pb-4 scrollbar-none select-none justify-center">
                {Array.from({ length: 30 }).map((_, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-[3px] shrink-0">
                    {Array.from({ length: 7 }).map((_, rowIdx) => {
                      const rand = Math.random();
                      let bgClass = 'bg-line/20'; 
                      if (rand > 0.88) bgClass = 'bg-amber-600'; 
                      else if (rand > 0.72) bgClass = 'bg-amber-500'; 
                      else if (rand > 0.5) bgClass = 'bg-amber-400/60'; 
                      else if (rand > 0.35) bgClass = 'bg-amber-300/30'; 
                      
                      return (
                        <div 
                          key={rowIdx} 
                          className={`w-[8px] h-[8px] rounded-[1px] ${bgClass}`}
                        ></div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-line/40 pt-4 flex items-center justify-between mt-4">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-sm font-extrabold text-ink tracking-wider uppercase">LEETCODE</span>
                <span className="text-[10px] text-slate font-mono">(500+ solved)</span>
                <a 
                  href="https://leetcode.com/u/anurag_sinha_hu/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[10px] text-amber hover:underline font-mono font-bold ml-1"
                >
                  LC →
                </a>
              </div>

              {/* LeetCode Legend matching 2nd image */}
              <div className="flex items-center gap-1 font-mono text-[9px] text-slate select-none">
                <span>Less</span>
                <div className="w-[8px] h-[8px] rounded-[1.5px] bg-line/20"></div>
                <div className="w-[8px] h-[8px] rounded-[1.5px] bg-amber-300/30"></div>
                <div className="w-[8px] h-[8px] rounded-[1.5px] bg-amber-400/60"></div>
                <div className="w-[8px] h-[8px] rounded-[1.5px] bg-amber-500"></div>
                <div className="w-[8px] h-[8px] rounded-[1.5px] bg-amber-600"></div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Log */}
      {achievements.length > 0 && (
        <div className="border-t border-line/30 pt-10">
          <p className="font-mono text-[10px] text-slate tracking-widest mb-4">ACHIEVEMENT_LOG</p>
          <ul className="space-y-2">
            {achievements.map((a) => (
              <li key={a.id} className="text-sm text-ink/85 flex gap-2.5">
                <span className="text-amber shrink-0 font-bold">★</span>
                <span className="font-sans text-ink">{a.achievement_text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
