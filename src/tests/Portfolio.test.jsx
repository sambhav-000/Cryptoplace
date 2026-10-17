import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Portfolio from '../pages/Portfolio/Portfolio';
import { CoinContext } from '../context/CoinContext';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    exportTransactions: vi.fn().mockResolvedValue(true),
  },
  api: {
    exportTransactions: vi.fn().mockResolvedValue(true),
  }
}));

const mockPortfolio = {
  totalValue: 54200.50,
  totalInvested: 45000.00,
  profitAmount: 9200.50,
  profitPercent: 20.4,
  allocations: [
    { name: 'Bitcoin', symbol: 'BTC', percent: 65, value: 35230, color: '#f59e0b' },
    { name: 'Ethereum', symbol: 'ETH', percent: 35, value: 18970.50, color: '#3b82f6' },
  ],
  transactions: [
    {
      id: 'tx-1',
      type: 'Bought',
      symbol: 'BTC',
      amount: '0.5 BTC',
      total: '$30,000',
      date: 'Oct 12'
    }
  ]
};

const mockCoins = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 60000 }
];

const renderPortfolio = () => {
  const mockContext = {
    portfolio: mockPortfolio,
    currency: { name: 'usd', symbol: '$', rate: 1 },
    allCoin: mockCoins,
    setTradeModal: vi.fn(),
    showToast: vi.fn(),
  };

  return {
    ...render(
      <CoinContext.Provider value={mockContext}>
        <Portfolio />
      </CoinContext.Provider>
    ),
    context: mockContext
  };
};

describe('Portfolio Page Component', () => {
  it('renders portfolio summary metrics', () => {
    renderPortfolio();

    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getAllByText('Total Value').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Total Invested')).toBeInTheDocument();
    expect(screen.getByText('Total P/L')).toBeInTheDocument();
  });

  it('renders Export CSV and New Transaction buttons', () => {
    renderPortfolio();

    expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new transaction/i })).toBeInTheDocument();
  });

  it('calls exportTransactions when Export CSV is clicked', async () => {
    const { context } = renderPortfolio();

    const exportBtn = screen.getByRole('button', { name: /export csv/i });
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(api.exportTransactions).toHaveBeenCalledWith('csv');
      expect(context.showToast).toHaveBeenCalledWith('Portfolio transactions exported as CSV');
    });
  });

  it('opens trade modal when New Transaction is clicked', () => {
    const { context } = renderPortfolio();

    const newTxBtn = screen.getByRole('button', { name: /new transaction/i });
    fireEvent.click(newTxBtn);

    expect(context.setTradeModal).toHaveBeenCalledWith({
      isOpen: true,
      coin: mockCoins[0],
      mode: 'Buy'
    });
  });
});
