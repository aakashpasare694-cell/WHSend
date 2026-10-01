import React from 'react';
import { LayoutDashboard, BookOpen, Smartphone, ShieldCheck } from 'lucide-react';
import { WHSendLogo } from './WHSendLogo';

interface SidebarProps {
  activeTab: 'dashboard' | 'channels' | 'docs';
  setActiveTab: (tab: 'dashboard' | 'channels' | 'docs') => void;
  connectedCount: number;
  totalCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  connectedCount,
  totalCount,
}) => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-full shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <WHSendLogo size="md" showText={true} showBadge={true} />
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'channels'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4" />
              Channels
            </div>
            {totalCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {connectedCount}/{totalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'docs'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            API Documentation
          </button>
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 m-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <span className={`w-2 h-2 rounded-full ${connectedCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            Engine Status
          </span>
          <span className="text-slate-300 font-semibold">{connectedCount > 0 ? 'Active' : 'Standby'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-800/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local Session Storage Enabled</span>
        </div>
      </div>
    </aside>
  );
};
