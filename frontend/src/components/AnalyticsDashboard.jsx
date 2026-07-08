import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Users,
  Activity,
  MousePointer,
  Clock,
  MapPin,
  Laptop,
  Compass,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Calendar,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE.endsWith('/api') ? API_BASE.slice(0, -4) : 'http://localhost:5000';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export default function AnalyticsDashboard({ token, onUnauthorized }) {
  const [range, setRange] = useState('7days');
  const [customDates, setCustomDates] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Real-time states
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [liveEventLog, setLiveEventLog] = useState([]);

  // Data states
  const [stats, setStats] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [referrers, setReferrers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [browsers, setBrowsers] = useState([]);
  const [countries, setCountries] = useState([]);

  const socketRef = useRef(null);

  // Unified data fetcher
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      let queryParams = `?range=${range}`;
      if (range === 'custom') {
        if (!customDates.startDate || !customDates.endDate) {
          setLoading(false);
          return;
        }
        queryParams += `&startDate=${customDates.startDate}&endDate=${customDates.endDate}`;
      }

      const endpoints = [
        `admin/dashboard${queryParams}`,
        `admin/analytics/daily${queryParams}`,
        `admin/top-pages${queryParams}`,
        `admin/referrers${queryParams}`,
        `admin/devices${queryParams}`,
        `admin/browsers${queryParams}`,
        `admin/countries${queryParams}`,
      ];

      const responses = await Promise.all(
        endpoints.map((ep) =>
          fetch(`${API_BASE}/${ep}`, { headers }).then(async (res) => {
            if (res.status === 401) {
              onUnauthorized();
              throw new Error('Unauthorized');
            }
            if (!res.ok) throw new Error(`Failed to fetch ${ep}`);
            return res.json();
          })
        )
      );

      setStats(responses[0].stats);
      setTimelineData(responses[1].data);
      setTopPages(responses[2].data);
      setReferrers(responses[3].data);
      setDevices(responses[4].data);
      setBrowsers(responses[5].data);
      setCountries(responses[6].data);
    } catch (err) {
      if (err.message !== 'Unauthorized') {
        setError(err.message || 'An error occurred while fetching analytics.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [range, customDates]);

  // Connect to live updates via WebSockets
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      // Connect specifically as dashboard viewer
      socket.emit('analytics:join', { visitorId: 'admin_dashboard', page: 'DashboardView' });
    });

    socket.on('analytics:active_count', (count) => {
      setActiveUsersCount(count);
    });

    // Record incoming live actions in a running logger feed
    const handleLiveUpdate = (type, data) => {
      setLiveEventLog((prev) => [
        { type, id: Math.random(), timestamp: new Date(), ...data },
        ...prev.slice(0, 19), // Cap log size at last 20 elements
      ]);

      // Automatically bump counts locally to make dashboard feel alive
      if (type === 'visit') {
        setStats((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            uniqueVisitors: prev.uniqueVisitors + (data.isNewVisitor ? 1 : 0),
            todayVisitors: prev.todayVisitors + 1,
            totalSessions: prev.totalSessions + 1,
            pageViews: prev.pageViews + 1,
          };
        });
      } else if (type === 'page_view') {
        setStats((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            pageViews: prev.pageViews + 1,
          };
        });
      }
    };

    socket.on('analytics:new_visit', (data) => handleLiveUpdate('visit', data));
    socket.on('analytics:page_view', (data) => handleLiveUpdate('page_view', data));
    socket.on('analytics:custom_event', (data) => handleLiveUpdate('event', data));
    socket.on('analytics:session_end', (data) => handleLiveUpdate('session_end', data));

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0s';
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const getEventEmoji = (type) => {
    switch (type) {
      case 'visit': return '🚀';
      case 'page_view': return '📄';
      case 'event': return '⚡';
      case 'session_end': return '🚪';
      default: return '📍';
    }
  };

  return (
    <div className="space-y-6 text-ink bg-[#0a0e17] p-1 md:p-4 rounded-xl min-h-screen">
      
      {/* Header and Live stats block */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-mono text-xs text-blue tracking-widest font-extrabold uppercase">Live Feed // Active Now</span>
          </div>
          <h2 className="font-display text-2xl font-bold mt-1">Visitor Analytics</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['today', 'yesterday', '7days', '30days', '90days', 'custom'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 font-mono text-[11px] border transition-colors duration-200 rounded-md ${
                range === r
                  ? 'bg-blue border-blue text-white'
                  : 'bg-panel/40 border-line hover:border-blue text-slate hover:text-white'
              }`}
            >
              {r === '7days' ? 'Last 7 Days' : r === '30days' ? 'Last 30 Days' : r === '90days' ? 'Last 90 Days' : r.toUpperCase()}
            </button>
          ))}
          <button
            onClick={fetchAnalyticsData}
            title="Refresh Metrics"
            className="p-1.5 border border-line bg-panel/30 text-slate hover:text-white hover:border-blue rounded-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom Dates Inputs */}
      {range === 'custom' && (
        <div className="p-4 border border-line bg-panel/20 flex flex-wrap items-center gap-4 rounded-lg">
          <div className="flex items-center gap-2 font-mono text-xs text-slate">
            <Calendar className="w-4 h-4 text-blue" />
            <span>START DATE:</span>
            <input
              type="date"
              value={customDates.startDate}
              onChange={(e) => setCustomDates({ ...customDates, startDate: e.target.value })}
              className="px-2 py-1 bg-[#0a0e17] border border-line focus:outline-none focus:border-blue text-ink text-xs rounded"
            />
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate">
            <span>END DATE:</span>
            <input
              type="date"
              value={customDates.endDate}
              onChange={(e) => setCustomDates({ ...customDates, endDate: e.target.value })}
              className="px-2 py-1 bg-[#0a0e17] border border-line focus:outline-none focus:border-blue text-ink text-xs rounded"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-amber-950/20 border border-amber-800 text-amber-500 rounded-lg text-sm font-mono">
          ⚠️ {error}
        </div>
      )}

      {/* Summary KPI Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-panel border border-line p-4 rounded-xl relative overflow-hidden group hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:border-blue transition-all duration-300">
            <div className="flex items-center justify-between text-slate">
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase">Active Users</span>
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>
            <div className="mt-2 text-2xl md:text-3xl font-black font-mono text-emerald-400">
              {activeUsersCount}
            </div>
            <p className="text-[10px] text-slate mt-1">Real-time connections</p>
          </div>

          <div className="bg-panel border border-line p-4 rounded-xl relative overflow-hidden group hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:border-blue transition-all duration-300">
            <div className="flex items-center justify-between text-slate">
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase">Unique Visitors</span>
              <Users className="w-4 h-4 text-blue" />
            </div>
            <div className="mt-2 text-2xl md:text-3xl font-black font-mono">
              {stats.uniqueVisitors.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate mt-1">{stats.returningVisitors.toLocaleString()} returning visitors</p>
          </div>

          <div className="bg-panel border border-line p-4 rounded-xl relative overflow-hidden group hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:border-blue transition-all duration-300">
            <div className="flex items-center justify-between text-slate">
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase">Page Views</span>
              <MousePointer className="w-4 h-4 text-blue" />
            </div>
            <div className="mt-2 text-2xl md:text-3xl font-black font-mono">
              {stats.pageViews.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate mt-1">{stats.totalSessions.toLocaleString()} total sessions</p>
          </div>

          <div className="bg-panel border border-line p-4 rounded-xl relative overflow-hidden group hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:border-blue transition-all duration-300">
            <div className="flex items-center justify-between text-slate">
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase">Avg. Duration</span>
              <Clock className="w-4 h-4 text-blue" />
            </div>
            <div className="mt-2 text-2xl md:text-3xl font-black font-mono">
              {formatDuration(stats.avgSessionTime)}
            </div>
            <p className="text-[10px] text-slate mt-1">Bounce: {stats.bounceRate}%</p>
          </div>

        </div>
      )}

      {/* Main Charts & Live Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline area chart */}
        <div className="lg:col-span-2 bg-panel border border-line p-5 rounded-xl">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue" />
            Visitor Timeline Trend
          </h3>
          <div className="h-72 w-full font-mono text-[10px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate">Loading chart...</div>
            ) : timelineData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate">No traffic data in range</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262F3D" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#182230', borderColor: '#262F3D', color: '#f3f4f6' }}
                    labelClassName="text-slate text-[10px] font-bold"
                  />
                  <Area type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Live log feed card */}
        <div className="bg-panel border border-line p-5 rounded-xl flex flex-col h-[354px]">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Live Visitor Stream
          </h3>
          <div className="flex-grow overflow-y-auto space-y-3 scrollbar-thin pr-1 font-mono text-[10px]">
            {liveEventLog.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate text-center p-4">
                <p>Waiting for live visits...</p>
                <span className="text-[9px] opacity-40 mt-1">Open your website in another tab!</span>
              </div>
            ) : (
              liveEventLog.map((log) => (
                <div key={log.id} className="p-2 border border-line bg-ink/30 flex items-start gap-2.5 rounded-lg">
                  <span className="text-base select-none">{getEventEmoji(log.type)}</span>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between text-slate">
                      <span className="font-bold text-ink uppercase text-[9px] tracking-wide">
                        {log.type === 'visit' ? 'New Visit' : log.type === 'page_view' ? 'Section View' : log.type === 'event' ? 'Action' : 'Session Ended'}
                      </span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    
                    {log.type === 'visit' && (
                      <p className="text-ink truncate mt-0.5">
                        Visitor ({log.visitorId.slice(0, 5)}) from <strong className="text-white">{log.city}, {log.country}</strong> landed on <span className="text-blue">{log.page}</span>
                      </p>
                    )}
                    {log.type === 'page_view' && (
                      <p className="text-ink truncate mt-0.5">
                        Visitor ({log.visitorId.slice(0, 5)}) scrolled to <span className="text-blue">{log.page}</span>
                      </p>
                    )}
                    {log.type === 'event' && (
                      <p className="text-ink truncate mt-0.5">
                        Clicked <strong className="text-amber">{log.eventType}</strong> ({log.eventLabel})
                      </p>
                    )}
                    {log.type === 'session_end' && (
                      <p className="text-ink truncate mt-0.5">
                        Session ended. Duration: <strong className="text-white">{formatDuration(log.duration)}</strong>
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Second Row: Device / Browser / Referrers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Device Pie Chart */}
        <div className="bg-panel border border-line p-5 rounded-xl">
          <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
            <Laptop className="w-4 h-4 text-blue" />
            Device Breakdown
          </h3>
          <div className="h-56 font-mono text-[10px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate">Loading device data...</div>
            ) : devices.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate">No device data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="device"
                  >
                    {devices.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#182230', borderColor: '#262F3D', color: '#f3f4f6' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Browser Stats */}
        <div className="bg-panel border border-line p-5 rounded-xl">
          <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue" />
            Browser Shares
          </h3>
          <div className="h-56 font-mono text-[10px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate">Loading browser data...</div>
            ) : browsers.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate">No browser data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={browsers} layout="vertical" margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid stroke="#262F3D" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="browser" type="category" stroke="#64748b" width={75} />
                  <Tooltip contentStyle={{ backgroundColor: '#182230', borderColor: '#262F3D', color: '#f3f4f6' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                    {browsers.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Traffic Referrers */}
        <div className="bg-panel border border-line p-5 rounded-xl">
          <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-blue" />
            Traffic Referrers
          </h3>
          <div className="h-56 overflow-y-auto space-y-2 font-mono text-[11px] scrollbar-thin pr-1">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate">Loading referrers...</div>
            ) : referrers.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate">No referrer data</div>
            ) : (
              referrers.map((ref, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 border border-line/50 bg-panel/30 hover:border-blue/50 rounded-lg">
                  <span className="text-white truncate max-w-[200px]" title={ref.referrer}>{ref.referrer}</span>
                  <span className="font-black text-blue">{ref.count} views</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Third Row: Popular Sections & Country Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Popular pages */}
        <div className="bg-panel border border-line p-5 rounded-xl overflow-hidden">
          <h3 className="font-display font-semibold text-base mb-4">Popular Portfolio Sections</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-line text-slate">
                  <th className="pb-2.5">Section URL</th>
                  <th className="pb-2.5 text-right">Views</th>
                  <th className="pb-2.5 text-right">Uniques</th>
                  <th className="pb-2.5 text-right">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/30">
                {loading ? (
                  <tr><td colSpan="4" className="py-4 text-center text-slate">Loading...</td></tr>
                ) : topPages.length === 0 ? (
                  <tr><td colSpan="4" className="py-4 text-center text-slate">No section data</td></tr>
                ) : (
                  topPages.map((page, idx) => (
                    <tr key={idx} className="hover:bg-panel/30 transition-colors">
                      <td className="py-2.5 text-blue font-bold">{page.page}</td>
                      <td className="py-2.5 text-right text-white font-bold">{page.views}</td>
                      <td className="py-2.5 text-right text-slate">{page.uniqueVisitors}</td>
                      <td className="py-2.5 text-right text-white font-bold">{formatDuration(page.avgTime)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic location details */}
        <div className="bg-panel border border-line p-5 rounded-xl overflow-hidden">
          <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue" />
            Geographic Traffic Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-line text-slate">
                  <th className="pb-2.5">Country</th>
                  <th className="pb-2.5">State</th>
                  <th className="pb-2.5">City</th>
                  <th className="pb-2.5 text-right">Visitor Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/30">
                {loading ? (
                  <tr><td colSpan="4" className="py-4 text-center text-slate">Loading...</td></tr>
                ) : countries.length === 0 ? (
                  <tr><td colSpan="4" className="py-4 text-center text-slate">No geographic data</td></tr>
                ) : (
                  countries.slice(0, 10).map((c, idx) => (
                    <tr key={idx} className="hover:bg-panel/30 transition-colors">
                      <td className="py-2.5 text-white font-bold">{c.country}</td>
                      <td className="py-2.5 text-slate">{c.state}</td>
                      <td className="py-2.5 text-slate">{c.city}</td>
                      <td className="py-2.5 text-right text-blue font-bold">{c.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
