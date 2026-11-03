import React from 'react';
import { 
  Users, 
  UserPlus, 
  Building2, 
  BarChart3, 
  Settings, 
  Radio,
  FileSpreadsheet,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  checkedInCount?: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Customer Directory', icon: Users },
    { id: 'recent', label: 'Recent Inquiries', icon: UserPlus },
    { id: 'companies', label: 'Company Leads', icon: Building2 },
    { id: 'reports', label: 'Export & Reports', icon: FileSpreadsheet },
    { id: 'analytics', label: 'Customer Analytics', icon: BarChart3 },
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
              CD
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                CustomerDesk <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">Hub</span>
              </div>
              <div className="text-[11px] text-slate-400">Customer Details Management</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Customer Records
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
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

          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 mt-6 mb-2">
            Tools & Administration
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
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

        {/* System Status Widget */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Customer Form Active</span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>Mobile QR & Kiosk Ready</span>
            <span className="text-emerald-400 font-medium">Online</span>
          </div>
        </div>

        {/* User profile footer with Logout */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-white">
              AD
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-slate-200 truncate">Admin Desk</div>
              <div className="text-[11px] text-slate-400 truncate">Customer Relations</div>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
