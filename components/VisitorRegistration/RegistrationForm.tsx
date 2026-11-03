import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { Customer } from '../../types';

interface RegistrationFormProps {
  onSubmitSuccess: (customer: Customer) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmitSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setValidationError('Please enter your Name.');
      return;
    }
    if (!phone.trim()) {
      setValidationError('Please enter your Phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid Email.');
      return;
    }
    if (!businessType.trim()) {
      setValidationError('Please enter the Type of Business.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = now.toISOString().slice(0, 10);
    const registeredAtFormatted = `${dateFormatted} ${timeFormatted}`;
    const randomId = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCustomer: Customer = {
      id: randomId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      businessType: businessType.trim(),
      organizationName: organizationName.trim() || undefined,
      registeredAt: registeredAtFormatted,
      registeredDate: dateFormatted,
      fullName: name.trim(),
      company: organizationName.trim() || '',
      purpose: businessType.trim(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess(newCustomer);
    }, 250);
  };

  return (
    <div className="w-full max-w-lg mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Brand & Title */}
      <div className="mb-6 flex flex-col items-center sm:items-start text-center sm:text-left">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src="/logo.jpg" 
            alt="She Wins Logo" 
            className="w-14 h-14 rounded-full object-cover shadow-sm border-2 border-pink-100 shrink-0" 
          />
          <div>
            <div className="text-lg font-bold text-slate-900 tracking-tight">She Wins</div>
            <div className="text-[11px] font-semibold text-pink-600 tracking-wider uppercase">
              Aspire • Empower • Inspire
            </div>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Customer Registration
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Please fill in the details below.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
        {validationError && (
          <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="font-medium text-xs sm:text-sm">{validationError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* 1. Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                required
                autoComplete="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {/* 2. Phone number */}
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Phone number <span className="text-red-500">*</span>
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
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {/* 3. Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email <span className="text-red-500">*</span>
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
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {/* 4. Type of Business */}
          <div>
            <label htmlFor="businessType" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Type of Business <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="businessType"
                name="businessType"
                required
                placeholder="e.g. Retail, Manufacturing, IT, Services"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {/* 5. Organisation name [optional] */}
          <div>
            <label htmlFor="organizationName" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Organisation name <span className="text-slate-400 font-normal lowercase">[optional]</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                placeholder="Enter organisation name (optional)"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
