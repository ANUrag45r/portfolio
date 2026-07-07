export default function SectionHeading({ index, title, note }) {
  const cleanedIndex = index ? index.replace('§', '') : '';

  return (
    <div className="flex items-baseline justify-between border-b border-line pb-3 mb-8">
      <h2 className="font-display text-2xl md:text-3xl text-ink flex items-center">
        {/* Circular Golden Figure */}
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.6)] mr-2 shrink-0"></span>
        
        {cleanedIndex && (
          <span className="font-mono text-blue text-base mr-2">{cleanedIndex}</span>
        )}
        <span>{title}</span>
      </h2>
      {note && <span className="font-mono text-[11px] text-slate hidden md:block">{note}</span>}
    </div>
  );
}
