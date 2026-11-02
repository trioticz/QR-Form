import React, { useState } from 'react';
import { X, CalendarClock, Plus, UserCheck } from 'lucide-react';
import { Visitor, VisitPurpose } from '../../types';
import { DEPARTMENTS } from '../../data/departments';

interface PreRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (visitor: Visitor) => void;
}

export const PreRegisterModal: React.FC<PreRegisterModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [hostName, setHostName] = useState('');
  const [hostDepartment, setHostDepartment] = useState<string>(DEPARTMENTS[0]);
  const [purpose, setPurpose] = useState<VisitPurpose>('Client Meeting');
  const [expectedTime, setExpectedTime] = useState('14:00');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !hostName.trim()) return;

    const now = new Date();
    const randomBadgeNum = `G-${Math.floor(100 + Math.random() * 900)}`;
    const randomId = `VIS-${Math.floor(1000 + Math.random() * 9000)}`;

    const newVisitor: Visitor = {
      id: randomId,
      badgeNumber: randomBadgeNum,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || '+1 (555) 000-0000',
      company: company.trim() || 'Independent Guest',
      hostName: hostName.trim(),
      hostDepartment,
      hostEmail: `${hostName.trim().toLowerCase().replace(/\s+/g, '.')}@internal.corp`,
      purpose,
      location: `Floor & Room for ${hostDepartment}`,
      expectedDate: now.toISOString().slice(0, 10),
      expectedTime,
      status: 'expected',
      ndaSigned: true,
      notes: notes.trim() || undefined,
      registeredAt: now.toISOString().replace('T', ' ').slice(0, 16),
    };

    onSave(newVisitor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preregister-modal-title"
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CalendarClock className="w-5 h-5 text-blue-400" />
            <div>
              <h3 id="preregister-modal-title" className="text-sm font-bold text-white">
                Pre-Register Upcoming Visitor
              </h3>
              <p className="text-[11px] text-slate-400">Schedule guest arrival & pre-issue security pass</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Visitor Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Marcus Aurelius"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                placeholder="Organization name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Expected Arrival Time
              </label>
              <input
                type="time"
                value={expectedTime}
                onChange={(e) => setExpectedTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Host / Employee to Visit *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Host Department
              </label>
              <select
                value={hostDepartment}
                onChange={(e) => setHostDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Visit Purpose
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as VisitPurpose)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Client Meeting">Client Meeting</option>
              <option value="Interview">Job Interview</option>
              <option value="Vendor & Contractor">Vendor & Contractor</option>
              <option value="Consulting">Consulting</option>
              <option value="Board & Executive">Board & Executive</option>
              <option value="Personal Visit">Personal Visit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Visit Notes / Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. VIP guest, escort required from lobby"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Visitor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
