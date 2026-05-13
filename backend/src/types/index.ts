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

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source?: string;
  status: LeadStatus;
  partner_id: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
