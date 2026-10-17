import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/prisma.js';

describe('CryptoPlace Pro API Test Suite', () => {
  let authToken = '';
  const testEmail = `testuser_${Date.now()}@example.com`;

  afterAll(async () => {
    // Cleanup test user
    await prisma.user.deleteMany({
      where: { email: { contains: 'testuser_' } },
    });
    await prisma.$disconnect();
  });

  describe('1. Health Check', () => {
    it('GET /api/health should return status healthy', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('CryptoPlace Pro Backend API');
    });
  });

  describe('2. Authentication Flow', () => {
    it('POST /api/auth/register should create a new user and return tokens', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test Trader',
        email: testEmail,
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail.toLowerCase());
      expect(res.body.data.accessToken).toBeDefined();

      authToken = res.body.data.accessToken;
    });

    it('POST /api/auth/login should authenticate user with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testEmail,
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('POST /api/auth/login should reject invalid password with 401', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testEmail,
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/auth/me should return authenticated user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail.toLowerCase());
    });
  });

  describe('3. Market Data Endpoints', () => {
    it('GET /api/coins should return list of cryptocurrencies', async () => {
      const res = await request(app).get('/api/coins?currency=usd&page=1&perPage=10');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.data[0]).toHaveProperty('current_price');
    });

    it('GET /api/coins/bitcoin should return bitcoin details', async () => {
      const res = await request(app).get('/api/coins/bitcoin');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('bitcoin');
    });

    it('GET /api/coins/bitcoin/history should return price points', async () => {
      const res = await request(app).get('/api/coins/bitcoin/history?currency=usd&days=1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('prices');
      expect(Array.isArray(res.body.data.prices)).toBe(true);
    });
  });

  describe('4. Watchlist Endpoints', () => {
    it('POST /api/watchlist should add a coin to watchlist', async () => {
      const res = await request(app)
        .post('/api/watchlist')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          coinId: 'solana',
          symbol: 'SOL',
          name: 'Solana',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.coinId).toBe('solana');
    });

    it('POST /api/watchlist should reject duplicate entry with 409', async () => {
      const res = await request(app)
        .post('/api/watchlist')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          coinId: 'solana',
          symbol: 'SOL',
          name: 'Solana',
        });

      expect(res.status).toBe(409);
    });

    it('GET /api/watchlist should return user watchlist with market prices', async () => {
      const res = await request(app)
        .get('/api/watchlist')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].coinId).toBe('solana');
    });

    it('DELETE /api/watchlist/:coinId should remove coin from watchlist', async () => {
      const res = await request(app)
        .delete('/api/watchlist/solana')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('5. Portfolio & Transaction Calculations', () => {
    let createdTxId = '';

    it('POST /api/portfolio/transactions should record a BUY trade', async () => {
      const res = await request(app)
        .post('/api/portfolio/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          coinId: 'bitcoin',
          symbol: 'BTC',
          coinName: 'Bitcoin',
          type: 'BUY',
          amount: 0.5,
          pricePerCoin: 65000,
          notes: 'Dip buy test',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.type).toBe('BUY');
      createdTxId = res.body.data.id;
    });

    it('GET /api/portfolio should return summary, holdings, and allocations', async () => {
      const res = await request(app)
        .get('/api/portfolio')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary).toBeDefined();
      expect(res.body.data.summary.totalInvested).toBeGreaterThan(0);
      expect(Array.isArray(res.body.data.holdings)).toBe(true);
      expect(res.body.data.holdings[0].symbol).toBe('BTC');
    });

    it('DELETE /api/portfolio/transactions/:id should delete transaction', async () => {
      const res = await request(app)
        .delete(`/api/portfolio/transactions/${createdTxId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('6. Price Alerts', () => {
    let alertId = '';

    it('POST /api/alerts should create a target price alert', async () => {
      const res = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          coinId: 'bitcoin',
          symbol: 'BTC',
          coinName: 'Bitcoin',
          condition: 'ABOVE',
          targetPrice: 75000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.condition).toBe('ABOVE');
      alertId = res.body.data.id;
    });

    it('GET /api/alerts should list price alerts with status evaluation', async () => {
      const res = await request(app)
        .get('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].targetPrice).toBe(75000);
    });

    it('DELETE /api/alerts/:id should remove alert', async () => {
      const res = await request(app)
        .delete(`/api/alerts/${alertId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('7. User Settings', () => {
    it('GET /api/settings should return user preferences', async () => {
      const res = await request(app)
        .get('/api/settings')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.preferredCurrency).toBe('usd');
    });

    it('PATCH /api/settings should update preferences', async () => {
      const res = await request(app)
        .patch('/api/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          preferredCurrency: 'eur',
          darkMode: true,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.preferredCurrency).toBe('eur');
    });
  });
});

