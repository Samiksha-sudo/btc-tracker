import React, { useState } from 'react';
import { Bitcoin, Wifi, WifiOff, Settings, Bell, AlertTriangle } from 'lucide-react';
import { useTradingWebSocket } from '../hooks/useTradingWebSocket';
import { PriceChart } from './PriceChart';
import { OrderBookWidget } from './OrderBookWidget';
import { TradeHistory } from './TradeHistory';
import { TechnicalIndicators } from './TechnicalIndicators';
import { MarketStatsWidget } from './MarketStatsWidget';
import { MetricCard } from './MetricCard';
import { AlertPanel } from './AlertPanel';
import { TimeWindow } from '../types/trading';

export const TradingDashboard: React.FC = () => {
  const {
    priceData,
    currentPrice,
    trades,
    alerts,
    orderBook,
    technicalIndicators,
    marketStats,
    isConnected,
    connectionStatus,
    acknowledgeAlert
  } = useTradingWebSocket();

  const [timeWindow, setTimeWindow] = useState<TimeWindow>('1h');
  const [activeTab, setActiveTab] = useState<'trading' | 'analysis' | 'alerts'>('trading');

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'error':
        return 'text-orange-500';
      default:
        return 'text-red-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Live Data';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Mock Data';
      default:
        return 'Disconnected';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Bitcoin className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold">BTC/USD Trading</h1>
              <div className="text-sm text-gray-400">
                Real-time Bitcoin Price Tracker
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Current Price Display */}
            {currentPrice && (
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {formatPrice(currentPrice.price)}
                </div>
                <div className={`text-sm font-medium ${currentPrice.changePercent24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currentPrice.changePercent24h >= 0 ? '+' : ''}
                  {currentPrice.changePercent24h.toFixed(2)}% (24h)
                </div>
              </div>
            )}
            
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-5 h-5 text-green-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className={`text-sm ${getConnectionStatusColor()}`}>
                {getConnectionStatusText()}
              </span>
            </div>
            
            {/* Alerts */}
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-400" />
              {unacknowledgedAlerts.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unacknowledgedAlerts.length}
                </span>
              )}
            </div>
            
            <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex space-x-8 mt-6">
          <button
            onClick={() => setActiveTab('trading')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'trading'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Trading
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'analysis'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Analysis
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'alerts'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Alerts
            {unacknowledgedAlerts.length > 0 && (
              <span className="ml-2 bg-red-500 text-xs rounded-full px-2 py-1">
                {unacknowledgedAlerts.length}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'trading' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Current Price"
                value={currentPrice ? formatPrice(currentPrice.price) : '-'}
                change={currentPrice?.changePercent24h}
                trend={currentPrice && currentPrice.changePercent24h >= 0 ? 'up' : 'down'}
              />
              <MetricCard
                title="24h Volume"
                value={currentPrice ? `${(currentPrice.volume / 1000).toFixed(1)}K` : '-'}
                suffix=" BTC"
                trend="neutral"
              />
              <MetricCard
                title="Market Cap"
                value={currentPrice ? `$${(currentPrice.marketCap / 1000000000).toFixed(1)}B` : '-'}
                trend="neutral"
              />
              <MetricCard
                title="Bid/Ask Spread"
                value={currentPrice ? `$${currentPrice.spread.toFixed(2)}` : '-'}
                trend="neutral"
              />
            </div>

            {/* Main Trading Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <PriceChart data={priceData} height={400} />
              </div>
              <div className="space-y-6">
                <OrderBookWidget orderBook={orderBook} />
                <MarketStatsWidget stats={marketStats} />
              </div>
            </div>

            {/* Trade History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradeHistory trades={trades} />
              <TechnicalIndicators indicators={technicalIndicators} />
            </div>
          </>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PriceChart data={priceData} height={300} />
              <TechnicalIndicators indicators={technicalIndicators} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketStatsWidget stats={marketStats} />
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Price Analysis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-400">Support Level</span>
                    <span className="text-green-400 font-medium">
                      {currentPrice ? formatPrice(currentPrice.low24h) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-400">Resistance Level</span>
                    <span className="text-red-400 font-medium">
                      {currentPrice ? formatPrice(currentPrice.high24h) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-400">Price Range (24h)</span>
                    <span className="text-white font-medium">
                      {currentPrice ? `${((currentPrice.high24h - currentPrice.low24h) / currentPrice.low24h * 100).toFixed(2)}%` : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Price Alerts & Notifications</h2>

            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlertPanel alerts={alerts} onAcknowledge={acknowledgeAlert} />
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Alert Configuration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span>Price Above</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        defaultValue="60000"
                        className="w-20 px-2 py-1 bg-gray-600 rounded text-sm"
                      />
                      <span className="text-sm text-gray-400">USD</span>
                      <input type="checkbox" className="text-orange-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span>Price Below</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        defaultValue="40000"
                        className="w-20 px-2 py-1 bg-gray-600 rounded text-sm"
                      />
                      <span className="text-sm text-gray-400">USD</span>
                      <input type="checkbox" className="text-orange-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span>Volume Spike</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        defaultValue="200"
                        className="w-16 px-2 py-1 bg-gray-600 rounded text-sm"
                      />
                      <span className="text-sm text-gray-400">%</span>
                      <input type="checkbox" defaultChecked className="text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};