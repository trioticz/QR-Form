import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';

interface MobileQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileQRModal: React.FC<MobileQRModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use current live origin, or default to live Vercel URL if testing on localhost
  const qrUrl =
    typeof window !== 'undefined' &&
    window.location.origin &&
    !window.location.origin.includes('localhost') &&
    !window.location.origin.includes('127.0.0.1')
      ? `${window.location.origin}/`
      : 'https://qr-form-pi.vercel.app/';

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.jpg" 
              alt="She Wins Logo" 
              className="w-7 h-7 rounded-full object-cover border border-white/20 shrink-0" 
            />
            <div>
              <h3 id="qr-modal-title" className="text-sm font-bold text-white tracking-tight">
                She Wins Registration
              </h3>
              <p className="text-[11px] text-slate-400">Scan to fill on your smartphone</p>
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

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-xs text-emerald-700 font-medium mb-4">
            Works on all mobile phones via 4G, 5G, or Wi-Fi
          </p>

          {/* QR Code Container */}
          <div className="inline-block p-4 rounded-xl bg-white border-2 border-slate-200 shadow-xs mb-3">
            <QRCodeSVG
              value={qrUrl}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="space-y-1 mb-4">
            <div className="text-xs font-semibold text-slate-900">
              Customer Registration Form
            </div>
            <div className="font-mono text-[11px] text-blue-700 bg-blue-50/70 py-1.5 px-2 rounded border border-blue-100 break-all select-all font-medium">
              {qrUrl}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={qrUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100/80 border border-blue-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-100 text-center text-[11px] text-slate-500">
          Point your phone camera to register customer details instantly.
        </div>
      </div>
    </div>
  );
};
