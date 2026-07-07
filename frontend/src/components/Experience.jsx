import SectionHeading from './SectionHeading.jsx';

export default function Experience({ experience = [] }) {
  return (
    <section id="experience" className="max-w-content mx-auto px-6 md:px-10 py-16">
      <SectionHeading index="§02" title="Experience Log" note="ROLE / ORG / IMPACT" />
      <div className="space-y-10">
        {experience.map((e, i) => (
          <div key={e.id} className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8 border-l-2 border-line pl-6 relative">
            <span className="absolute -left-[7px] top-1 w-3 h-3 bg-blue rounded-full" />
            <div>
              <p className="font-mono text-xs text-slate">{e.start_date} → {e.end_date}</p>
              <h3 className="font-display text-xl text-ink mt-1">{e.role}</h3>
              <p className="text-sm text-blue">{e.organization}</p>
            </div>
            <ul className="space-y-2">
              {e.bullets.map((b, idx) => (
                <li key={idx} className="text-sm text-ink/85 leading-relaxed flex gap-2">
                  <span className="font-mono text-amber shrink-0">→</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
