import React, { useState } from 'react';
import { Customer } from '../../types';
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Phone, 
  Mail, 
  Eye, 
  Trash2,
  Calendar,
  Building2,
  Briefcase
} from 'lucide-react';

interface VisitorTableProps {
  visitors: Customer[];
  onStatusChange?: (id: string, newStatus: any) => void;
  onSelectVisitor: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
  searchTerm: string;
}

export const VisitorTable: React.FC<VisitorTableProps> = ({
  visitors,
  onSelectVisitor,
  onDeleteCustomer,
  searchTerm,
}) => {
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Filter logic
  const filtered = visitors.filter((v) => {
    const q = searchTerm.toLowerCase();
    const customerName = (v.name || v.fullName || '').toLowerCase();
    const customerPhone = (v.phone || '').toLowerCase();
    const customerEmail = (v.email || '').toLowerCase();
    const customerBusiness = (v.businessType || v.purpose || '').toLowerCase();
    const customerOrg = (v.organizationName || v.company || '').toLowerCase();
    const customerId = (v.id || '').toLowerCase();

    const matchesSearch =
      customerName.includes(q) ||
      customerPhone.includes(q) ||
      customerEmail.includes(q) ||
      customerBusiness.includes(q) ||
      customerOrg.includes(q) ||
      customerId.includes(q);

    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = v.registeredDate === todayStr || Boolean(v.registeredAt && v.registeredAt.startsWith(todayStr));
    } else if (dateFilter === 'week') {
      if (v.registeredDate) {
        const d = new Date(v.registeredDate);
        matchesDate = !isNaN(d.getTime()) && d >= sevenDaysAgo;
      }
    }

    return matchesSearch && matchesDate;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedVisitors = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Table Controls / Filter Toolbar */}
      <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
        {/* Time Period Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setDateFilter('all');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              dateFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({visitors.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setDateFilter('today');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              dateFilter === 'today'
                ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today ({visitors.filter((v) => v.registeredDate === todayStr || v.registeredAt?.startsWith(todayStr)).length})
          </button>
          <button
            type="button"
            onClick={() => {
              setDateFilter('week');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              dateFilter === 'week'
                ? 'bg-white text-blue-800 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 7 Days
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-semibold text-slate-900">{filtered.length}</span> records
        </div>
      </div>

      {/* Semantic Table */}
      <div 
        tabIndex={0} 
        role="region" 
        aria-label="Customer records directory" 
        className="overflow-x-auto max-w-full focus:outline-none"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider sticky top-0 z-10">
            <tr>
              <th scope="col" className="py-3 px-4 sm:px-6">Name & Phone</th>
              <th scope="col" className="py-3 px-4">Email</th>
              <th scope="col" className="py-3 px-4">Type of Business</th>
              <th scope="col" className="py-3 px-4">Organisation name</th>
              <th scope="col" className="py-3 px-4">Registration Date & Time</th>
              <th scope="col" className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedVisitors.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-14 text-center text-slate-500">
                  <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <div className="font-semibold text-slate-700 text-sm">
                    {visitors.length === 0
                      ? 'No customer records yet'
                      : 'No customer matching your search'}
                  </div>
                  <div className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                    {visitors.length === 0
                      ? 'Customer details submitted on the registration form will appear here instantly.'
                      : 'Try clearing your search query or reset the date filter.'}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedVisitors.map((customer) => {
                const displayName = customer.name || customer.fullName || 'Customer';
                const displayBusiness = customer.businessType || customer.purpose || '—';
                const displayOrg = customer.organizationName || customer.company || '';

                return (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-slate-50/70 transition-colors group cursor-default"
                  >
                    {/* 1. Name & Phone */}
                    <td className="py-3 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200/70 flex items-center justify-center font-bold text-xs text-blue-700 shrink-0">
                          {displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => onSelectVisitor(customer)}
                            className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left cursor-pointer"
                          >
                            {displayName}
                          </button>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <a href={`tel:${customer.phone}`} className="hover:text-blue-600 hover:underline font-mono">
                              {customer.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Email */}
                    <td className="py-3 px-4 text-slate-700">
                      {customer.email ? (
                        <a href={`mailto:${customer.email}`} className="hover:text-blue-600 hover:underline">
                          {customer.email}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>

                    {/* 3. Type of Business */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60 rounded">
                        <Briefcase className="w-3 h-3 text-blue-500" />
                        {displayBusiness}
                      </span>
                    </td>

                    {/* 4. Organisation name */}
                    <td className="py-3 px-4 text-slate-700">
                      {displayOrg ? (
                        <div className="font-medium text-slate-800 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{displayOrg}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>

                    {/* 5. Date & Time */}
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{customer.registeredAt}</span>
                      </div>
                    </td>

                    {/* 6. Actions */}
                    <td className="py-3 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectVisitor(customer)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {customer.phone && (
                          <a
                            href={`tel:${customer.phone}`}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title={`Call ${customer.phone}`}
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}

                        {customer.email && (
                          <a
                            href={`mailto:${customer.email}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title={`Email ${customer.email}`}
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}

                        {onDeleteCustomer && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete record for "${displayName}"?`)) {
                                onDeleteCustomer(customer.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
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
          of <span className="font-semibold text-slate-900">{filtered.length}</span> records
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
