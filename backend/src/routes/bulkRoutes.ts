import { Router } from 'express';
import { BulkImportController } from '../controllers/bulkImportController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/leads', authenticate, BulkImportController.importLeads);

export default router;
