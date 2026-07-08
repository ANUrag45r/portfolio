import { useState, useEffect } from 'react';
import ContributionHeatmap from './ContributionHeatmap.jsx';
import styles from './DevActivity.module.css';

// API BASE path (fallback to localhost:5000/api if VITE_API_URL is missing)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const languageColors = {
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'C++': '#f34b7d',
  'C': '#555555',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Shell': '#89e051',
  'Java': '#b07219',
  'Rust': '#dea584',
  'Other': '#8b949e'
};

export default function DevActivity() {
  const [githubData, setGithubData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(true);
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

  // Fetch heatmaps
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

  // Fetch repositories
  useEffect(() => {
    let active = true;
    setReposLoading(true);
    
    fetch(`${API_BASE}/github-repositories`)
      .then(res => {
        if (!res.ok) throw new Error('GitHub repos response issue');
        return res.json();
      })
      .then(data => {
        if (active) {
          setRepos(data);
          setReposLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load GitHub repos:', err);
        if (active) {
          setReposLoading(false);
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

  const leetcodeColors = ['#2d2d2d', '#0e4429', '#006d32', '#26a641', '#39d353'];

  if (loading) {
    return (
      <div className={styles.container}>
        {/* Render Heatmap Loading Skeletons */}
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
          isLeetcode={true}
        />
      )}

      {/* Repositories section */}
      <div className={styles.reposHeaderSection}>
        <span className={styles.reposSub}>Source Repositories</span>
        <h4 className={styles.reposTitle}>Featured Repositories</h4>
      </div>

      <div className={styles.repoGrid}>
        {reposLoading ? (
          // Render Repository Card Skeletons
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className={styles.skeletonRepoCard} aria-hidden="true">
              <div>
                <div className={styles.skeletonRepoTitle}></div>
                <div className={styles.skeletonRepoDesc}></div>
              </div>
              <div className={styles.skeletonRepoFooter}>
                <div className={styles.skeletonRepoLang}></div>
                <div className={styles.skeletonRepoStats}></div>
              </div>
            </div>
          ))
        ) : (
          repos.map((r, idx) => (
            <div key={idx} className={styles.repoCard}>
              <div>
                <div className={styles.repoCardHeader}>
                  {/* GitHub Book/Repo Icon */}
                  <svg className={styles.repoIcon} viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                    <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 01-.4.2l-1.45-1.087a.25.25 0 00-.3 0L1.4 15.7a.25.25 0 01-.4-.2v-3.25a.25.25 0 01.25-.25h3.5a.25.25 0 01.25.25z"></path>
                  </svg>
                  <a 
                    href={r.html_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={styles.repoName}
                  >
                    {r.name}
                  </a>
                </div>
                <p className={styles.repoDescription}>{r.description}</p>
              </div>

              <div className={styles.repoFooter}>
                {/* Language indicator */}
                <div className={styles.repoLanguage}>
                  <div 
                    className={styles.languageDot} 
                    style={{ backgroundColor: languageColors[r.language] || languageColors['Other'] }}
                  />
                  <span>{r.language}</span>
                </div>

                {/* Stars and Forks */}
                <div className={styles.repoStats}>
                  <div className={styles.statItem}>
                    {/* Star Icon */}
                    <svg className={styles.statIcon} viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
                    </svg>
                    <span>{r.stargazers_count}</span>
                  </div>

                  <div className={styles.statItem}>
                    {/* Fork Icon */}
                    <svg className={styles.statIcon} viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v5.006a2.25 2.25 0 101.5 0v-5.006zM11 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v2.872a2.25 2.25 0 101.5 0V5.372zM4 12a.75.75 0 100-1.5.75.75 0 000 1.5zm6-4.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm1 4.5a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                    </svg>
                    <span>{r.forks_count}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
