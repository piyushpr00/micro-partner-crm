import { Router } from 'express';
import { WalletController } from '../controllers/walletController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/leaderboard', authenticate, WalletController.getLeaderboard);
router.get('/:partnerId', authenticate, WalletController.getWallet);
router.post('/payout', authenticate, WalletController.requestPayout);

export default router;
