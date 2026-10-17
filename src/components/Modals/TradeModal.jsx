import React, { useState, useContext, useEffect } from 'react';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';
import './TradeModal.css';

const TradeModal = () => {
  const { tradeModal, setTradeModal, currency, executeTrade } = useContext(CoinContext);
  const [tab, setTab] = useState('Buy');
  const [amount, setAmount] = useState('1');

  useEffect(() => {
    if (tradeModal.mode) {
      setTab(tradeModal.mode);
    }
    setAmount('1');
  }, [tradeModal]);

  if (!tradeModal.isOpen || !tradeModal.coin) return null;

  const coin = tradeModal.coin;
  const numAmount = parseFloat(amount) || 0;
  const total = (numAmount * (coin.current_price || 0)).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (numAmount <= 0) return;
    executeTrade({
      type: tab === 'Buy' ? 'Bought' : 'Sold',
      coin,
      amount: numAmount,
      total
    });
    setTradeModal({ isOpen: false, coin: null, mode: 'Buy' });
  };

  return (
    <div className="modal-overlay" onClick={() => setTradeModal({ isOpen: false, coin: null, mode: 'Buy' })}>
      <div className="trade-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="trade-coin-badge">
            <img src={coin.image} alt={coin.name} className="trade-coin-img" />
            <div>
              <h3>{tab} {coin.name}</h3>
              <span className="trade-sym">{coin.symbol?.toUpperCase()}</span>
            </div>
          </div>
          <button 
            className="modal-close-btn"
            onClick={() => setTradeModal({ isOpen: false, coin: null, mode: 'Buy' })}
          >
            <X size={20} />
          </button>
        </div>

        <div className="trade-tabs">
          <button 
            className={`trade-tab ${tab === 'Buy' ? 'active-buy' : ''}`}
            onClick={() => setTab('Buy')}
          >
            Buy
          </button>
          <button 
            className={`trade-tab ${tab === 'Sell' ? 'active-sell' : ''}`}
            onClick={() => setTab('Sell')}
          >
            Sell
          </button>
        </div>

        <form onSubmit={handleSubmit} className="trade-form">
          <div className="trade-price-row">
            <span>Market Price</span>
            <strong>{currency.symbol}{coin.current_price?.toLocaleString()}</strong>
          </div>

          <div className="form-group">
            <label>Amount ({coin.symbol?.toUpperCase()})</label>
            <div className="input-group">
              <input
                type="number"
                step="any"
                min="0.000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <span className="input-affix">{coin.symbol?.toUpperCase()}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Estimated Total ({currency.name.toUpperCase()})</label>
            <div className="input-group disabled">
              <input
                type="text"
                readOnly
                value={`${currency.symbol}${Number(total).toLocaleString()}`}
              />
            </div>
          </div>

          <div className="trade-info-notice">
            <ShieldCheck size={16} className="text-primary" />
            <span>Instant execution at live market rate with zero gas fees</span>
          </div>

          <button 
            type="submit" 
            className={`btn-trade-submit ${tab === 'Buy' ? 'buy' : 'sell'}`}
          >
            {tab} {coin.symbol?.toUpperCase()}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;

