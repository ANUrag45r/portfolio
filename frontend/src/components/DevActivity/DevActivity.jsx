import { useState, useEffect } from 'react';
import ContributionHeatmap from './ContributionHeatmap.jsx';
import styles from './DevActivity.module.css';

// API BASE path (fallback to localhost:5000/api if VITE_API_URL is missing)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function DevActivity() {
  const [githubData, setGithubData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Monitor document class list to dynamically shift heatmap color schemes
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    Promise.all([
      fetch(`${API_BASE}/github-activity`).then(res => {
        if (!res.ok) throw new Error('GitHub API response issue');
        return res.json();
      }),
      fetch(`${API_BASE}/leetcode-activity`).then(res => {
        if (!res.ok) throw new Error('LeetCode API response issue');
        return res.json();
      })
    ])
      .then(([gh, lc]) => {
        if (active) {
          setGithubData(gh);
          setLeetcodeData(lc);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load real-time dev activity:', err);
        if (active) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Standard and Dark-optimized color scales matching both sites natively
  const githubColors = isDark
    ? ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'] // GitHub dark green
    : ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']; // GitHub light green

  const leetcodeColors = isDark
    ? ['#161b22', '#3a2412', '#703c1b', '#b85c24', '#f97316'] // LeetCode dark orange
    : ['#ebedf0', '#ffdca8', '#ffa657', '#e8590c', '#bf4b02']; // LeetCode light orange

  if (loading) {
    return (
      <div className={styles.container}>
        {/* Render Shimmer Loading Skeletons */}
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className={styles.skeletonCard} aria-hidden="true">
            <div className={styles.skeletonHeader}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonStatus}></div>
            </div>
            <div className={styles.skeletonGrid}></div>
            <div className={styles.skeletonFooter}>
              <div className={styles.skeletonFooterLeft}></div>
              <div className={styles.skeletonFooterRight}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorCard}>
        <p className="font-bold mb-1">⚠️ Dev Activity Connection Interrupted</p>
        <p className="text-[10px] text-red-500/80">Could not retrieve live activities from API. Start your backend or check CORS setup.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {githubData && (
        <ContributionHeatmap
          data={githubData}
          colorScale={githubColors}
          title="GitHub Contributions"
          totalLabel="commits in the last year"
          profileUrl="https://github.com/ANUrag45r"
        />
      )}

      {leetcodeData && (
        <ContributionHeatmap
          data={leetcodeData}
          colorScale={leetcodeColors}
          title="LeetCode Submissions"
          totalLabel="problems solved"
          profileUrl="https://leetcode.com/u/anurag_sinha_hu/"
        />
      )}
    </div>
  );
}
