import React from 'react';
import { Users, UserCheck, CalendarClock, Clock } from 'lucide-react';
import { Visitor } from '../../types';

interface StatCardsProps {
  visitors: Visitor[];
}

export const StatCards: React.FC<StatCardsProps> = ({ visitors }) => {
  const total = visitors.length;
  const checkedIn = visitors.filter((v) => v.status === 'checked_in').length;
  const expectedList = visitors.filter((v) => v.status === 'expected');
  const expected = expectedList.length;
  const checkedOut = visitors.filter((v) => v.status === 'checked_out').length;

  const nextExpectedTime = expectedList.length > 0 
    ? expectedList[0].expectedTime 
    : null;

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs divide-y sm:divide-y-0 sm:divide-x divide-slate-100 grid grid-cols-2 lg:grid-cols-4">
      {/* 1. Currently On Premises */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            On Premises
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {checkedIn}
          </span>
          <span className="text-xs text-slate-500">active badges</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <UserCheck className="w-3 h-3 text-slate-400" />
          <span>{checkedIn > 0 ? `${checkedIn} checked-in guests` : 'No guests currently on site'}</span>
        </div>
      </div>

      {/* 2. Total Visitors Today */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Manifest
          </span>
          <span className="text-xs text-slate-400 font-mono">Today</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {total}
          </span>
          <span className="text-xs text-slate-500">registered guests</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <Users className="w-3 h-3 text-slate-400" />
          <span>{total > 0 ? `${total} logs recorded today` : 'No visits recorded yet'}</span>
        </div>
      </div>

      {/* 3. Expected Arrivals */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Expected Today
          </span>
          <span className="text-xs text-amber-600 font-medium">Pending</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {expected}
          </span>
          <span className="text-xs text-slate-500">scheduled</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <CalendarClock className="w-3 h-3 text-slate-400" />
          <span>{nextExpectedTime ? `Next expected: ${nextExpectedTime}` : 'No pending arrivals'}</span>
        </div>
      </div>

      {/* 4. Completed & Departed */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Completed Visits
          </span>
          <span className="text-xs text-slate-400 font-mono">Archived</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {checkedOut}
          </span>
          <span className="text-xs text-slate-500">badges returned</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{checkedOut > 0 ? `${checkedOut} departures logged` : 'No departures logged yet'}</span>
        </div>
      </div>
    </div>
  );
};
