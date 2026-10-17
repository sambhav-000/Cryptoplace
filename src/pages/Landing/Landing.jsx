import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Activity, 
  PieChart, 
  Bell, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight,
  Zap,
  Globe,
  Sparkles
} from 'lucide-react';
import { CoinContext } from '../../context/CoinContext';
import AuthModal from '../../components/Modals/AuthModal';
import './Landing.css';

const Landing = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const navigate = useNavigate();

  const openAuth = (mode) => setAuthModal({ isOpen: true, mode });

  const featureCards = [
    {
      icon: Activity,
      title: 'Live Market Data',
      desc: 'Real-time prices & charts',
      color: '#3b82f6',
    },
    {
      icon: PieChart,
      title: 'Portfolio Tracking',
      desc: 'Track your holdings & P/L',
      color: '#6366f1',
    },
    {
      icon: Bell,
      title: 'Price Alerts',
      desc: 'Never miss a move',
      color: '#06b6d4',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Private',
      desc: 'Your data, your control',
      color: '#10b981',
    },
  ];

  return (
    <div className="landing-page">
      {/* Landing Navbar */}
      <header className="landing-nav">
        <Link to="/" className="landing-brand">
          <div className="brand-logo-icon">
            <Zap className="zap-icon" />
          </div>
          <span className="brand-title">CryptoPlace <span className="brand-pro">Pro</span></span>
        </Link>

        <nav className="landing-links">
          <Link to="/" className="landing-link active">Home</Link>
          <a href="#features" className="landing-link">Features</a>
          <a href="#pricing" className="landing-link">Pricing</a>
          <a href="#about" className="landing-link">About</a>
        </nav>

        <div className="landing-auth-actions">
          <button className="btn-landing-login" onClick={() => openAuth('login')}>
            Login
          </button>
          <button className="btn-landing-signup" onClick={() => openAuth('signup')}>
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="sparkle-icon" />
            <span>Next-Gen Crypto Intelligence Platform</span>
          </div>

          <h1 className="hero-headline">
            Track. Analyze. Grow. <br />
            <span className="gradient-text">Your Crypto Portfolio</span>
          </h1>

          <p className="hero-subtext">
            Get real-time market data, manage your portfolio, set price alerts
            and make smarter decisions with CryptoPlace Pro.
          </p>

          <div className="hero-cta-group">
            <Link to="/dashboard" className="btn-hero-primary">
              <span>Get Started Free</span>
              <ArrowRight size={17} />
            </Link>
            <Link to="/markets" className="btn-hero-secondary">
              View Demo
            </Link>
          </div>
        </div>

        {/* 3D Visual Showcase */}
        <div className="hero-visual">
          <div className="crypto-3d-scene">
            <div className="ambient-glow"></div>
            
            {/* 3D floating coins illustration */}
            <div className="floating-coin btc-coin">
              <div className="coin-glow btc-glow"></div>
              <div className="coin-inner btc-inner">
                <span className="coin-symbol">₿</span>
              </div>
            </div>

            <div className="floating-coin eth-coin">
              <div className="coin-glow eth-glow"></div>
              <div className="coin-inner eth-inner">
                <svg width="34" height="34" viewBox="0 0 256 417" fill="none">
                  <path d="M127.961 0L125.166 9.5V285.168L127.961 287.959L255.923 212.32L127.961 0Z" fill="#C0CBF6"/>
                  <path d="M127.962 0L0 212.32L127.962 287.959V157.302V0Z" fill="#8A92B2"/>
                  <path d="M127.961 312.187L126.386 314.106V415.823L127.961 417.001L255.998 236.586L127.961 312.187Z" fill="#C0CBF6"/>
                  <path d="M127.962 417.001V312.187L0 236.586L127.962 417.001Z" fill="#8A92B2"/>
                </svg>
              </div>
            </div>

            {/* 3D Growth Chart Bars */}
            <div className="chart-3d-bars">
              <div className="bar bar-1"></div>
              <div className="bar bar-2"></div>
              <div className="bar bar-3"></div>
              <div className="bar bar-4"></div>
              <div className="bar bar-5"></div>
              <div className="chart-growth-arrow">
                <TrendingUp size={28} />
              </div>
            </div>

            {/* Floating Live Badge */}
            <div className="floating-stat-badge">
              <div className="stat-badge-dot"></div>
              <div>
                <div className="stat-badge-label">Bitcoin Market Cap</div>
                <div className="stat-badge-val">{currency.symbol}1.32T <span className="badge-green">+4.2%</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 4 Cards */}
      <section className="landing-features-grid" id="features">
        {featureCards.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div 
              key={idx} 
              className="feature-card"
              onClick={() => navigate('/dashboard')}
            >
              <div className="feature-icon-wrapper" style={{ background: `${feat.color}20`, color: feat.color }}>
                <Icon size={22} />
              </div>
              <div className="feature-text">
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        initialMode={authModal.mode}
      />
    </div>
  );
};

export default Landing;

