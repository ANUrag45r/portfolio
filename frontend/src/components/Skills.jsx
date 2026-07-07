import { useState } from 'react';
import SectionHeading from './SectionHeading.jsx';
import DevActivity from './DevActivity/DevActivity.jsx';

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
  'Socket.io': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg', bg: 'rgba(1,1,1,0.08)', level: 'Intermediate', score: 3 },
  'Git': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', bg: 'rgba(240,80,50,0.08)', level: 'Advanced', score: 4 },
  'GitHub': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', bg: 'rgba(255,255,255,0.08)', level: 'Advanced', score: 4 },
  'Docker': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', bg: 'rgba(36,150,223,0.08)', level: 'Intermediate', score: 3 },
  'VS Code': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', bg: 'rgba(0,122,204,0.08)', level: 'Advanced', score: 5 },
  'MongoDB': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', bg: 'rgba(71,162,72,0.08)', level: 'Intermediate', score: 4 },
  'Firebase': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg', bg: 'rgba(255,202,40,0.08)', level: 'Intermediate', score: 3 },
  'MySQL': { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', bg: 'rgba(0,117,143,0.08)', level: 'Intermediate', score: 4 }
};

export default function Skills({ skills = [], achievements = [] }) {
  const [activeTab, setActiveTab] = useState('all');

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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
        {filteredSkills.map((s, idx) => (
          <div
            key={idx}
            className="group/card flex flex-col items-center gap-3.5 p-5 border border-line bg-panel rounded-xl hover:border-blue hover:shadow-[0_8px_25px_rgba(59,130,246,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-default relative overflow-hidden shadow-sm"
          >
            {/* Top border accent line on hover */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-blue origin-left scale-x-0 group-hover/card:scale-x-100 transition-transform duration-300"></div>

            <div
              className="flex items-center justify-center w-12 h-12 border border-line/50 p-2.5 rounded-lg transition-transform duration-300 group-hover/card:scale-110 bg-[#0a0e17]/10"
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

        <DevActivity />
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
