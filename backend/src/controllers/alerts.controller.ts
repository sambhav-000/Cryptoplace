import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma.js';
import { alertSchema, alertUpdateSchema } from '../validators/schemas.js';
import { CoinGeckoService } from '../services/coingecko.service.js';
import { Prisma } from '@prisma/client';

export const getAlerts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;

    const alerts = await prisma.priceAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const marketCoins = await CoinGeckoService.getCoins('usd', 1, 100);
    const priceMap = new Map<string, any>();
    marketCoins.forEach((c: any) => {
      priceMap.set(c.id.toLowerCase(), c);
    });

    const enriched = alerts.map((a) => {
      const coin = priceMap.get(a.coinId.toLowerCase()) || {
        current_price: 0,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      };

      const targetPrice = Number(a.targetPrice);
      const currentPrice = coin.current_price;
      const isTriggered =
        a.status === 'TRIGGERED' ||
        (a.status === 'ACTIVE' &&
          ((a.condition === 'ABOVE' && currentPrice >= targetPrice) ||
            (a.condition === 'BELOW' && currentPrice <= targetPrice)));

      return {
        id: a.id,
        coinId: a.coinId,
        symbol: a.symbol.toUpperCase(),
        coinName: a.coinName,
        condition: a.condition === 'ABOVE' ? 'above' : 'below',
        targetPrice,
        currentPrice,
        status: isTriggered ? 'Triggered' : a.status === 'ACTIVE' ? 'Active' : 'Disabled',
        image: coin.image,
        createdAt: a.createdAt,
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

export const createAlert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const validated = alertSchema.parse(req.body);

    const alert = await prisma.priceAlert.create({
      data: {
        userId,
        coinId: validated.coinId.toLowerCase(),
        symbol: validated.symbol.toUpperCase(),
        coinName: validated.coinName,
        condition: validated.condition,
        targetPrice: new Prisma.Decimal(validated.targetPrice),
        status: 'ACTIVE',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Price alert created successfully',
      data: alert,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAlert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const validated = alertUpdateSchema.parse(req.body);

    const existing = await prisma.priceAlert.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, error: 'Alert not found' });
      return;
    }

    const updated = await prisma.priceAlert.update({
      where: { id },
      data: {
        ...(validated.condition ? { condition: validated.condition } : {}),
        ...(validated.targetPrice ? { targetPrice: new Prisma.Decimal(validated.targetPrice) } : {}),
        ...(validated.status ? { status: validated.status } : {}),
      },
    });

    res.json({
      success: true,
      message: 'Alert updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAlert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existing = await prisma.priceAlert.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, error: 'Alert not found' });
      return;
    }

    await prisma.priceAlert.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Alert deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const resetAlert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existing = await prisma.priceAlert.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, error: 'Alert not found' });
      return;
    }

    const updated = await prisma.priceAlert.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        lastTriggeredAt: null,
      },
    });

    res.json({
      success: true,
      message: 'Alert re-armed to Active',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

