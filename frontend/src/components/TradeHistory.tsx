import React from 'react';
import { Trade } from '../types/trading';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TradeHistoryProps {
  trades: Trade[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  const formatPrice = (price: number) => price.toLocaleString('en-US', { minimumFractionDigits: 2 });
  const formatAmount = (amount: number) => amount.toFixed(4);
  const formatTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString();

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {trades.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No trades yet
          </div>
        ) : (
          trades.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-1 rounded-full ${trade.side === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {trade.side === 'buy' ? (
                    <ArrowUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-red-500" />
                  )}
                </div>
                <div>
                  <div className={`text-sm font-medium ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    ${formatPrice(trade.price)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTime(trade.timestamp)}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-white">
                  {formatAmount(trade.amount)} BTC
                </div>
                <div className="text-xs text-gray-400">
                  ${trade.total.toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};