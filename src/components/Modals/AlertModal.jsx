import React, { useState, useContext, useEffect } from 'react';
import { X, BellRing, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';
import './TradeModal.css';

const AlertModal = () => {
  const { alertModal, setAlertModal, allCoin, addAlert, currency } = useContext(CoinContext);
  const [selectedCoinId, setSelectedCoinId] = useState('bitcoin');
  const [condition, setCondition] = useState('above');
  const [targetPrice, setTargetPrice] = useState('');

  useEffect(() => {
    if (alertModal.coin) {
      setSelectedCoinId(alertModal.coin.id);
      setTargetPrice(Math.round(alertModal.coin.current_price * 1.05).toString());
    } else if (allCoin.length > 0) {
      setSelectedCoinId(allCoin[0].id);
      setTargetPrice(Math.round(allCoin[0].current_price * 1.05).toString());
    }
  }, [alertModal, allCoin]);

  if (!alertModal.isOpen) return null;

  const currentCoin = allCoin.find((c) => c.id === selectedCoinId) || allCoin[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetPrice || isNaN(targetPrice)) return;
    addAlert({
      coinId: selectedCoinId,
      condition,
      targetPrice: parseFloat(targetPrice),
    });
    setAlertModal({ isOpen: false, coin: null });
  };

  return (
    <div className="modal-overlay" onClick={() => setAlertModal({ isOpen: false, coin: null })}>
      <div className="trade-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="trade-coin-badge">
            <div className="brand-logo-icon" style={{ background: '#3b82f6' }}>
              <BellRing size={18} color="white" />
            </div>
            <div>
              <h3>Create Price Alert</h3>
              <span className="trade-sym">Get notified when target is reached</span>
            </div>
          </div>
          <button 
            className="modal-close-btn"
            onClick={() => setAlertModal({ isOpen: false, coin: null })}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="trade-form">
          <div className="form-group">
            <label>Select Cryptocurrency</label>
            <div className="input-group">
              <select
                value={selectedCoinId}
                onChange={(e) => {
                  setSelectedCoinId(e.target.value);
                  const coin = allCoin.find((c) => c.id === e.target.value);
                  if (coin) setTargetPrice(Math.round(coin.current_price * 1.05).toString());
                }}
                style={{ width: '100%', background: 'transparent', color: 'white', border: 'none', padding: '12px 0', fontSize: '14px' }}
              >
                {allCoin.map((c) => (
                  <option key={c.id} value={c.id} style={{ background: '#111726', color: 'white' }}>
                    {c.name} ({c.symbol.toUpperCase()}) — {currency.symbol}{c.current_price?.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="trade-price-row">
            <span>Current Market Price</span>
            <strong>{currency.symbol}{currentCoin?.current_price?.toLocaleString()}</strong>
          </div>

          <div className="form-group">
            <label>Condition</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className={`trade-tab ${condition === 'above' ? 'active-buy' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onClick={() => setCondition('above')}
              >
                <ArrowUpRight size={16} /> Price Above
              </button>
              <button
                type="button"
                className={`trade-tab ${condition === 'below' ? 'active-sell' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onClick={() => setCondition('below')}
              >
                <ArrowDownRight size={16} /> Price Below
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Target Price ({currency.name.toUpperCase()})</label>
            <div className="input-group">
              <span className="input-affix" style={{ marginRight: '8px' }}>{currency.symbol}</span>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="e.g. 70000"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-trade-submit buy" style={{ marginTop: '8px' }}>
            Set Alert
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlertModal;

