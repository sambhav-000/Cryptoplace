import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, Globe, User, LogOut, Check } from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';
import './Header.css';

const Header = ({ onToggleMobileSidebar, onOpenAuth }) => {
  const { 
    allCoin, 
    currency, 
    changeCurrency, 
    user, 
    logoutUser, 
    alerts,
    showToast 
  } = useContext(CoinContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const userRef = useRef(null);
  const currencyRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setShowCurrencyDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? allCoin.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelectCoin = (coinId) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    navigate(`/coin/${coinId}`);
  };

  const triggeredAlerts = alerts.filter((a) => a.status === 'Triggered');

  return (
    <header className="cp-header">
      <div className="header-left">
        <button 
          className="header-menu-btn" 
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation"
        >
          <Menu size={22} />
        </button>

        {/* Global Search */}
        <div className="header-search-wrapper" ref={searchRef}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search coins..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => {
              if (searchQuery.trim()) setShowSearchDropdown(true);
            }}
          />

          {showSearchDropdown && searchResults.length > 0 && (
            <div className="search-dropdown">
              <div className="dropdown-title">Coins</div>
              {searchResults.map((coin) => (
                <div
                  key={coin.id}
                  className="search-item"
                  onClick={() => handleSelectCoin(coin.id)}
                >
                  <img src={coin.image} alt={coin.name} className="search-coin-img" />
                  <div className="search-coin-info">
                    <span className="search-coin-name">{coin.name}</span>
                    <span className="search-coin-sym">{coin.symbol.toUpperCase()}</span>
                  </div>
                  <div className="search-coin-price">
                    {currency.symbol}{coin.current_price?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Currency Switcher */}
        <div className="currency-selector-wrapper" ref={currencyRef}>
          <button
            className="currency-btn"
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
          >
            <Globe size={15} />
            <span className="currency-label">{currency.name.toUpperCase()}</span>
            <ChevronDown size={14} />
          </button>

          {showCurrencyDropdown && (
            <div className="header-dropdown currency-dropdown">
              {[
                { code: 'USD', name: 'US Dollar', symbol: '$' },
                { code: 'EUR', name: 'Euro', symbol: '€' },
                { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
                { code: 'GBP', name: 'British Pound', symbol: '£' },
              ].map((c) => (
                <button
                  key={c.code}
                  className={`dropdown-item ${currency.name.toUpperCase() === c.code ? 'active' : ''}`}
                  onClick={() => {
                    changeCurrency(c.code);
                    setShowCurrencyDropdown(false);
                  }}
                >
                  <span>{c.code} ({c.symbol})</span>
                  {currency.name.toUpperCase() === c.code && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="notifications-wrapper" ref={notifRef}>
          <button
            className="notif-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
          >
            <Bell size={19} />
            {triggeredAlerts.length > 0 && (
              <span className="notif-badge">{triggeredAlerts.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="header-dropdown notif-dropdown">
              <div className="dropdown-header">
                <span>Price Alerts & Updates</span>
                <span className="badge-blue">{triggeredAlerts.length} Active</span>
              </div>
              <div className="notif-list">
                {triggeredAlerts.length === 0 ? (
                  <div className="notif-empty">No triggered alerts right now</div>
                ) : (
                  triggeredAlerts.map((alt) => (
                    <div key={alt.id} className="notif-item">
                      <div className="notif-bullet"></div>
                      <div>
                        <div className="notif-text">
                          <strong>{alt.coinId.toUpperCase()}</strong> reached target ${alt.targetPrice}!
                        </div>
                        <span className="notif-time">Just now</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="user-profile-wrapper" ref={userRef}>
          <button
            className="user-profile-btn"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"}
              alt="User Avatar"
              className="user-avatar"
            />
            <span className="user-name">{user?.name || "John Doe"}</span>
            <ChevronDown size={14} className="user-chevron" />
          </button>

          {showUserDropdown && (
            <div className="header-dropdown user-dropdown">
              <div className="user-dropdown-info">
                <span className="user-dropdown-name">{user?.name || "John Doe"}</span>
                <span className="user-dropdown-email">{user?.email || "john@example.com"}</span>
              </div>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item" 
                onClick={() => {
                  setShowUserDropdown(false);
                  navigate('/portfolio');
                }}
              >
                <User size={16} /> My Portfolio
              </button>
              <button 
                className="dropdown-item text-danger" 
                onClick={() => {
                  setShowUserDropdown(false);
                  if (onOpenAuth) onOpenAuth('login');
                  else navigate('/login');
                }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

