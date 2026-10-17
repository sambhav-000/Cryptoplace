# CryptoPlace Pro — Full-Stack Cryptocurrency Portfolio & Analytics Platform

CryptoPlace Pro is a full-stack cryptocurrency intelligence and portfolio tracking platform. It delivers live market prices, real-time portfolio accounting, interactive historical price charts, watchlists, target price alert automation, and secure user authentication.

---

## 🏗️ Architecture Overview

The system is organized into a decoupled, clean architecture:

```
cryptoplace-pro/
├── src/                          # React Frontend (Vite)
│   ├── assets/                   # Static branding & visual assets
│   ├── components/               # Reusable UI components
│   │   ├── AppLayout/            # App shell with sidebar & header
│   │   ├── Charts/               # SVG Spline & Donut charts
│   │   ├── Header/               # Topbar with search, currency, notifications
│   │   ├── Modals/               # Trade, Alert, Watchlist, Auth modals
│   │   ├── Navbar/               # Landing page navigation
│   │   └── Sidebar/              # Left navigation sidebar
│   ├── context/                  # Global CoinContext with live API sync
│   ├── pages/                    # Core views: Dashboard, Markets, Coin, Portfolio, etc.
│   └── services/                 # Centralized HTTP API client (api.js)
├── backend/                      # Production Express & TypeScript REST API
│   ├── prisma/                   # Prisma schema, migrations, and seed script
│   ├── src/
│   │   ├── controllers/          # Business logic (auth, coins, portfolio, alerts)
│   │   ├── jobs/                 # Cron background alert evaluator worker
│   │   ├── middleware/           # JWT auth, error handler, rate limiters
│   │   ├── routes/               # Express REST route definitions
│   │   ├── services/             # CoinGecko client with node-cache
│   │   ├── validators/           # Zod schema validation
│   │   ├── app.ts                # Express application setup
│   │   └── server.ts             # Server entry point
│   └── tests/                    # Vitest & Supertest API test suite
├── docker-compose.yml            # Multi-container orchestration (PostgreSQL, API, Nginx)
├── Dockerfile.frontend           # Multi-stage production frontend image
├── Dockerfile.backend            # Multi-stage production backend image
├── .github/workflows/ci.yml      # CI/CD automated pipeline
└── README.md
```

---

## 🚀 Key Features

### 1. Real-Time Cryptocurrency Markets
- Live price streaming, 24h price change percentages, market caps, and 24h volumes via CoinGecko API.
- Multi-currency conversion: **USD ($)**, **EUR (€)**, **INR (₹)**, and **GBP (£)**.
- Filter pills: `All`, `Top 100`, `Gainers`, and `Losers`.
- Real-time global search bar with instant autocomplete suggestions.

### 2. Comprehensive Dashboard
- **4 Key Metrics**: Total Portfolio Value, Total Profit/Loss, Watchlist Coins Count, and Active Price Alerts.
- **Portfolio Performance Chart**: Smooth interactive spline area chart with timeframe filters (`1D`, `7D`, `30D`, `1Y`) and interactive tooltips.
- **Top Movers List**: Live ranking of top 24-hour cryptocurrency gainers.

### 3. Detailed Coin Analytics
- Dedicated coin profile page with live price strip and stats: Market Cap, 24h Volume, Circulating Supply, and 24h High/Low.
- Interactive historical chart with **Line** and **Candle** view modes across `1D`, `7D`, `30D`, `1Y`, and `ALL` timeframes.
- Verified metadata: Official website, whitepaper links, crypto category, and ranking.

### 4. Portfolio Management & Accounting
- Simulated cryptocurrency purchases and sales with decimal-safe numeric precision.
- Automated cost-basis tracking: average buy price, current portfolio valuation, and realized/unrealized profit & loss.
- **Asset Allocation Donut Chart**: visual percentage breakdown across portfolio assets.
- Transaction history stream with Buy/Sell badges, amounts, and dates.

### 5. Watchlist & Price Alerts
- User-specific watchlists stored in PostgreSQL with unique constraint deduplication.
- Automated price alerts with condition rules (`ABOVE` / `BELOW` target price).
- **Background Cron Worker**: Evaluates active price alerts every 60 seconds against real-time market prices and flags triggered targets.

### 6. Authentication & Security
- Secure registration and login using **bcryptjs** (10 salt rounds) and **JWT** (access & refresh tokens).
- Protected API routes with `authenticate` middleware.
- Security headers with **Helmet**, strict **CORS** origin validation, and IP rate limiting (120 req/min).

---

