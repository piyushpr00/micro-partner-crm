import { Router } from 'express';
import { LeadController } from '../controllers/leadController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, LeadController.getAll);
router.get('/:id', authenticate, LeadController.getById);
router.get('/partner/:partnerId', authenticate, LeadController.getByPartner);
router.post('/', authenticate, LeadController.create);
router.patch('/:id', authenticate, LeadController.update);
router.delete('/:id', authenticate, LeadController.delete);

export default router;
