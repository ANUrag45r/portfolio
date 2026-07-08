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

// Protected Analytics aggregation endpoints
router.get('/dashboard', authAdmin, getDashboardStats);
router.get('/analytics/daily', authAdmin, getDailyAnalytics);
router.get('/analytics/weekly', authAdmin, getWeeklyAnalytics);
router.get('/analytics/monthly', authAdmin, getMonthlyAnalytics);
router.get('/top-pages', authAdmin, getTopPages);
router.get('/referrers', authAdmin, getReferrers);
router.get('/devices', authAdmin, getDevices);
router.get('/browsers', authAdmin, getBrowsers);
router.get('/countries', authAdmin, getCountries);

export default router;
