import React, { useState } from 'react';
import { RegistrationForm } from './RegistrationForm';
import { SuccessBadge } from './SuccessBadge';
import { MobileQRModal } from './MobileQRModal';
import { Visitor } from '../../types';
import { saveVisitor } from '../../utils/storage';
import { ShieldCheck, HelpCircle, Shield, QrCode } from 'lucide-react';

interface VisitorViewProps {
  onVisitorRegistered: (visitor: Visitor) => void;
  onSwitchToAdmin: () => void;
  checkedInCount: number;
}

export const VisitorView: React.FC<VisitorViewProps> = ({ 
  onVisitorRegistered,
  onSwitchToAdmin,
  checkedInCount,
}) => {
  const [registeredVisitor, setRegisteredVisitor] = useState<Visitor | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const handleRegistrationComplete = (newVisitor: Visitor) => {
    saveVisitor(newVisitor);
    setRegisteredVisitor(newVisitor);
    onVisitorRegistered(newVisitor);
  };

  const handleReset = () => {
    setRegisteredVisitor(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Corporate Kiosk Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Facility */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-xs">
              AP
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                AuraPass
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                  Guest Kiosk
                </span>
              </div>
              <div className="text-[11px] text-slate-500 hidden sm:block">
                HQ Campus • Main Lobby Concierge
              </div>
            </div>
          </div>

          {/* Right Actions: QR Mobile Scan & Admin Access */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsQRModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 transition-colors cursor-pointer"
              title="Open QR Code to register on mobile phone"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Mobile QR</span>
            </button>

            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/70 transition-colors cursor-pointer"
              title="Switch to Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Admin Console</span>
              {checkedInCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold">
                  {checkedInCount} live
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Form or Success Screen */}
      <main className="flex-1 flex items-center justify-center py-6 sm:py-10 px-4">
        {!registeredVisitor ? (
          <RegistrationForm onSubmitSuccess={handleRegistrationComplete} />
        ) : (
          <SuccessBadge visitor={registeredVisitor} onReset={handleReset} />
        )}
      </main>

      {/* Discreet Corporate Footer */}
      <footer className="border-t border-slate-200/60 bg-white/70 py-4 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted Check-In • Authorized Access Only</span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Touchless check-in:{' '}
              <button
                type="button"
                onClick={() => setIsQRModalOpen(true)}
                className="text-blue-600 hover:underline font-medium ml-1 cursor-pointer"
              >
                Scan QR on your phone
              </button>
            </span>
          </div>
        </div>
      </footer>

      {/* Touchless Mobile Check-In QR Modal */}
      <MobileQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  );
};
