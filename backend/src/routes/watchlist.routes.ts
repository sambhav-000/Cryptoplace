import { Router } from 'express';
import { 
  getWatchlist, 
  addToWatchlist, 
  removeFromWatchlist 
} from '../controllers/watchlist.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.delete('/:coinId', removeFromWatchlist);

export default router;

