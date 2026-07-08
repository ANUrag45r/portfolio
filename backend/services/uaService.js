import UAParser from 'ua-parser-js';

export const parseUserAgent = (userAgentStr) => {
  const parser = new UAParser(userAgentStr);
  const result = parser.getResult();

  const browser = result.browser.name || 'Unknown';
  const browserVersion = result.browser.version || 'Unknown';
  const operatingSystem = result.os.name || 'Unknown';
  
  // Device Type mapping (UAParser returns 'mobile', 'tablet', 'smarttv', etc. or undefined)
  let rawDevice = result.device.type; // mobile, tablet, console, smarttv, wearable, embedded
  let deviceType = 'desktop';
  
  let mobile = false;
  let tablet = false;
  let desktop = false;

  if (rawDevice === 'mobile') {
    deviceType = 'mobile';
    mobile = true;
  } else if (rawDevice === 'tablet') {
    deviceType = 'tablet';
    tablet = true;
  } else {
    // If undefined or smarttv/console, map to desktop or keep desktop default
    deviceType = 'desktop';
    desktop = true;
  }

  return {
    browser,
    browserVersion,
    operatingSystem,
    deviceType,
    mobile,
    tablet,
    desktop,
  };
};
