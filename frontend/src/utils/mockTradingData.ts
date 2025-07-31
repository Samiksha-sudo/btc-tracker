import { PriceData, OrderBookEntry, Trade, TechnicalIndicator, Alert, MarketStats } from '../types/trading';

let currentPrice = 45000 + Math.random() * 10000; // Starting around $45k-55k
let priceHistory: number[] = [];

export const generateMockPriceData = (): PriceData => {
  // Simulate realistic price movement
  const volatility = 0.002; // 0.2% volatility
  const trend = (Math.random() - 0.5) * 0.001; // Small trend component
  const priceChange = currentPrice * (trend + (Math.random() - 0.5) * volatility);
  
  currentPrice = Math.max(1000, currentPrice + priceChange); // Minimum $1000
  priceHistory.push(currentPrice);
  
  if (priceHistory.length > 1440) { // Keep 24 hours of minute data
    priceHistory.shift();
  }

  const high24h = Math.max(...priceHistory.slice(-1440));
  const low24h = Math.min(...priceHistory.slice(-1440));
  const price24hAgo = priceHistory[Math.max(0, priceHistory.length - 1440)] || currentPrice;
  const change24h = currentPrice - price24hAgo;
  const changePercent24h = (change24h / price24hAgo) * 100;

  const volume = 15000 + Math.random() * 10000; // BTC volume
  const marketCap = currentPrice * 19700000; // ~19.7M BTC in circulation
  
  const spread = currentPrice * (0.0001 + Math.random() * 0.0005); // 0.01-0.06% spread
  const bid = currentPrice - spread / 2;
  const ask = currentPrice + spread / 2;

  return {
    timestamp: Date.now(),
    price: Number(currentPrice.toFixed(2)),
    volume: Number(volume.toFixed(2)),
    high24h: Number(high24h.toFixed(2)),
    low24h: Number(low24h.toFixed(2)),
    change24h: Number(change24h.toFixed(2)),
    changePercent24h: Number(changePercent24h.toFixed(2)),
    marketCap: Number(marketCap.toFixed(0)),
    bid: Number(bid.toFixed(2)),
    ask: Number(ask.toFixed(2)),
    spread: Number(spread.toFixed(2))
  };
};

export const generateOrderBook = (): { bids: OrderBookEntry[]; asks: OrderBookEntry[] } => {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  
  // Generate realistic order book data
  for (let i = 0; i < 15; i++) {
    const bidPrice = currentPrice - (i + 1) * (1 + Math.random() * 5);
    const askPrice = currentPrice + (i + 1) * (1 + Math.random() * 5);
    
    const bidAmount = 0.1 + Math.random() * 2;
    const askAmount = 0.1 + Math.random() * 2;
    
    bids.push({
      price: Number(bidPrice.toFixed(2)),
      amount: Number(bidAmount.toFixed(4)),
      total: Number((bidPrice * bidAmount).toFixed(2))
    });
    
    asks.push({
      price: Number(askPrice.toFixed(2)),
      amount: Number(askAmount.toFixed(4)),
      total: Number((askPrice * askAmount).toFixed(2))
    });
  }
  
  return { bids, asks };
};

export const generateMockTrade = (): Trade => {
  const side: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
  const amount = 0.01 + Math.random() * 1;
  const price = currentPrice + (Math.random() - 0.5) * 10;
  
  return {
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
    price: Number(price.toFixed(2)),
    amount: Number(amount.toFixed(4)),
    side,
    total: Number((price * amount).toFixed(2))
  };
};

export const generateTechnicalIndicators = (): TechnicalIndicator => {
  const rsi = 30 + Math.random() * 40; // RSI between 30-70
  const sma20 = currentPrice * (0.98 + Math.random() * 0.04);
  const sma50 = currentPrice * (0.95 + Math.random() * 0.1);
  const ema12 = currentPrice * (0.99 + Math.random() * 0.02);
  const ema26 = currentPrice * (0.97 + Math.random() * 0.06);
  
  const macdLine = ema12 - ema26;
  const signalLine = macdLine * (0.8 + Math.random() * 0.4);
  const histogram = macdLine - signalLine;
  
  const bollingerMiddle = sma20;
  const bollingerUpper = bollingerMiddle * 1.02;
  const bollingerLower = bollingerMiddle * 0.98;

  return {
    rsi: Number(rsi.toFixed(2)),
    macd: {
      macd: Number(macdLine.toFixed(2)),
      signal: Number(signalLine.toFixed(2)),
      histogram: Number(histogram.toFixed(2))
    },
    sma20: Number(sma20.toFixed(2)),
    sma50: Number(sma50.toFixed(2)),
    ema12: Number(ema12.toFixed(2)),
    ema26: Number(ema26.toFixed(2)),
    bollinger: {
      upper: Number(bollingerUpper.toFixed(2)),
      middle: Number(bollingerMiddle.toFixed(2)),
      lower: Number(bollingerLower.toFixed(2))
    }
  };
};

export const generateMockAlert = (): Alert => {
  const types: Alert['type'][] = ['price', 'volume', 'technical'];
  const severities: Alert['severity'][] = ['info', 'warning', 'critical'];
  const messages = [
    `BTC price crossed $${currentPrice.toFixed(0)} resistance level`,
    'High volume spike detected - 150% above average',
    'RSI indicates oversold conditions',
    'MACD bullish crossover signal',
    'Price broke above 20-day moving average',
    'Support level at $45,000 tested multiple times'
  ];

  return {
    id: Math.random().toString(36).substring(7),
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: Date.now(),
    acknowledged: false,
    triggerPrice: Math.random() > 0.5 ? currentPrice : undefined
  };
};

export const generateMarketStats = (): MarketStats => {
  return {
    volume24h: 25000 + Math.random() * 15000,
    trades24h: Math.floor(180000 + Math.random() * 50000),
    volatility: 2 + Math.random() * 8, // 2-10% volatility
    dominance: 40 + Math.random() * 10, // 40-50% market dominance
    fearGreedIndex: Math.floor(20 + Math.random() * 60) // 20-80 fear/greed index
  };
};

// Update current price for mock data consistency
export const updateCurrentPrice = (newPrice: number) => {
  currentPrice = newPrice;
};