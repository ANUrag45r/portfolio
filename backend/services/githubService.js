import 'dotenv/config';

let activityCache = null;
let activityCacheTime = 0;

let reposCache = null;
let reposCacheTime = 0;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

function generateMockGithubData() {
  const days = [];
  const today = new Date();
  let totalCount = 0;
  
  for (let i = 365; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const rand = Math.random();
    let count = 0;
    if (rand > 0.85) count = Math.floor(Math.random() * 7) + 2; 
    else if (rand > 0.5) count = Math.floor(Math.random() * 3) + 1; 
    
    totalCount += count;
    days.push({ date: dateStr, count });
  }
  
  return { totalCount, days };
}

function generateMockGithubRepos() {
  return [
    {
      name: 'portfolio',
      description: 'Personal portfolio website showing experience, projects, skills matrix, and career path timeline.',
      html_url: 'https://github.com/ANUrag45r/portfolio',
      stargazers_count: 1,
      forks_count: 0,
      language: 'JavaScript'
    },
    {
      name: 'AI-Agent-Assistant',
      description: 'Generative AI and Agentic workflow automation tools built with LangChain and Python.',
      html_url: 'https://github.com/ANUrag45r',
      stargazers_count: 3,
      forks_count: 1,
      language: 'Python'
    },
    {
      name: 'DSA-Library-Cpp',
      description: 'Solutions and implementations of 500+ data structures and algorithms in C++.',
      html_url: 'https://github.com/ANUrag45r',
      stargazers_count: 2,
      forks_count: 0,
      language: 'C++'
    }
  ];
}

export async function getGithubActivity() {
  const now = Date.now();
  if (activityCache && (now - activityCacheTime < CACHE_DURATION)) {
    return activityCache;
  }

  const username = process.env.GITHUB_USERNAME || 'ANUrag45r';

  // 1. Try public token-free Deno Contributions API first (highly reliable & real-time)
  try {
    const response = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
    if (response.ok) {
      const data = await response.json();
      const days = [];
      
      if (data.contributions && data.contributions.length > 0) {
        data.contributions.forEach(week => {
          week.forEach(d => {
            days.push({
              date: d.date,
              count: d.contributionCount
            });
          });
        });

        activityCache = {
          totalCount: data.totalContributions || 0,
          days
        };
        activityCacheTime = now;
        return activityCache;
      }
    }
  } catch (err) {
    console.warn('Deno contributions API failed, trying fallback:', err.message);
  }

  // 2. Try GraphQL API (fallback if GITHUB_TOKEN is set)
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${token}`,
          'User-Agent': 'Portfolio-Scraper'
        },
        body: JSON.stringify({ query, variables: { username } })
      });

      if (response.ok) {
        const result = await response.json();
        const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;
        if (calendar) {
          const days = [];
          calendar.weeks.forEach(w => {
            w.contributionDays.forEach(d => {
              days.push({
                date: d.date,
                count: d.contributionCount
              });
            });
          });

          activityCache = {
            totalCount: calendar.totalContributions,
            days
          };
          activityCacheTime = now;
          return activityCache;
        }
      }
    } catch (err) {
      console.warn('GitHub GraphQL API failed:', err.message);
    }
  }

  // 3. Fallback to mock data
  console.warn('All real-time options failed. Using mock GitHub data.');
  activityCache = generateMockGithubData();
  activityCacheTime = now;
  return activityCache;
}

export async function getGithubRepositories() {
  const now = Date.now();
  if (reposCache && (now - reposCacheTime < CACHE_DURATION)) {
    return reposCache;
  }

  const username = process.env.GITHUB_USERNAME || 'ANUrag45r';

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
      headers: {
        'User-Agent': 'Portfolio-Scraper'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub repos HTTP error: ${response.status}`);
    }

    const repos = await response.json();
    
    // Extract key metrics from payload
    const normalizedRepos = repos.map(r => ({
      name: r.name,
      description: r.description || 'No description provided.',
      html_url: r.html_url,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      language: r.language || 'Other'
    }));

    reposCache = normalizedRepos;
    reposCacheTime = now;
    return reposCache;

  } catch (error) {
    console.error('GitHub Repos API Fetch failed:', error.message);
    reposCache = generateMockGithubRepos();
    reposCacheTime = now;
    return reposCache;
  }
}
