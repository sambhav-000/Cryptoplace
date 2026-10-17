import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Markets from '../pages/Markets/Markets';
import { CoinContext } from '../context/CoinContext';

const mockCoins = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    current_price: 65000,
    price_change_percentage_24h: 3.5,
    total_volume: 25000000000,
    market_cap: 1280000000000,
    market_cap_rank: 1,
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'eth',
    current_price: 3400,
    price_change_percentage_24h: -1.8,
    total_volume: 15000000000,
    market_cap: 410000000000,
    market_cap_rank: 2,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'sol',
    current_price: 145,
    price_change_percentage_24h: 8.2,
    total_volume: 4000000000,
    market_cap: 67000000000,
    market_cap_rank: 3,
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
  }
];

const renderMarkets = (overrides = {}) => {
  const defaultContext = {
    allCoin: mockCoins,
    currency: { name: 'usd', symbol: '$', rate: 1 },
    changeCurrency: vi.fn(),
    setTradeModal: vi.fn(),
    watchlist: ['bitcoin'],
    toggleWatchlist: vi.fn(),
    ...overrides
  };

  return {
    ...render(
      <MemoryRouter>
        <CoinContext.Provider value={defaultContext}>
          <Markets />
        </CoinContext.Provider>
      </MemoryRouter>
    ),
    context: defaultContext
  };
};

describe('Markets Page Component', () => {
  it('renders page heading and table headers', () => {
    renderMarkets();

    expect(screen.getByText('Cryptocurrency Markets')).toBeInTheDocument();
    expect(screen.getByText('Live prices, market cap and 24h changes')).toBeInTheDocument();
    expect(screen.getByText('Coin')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('renders all cryptocurrency listings', () => {
    renderMarkets();

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('Solana')).toBeInTheDocument();
  });

  it('filters coins when searching by name or symbol', () => {
    renderMarkets();

    const searchInput = screen.getByPlaceholderText('Search markets...');
    fireEvent.change(searchInput, { target: { value: 'eth' } });

    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
    expect(screen.queryByText('Solana')).not.toBeInTheDocument();
  });

  it('filters gainers and losers using filter pills', () => {
    renderMarkets();

    const gainersBtn = screen.getByRole('button', { name: 'Gainers' });
    fireEvent.click(gainersBtn);

    // Bitcoin (+3.5%) and Solana (+8.2%) should show, Ethereum (-1.8%) should not
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Solana')).toBeInTheDocument();
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();

    const losersBtn = screen.getByRole('button', { name: 'Losers' });
    fireEvent.click(losersBtn);

    // Ethereum should show, Bitcoin and Solana should not
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
    expect(screen.queryByText('Solana')).not.toBeInTheDocument();
  });

  it('triggers setTradeModal when clicking Buy button', () => {
    const { context } = renderMarkets();

    const buyButtons = screen.getAllByRole('button', { name: /^buy$/i });
    fireEvent.click(buyButtons[0]);

    expect(context.setTradeModal).toHaveBeenCalledWith({
      isOpen: true,
      coin: mockCoins[0],
      mode: 'Buy'
    });
  });
});
