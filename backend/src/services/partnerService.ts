import { supabase } from '../config/supabase';
import { Partner } from '../types';

export class PartnerService {
  static async getAllPartners() {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getPartnerById(id: string) {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createPartner(partner: Partial<Partner>) {
    const { data, error } = await supabase
      .from('partners')
      .insert([partner])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePartner(id: string, updates: Partial<Partner>) {
    const { data, error } = await supabase
      .from('partners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deletePartner(id: string) {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
