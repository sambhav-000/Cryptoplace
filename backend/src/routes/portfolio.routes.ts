import { Router } from 'express';
import { 
  getPortfolio, 
  getTransactions, 
  createTransaction, 
  deleteTransaction,
  exportTransactions 
} from '../controllers/portfolio.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getPortfolio);
router.get('/transactions', getTransactions);
router.get('/export', exportTransactions);
router.post('/transactions', createTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;

