import { Request, Response } from 'express';
import { CommissionService } from '../services/commissionService';

export class AnalyticsController {
  static async getPartnerStats(req: Request, res: Response) {
    try {
      const stats = await CommissionService.getPartnerEarnings(req.params.partnerId);
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getGlobalStats(req: Request, res: Response) {
    try {
      const stats = await CommissionService.getGlobalPerformance();
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
