import { Partner } from '@/types';
import { createClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class PartnerService {
  private static async getHeaders() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    };
  }

  static async getAllPartners() {
    const response = await fetch(`${API_URL}/partners`, {
      headers: await this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch partners');
    return response.json();
  }

  static async getPartnerById(id: string) {
    const response = await fetch(`${API_URL}/partners/${id}`, {
      headers: await this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch partner');
    return response.json();
  }

  static async createPartner(partner: Partial<Partner>) {
    const response = await fetch(`${API_URL}/partners`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(partner),
    });
    if (!response.ok) throw new Error('Failed to create partner');
    return response.json();
  }
}

export class WalletService {
  private static async getHeaders() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    };
  }

  static async getWallet(partnerId: string) {
    const response = await fetch(`${API_URL}/wallet/${partnerId}`, {
      headers: await this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch wallet');
    return response.json();
  }

  static async getLeaderboard() {
    const response = await fetch(`${API_URL}/wallet/leaderboard`, {
      headers: await this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  }
}

export class AnalyticsService {
  private static async getHeaders() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    };
  }

  static async getGlobalStats() {
    const response = await fetch(`${API_URL}/analytics/global`, {
      headers: await this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  }
}
