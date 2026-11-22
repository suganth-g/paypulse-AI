import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Desktop: collapsed = icon-only. Mobile: mobileOpen = slide-in drawer.
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDesktop = useCallback(() => setCollapsed(c => !c), []);
  const openMobile    = useCallback(() => setMobileOpen(true),  []);
  const closeMobile   = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={toggleDesktop}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />

      <Header
        sidebarCollapsed={collapsed}
        onMenuClick={openMobile}
      />

      {/* Main content — on mobile no left-padding (sidebar is a drawer overlay) */}
      <main
        className={`pt-16 min-h-screen transition-all duration-300 lg:${collapsed ? 'pl-16' : 'pl-64'}`}
      >
        <div className="p-4 sm:p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}

