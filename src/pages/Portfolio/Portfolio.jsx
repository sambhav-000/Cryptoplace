import React, { useContext } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Plus, 
  Download,
  TrendingUp, 
  Clock, 
  ShieldCheck,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';
import api from '../../services/api';
import DonutChart from '../../components/Charts/DonutChart';
import './Portfolio.css';

const Portfolio = () => {
  const { 
    portfolio, 
    currency, 
    allCoin, 
    setTradeModal,
    showToast
  } = useContext(CoinContext);

  const btcCoin = allCoin.find((c) => c.id === 'bitcoin') || allCoin[0];

  return (
    <div className="portfolio-page">
      {/* Header */}
      <div className="portfolio-header">
        <div>
          <h1 className="page-heading">Portfolio</h1>
          <p className="page-subheading">Track your holdings, performance and transactions.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            className="btn-secondary"
            onClick={async () => {
              try {
                await api.exportTransactions('csv');
                showToast('Portfolio transactions exported as CSV');
              } catch (err) {
                showToast(err.message || 'Export failed', 'danger');
              }
            }}
            title="Export transactions as CSV file"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button 
            className="btn-primary"
            onClick={() => setTradeModal({ isOpen: true, coin: btcCoin, mode: 'Buy' })}
          >
            <Plus size={16} />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="portfolio-stats-grid">
        <div className="cp-card stat-card">
          <span className="stat-label">Total Value</span>
          <div className="stat-val-row">
            <span className="stat-value">{currency.symbol}{portfolio.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="stat-footer">
            <span className="badge-green">
              <ArrowUpRight size={13} /> +{portfolio.profitPercent || 12.5}%
            </span>
          </div>
        </div>

        <div className="cp-card stat-card">
          <span className="stat-label">Total Invested</span>
          <div className="stat-val-row">
            <span className="stat-value">{currency.symbol}{portfolio.totalInvested?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="stat-footer">
            <span className="stat-label" style={{ fontSize: '12px' }}>All time invested capital</span>
          </div>
        </div>

        <div className="cp-card stat-card">
          <span className="stat-label">Total P/L</span>
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
      </div>

      {/* Main Grid: Donut Allocation & Recent Transactions */}
      <div className="portfolio-mid-grid">
        {/* Left: Asset Allocation */}
        <div className="cp-card allocation-card">
          <div className="card-top-title">
            <h3>Asset Allocation</h3>
            <span className="stat-label">5 Assets</span>
          </div>
          <DonutChart 
            allocations={portfolio.allocations} 
            totalValue={portfolio.totalValue} 
            currencySymbol={currency.symbol} 
          />
        </div>

        {/* Right: Recent Transactions */}
        <div className="cp-card transactions-card">
          <div className="card-top-title">
            <h3>Recent Transactions</h3>
            <span className="see-all-link" style={{ cursor: 'pointer' }}>See all</span>
          </div>

          <div className="transactions-list">
            {portfolio.transactions.map((tx) => {
              const isBought = tx.type === 'Bought';
              return (
                <div key={tx.id} className="tx-item">
                  <div className="tx-left">
                    <div className={`tx-icon-bubble ${isBought ? 'bought' : 'sold'}`}>
                      {isBought ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <div className="tx-name">
                        {tx.type} {tx.symbol}
                      </div>
                      <div className="tx-date">{tx.date}</div>
                    </div>
                  </div>

                  <div className="tx-right">
                    <div className="tx-total">{tx.total}</div>
                    <div className="tx-amount">{tx.amount}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="cp-card holdings-card">
        <div className="card-top-title" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', marginBottom: 0 }}>
          <h3>Your Holdings</h3>
        </div>

        <div className="table-responsive">
          <table className="markets-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Portfolio Share</th>
                <th>Current Value</th>
                <th>Profit / Loss</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.allocations.map((item) => {
                const coin = allCoin.find((c) => c.symbol.toLowerCase() === item.symbol.toLowerCase()) || allCoin[0];
                return (
                  <tr key={item.symbol} className="market-coin-row">
                    <td className="coin-name-cell">
                      <span className="legend-color-dot" style={{ backgroundColor: item.color, width: '12px', height: '12px' }}></span>
                      <div className="table-coin-info">
                        <span className="table-coin-name">{item.name}</span>
                        <span className="table-coin-sym">{item.symbol}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '80px', height: '6px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${item.percent}%`, height: '100%', background: item.color }}></div>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{item.percent}%</span>
                      </div>
                    </td>
                    <td className="coin-price-cell">
                      {currency.symbol}{item.value.toLocaleString()}
                    </td>
                    <td>
                      <span className="badge-green">
                        <ArrowUpRight size={12} /> +12.5%
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <button
                        className="btn-table-buy"
                        onClick={() => setTradeModal({ isOpen: true, coin, mode: 'Buy' })}
                      >
                        Trade
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

export default Portfolio;

