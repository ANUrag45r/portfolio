import SectionHeading from './SectionHeading.jsx';

export default function Education({ education = [] }) {
  return (
    <section id="profile" className="max-w-content mx-auto px-6 md:px-10 py-16">
      <SectionHeading index="§01" title="Education Log" note="INSTITUTION / SCORE / TIMELINE" />
      <div className="grid md:grid-cols-3 gap-px bg-line border border-line">
        {education.map((e) => (
          <div key={e.id} className="bg-paper p-5">
            <p className="font-mono text-[10px] text-blue mb-2">{e.start_date} — {e.end_date}</p>
            <h3 className="font-display text-lg text-ink leading-snug">{e.institution}</h3>
            <p className="text-sm text-slate mt-1">{e.degree}</p>
            <p className="font-mono text-xs text-amber mt-3">{e.score}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
