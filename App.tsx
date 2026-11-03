import React, { useState, useEffect } from 'react';
import { VisitorView } from './components/VisitorRegistration/VisitorView';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import { AdminLoginModal } from './components/AdminDashboard/AdminLoginModal';
import { Customer } from './types';
import { getStoredCustomers } from './utils/storage';

export type AppViewMode = 'visitor' | 'admin';

export const App: React.FC = () => {
  const [visitors, setVisitors] = useState<Customer[]>([]);
  const [viewMode, setViewMode] = useState<AppViewMode>('visitor');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem('admin_authenticated') === 'true' ||
      sessionStorage.getItem('admin_authenticated') === 'true'
    );
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

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

  const handleSwitchToAdmin = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (rememberMe: boolean) => {
    setIsAdminAuthenticated(true);
    if (rememberMe) {
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      sessionStorage.setItem('admin_authenticated', 'true');
    }
    setIsLoginModalOpen(false);
    setViewMode('admin');
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_authenticated');
    setViewMode('visitor');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {viewMode === 'visitor' ? (
        <VisitorView
          onVisitorRegistered={handleVisitorRegistered}
          onSwitchToAdmin={handleSwitchToAdmin}
          totalCustomersCount={visitors.length}
          isAdminAuthenticated={isAdminAuthenticated}
        />
      ) : (
        <AdminDashboard
          visitors={visitors}
          onVisitorsUpdated={handleVisitorsUpdated}
          onSwitchToKiosk={() => setViewMode('visitor')}
          onLogout={handleLogout}
        />
      )}

      {/* Admin Authentication Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
