import { supabase } from '../config/supabase';
import { Lead } from '../types';

export class BulkImportService {
  static async importLeads(leads: Partial<Lead>[]) {
    const results = {
      total: leads.length,
      success: 0,
      duplicates: 0,
      errors: 0,
      details: [] as any[]
    };

    // Process in batches or one-by-one for detailed reporting
    // One-by-one is safer for prototype reporting, but batch is faster.
    // We'll use a combined approach: check for duplicates first.
    
    for (const lead of leads) {
      try {
        // 1. Duplicate Detection (By Email)
        const { data: existing, error: checkError } = await supabase
          .from('leads')
          .select('id')
          .eq('email', lead.email)
          .single();

        if (existing) {
          results.duplicates++;
          results.details.push({ email: lead.email, status: 'duplicate', message: 'Lead with this email already exists' });
          continue;
        }

        // 2. Insert Lead
        const { error: insertError } = await supabase
          .from('leads')
          .insert([lead]);

        if (insertError) {
          results.errors++;
          results.details.push({ email: lead.email, status: 'error', message: insertError.message });
        } else {
          results.success++;
        }
      } catch (err: any) {
        results.errors++;
        results.details.push({ email: lead.email, status: 'error', message: err.message });
      }
    }

    return results;
  }
}
