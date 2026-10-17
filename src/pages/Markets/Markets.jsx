import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Globe, 
  ChevronDown,
  ShoppingBag,
  Star
} from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';
import './Markets.css';

const Markets = () => {
  const { 
    allCoin, 
    currency, 
    changeCurrency, 
    setTradeModal,
    watchlist,
    toggleWatchlist 
  } = useContext(CoinContext);

  const [filterTab, setFilterTab] = useState('All');
  const [localSearch, setLocalSearch] = useState('');
  const navigate = useNavigate();

  // Filter coins
  let filteredCoins = [...allCoin];

  if (filterTab === 'Gainers') {
    filteredCoins = filteredCoins.filter((c) => (c.price_change_percentage_24h || 0) > 0);
  } else if (filterTab === 'Losers') {
    filteredCoins = filteredCoins.filter((c) => (c.price_change_percentage_24h || 0) < 0);
  } else if (filterTab === 'Top 100') {
    filteredCoins = filteredCoins.slice(0, 100);
  }

  if (localSearch.trim()) {
    filteredCoins = filteredCoins.filter((c) =>
      c.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      c.symbol.toLowerCase().includes(localSearch.toLowerCase())
    );
  }

  const handleBuyClick = (e, coin) => {
    e.stopPropagation();
    setTradeModal({ isOpen: true, coin, mode: 'Buy' });
  };

  const handleWatchlistClick = (e, coinId) => {
    e.stopPropagation();
    toggleWatchlist(coinId);
  };

  return (
    <div className="markets-page">
      {/* Header & Filters */}
      <div className="markets-header-section">
        <div>
          <h1 className="page-heading">Cryptocurrency Markets</h1>
          <p className="page-subheading">Live prices, market cap and 24h changes</p>
        </div>

        <div className="markets-controls-bar">
          {/* Filter Pills */}
          <div className="markets-filter-pills">
            {['All', 'Top 100', 'Gainers', 'Losers'].map((tab) => (
              <button
                key={tab}
                className={`filter-pill ${filterTab === tab ? 'active' : ''}`}
                onClick={() => setFilterTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="markets-search-box">
            <Search size={16} className="markets-search-icon" />
            <input
              type="text"
              placeholder="Search markets..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Markets Table */}
      <div className="cp-card markets-table-card">
        <div className="table-responsive">
          <table className="markets-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Coin</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Market Cap</th>
                <th>24h Volume</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin, index) => {
                const isWatchlisted = watchlist.includes(coin.id);
                const isPositive = (coin.price_change_percentage_24h || 0) >= 0;

                return (
                  <tr
                    key={coin.id}
                    className="market-coin-row"
                    onClick={() => navigate(`/coin/${coin.id}`)}
                  >
                    {/* Rank */}
                    <td className="coin-rank-cell">
                      <button 
                        className={`star-btn ${isWatchlisted ? 'active' : ''}`}
                        onClick={(e) => handleWatchlistClick(e, coin.id)}
                        title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star size={14} fill={isWatchlisted ? '#f59e0b' : 'none'} color={isWatchlisted ? '#f59e0b' : '#64748b'} />
                      </button>
                      <span>{coin.market_cap_rank || index + 1}</span>
                    </td>

                    {/* Coin details */}
                    <td className="coin-name-cell">
                      <img src={coin.image} alt={coin.name} className="table-coin-img" />
                      <div className="table-coin-info">
                        <span className="table-coin-name">{coin.name}</span>
                        <span className="table-coin-sym">{coin.symbol.toUpperCase()}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="coin-price-cell">
                      {currency.symbol}{coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </td>

                    {/* 24h Change */}
                    <td>
                      <span className={isPositive ? 'badge-green' : 'badge-red'}>
                        {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        {isPositive ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </td>

                    {/* Market Cap */}
                    <td className="coin-mcap-cell">
                      {currency.symbol}{coin.market_cap?.toLocaleString()}
                    </td>

                    {/* 24h Volume */}
                    <td className="coin-vol-cell">
                      {currency.symbol}{coin.total_volume?.toLocaleString()}
                    </td>

                    {/* Action: Buy Button */}
                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      <button
                        className="btn-table-buy"
                        onClick={(e) => handleBuyClick(e, coin)}
                      >
                        Buy
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Markets;

