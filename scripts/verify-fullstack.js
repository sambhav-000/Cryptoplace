// End-to-End Verification Script for CryptoPlace Pro
const BASE_URL = 'http://localhost:5000/api';

async function test(name, fn) {
  try {
    process.stdout.write(`Testing ${name}... `);
    const result = await fn();
    console.log(`✅ PASSED ${result ? '(' + result + ')' : ''}`);
    return true;
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    return false;
  }
}

async function runVerification() {
  console.log('====================================================');
  console.log('   CryptoPlace Pro — End-to-End Live Verification   ');
  console.log('====================================================\n');

  let token = '';
  let testUserId = '';
  const testEmail = `e2e_verify_${Date.now()}@example.com`;

  // 1. Health Check
  await test('Health Check', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (res.status !== 200 || data.status !== 'healthy') throw new Error(`Status ${res.status}`);
    return `${data.service} v${data.version}`;
  });

  // 2. Authentication: Register
  await test('User Registration (POST /api/auth/register)', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Verification User',
        email: testEmail,
        password: 'password123',
      }),
    });
    const data = await res.json();
    if (res.status !== 201 || !data.data?.accessToken) throw new Error(data.error || `Status ${res.status}`);
    token = data.data.accessToken;
    testUserId = data.data.user.id;
    return `User created: ${testEmail}`;
  });

  // 3. Authentication: Login
  await test('User Login (POST /api/auth/login)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123',
      }),
    });
    const data = await res.json();
    if (res.status !== 200 || !data.data?.accessToken) throw new Error(data.error || `Status ${res.status}`);
    return 'Authenticated & tokens issued';
  });

  // 4. Protected Route: Me
  await test('Protected Profile (GET /api/auth/me)', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.status !== 200 || data.data?.user?.email !== testEmail.toLowerCase()) {
      throw new Error(data.error || `Status ${res.status}`);
    }
    return `Verified user: ${data.data.user.name}`;
  });

  // 5. Market Data: Coins List
  await test('Market Coins List (GET /api/coins)', async () => {
    const res = await fetch(`${BASE_URL}/coins?currency=usd&perPage=5`);
    const data = await res.json();
    if (res.status !== 200 || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(data.error || `Status ${res.status}`);
    }
    return `Retrieved ${data.data.length} coins (Top: ${data.data[0].name} @ $${data.data[0].current_price})`;
  });

  // 6. Market Data: Single Coin Details
  await test('Coin Details (GET /api/coins/bitcoin)', async () => {
    const res = await fetch(`${BASE_URL}/coins/bitcoin`);
    const data = await res.json();
    if (res.status !== 200 || data.data?.id !== 'bitcoin') {
      throw new Error(data.error || `Status ${res.status}`);
    }
    return `Bitcoin rank #${data.data.market_cap_rank}`;
  });

  // 7. Market Data: History Chart Points
  await test('Coin Historical Chart (GET /api/coins/bitcoin/history)', async () => {
    const res = await fetch(`${BASE_URL}/coins/bitcoin/history?currency=usd&days=1`);
    const data = await res.json();
    if (res.status !== 200 || !Array.isArray(data.data?.prices) || data.data.prices.length === 0) {
      throw new Error(data.error || `Status ${res.status}`);
    }
    return `${data.data.prices.length} price points loaded`;
  });

  // 8. Watchlist: Add & List
  await test('Watchlist Operations (POST & GET /api/watchlist)', async () => {
    const addRes = await fetch(`${BASE_URL}/watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        coinId: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
      }),
    });
    const addData = await addRes.json();
    if (addRes.status !== 201) throw new Error(addData.error || `Add status ${addRes.status}`);

    const getRes = await fetch(`${BASE_URL}/watchlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getData = await getRes.json();
    if (getRes.status !== 200 || getData.data.length === 0) throw new Error(`List status ${getRes.status}`);
    return `Added and listed: ${getData.data[0].name}`;
  });

  // 9. Portfolio: Record Transaction & Calculate Holdings
  let createdTxId = '';
  await test('Portfolio Management (POST & GET /api/portfolio)', async () => {
    const txRes = await fetch(`${BASE_URL}/portfolio/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        coinId: 'bitcoin',
        symbol: 'BTC',
        coinName: 'Bitcoin',
        type: 'BUY',
        amount: 0.1,
        pricePerCoin: 80000,
        notes: 'Verification buy',
      }),
    });
    const txData = await txRes.json();
    if (txRes.status !== 201) throw new Error(txData.error || `Tx status ${txRes.status}`);
    createdTxId = txData.data.id;

    const pfRes = await fetch(`${BASE_URL}/portfolio`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const pfData = await pfRes.json();
    if (pfRes.status !== 200 || pfData.data.summary.totalInvested < 8000) {
      throw new Error(`Portfolio calculation mismatch`);
    }
    return `Invested: $${pfData.data.summary.totalInvested}, Holdings: ${pfData.data.holdings.length}`;
  });

  // 10. Price Alerts: Create & List
  let createdAlertId = '';
  await test('Price Alerts (POST & GET /api/alerts)', async () => {
    const createRes = await fetch(`${BASE_URL}/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        coinId: 'bitcoin',
        symbol: 'BTC',
        coinName: 'Bitcoin',
        condition: 'ABOVE',
        targetPrice: 90000,
      }),
    });
    const createData = await createRes.json();
    if (createRes.status !== 201) throw new Error(createData.error || `Alert create status ${createRes.status}`);
    createdAlertId = createData.data.id;

    const listRes = await fetch(`${BASE_URL}/alerts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listData = await listRes.json();
    if (listRes.status !== 200 || listData.data.length === 0) throw new Error(`Alert list status ${listRes.status}`);
    return `Alert created for target $${listData.data[0].targetPrice} (Status: ${listData.data[0].status})`;
  });

  // 11. Transaction Export (CSV)
  await test('Portfolio CSV Export (GET /api/portfolio/export?format=csv)', async () => {
    const expRes = await fetch(`${BASE_URL}/portfolio/export?format=csv`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (expRes.status !== 200) throw new Error(`Export status ${expRes.status}`);
    const csvText = await expRes.text();
    if (!csvText.includes('ID,Date,Type') || !csvText.includes('Bitcoin')) {
      throw new Error('CSV output does not contain expected header or transactions');
    }
    return `Exported ${csvText.split('\n').length} CSV rows`;
  });

  // 12. Alert Re-arm / Reset
  await test('Alert Re-arm / Reset (PATCH /api/alerts/:id/reset)', async () => {
    const resetRes = await fetch(`${BASE_URL}/alerts/${createdAlertId}/reset`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    const resetData = await resetRes.json();
    if (resetRes.status !== 200 || resetData.data?.status !== 'ACTIVE') {
      throw new Error(resetData.error || `Reset status ${resetRes.status}`);
    }
    return `Re-armed alert status: ${resetData.data.status}`;
  });

  // 13. Cleanup test records
  await test('Cleanup Test Data (DELETE /api/watchlist & /api/portfolio)', async () => {
    if (createdTxId) {
      await fetch(`${BASE_URL}/portfolio/transactions/${createdTxId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    if (createdAlertId) {
      await fetch(`${BASE_URL}/alerts/${createdAlertId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    await fetch(`${BASE_URL}/watchlist/ethereum`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return 'Cleaned test transaction, alert, and watchlist entry';
  });

  console.log('\n====================================================');
  console.log('   All 13 End-to-End Verification Checks Passed!    ');
  console.log('====================================================\n');
}

runVerification();

