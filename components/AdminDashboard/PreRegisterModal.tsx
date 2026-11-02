import React, { useState } from 'react';
import { X, UserPlus, Plus } from 'lucide-react';
import { Customer } from '../../types';

interface PreRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

export const PreRegisterModal: React.FC<PreRegisterModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !businessType.trim()) return;

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = now.toISOString().slice(0, 10);
    const randomId = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCustomer: Customer = {
      id: randomId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      businessType: businessType.trim(),
      organizationName: organizationName.trim() || undefined,
      registeredAt: `${dateFormatted} ${timeFormatted}`,
      registeredDate: dateFormatted,
      fullName: name.trim(),
      company: organizationName.trim() || '',
      purpose: businessType.trim(),
    };

    onSave(newCustomer);
    onClose();
    // Reset
    setName('');
    setPhone('');
    setEmail('');
    setBusinessType('');
    setOrganizationName('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-customer-modal-title"
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-blue-400" />
            <div>
              <h3 id="add-customer-modal-title" className="text-sm font-bold text-white">
                Add Customer Entry
              </h3>
              <p className="text-[11px] text-slate-400">Record customer details</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {/* 1. Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* 2. Phone number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Phone number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* 3. Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="customer@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* 4. Type of Business */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Type of Business <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Retail, IT, Manufacturing, Services"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* 5. Organisation name [optional] */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Organisation name <span className="text-slate-400 font-normal lowercase">[optional]</span>
            </label>
            <input
              type="text"
              placeholder="Organisation name (optional)"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Customer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
