export type VisitorStatus = 'expected' | 'checked_in' | 'checked_out' | 'overstay';

export type VisitPurpose = 
  | 'Client Meeting'
  | 'Interview'
  | 'Vendor & Contractor'
  | 'Consulting'
  | 'Board & Executive'
  | 'Personal Visit';

export interface HostEmployee {
  id: string;
  name: string;
  department: string;
  email: string;
  location: string;
}

export interface Visitor {
  id: string;
  badgeNumber: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  hostName: string;
  hostDepartment: string;
  hostEmail: string;
  purpose: VisitPurpose;
  location: string;
  expectedDate: string; // YYYY-MM-DD
  expectedTime: string; // HH:mm
  checkInTime?: string; // ISO or formatted
  checkOutTime?: string;
  status: VisitorStatus;
  ndaSigned: boolean;
  notes?: string;
  registeredAt: string;
}

export interface DashboardMetrics {
  totalToday: number;
  currentlyCheckedIn: number;
  expectedRemaining: number;
  completedVisits: number;
  averageDurationHours: number;
}

