import { useState } from 'react';
import { addProject, deleteProject, addSkill, deleteSkill } from '../api.js';

export default function DevConsole({ profileData, projects, onRefresh }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState('project');
  const [statusMsg, setStatusMsg] = useState({ text: '', isError: false });

  // Project form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    summary: '',
    tech_stack: '',
    github_url: '',
    live_url: '',
    start_date: '',
    end_date: '',
    featured: false,
    bullets: [''],
    metrics: [{ label: '', value: '' }]
  });

  // Skill form states
  const [skillForm, setSkillForm] = useState({
    categoryType: 'existing', // 'existing' or 'new'
    existingCategory: '',
    newCategory: '',
    skillName: ''
  });

  // Load existing categories from profileData
  const categories = profileData?.skills || [];
  
  // Set default category if not set
  if (categories.length > 0 && !skillForm.existingCategory) {
    setSkillForm(prev => ({ ...prev, existingCategory: categories[0].category_name }));
  }

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'anurag') {
      setIsAuthenticated(true);
      setStatusMsg({ text: 'Access granted.', isError: false });
    } else {
      setStatusMsg({ text: 'Access denied. Invalid passphrase.', isError: true });
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: 'Saving project...', isError: false });
    try {
      // Filter empty bullets/metrics
      const cleanedBullets = projectForm.bullets.filter(b => b.trim());
      const cleanedMetrics = projectForm.metrics.filter(m => m.label.trim() && m.value.trim());

      await addProject({
        ...projectForm,
        bullets: cleanedBullets,
        metrics: cleanedMetrics
      });

      setStatusMsg({ text: 'Project saved successfully!', isError: false });
      // Reset form
      setProjectForm({
        title: '',
        summary: '',
        tech_stack: '',
        github_url: '',
        live_url: '',
        start_date: '',
        end_date: '',
        featured: false,
        bullets: [''],
        metrics: [{ label: '', value: '' }]
      });
      onRefresh();
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to save project', isError: true });
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: 'Saving skill...', isError: false });
    try {
      const categoryName = skillForm.categoryType === 'existing' 
        ? skillForm.existingCategory 
        : skillForm.newCategory;

      if (!categoryName || !skillForm.skillName) {
        throw new Error('Please fill in all required fields');
      }

      await addSkill({
        category_name: categoryName,
        skill_name: skillForm.skillName
      });

      setStatusMsg({ text: 'Skill saved successfully!', isError: false });
      setSkillForm(prev => ({ ...prev, skillName: '' }));
      onRefresh();
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to save skill', isError: true });
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setStatusMsg({ text: 'Deleting project...', isError: false });
    try {
      await deleteProject(id);
      setStatusMsg({ text: 'Project deleted successfully.', isError: false });
      onRefresh();
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to delete project', isError: true });
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    setStatusMsg({ text: 'Deleting skill...', isError: false });
    try {
      await deleteSkill(id);
      setStatusMsg({ text: 'Skill deleted successfully.', isError: false });
      onRefresh();
    } catch (err) {
      setStatusMsg({ text: err.message || 'Failed to delete skill', isError: true });
    }
  };

  return (
    <>
      {/* Floating Gear Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 p-2.5 bg-ink text-paper border border-line shadow-lg hover:bg-blue hover:text-paper hover:rotate-90 transition-all duration-300 flex items-center justify-center rounded-none"
        title="Developer Console"
        aria-label="Developer Console"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-lg bg-paper h-full shadow-2xl flex flex-col z-10 border-l border-line transition-all duration-300">
            {/* Header */}
            <div className="p-5 border-b border-line flex items-center justify-between bg-panel/30">
              <div>
                <span className="font-mono text-[9px] text-blue tracking-widest font-bold">SYSTEM_UTILITY // CONSOLE</span>
                <h3 className="font-display text-xl text-ink font-semibold mt-0.5">Developer Console</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 border border-line text-slate hover:text-ink hover:border-ink font-mono text-xs transition-colors"
              >
                Close ✕
              </button>
            </div>

            {/* Authenticated State vs Lock Screen */}
            {!isAuthenticated ? (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 bg-panel flex items-center justify-center border border-line text-slate mb-4">
                  🔒
                </div>
                <h4 className="font-display text-lg text-ink">Admin Passcode Required</h4>
                <p className="font-mono text-xs text-slate mt-1 max-w-xs leading-relaxed">
                  Enter the database edit passphrase to unlock this console.
                </p>
                <form onSubmit={handlePasscodeSubmit} className="mt-5 w-full max-w-xs flex gap-2">
                  <input
                    type="password"
                    placeholder="Enter passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="flex-grow px-3 py-1.5 border border-line font-mono text-sm bg-panel/20 text-ink focus:outline-none focus:border-blue"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-ink text-paper font-mono text-xs hover:bg-blue hover:text-paper transition-colors"
                  >
                    Unlock
                  </button>
                </form>
                {statusMsg.text && (
                  <p className={`mt-3 font-mono text-xs ${statusMsg.isError ? 'text-amber' : 'text-blue'}`}>
                    {statusMsg.text}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex-grow flex flex-col overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-line bg-panel/20 font-mono text-xs">
                  <button
                    onClick={() => { setActiveTab('project'); setStatusMsg({ text: '', isError: false }); }}
                    className={`flex-1 py-3 text-center border-r border-line transition-colors ${activeTab === 'project' ? 'bg-paper text-blue font-bold border-b-2 border-b-blue' : 'text-slate hover:text-ink'}`}
                  >
                    + Project
                  </button>
                  <button
                    onClick={() => { setActiveTab('skill'); setStatusMsg({ text: '', isError: false }); }}
                    className={`flex-1 py-3 text-center border-r border-line transition-colors ${activeTab === 'skill' ? 'bg-paper text-blue font-bold border-b-2 border-b-blue' : 'text-slate hover:text-ink'}`}
                  >
                    + Skill
                  </button>
                  <button
                    onClick={() => { setActiveTab('manage'); setStatusMsg({ text: '', isError: false }); }}
                    className={`flex-1 py-3 text-center transition-colors ${activeTab === 'manage' ? 'bg-paper text-blue font-bold border-b-2 border-b-blue' : 'text-slate hover:text-ink'}`}
                  >
                    Manage
                  </button>
                </div>

                {/* Form Panels */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                  {activeTab === 'project' && (
                    <form onSubmit={handleProjectSubmit} className="space-y-4 font-mono text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-slate font-bold">PROJECT TITLE *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Portfolio Website"
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            className="px-3 py-2 border border-line bg-panel/20 text-ink focus:outline-none focus:border-blue text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-slate font-bold">TECH STACK</label>
                          <input
                            type="text"
                            placeholder="e.g. React, Node, MySQL"
                            value={projectForm.tech_stack}
                            onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })}
                            className="px-3 py-2 border border-line bg-panel/20 text-ink focus:outline-none focus:border-blue text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-slate font-bold">SUMMARY / ONE-LINER</label>
                        <input
                          type="text"
                          placeholder="Brief summary of what the project does"
                          value={projectForm.summary}
                          onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                          className="px-3 py-2 border border-line bg-panel/20 text-ink focus:outline-none focus:border-blue text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-slate font-bold">GITHUB REPO URL</label>
                          <input
                            type="url"
                            placeholder="https://github.com/..."
                            value={projectForm.github_url}
                            onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                            className="px-3 py-2 border border-line bg-panel/20 text-ink focus:outline-none focus:border-blue text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-slate font-bold">LIVE DEPLOY URL</label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={projectForm.live_url}
                            onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                            className="px-3 py-2 border border-line bg-panel/20 text-ink focus:outline-none focus:border-blue text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-slate font-bold">START DATE</label>
                          <input
                            type="text"
                            placeholder="e.g. Jan 2026"
                            value={projectForm.start_date}
                            onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })}
                            className="px-3 py-2 border border-line bg-panel/20 text-ink focus:outline-none focus:border-blue text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-slate font-bold">END DATE</label>
                          <input
                            type="text"
                            placeholder="e.g. Present, Apr 2026"
                            value={projectForm.end_date}
                            onChange={(e) => setProjectForm({ ...projectForm, end_date: e.target.value })}
                            className="px-3 py-2 border border-line bg-panel/20 text-ink focus:outline-none focus:border-blue text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={projectForm.featured}
                          onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                          className="w-3.5 h-3.5 border border-line bg-panel/20 text-blue focus:ring-0 rounded-none cursor-pointer"
                        />
                        <label htmlFor="featured" className="text-slate font-bold cursor-pointer">FEATURED PROJECT</label>
                      </div>

                      {/* Bullets List */}
                      <div className="border border-line p-3.5 space-y-2 bg-panel/10">
                        <div className="flex items-center justify-between">
                          <span className="text-slate font-bold">PROJECT DETAILS / BULLETS</span>
                          <button
                            type="button"
                            onClick={() => setProjectForm({ ...projectForm, bullets: [...projectForm.bullets, ''] })}
                            className="text-blue hover:underline"
                          >
                            + Add Bullet
                          </button>
                        </div>
                        {projectForm.bullets.map((bullet, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder={`Bullet point ${idx + 1}`}
                              value={bullet}
                              onChange={(e) => {
                                const newBullets = [...projectForm.bullets];
                                newBullets[idx] = e.target.value;
                                setProjectForm({ ...projectForm, bullets: newBullets });
                              }}
                              className="flex-grow px-3 py-2 border border-line bg-panel/20 text-ink focus:outline-none text-xs"
                            />
                            {projectForm.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newBullets = projectForm.bullets.filter((_, i) => i !== idx);
                                  setProjectForm({ ...projectForm, bullets: newBullets });
                                }}
                                className="text-amber hover:underline px-1.5"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Metrics List */}
                      <div className="border border-line p-3.5 space-y-2 bg-panel/10">
                        <div className="flex items-center justify-between">
                          <span className="text-slate font-bold">KEY METRICS (E.G. ACCURACY / ACCORD)</span>
                          <button
                            type="button"
                            onClick={() => setProjectForm({ ...projectForm, metrics: [...projectForm.metrics, { label: '', value: '' }] })}
                            className="text-blue hover:underline"
                          >
                            + Add Metric
                          </button>
                        </div>
                        {projectForm.metrics.map((metric, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="Label (e.g. Accuracy)"
                              value={metric.label}
                              onChange={(e) => {
                                const newMetrics = [...projectForm.metrics];
                                newMetrics[idx].label = e.target.value;
                                setProjectForm({ ...projectForm, metrics: newMetrics });
                              }}
                              className="w-1/2 px-3 py-2 border border-line bg-panel/20 text-ink focus:outline-none text-xs"
                            />
                            <input
                              type="text"
                              placeholder="Value (e.g. 98%)"
                              value={metric.value}
                              onChange={(e) => {
                                const newMetrics = [...projectForm.metrics];
                                newMetrics[idx].value = e.target.value;
                                setProjectForm({ ...projectForm, metrics: newMetrics });
                              }}
                              className="w-1/2 px-3 py-2 border border-line bg-panel/20 text-ink focus:outline-none text-xs"
                            />
                            {projectForm.metrics.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newMetrics = projectForm.metrics.filter((_, i) => i !== idx);
                                  setProjectForm({ ...projectForm, metrics: newMetrics });
                                }}
                                className="text-amber hover:underline px-1.5"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-ink text-paper font-bold hover:bg-blue hover:text-paper transition-colors"
                      >
                        SAVE PROJECT SPECS
                      </button>
                    </form>
                  )}

                  {activeTab === 'skill' && (
                    <form onSubmit={handleSkillSubmit} className="space-y-4 font-mono text-xs">
                      <div className="flex flex-col gap-2">
                        <label className="text-slate font-bold">CATEGORY GROUP</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="categoryType"
                              value="existing"
                              checked={skillForm.categoryType === 'existing'}
                              onChange={() => setSkillForm({ ...skillForm, categoryType: 'existing' })}
                              className="w-3.5 h-3.5 text-blue cursor-pointer"
                            />
                            Choose Existing
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="categoryType"
                              value="new"
                              checked={skillForm.categoryType === 'new'}
                              onChange={() => setSkillForm({ ...skillForm, categoryType: 'new' })}
                              className="w-3.5 h-3.5 text-blue cursor-pointer"
                            />
                            Create New Category
                          </label>
                        </div>
                      </div>

                      {skillForm.categoryType === 'existing' ? (
                        <div className="flex flex-col gap-1">
                          <label className="text-slate font-bold">SELECT CATEGORY *</label>
                          {categories.length > 0 ? (
                            <select
                              value={skillForm.existingCategory}
                              onChange={(e) => setSkillForm({ ...skillForm, existingCategory: e.target.value })}
                              className="px-3 py-2 border border-line bg-paper text-ink focus:outline-none focus:border-blue text-xs rounded-none"
                            >
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.category_name}>
                                  {cat.category_name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-amber">No existing categories found. Please create a new one.</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <label className="text-slate font-bold">NEW CATEGORY NAME *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Machine Learning, Cloud Services"
                            value={skillForm.newCategory}
                            onChange={(e) => setSkillForm({ ...skillForm, newCategory: e.target.value })}
                            className="px-3 py-2 border border-line bg-panel/20 text-ink focus:outline-none focus:border-blue text-xs"
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <label className="text-slate font-bold">SKILL NAME *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. PyTorch, Next.js, Jenkins"
                          value={skillForm.skillName}
                          onChange={(e) => setSkillForm({ ...skillForm, skillName: e.target.value })}
                          className="px-3 py-2 border border-line bg-panel/20 text-ink focus:outline-none focus:border-blue text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-ink text-paper font-bold hover:bg-blue hover:text-paper transition-colors"
                      >
                        SAVE SKILL MATRIX ENTRY
                      </button>
                    </form>
                  )}

                  {activeTab === 'manage' && (
                    <div className="space-y-6 font-mono text-xs">
                      {/* Manage Projects */}
                      <div className="space-y-2">
                        <h4 className="text-slate font-bold border-b border-line pb-1">MANAGE PROJECTS</h4>
                        {projects.length > 0 ? (
                          <div className="space-y-2 max-h-56 overflow-y-auto">
                            {projects.map((p) => (
                              <div key={p.id} className="flex justify-between items-center p-2.5 border border-line bg-panel/30">
                                <div>
                                  <p className="font-bold text-ink">{p.title}</p>
                                  <p className="text-[10px] text-slate">{p.tech_stack}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteProject(p.id)}
                                  className="text-amber hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate">No projects in database.</p>
                        )}
                      </div>

                      {/* Manage Skills */}
                      <div className="space-y-2">
                        <h4 className="text-slate font-bold border-b border-line pb-1">MANAGE SKILLS</h4>
                        {categories.length > 0 ? (
                          <div className="space-y-4 max-h-72 overflow-y-auto">
                            {categories.map((cat) => (
                              <div key={cat.id} className="border border-line p-3 bg-panel/10">
                                <p className="font-bold text-blue text-[10px] mb-2">{cat.category_name.toUpperCase()}</p>
                                <div className="flex flex-wrap gap-2">
                                  {cat.skills.map((s, idx) => {
                                    const id = typeof s === 'string' ? null : s.id;
                                    const name = typeof s === 'string' ? s : s.name;
                                    return (
                                      <div key={idx} className="flex items-center gap-1 font-mono text-xs border border-line px-2 py-0.5 text-ink/80 bg-paper">
                                        <span>{name}</span>
                                        {id && (
                                          <button
                                            onClick={() => handleDeleteSkill(id)}
                                            className="text-amber hover:text-ink font-bold ml-1"
                                            title="Delete skill"
                                          >
                                            ×
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate">No skills in database.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Message Area */}
                {statusMsg.text && (
                  <div className={`p-4 border-t border-line font-mono text-xs flex items-center justify-between ${statusMsg.isError ? 'bg-amber/10 text-amber border-t-amber' : 'bg-blue/10 text-blue border-t-blue'}`}>
                    <span>{statusMsg.text}</span>
                    <button 
                      onClick={() => setStatusMsg({ text: '', isError: false })}
                      className="hover:underline font-bold"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
