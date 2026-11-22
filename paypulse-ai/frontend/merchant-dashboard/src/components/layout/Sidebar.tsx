import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, Shield, RefreshCw,
  BarChart3, Code2, Settings, Zap, ChevronLeft, ChevronRight,
  Activity, X,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',          icon: LayoutDashboard, label: 'Overview'         },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions'   },
  { to: '/routing',   icon: Zap,             label: 'Smart Routing'    },
  { to: '/fraud',     icon: Shield,          label: 'Fraud Monitoring' },
  { to: '/recovery',  icon: RefreshCw,       label: 'Payment Recovery' },
  { to: '/analytics', icon: BarChart3,       label: 'Analytics'        },
  { to: '/developer', icon: Code2,           label: 'Developer Portal' },
  { to: '/settings',  icon: Settings,        label: 'Settings'         },
];

interface SidebarProps {
  /** Desktop: icon-only collapsed mode */
  collapsed: boolean;
  onToggle: () => void;
  /** Mobile: full slide-in drawer */
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();

  const navContent = (isMobile: boolean) => (
    <>
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-slate-800 flex-shrink-0 ${
        !isMobile && collapsed ? 'justify-center' : 'gap-3'
      }`}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
          <Activity className="w-4 h-4 text-white" />
        </div>
        {(isMobile || !collapsed) && (
          <div className="min-w-0 flex-1">
            <span className="font-bold text-white text-sm tracking-tight">PayPulse</span>
            <span className="font-bold text-blue-400 text-sm tracking-tight"> AI</span>
          </div>
        )}
        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={onMobileClose}
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {(isMobile || !collapsed) && (
          <p className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Platform
          </p>
        )}
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              title={!isMobile && collapsed ? label : undefined}
              onClick={isMobile ? onMobileClose : undefined}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'} ${
                !isMobile && collapsed ? 'justify-center' : ''
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {(isMobile || !collapsed) && <span className="truncate">{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle — desktop only */}
      {!isMobile && (
        <div className="p-2 border-t border-slate-800 flex-shrink-0">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Version badge */}
      {(isMobile || !collapsed) && (
        <div className="px-4 pb-4 flex-shrink-0">
          <div className="rounded-lg bg-slate-800 p-3">
            <p className="text-xs text-slate-400 font-medium">PayPulse AI v0.1.0</p>
            <p className="text-xs text-slate-500 mt-0.5">Demo Environment</p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar (always mounted, collapsible) ───────── */}
      <aside
        className={`
          hidden lg:flex flex-col
          fixed inset-y-0 left-0 z-30 bg-slate-900 border-r border-slate-800
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {navContent(false)}
      </aside>

      {/* ── Mobile sidebar (slide-in drawer) ───────────────────── */}
      <aside
        className={`
          lg:hidden flex flex-col
          fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 border-r border-slate-800
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation menu"
      >
        {navContent(true)}
      </aside>
    </>
  );
}
