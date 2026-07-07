import { useState, useRef } from 'react';
import styles from './DevActivity.module.css';

export default function ContributionHeatmap({ data, colorScale, title, totalLabel, profileUrl }) {
  const { totalCount, days = [] } = data || { totalCount: 0, days: [] };
  const containerRef = useRef(null);
  
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: '',
    x: 0,
    y: 0
  });

  // Calculate dynamic quantile buckets based on data (min/max of non-zero counts)
  const activeCounts = days
    .map(d => d.count)
    .filter(c => c > 0)
    .sort((a, b) => a - b);

  let q1 = 1, q2 = 2, q3 = 3;
  if (activeCounts.length > 0) {
    const len = activeCounts.length;
    q1 = activeCounts[Math.floor(len * 0.25)] || 1;
    q2 = activeCounts[Math.floor(len * 0.50)] || 2;
    q3 = activeCounts[Math.floor(len * 0.75)] || 3;
  }

  // Map count to quantile color level (0 to 4)
  const getColor = (count) => {
    if (count === 0) return colorScale[0]; // Light gray
    if (count <= q1) return colorScale[1]; // Low
    if (count <= q2) return colorScale[2]; // Medium
    if (count <= q3) return colorScale[3]; // High
    return colorScale[4];                 // Max
  };

  // Group days into columns by week (7 days per week)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Collect month labels based on the first day of each week
  const monthLabels = [];
  let prevMonth = -1;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  weeks.forEach((week, weekIdx) => {
    if (week.length > 0) {
      const date = new Date(week[0].date);
      const month = date.getMonth();
      // Only render month if it changed and isn't squashed against the previous label
      if (month !== prevMonth) {
        monthLabels.push({
          name: monthNames[month],
          colIdx: weekIdx
        });
        prevMonth = month;
      }
    }
  });

  const formatDate = (dateStr) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const handleMouseMove = (e, day) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Position tooltip horizontally centered above the cell
    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top;
    
    const activityText = day.count === 1 ? 'activity' : 'activities';
    
    setTooltip({
      visible: true,
      text: `${day.count === 0 ? 'No' : day.count} ${activityText} on ${formatDate(day.date)}`,
      x,
      y
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  // Grid coordinates math
  const boxSize = 9;
  const gap = 2.5;
  const leftPadding = 30;
  const topPadding = 20;

  return (
    <div className={styles.card} ref={containerRef}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={`${styles.status} ${title.toLowerCase().includes('github') ? styles.statusActive : styles.statusSolved}`}>
          {title.toLowerCase().includes('github') ? 'ACTIVE' : 'SOLVED'}
        </span>
      </div>

      {/* SVG Scroll Container */}
      <div className={styles.scrollContainer}>
        <svg 
          width={leftPadding + 53 * (boxSize + gap)} 
          height={topPadding + 7 * (boxSize + gap) + 4} 
          className={styles.heatmapSvg}
        >
          {/* Month labels */}
          {monthLabels.map((lbl, idx) => (
            <text
              key={idx}
              x={leftPadding + lbl.colIdx * (boxSize + gap)}
              y={12}
              className={styles.monthLabel}
            >
              {lbl.name}
            </text>
          ))}

          {/* Weekday labels */}
          <text x={5} y={topPadding + 1.5 * (boxSize + gap)} className={styles.dayLabel}>Mon</text>
          <text x={5} y={topPadding + 3.5 * (boxSize + gap)} className={styles.dayLabel}>Wed</text>
          <text x={5} y={topPadding + 5.5 * (boxSize + gap)} className={styles.dayLabel}>Fri</text>

          {/* Grid columns */}
          {weeks.map((week, colIdx) => (
            <g key={colIdx} transform={`translate(${leftPadding + colIdx * (boxSize + gap)}, ${topPadding})`}>
              {week.map((day, rowIdx) => (
                <rect
                  key={rowIdx}
                  y={rowIdx * (boxSize + gap)}
                  width={boxSize}
                  height={boxSize}
                  fill={getColor(day.count)}
                  className={styles.dayRect}
                  onMouseMove={(e) => handleMouseMove(e, day)}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
            </g>
          ))}
        </svg>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.footerLabel}>
            {totalCount.toLocaleString()}
          </span>
          <span className={styles.footerSub}>
            {totalLabel}
          </span>
          {profileUrl && (
            <a 
              href={profileUrl} 
              target="_blank" 
              rel="noreferrer" 
              className={`${styles.profileLink} ${title.toLowerCase().includes('github') ? 'text-blue hover:text-blue/80' : 'text-amber hover:text-amber/80'}`}
            >
              Profile →
            </a>
          )}
        </div>

        {/* Heatmap Legend */}
        <div className={styles.legend}>
          <span>Less</span>
          {colorScale.map((c, i) => (
            <div 
              key={i} 
              className={styles.legendSquare} 
              style={{ backgroundColor: c, border: i === 0 ? '1px solid var(--color-line)' : 'none' }}
            ></div>
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Floating Tooltip */}
      {tooltip.visible && (
        <div 
          className={styles.tooltip}
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
          <div className={styles.tooltipArrow} />
        </div>
      )}
    </div>
  );
}
