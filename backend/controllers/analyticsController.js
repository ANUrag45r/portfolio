import Visitor from '../models/Visitor.js';
import Session from '../models/Session.js';
import PageVisit from '../models/PageVisit.js';
import EventModel from '../models/Event.js';
import { resolveGeoIP } from '../services/geoipService.js';
import { parseUserAgent } from '../services/uaService.js';

// Retrieve real client IP accounting for Vercel/Railway reverse proxies
const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '';
};

export const logVisit = async (req, res) => {
  try {
    const {
      visitorId,
      sessionId,
      screenWidth,
      screenHeight,
      language,
      timezone,
      referrer,
      landingPage,
    } = req.body;

    if (!visitorId || !sessionId) {
      return res.status(400).json({ error: 'visitorId and sessionId are required.' });
    }

    const ip = getClientIp(req);
    const userAgentStr = req.headers['user-agent'] || '';

    // Run UA parsing and GeoIP resolution
    const uaMeta = parseUserAgent(userAgentStr);
    const geoMeta = await resolveGeoIP(ip);

    let visitor = await Visitor.findOne({ visitorId });
    const isNewVisitor = !visitor;

    if (isNewVisitor) {
      visitor = new Visitor({
        visitorId,
        firstVisit: new Date(),
        lastVisit: new Date(),
        totalVisits: 1,
        country: geoMeta.country,
        state: geoMeta.state,
        city: geoMeta.city,
        browser: uaMeta.browser,
        browserVersion: uaMeta.browserVersion,
        operatingSystem: uaMeta.operatingSystem,
        deviceType: uaMeta.deviceType,
        mobile: uaMeta.mobile,
        tablet: uaMeta.tablet,
        desktop: uaMeta.desktop,
        screenWidth,
        screenHeight,
        language,
        timezone,
        referrer: referrer || 'Direct',
        landingPage: landingPage || '/',
        lastPage: landingPage || '/',
      });
    } else {
      visitor.totalVisits += 1;
      visitor.lastVisit = new Date();
      visitor.lastPage = landingPage || '/';
      // Sync resolution if changed
      visitor.screenWidth = screenWidth || visitor.screenWidth;
      visitor.screenHeight = screenHeight || visitor.screenHeight;
    }

    await visitor.save();

    // Check if Session document already exists to prevent duplicate starts
    let session = await Session.findOne({ sessionId });
    if (!session) {
      session = new Session({
        sessionId,
        visitorId,
        visitTime: new Date(),
        device: uaMeta.deviceType,
        browser: uaMeta.browser,
        country: geoMeta.country,
        pagesVisited: [landingPage || '/'],
        bounce: true,
      });
      await session.save();
    }

    // Ingest first page visit
    const initialVisit = new PageVisit({
      page: landingPage || '/',
      visitorId,
      sessionId,
      timestamp: new Date(),
      timeSpent: 0,
      scrollPercentage: 0,
    });
    await initialVisit.save();

    // Emit live stats update to the active dashboard clients via socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('analytics:new_visit', {
        visitorId,
        sessionId,
        isNewVisitor,
        country: geoMeta.country,
        city: geoMeta.city,
        device: uaMeta.deviceType,
        browser: uaMeta.browser,
        page: landingPage || '/',
        timestamp: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      visitorId,
      sessionId,
      isNewVisitor,
    });
  } catch (error) {
    console.error('Error logging visit:', error);
    return res.status(500).json({ error: 'Server error processing visitor log.' });
  }
};

export const logPage = async (req, res) => {
  try {
    const { visitorId, sessionId, page, scrollPercentage, timeSpent } = req.body;

    if (!visitorId || !sessionId || !page) {
      return res.status(400).json({ error: 'visitorId, sessionId, and page are required.' });
    }

    // Save page visit document
    const pageVisit = new PageVisit({
      page,
      visitorId,
      sessionId,
      timestamp: new Date(),
      timeSpent: timeSpent || 0,
      scrollPercentage: scrollPercentage || 0,
    });
    await pageVisit.save();

    // Update session data
    const session = await Session.findOne({ sessionId });
    if (session) {
      // Add page to visited array if not the current last one
      const lastPage = session.pagesVisited[session.pagesVisited.length - 1];
      if (lastPage !== page) {
        session.pagesVisited.push(page);
      }
      
      // If user navigates to more than 1 section, it's not a bounce
      if (session.pagesVisited.length > 1) {
        session.bounce = false;
      }
      
      await session.save();
    }

    // Update visitor last page
    await Visitor.findOneAndUpdate({ visitorId }, { lastPage: page });

    // Emit page view socket notification
    const io = req.app.get('io');
    if (io) {
      io.emit('analytics:page_view', {
        visitorId,
        sessionId,
        page,
        timeSpent: timeSpent || 0,
        timestamp: new Date(),
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error logging page visit:', error);
    return res.status(500).json({ error: 'Server error processing page visit.' });
  }
};

export const logEvent = async (req, res) => {
  try {
    const { visitorId, sessionId, eventType, eventLabel, page } = req.body;

    if (!visitorId || !sessionId || !eventType) {
      return res.status(400).json({ error: 'visitorId, sessionId, and eventType are required.' });
    }

    const event = new EventModel({
      visitorId,
      sessionId,
      eventType,
      eventLabel: eventLabel || '',
      page: page || '#top',
      timestamp: new Date(),
    });
    await event.save();

    // Find the latest PageVisit for this page/session and append to clickedButtons
    await PageVisit.findOneAndUpdate(
      { sessionId, page: page || '#top' },
      {
        $push: {
          clickedButtons: {
            buttonId: eventType,
            label: eventLabel || '',
            timestamp: new Date(),
          },
        },
      },
      { sort: { timestamp: -1 } }
    );

    // Emit event socket notification
    const io = req.app.get('io');
    if (io) {
      io.emit('analytics:custom_event', {
        visitorId,
        sessionId,
        eventType,
        eventLabel: eventLabel || '',
        page: page || '#top',
        timestamp: new Date(),
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error logging custom event:', error);
    return res.status(500).json({ error: 'Server error processing custom event.' });
  }
};

export const logSessionEnd = async (req, res) => {
  try {
    const { visitorId, sessionId, sessionDuration } = req.body;

    if (!visitorId || !sessionId) {
      return res.status(400).json({ error: 'visitorId and sessionId are required.' });
    }

    const duration = parseFloat(sessionDuration) || 0;

    // Update Session
    const session = await Session.findOne({ sessionId });
    if (session) {
      session.exitTime = new Date();
      session.sessionDuration = duration;
      if (session.pagesVisited.length <= 1) {
        session.bounce = true;
      }
      await session.save();
    }

    // Update Visitor aggregates
    const visitor = await Visitor.findOne({ visitorId });
    if (visitor) {
      visitor.totalSessionTime += duration;
      visitor.averageSessionTime = visitor.totalSessionTime / visitor.totalVisits;
      await visitor.save();
    }

    // Emit end-session socket notification
    const io = req.app.get('io');
    if (io) {
      io.emit('analytics:session_end', {
        visitorId,
        sessionId,
        duration,
        timestamp: new Date(),
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error logging session end:', error);
    return res.status(500).json({ error: 'Server error processing session end.' });
  }
};
