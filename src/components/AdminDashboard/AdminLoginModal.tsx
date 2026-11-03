import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle, X, Shield, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (rememberMe: boolean) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    // Retrieve any custom password saved in localStorage or use standard defaults
    const customPassword = localStorage.getItem('custom_admin_password');
    const validPasswords = ['admin', 'admin123', 'triopneumax', 'triopneumax123'];
    if (customPassword) {
      validPasswords.push(customPassword);
    }

    const validUsers = ['admin', 'admin@triopneumax.com', 'trioticz', 'developer.trioticz@gmail.com'];

    setTimeout(() => {
      setIsLoading(false);

      const isValidUser = validUsers.includes(cleanUser) || cleanUser === 'admin';
      const isValidPass = validPasswords.includes(cleanPass);

      if (isValidUser && isValidPass) {
        onLoginSuccess(rememberMe);
        setUsername('');
        setPassword('');
        setErrorMessage(null);
      } else {
        setErrorMessage('Invalid username or password. Default is admin / admin123');
      }
    }, 300);
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 id="admin-login-title" className="text-base font-bold text-white tracking-tight">
                Admin Console Login
              </h3>
              <p className="text-[11px] text-slate-400">Customer Records Management</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
            aria-label="Close login modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div>
              <label htmlFor="adminUsername" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="adminUsername"
                  autoComplete="username"
                  required
                  placeholder="admin or admin@triopneumax.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="adminPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="adminPassword"
                  autoComplete="current-password"
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Auto-fill helper */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleFillDemo}
                className="text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Auto-fill credentials
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Helper box */}
          <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 text-center">
            Default credentials: <strong className="text-slate-800">admin</strong> / <strong className="text-slate-800">admin123</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
