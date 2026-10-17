import React, { useContext } from 'react';
import { User, Mail, Shield, Key, Bell, CreditCard, CheckCircle2 } from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';

const Profile = () => {
  const { user } = useContext(CoinContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 className="page-heading">User Profile</h1>
        <p className="page-subheading">Manage your account details and security settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div className="cp-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '32px' }}>
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces"}
            alt="Avatar"
            style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid var(--primary)' }}
          />
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>{user?.name || "John Doe"}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user?.email || "john@example.com"}</p>
          </div>
          <span className="badge-green">
            <CheckCircle2 size={13} /> Verified Trader
          </span>
        </div>

        <div className="cp-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Account Overview</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#090d16', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Trading Tier</div>
              <div style={{ fontSize: '16px', fontWeight: '700', marginTop: '4px' }}>Pro VIP 1</div>
            </div>
            <div style={{ background: '#090d16', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>2FA Security</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', marginTop: '4px' }}>Enabled</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Full Name</label>
            <input 
              type="text" 
              readOnly 
              value={user?.name || "John Doe"} 
              style={{ background: '#090d16', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '6px', color: 'white' }} 
            />

            <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              readOnly 
              value={user?.email || "john@example.com"} 
              style={{ background: '#090d16', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '6px', color: 'white' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

