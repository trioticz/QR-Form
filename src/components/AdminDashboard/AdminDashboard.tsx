import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StatCards } from './StatCards';
import { VisitorTable } from './VisitorTable';
import { VisitorDetailModal } from './VisitorDetailModal';
import { PreRegisterModal } from './PreRegisterModal';
import { Visitor, VisitorStatus } from '../../types';
import { saveVisitor, updateVisitorStatus, clearAllVisitors } from '../../utils/storage';

interface AdminDashboardProps {
  visitors: Visitor[];
  onVisitorsUpdated: (visitors: Visitor[]) => void;
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
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isPreRegisterOpen, setIsPreRegisterOpen] = useState<boolean>(false);

  const checkedInCount = visitors.filter((v) => v.status === 'checked_in').length;

  const handleStatusChange = (id: string, newStatus: VisitorStatus) => {
    const updated = updateVisitorStatus(id, newStatus);
    onVisitorsUpdated(updated);
    if (selectedVisitor && selectedVisitor.id === id) {
      const refreshedSelected = updated.find((v) => v.id === id) || null;
      setSelectedVisitor(refreshedSelected);
    }
  };

  const handlePreRegisterSave = (newVisitor: Visitor) => {
    const updated = saveVisitor(newVisitor);
    onVisitorsUpdated(updated);
  };

  const handleClearManifest = () => {
    if (window.confirm('Clear all visitor records from the manifest?')) {
      const cleared = clearAllVisitors();
      onVisitorsUpdated(cleared);
      setSelectedVisitor(null);
    }
  };

  const handleExportCSV = () => {
    if (visitors.length === 0) {
      alert('No visitor records to export.');
      return;
    }
    const headers = [
      'ID',
      'Badge',
      'Full Name',
      'Email',
      'Phone',
      'Company',
      'Host Name',
      'Host Department',
      'Purpose',
      'Location',
      'Expected Date',
      'Expected Time',
      'Check In Time',
      'Check Out Time',
      'Status',
    ];

    const rows = visitors.map((v) => [
      v.id,
      v.badgeNumber,
      `"${v.fullName.replace(/"/g, '""')}"`,
      v.email,
      v.phone,
      `"${v.company.replace(/"/g, '""')}"`,
      `"${v.hostName.replace(/"/g, '""')}"`,
      `"${v.hostDepartment.replace(/"/g, '""')}"`,
      `"${v.purpose}"`,
      `"${v.location}"`,
      v.expectedDate,
      v.expectedTime,
      v.checkInTime || '',
      v.checkOutTime || '',
      v.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aurapass_manifest_${new Date().toISOString().slice(0, 10)}.csv`);
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
        checkedInCount={checkedInCount}
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
                Visitor Access Command Center
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Real-time security manifest, automated check-in verification, and guest occupancy logs.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Sync Active</span>
            </div>
          </div>

          {/* Key Metric Cards */}
          <StatCards visitors={visitors} />

          {/* Main Visitor Data Table & Controls */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Current Manifest & Check-In Log
              </h2>
              <span className="text-xs text-slate-500">
                Sorted by most recent activity
              </span>
            </div>

            <VisitorTable
              visitors={visitors}
              onStatusChange={handleStatusChange}
              onSelectVisitor={(v) => setSelectedVisitor(v)}
              searchTerm={searchTerm}
            />
          </div>
        </main>
      </div>

      {/* Detail Slideover / Modal */}
      <VisitorDetailModal
        visitor={selectedVisitor}
        onClose={() => setSelectedVisitor(null)}
        onStatusChange={handleStatusChange}
      />

      {/* Pre-Register Modal */}
      <PreRegisterModal
        isOpen={isPreRegisterOpen}
        onClose={() => setIsPreRegisterOpen(false)}
        onSave={handlePreRegisterSave}
      />
    </div>
  );
};
