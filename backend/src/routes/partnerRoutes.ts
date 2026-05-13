import { Router } from 'express';
import { PartnerController } from '../controllers/partnerController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, PartnerController.getAll);
router.get('/:id', authenticate, PartnerController.getById);
router.post('/', authenticate, authorize(['admin']), PartnerController.create);
router.patch('/:id', authenticate, authorize(['admin']), PartnerController.update);
router.delete('/:id', authenticate, authorize(['admin']), PartnerController.delete);

export default router;
