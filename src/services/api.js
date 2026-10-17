const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('cp_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    if (data.data?.accessToken) {
      localStorage.setItem('cp_token', data.data.accessToken);
    }
    return data.data;
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    if (data.data?.accessToken) {
      localStorage.setItem('cp_token', data.data.accessToken);
    }
    return data.data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Not authenticated');
    const data = await res.json();
    return data.data?.user;
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {
      // Ignore
    } finally {
      localStorage.removeItem('cp_token');
    }
  },

  // Coins / Markets
  async getCoins(currency = 'usd', page = 1, perPage = 50, search = '') {
    const params = new URLSearchParams({
      currency: currency.toLowerCase(),
      page: page.toString(),
      perPage: perPage.toString(),
      ...(search ? { search } : {}),
    });
    const res = await fetch(`${API_BASE}/coins?${params}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch coins');
    return data.data || [];
  },

  async getCoinById(coinId) {
    const res = await fetch(`${API_BASE}/coins/${coinId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch coin details');
    return data.data;
  },

  async getCoinHistory(coinId, currency = 'usd', days = '1') {
    const res = await fetch(`${API_BASE}/coins/${coinId}/history?currency=${currency}&days=${days}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch coin history');
    return data.data;
  },

  async getTrending() {
    const res = await fetch(`${API_BASE}/coins/trending`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch trending coins');
    return data.data;
  },

  // Portfolio
  async getPortfolio(currency = 'usd') {
    const res = await fetch(`${API_BASE}/portfolio?currency=${currency}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch portfolio');
    return data.data;
  },

  async createTransaction(txData) {
    const res = await fetch(`${API_BASE}/portfolio/transactions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(txData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create transaction');
    return data.data;
  },

  async deleteTransaction(txId) {
    const res = await fetch(`${API_BASE}/portfolio/transactions/${txId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete transaction');
    return data;
  },

  async exportTransactions(format = 'csv') {
    const res = await fetch(`${API_BASE}/portfolio/export?format=${format}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to export transactions');
    if (format === 'csv') {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cryptoplace_transactions_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      return true;
    }
    return await res.json();
  },

  // Watchlist
  async getWatchlist(currency = 'usd') {
    const res = await fetch(`${API_BASE}/watchlist?currency=${currency}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch watchlist');
    return data.data || [];
  },

  async addToWatchlist(coin) {
    const res = await fetch(`${API_BASE}/watchlist`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        coinId: coin.id || coin.coinId,
        symbol: coin.symbol,
        name: coin.name,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add to watchlist');
    return data.data;
  },

  async removeFromWatchlist(coinId) {
    const res = await fetch(`${API_BASE}/watchlist/${coinId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to remove from watchlist');
    return data;
  },

  // Alerts
  async getAlerts() {
    const res = await fetch(`${API_BASE}/alerts`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch alerts');
    return data.data || [];
  },

  async createAlert(alertData) {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        coinId: alertData.coinId,
        symbol: alertData.symbol || alertData.coinId.slice(0, 4).toUpperCase(),
        coinName: alertData.coinName || alertData.coinId,
        condition: alertData.condition.toUpperCase(),
        targetPrice: alertData.targetPrice,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create alert');
    return data.data;
  },

  async resetAlert(alertId) {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/reset`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset alert');
    return data.data;
  },

  async deleteAlert(alertId) {
    const res = await fetch(`${API_BASE}/alerts/${alertId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete alert');
    return data;
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch settings');
    return data.data;
  },

  async updateSettings(settings) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data.data;
  },
};

export default api;

