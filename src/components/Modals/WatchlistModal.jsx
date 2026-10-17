import React, { useState, useContext } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';
import './TradeModal.css';

const WatchlistModal = () => {
  const { 
    watchlistModal, 
    setWatchlistModal, 
    allCoin, 
    watchlist, 
    addToWatchlist, 
    removeFromWatchlist,
    currency 
  } = useContext(CoinContext);

  const [query, setQuery] = useState('');

  if (!watchlistModal.isOpen) return null;

  const filteredCoins = allCoin.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.symbol.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={() => setWatchlistModal({ isOpen: false })}>
      <div className="trade-modal-card" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Add Coins to Watchlist</h3>
            <span className="trade-sym">Track your favorite coins and stay updated</span>
          </div>
          <button 
            className="modal-close-btn"
            onClick={() => setWatchlistModal({ isOpen: false })}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '16px 24px 0 24px' }}>
          <div className="input-group">
            <Search size={18} color="#64748b" style={{ marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Search coin by name or symbol..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '16px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredCoins.map((coin) => {
            const isAdded = watchlist.includes(coin.id);
            return (
              <div 
                key={coin.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#090d16',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={coin.image} alt={coin.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{coin.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{coin.symbol.toUpperCase()}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '600' }}>{currency.symbol}{coin.current_price?.toLocaleString()}</div>
                    <div className={coin.price_change_percentage_24h >= 0 ? 'badge-green' : 'badge-red'} style={{ padding: '2px 6px', fontSize: '11px' }}>
                      {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isAdded) {
                        removeFromWatchlist(coin.id);
                      } else {
                        addToWatchlist(coin.id);
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: isAdded ? 'rgba(239, 68, 68, 0.15)' : 'var(--primary)',
                      color: isAdded ? '#ef4444' : '#ffffff',
                      border: isAdded ? '1px solid rgba(239, 68, 68, 0.3)' : 'none'
                    }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} /> Added
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WatchlistModal;

