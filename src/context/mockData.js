// Comprehensive fallback data for cryptocurrencies when CoinGecko API rate limits
export const FALLBACK_COINS = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 67432.12,
    market_cap: 1324890200000,
    market_cap_rank: 1,
    total_volume: 28420000000,
    high_24h: 68150.00,
    low_24h: 65980.00,
    price_change_24h: 2715.45,
    price_change_percentage_24h: 4.20,
    circulating_supply: 19750000,
    total_supply: 21000000,
    sparkline_in_7d: {
      price: [64200, 64800, 65100, 64900, 65600, 66300, 65900, 66800, 67200, 67432]
    },
    description: "Bitcoin is a decentralized digital currency that operates without a central bank or single administrator. It was invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.",
    category: "Cryptocurrency",
    website: "https://bitcoin.org",
    whitepaper: "https://bitcoin.org/bitcoin.pdf"
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3254.21,
    market_cap: 391580000000,
    market_cap_rank: 2,
    total_volume: 16780000000,
    high_24h: 3310.50,
    low_24h: 3120.00,
    price_change_24h: 207.60,
    price_change_percentage_24h: 6.80,
    circulating_supply: 120400000,
    total_supply: 120400000,
    sparkline_in_7d: {
      price: [3050, 3080, 3120, 3110, 3180, 3210, 3190, 3230, 3240, 3254]
    },
    description: "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform.",
    category: "Smart Contracts",
    website: "https://ethereum.org",
    whitepaper: "https://ethereum.org/en/whitepaper/"
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.00,
    market_cap: 112480000000,
    market_cap_rank: 3,
    total_volume: 52380000000,
    high_24h: 1.002,
    low_24h: 0.998,
    price_change_24h: 0.00,
    price_change_percentage_24h: 0.01,
    circulating_supply: 112480000000,
    total_supply: 112480000000,
    sparkline_in_7d: {
      price: [1.0, 1.001, 0.999, 1.0, 1.0, 1.001, 1.0, 0.999, 1.0, 1.0]
    },
    description: "Tether (USDT) is a cryptocurrency with a value meant to mirror the value of the U.S. dollar, backed by Tether's reserves.",
    category: "Stablecoin",
    website: "https://tether.to",
    whitepaper: "https://tether.to/en/legal/"
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 142.56,
    market_cap: 65880000000,
    market_cap_rank: 4,
    total_volume: 4280000000,
    high_24h: 146.20,
    low_24h: 135.40,
    price_change_24h: 11.88,
    price_change_percentage_24h: 9.10,
    circulating_supply: 462000000,
    total_supply: 578000000,
    sparkline_in_7d: {
      price: [129, 131, 133, 132, 136, 138, 139, 140, 141, 142.56]
    },
    description: "Solana is a high-performance blockchain supporting builders across the world building crypto apps that scale today.",
    category: "Layer 1",
    website: "https://solana.com",
    whitepaper: "https://solana.com/solana-whitepaper.pdf"
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 582.34,
    market_cap: 85280000000,
    market_cap_rank: 5,
    total_volume: 2880000000,
    high_24h: 590.00,
    low_24h: 565.00,
    price_change_24h: 20.80,
    price_change_percentage_24h: 3.70,
    circulating_supply: 146000000,
    total_supply: 146000000,
    sparkline_in_7d: {
      price: [555, 560, 563, 568, 572, 575, 578, 580, 581, 582.34]
    },
    description: "BNB is the ecosystem token that powers BNB Chain, providing network fees, DeFi utilities, and trading fee discounts.",
    category: "Exchange Token",
    website: "https://binance.com",
    whitepaper: "https://www.binance.com/en/whitepaper"
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.5234,
    market_cap: 28680000000,
    market_cap_rank: 6,
    total_volume: 1480000000,
    high_24h: 0.5350,
    low_24h: 0.5050,
    price_change_24h: 0.0147,
    price_change_percentage_24h: 2.90,
    circulating_supply: 55000000000,
    total_supply: 100000000000,
    sparkline_in_7d: {
      price: [0.49, 0.50, 0.505, 0.51, 0.515, 0.518, 0.52, 0.521, 0.522, 0.5234]
    },
    description: "XRP is a digital asset built for payments. It is the native token of XRP Ledger, an open-source, permissionless blockchain.",
    category: "Payments",
    website: "https://ripple.com/xrp",
    whitepaper: "https://ripple.com/files/ripple_consensus_whitepaper.pdf"
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.1623,
    market_cap: 23180000000,
    market_cap_rank: 7,
    total_volume: 1180000000,
    high_24h: 0.1700,
    low_24h: 0.1550,
    price_change_24h: 0.0053,
    price_change_percentage_24h: 3.40,
    circulating_supply: 144000000000,
    total_supply: 144000000000,
    sparkline_in_7d: {
      price: [0.151, 0.153, 0.155, 0.158, 0.159, 0.160, 0.161, 0.162, 0.162, 0.1623]
    },
    description: "Dogecoin is an open-source peer-to-peer cryptocurrency, favored by Shiba Inus worldwide.",
    category: "Meme",
    website: "https://dogecoin.com",
    whitepaper: "https://dogecoin.com"
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.4512,
    market_cap: 15880000000,
    market_cap_rank: 8,
    total_volume: 731200000,
    high_24h: 0.4650,
    low_24h: 0.4380,
    price_change_24h: 0.0118,
    price_change_percentage_24h: 2.70,
    circulating_supply: 35600000000,
    total_supply: 45000000000,
    sparkline_in_7d: {
      price: [0.43, 0.435, 0.439, 0.442, 0.446, 0.448, 0.45, 0.451, 0.451, 0.4512]
    },
    description: "Cardano is a proof-of-stake blockchain platform that says its goal is to allow changemakers, innovators and visionaries to bring about positive global change.",
    category: "Smart Contracts",
    website: "https://cardano.org",
    whitepaper: "https://cardano.org/research/"
  },
  {
    id: "avalanche-2",
    symbol: "avax",
    name: "Avalanche",
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    current_price: 28.45,
    market_cap: 11200000000,
    market_cap_rank: 9,
    total_volume: 520000000,
    high_24h: 29.80,
    low_24h: 27.10,
    price_change_24h: -0.45,
    price_change_percentage_24h: -1.55,
    circulating_supply: 395000000,
    total_supply: 440000000,
    sparkline_in_7d: {
      price: [29.5, 29.2, 29.0, 28.8, 28.5, 28.6, 28.3, 28.4, 28.45, 28.45]
    },
    description: "Avalanche is an umbrella platform for launching decentralized finance (DeFi) applications, financial assets, trading and other services.",
    category: "Layer 1",
    website: "https://avax.network",
    whitepaper: "https://www.avalabs.org/whitepapers"
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    current_price: 13.85,
    market_cap: 8250000000,
    market_cap_rank: 10,
    total_volume: 380000000,
    high_24h: 14.30,
    low_24h: 13.20,
    price_change_24h: -0.32,
    price_change_percentage_24h: -2.25,
    circulating_supply: 608000000,
    total_supply: 1000000000,
    sparkline_in_7d: {
      price: [14.5, 14.3, 14.1, 14.0, 13.9, 13.8, 13.7, 13.8, 13.85, 13.85]
    },
    description: "Chainlink is a blockchain abstraction layer that enables universally connected smart contracts.",
    category: "Oracle",
    website: "https://chain.link",
    whitepaper: "https://chain.link/whitepaper"
  }
];

