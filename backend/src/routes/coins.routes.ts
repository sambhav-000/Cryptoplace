import { Router } from 'express';
import { getCoins, getTrending, getCoinById, getCoinHistory } from '../controllers/coins.controller.js';

const router = Router();

router.get('/', getCoins);
router.get('/trending', getTrending);
router.get('/:coinId', getCoinById);
router.get('/:coinId/history', getCoinHistory);

export default router;

