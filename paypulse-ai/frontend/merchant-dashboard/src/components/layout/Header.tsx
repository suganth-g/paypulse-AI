import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, LogOut, HelpCircle, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const PAGE_TITLES: Record<string, { title: string; breadcrumb: string[] }> = {
  '/':            { title: 'Overview',         breadcrumb: ['Dashboard', 'Overview']          },
  '/transactions':{ title: 'Transactions',     breadcrumb: ['Dashboard', 'Transactions']      },
  '/routing':     { title: 'Smart Routing',    breadcrumb: ['Dashboard', 'Smart Routing']     },
  '/fraud':       { title: 'Fraud Monitoring', breadcrumb: ['Dashboard', 'Fraud Monitoring']  },
  '/recovery':    { title: 'Payment Recovery', breadcrumb: ['Dashboard', 'Payment Recovery']  },
  '/analytics':   { title: 'Analytics',        breadcrumb: ['Dashboard', 'Analytics']         },
  '/developer':   { title: 'Developer Portal', breadcrumb: ['Dashboard', 'Developer Portal']  },
  '/settings':    { title: 'Settings',         breadcrumb: ['Dashboard', 'Settings']          },
};

interface HeaderProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export default function Header({ sidebarCollapsed, onMenuClick }: HeaderProps) {
  const location = useLocation();
  const navigate  = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pageInfo = PAGE_TITLES[location.pathname] ?? PAGE_TITLES['/'];

  /** Navigate to Transactions with the query pre-filled via URL state */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate('/transactions', { state: { search: q } });
    setSearchQuery('');
  };

  return (
    <header className={`
      fixed top-0 right-0 z-20 h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4
      transition-all duration-300
      left-0
      lg:${sidebarCollapsed ? 'left-16' : 'left-64'}
    `}>
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title + breadcrumb */}
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-slate-900 leading-tight">{pageInfo.title}</h1>
        <nav className="hidden sm:flex items-center gap-1 mt-0.5">
          {pageInfo.breadcrumb.map((crumb, i) => (
            <React.Fragment key={crumb}>
              {i > 0 && <span className="text-slate-300 text-xs">/</span>}
              <span className={`text-xs ${i === pageInfo.breadcrumb.length - 1 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex-1" />

      {/* Global search — navigates to Transactions page with query */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center w-64 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search transactions..."
          className="input pl-9 pr-3 py-1.5 text-sm h-9"
          aria-label="Search transactions"
        />
      </form>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 card shadow-lg animate-fade-in z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              <p className="text-xs text-slate-400 mt-0.5">Demo — no real notifications</p>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { text: '2 new fraud alerts require review', time: '5m ago', dot: 'bg-red-500' },
                { text: 'Provider Beta latency spike detected', time: '15m ago', dot: 'bg-amber-500' },
                { text: 'Recovery engine resolved 3 transactions', time: '1h ago', dot: 'bg-emerald-500' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer">
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{n.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-slate-100">
              <span className="text-xs text-slate-400">Notification delivery not yet implemented</span>
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="User menu"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            M
          </div>
          <div className="hidden sm:block text-left min-w-0">
            <p className="text-xs font-semibold text-slate-900 leading-none">Merchant Demo</p>
            <p className="text-xs text-slate-400 mt-0.5">demo@paypulse.ai</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </button>
        {profileOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 card shadow-lg animate-fade-in z-50 overflow-hidden py-1">
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <User className="w-4 h-4 text-slate-400" /> Profile (placeholder)
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <HelpCircle className="w-4 h-4 text-slate-400" /> Help &amp; Docs
            </button>
            <div className="border-t border-slate-100 my-1" />
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Sign out (placeholder)
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

