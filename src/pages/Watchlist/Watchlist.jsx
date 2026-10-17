import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUpRight, ArrowDownRight, Trash2, Bookmark } from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';
import './Watchlist.css';

const Watchlist = () => {
  const { 
    watchlist, 
    allCoin, 
    currency, 
    removeFromWatchlist, 
    setWatchlistModal 
  } = useContext(CoinContext);

  const navigate = useNavigate();

  const watchlistedCoins = allCoin.filter((c) => watchlist.includes(c.id));

  return (
    <div className="watchlist-page">
      {/* Header */}
      <div className="watchlist-header">
        <div>
          <h1 className="page-heading">My Watchlist</h1>
          <p className="page-subheading">Track your favorite coins and get the latest updates.</p>
        </div>

        <button 
          className="btn-primary"
          onClick={() => setWatchlistModal({ isOpen: true })}
        >
          <Plus size={16} />
          <span>+ Add Coin</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="cp-card watchlist-table-card">
        {watchlistedCoins.length === 0 ? (
          <div className="watchlist-empty-state">
            <Bookmark size={40} className="empty-icon" />
            <h3>Your watchlist is empty</h3>
            <p>Add coins to monitor their live performance, price trends, and market changes.</p>
            <button 
              className="btn-primary" 
              onClick={() => setWatchlistModal({ isOpen: true })}
              style={{ marginTop: '12px' }}
            >
              <Plus size={16} />
              <span>Add Your First Coin</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="markets-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Coin</th>
                  <th>Price</th>
                  <th>24h Change</th>
                  <th>Market Cap</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {watchlistedCoins.map((coin, index) => {
                  const isPositive = (coin.price_change_percentage_24h || 0) >= 0;

                  return (
                    <tr
                      key={coin.id}
                      className="market-coin-row"
                      onClick={() => navigate(`/coin/${coin.id}`)}
                    >
                      {/* Index */}
                      <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                        {index + 1}
                      </td>

                      {/* Coin */}
                      <td className="coin-name-cell">
                        <img src={coin.image} alt={coin.name} className="table-coin-img" />
                        <div className="table-coin-info">
                          <span className="table-coin-name">{coin.name}</span>
                          <span className="table-coin-sym">{coin.symbol?.toUpperCase()}</span>
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
                        {currency.symbol}{coin.market_cap ? (coin.market_cap / 1e12 >= 1 ? (coin.market_cap / 1e12).toFixed(2) + 'T' : (coin.market_cap / 1e9).toFixed(2) + 'B') : 'N/A'}
                      </td>

                      {/* Remove Button */}
                      <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                        <button
                          className="btn-table-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWatchlist(coin.id);
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;

