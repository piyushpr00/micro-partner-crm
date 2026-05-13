import { Request, Response } from 'express';
import { WalletService } from '../services/walletService';

export class WalletController {
  static async getWallet(req: Request, res: Response) {
    try {
      const wallet = await WalletService.getWalletByPartner(req.params.partnerId);
      res.status(200).json(wallet);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async requestPayout(req: Request, res: Response) {
    try {
      const { walletId, amount } = req.body;
      const payout = await WalletService.requestPayout(walletId, amount);
      res.status(201).json(payout);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await WalletService.getLeaderboard();
      res.status(200).json(leaderboard);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
