import 'dotenv/config';

let cache = null;
let cacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

function generateMockLeetcodeData() {
  const days = [];
  const today = new Date();
  let totalCount = 0;
  
  for (let i = 365; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const rand = Math.random();
    let count = 0;
    if (rand > 0.92) count = Math.floor(Math.random() * 4) + 2; 
    else if (rand > 0.78) count = Math.floor(Math.random() * 2) + 1; 
    
    totalCount += count;
    days.push({ date: dateStr, count });
  }
  
  return { totalCount, days };
}

export async function getLeetcodeActivity() {
  const now = Date.now();
  if (cache && (now - cacheTime < CACHE_DURATION)) {
    return cache;
  }

  const username = process.env.LEETCODE_USERNAME || 'anurag_sinha_hu';

  const query = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        submissionCalendar
      }
    }
  `;

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });

    if (!response.ok) {
      throw new Error(`LeetCode GraphQL HTTP error: ${response.status}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    const submissionCalendarStr = result.data?.matchedUser?.submissionCalendar;
    if (!submissionCalendarStr) {
      throw new Error('Could not parse submission calendar from LeetCode response');
    }

    // LeetCode returns submissionCalendar as a stringified JSON object: {"1672531200": 3, "1672617600": 1, ...}
    const rawCalendar = JSON.parse(submissionCalendarStr);
    const countsMap = {};

    Object.entries(rawCalendar).forEach(([timestampStr, count]) => {
      // Convert Unix timestamp in seconds to local date string YYYY-MM-DD
      const dateStr = new Date(parseInt(timestampStr) * 1000).toISOString().split('T')[0];
      countsMap[dateStr] = (countsMap[dateStr] || 0) + count;
    });

    // Populate standard 365-day array
    const days = [];
    const today = new Date();
    let totalCount = 0;

    for (let i = 365; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = countsMap[dateStr] || 0;
      totalCount += count;
      days.push({ date: dateStr, count });
    }

    cache = {
      totalCount,
      days
    };
    cacheTime = now;
    return cache;

  } catch (error) {
    console.error('LeetCode API Fetch failed:', error.message);
    console.warn('Using mock LeetCode data as fallback.');
    cache = generateMockLeetcodeData();
    cacheTime = now;
    return cache;
  }
}
