import { Request, Response, NextFunction } from 'express';
import { CoinGeckoService } from '../services/coingecko.service.js';

export const getCoins = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currency = (req.query.currency as string) || 'usd';
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 50;
    const order = (req.query.order as string) || 'market_cap_desc';
    const search = (req.query.search as string) || '';

    let coins = await CoinGeckoService.getCoins(currency, page, perPage, order);

    if (search.trim()) {
      const q = search.toLowerCase();
      coins = coins.filter(
        (c: any) => c.name?.toLowerCase().includes(q) || c.symbol?.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: coins.length,
      data: coins,
    });
  } catch (err) {
    next(err);
  }
};

export const getTrending = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await CoinGeckoService.getTrending();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getCoinById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { coinId } = req.params;
    const data = await CoinGeckoService.getCoinById(coinId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getCoinHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { coinId } = req.params;
    const currency = (req.query.currency as string) || 'usd';
    const days = (req.query.days as string) || '1';

    const data = await CoinGeckoService.getCoinHistory(coinId, currency, days);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

