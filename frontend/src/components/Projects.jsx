import SectionHeading from './SectionHeading.jsx';

export default function Projects({ projects = [] }) {
  return (
    <section id="projects" className="max-w-content mx-auto px-6 md:px-10 py-16">
      <SectionHeading index="§03" title="Project Specs" note="STACK / RESULTS / SOURCE" />
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <article key={p.id} className="border border-line bg-panel/40 p-6 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl text-ink leading-snug">{p.title}</h3>
              <span className="font-mono text-[10px] text-slate whitespace-nowrap mt-1">{p.start_date}</span>
            </div>
            <p className="text-sm text-ink/80 mt-3 leading-relaxed">{p.summary}</p>

            <ul className="mt-4 space-y-1.5">
              {p.bullets?.map((b, idx) => (
                <li key={idx} className="text-xs text-slate leading-relaxed flex gap-2">
                  <span className="text-blue shrink-0">·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {p.metrics?.length > 0 && (
              <div className="flex gap-4 mt-5 pt-4 border-t border-line">
                {p.metrics.map((m, idx) => (
                  <div key={idx}>
                    <p className="font-mono text-lg text-amber leading-none">{m.value}</p>
                    <p className="font-mono text-[9px] text-slate mt-1 tracking-wide">{m.label.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-line flex items-center justify-between">
              <p className="font-mono text-[10px] text-slate">{p.tech_stack}</p>
              {p.github_url && (
                <a href={p.github_url} target="_blank" rel="noreferrer" className="font-mono text-xs text-blue hover:underline shrink-0 ml-3">
                  Source →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
