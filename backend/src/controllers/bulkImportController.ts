import { Request, Response } from 'express';
import { BulkImportService } from '../services/bulkImportService';

export class BulkImportController {
  static async importLeads(req: Request, res: Response) {
    try {
      const leads = req.body.leads;
      if (!Array.isArray(leads)) {
        return res.status(400).json({ error: 'Leads must be an array' });
      }
      
      const results = await BulkImportService.importLeads(leads);
      res.status(200).json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
