import { Request, Response } from 'express';
import { LeadService } from '../services/leadService';

export class LeadController {
  static async getAll(req: Request, res: Response) {
    try {
      const leads = await LeadService.getAllLeads();
      res.status(200).json(leads);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const lead = await LeadService.getLeadById(req.params.id);
      res.status(200).json(lead);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getByPartner(req: Request, res: Response) {
    try {
      const leads = await LeadService.getLeadsByPartner(req.params.partnerId);
      res.status(200).json(leads);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const lead = await LeadService.createLead(req.body);
      res.status(201).json(lead);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const lead = await LeadService.updateLead(req.params.id, req.body);
      res.status(200).json(lead);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await LeadService.deleteLead(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
