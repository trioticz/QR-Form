import React, { useState } from 'react';
import { 
  Visitor, 
  VisitorStatus 
} from '../../types';
import { 
  LogOut, 
  LogIn, 
  QrCode, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  User 
} from 'lucide-react';

interface VisitorTableProps {
  visitors: Visitor[];
  onStatusChange: (id: string, newStatus: VisitorStatus) => void;
  onSelectVisitor: (visitor: Visitor) => void;
  searchTerm: string;
}

export const VisitorTable: React.FC<VisitorTableProps> = ({
  visitors,
  onStatusChange,
  onSelectVisitor,
  searchTerm,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | VisitorStatus>('all');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7;

  // Filter logic
  const filtered = visitors.filter((v) => {
    // Search match
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      v.fullName.toLowerCase().includes(q) ||
      v.company.toLowerCase().includes(q) ||
      v.hostName.toLowerCase().includes(q) ||
      v.badgeNumber.toLowerCase().includes(q) ||
      v.id.toLowerCase().includes(q);

    // Status filter
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;

    // Purpose filter
    const matchesPurpose = purposeFilter === 'all' || v.purpose === purposeFilter;

    return matchesSearch && matchesStatus && matchesPurpose;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedVisitors = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusBadge = (status: VisitorStatus) => {
    switch (status) {
      case 'checked_in':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Checked In
          </span>
        );
      case 'expected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Expected
          </span>
        );
      case 'checked_out':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Departed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Table Controls / Filter Toolbar */}
      <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({visitors.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('checked_in');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              statusFilter === 'checked_in'
                ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Checked In ({visitors.filter((v) => v.status === 'checked_in').length})
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('expected');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              statusFilter === 'expected'
                ? 'bg-white text-amber-800 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expected ({visitors.filter((v) => v.status === 'expected').length})
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('checked_out');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              statusFilter === 'checked_out'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Departed ({visitors.filter((v) => v.status === 'checked_out').length})
          </button>
        </div>

        {/* Purpose Filter & Count summary */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={purposeFilter}
              onChange={(e) => {
                setPurposeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md py-1.5 pl-2 pr-7 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">All Visit Purposes</option>
              <option value="Client Meeting">Client Meeting</option>
              <option value="Interview">Job Interview</option>
              <option value="Vendor & Contractor">Vendor & Contractor</option>
              <option value="Consulting">Consulting & Advisory</option>
              <option value="Board & Executive">Board & Executive</option>
              <option value="Personal Visit">Personal Visit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Semantic Table Wrapper adhering to modern-web-guidance */}
      <div 
        tabIndex={0} 
        role="region" 
        aria-labelledby="visitor-table-caption" 
        className="overflow-x-auto max-w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <table className="w-full text-left border-collapse">
          <caption id="visitor-table-caption" className="sr-only">
            Active building visitors and daily registration manifest
          </caption>
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider sticky top-0 z-10">
            <tr>
              <th scope="col" className="py-3 px-4 sm:px-6">Visitor & Company</th>
              <th scope="col" className="py-3 px-4">Badge / ID</th>
              <th scope="col" className="py-3 px-4">Host Employee</th>
              <th scope="col" className="py-3 px-4">Purpose</th>
              <th scope="col" className="py-3 px-4">Time & Check-In</th>
              <th scope="col" className="py-3 px-4">Status</th>
              <th scope="col" className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedVisitors.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-14 text-center text-slate-500">
                  <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <div className="font-semibold text-slate-700 text-sm">
                    {visitors.length === 0
                      ? 'No visitor check-ins recorded yet today'
                      : 'No visitors matching your filter'}
                  </div>
                  <div className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                    {visitors.length === 0
                      ? 'New guest registrations submitted at the visitor kiosk or pre-registered by security will appear here instantly.'
                      : 'Try clearing your search query or switching the status filter tab.'}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedVisitors.map((visitor) => (
                <tr 
                  key={visitor.id} 
                  className="hover:bg-slate-50/70 transition-colors group cursor-default"
                >
                  {/* Visitor name & company */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                        {visitor.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => onSelectVisitor(visitor)}
                          className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left"
                        >
                          {visitor.fullName}
                        </button>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {visitor.company} • {visitor.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Badge */}
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                      {visitor.badgeNumber}
                    </span>
                  </td>

                  {/* Host */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{visitor.hostName}</div>
                    <div className="text-[11px] text-slate-500">{visitor.hostDepartment}</div>
                  </td>

                  {/* Purpose */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded">
                      {visitor.purpose}
                    </span>
                  </td>

                  {/* Time & Check in */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="font-medium text-slate-800">
                      {visitor.checkInTime || visitor.expectedTime}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {visitor.status === 'checked_in' ? 'Checked in' : visitor.status === 'expected' ? 'Expected today' : 'Checked out'}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {getStatusBadge(visitor.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Quick check-in / check-out button */}
                      {visitor.status === 'expected' && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(visitor.id, 'checked_in')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
                        >
                          <LogIn className="w-3 h-3" />
                          <span>Check In</span>
                        </button>
                      )}

                      {visitor.status === 'checked_in' && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(visitor.id, 'checked_out')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
                        >
                          <LogOut className="w-3 h-3 text-slate-500" />
                          <span>Check Out</span>
                        </button>
                      )}

                      {/* View Pass / Badge */}
                      <button
                        type="button"
                        onClick={() => onSelectVisitor(visitor)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Visitor Pass & QR"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 bg-white">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-900">
            {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-900">
            {Math.min(currentPage * pageSize, filtered.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-900">{filtered.length}</span> visitors
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-medium text-slate-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
