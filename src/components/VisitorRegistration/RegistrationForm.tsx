import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  UserCheck,
  ChevronRight,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Visitor, VisitPurpose } from '../../types';
import { DEPARTMENTS } from '../../data/departments';

interface RegistrationFormProps {
  onSubmitSuccess: (visitor: Visitor) => void;
}

const PURPOSES: { value: VisitPurpose; label: string; desc: string }[] = [
  { value: 'Client Meeting', label: 'Client Meeting', desc: 'Commercial or partner discussion' },
  { value: 'Interview', label: 'Job Interview', desc: 'Candidate on-site interview' },
  { value: 'Vendor & Contractor', label: 'Vendor / Contractor', desc: 'Maintenance, delivery, technical services' },
  { value: 'Consulting', label: 'Consulting & Advisory', desc: 'External advisory session' },
  { value: 'Board & Executive', label: 'Executive / Board', desc: 'Leadership or investor meeting' },
  { value: 'Personal Visit', label: 'Personal Visit', desc: 'Visiting staff member' },
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmitSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [hostName, setHostName] = useState('');
  const [hostDepartment, setHostDepartment] = useState<string>(DEPARTMENTS[0]);
  const [purpose, setPurpose] = useState<VisitPurpose>('Client Meeting');
  const [notes, setNotes] = useState('');
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setValidationError('Please enter your full legal or preferred name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please provide a valid corporate or personal email address.');
      return;
    }
    if (!phone.trim()) {
      setValidationError('Please provide a contact phone number for security check-in.');
      return;
    }
    if (!hostName.trim()) {
      setValidationError('Please enter the name of the host or department you are visiting.');
      return;
    }
    if (!ndaAccepted) {
      setValidationError('You must review and agree to the building safety & confidentiality policy.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const randomBadgeNum = `G-${Math.floor(100 + Math.random() * 900)}`;
    const randomId = `VIS-${Math.floor(1000 + Math.random() * 9000)}`;

    const newVisitor: Visitor = {
      id: randomId,
      badgeNumber: randomBadgeNum,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim() || 'Independent Guest',
      hostName: hostName.trim(),
      hostDepartment,
      hostEmail: `${hostName.trim().toLowerCase().replace(/\s+/g, '.')}@internal.corp`,
      purpose,
      location: `Floor & Room for ${hostDepartment}`,
      expectedDate: now.toISOString().slice(0, 10),
      expectedTime: timeFormatted,
      checkInTime: timeFormatted,
      status: 'checked_in',
      ndaSigned: true,
      notes: notes.trim() || undefined,
      registeredAt: now.toISOString().replace('T', ' ').slice(0, 16),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess(newVisitor);
    }, 400);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Header section with clean visual hierarchy */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/70 mb-3.5">
          <Building2 className="w-3.5 h-3.5" />
          <span>Building Access & Security</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Welcome! Please Register Your Visit
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
          To maintain workplace safety, issue your verified guest pass, and immediately notify your host of your arrival, please provide your visit details below.
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        {validationError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="font-medium">{validationError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Section 1: Visitor Information */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-100">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                1. Your Contact Information
              </h2>
              <span className="text-xs text-slate-400">All fields required unless marked</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="e.g. Eleanor Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    autoComplete="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {/* Company / Organization */}
              <div className="sm:col-span-2">
                <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="company"
                    name="organization"
                    autoComplete="organization"
                    placeholder="e.g. Acme Corporation or Independent"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Host & Purpose */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-100">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                2. Host & Visit Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* Host Input & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hostName" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Host Name or Contact Person <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="hostName"
                      required
                      placeholder="e.g. Sarah Jenkins or Reception Desk"
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hostDepartment" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Host Department
                  </label>
                  <select
                    id="hostDepartment"
                    value={hostDepartment}
                    onChange={(e) => setHostDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Purpose of Visit Grid */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Purpose of Visit <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PURPOSES.map((item) => {
                    const isSelected = purpose === item.value;
                    return (
                      <button
                        type="button"
                        key={item.value}
                        onClick={() => setPurpose(item.value)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 text-blue-950 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50/80 text-slate-700'
                        }`}
                      >
                        <div className="font-medium text-xs sm:text-sm">{item.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes / Special Requirements */}
              <div>
                <label htmlFor="notes" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Meeting Subject or Notes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="notes"
                  placeholder="e.g. Q4 Executive Review, Contract Delivery"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                />
              </div>
            </div>
          </div>

          {/* Section 3: NDA & Safety Compliance */}
          <div className="pt-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ndaAccepted}
                  onChange={(e) => setNdaAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="text-xs text-slate-600 leading-normal">
                  <span className="font-semibold text-slate-900 block mb-0.5">
                    Building Safety & Confidentiality Agreement
                  </span>
                  I confirm that all provided details are accurate. I agree to comply with building emergency guidelines, wear my visitor pass prominently, and adhere to visitor confidentiality standards during my stay.
                </div>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Check-in...</span>
                </>
              ) : (
                <>
                  <span>Complete Visit Registration</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">
              Host notification dispatched automatically upon submission.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
