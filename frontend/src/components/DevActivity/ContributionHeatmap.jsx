import { useState, useRef } from 'react';
import styles from './DevActivity.module.css';

export default function ContributionHeatmap({ data, colorScale, title, totalLabel, profileUrl, isLeetcode = false }) {
  const { totalCount, days = [] } = data || { totalCount: 0, days: [] };
  const containerRef = useRef(null);
  
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: '',
    x: 0,
    y: 0
  });

  // Calculate active days and max streak for LeetCode
  const activeDays = days.filter(d => d.count > 0).length;
  let maxStreak = 0;
  let currentStreak = 0;
  days.forEach(d => {
    if (d.count > 0) {
      currentStreak += 1;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
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
    if (count === 0) return colorScale[0]; // Light gray or custom LeetCode empty color
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

  // Grid coordinates math
  const boxSize = 11.5;
  const gap = 3.2;
  const leftPadding = 35;
  const topPadding = isLeetcode ? 10 : 25;

  // Collect month labels based on the first day of each week
  const monthLabels = [];
  let prevMonth = -1;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  weeks.forEach((week, weekIdx) => {
    if (week.length > 0) {
      const date = new Date(week[0].date);
      const month = date.getMonth();
      if (month !== prevMonth) {
        // Enforce a minimum gap of 4 columns between month labels to prevent squashing/overlapping
        const lastLabel = monthLabels[monthLabels.length - 1];
        if (!lastLabel || (weekIdx - lastLabel.colIdx >= 4)) {
          monthLabels.push({
            name: monthNames[month],
            colIdx: weekIdx
          });
          prevMonth = month;
        }
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

  return (
    <div 
      className={`${styles.card} ${isLeetcode ? 'dark:!bg-[#1a1a1a] dark:!border-none dark:!shadow-none' : ''}`} 
      ref={containerRef}
    >
      {/* Header */}
      {isLeetcode ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-slate dark:text-[#cccccc] font-sans text-xs select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-ink dark:text-white">{totalCount}</span>
            <span className="text-slate/70 dark:text-[#8c8c8c]">submissions in the past one year</span>
            <svg className="w-3.5 h-3.5 text-slate/50 dark:text-[#8c8c8c] cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-5 text-slate/70 dark:text-[#8c8c8c]">
            <div>
              <span>Total active days:</span> <span className="text-ink dark:text-white font-bold ml-1">{activeDays}</span>
            </div>
            <div>
              <span>Max streak:</span> <span className="text-ink dark:text-white font-bold ml-1">{maxStreak}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-panel dark:bg-[#2c2c2c] hover:bg-panel/85 dark:hover:bg-[#363636] text-ink dark:text-white px-3 py-1 rounded-lg border border-line dark:border-[#3c3c3c] cursor-pointer text-[11px] transition-colors">
              <span>Current</span>
              <svg className="w-3 h-3 text-slate/50 dark:text-[#8c8c8c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <span className={`${styles.status} ${title.toLowerCase().includes('github') ? styles.statusActive : styles.statusSolved}`}>
            {title.toLowerCase().includes('github') ? 'ACTIVE' : 'SOLVED'}
          </span>
        </div>
      )}

      {/* SVG Scroll Container */}
      <div className={styles.scrollContainer}>
        <svg 
          width={leftPadding + 53 * (boxSize + gap) + 10} 
          height={topPadding + 7 * (boxSize + gap) + (isLeetcode ? 26 : 4)} 
          className={styles.heatmapSvg}
        >
          {/* Month labels */}
          {monthLabels.map((lbl, idx) => (
            <text
              key={idx}
              x={leftPadding + lbl.colIdx * (boxSize + gap)}
              y={isLeetcode ? topPadding + 7 * (boxSize + gap) + 18 : 15}
              className={`${styles.monthLabel} ${isLeetcode ? '!fill-slate/60 dark:!fill-[#8c8c8c]' : ''}`}
            >
              {lbl.name}
            </text>
          ))}

          {/* Weekday labels */}
          <text x={6} y={topPadding + 1.2 * (boxSize + gap)} className={`${styles.dayLabel} ${isLeetcode ? '!fill-slate/60 dark:!fill-[#8c8c8c]' : ''}`}>Mon</text>
          <text x={6} y={topPadding + 3.2 * (boxSize + gap)} className={`${styles.dayLabel} ${isLeetcode ? '!fill-slate/60 dark:!fill-[#8c8c8c]' : ''}`}>Wed</text>
          <text x={6} y={topPadding + 5.2 * (boxSize + gap)} className={`${styles.dayLabel} ${isLeetcode ? '!fill-slate/60 dark:!fill-[#8c8c8c]' : ''}`}>Fri</text>

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
                  rx={2}
                  ry={2}
                  className={`${styles.dayRect} ${isLeetcode ? 'dark:!stroke-none' : ''}`}
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
          <span className={`${styles.footerLabel} ${isLeetcode ? 'text-ink dark:!text-white' : ''}`}>
            {totalCount.toLocaleString()}
          </span>
          <span className={`${styles.footerSub} ${isLeetcode ? 'text-slate dark:!text-[#8c8c8c]' : ''}`}>
            {totalLabel}
          </span>
          {profileUrl && (
            <a 
              href={profileUrl} 
              target="_blank" 
              rel="noreferrer" 
              className={`${styles.profileLink} ${
                isLeetcode 
                  ? 'text-amber hover:text-amber/80' 
                  : (title.toLowerCase().includes('github') ? 'text-blue hover:text-blue/80' : 'text-amber hover:text-amber/80')
              }`}
            >
              Profile →
            </a>
          )}
        </div>

        {/* Heatmap Legend */}
        <div className={`${styles.legend} ${isLeetcode ? 'text-slate dark:!text-[#8c8c8c]' : ''}`}>
          <span>Less</span>
          {colorScale.map((c, i) => (
            <div 
              key={i} 
              className={styles.legendSquare} 
              style={{ backgroundColor: c, border: i === 0 && (!isLeetcode || c === '#d2d8d3') ? '1px solid var(--color-line)' : 'none' }}
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
