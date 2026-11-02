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
  Building2
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
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Filter logic
  const filtered = visitors.filter((v) => {
    // Search match
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      v.fullName.toLowerCase().includes(q) ||
      (v.company && v.company.toLowerCase().includes(q)) ||
      (v.phone && v.phone.toLowerCase().includes(q)) ||
      (v.email && v.email.toLowerCase().includes(q)) ||
      (v.city && v.city.toLowerCase().includes(q)) ||
      (v.id && v.id.toLowerCase().includes(q)) ||
      (v.notes && v.notes.toLowerCase().includes(q));

    // Date filter
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = v.registeredDate === todayStr || (v.registeredAt && v.registeredAt.startsWith(todayStr));
    } else if (dateFilter === 'week') {
      if (v.registeredDate) {
        const d = new Date(v.registeredDate);
        matchesDate = !isNaN(d.getTime()) && d >= sevenDaysAgo;
      }
    }

    // Purpose filter
    const matchesPurpose = purposeFilter === 'all' || v.purpose === purposeFilter;

    return matchesSearch && matchesDate && matchesPurpose;
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
            All Customers ({visitors.length})
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
            Registered Today ({visitors.filter((v) => v.registeredDate === todayStr || v.registeredAt?.startsWith(todayStr)).length})
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

        {/* Purpose Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={purposeFilter}
              onChange={(e) => {
                setPurposeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md py-1.5 pl-2 pr-7 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">All Inquiry Categories</option>
              <option value="Product Inquiry">Product Inquiry</option>
              <option value="Sales & Purchase">Sales & Purchase</option>
              <option value="Client Meeting">Client Meeting</option>
              <option value="Service & Support">Service & Support</option>
              <option value="Consultation">Consultation</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>
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
              <th scope="col" className="py-3 px-4 sm:px-6">Customer & Contact</th>
              <th scope="col" className="py-3 px-4">Customer ID</th>
              <th scope="col" className="py-3 px-4">Company / Location</th>
              <th scope="col" className="py-3 px-4">Inquiry Category</th>
              <th scope="col" className="py-3 px-4">Registration Date & Time</th>
              <th scope="col" className="py-3 px-4">Notes / Requirement</th>
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
                      ? 'No customer details collected yet'
                      : 'No customer matching your search or filter'}
                  </div>
                  <div className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                    {visitors.length === 0
                      ? 'New customer details entered via the customer kiosk, mobile QR scan, or added manually will appear here.'
                      : 'Try clearing your search query or reset the date filter.'}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedVisitors.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="hover:bg-slate-50/70 transition-colors group cursor-default"
                >
                  {/* Customer name & phone */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200/70 flex items-center justify-center font-bold text-xs text-blue-700 shrink-0">
                        {customer.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => onSelectVisitor(customer)}
                          className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left cursor-pointer"
                        >
                          {customer.fullName}
                        </button>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <a href={`tel:${customer.phone}`} className="hover:text-blue-600 hover:underline">
                            {customer.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Customer ID */}
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                      {customer.id}
                    </span>
                  </td>

                  {/* Company & City */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{customer.company || 'Individual'}</span>
                    </div>
                    {customer.city && (
                      <div className="text-[11px] text-slate-500">{customer.city}</div>
                    )}
                  </td>

                  {/* Purpose */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60 rounded">
                      {customer.purpose}
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="font-medium text-slate-800 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{customer.registeredAt}</span>
                    </div>
                  </td>

                  {/* Notes / Requirement */}
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">
                    {customer.notes ? (
                      <span title={customer.notes} className="line-clamp-1">
                        {customer.notes}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Details */}
                      <button
                        type="button"
                        onClick={() => onSelectVisitor(customer)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        title="View Customer Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Direct Phone Call */}
                      {customer.phone && (
                        <a
                          href={`tel:${customer.phone}`}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          title={`Call ${customer.phone}`}
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}

                      {/* Direct Email */}
                      {customer.email && (
                        <a
                          href={`mailto:${customer.email}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title={`Email ${customer.email}`}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}

                      {/* Delete */}
                      {onDeleteCustomer && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete customer record for "${customer.fullName}"?`)) {
                              onDeleteCustomer(customer.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
          of <span className="font-semibold text-slate-900">{filtered.length}</span> customers
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
