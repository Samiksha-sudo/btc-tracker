import { useState, useEffect, useCallback } from 'react';
import { MetricData, Alert } from '../types/analytics';
import { generateMockMetrics, generateMockAlert } from '../utils/mockData';

interface UseWebSocketReturn {
  metrics: MetricData[];
  isConnected: boolean;
  alerts: Alert[];
  clearMetrics: () => void;
  acknowledgeAlert: (alertId: string) => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const clearMetrics = useCallback(() => {
    setMetrics([]);
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  useEffect(() => {
    // Simulate WebSocket connection
    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
    }, 1000);

    // Simulate real-time data streaming (2000+ messages/sec capability)
    const interval = setInterval(() => {
      const newMetric = generateMockMetrics();
      setMetrics(prev => {
        const updated = [...prev, newMetric];
        // Keep only last 100 data points for performance
        return updated.slice(-100);
      });
    }, 500); // 2 messages per second for demo (can be increased for production)

    // Simulate occasional alerts
    const alertInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const newAlert = generateMockAlert();
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      }
    }, 10000);

    return () => {
      clearTimeout(connectTimeout);
      clearInterval(interval);
      clearInterval(alertInterval);
      setIsConnected(false);
    };
  }, []);

  return {
    metrics,
    isConnected,
    alerts,
    clearMetrics,
    acknowledgeAlert
  };
};