import 'dotenv/config';

let cache = null;
let cacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

// Helper to generate simulated data if GitHub is offline or not configured
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
    if (rand > 0.85) count = Math.floor(Math.random() * 7) + 2; // high contributions
    else if (rand > 0.5) count = Math.floor(Math.random() * 3) + 1; // low contributions
    
    totalCount += count;
    days.push({ date: dateStr, count });
  }
  
  return { totalCount, days };
}

export async function getGithubActivity() {
  const now = Date.now();
  if (cache && (now - cacheTime < CACHE_DURATION)) {
    return cache;
  }

  const username = process.env.GITHUB_USERNAME || 'ANUrag45r';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn('GITHUB_TOKEN not configured in .env. Falling back to mock data.');
    cache = generateMockGithubData();
    cacheTime = now;
    return cache;
  }

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
        'User-Agent': 'Antigravity-Portfolio-Backend'
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL HTTP error: ${response.status}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      throw new Error('Could not parse contribution calendar from GitHub response');
    }

    const days = [];
    calendar.weeks.forEach(w => {
      w.contributionDays.forEach(d => {
        days.push({
          date: d.date,
          count: d.contributionCount
        });
      });
    });

    cache = {
      totalCount: calendar.totalContributions,
      days
    };
    cacheTime = now;
    return cache;

  } catch (error) {
    console.error('GitHub API Fetch failed:', error.message);
    // Return mock data in case of error so user interface is never broken
    console.warn('Using mock GitHub data as fallback.');
    cache = generateMockGithubData();
    cacheTime = now;
    return cache;
  }
}
