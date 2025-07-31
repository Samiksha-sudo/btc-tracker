import React from 'react';
import { MarketStats } from '../types/trading';
import { TrendingUp, Activity, PieChart, Zap } from 'lucide-react';

interface MarketStatsWidgetProps {
  stats: MarketStats;
}

export const MarketStatsWidget: React.FC<MarketStatsWidgetProps> = ({ stats }) => {
  const getFearGreedColor = (index: number) => {
    if (index < 25) return 'text-red-500';
    if (index < 45) return 'text-orange-500';
    if (index < 55) return 'text-yellow-500';
    if (index < 75) return 'text-green-500';
    return 'text-blue-500';
  };

  const getFearGreedLabel = (index: number) => {
    if (index < 25) return 'Extreme Fear';
    if (index < 45) return 'Fear';
    if (index < 55) return 'Neutral';
    if (index < 75) return 'Greed';
    return 'Extreme Greed';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Market Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* 24h Volume */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">24h Volume</span>
          </div>
          <div className="text-lg font-bold text-white">
            {(stats.volume24h / 1000).toFixed(1)}K BTC
          </div>
          <div className="text-xs text-gray-500">
            ${(stats.volume24h * 50000 / 1000000).toFixed(1)}B USD
          </div>
        </div>

        {/* 24h Trades */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">24h Trades</span>
          </div>
          <div className="text-lg font-bold text-white">
            {(stats.trades24h / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-gray-500">
            {Math.floor(stats.trades24h / 86400)} trades/sec
          </div>
        </div>

        {/* Volatility */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Volatility</span>
          </div>
          <div className="text-lg font-bold text-white">
            {stats.volatility.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">
            24h price range
          </div>
        </div>

        {/* Market Dominance */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <PieChart className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">BTC Dominance</span>
          </div>
          <div className="text-lg font-bold text-white">
            {stats.dominance.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">
            Market cap share
          </div>
        </div>
      </div>

      {/* Fear & Greed Index */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Fear & Greed Index</span>
          <span className={`text-sm font-medium ${getFearGreedColor(stats.fearGreedIndex)}`}>
            {getFearGreedLabel(stats.fearGreedIndex)}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                stats.fearGreedIndex < 25 ? 'bg-red-500' :
                stats.fearGreedIndex < 45 ? 'bg-orange-500' :
                stats.fearGreedIndex < 55 ? 'bg-yellow-500' :
                stats.fearGreedIndex < 75 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${stats.fearGreedIndex}%` }}
            />
          </div>
          <span className={`text-lg font-bold ${getFearGreedColor(stats.fearGreedIndex)}`}>
            {stats.fearGreedIndex}
          </span>
        </div>
      </div>
    </div>
  );
};