import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StatCards } from './StatCards';
import { VisitorTable } from './VisitorTable';
import { VisitorDetailModal } from './VisitorDetailModal';
import { PreRegisterModal } from './PreRegisterModal';
import { Customer } from '../../types';
import { saveCustomer, deleteCustomer, clearAllCustomers } from '../../utils/storage';

interface AdminDashboardProps {
  visitors: Customer[];
  onVisitorsUpdated: (visitors: Customer[]) => void;
  onSwitchToKiosk: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  visitors,
  onVisitorsUpdated,
  onSwitchToKiosk,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVisitor, setSelectedVisitor] = useState<Customer | null>(null);
  const [isPreRegisterOpen, setIsPreRegisterOpen] = useState<boolean>(false);

  const handlePreRegisterSave = (newCustomer: Customer) => {
    const updated = saveCustomer(newCustomer);
    onVisitorsUpdated(updated);
  };

  const handleDeleteCustomer = (id: string) => {
    const updated = deleteCustomer(id);
    onVisitorsUpdated(updated);
    if (selectedVisitor && selectedVisitor.id === id) {
      setSelectedVisitor(null);
    }
  };

  const handleClearManifest = () => {
    if (window.confirm('Are you sure you want to clear all customer records?')) {
      const cleared = clearAllCustomers();
      onVisitorsUpdated(cleared);
      setSelectedVisitor(null);
    }
  };

  const handleExportCSV = () => {
    if (visitors.length === 0) {
      alert('No customer records to export.');
      return;
    }
    const headers = [
      'Customer ID',
      'Full Name',
      'Phone Number',
      'Email Address',
      'Company / Business',
      'City / Location',
      'Inquiry Category',
      'Registration Date & Time',
      'Notes / Requirement',
    ];

    const rows = visitors.map((v) => [
      v.id,
      `"${(v.fullName || '').replace(/"/g, '""')}"`,
      `"${(v.phone || '').replace(/"/g, '""')}"`,
      `"${(v.email || '').replace(/"/g, '""')}"`,
      `"${(v.company || '').replace(/"/g, '""')}"`,
      `"${(v.city || '').replace(/"/g, '""')}"`,
      `"${(v.purpose || '').replace(/"/g, '""')}"`,
      `"${(v.registeredAt || '').replace(/"/g, '""')}"`,
      `"${(v.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customer_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenPreRegister={() => setIsPreRegisterOpen(true)}
          onExportCSV={handleExportCSV}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={() => {
            onVisitorsUpdated([...visitors]);
          }}
          onSwitchToKiosk={onSwitchToKiosk}
          onClearManifest={handleClearManifest}
          totalVisitors={visitors.length}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Page Title & Context Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Customer Information Directory
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Centralized registry of collected customer contact details, inquiries, and requirements.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Sync Active</span>
            </div>
          </div>

          {/* Customer Metric Cards */}
          <StatCards visitors={visitors} />

          {/* Customer Data Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                All Customer Records & Inquiries
              </h2>
              <span className="text-xs text-slate-500">
                Sorted by most recent entries
              </span>
            </div>

            <VisitorTable
              visitors={visitors}
              onSelectVisitor={(v) => setSelectedVisitor(v)}
              onDeleteCustomer={handleDeleteCustomer}
              searchTerm={searchTerm}
            />
          </div>
        </main>
      </div>

      {/* Customer Detail Modal */}
      <VisitorDetailModal
        visitor={selectedVisitor}
        onClose={() => setSelectedVisitor(null)}
      />

      {/* Add Customer Modal */}
      <PreRegisterModal
        isOpen={isPreRegisterOpen}
        onClose={() => setIsPreRegisterOpen(false)}
        onSave={handlePreRegisterSave}
      />
    </div>
  );
};
