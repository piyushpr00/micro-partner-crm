import { supabase } from '../config/supabase';
import { Lead } from '../types';

export class LeadService {
  static async getAllLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*, partners(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getLeadById(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*, partners(name)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async getLeadsByPartner(partnerId: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createLead(lead: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateLead(id: string, updates: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteLead(id: string) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
