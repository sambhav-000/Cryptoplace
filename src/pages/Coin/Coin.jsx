import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Star, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  FileText,
  ShoppingBag,
  Bell
} from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';
import CoinDetailChart from '../../components/Charts/CoinDetailChart';
import './Coin.css';

const Coin = () => {
  const { coinId } = useParams();
  const { 
    allCoin, 
    currency, 
    watchlist, 
    toggleWatchlist, 
    setTradeModal,
    setAlertModal 
  } = useContext(CoinContext);

  const [activeTab, setActiveTab] = useState('Chart');

  // Find coin in allCoin
  const coin = allCoin.find(
    (c) => c.id.toLowerCase() === coinId?.toLowerCase() || c.symbol.toLowerCase() === coinId?.toLowerCase()
  ) || allCoin[0];

  const isWatchlisted = coin ? watchlist.includes(coin.id) : false;
  const isPositive = (coin?.price_change_percentage_24h || 0) >= 0;

  if (!coin) {
    return (
      <div className="coin-loading-state">
        <div className="loading-spinner"></div>
        <p>Loading coin data...</p>
      </div>
    );
  }

  return (
    <div className="coin-detail-page">
      {/* Breadcrumb Navigation */}
      <div className="coin-breadcrumb">
        <Link to="/markets" className="breadcrumb-link">
          Markets
        </Link>
        <ChevronRight size={14} className="breadcrumb-sep" />
        <span className="breadcrumb-current">{coin.name}</span>
      </div>

      {/* Coin Title & Overview Header */}
      <div className="coin-header-bar">
        <div className="coin-title-left">
          <img src={coin.image} alt={coin.name} className="coin-main-logo" />
          <div>
            <div className="coin-name-row">
              <h1 className="coin-main-name">{coin.name}</h1>
              <span className="coin-symbol-badge">{coin.symbol?.toUpperCase()}</span>
            </div>
            <div className="coin-price-strip">
              <span className="coin-live-price">
                {currency.symbol}{coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </span>
              <span className={isPositive ? 'badge-green' : 'badge-red'}>
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {isPositive ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}% (24h)
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="coin-header-actions">
          <button 
            className="btn-coin-action"
            onClick={() => setAlertModal({ isOpen: true, coin })}
            title="Set Price Alert"
          >
            <Bell size={16} />
            <span>Alert</span>
          </button>
          <button 
            className={`btn-coin-action ${isWatchlisted ? 'watchlisted' : ''}`}
            onClick={() => toggleWatchlist(coin.id)}
          >
            <Star size={16} fill={isWatchlisted ? '#f59e0b' : 'none'} color={isWatchlisted ? '#f59e0b' : 'currentColor'} />
            <span>{isWatchlisted ? 'Saved' : 'Watch'}</span>
          </button>
          <button 
            className="btn-primary"
            onClick={() => setTradeModal({ isOpen: true, coin, mode: 'Buy' })}
          >
            Buy {coin.symbol?.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Key Quick Stats Strip */}
      <div className="cp-card coin-quick-stats">
        <div className="quick-stat-item">
          <span className="qs-label">Market Cap</span>
          <span className="qs-val">{currency.symbol}{coin.market_cap ? (coin.market_cap / 1e9).toFixed(2) + 'B' : 'N/A'}</span>
        </div>
        <div className="quick-stat-item">
          <span className="qs-label">24h Volume</span>
          <span className="qs-val">{currency.symbol}{coin.total_volume ? (coin.total_volume / 1e9).toFixed(2) + 'B' : 'N/A'}</span>
        </div>
        <div className="quick-stat-item">
          <span className="qs-label">Circulating Supply</span>
          <span className="qs-val">{coin.circulating_supply ? (coin.circulating_supply / 1e6).toFixed(1) + 'M ' + coin.symbol?.toUpperCase() : 'N/A'}</span>
        </div>
        <div className="quick-stat-item">
          <span className="qs-label">24h High</span>
          <span className="qs-val">{currency.symbol}{coin.high_24h?.toLocaleString() || 'N/A'}</span>
        </div>
        <div className="quick-stat-item">
          <span className="qs-label">24h Low</span>
          <span className="qs-val">{currency.symbol}{coin.low_24h?.toLocaleString() || 'N/A'}</span>
        </div>
      </div>

      {/* Main Grid: Chart & About */}
      <div className="coin-main-grid">
        {/* Left: Chart & Tabs */}
        <div className="cp-card coin-chart-section">
          {/* Navigation Tabs */}
          <div className="coin-tab-header">
            {['Overview', 'Chart', 'Markets', 'News'].map((tab) => (
              <button
                key={tab}
                className={`coin-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="coin-chart-container">
            <CoinDetailChart coin={coin} currencySymbol={currency.symbol} />
          </div>
        </div>

        {/* Right: About Card */}
        <div className="cp-card coin-about-card">
          <h3 className="about-title">About {coin.name}</h3>
          
          <p className="about-desc">
            {coin.description || `${coin.name} is a decentralized digital cryptocurrency asset that operates on secure blockchain infrastructure without central intermediaries.`}
          </p>

          <div className="about-meta-list">
            <div className="meta-row">
              <span className="meta-label">Rank</span>
              <span className="meta-val">#{coin.market_cap_rank || 1}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Category</span>
              <span className="meta-val">{coin.category || 'Cryptocurrency'}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Website</span>
              <a 
                href={coin.website || 'https://bitcoin.org'} 
                target="_blank" 
                rel="noreferrer" 
                className="meta-link"
              >
                {coin.website ? coin.website.replace('https://', '') : 'bitcoin.org'}
                <ExternalLink size={13} />
              </a>
            </div>
            <div className="meta-row">
              <span className="meta-label">Whitepaper</span>
              <a 
                href={coin.whitepaper || 'https://bitcoin.org/bitcoin.pdf'} 
                target="_blank" 
                rel="noreferrer" 
                className="meta-link"
              >
                View
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          <button 
            className={`btn-add-watchlist-full ${isWatchlisted ? 'active' : ''}`}
            onClick={() => toggleWatchlist(coin.id)}
          >
            <Bookmark size={16} />
            <span>{isWatchlisted ? 'Remove from Watchlist' : '+ Add to Watchlist'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coin;