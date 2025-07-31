import React from 'react';
import { PriceData } from '../types/trading';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceChartProps {
  data: PriceData[];
  height?: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, height = 300 }) => {
  if (data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">BTC/USD Price Chart</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading price data...
        </div>
      </div>
    );
  }

  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2] || currentPrice;
  const priceChange = currentPrice - previousPrice;
  const isPositive = priceChange >= 0;

  // Generate SVG path for price line
  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((point.price - minPrice) / priceRange) * 80 + 10;
    return `${index === 0 ? 'M' : 'L'} ${x} ${100 - y}`;
  }).join(' ');

  // Generate area fill path
  const areaPath = `${pathData} L 100 100 L 0 100 Z`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">BTC/USD</h3>
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-white">
              {formatPrice(currentPrice)}
            </span>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span className="font-medium">
                {formatChange(priceChange)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">24h Change</div>
          <div className={`text-lg font-semibold ${data[data.length - 1]?.changePercent24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {data[data.length - 1]?.changePercent24h >= 0 ? '+' : ''}
            {data[data.length - 1]?.changePercent24h.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="relative" style={{ height }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: isPositive ? '#10B981' : '#EF4444', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: isPositive ? '#10B981' : '#EF4444', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#priceGradient)"
            className="transition-all duration-300"
          />
          
          {/* Price line */}
          <path
            d={pathData}
            fill="none"
            stroke={isPositive ? '#10B981' : '#EF4444'}
            strokeWidth="0.5"
            className="drop-shadow-sm transition-all duration-300"
          />
          
          {/* Current price indicator */}
          {data.length > 0 && (
            <circle
              cx={((data.length - 1) / (data.length - 1)) * 100}
              cy={100 - (((currentPrice - minPrice) / priceRange) * 80 + 10)}
              r="1.5"
              fill={isPositive ? '#10B981' : '#EF4444'}
              className="animate-pulse"
            />
          )}
        </svg>
        
        {/* Price labels */}
        <div className="absolute top-0 right-0 text-xs text-gray-400">
          {formatPrice(maxPrice)}
        </div>
        <div className="absolute bottom-0 right-0 text-xs text-gray-400">
          {formatPrice(minPrice)}
        </div>
      </div>
      
      {/* 24h Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-700">
        <div>
          <div className="text-xs text-gray-400 mb-1">24h High</div>
          <div className="text-sm font-semibold text-white">
            {data[data.length - 1] ? formatPrice(data[data.length - 1].high24h) : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">24h Low</div>
          <div className="text-sm font-semibold text-white">
            {data[data.length - 1] ? formatPrice(data[data.length - 1].low24h) : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">24h Volume</div>
          <div className="text-sm font-semibold text-white">
            {data[data.length - 1] ? `${(data[data.length - 1].volume / 1000).toFixed(1)}K BTC` : '-'}
          </div>
        </div>
      </div>
    </div>
  );
};