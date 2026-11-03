import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  UserPlus, 
  Download, 
  Clock, 
  RefreshCw,
  ExternalLink,
  Trash2,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenPreRegister: () => void;
  onExportCSV: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRefresh: () => void;
  onSwitchToKiosk: () => void;
  onClearManifest: () => void;
  totalVisitors: number;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenPreRegister,
  onExportCSV,
  searchTerm,
  setSearchTerm,
  onRefresh,
  onSwitchToKiosk,
  onClearManifest,
  totalVisitors,
  onLogout,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-2xs">
      {/* Left: Mobile hamburger + breadcrumb / context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>CustomerDesk</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Customer Records Directory</span>
          </div>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer name, phone, email, company, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Clock, Switch to Form */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Clock */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 border-r border-slate-200 pr-3">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono font-medium text-slate-700">{currentTime}</span>
          <span className="text-slate-400">•</span>
          <span>{currentDate}</span>
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Clear Records */}
        {totalVisitors > 0 && (
          <button
            type="button"
            onClick={onClearManifest}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            title="Clear all customer records"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Clear All</span>
          </button>
        )}

        {/* Export CSV */}
        <button
          type="button"
          onClick={onExportCSV}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>

        {/* Add Customer Action Button */}
        <button
          type="button"
          onClick={onOpenPreRegister}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md transition-colors shadow-xs cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Add Customer</span>
        </button>

        {/* Switch to Customer Form Button */}
        <button
          type="button"
          onClick={onSwitchToKiosk}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors cursor-pointer"
          title="Open Customer Registration Form"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Customer Form</span>
        </button>

        {/* Logout Action Button */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 rounded-md transition-colors cursor-pointer"
            title="Log out of Admin Console"
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
};
