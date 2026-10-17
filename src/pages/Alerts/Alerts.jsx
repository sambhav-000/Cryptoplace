import React, { useContext } from 'react';
import { Plus, Bell, Trash2, Edit2, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight, RotateCcw } from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';
import './Alerts.css';

const Alerts = () => {
  const { 
    alerts, 
    allCoin, 
    currency, 
    deleteAlert, 
    resetAlert,
    setAlertModal 
  } = useContext(CoinContext);

  return (
    <div className="alerts-page">
      {/* Header */}
      <div className="alerts-header">
        <div>
          <h1 className="page-heading">Price Alerts</h1>
          <p className="page-subheading">Get notified when your target prices are reached.</p>
        </div>

        <button 
          className="btn-primary"
          onClick={() => setAlertModal({ isOpen: true, coin: null })}
        >
          <Plus size={16} />
          <span>+ Create Alert</span>
        </button>
      </div>

      {/* Alerts Table */}
      <div className="cp-card alerts-table-card">
        {alerts.length === 0 ? (
          <div className="watchlist-empty-state">
            <Bell size={40} className="empty-icon" />
            <h3>No price alerts configured</h3>
            <p>Set price targets on Bitcoin, Ethereum, and other assets to receive real-time notifications.</p>
            <button 
              className="btn-primary" 
              onClick={() => setAlertModal({ isOpen: true, coin: null })}
              style={{ marginTop: '12px' }}
            >
              <Plus size={16} />
              <span>Create Your First Alert</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="markets-table">
              <thead>
                <tr>
                  <th>Coin</th>
                  <th>Condition</th>
                  <th>Target Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alt) => {
                  const coin = allCoin.find((c) => c.id === alt.coinId) || {
                    name: alt.coinId.toUpperCase(),
                    symbol: alt.coinId,
                    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
                    current_price: 67432
                  };

                  const isTriggered = alt.status === 'Triggered' || 
                    (alt.condition === 'above' && coin.current_price >= alt.targetPrice) ||
                    (alt.condition === 'below' && coin.current_price <= alt.targetPrice);

                  return (
                    <tr key={alt.id} className="market-coin-row">
                      {/* Coin */}
                      <td className="coin-name-cell">
                        <img src={coin.image} alt={coin.name} className="table-coin-img" />
                        <div className="table-coin-info">
                          <span className="table-coin-name">{coin.name}</span>
                          <span className="table-coin-sym">{coin.symbol?.toUpperCase()}</span>
                        </div>
                      </td>

                      {/* Condition */}
                      <td>
                        <span className="condition-label">
                          {alt.condition === 'above' ? (
                            <>
                              <ArrowUpRight size={14} className="text-primary" /> Price above
                            </>
                          ) : (
                            <>
                              <ArrowDownRight size={14} className="text-danger" /> Price below
                            </>
                          )}
                        </span>
                      </td>

                      {/* Target Price */}
                      <td className="coin-price-cell">
                        {currency.symbol}{alt.targetPrice?.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td>
                        <span className={isTriggered ? 'badge-red' : 'badge-green'}>
                          {isTriggered ? 'Triggered' : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          {isTriggered && (
                            <button
                              className="btn-icon-action"
                              style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                              onClick={() => resetAlert(alt.id)}
                              title="Re-arm Alert to Active"
                            >
                              <RotateCcw size={15} />
                            </button>
                          )}
                          <button
                            className="btn-icon-action"
                            onClick={() => setAlertModal({ isOpen: true, coin })}
                            title="Edit Alert"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="btn-icon-action delete"
                            onClick={() => deleteAlert(alt.id)}
                            title="Delete Alert"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
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

export default Alerts;

