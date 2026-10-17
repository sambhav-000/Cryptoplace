import { Router } from 'express';
import { 
  getAlerts, 
  createAlert, 
  updateAlert, 
  deleteAlert,
  resetAlert 
} from '../controllers/alerts.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getAlerts);
router.post('/', createAlert);
router.patch('/:id', updateAlert);
router.patch('/:id/reset', resetAlert);
router.delete('/:id', deleteAlert);

export default router;