export const INITIAL_WATCHLIST = ["bitcoin", "ethereum", "solana", "cardano", "dogecoin"];

export const INITIAL_ALERTS = [
  { id: "alt-1", coinId: "bitcoin", condition: "above", targetPrice: 70000, status: "Active" },
  { id: "alt-2", coinId: "ethereum", condition: "below", targetPrice: 2900, status: "Active" },
  { id: "alt-3", coinId: "solana", condition: "above", targetPrice: 150, status: "Active" },
  { id: "alt-4", coinId: "dogecoin", condition: "below", targetPrice: 0.15, status: "Triggered" },
  { id: "alt-5", coinId: "cardano", condition: "above", targetPrice: 0.50, status: "Active" },
];

export const INITIAL_PORTFOLIO = {
  totalValue: 12458.32,
  totalInvested: 11209.56,
  profitPercent: 12.5,
  profitAmount: 1248.76,
  allocations: [
    { name: "Bitcoin", symbol: "BTC", percent: 45.2, value: 5631.16, color: "#f59e0b" },
    { name: "Ethereum", symbol: "ETH", percent: 28.6, value: 3563.08, color: "#6366f1" },
    { name: "Solana", symbol: "SOL", percent: 12.4, value: 1544.83, color: "#10b981" },
    { name: "Cardano", symbol: "ADA", percent: 7.8, value: 971.75, color: "#3b82f6" },
    { name: "Others", symbol: "OTHER", percent: 5.9, value: 747.50, color: "#8b5cf6" },
  ],
  transactions: [
    { id: "tx-1", type: "Bought", coin: "Bitcoin", symbol: "BTC", amount: "0.05 BTC", total: "$3,372.00", date: "Apr 28", status: "Completed" },
    { id: "tx-2", type: "Sold", coin: "Ethereum", symbol: "ETH", amount: "0.20 ETH", total: "$650.84", date: "Apr 25", status: "Completed" },
    { id: "tx-3", type: "Bought", coin: "Solana", symbol: "SOL", amount: "2.00 SOL", total: "$285.12", date: "Apr 20", status: "Completed" },
    { id: "tx-4", type: "Sold", coin: "Dogecoin", symbol: "DOGE", amount: "500 DOGE", total: "$81.50", date: "Apr 18", status: "Completed" },
  ]
};

export const PORTFOLIO_HISTORY = [
  { label: "Jan", value: 8900 },
  { label: "Feb", value: 9400 },
  { label: "Mar", value: 9100 },
  { label: "Apr", value: 10600 },
  { label: "May", value: 11200 },
  { label: "Jun", value: 12458.32 },
];

