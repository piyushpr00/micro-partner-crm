import { Request, Response } from 'express';
import { PartnerService } from '../services/partnerService';

export class PartnerController {
  static async getAll(req: Request, res: Response) {
    try {
      const partners = await PartnerService.getAllPartners();
      res.status(200).json(partners);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const partner = await PartnerService.getPartnerById(req.params.id);
      res.status(200).json(partner);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const partner = await PartnerService.createPartner(req.body);
      res.status(201).json(partner);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const partner = await PartnerService.updatePartner(req.params.id, req.body);
      res.status(200).json(partner);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await PartnerService.deletePartner(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
