import { useState, useEffect, useCallback } from 'react';
import { PriceData, Trade, Alert, OrderBook, TechnicalIndicator, MarketStats } from '../types/trading';
import { cryptoApi } from '../services/cryptoApi';
import { generateOrderBook, generateMockTrade, generateMockAlert, generateTechnicalIndicators, generateMarketStats } from '../utils/mockTradingData';

interface UseTradingWebSocketReturn {
  priceData: PriceData[];
  currentPrice: PriceData | null;
  trades: Trade[];
  alerts: Alert[];
  orderBook: OrderBook;
  technicalIndicators: TechnicalIndicator;
  marketStats: MarketStats;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  clearData: () => void;
  acknowledgeAlert: (alertId: string) => void;
}

export const useTradingWebSocket = (): UseTradingWebSocketReturn => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<PriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBook>({ bids: [], asks: [], timestamp: Date.now() });
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator>(generateTechnicalIndicators());
  const [marketStats, setMarketStats] = useState<MarketStats>(generateMarketStats());
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');

  const clearData = useCallback(() => {
    setPriceData([]);
    setTrades([]);
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  useEffect(() => {
    let priceInterval: NodeJS.Timeout;
    let tradeInterval: NodeJS.Timeout;
    let alertInterval: NodeJS.Timeout;
    let orderBookInterval: NodeJS.Timeout;
    let indicatorInterval: NodeJS.Timeout;
    let statsInterval: NodeJS.Timeout;

    const initializeConnection = async () => {
      setConnectionStatus('connecting');
      
      try {
        // Test API connection
        const isApiAvailable = await cryptoApi.testConnection();
        
        if (isApiAvailable) {
          setConnectionStatus('connected');
          setIsConnected(true);
          
          // Fetch initial real price data
          const initialPrice = await cryptoApi.fetchBTCPrice();
          setCurrentPrice(initialPrice);
          setPriceData([initialPrice]);
          
          // Set up real-time price updates (every 15 seconds to respect rate limits)
          priceInterval = setInterval(async () => {
            try {
              const newPrice = await cryptoApi.fetchBTCPrice();
              setCurrentPrice(newPrice);
              setPriceData(prev => {
                const updated = [...prev, newPrice];
                return updated.slice(-100); // Keep last 100 data points
              });
            } catch (error) {
              console.error('Error fetching price update:', error);
            }
          }, 15000);
          
        } else {
          throw new Error('API not available');
        }
      } catch (error) {
        console.error('Connection failed, using mock data:', error);
        setConnectionStatus('error');
        setIsConnected(false);
        
        // Fallback to mock data
        const mockPrice = await cryptoApi.fetchBTCPrice(); // This will return mock data
        setCurrentPrice(mockPrice);
        setPriceData([mockPrice]);
        
        // Mock price updates every 2 seconds
        priceInterval = setInterval(async () => {
          const newPrice = await cryptoApi.fetchBTCPrice();
          setCurrentPrice(newPrice);
          setPriceData(prev => {
            const updated = [...prev, newPrice];
            return updated.slice(-100);
          });
        }, 2000);
      }

      // Set up mock trading data (since we don't have access to real trading APIs)
      tradeInterval = setInterval(() => {
        const newTrade = generateMockTrade();
        setTrades(prev => [newTrade, ...prev.slice(0, 49)]); // Keep last 50 trades
      }, 1000 + Math.random() * 3000); // Random interval 1-4 seconds

      // Update order book every 3-8 seconds
      orderBookInterval = setInterval(() => {
        const { bids, asks } = generateOrderBook();
        setOrderBook({ bids, asks, timestamp: Date.now() });
      }, 3000 + Math.random() * 5000);

      // Generate alerts occasionally
      alertInterval = setInterval(() => {
        if (Math.random() < 0.2) { // 20% chance every 30 seconds
          const newAlert = generateMockAlert();
          setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
        }
      }, 30000);

      // Update technical indicators every 60 seconds
      indicatorInterval = setInterval(() => {
        setTechnicalIndicators(generateTechnicalIndicators());
      }, 60000);

      // Update market stats every 2 minutes
      statsInterval = setInterval(() => {
        setMarketStats(generateMarketStats());
      }, 120000);
    };

    initializeConnection();

    return () => {
      clearInterval(priceInterval);
      clearInterval(tradeInterval);
      clearInterval(alertInterval);
      clearInterval(orderBookInterval);
      clearInterval(indicatorInterval);
      clearInterval(statsInterval);
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };
  }, []);

  return {
    priceData,
    currentPrice,
    trades,
    alerts,
    orderBook,
    technicalIndicators,
    marketStats,
    isConnected,
    connectionStatus,
    clearData,
    acknowledgeAlert
  };
};