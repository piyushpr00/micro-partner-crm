import { supabase } from '../config/supabase';

export class CommissionService {
  static async getPartnerEarnings(partnerId: string) {
    // In a real scenario, we would calculate this from successful conversions or transactions
    // For this prototype, we'll simulate an aggregation from leads where status = 'closed_won'
    const { data: leads, error } = await supabase
      .from('leads')
      .select('id, status, partners(commission_rate)')
      .eq('partner_id', partnerId)
      .eq('status', 'closed_won');

    if (error) throw error;

    // Simulation: each 'closed_won' lead earns a fixed amount multiplied by the commission rate
    const FIXED_DEAL_VALUE = 1000;
    const totalEarnings = leads.reduce((acc, lead: any) => {
      const rate = lead.partners?.commission_rate || 10;
      return acc + (FIXED_DEAL_VALUE * (rate / 100));
    }, 0);

    return {
      partner_id: partnerId,
      total_earnings: totalEarnings,
      closed_deals: leads.length
    };
  }

  static async getGlobalPerformance() {
    const { data, error } = await supabase
      .from('leads')
      .select('status, created_at');

    if (error) throw error;

    // Simple aggregation for dashboard charts
    const statusCounts = data.reduce((acc: any, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    return {
      status_distribution: statusCounts,
      total_leads: data.length
    };
  }
}
