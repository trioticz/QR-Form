import React from 'react';
import { Users, UserPlus, Calendar, Building2 } from 'lucide-react';
import { Customer } from '../../types';

interface StatCardsProps {
  visitors: Customer[];
}

export const StatCards: React.FC<StatCardsProps> = ({ visitors }) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  
  // 7 days ago timestamp
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const total = visitors.length;

  const todayCount = visitors.filter((v) => {
    return v.registeredDate === todayStr || (v.registeredAt && v.registeredAt.startsWith(todayStr));
  }).length;

  const thisWeekCount = visitors.filter((v) => {
    if (!v.registeredDate) return false;
    const d = new Date(v.registeredDate);
    return !isNaN(d.getTime()) && d >= sevenDaysAgo;
  }).length;

  const uniqueOrganizations = new Set(
    visitors
      .map((v) => (v.organizationName || v.company || '').trim())
      .filter((c) => Boolean(c) && c.toLowerCase() !== 'individual' && c.toLowerCase() !== 'independent guest')
  ).size;

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs divide-y sm:divide-y-0 sm:divide-x divide-slate-100 grid grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Customers */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Customers
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            Records
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {total}
          </span>
          <span className="text-xs text-slate-500">registered</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span>{total > 0 ? `${total} customer profiles recorded` : 'No customers recorded yet'}</span>
        </div>
      </div>

      {/* 2. Registered Today */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Registered Today
          </span>
          <span className="text-xs text-emerald-600 font-semibold font-mono">Today</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {todayCount}
          </span>
          <span className="text-xs text-slate-500">entries today</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
          <span>{todayCount > 0 ? `${todayCount} customer entries today` : 'No entries yet today'}</span>
        </div>
      </div>

      {/* 3. This Week */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Past 7 Days
          </span>
          <span className="text-xs text-slate-400 font-mono">Weekly</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {thisWeekCount}
          </span>
          <span className="text-xs text-slate-500">this week</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Recent customer activity</span>
        </div>
      </div>

      {/* 4. Companies / Businesses */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Organizations
          </span>
          <span className="text-xs text-slate-400 font-mono">B2B & B2C</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {uniqueOrganizations}
          </span>
          <span className="text-xs text-slate-500">organisations</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>{uniqueOrganizations > 0 ? `${uniqueOrganizations} organisations recorded` : 'Direct entries'}</span>
        </div>
      </div>
    </div>
  );
};
