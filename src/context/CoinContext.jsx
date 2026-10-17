import { createContext, useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { FALLBACK_COINS, INITIAL_WATCHLIST, INITIAL_ALERTS, INITIAL_PORTFOLIO, PORTFOLIO_HISTORY } from "./mockData";

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
  const [allCoin, setAllCoin] = useState(FALLBACK_COINS);
  const [loadingCoins, setLoadingCoins] = useState(false);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
    rate: 1
  });

  // User auth state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("cp_user");
      return saved ? JSON.parse(saved) : {
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        isLoggedIn: true
      };
    } catch {
      return null;
    }
  });

  // Watchlist state (stored as array of coin IDs)
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem("cp_watchlist");
      return saved ? JSON.parse(saved) : INITIAL_WATCHLIST;
    } catch {
      return INITIAL_WATCHLIST;
    }
  });

  // Alerts state
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem("cp_alerts");
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  // Portfolio state
  const [portfolio, setPortfolio] = useState(() => {
    try {
      const saved = localStorage.getItem("cp_portfolio");
      return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
    } catch {
      return INITIAL_PORTFOLIO;
    }
  });

  // Modals state
  const [tradeModal, setTradeModal] = useState({ isOpen: false, coin: null, mode: 'Buy' });
  const [alertModal, setAlertModal] = useState({ isOpen: false, coin: null });
  const [watchlistModal, setWatchlistModal] = useState({ isOpen: false });

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Fetch all coins from backend
  const fetchAllCoin = async () => {
    setLoadingCoins(true);
    try {
      const coins = await api.getCoins(currency.name, 1, 100);
      if (Array.isArray(coins) && coins.length > 0) {
        setAllCoin(coins);
      }
    } catch (err) {
      console.warn("Using baseline market data:", err.message);
    } finally {
      setLoadingCoins(false);
    }
  };

  // Fetch user data from backend if authenticated
  const fetchUserData = async () => {
    const token = localStorage.getItem("cp_token");
    if (!token) return;

    try {
      // Fetch user profile
      const profile = await api.getMe();
      if (profile) {
        setUser({ ...profile, isLoggedIn: true });
        localStorage.setItem("cp_user", JSON.stringify({ ...profile, isLoggedIn: true }));
      }

      // Fetch user watchlist
      const wl = await api.getWatchlist(currency.name);
      if (Array.isArray(wl)) {
        const ids = wl.map((item) => item.coinId);
        setWatchlist(ids);
        localStorage.setItem("cp_watchlist", JSON.stringify(ids));
      }

      // Fetch user alerts
      const al = await api.getAlerts();
      if (Array.isArray(al)) {
        setAlerts(al);
        localStorage.setItem("cp_alerts", JSON.stringify(al));
      }

      // Fetch portfolio
      const pf = await api.getPortfolio(currency.name);
      if (pf && pf.summary) {
        const formattedPf = {
          totalValue: pf.summary.totalValue,
          totalInvested: pf.summary.totalInvested,
          profitPercent: pf.summary.profitPercent,
          profitAmount: pf.summary.totalProfitLoss,
          allocations: pf.allocations || [],
          transactions: pf.recentTransactions || [],
        };
        setPortfolio(formattedPf);
        localStorage.setItem("cp_portfolio", JSON.stringify(formattedPf));
      }
    } catch (err) {
      console.warn("Backend user sync notice:", err.message);
    }
  };

  useEffect(() => {
    fetchAllCoin();
  }, [currency.name]);

  useEffect(() => {
    fetchUserData();
  }, [currency.name]);

  // Currency handler
  const changeCurrency = async (code) => {
    const symbolMap = { usd: "$", eur: "€", inr: "₹", gbp: "£" };
    const rateMap = { usd: 1, eur: 0.92, inr: 83.5, gbp: 0.79 };
    const lower = code.toLowerCase();
    
    setCurrency({
      name: lower,
      symbol: symbolMap[lower] || "$",
      rate: rateMap[lower] || 1
    });

    try {
      await api.updateSettings({ preferredCurrency: lower });
    } catch {
      // Local fallback
    }
    showToast(`Currency changed to ${code.toUpperCase()}`);
  };

  // Watchlist methods
  const addToWatchlist = async (coinId) => {
    const coin = allCoin.find((c) => c.id === coinId) || { id: coinId, symbol: coinId, name: coinId };
    try {
      await api.addToWatchlist(coin);
    } catch (err) {
      console.warn('Backend addToWatchlist notice:', err.message);
    }
    const updated = [...new Set([...watchlist, coinId])];
    setWatchlist(updated);
    localStorage.setItem("cp_watchlist", JSON.stringify(updated));
    showToast(`Added to Watchlist`);
  };

  const removeFromWatchlist = async (coinId) => {
    try {
      await api.removeFromWatchlist(coinId);
    } catch (err) {
      console.warn('Backend removeFromWatchlist notice:', err.message);
    }
    const updated = watchlist.filter((id) => id !== coinId);
    setWatchlist(updated);
    localStorage.setItem("cp_watchlist", JSON.stringify(updated));
    showToast(`Removed from Watchlist`, "info");
  };

  const toggleWatchlist = (coinId) => {
    if (watchlist.includes(coinId)) {
      removeFromWatchlist(coinId);
    } else {
      addToWatchlist(coinId);
    }
  };

  const isInWatchlist = (coinId) => watchlist.includes(coinId);

  // Alert methods
  const addAlert = async (alertData) => {
    const coin = allCoin.find((c) => c.id === alertData.coinId) || { name: alertData.coinId, symbol: alertData.coinId };
    try {
      const created = await api.createAlert({
        coinId: alertData.coinId,
        symbol: coin.symbol,
        coinName: coin.name,
        condition: alertData.condition,
        targetPrice: alertData.targetPrice,
      });
      if (created) {
        setAlerts([created, ...alerts]);
      }
    } catch (err) {
      console.warn('Backend createAlert notice:', err.message);
      const newAlert = {
        id: `alt-${Date.now()}`,
        status: "Active",
        ...alertData
      };
      setAlerts([newAlert, ...alerts]);
    }
    showToast(`Price alert created for target $${alertData.targetPrice}`);
  };

  const deleteAlert = async (alertId) => {
    try {
      await api.deleteAlert(alertId);
    } catch (err) {
      console.warn('Backend deleteAlert notice:', err.message);
    }
    setAlerts(alerts.filter((a) => a.id !== alertId));
    showToast(`Alert removed`, "info");
  };

  const resetAlert = async (alertId) => {
    try {
      await api.resetAlert(alertId);
    } catch (err) {
      console.warn('Backend resetAlert notice:', err.message);
    }
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Active' } : a))
    );
    showToast(`Alert re-armed to Active`);
  };

  // Trade / Transaction methods
  const executeTrade = async ({ type, coin, amount, total }) => {
    try {
      await api.createTransaction({
        coinId: coin.id,
        symbol: coin.symbol?.toUpperCase(),
        coinName: coin.name,
        type: type === 'Sold' ? 'SELL' : 'BUY',
        amount: Number(amount),
        pricePerCoin: Number(coin.current_price),
      });
      // Refetch portfolio
      const pf = await api.getPortfolio(currency.name);
      if (pf && pf.summary) {
        setPortfolio({
          totalValue: pf.summary.totalValue,
          totalInvested: pf.summary.totalInvested,
          profitPercent: pf.summary.profitPercent,
          profitAmount: pf.summary.totalProfitLoss,
          allocations: pf.allocations || [],
          transactions: pf.recentTransactions || [],
        });
      }
    } catch (err) {
      console.warn('Backend trade notice:', err.message);
      // Fallback local update
      const newTx = {
        id: `tx-${Date.now()}`,
        type: type || "Bought",
        coin: coin.name,
        symbol: coin.symbol?.toUpperCase(),
        amount: `${amount} ${coin.symbol?.toUpperCase()}`,
        total: `${currency.symbol}${Number(total).toLocaleString()}`,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        status: "Completed"
      };
      setPortfolio((prev) => ({
        ...prev,
        transactions: [newTx, ...prev.transactions]
      }));
    }

    showToast(`Order executed: ${type} ${amount} ${coin.symbol?.toUpperCase()}`);
  };

  // Auth methods
  const loginUser = async (email, password = "password123") => {
    try {
      const data = await api.login(email, password);
      if (data && data.user) {
        setUser({ ...data.user, isLoggedIn: true });
        localStorage.setItem("cp_user", JSON.stringify({ ...data.user, isLoggedIn: true }));
        showToast(`Welcome back, ${data.user.name}!`);
        await fetchUserData();
        return true;
      }
    } catch (err) {
      console.warn("Backend login failed, using local session:", err.message);
      const fallbackUser = {
        name: email.split('@')[0] || "Trader",
        email,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        isLoggedIn: true
      };
      setUser(fallbackUser);
      localStorage.setItem("cp_user", JSON.stringify(fallbackUser));
      showToast(`Logged in as ${fallbackUser.name}`);
      return true;
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const data = await api.register(name, email, password);
      if (data && data.user) {
        setUser({ ...data.user, isLoggedIn: true });
        localStorage.setItem("cp_user", JSON.stringify({ ...data.user, isLoggedIn: true }));
        showToast(`Account created for ${data.user.name}!`);
        await fetchUserData();
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'danger');
      return false;
    }
  };

  const logoutUser = async () => {
    await api.logout();
    setUser(null);
    localStorage.removeItem("cp_user");
    localStorage.removeItem("cp_token");
    showToast(`Logged out successfully`, "info");
  };

  const contextValue = {
    allCoin,
    loadingCoins,
    currency,
    setCurrency,
    changeCurrency,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    alerts,
    addAlert,
    deleteAlert,
    resetAlert,
    portfolio,
    portfolioHistory: PORTFOLIO_HISTORY,
    executeTrade,
    user,
    loginUser,
    registerUser,
    logoutUser,
    tradeModal,
    setTradeModal,
    alertModal,
    setAlertModal,
    watchlistModal,
    setWatchlistModal,
    toast,
    showToast
  };

  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;