## 📡 REST API Documentation

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Service health check |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Bearer | Fetch authenticated user profile |
| `POST` | `/api/auth/logout` | Bearer | Invalidate user session |
| `GET` | `/api/coins` | Public | Paginated market listings (with search & currency) |
| `GET` | `/api/coins/trending` | Public | Trending coins from CoinGecko |
| `GET` | `/api/coins/:coinId` | Public | Single coin details & profile |
| `GET` | `/api/coins/:coinId/history` | Public | Historical price series for charts |
| `GET` | `/api/portfolio` | Bearer | Get portfolio summary, holdings & allocations |
| `GET` | `/api/portfolio/transactions` | Bearer | List user transaction records |
| `POST` | `/api/portfolio/transactions` | Bearer | Record a new BUY or SELL transaction |
| `DELETE`| `/api/portfolio/transactions/:id` | Bearer | Delete a transaction record |
| `GET` | `/api/watchlist` | Bearer | Get saved watchlist with live prices |
| `POST` | `/api/watchlist` | Bearer | Add a coin to watchlist |
| `DELETE`| `/api/watchlist/:coinId` | Bearer | Remove coin from watchlist |
| `GET` | `/api/alerts` | Bearer | List user price alerts with status |
| `POST` | `/api/alerts` | Bearer | Create target price alert (`ABOVE` / `BELOW`) |
| `PATCH` | `/api/alerts/:id` | Bearer | Update or reset alert status |
| `DELETE`| `/api/alerts/:id` | Bearer | Delete a price alert |
| `GET` | `/api/settings` | Bearer | Get user preferences |
| `PATCH` | `/api/settings` | Bearer | Update preferred currency, theme, notifications |

---

## 🗄️ Database Schema (Prisma PostgreSQL)

- **`users`**: User identity, hashed credentials, avatar, and roles.
- **`refresh_tokens`**: Managed JWT refresh tokens with expiration timestamps.
- **`watchlist_entries`**: User saved coins with unique composite constraint `(userId, coinId)`.
- **`portfolio_transactions`**: Financial transaction ledger (`Decimal(24, 8)` amount and price per coin, `Decimal(24, 4)` total value, type `BUY`/`SELL`).
- **`price_alerts`**: Target price alerts with status `ACTIVE`, `TRIGGERED`, or `DISABLED`.
- **`user_settings`**: Display preferences (`preferredCurrency`, `darkMode`, `emailAlerts`).

---

## 🛠️ Local Development & Setup

### Prerequisites
- Node.js 18.x or 20.x
- PostgreSQL 14+ running locally (or Docker)

### 1. Installation
```bash
# Clone the repository
git clone <repo-url>
cd cryptoplace-main

# Install root & frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Setup
Create `backend/.env` (or copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/cryptoplace?schema=public"
JWT_SECRET="cryptoplace_pro_super_secret_jwt_key_2026_secure"
COINGECKO_BASE_URL="https://api.coingecko.com/api/v3"
FRONTEND_URL="http://localhost:5173"
```

### 3. Database Migration & Seed
```bash
cd backend

# Sync schema with PostgreSQL
npx prisma db push

# Seed demo user (john@example.com / password123), watchlist, portfolio & alerts
npx tsx prisma/seed.ts
cd ..
```

### 4. Run Both Frontend and Backend
From the root directory:
```bash
npm run dev
```
- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:5000**
- Health Check: **http://localhost:5000/api/health**

---

## 🧪 Running Tests

The test suite runs with Vitest and Supertest, verifying all authentication endpoints, market data caching, portfolio financial calculations, and watchlist/alert database operations.

```bash
# Run backend test suite
npm run test:backend
```

**Test Results:**
```
 ✓ tests/api.test.ts (20 tests) 6.3s
   ✓ 1. Health Check > GET /api/health
   ✓ 2. Authentication Flow > POST /api/auth/register
   ✓ 2. Authentication Flow > POST /api/auth/login
   ✓ 2. Authentication Flow > GET /api/auth/me
   ✓ 3. Market Data Endpoints > GET /api/coins
   ✓ 3. Market Data Endpoints > GET /api/coins/bitcoin
   ✓ 3. Market Data Endpoints > GET /api/coins/bitcoin/history
   ✓ 4. Watchlist Endpoints > POST /api/watchlist
   ✓ 4. Watchlist Endpoints > GET /api/watchlist
   ✓ 4. Watchlist Endpoints > DELETE /api/watchlist/:coinId
   ✓ 5. Portfolio & Transaction Calculations > POST /api/portfolio/transactions
   ✓ 5. Portfolio & Transaction Calculations > GET /api/portfolio
   ✓ 5. Portfolio & Transaction Calculations > DELETE /api/portfolio/transactions/:id
   ✓ 6. Price Alerts > POST /api/alerts
   ✓ 6. Price Alerts > GET /api/alerts
   ✓ 6. Price Alerts > DELETE /api/alerts/:id
   ✓ 7. User Settings > GET /api/settings
   ✓ 7. User Settings > PATCH /api/settings

Test Files  1 passed (1)
     Tests  20 passed (20)
```

---

## 🐳 Docker Deployment

To launch the full production environment (PostgreSQL + Express Backend + Nginx Frontend) with a single command:

```bash
docker-compose up --build -d
```

- Web Application: **http://localhost:3000**
- API Service: **http://localhost:5000/api**
- PostgreSQL Database: **localhost:5432**

To stop the containers:
```bash
docker-compose down
```
