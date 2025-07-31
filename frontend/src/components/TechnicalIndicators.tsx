import React from 'react';
import { TechnicalIndicator } from '../types/trading';

interface TechnicalIndicatorsProps {
  indicators: TechnicalIndicator;
}

export const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ indicators }) => {
  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return 'text-red-400';
    if (rsi < 30) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getRSILabel = (rsi: number) => {
    if (rsi > 70) return 'Overbought';
    if (rsi < 30) return 'Oversold';
    return 'Neutral';
  };

  const getMACDColor = (macd: number, signal: number) => {
    return macd > signal ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Technical Indicators</h3>
      
      <div className="space-y-6">
        {/* RSI */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">RSI (14)</span>
            <span className={`text-sm font-medium ${getRSIColor(indicators.rsi)}`}>
              {indicators.rsi.toFixed(1)} - {getRSILabel(indicators.rsi)}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                indicators.rsi > 70 ? 'bg-red-500' : 
                indicators.rsi < 30 ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${indicators.rsi}%` }}
            />
          </div>
        </div>

        {/* MACD */}
        <div>
          <div className="text-sm text-gray-400 mb-2">MACD</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <div className="text-gray-500">MACD</div>
              <div className={`font-medium ${getMACDColor(indicators.macd.macd, indicators.macd.signal)}`}>
                {indicators.macd.macd.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Signal</div>
              <div className="text-white">{indicators.macd.signal.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-500">Histogram</div>
              <div className={`font-medium ${indicators.macd.histogram >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {indicators.macd.histogram.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Moving Averages */}
        <div>
          <div className="text-sm text-gray-400 mb-2">Moving Averages</div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-gray-500 mb-1">SMA 20</div>
              <div className="text-white font-medium">${indicators.sma20.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">SMA 50</div>
              <div className="text-white font-medium">${indicators.sma50.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">EMA 12</div>
              <div className="text-white font-medium">${indicators.ema12.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">EMA 26</div>
              <div className="text-white font-medium">${indicators.ema26.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Bollinger Bands */}
        <div>
          <div className="text-sm text-gray-400 mb-2">Bollinger Bands</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Upper</span>
              <span className="text-red-400 font-medium">${indicators.bollinger.upper.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Middle</span>
              <span className="text-white font-medium">${indicators.bollinger.middle.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Lower</span>
              <span className="text-green-400 font-medium">${indicators.bollinger.lower.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};