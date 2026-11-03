import React, { useState, useEffect } from 'react';
import { VisitorView } from './components/VisitorRegistration/VisitorView';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import { AdminLoginPage } from './components/AdminDashboard/AdminLoginPage';
import { Customer } from './types';
import { getStoredCustomers } from './utils/storage';

export type AppRoute = 'visitor' | 'admin';

const checkIsAdminRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return path.startsWith('/admin') || hash.startsWith('#/admin') || hash.startsWith('#admin');
};

export const App: React.FC = () => {
  const [visitors, setVisitors] = useState<Customer[]>([]);
  const [route, setRoute] = useState<AppRoute>(() => (checkIsAdminRoute() ? 'admin' : 'visitor'));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return (
      localStorage.getItem('admin_authenticated') === 'true' ||
      sessionStorage.getItem('admin_authenticated') === 'true'
    );
  });

  // Keep route synced with browser address bar (back/forward, direct link, hash)
  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(checkIsAdminRoute() ? 'admin' : 'visitor');
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    const loaded = getStoredCustomers();
    setVisitors(loaded);
  }, []);

  const navigateTo = (path: string) => {
    try {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    } catch {
      // Fallback to hash if history API fails in restricted environments
      window.location.hash = path;
    }
    setRoute(path.startsWith('/admin') ? 'admin' : 'visitor');
  };

  const handleVisitorRegistered = (newCustomer: Customer) => {
    setVisitors((prev) => [newCustomer, ...prev]);
  };

  const handleVisitorsUpdated = (updated: Customer[]) => {
    setVisitors(updated);
  };

  const handleLoginSuccess = (rememberMe: boolean) => {
    setIsAdminAuthenticated(true);
    if (rememberMe) {
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      sessionStorage.setItem('admin_authenticated', 'true');
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_authenticated');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {route === 'admin' ? (
        isAdminAuthenticated ? (
          <AdminDashboard
            visitors={visitors}
            onVisitorsUpdated={handleVisitorsUpdated}
            onSwitchToKiosk={() => navigateTo('/')}
            onLogout={handleLogout}
          />
        ) : (
          <AdminLoginPage
            onLoginSuccess={handleLoginSuccess}
            onBackToKiosk={() => navigateTo('/')}
          />
        )
      ) : (
        <VisitorView
          onVisitorRegistered={handleVisitorRegistered}
          totalCustomersCount={visitors.length}
        />
      )}
    </div>
  );
};

export default App;
