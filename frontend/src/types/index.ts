export type PartnerStatus = 'active' | 'inactive' | 'pending';

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  status: PartnerStatus;
  region?: string;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export type CourseType = '3_months' | '4_months' | '6_months' | '11_months_diploma';

export interface CommissionSlab {
  course_type: CourseType;
  label: string;
  duration_months: number;
  rate: number;
}

export const COMMISSION_SLABS: CommissionSlab[] = [
  { course_type: '3_months',          label: '3 Month Course',   duration_months: 3,  rate: 10 },
  { course_type: '4_months',          label: '4 Month Course',   duration_months: 4,  rate: 10 },
  { course_type: '6_months',          label: '6 Month Course',   duration_months: 6,  rate: 10 },
  { course_type: '11_months_diploma', label: '11 Month Diploma', duration_months: 11, rate: 15 },
];

export const PAYOUT_TIMELINE_DAYS = 45;
export const CURRENCY_SYMBOL = '₹';

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source?: string;
  status: LeadStatus;
  course_type?: CourseType;
  partner_id: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
