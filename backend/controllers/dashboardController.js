import Visitor from '../models/Visitor.js';
import Session from '../models/Session.js';
import PageVisit from '../models/PageVisit.js';
import EventModel from '../models/Event.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'anurag_portfolio_secret_jwt_key_2026';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'anurag';

// Admin Login endpoint
export const adminLogin = async (req, res) => {
  try {
    const { passcode } = req.body;
    if (!passcode) {
      return res.status(400).json({ error: 'Passcode is required.' });
    }

    if (passcode.toLowerCase() === ADMIN_PASSCODE.toLowerCase()) {
      // Issue token signed for 24 hours
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ error: 'Access Denied: Invalid Admin Passcode.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error processing login.' });
  }
};

// Helper: Get mongoose filter date object based on time range query param
const getDateFilter = (query) => {
  const { range, startDate, endDate } = query;
  const now = new Date();
  let start = new Date();

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      return { createdAt: { $gte: start } };
    case 'yesterday':
      const yestStart = new Date();
      yestStart.setDate(yestStart.getDate() - 1);
      yestStart.setHours(0, 0, 0, 0);
      const yestEnd = new Date();
      yestEnd.setDate(yestEnd.getDate() - 1);
      yestEnd.setHours(23, 59, 59, 999);
      return { createdAt: { $gte: yestStart, $lte: yestEnd } };
    case '7days':
      start.setDate(now.getDate() - 7);
      return { createdAt: { $gte: start } };
    case '30days':
      start.setDate(now.getDate() - 30);
      return { createdAt: { $gte: start } };
    case '90days':
      start.setDate(now.getDate() - 90);
      return { createdAt: { $gte: start } };
    case 'custom':
      if (startDate && endDate) {
        return {
          createdAt: {
            $gte: new Date(new Date(startDate).setHours(0,0,0,0)),
            $lte: new Date(new Date(endDate).setHours(23,59,59,999))
          }
        };
      }
      break;
    default:
      // Default to 30 days
      start.setDate(now.getDate() - 30);
      return { createdAt: { $gte: start } };
  }

  // Fallback
  start.setDate(now.getDate() - 30);
  return { createdAt: { $gte: start } };
};

// GET /api/admin/dashboard - Returns summary statistics
export const getDashboardStats = async (req, res) => {
  try {
    const filter = getDateFilter(req.query);

    // 1. Unique visitors
    const uniqueCount = await Visitor.countDocuments(filter);

    // 2. Returning visitors
    const returningCount = await Visitor.countDocuments({
      ...filter,
      totalVisits: { $gt: 1 },
    });

    // 3. Total Page Views
    const pageViewsCount = await PageVisit.countDocuments(filter);

    // 4. Total Sessions
    const totalSessions = await Session.countDocuments({
      visitTime: filter.createdAt
    });

    // 5. Bounced Sessions and Bounce Rate
    const bouncedSessions = await Session.countDocuments({
      visitTime: filter.createdAt,
      bounce: true,
    });
    const bounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;

    // 6. Avg Session Time
    const sessionTimeResult = await Session.aggregate([
      { $match: { visitTime: filter.createdAt } },
      { $group: { _id: null, avgDuration: { $avg: '$sessionDuration' } } },
    ]);
    const avgSessionTime = sessionTimeResult.length > 0 ? sessionTimeResult[0].avgDuration : 0;

    // 7. Today's visitors count
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const todayVisitors = await Visitor.countDocuments({ createdAt: { $gte: todayStart } });

    // 8. Active users (from Socket.IO state on app)
    const activeUsersMap = req.app.get('activeUsers') || {};
    const activeUsersCount = Object.keys(activeUsersMap).length;

    // 9. New vs Returning (Distribution percentages)
    const newCount = uniqueCount - returningCount;
    const distribution = {
      newVisitors: uniqueCount > 0 ? (newCount / uniqueCount) * 100 : 0,
      returningVisitors: uniqueCount > 0 ? (returningCount / uniqueCount) * 100 : 0
    };

    res.status(200).json({
      success: true,
      stats: {
        uniqueVisitors: uniqueCount,
        returningVisitors: returningCount,
        todayVisitors,
        activeUsers: activeUsersCount,
        bounceRate: Math.round(bounceRate * 100) / 100,
        avgSessionTime: Math.round(avgSessionTime),
        pageViews: pageViewsCount,
        totalSessions,
        newVsReturning: distribution
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Server error fetching statistics.' });
  }
};

// Helper function to group visits chronologically
const aggregateTimeline = async (filter, format) => {
  return await Visitor.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { $dateToString: { format, date: '$createdAt' } },
        visitors: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: '$_id',
        visitors: 1,
        _id: 0,
      },
    },
  ]);
};

// GET /api/admin/analytics/daily
export const getDailyAnalytics = async (req, res) => {
  try {
    const filter = getDateFilter(req.query);
    const timeline = await aggregateTimeline(filter, '%Y-%m-%d');
    res.status(200).json({ success: true, data: timeline });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching daily analytics.' });
  }
};

// GET /api/admin/analytics/weekly
export const getWeeklyAnalytics = async (req, res) => {
  try {
    const filter = getDateFilter(req.query);
    const timeline = await aggregateTimeline(filter, '%Y-U%U'); // Year and Week number
    res.status(200).json({ success: true, data: timeline });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching weekly analytics.' });
  }
};

// GET /api/admin/analytics/monthly
export const getMonthlyAnalytics = async (req, res) => {
  try {
    const filter = getDateFilter(req.query);
    const timeline = await aggregateTimeline(filter, '%Y-%m');
    res.status(200).json({ success: true, data: timeline });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching monthly analytics.' });
  }
};

// GET /api/admin/top-pages
export const getTopPages = async (req, res) => {
  try {
    const filter = getDateFilter(req.query);

    const pages = await PageVisit.aggregate([
      { $match: { timestamp: filter.createdAt } },
      {
        $group: {
          _id: '$page',
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' },
          totalTime: { $sum: '$timeSpent' },
        },
      },
      {
        $project: {
          page: '$_id',
          views: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          avgTime: {
            $cond: {
              if: { $eq: ['$views', 0] },
              then: 0,
              else: { $divide: ['$totalTime', '$views'] },
            },
          },
          _id: 0,
        },
      },
      { $sort: { views: -1 } },
    ]);

    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching top pages.' });
  }
};

// GET /api/admin/referrers
export const getReferrers = async (req, res) => {
  try {
    const filter = getDateFilter(req.query);

    const referrers = await Visitor.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$referrer',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          referrer: '$_id',
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, data: referrers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching referrers.' });
  }
};

// GET /api/admin/devices
export const getDevices = async (req, res) => {
  try {
    const filter = getDateFilter(req.query);

    const devices = await Visitor.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$deviceType',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          device: '$_id',
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, data: devices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching devices.' });
  }
};

// GET /api/admin/browsers
export const getBrowsers = async (req, res) => {
  try {
    const filter = getDateFilter(req.query);

    const browsers = await Visitor.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$browser',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          browser: '$_id',
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, data: browsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching browsers.' });
  }
};

// GET /api/admin/countries
export const getCountries = async (req, res) => {
  try {
    const filter = getDateFilter(req.query);

    const countries = await Visitor.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { country: '$country', state: '$state', city: '$city' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          country: '$_id.country',
          state: '$_id.state',
          city: '$_id.city',
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, data: countries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching countries.' });
  }
};
