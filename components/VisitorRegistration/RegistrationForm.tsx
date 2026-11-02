import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Customer, CustomerPurpose } from '../../types';

interface RegistrationFormProps {
  onSubmitSuccess: (customer: Customer) => void;
}

const PURPOSES: { value: CustomerPurpose; label: string; desc: string }[] = [
  { value: 'Product Inquiry', label: 'Product Inquiry', desc: 'Interested in catalog, pricing, demo' },
  { value: 'Sales & Purchase', label: 'Sales & Orders', desc: 'Placing order, purchase request' },
  { value: 'Client Meeting', label: 'Client Meeting', desc: 'Business consultation or partner sync' },
  { value: 'Service & Support', label: 'Service & Support', desc: 'Technical support, maintenance, query' },
  { value: 'Consultation', label: 'Consultation', desc: 'Expert advisory, solution discussion' },
  { value: 'General Inquiry', label: 'General / Other', desc: 'General questions or visiting the office' },
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmitSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [purpose, setPurpose] = useState<CustomerPurpose>('Product Inquiry');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setValidationError('Please enter customer full name.');
      return;
    }
    if (!phone.trim()) {
      setValidationError('Please enter a contact phone number.');
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
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase() || '',
      company: company.trim() || 'Individual',
      city: city.trim() || undefined,
      purpose,
      notes: notes.trim() || undefined,
      registeredAt: registeredAtFormatted,
      registeredDate: dateFormatted,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess(newCustomer);
    }, 350);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Header section */}
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Customer Information Registration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Customer Details Entry
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed max-w-xl">
          Please fill in your details below. Our team will record your inquiry and assist you promptly.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
        {validationError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="font-medium">{validationError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Section 1: Customer Contact Details */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Customer Contact Details
              </h2>
              <span className="text-xs text-slate-400">* Required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Customer Name <span className="text-red-500">*</span>
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
                    placeholder="e.g. Rajesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
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
                    placeholder="e.g. 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    placeholder="customer@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {/* Company / Business Name */}
              <div>
                <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Company / Business <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="e.g. Apex Enterprises or Self"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {/* City / Location */}
              <div>
                <label htmlFor="city" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  City / Location <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="e.g. Chennai, Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Purpose / Requirement */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Requirement / Purpose
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Select Inquiry Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PURPOSES.map((item) => {
                    const isSelected = purpose === item.value;
                    return (
                      <button
                        type="button"
                        key={item.value}
                        onClick={() => setPurpose(item.value)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 text-blue-950 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-xs sm:text-sm">{item.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Requirements / Notes */}
              <div>
                <label htmlFor="notes" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Requirement Details / Message <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Enter any specific requirements, product models, or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Details...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Customer Details</span>
                </>
              )}
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">
              Your details will be recorded securely in our customer management system.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
