import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Inbox, 
  Mail, 
  CheckCircle, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare,
  Globe,
  Monitor,
  RefreshCw,
  X
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminMessages({ isFullPage = false }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read', 'replied'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/contact`);
      setMessages(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE}/contact/${id}/read`);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: res.data.isRead } : m));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update read status.');
    }
  };

  const handleToggleReplied = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE}/contact/${id}/replied`);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, replySent: res.data.replySent } : m));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update reply status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`${API_BASE}/contact/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete message.');
    }
  };

  // Stats calculation
  const totalCount = messages.length;
  const unreadCount = messages.filter(m => !m.isRead).length;
  const readCount = messages.filter(m => m.isRead).length;
  const repliedCount = messages.filter(m => m.replySent).length;

  // Search & Filter
  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filter === 'unread') return !m.isRead;
    if (filter === 'read') return m.isRead;
    if (filter === 'replied') return m.replySent;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={`flex flex-col h-full bg-[#0a0e17] text-slate font-sans ${isFullPage ? 'min-h-screen p-8' : 'w-full'}`}>
      
      {/* Page Header (if full page route) */}
      {isFullPage && (
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between border-b border-line pb-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl text-ink font-semibold">Admin Messages Console</h1>
            <p className="text-xs text-slate mt-1 font-mono">SECURE ACCESS // PORTFOLIO DATABASE</p>
          </div>
          <a 
            href="/" 
            className="flex items-center gap-1.5 px-3 py-1.5 border border-line text-xs font-mono rounded hover:text-ink hover:border-ink transition-all"
          >
            <X className="w-3.5 h-3.5" /> Close Console
          </a>
        </div>
      )}

      <div className={`w-full ${isFullPage ? 'max-w-6xl mx-auto' : ''} space-y-6 flex-grow flex flex-col overflow-hidden`}>
        
        {/* Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-line bg-panel/20 flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate/50">Total Messages</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-ink">{totalCount}</span>
              <Inbox className="w-4 h-4 text-blue shrink-0" />
            </div>
          </div>
          <div className="p-4 rounded-xl border border-line bg-panel/20 flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate/50">Unread</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-amber">{unreadCount}</span>
              <Mail className="w-4 h-4 text-amber shrink-0" />
            </div>
          </div>
          <div className="p-4 rounded-xl border border-line bg-panel/20 flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate/50">Read</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-blue">{readCount}</span>
              <CheckCircle className="w-4 h-4 text-blue shrink-0" />
            </div>
          </div>
          <div className="p-4 rounded-xl border border-line bg-panel/20 flex flex-col justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate/50">Replied</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-[#10b981]">{repliedCount}</span>
              <MessageSquare className="w-4 h-4 text-[#10b981] shrink-0" />
            </div>
          </div>
        </div>

        {/* Filters and Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {/* Status Selectors */}
          <div className="flex border border-line rounded bg-panel/20 font-mono text-[10px] p-0.5 overflow-x-auto shrink-0">
            {['all', 'unread', 'read', 'replied'].map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded transition-all uppercase ${filter === f ? 'bg-blue text-white font-bold' : 'text-slate hover:text-ink'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#0d121f] border border-line rounded px-3 py-2 pl-9 text-xs text-ink placeholder-slate/40 focus:border-blue outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate/40 absolute left-3 top-2.5" />
          </div>

          {/* Refresh action */}
          <button
            onClick={fetchMessages}
            disabled={loading}
            className="flex items-center justify-center p-2 border border-line rounded bg-panel/10 text-slate hover:text-ink hover:border-ink transition-colors disabled:opacity-50"
            title="Refresh Messages"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="flex-grow border border-line rounded-xl bg-panel/5 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-grow flex flex-col items-center justify-center py-20 font-mono text-xs">
              <svg className="animate-spin h-5 w-5 text-blue mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Fetching secure messages...</span>
            </div>
          ) : error ? (
            <div className="flex-grow flex items-center justify-center p-6 text-center text-xs font-mono text-amber">
              ⚠️ {error}
            </div>
          ) : currentItems.length === 0 ? (
            <div className="flex-grow flex items-center justify-center py-20 font-mono text-xs text-slate/50">
              No messages found.
            </div>
          ) : (
            <div className="flex-grow overflow-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="border-b border-line bg-panel/15 font-mono text-[9px] uppercase tracking-wider text-slate/60">
                    <th className="p-4 w-[160px]">From</th>
                    <th className="p-4 w-[200px]">Email</th>
                    <th className="p-4">Message</th>
                    <th className="p-4 w-[130px]">Metadata</th>
                    <th className="p-4 w-[150px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/30">
                  {currentItems.map((m) => (
                    <tr 
                      key={m._id} 
                      className={`hover:bg-panel/10 transition-colors ${!m.isRead ? 'bg-blue/5 border-l-2 border-l-blue' : ''}`}
                    >
                      {/* Name / Date */}
                      <td className="p-4 align-top">
                        <div className="font-bold text-ink">{m.name}</div>
                        <div className="text-[10px] text-slate/50 mt-1 font-mono">
                          {new Date(m.createdAt).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 align-top font-mono text-[11px]">
                        <a href={`mailto:${m.email}`} className="text-slate hover:text-blue hover:underline">
                          {m.email}
                        </a>
                      </td>

                      {/* Message Content */}
                      <td className="p-4 align-top">
                        <p className="whitespace-pre-wrap leading-relaxed text-slate break-all max-w-[400px]">
                          {m.message}
                        </p>
                      </td>

                      {/* IP / User Agent */}
                      <td className="p-4 align-top font-mono text-[10px] space-y-1 text-slate/50">
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate/40" />
                          <span>{m.ipAddress || 'unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1 truncate max-w-[120px]" title={m.userAgent}>
                          <Monitor className="w-3 h-3 text-slate/40" />
                          <span>{m.userAgent || 'unknown'}</span>
                        </div>
                      </td>

                      {/* Toggle / Delete Actions */}
                      <td className="p-4 align-top text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleRead(m._id)}
                          className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                            m.isRead 
                              ? 'border-line hover:text-blue hover:border-blue' 
                              : 'bg-blue/10 border-blue/30 text-blue font-bold hover:bg-blue hover:text-white'
                          }`}
                        >
                          {m.isRead ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          onClick={() => handleToggleReplied(m._id)}
                          className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                            m.replySent 
                              ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981] font-bold' 
                              : 'border-line hover:text-[#10b981] hover:border-[#10b981]'
                          }`}
                        >
                          {m.replySent ? 'Replied' : 'Mark Reply'}
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="p-1 border border-line text-slate hover:text-red-500 hover:border-red-500 rounded transition-colors inline-flex items-center justify-center align-middle"
                          title="Delete Message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-line bg-panel/5 flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate/60">
                Page {currentPage} of {totalPages} ({filteredMessages.length} total)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 border border-line rounded hover:bg-panel/20 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 border border-line rounded hover:bg-panel/20 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
