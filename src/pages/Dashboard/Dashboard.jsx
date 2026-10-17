import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Bookmark, 
  Bell, 
  DollarSign, 
  ChevronRight,
  Eye,
  Plus
} from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';
import PerformanceChart from '../../components/Charts/PerformanceChart';
import './Dashboard.css';

const Dashboard = () => {
  const { 
    allCoin, 
    currency, 
    portfolio, 
    watchlist, 
    alerts,
    user 
  } = useContext(CoinContext);

  const navigate = useNavigate();

  // Top Movers: sorted by highest 24h percentage gain
  const topMovers = [...allCoin]
    .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
    .slice(0, 5);

  const triggeredAlertsCount = alerts.filter(a => a.status === 'Triggered').length;

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="dashboard-header-intro">
        <h1 className="page-heading">Dashboard</h1>
        <p className="page-subheading">
          Welcome back, {user?.name?.split(' ')[0] || 'John'}! Here's what's happening in the crypto market.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="stats-metric-grid">
        {/* Card 1: Total Portfolio Value */}
        <div className="cp-card stat-card" onClick={() => navigate('/portfolio')}>
          <div className="stat-card-top">
            <span className="stat-label">Total Portfolio Value</span>
          </div>
          <div className="stat-val-row">
            <span className="stat-value">{currency.symbol}{portfolio.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="stat-footer">
            <span className="badge-green">
              <ArrowUpRight size={13} /> +12.5% (24h)
            </span>
          </div>
        </div>

        {/* Card 2: Total Profit/Loss */}
        <div className="cp-card stat-card" onClick={() => navigate('/portfolio')}>
          <div className="stat-card-top">
            <span className="stat-label">Total Profit/Loss</span>
          </div>
          <div className="stat-val-row">
            <span className="stat-value" style={{ color: '#10b981' }}>
              +{currency.symbol}{portfolio.profitAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="stat-footer">
            <span className="badge-green">
              <ArrowUpRight size={13} /> +11.2%
            </span>
          </div>
        </div>

        {/* Card 3: Watchlist Coins */}
        <div className="cp-card stat-card" onClick={() => navigate('/watchlist')}>
          <div className="stat-card-top">
            <span className="stat-label">Watchlist Coins</span>
          </div>
          <div className="stat-val-row">
            <span className="stat-value">{watchlist.length || 8}</span>
          </div>
          <div className="stat-footer">
            <span className="badge-green">
              +2 new
            </span>
          </div>
        </div>

        {/* Card 4: Active Alerts */}
        <div className="cp-card stat-card" onClick={() => navigate('/alerts')}>
          <div className="stat-card-top">
            <span className="stat-label">Active Alerts</span>
          </div>
          <div className="stat-val-row">
            <span className="stat-value">{alerts.length || 3}</span>
          </div>
          <div className="stat-footer">
            {triggeredAlertsCount > 0 ? (
              <span className="badge-red">
                {triggeredAlertsCount} triggered
              </span>
            ) : (
              <span className="badge-blue">
                All normal
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Top Movers */}
      <div className="dashboard-mid-grid">
        {/* Left: Performance Chart */}
        <div className="cp-card chart-card-container">
          <PerformanceChart currencySymbol={currency.symbol} />
        </div>

        {/* Right: Top Movers */}
        <div className="cp-card top-movers-card">
          <div className="movers-header">
            <h3>Top Movers</h3>
            <Link to="/markets" className="see-all-link">
              See all
            </Link>
          </div>

          <div className="movers-list">
            {topMovers.map((coin) => (
              <div 
                key={coin.id} 
                className="mover-row"
                onClick={() => navigate(`/coin/${coin.id}`)}
              >
                <div className="mover-left">
                  <img src={coin.image} alt={coin.name} className="mover-coin-img" />
                  <div>
                    <div className="mover-coin-name">{coin.name}</div>
                    <div className="mover-coin-sym">{coin.symbol?.toUpperCase()}</div>
                  </div>
                </div>

                <div className="mover-right">
                  <div className="mover-coin-price">
                    {currency.symbol}{coin.current_price?.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  </div>
                  <div className={`mover-badge ${(coin.price_change_percentage_24h || 0) >= 0 ? 'badge-green' : 'badge-red'}`}>
                    {(coin.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

