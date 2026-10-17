import cron from 'node-cron';
import { prisma } from '../prisma.js';
import { CoinGeckoService } from '../services/coingecko.service.js';

export const startAlertEvaluatorJob = () => {
  console.log('[Job] Price Alert Evaluator background worker registered (interval: every 60s)');

  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const activeAlerts = await prisma.priceAlert.findMany({
        where: { status: 'ACTIVE' },
        include: { user: { select: { email: true, name: true } } },
      });

      if (activeAlerts.length === 0) return;

      const coins = await CoinGeckoService.getCoins('usd', 1, 100);
      const priceMap = new Map<string, number>();
      coins.forEach((c: any) => {
        priceMap.set(c.id.toLowerCase(), c.current_price || 0);
      });

      for (const alert of activeAlerts) {
        const currentPrice = priceMap.get(alert.coinId.toLowerCase());
        if (!currentPrice) continue;

        const targetPrice = Number(alert.targetPrice);
        let isTriggered = false;

        if (alert.condition === 'ABOVE' && currentPrice >= targetPrice) {
          isTriggered = true;
        } else if (alert.condition === 'BELOW' && currentPrice <= targetPrice) {
          isTriggered = true;
        }

        if (isTriggered) {
          await prisma.priceAlert.update({
            where: { id: alert.id },
            data: {
              status: 'TRIGGERED',
              lastTriggeredAt: new Date(),
            },
          });

          console.log(
            `[Alert Triggered] ${alert.coinName} reached target $${targetPrice} (Current: $${currentPrice}) for user ${alert.user.email}`
          );
        }
      }
    } catch (err: any) {
      console.error('[Job Error] Alert evaluator failed:', err.message);
    }
  });
};

