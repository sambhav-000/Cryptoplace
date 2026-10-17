import { PrismaClient, TransactionType, AlertCondition, AlertStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      role: 'USER',
      settings: {
        create: {
          preferredCurrency: 'usd',
          darkMode: true,
          emailAlerts: true,
        },
      },
    },
  });

  console.log(`Seeded user: ${user.name} (${user.email})`);

  // Clear existing records for clean seed
  await prisma.watchlistEntry.deleteMany({ where: { userId: user.id } });
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.priceAlert.deleteMany({ where: { userId: user.id } });

  // Seed watchlist
  const watchlistCoins = [
    { coinId: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
    { coinId: 'ethereum', symbol: 'eth', name: 'Ethereum' },
    { coinId: 'solana', symbol: 'sol', name: 'Solana' },
    { coinId: 'cardano', symbol: 'ada', name: 'Cardano' },
    { coinId: 'dogecoin', symbol: 'doge', name: 'Dogecoin' },
  ];

  for (const c of watchlistCoins) {
    await prisma.watchlistEntry.create({
      data: {
        userId: user.id,
        coinId: c.coinId,
        symbol: c.symbol,
        name: c.name,
      },
    });
  }
  console.log(`Seeded ${watchlistCoins.length} watchlist entries`);

  // Seed portfolio transactions
  const transactions = [
    {
      coinId: 'bitcoin',
      symbol: 'BTC',
      coinName: 'Bitcoin',
      type: TransactionType.BUY,
      amount: 0.0835,
      pricePerCoin: 67432.12,
      totalValue: 5630.58,
      date: new Date('2026-04-28'),
    },
    {
      coinId: 'ethereum',
      symbol: 'ETH',
      coinName: 'Ethereum',
      type: TransactionType.BUY,
      amount: 1.095,
      pricePerCoin: 3254.21,
      totalValue: 3563.36,
      date: new Date('2026-04-25'),
    },
    {
      coinId: 'solana',
      symbol: 'SOL',
      coinName: 'Solana',
      type: TransactionType.BUY,
      amount: 10.84,
      pricePerCoin: 142.56,
      totalValue: 1545.35,
      date: new Date('2026-04-20'),
    },
    {
      coinId: 'cardano',
      symbol: 'ADA',
      coinName: 'Cardano',
      type: TransactionType.BUY,
      amount: 2153.7,
      pricePerCoin: 0.4512,
      totalValue: 971.75,
      date: new Date('2026-04-18'),
    },
  ];

  for (const tx of transactions) {
    await prisma.transaction.create({
      data: {
        userId: user.id,
        ...tx,
      },
    });
  }
  console.log(`Seeded ${transactions.length} portfolio transactions`);

  // Seed price alerts
  const alerts = [
    {
      coinId: 'bitcoin',
      symbol: 'BTC',
      coinName: 'Bitcoin',
      condition: AlertCondition.ABOVE,
      targetPrice: 70000,
      status: AlertStatus.ACTIVE,
    },
    {
      coinId: 'ethereum',
      symbol: 'ETH',
      coinName: 'Ethereum',
      condition: AlertCondition.BELOW,
      targetPrice: 2900,
      status: AlertStatus.ACTIVE,
    },
    {
      coinId: 'solana',
      symbol: 'SOL',
      coinName: 'Solana',
      condition: AlertCondition.ABOVE,
      targetPrice: 150,
      status: AlertStatus.ACTIVE,
    },
    {
      coinId: 'dogecoin',
      symbol: 'DOGE',
      coinName: 'Dogecoin',
      condition: AlertCondition.BELOW,
      targetPrice: 0.15,
      status: AlertStatus.TRIGGERED,
    },
    {
      coinId: 'cardano',
      symbol: 'ADA',
      coinName: 'Cardano',
      condition: AlertCondition.ABOVE,
      targetPrice: 0.50,
      status: AlertStatus.ACTIVE,
    },
  ];

  for (const alt of alerts) {
    await prisma.priceAlert.create({
      data: {
        userId: user.id,
        ...alt,
      },
    });
  }
  console.log(`Seeded ${alerts.length} price alerts`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

