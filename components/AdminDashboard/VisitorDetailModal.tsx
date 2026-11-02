import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Printer, 
  Mail, 
  Phone, 
  ShieldCheck, 
  LogIn, 
  LogOut 
} from 'lucide-react';
import { Visitor, VisitorStatus } from '../../types';

interface VisitorDetailModalProps {
  visitor: Visitor | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: VisitorStatus) => void;
}

export const VisitorDetailModal: React.FC<VisitorDetailModalProps> = ({
  visitor,
  onClose,
  onStatusChange,
}) => {
  if (!visitor) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="visitor-modal-title"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-xs">
              AP
            </div>
            <div>
              <h3 id="visitor-modal-title" className="text-sm font-bold tracking-tight text-white">
                Visitor Record: {visitor.badgeNumber}
              </h3>
              <p className="text-[11px] text-slate-400">Security Verification Dossier</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Visitor Primary Banner */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Visitor Identity
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {visitor.fullName}
              </h2>
              <p className="text-sm font-medium text-slate-600">
                {visitor.company}
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {visitor.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {visitor.phone}
                </span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center bg-slate-50 p-3 rounded-lg border border-slate-200 shrink-0">
              <QRCodeSVG
                value={`https://aurapass.corp/verify?id=${visitor.id}&badge=${visitor.badgeNumber}`}
                size={84}
                level="M"
              />
              <span className="font-mono text-[10px] text-slate-600 font-bold mt-1">
                {visitor.badgeNumber}
              </span>
            </div>
          </div>

          {/* Details 2-Column Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-400 font-medium block mb-1">Assigned Host</span>
              <span className="font-semibold text-slate-800 text-sm block">
                {visitor.hostName}
              </span>
              <span className="text-slate-500">{visitor.hostDepartment}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-400 font-medium block mb-1">Meeting Location</span>
              <span className="font-semibold text-slate-800 text-sm block">
                {visitor.location}
              </span>
              <span className="text-slate-500">Floor Access Confirmed</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-400 font-medium block mb-1">Check-In Status</span>
              <span className="font-semibold text-slate-800 text-sm capitalize block">
                {visitor.status.replace('_', ' ')}
              </span>
              <span className="text-slate-500">
                {visitor.checkInTime ? `Checked in: ${visitor.checkInTime}` : `Expected: ${visitor.expectedTime}`}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-400 font-medium block mb-1">Safety & Compliance</span>
              <span className="font-semibold text-emerald-700 text-sm flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                NDA Form Signed
              </span>
              <span className="text-slate-500">Expires 24 hours</span>
            </div>
          </div>

          {visitor.notes && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 block mb-1">Subject / Host Notes:</span>
              <p className="text-slate-600">{visitor.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Access Badge</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            {visitor.status === 'expected' && (
              <button
                type="button"
                onClick={() => {
                  onStatusChange(visitor.id, 'checked_in');
                  onClose();
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Mark Checked In</span>
              </button>
            )}

            {visitor.status === 'checked_in' && (
              <button
                type="button"
                onClick={() => {
                  onStatusChange(visitor.id, 'checked_out');
                  onClose();
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Mark Checked Out</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
