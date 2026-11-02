import React, { useState, useEffect } from 'react';
import { VisitorView } from './components/VisitorRegistration/VisitorView';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import { Customer } from './types';
import { getStoredCustomers } from './utils/storage';

export type AppViewMode = 'visitor' | 'admin';

export const App: React.FC = () => {
  const [visitors, setVisitors] = useState<Customer[]>([]);
  const [viewMode, setViewMode] = useState<AppViewMode>('visitor');

  useEffect(() => {
    const loaded = getStoredCustomers();
    setVisitors(loaded);
  }, []);

  const handleVisitorRegistered = (newCustomer: Customer) => {
    setVisitors((prev) => [newCustomer, ...prev]);
  };

  const handleVisitorsUpdated = (updated: Customer[]) => {
    setVisitors(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {viewMode === 'visitor' ? (
        <VisitorView
          onVisitorRegistered={handleVisitorRegistered}
          onSwitchToAdmin={() => setViewMode('admin')}
          totalCustomersCount={visitors.length}
        />
      ) : (
        <AdminDashboard
          visitors={visitors}
          onVisitorsUpdated={handleVisitorsUpdated}
          onSwitchToKiosk={() => setViewMode('visitor')}
        />
      )}
    </div>
  );
};

export default App;
