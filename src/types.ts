export type CustomerPurpose = 
  | 'Product Inquiry'
  | 'Sales & Purchase'
  | 'Client Meeting'
  | 'Service & Support'
  | 'Consultation'
  | 'General Inquiry';

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  company: string;
  city?: string;
  purpose: string;
  notes?: string;
  registeredAt: string; // formatted date & time
  registeredDate: string; // YYYY-MM-DD
}

export interface CustomerMetrics {
  totalCustomers: number;
  todayCount: number;
  thisWeekCount: number;
  totalCompanies: number;
}

// Backward-compatibility aliases
export type Visitor = Customer;
export type VisitorStatus = 'registered';
export type VisitPurpose = CustomerPurpose;
