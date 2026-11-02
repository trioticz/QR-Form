import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  Building2, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  ChevronDown,
  Radio
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  checkedInCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  checkedInCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Live Overview', icon: LayoutDashboard },
    { id: 'visitors', label: 'Visitor Manifest', icon: Users, badge: checkedInCount },
    { id: 'schedule', label: 'Pre-Registrations', icon: CalendarClock },
    { id: 'hosts', label: 'Staff & Hosts', icon: Building2 },
    { id: 'security', label: 'Security & NDA Logs', icon: ShieldCheck },
    { id: 'analytics', label: 'Traffic Reports', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden" 
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-sm">
              AP
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                AuraPass <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">Corp</span>
              </div>
              <div className="text-[11px] text-slate-400">Security Control Console</div>
            </div>
          </div>
        </div>

        {/* Facility Selector */}
        <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Current Facility
          </div>
          <button 
            type="button"
            className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-md border border-slate-700/60 transition-colors"
          >
            <span className="truncate">HQ — Global Tech Towers</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Operations
          </div>
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 mt-6 mb-2">
            Administration
          </div>
          {navItems.slice(4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Live System Status Widget */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Kiosk Fleet Active</span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>6 Kiosks Synced</span>
            <span className="text-emerald-400">100% Uptime</span>
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-white">
              MC
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-slate-200 truncate">Marcus Chen</div>
              <div className="text-[11px] text-slate-400 truncate">Security Officer #12</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
