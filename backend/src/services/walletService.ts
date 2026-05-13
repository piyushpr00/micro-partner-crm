import { supabase } from '../config/supabase';

export class WalletService {
  static async getWalletByPartner(partnerId: string) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*, payouts(*)')
      .eq('partner_id', partnerId)
      .single();

    if (error) throw error;
    return data;
  }

  static async requestPayout(walletId: string, amount: number) {
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', walletId)
      .single();

    if (walletError || !wallet) throw new Error('Wallet not found');
    if (wallet.balance < amount) throw new Error('Insufficient balance');

    const { data: payout, error: payoutError } = await supabase
      .from('payouts')
      .insert([{ wallet_id: walletId, amount, status: 'pending' }])
      .select()
      .single();

    if (payoutError) throw payoutError;

    // Subtract from balance
    await supabase
      .from('wallets')
      .update({ balance: wallet.balance - amount })
      .eq('id', walletId);

    return payout;
  }

  static async getLeaderboard() {
    // Rank partners by closed deals and total earned
    const { data, error } = await supabase
      .from('partners')
      .select(`
        id,
        name,
        company_name,
        wallets (total_earned),
        leads (id)
      `)
      .eq('leads.status', 'closed_won');

    if (error) throw error;

    const leaderboard = data.map((partner: any) => ({
      id: partner.id,
      name: partner.name,
      company: partner.company_name,
      total_earned: partner.wallets?.total_earned || 0,
      conversions: partner.leads?.length || 0
    })).sort((a, b) => b.conversions - a.conversions || b.total_earned - a.total_earned);

    return leaderboard.slice(0, 10);
  }
}
