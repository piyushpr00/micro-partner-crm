import { supabase } from '../config/supabase';
import { COMMISSION_SLABS, CourseType } from '../types';

export class CommissionService {
  static async getPartnerEarnings(partnerId: string) {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('id, status, course_type, partners(commission_rate)')
      .eq('partner_id', partnerId)
      .eq('status', 'closed_won');

    if (error) throw error;

    const FIXED_DEAL_VALUE = 10000;
    const totalEarnings = leads.reduce((acc, lead: any) => {
      const courseType = lead.course_type as CourseType | undefined;
      const rate = courseType && COMMISSION_SLABS[courseType]
        ? COMMISSION_SLABS[courseType]
        : (lead.partners?.commission_rate || 10);
      return acc + (FIXED_DEAL_VALUE * (rate / 100));
    }, 0);

    return {
      partner_id: partnerId,
      total_earnings: totalEarnings,
      closed_deals: leads.length,
      currency: 'INR',
    };
  }

  static async getGlobalPerformance() {
    const { data, error } = await supabase
      .from('leads')
      .select('status, course_type, created_at');

    if (error) throw error;

    const statusCounts = data.reduce((acc: any, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    const courseCounts = data.reduce((acc: any, lead: any) => {
      if (lead.course_type) acc[lead.course_type] = (acc[lead.course_type] || 0) + 1;
      return acc;
    }, {});

    return {
      status_distribution: statusCounts,
      course_distribution: courseCounts,
      total_leads: data.length,
      payout_timeline_days: 45,
      currency: 'INR',
    };
  }
}
