export interface PriceData {
  timestamp: number;
  price: number;
  volume: number;
  high24h: number;
  low24h: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  bid: number;
  ask: number;
  spread: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  timestamp: number;
}

export interface Trade {
  id: string;
  timestamp: number;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  total: number;
}

export interface TechnicalIndicator {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  sma20: number;
  sma50: number;
  ema12: number;
  ema26: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
}

export interface Alert {
  id: string;
  type: 'price' | 'volume' | 'technical';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: number;
  acknowledged: boolean;
  triggerPrice?: number;
}

export type TimeWindow = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

export interface MarketStats {
  volume24h: number;
  trades24h: number;
  volatility: number;
  dominance: number;
  fearGreedIndex: number;
}