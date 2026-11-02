import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Printer, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Briefcase 
} from 'lucide-react';
import { Customer } from '../../types';

interface VisitorDetailModalProps {
  visitor: Customer | null;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: any) => void;
}

export const VisitorDetailModal: React.FC<VisitorDetailModalProps> = ({
  visitor,
  onClose,
}) => {
  if (!visitor) return null;

  const handlePrint = () => {
    window.print();
  };

  const displayName = visitor.name || visitor.fullName || 'Unnamed Customer';
  const displayBusinessType = visitor.businessType || visitor.purpose || '—';
  const displayOrg = visitor.organizationName || visitor.company || '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
              CD
            </div>
            <div>
              <h3 id="customer-modal-title" className="text-sm font-bold tracking-tight text-white">
                Customer Details
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">ID: {visitor.id}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Name & QR */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Customer Name
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {displayName}
              </h2>
              {displayOrg && (
                <p className="text-xs font-medium text-slate-600 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {displayOrg}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center bg-slate-50 p-2 rounded-lg border border-slate-200 shrink-0">
              <QRCodeSVG
                value={`Name: ${displayName}\nPhone: ${visitor.phone}\nEmail: ${visitor.email}\nBusiness: ${displayBusinessType}`}
                size={70}
                level="M"
              />
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-3 text-xs">
            {/* 1. Phone number */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Phone number
              </span>
              <a href={`tel:${visitor.phone}`} className="font-semibold text-blue-600 hover:underline font-mono">
                {visitor.phone}
              </a>
            </div>

            {/* 2. Email */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email
              </span>
              {visitor.email ? (
                <a href={`mailto:${visitor.email}`} className="font-medium text-slate-800 hover:text-blue-600 hover:underline">
                  {visitor.email}
                </a>
              ) : (
                <span className="text-slate-400 italic">None</span>
              )}
            </div>

            {/* 3. Type of Business */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Type of Business
              </span>
              <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {displayBusinessType}
              </span>
            </div>

            {/* 4. Organisation name [optional] */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Organisation name
              </span>
              <span className="font-medium text-slate-800">
                {displayOrg || <span className="text-slate-400 italic">Not specified</span>}
              </span>
            </div>

            {/* 5. Date & Time */}
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Registered Date & Time
              </span>
              <span className="font-mono text-slate-600">
                {visitor.registeredAt}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${visitor.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
