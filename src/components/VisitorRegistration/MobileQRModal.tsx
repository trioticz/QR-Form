import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Copy, Check } from 'lucide-react';

interface MobileQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileQRModal: React.FC<MobileQRModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Prefer host IP for cross-device mobile scanning
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '10.14.205.164';
  const port = typeof window !== 'undefined' && window.location.port ? `:${window.location.port}` : ':5175';
  const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
  
  // If user is on localhost on desktop, use the Wi-Fi network IP so mobile phone camera scanning works!
  const targetHost = isLocalhost ? '10.14.205.164' : currentHost;
  const qrUrl = `http://${targetHost}${port}/`;

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
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 id="qr-modal-title" className="text-sm font-bold text-white tracking-tight">
                Mobile Registration
              </h3>
              <p className="text-[11px] text-slate-400">Scan to fill on your phone</p>
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

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-xs text-slate-600 mb-5 max-w-xs mx-auto">
            Scan with your smartphone camera to open the customer registration form directly on your mobile device.
          </p>

          {/* QR Code Container */}
          <div className="inline-block p-4 rounded-xl bg-white border-2 border-slate-200/90 shadow-sm mb-4">
            <QRCodeSVG
              value={qrUrl}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="space-y-1 mb-5">
            <div className="text-xs font-semibold text-slate-900">
              Quick Customer Entry Form
            </div>
            <div className="font-mono text-[11px] text-slate-500 break-all px-2">
              {qrUrl}
            </div>
          </div>

          {/* Copy URL button */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Link Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Form Link</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Customers can easily fill their details on their phone.
        </div>
      </div>
    </div>
  );
};
