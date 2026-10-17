import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Globe } from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';
import './Navbar.css';

const Navbar = () => {
  const { currency, changeCurrency } = useContext(CoinContext);

  return (
    <header className="navbar">
      <Link to="/" className="brand-link">
        <div className="brand-logo-icon">
          <Zap size={18} color="white" />
        </div>
        <span className="brand-title">CryptoPlace <span className="brand-pro">Pro</span></span>
      </Link>

      <ul className="navbar-links">
        <Link to="/"><li>Home</li></Link>
        <Link to="/markets"><li>Markets</li></Link>
        <Link to="/portfolio"><li>Portfolio</li></Link>
        <Link to="/dashboard"><li>Dashboard</li></Link>
      </ul>

      <div className="nav-right">
        <select 
          value={currency.name.toUpperCase()} 
          onChange={(e) => changeCurrency(e.target.value)}
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="INR">INR (₹)</option>
          <option value="GBP">GBP (£)</option>
        </select>
        <Link to="/dashboard">
          <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
            Open App
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;