import { Lead } from '@/types';
import { createClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class LeadService {
  private static async getHeaders() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    };
  }

  static async getAllLeads() {
    const response = await fetch(`${API_URL}/leads`, {
      headers: await this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch leads');
    return response.json();
  }

  static async getLeadsByPartner(partnerId: string) {
    const response = await fetch(`${API_URL}/leads/partner/${partnerId}`, {
      headers: await this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch partner leads');
    return response.json();
  }

  static async getLeadById(id: string) {
    // Note: Backend doesn't have getById for leads yet, let's assume we'll add it or fetch all and filter
    const response = await fetch(`${API_URL}/leads/${id}`, {
      headers: await this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch lead details');
    return response.json();
  }

  static async createLead(lead: Partial<Lead>) {
    const response = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error('Failed to create lead');
    return response.json();
  }

  static async updateLead(id: string, updates: Partial<Lead>) {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update lead');
    return response.json();
  }

  static async deleteLead(id: string) {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete lead');
    return true;
  }
}
