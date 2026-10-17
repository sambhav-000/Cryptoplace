import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma.js';
import { watchlistSchema } from '../validators/schemas.js';
import { CoinGeckoService } from '../services/coingecko.service.js';

export const getWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const currency = (req.query.currency as string) || 'usd';

    const entries = await prisma.watchlistEntry.findMany({
      where: { userId },
      orderBy: { addedAt: 'desc' },
    });

    if (entries.length === 0) {
      res.json({ success: true, count: 0, data: [] });
      return;
    }

    // Get live coin data
    const allMarketCoins = await CoinGeckoService.getCoins(currency, 1, 100);
    const marketMap = new Map<string, any>();
    allMarketCoins.forEach((c: any) => {
      marketMap.set(c.id.toLowerCase(), c);
    });

    const enriched = entries.map((entry) => {
      const live = marketMap.get(entry.coinId.toLowerCase()) || {
        current_price: 0,
        price_change_percentage_24h: 0,
        market_cap: 0,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      };

      return {
        id: entry.id,
        coinId: entry.coinId,
        symbol: entry.symbol.toUpperCase(),
        name: entry.name,
        current_price: live.current_price,
        price_change_percentage_24h: live.price_change_percentage_24h,
        market_cap: live.market_cap,
        image: live.image,
        addedAt: entry.addedAt,
      };
    });

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (err) {
    next(err);
  }
};

export const addToWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const validated = watchlistSchema.parse(req.body);

    const existing = await prisma.watchlistEntry.findUnique({
      where: {
        userId_coinId: {
          userId,
          coinId: validated.coinId.toLowerCase(),
        },
      },
    });

    if (existing) {
      res.status(409).json({ success: false, error: 'Coin is already in your watchlist' });
      return;
    }

    const entry = await prisma.watchlistEntry.create({
      data: {
        userId,
        coinId: validated.coinId.toLowerCase(),
        symbol: validated.symbol.toUpperCase(),
        name: validated.name,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Coin added to watchlist',
      data: entry,
    });
  } catch (err) {
    next(err);
  }
};

export const removeFromWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { coinId } = req.params;

    const entry = await prisma.watchlistEntry.findFirst({
      where: {
        userId,
        coinId: coinId.toLowerCase(),
      },
    });

    if (!entry) {
      res.status(404).json({ success: false, error: 'Watchlist entry not found' });
      return;
    }

    await prisma.watchlistEntry.delete({
      where: { id: entry.id },
    });

    res.json({
      success: true,
      message: 'Coin removed from watchlist',
    });
  } catch (err) {
    next(err);
  }
};

