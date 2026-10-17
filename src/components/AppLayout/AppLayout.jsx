import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import TradeModal from '../Modals/TradeModal';
import AlertModal from '../Modals/AlertModal';
import WatchlistModal from '../Modals/WatchlistModal';
import AuthModal from '../Modals/AuthModal';
import { CoinContext } from '../../context/CoinContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import './AppLayout.css';

const AppLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const { toast } = useContext(CoinContext);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <div className="app-main-viewport">
        <Header 
          onToggleMobileSidebar={() => setIsMobileOpen(true)}
          onOpenAuth={handleOpenAuth}
        />

        <main className="app-page-content">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <TradeModal />
      <AlertModal />
      <WatchlistModal />
      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        initialMode={authModal.mode}
      />

      {/* Global Toast */}
      {toast && (
        <div className="cp-toast">
          {toast.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
          {toast.type === 'danger' && <AlertCircle size={18} color="#ef4444" />}
          {toast.type === 'info' && <Info size={18} color="#3b82f6" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AppLayout;

