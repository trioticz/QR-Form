import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Shield, ArrowRight, ArrowLeft } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: (rememberMe: boolean) => void;
  onBackToKiosk: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToKiosk,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      } else {
        setErrorMessage('Invalid credentials. Default: admin / admin123');
      }
    }, 300);
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.jpg" 
            alt="She Wins Logo" 
            className="w-10 h-10 rounded-full object-cover border border-pink-500/30 shadow-sm"
          />
          <div>
            <div className="text-sm font-bold text-white tracking-tight">She Wins</div>
            <div className="text-[10px] text-pink-400 font-semibold uppercase tracking-wider">
              Admin Portal
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToKiosk}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Customer Form</span>
        </button>
      </div>

      {/* Main Centered Login Card */}
      <div className="w-full max-w-sm mx-auto my-8">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-3 shadow-inner">
              <Shield className="w-7 h-7 text-blue-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Administrator Login
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Access customer records & directory
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div>
              <label htmlFor="adminLoginUser" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="adminLoginUser"
                  autoComplete="username"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="adminLoginPass" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="adminLoginPass"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Auto-fill */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleFillDemo}
                className="text-blue-400 hover:underline font-medium cursor-pointer text-xs"
              >
                Auto-fill
              </button>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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

          {/* Hint */}
          <div className="mt-5 p-3 rounded-lg bg-slate-900/60 border border-slate-700/60 text-[11px] text-slate-400 text-center">
            Default credentials: <span className="text-white font-mono font-semibold">admin</span> / <span className="text-white font-mono font-semibold">admin123</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500">
        She Wins Management System • Protected Administrator Area
      </div>
    </div>
  );
};
