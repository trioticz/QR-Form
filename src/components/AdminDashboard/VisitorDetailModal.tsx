import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Printer, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Calendar, 
  Tag, 
  FileText 
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-modal-title"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
              CD
            </div>
            <div>
              <h3 id="customer-modal-title" className="text-sm font-bold tracking-tight text-white">
                Customer Record: {visitor.id}
              </h3>
              <p className="text-[11px] text-slate-400">Customer Contact & Inquiry Dossier</p>
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

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Customer Primary Banner */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Customer Profile
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {visitor.fullName}
              </h2>
              <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {visitor.company || 'Individual'}
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                <a 
                  href={`tel:${visitor.phone}`}
                  className="flex items-center gap-1.5 font-medium text-blue-600 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {visitor.phone}
                </a>
                {visitor.email && (
                  <a 
                    href={`mailto:${visitor.email}`}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {visitor.email}
                  </a>
                )}
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200 shrink-0">
              <QRCodeSVG
                value={`Customer ID: ${visitor.id}\nName: ${visitor.fullName}\nPhone: ${visitor.phone}\nCompany: ${visitor.company}\nDate: ${visitor.registeredAt}`}
                size={84}
                level="M"
              />
              <span className="font-mono text-[10px] text-slate-600 font-bold mt-1">
                {visitor.id}
              </span>
            </div>
          </div>

          {/* Details 2-Column Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-400 font-medium block mb-1">Inquiry Category</span>
              <span className="font-semibold text-blue-700 text-sm flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {visitor.purpose}
              </span>
              <span className="text-slate-500 mt-0.5 block">Customer Requirement</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-400 font-medium block mb-1">Registered Date & Time</span>
              <span className="font-semibold text-slate-800 text-sm flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {visitor.registeredAt}
              </span>
              <span className="text-slate-500 mt-0.5 block">Record Timestamp</span>
            </div>

            {visitor.city && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 col-span-2">
                <span className="text-slate-400 font-medium block mb-1">City / Location</span>
                <span className="font-semibold text-slate-800 text-sm flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {visitor.city}
                </span>
              </div>
            )}
          </div>

          {/* Customer Requirements / Notes */}
          {visitor.notes && (
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Specific Requirements / Notes:
              </span>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{visitor.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Customer Slip</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <a
              href={`tel:${visitor.phone}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Customer</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
