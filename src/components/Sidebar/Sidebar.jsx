import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Bookmark, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Hexagon,
  Zap,
  Menu,
  X
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isMobileOpen, setIsMobileOpen, onOpenAuth }) => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/markets', label: 'Markets', icon: TrendingUp },
    { to: '/portfolio', label: 'Portfolio', icon: Wallet },
    { to: '/watchlist', label: 'Watchlist', icon: Bookmark },
    { to: '/alerts', label: 'Alerts', icon: Bell },
  ];

  const handleLogout = () => {
    if (onOpenAuth) {
      onOpenAuth('login');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`cp-sidebar ${isMobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <NavLink to="/" className="brand-link" onClick={() => setIsMobileOpen(false)}>
            <div className="brand-logo-icon">
              <Hexagon className="hexagon-icon" />
              <Zap className="zap-icon" />
            </div>
            <span className="brand-title">CryptoPlace <span className="brand-pro">Pro</span></span>
          </NavLink>
          <button 
            className="mobile-close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon size={19} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Utility Navigation */}
        <div className="sidebar-bottom">
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <User size={19} className="nav-icon" />
            <span className="nav-label">Profile</span>
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <Settings size={19} className="nav-icon" />
            <span className="nav-label">Settings</span>
          </NavLink>
          <button 
            type="button"
            className="nav-item logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={19} className="nav-icon" />
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

