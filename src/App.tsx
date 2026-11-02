import React, { useState, useEffect } from 'react';
import { VisitorView } from './components/VisitorRegistration/VisitorView';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import { Visitor } from './types';
import { getStoredVisitors } from './utils/storage';

export type AppViewMode = 'visitor' | 'admin';

export const App: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [viewMode, setViewMode] = useState<AppViewMode>('visitor');

  useEffect(() => {
    const loaded = getStoredVisitors();
    setVisitors(loaded);
  }, []);

  const handleVisitorRegistered = (newVisitor: Visitor) => {
    setVisitors((prev) => [newVisitor, ...prev]);
  };

  const handleVisitorsUpdated = (updated: Visitor[]) => {
    setVisitors(updated);
  };

  const checkedInCount = visitors.filter((v) => v.status === 'checked_in').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {viewMode === 'visitor' ? (
        <VisitorView
          onVisitorRegistered={handleVisitorRegistered}
          onSwitchToAdmin={() => setViewMode('admin')}
          checkedInCount={checkedInCount}
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
