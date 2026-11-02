export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessType: string;
  organizationName?: string;
  registeredAt: string; // YYYY-MM-DD HH:mm
  registeredDate: string; // YYYY-MM-DD

  // Backward compatibility aliases
  fullName?: string;
  company?: string;
  purpose?: string;
  city?: string;
  notes?: string;
}

export interface CustomerMetrics {
  totalCustomers: number;
  todayCount: number;
  thisWeekCount: number;
  totalOrganizations: number;
}

// Backward compatibility aliases
export type Visitor = Customer;
export type VisitorStatus = 'registered';
export type VisitPurpose = string;
export type CustomerPurpose = string;
