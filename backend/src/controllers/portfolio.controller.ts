import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma.js';
import { transactionSchema } from '../validators/schemas.js';
import { CoinGeckoService } from '../services/coingecko.service.js';
import { Prisma } from '@prisma/client';

export const getPortfolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const currency = (req.query.currency as string) || 'usd';

    // Fetch user's transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    // Fetch live market data to compute current prices and valuation
    const marketCoins = await CoinGeckoService.getCoins(currency, 1, 100);
    const priceMap = new Map<string, number>();
    marketCoins.forEach((c: any) => {
      priceMap.set(c.id.toLowerCase(), c.current_price || 0);
      priceMap.set(c.symbol.toLowerCase(), c.current_price || 0);
    });

    // Aggregate holdings per coin
    const holdingsMap = new Map<string, {
      coinId: string;
      symbol: string;
      coinName: string;
      totalQuantity: number;
      totalCostBasis: number;
      realizedProfit: number;
    }>();

    let totalInvested = 0;
    let totalRealizedProfit = 0;

    for (const tx of transactions) {
      const key = tx.coinId.toLowerCase();
      if (!holdingsMap.has(key)) {
        holdingsMap.set(key, {
          coinId: tx.coinId,
          symbol: tx.symbol.toUpperCase(),
          coinName: tx.coinName,
          totalQuantity: 0,
          totalCostBasis: 0,
          realizedProfit: 0,
        });
      }

      const holding = holdingsMap.get(key)!;
      const amount = Number(tx.amount);
      const price = Number(tx.pricePerCoin);
      const total = Number(tx.totalValue);

      if (tx.type === 'BUY') {
        holding.totalQuantity += amount;
        holding.totalCostBasis += total;
        totalInvested += total;
      } else if (tx.type === 'SELL') {
        // Average cost per unit before this sell
        const avgCost = holding.totalQuantity > 0 ? holding.totalCostBasis / holding.totalQuantity : 0;
        const costOfSold = amount * avgCost;
        const profit = total - costOfSold;

        holding.realizedProfit += profit;
        totalRealizedProfit += profit;
        holding.totalQuantity = Math.max(0, holding.totalQuantity - amount);
        holding.totalCostBasis = Math.max(0, holding.totalCostBasis - costOfSold);
      }
    }

    // Build current holdings breakdown and portfolio totals
    let currentPortfolioValue = 0;
    const holdings = Array.from(holdingsMap.values())
      .filter((h) => h.totalQuantity > 0.000001)
      .map((h) => {
        const currentPrice = priceMap.get(h.coinId.toLowerCase()) || (h.totalCostBasis / h.totalQuantity);
        const currentValue = h.totalQuantity * currentPrice;
        const avgBuyPrice = h.totalQuantity > 0 ? h.totalCostBasis / h.totalQuantity : 0;
        const unrealizedPL = currentValue - h.totalCostBasis;
        const unrealizedPLPercent = h.totalCostBasis > 0 ? (unrealizedPL / h.totalCostBasis) * 100 : 0;

        currentPortfolioValue += currentValue;

        return {
          coinId: h.coinId,
          symbol: h.symbol,
          coinName: h.coinName,
          quantity: +h.totalQuantity.toFixed(8),
          averageBuyPrice: +avgBuyPrice.toFixed(4),
          currentPrice: +currentPrice.toFixed(4),
          totalCostBasis: +h.totalCostBasis.toFixed(2),
          currentValue: +currentValue.toFixed(2),
          unrealizedProfitLoss: +unrealizedPL.toFixed(2),
          unrealizedProfitLossPercent: +unrealizedPLPercent.toFixed(2),
          realizedProfit: +h.realizedProfit.toFixed(2),
        };
      });

    // Asset allocation percentages
    const colorPalette = ['#f59e0b', '#6366f1', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];
    const allocations = holdings.map((h, i) => ({
      name: h.coinName,
      symbol: h.symbol,
      value: h.currentValue,
      percent: currentPortfolioValue > 0 ? +( (h.currentValue / currentPortfolioValue) * 100 ).toFixed(1) : 0,
      color: colorPalette[i % colorPalette.length],
    }));

    const totalPL = currentPortfolioValue - totalInvested + totalRealizedProfit;
    const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalValue: +currentPortfolioValue.toFixed(2),
          totalInvested: +totalInvested.toFixed(2),
          totalProfitLoss: +totalPL.toFixed(2),
          profitPercent: +totalPLPercent.toFixed(2),
          realizedProfit: +totalRealizedProfit.toFixed(2),
        },
        allocations,
        holdings,
        recentTransactions: transactions.slice(0, 10).map((t) => ({
          id: t.id,
          type: t.type === 'BUY' ? 'Bought' : 'Sold',
          coin: t.coinName,
          symbol: t.symbol,
          amount: `${Number(t.amount)} ${t.symbol}`,
          total: `$${Number(t.totalValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          date: t.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          status: 'Completed',
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
};

export const createTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const validated = transactionSchema.parse(req.body);

    const totalValue = +(validated.amount * validated.pricePerCoin).toFixed(4);

    const tx = await prisma.transaction.create({
      data: {
        userId,
        coinId: validated.coinId.toLowerCase(),
        symbol: validated.symbol.toUpperCase(),
        coinName: validated.coinName,
        type: validated.type,
        amount: new Prisma.Decimal(validated.amount),
        pricePerCoin: new Prisma.Decimal(validated.pricePerCoin),
        totalValue: new Prisma.Decimal(totalValue),
        fee: new Prisma.Decimal(validated.fee || 0),
        notes: validated.notes,
        date: validated.date ? new Date(validated.date) : new Date(),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully',
      data: tx,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existing = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, error: 'Transaction not found or unauthorized' });
      return;
    }

    await prisma.transaction.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const exportTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const format = ((req.query.format as string) || 'csv').toLowerCase();

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    if (format === 'json') {
      res.json({ success: true, count: transactions.length, data: transactions });
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Coin', 'Symbol', 'Amount', 'Price Per Coin', 'Total Value', 'Fee', 'Notes'];
    const rows = transactions.map((t) => [
      t.id,
      t.date.toISOString().split('T')[0],
      t.type,
      `"${t.coinName.replace(/"/g, '""')}"`,
      t.symbol,
      Number(t.amount),
      Number(t.pricePerCoin),
      Number(t.totalValue),
      Number(t.fee),
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="cryptoplace_transactions.csv"');
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};

