import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE.endsWith('/api') ? API_BASE.slice(0, -4) : 'http://localhost:5000';

// Generate UUID for anonymous visitor tracking
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default function AnalyticsTracker() {
  const socketRef = useRef(null);
  const activeSectionRef = useRef('#top');
  const sectionStartTimeRef = useRef(Date.now());
  const sessionStartTimeRef = useRef(Date.now());

  // Get or Create Visitor ID
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = generateUUID();
    localStorage.setItem('visitor_id', visitorId);
  }

  // Get or Create Session ID (reset on new tab/browser open)
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem('session_id', sessionId);
  }

  useEffect(() => {
    // 1. Send Initial Visit
    const logInitialVisit = async () => {
      try {
        const payload = {
          visitorId,
          sessionId,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          language: navigator.language || 'Unknown',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
          referrer: document.referrer || 'Direct',
          landingPage: window.location.hash || '#top',
        };

        await fetch(`${API_BASE}/analytics/visit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error('[Tracker] Visit log failed:', err);
      }
    };
    logInitialVisit();

    // 2. Initialize Socket.IO connection
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('analytics:join', { visitorId, page: window.location.hash || '#top' });
    });

    // 3. Track scrolling section changes using IntersectionObserver
    const sections = ['top', 'profile', 'education', 'experience', 'projects', 'skills', 'contact'];
    const sectionElements = [];

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Trigger when section occupies the center third of the screen
      threshold: 0,
    };

    const handleSectionTransition = async (newSection) => {
      if (activeSectionRef.current === newSection) return;

      const now = Date.now();
      const timeSpent = Math.round((now - sectionStartTimeRef.current) / 1000);

      // Log previous section view duration
      try {
        await fetch(`${API_BASE}/analytics/page`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            sessionId,
            page: activeSectionRef.current,
            timeSpent,
            scrollPercentage: getScrollPercent(),
          }),
        });
      } catch (err) {
        console.error('[Tracker] Section log failed:', err);
      }

      // Update state
      activeSectionRef.current = newSection;
      sectionStartTimeRef.current = now;

      // Update Socket info
      if (socket.connected) {
        socket.emit('analytics:page_update', { page: newSection });
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = `#${entry.target.id}`;
          handleSectionTransition(sectionId);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        sectionElements.push(el);
        observer.observe(el);
      }
    });

    // 4. Global click listener for custom interactions
    const handleGlobalClick = async (e) => {
      const target = e.target.closest('a, button, [role="button"]');
      if (!target) return;

      let eventType = '';
      let eventLabel = '';

      const href = target.getAttribute('href') || '';
      const text = target.innerText ? target.innerText.trim() : '';

      // Determine Event Type
      if (href.includes('github.com')) {
        eventType = 'GitHub Click';
        eventLabel = href;
      } else if (href.includes('linkedin.com')) {
        eventType = 'LinkedIn Click';
        eventLabel = href;
      } else if (href.includes('leetcode.com')) {
        eventType = 'LeetCode Click';
        eventLabel = href;
      } else if (href.includes('resume') || href.endsWith('.pdf')) {
        eventType = 'Resume Download';
        eventLabel = href || 'Resume File';
      } else if (href.includes('mailto:') || text.includes('Email') || text.includes('gmail.com')) {
        eventType = 'Email Click';
        eventLabel = href || text;
      } else if (target.id === 'contact-submit' || target.type === 'submit' && target.closest('#contact')) {
        eventType = 'Contact Click';
        eventLabel = 'Contact Form Submission';
      } else if (href.includes('credential') || text.includes('Certificate') || text.includes('Credential')) {
        eventType = 'Certificate Click';
        eventLabel = text || href;
      } else if (href.startsWith('#') && href.length > 1) {
        eventType = 'Navigation Click';
        eventLabel = href;
      } else if (target.closest('[class*="Project"]') || target.closest('[id*="project"]')) {
        eventType = 'Project Click';
        eventLabel = text || href || 'Project Interaction';
      } else if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        eventType = 'External Link';
        eventLabel = href;
      }

      if (eventType) {
        try {
          await fetch(`${API_BASE}/analytics/event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              visitorId,
              sessionId,
              eventType,
              eventLabel,
              page: activeSectionRef.current,
            }),
          });
        } catch (err) {
          console.error('[Tracker] Event log failed:', err);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);

    // 5. Send remaining session analytics on page exit/visibility hide
    const logSessionEnd = () => {
      const duration = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
      const payload = JSON.stringify({
        visitorId,
        sessionId,
        sessionDuration: duration,
      });

      const url = `${API_BASE}/analytics/session/end`;
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        // Fallback for older browsers
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        logSessionEnd();
      }
    };

    window.addEventListener('beforeunload', logSessionEnd);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('beforeunload', logSessionEnd);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (socket) socket.disconnect();
    };
  }, []);

  return null; // Silent background tracker
}

// Utility: Calculate vertical scroll depth percentage
function getScrollPercent() {
  const h = document.documentElement,
    b = document.body,
    st = 'scrollTop',
    sh = 'scrollHeight';
  return Math.round(((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100) || 0;
}
