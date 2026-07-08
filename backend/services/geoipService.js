import fetch from 'node-fetch'; // Standard node fetch API helper if node version < 18, but Node 18+ has native fetch.
// We can use global fetch in Node 18+! Let's check: our Node version is v26.1.0, so native fetch is fully supported!

const isPrivateIP = (ip) => {
  if (!ip) return true;
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('::ffff:127.0.0.1') ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('fe80:')
  );
};

export const resolveGeoIP = async (ip) => {
  const defaultGeo = {
    country: 'Unknown',
    state: 'Unknown',
    city: 'Unknown',
    latitude: 0,
    longitude: 0,
  };

  // Safe checks
  let cleanIp = ip ? ip.trim() : '';
  if (cleanIp.startsWith('::ffff:')) {
    cleanIp = cleanIp.substring(7);
  }

  if (!cleanIp || isPrivateIP(cleanIp)) {
    // In local development, return Anurag's location so charts and lists display real metrics
    return {
      country: 'India',
      state: 'Bihar',
      city: 'Patna',
      latitude: 25.5941,
      longitude: 85.1376,
      isLocal: true,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`https://freeipapi.com/api/json/${cleanIp}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`GeoIP API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    return {
      country: data.countryName || 'Unknown',
      state: data.regionName || 'Unknown',
      city: data.cityName || 'Unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
    };
  } catch (error) {
    console.error(`GeoIP Lookup failed for ${cleanIp}:`, error.message);
    return defaultGeo;
  }
};
