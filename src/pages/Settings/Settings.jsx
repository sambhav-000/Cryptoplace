import React, { useContext } from 'react';
import { Globe, Bell, Shield, Moon, Eye } from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';

const Settings = () => {
  const { currency, changeCurrency, showToast } = useContext(CoinContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 className="page-heading">Settings</h1>
        <p className="page-subheading">Customize your preferences and display configuration</p>
      </div>

      <div className="cp-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Preferences</h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>Base Currency</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Select your primary market display currency</div>
          </div>
          <select 
            value={currency.name.toUpperCase()} 
            onChange={(e) => changeCurrency(e.target.value)}
            style={{ background: '#090d16', color: 'white', border: '1px solid var(--border-color)', padding: '8px 14px', borderRadius: '6px' }}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="INR">INR (₹)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>Dark Mode Theme</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pro midnight dark slate appearance</div>
          </div>
          <span className="badge-blue">Always Active</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>Desktop Notifications</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Instant alerts for crypto price target spikes</div>
          </div>
          <button 
            className="btn-primary" 
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => showToast('Browser notifications enabled!')}
          >
            Enable
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

