import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CheckCircle2, 
  Printer, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  MapPin, 
  FileText,
  UserCheck
} from 'lucide-react';
import { Customer } from '../../types';

interface SuccessBadgeProps {
  visitor: Customer;
  onReset: () => void;
}

export const SuccessBadge: React.FC<SuccessBadgeProps> = ({ visitor, onReset }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4 sm:px-6 animate-fadeIn">
      {/* Success banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Details Collected Successfully!
        </h2>
        <p className="mt-1 text-sm text-slate-600 max-w-md mx-auto">
          Thank you, <span className="font-semibold text-slate-900">{visitor.fullName}</span>. Your details and requirement have been recorded in our system.
        </p>
      </div>

      {/* Customer Record Card */}
      <div
        id="printable-customer-slip"
        className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden mb-6"
      >
        {/* Card Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-xs tracking-wider text-white">
              CD
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-slate-300">
                Customer Registration Slip
              </div>
              <div className="text-[11px] text-slate-400">
                Reference ID: <span className="font-mono text-white font-semibold">{visitor.id}</span>
              </div>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Registered
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Customer Profile
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {visitor.fullName}
              </h3>
              <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {visitor.company || 'Individual'}
              </p>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <QRCodeSVG
                value={`Customer ID: ${visitor.id}\nName: ${visitor.fullName}\nPhone: ${visitor.phone}\nCompany: ${visitor.company}\nDate: ${visitor.registeredAt}`}
                size={84}
                level="M"
                includeMargin={false}
              />
              <span className="mt-1 font-mono text-[10px] text-slate-500 font-semibold tracking-wider">
                {visitor.id}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-100">
            <div>
              <span className="text-slate-400 block mb-0.5">Contact Phone</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 text-sm">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                {visitor.phone}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Email Address</span>
              <span className="font-medium text-slate-800 flex items-center gap-1 truncate text-xs">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {visitor.email || 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Inquiry Purpose</span>
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-200/60">
                {visitor.purpose}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Date & Time</span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {visitor.registeredAt}
              </span>
            </div>

            {visitor.city && (
              <div className="col-span-2">
                <span className="text-slate-400 block mb-0.5">Location / City</span>
                <span className="font-medium text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {visitor.city}
                </span>
              </div>
            )}
          </div>

          {/* Notes if any */}
          {visitor.notes && (
            <div className="pt-3 text-xs">
              <span className="text-slate-400 block mb-1">Requirement Notes:</span>
              <p className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-slate-700 leading-relaxed">
                {visitor.notes}
              </p>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Customer details securely recorded.</span>
          <span className="font-mono text-slate-400">{visitor.registeredDate}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Slip</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium text-sm border border-slate-300 transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Register Another Customer</span>
        </button>
      </div>
    </div>
  );
};
