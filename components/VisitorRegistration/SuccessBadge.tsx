import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Printer, ArrowLeft, ShieldCheck, Wifi, Clock, MapPin, UserCheck } from 'lucide-react';
import { Visitor } from '../../types';

interface SuccessBadgeProps {
  visitor: Visitor;
  onReset: () => void;
}

export const SuccessBadge: React.FC<SuccessBadgeProps> = ({ visitor, onReset }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 sm:px-6 animate-fadeIn">
      {/* Success banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Registration Complete
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
          Welcome to the building, <span className="font-semibold text-slate-900">{visitor.fullName}</span>. An automated arrival notification has been dispatched to <span className="font-semibold text-slate-900">{visitor.hostName}</span>.
        </p>
      </div>

      {/* Printable / Viewable Executive Pass */}
      <div
        id="printable-visitor-badge"
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6"
      >
        {/* Pass Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-xs tracking-wider text-white">
              AP
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-slate-300">
                AuraPass Visitor Pass
              </div>
              <div className="text-[11px] text-slate-400">
                HQ Campus • Tier 1 Guest Access
              </div>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        </div>

        {/* Pass Body */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Visitor Name
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {visitor.fullName}
              </h3>
              <p className="text-sm font-medium text-slate-600">
                {visitor.company || 'Independent Visitor'}
              </p>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <QRCodeSVG
                value={`https://aurapass.corp/verify?id=${visitor.id}&badge=${visitor.badgeNumber}`}
                size={96}
                level="M"
                includeMargin={false}
              />
              <span className="mt-1.5 font-mono text-[10px] text-slate-500 font-semibold tracking-wider">
                {visitor.badgeNumber}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 py-5 text-sm border-b border-slate-100">
            <div>
              <span className="text-xs text-slate-500 block mb-0.5">Host Contact</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                {visitor.hostName}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">{visitor.hostDepartment}</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-0.5">Assigned Location</span>
              <span className="font-medium text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {visitor.location}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-0.5">Purpose of Visit</span>
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded border border-slate-200">
                {visitor.purpose}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-0.5">Check-In Time</span>
              <span className="font-medium text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {visitor.checkInTime || visitor.expectedTime}
              </span>
            </div>
          </div>

          {/* Guest Wi-Fi & Safety Policy Info */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-slate-400" />
              <span>
                Guest Wi-Fi: <strong className="text-slate-700">AuraPass-Guest</strong> (Passcode: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">VisitHQ2026</code>)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security NDA Signed</span>
            </div>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Please wear this badge visibly while inside premises.</span>
          <span className="font-mono text-slate-400">ID: {visitor.id}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Printer className="w-4 h-4" />
          Print Visitor Badge
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium text-sm border border-slate-300 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Register Another Guest
        </button>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400">
        Need assistance? Please speak with our reception officer at the front desk.
      </div>
    </div>
  );
};
