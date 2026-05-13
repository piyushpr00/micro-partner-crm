import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/global', authenticate, authorize(['admin']), AnalyticsController.getGlobalStats);
router.get('/partner/:partnerId', authenticate, AnalyticsController.getPartnerStats);

export default router;
