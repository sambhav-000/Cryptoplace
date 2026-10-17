import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TradeModal from '../components/Modals/TradeModal';
import { CoinContext } from '../context/CoinContext';

const mockCoin = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  current_price: 50000,
  image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
};

const renderTradeModal = (contextOverrides = {}) => {
  const defaultContext = {
    tradeModal: { isOpen: true, coin: mockCoin, mode: 'Buy' },
    setTradeModal: vi.fn(),
    currency: { name: 'usd', symbol: '$', rate: 1 },
    executeTrade: vi.fn(),
    ...contextOverrides
  };

  return {
    ...render(
      <CoinContext.Provider value={defaultContext}>
        <TradeModal />
      </CoinContext.Provider>
    ),
    context: defaultContext
  };
};

describe('TradeModal Component', () => {
  it('does not render when modal is closed', () => {
    const { container } = render(
      <CoinContext.Provider value={{ tradeModal: { isOpen: false, coin: null }, setTradeModal: vi.fn() }}>
        <TradeModal />
      </CoinContext.Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders coin details when opened', () => {
    renderTradeModal();

    expect(screen.getByText('Buy Bitcoin')).toBeInTheDocument();
    expect(screen.getAllByText('BTC').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('allows toggling between Buy and Sell tabs', () => {
    renderTradeModal();

    const sellTab = screen.getByRole('button', { name: 'Sell' });
    fireEvent.click(sellTab);

    expect(screen.getByText('Sell Bitcoin')).toBeInTheDocument();
  });

  it('calculates estimated total based on amount', () => {
    renderTradeModal();

    const amountInput = screen.getByRole('spinbutton');
    fireEvent.change(amountInput, { target: { value: '2' } });

    // Locale-agnostic formatting match: $100,000 or $1,00,000
    const expectedFormatted = `$${Number(100000).toLocaleString()}`;
    expect(screen.getByDisplayValue(expectedFormatted)).toBeInTheDocument();
  });

  it('calls executeTrade and closes modal on submit', () => {
    const { context } = renderTradeModal();

    const submitBtn = screen.getByRole('button', { name: /buy btc/i });
    fireEvent.click(submitBtn);

    expect(context.executeTrade).toHaveBeenCalledWith({
      type: 'Bought',
      coin: mockCoin,
      amount: 1,
      total: '50000.00'
    });
    expect(context.setTradeModal).toHaveBeenCalledWith({
      isOpen: false,
      coin: null,
      mode: 'Buy'
    });
  });
});
