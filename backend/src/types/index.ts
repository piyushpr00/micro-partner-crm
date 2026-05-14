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

export const COMMISSION_SLABS: Record<CourseType, number> = {
  '3_months': 10,
  '4_months': 10,
  '6_months': 10,
  '11_months_diploma': 15,
};

export const PAYOUT_TIMELINE_DAYS = 45;

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
