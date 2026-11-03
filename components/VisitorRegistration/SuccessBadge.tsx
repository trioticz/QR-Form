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
  Building2,
  User
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
    <div className="w-full max-w-lg mx-auto py-6 px-4 sm:px-6 animate-fadeIn">
      {/* Success banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Registration Complete!
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Thank you, <span className="font-semibold text-slate-900">{visitor.name || visitor.fullName}</span>. Your details have been submitted successfully.
        </p>
      </div>

      {/* Customer Record Card */}
      <div
        id="printable-customer-slip"
        className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden mb-6"
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.jpg" 
              alt="She Wins Logo" 
              className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0" 
            />
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-slate-200">
                She Wins Customer Slip
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                ID: {visitor.id}
              </div>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Registered
          </span>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* QR & Name */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Name
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {visitor.name || visitor.fullName}
              </h3>
            </div>
            <div className="flex flex-col items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
              <QRCodeSVG
                value={`Name: ${visitor.name || visitor.fullName}\nPhone: ${visitor.phone}\nEmail: ${visitor.email}\nBusiness: ${visitor.businessType}\nOrg: ${visitor.organizationName || ''}`}
                size={70}
                level="M"
              />
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-2.5 text-xs">
            {/* Phone */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Phone number
              </span>
              <span className="font-semibold text-slate-900 font-mono text-xs">
                {visitor.phone}
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email
              </span>
              <span className="font-medium text-slate-900 truncate max-w-[200px]">
                {visitor.email || '—'}
              </span>
            </div>

            {/* Type of Business */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Type of Business
              </span>
              <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {visitor.businessType || visitor.purpose || '—'}
              </span>
            </div>

            {/* Organisation name */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Organisation name
              </span>
              <span className="font-medium text-slate-800">
                {visitor.organizationName || visitor.company || <span className="text-slate-400 italic">None</span>}
              </span>
            </div>

            {/* Registration Date & Time */}
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Submitted At
              </span>
              <span className="font-medium text-slate-600 font-mono">
                {visitor.registeredAt}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
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
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-300 transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Register Another</span>
        </button>
      </div>
    </div>
  );
};
