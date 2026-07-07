import express from 'express';
import { getGithubActivity } from '../services/githubService.js';
import { getLeetcodeActivity } from '../services/leetcodeService.js';

const router = express.Router();

router.get('/github-activity', async (req, res) => {
  try {
    const data = await getGithubActivity();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve GitHub activity data' });
  }
});

router.get('/leetcode-activity', async (req, res) => {
  try {
    const data = await getLeetcodeActivity();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve LeetCode activity data' });
  }
});

export default router;
