import { PriceData } from '../types/trading';
import { updateCurrentPrice } from '../utils/mockTradingData';

interface CoinGeckoResponse {
  bitcoin: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
    usd_24h_vol: number;
  };
}

interface CoinGeckoHistoryResponse {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

class CryptoApiService {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private priceHistory: number[] = [];
  private lastFetchTime = 0;
  private cachedData: PriceData | null = null;

  async fetchBTCPrice(): Promise<PriceData> {
    try {
      // Rate limiting: don't fetch more than once per 10 seconds
      const now = Date.now();
      if (now - this.lastFetchTime < 10000 && this.cachedData) {
        return this.cachedData;
      }

      const response = await fetch(
        `${this.baseUrl}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CoinGeckoResponse = await response.json();
      const btcData = data.bitcoin;

      // Fetch 24h price history for high/low calculation
      await this.fetchPriceHistory();

      const currentPrice = btcData.usd;
      const change24h = (currentPrice * btcData.usd_24h_change) / 100;
      
      // Calculate high/low from price history or use approximations
      const high24h = this.priceHistory.length > 0 
        ? Math.max(...this.priceHistory) 
        : currentPrice * (1 + Math.abs(btcData.usd_24h_change) / 200);
      
      const low24h = this.priceHistory.length > 0 
        ? Math.min(...this.priceHistory) 
        : currentPrice * (1 - Math.abs(btcData.usd_24h_change) / 200);

      // Simulate bid/ask spread (typically 0.01-0.1% for BTC)
      const spread = currentPrice * (0.0001 + Math.random() * 0.0009);
      const bid = currentPrice - spread / 2;
      const ask = currentPrice + spread / 2;

      const priceData: PriceData = {
        timestamp: now,
        price: Number(currentPrice.toFixed(2)),
        volume: Number(btcData.usd_24h_vol.toFixed(2)),
        high24h: Number(high24h.toFixed(2)),
        low24h: Number(low24h.toFixed(2)),
        change24h: Number(change24h.toFixed(2)),
        changePercent24h: Number(btcData.usd_24h_change.toFixed(2)),
        marketCap: Number(btcData.usd_market_cap.toFixed(0)),
        bid: Number(bid.toFixed(2)),
        ask: Number(ask.toFixed(2)),
        spread: Number(spread.toFixed(2))
      };

      // Update mock data with real price
      updateCurrentPrice(currentPrice);

      this.lastFetchTime = now;
      this.cachedData = priceData;
      
      return priceData;
    } catch (error) {
      console.error('Error fetching BTC price:', error);
      
      // Fallback to mock data if API fails
      const mockPrice = 50000 + Math.random() * 10000;
      return {
        timestamp: Date.now(),
        price: Number(mockPrice.toFixed(2)),
        volume: 25000 + Math.random() * 10000,
        high24h: Number((mockPrice * 1.05).toFixed(2)),
        low24h: Number((mockPrice * 0.95).toFixed(2)),
        change24h: Number(((Math.random() - 0.5) * 2000).toFixed(2)),
        changePercent24h: Number(((Math.random() - 0.5) * 10).toFixed(2)),
        marketCap: Number((mockPrice * 19700000).toFixed(0)),
        bid: Number((mockPrice - 25).toFixed(2)),
        ask: Number((mockPrice + 25).toFixed(2)),
        spread: 50
      };
    }
  }

  private async fetchPriceHistory(): Promise<void> {
    try {
      // Only fetch history once per hour to avoid rate limits
      if (this.priceHistory.length > 0 && Date.now() - this.lastFetchTime < 3600000) {
        return;
      }

      const response = await fetch(
        `${this.baseUrl}/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=hourly`
      );

      if (!response.ok) {
        return; // Silently fail for history data
      }

      const data: CoinGeckoHistoryResponse = await response.json();
      this.priceHistory = data.prices.map(([, price]) => price);
    } catch (error) {
      console.error('Error fetching price history:', error);
      // Continue without history data
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/ping`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const cryptoApi = new CryptoApiService();