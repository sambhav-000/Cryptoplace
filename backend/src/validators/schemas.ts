import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const transactionSchema = z.object({
  coinId: z.string().min(1, 'Coin ID is required'),
  symbol: z.string().min(1, 'Symbol is required'),
  coinName: z.string().min(1, 'Coin name is required'),
  type: z.enum(['BUY', 'SELL']),
  amount: z.coerce.number().positive('Amount must be positive'),
  pricePerCoin: z.coerce.number().positive('Price per coin must be positive'),
  fee: z.coerce.number().min(0).optional().default(0),
  notes: z.string().max(255).optional(),
  date: z.string().or(z.date()).optional(),
});

export const alertSchema = z.object({
  coinId: z.string().min(1, 'Coin ID is required'),
  symbol: z.string().min(1, 'Symbol is required'),
  coinName: z.string().min(1, 'Coin name is required'),
  condition: z.enum(['ABOVE', 'BELOW']),
  targetPrice: z.coerce.number().positive('Target price must be positive'),
});

export const alertUpdateSchema = z.object({
  condition: z.enum(['ABOVE', 'BELOW']).optional(),
  targetPrice: z.coerce.number().positive('Target price must be positive').optional(),
  status: z.enum(['ACTIVE', 'TRIGGERED', 'DISABLED']).optional(),
});

export const watchlistSchema = z.object({
  coinId: z.string().min(1, 'Coin ID is required'),
  symbol: z.string().min(1, 'Symbol is required'),
  name: z.string().min(1, 'Name is required'),
});

export const settingsSchema = z.object({
  preferredCurrency: z.enum(['usd', 'eur', 'inr', 'gbp']).optional(),
  darkMode: z.boolean().optional(),
  emailAlerts: z.boolean().optional(),
});

