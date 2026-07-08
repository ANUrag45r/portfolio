import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getDailyAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getTopPages,
  getReferrers,
  getDevices,
  getBrowsers,
  getCountries,
} from '../controllers/dashboardController.js';
import { authAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// Public Admin Login endpoint
router.post('/login', adminLogin);

// Public Analytics aggregation endpoints
router.get('/dashboard', getDashboardStats);
router.get('/analytics/daily', getDailyAnalytics);
router.get('/analytics/weekly', getWeeklyAnalytics);
router.get('/analytics/monthly', getMonthlyAnalytics);
router.get('/top-pages', getTopPages);
router.get('/referrers', getReferrers);
router.get('/devices', getDevices);
router.get('/browsers', getBrowsers);
router.get('/countries', getCountries);

export default router;
