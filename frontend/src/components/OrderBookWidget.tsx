import React from 'react';
import { OrderBook } from '../types/trading';

interface OrderBookWidgetProps {
  orderBook: OrderBook;
}

export const OrderBookWidget: React.FC<OrderBookWidgetProps> = ({ orderBook }) => {
  const formatPrice = (price: number) => price.toLocaleString('en-US', { minimumFractionDigits: 2 });
  const formatAmount = (amount: number) => amount.toFixed(4);

  const maxBidTotal = Math.max(...orderBook.bids.map(b => b.total));
  const maxAskTotal = Math.max(...orderBook.asks.map(a => a.total));
  const maxTotal = Math.max(maxBidTotal, maxAskTotal);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Order Book</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Asks (Sell Orders) */}
        <div>
          <div className="text-sm font-medium text-red-400 mb-3 text-center">Asks (Sell)</div>
          <div className="space-y-1">
            {orderBook.asks.slice(0, 10).reverse().map((ask, index) => (
              <div key={index} className="relative flex justify-between text-xs py-1 px-2 rounded">
                <div 
                  className="absolute inset-0 bg-red-500/10 rounded"
                  style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                />
                <span className="relative z-10 text-red-400">{formatPrice(ask.price)}</span>
                <span className="relative z-10 text-gray-300">{formatAmount(ask.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div>
          <div className="text-sm font-medium text-green-400 mb-3 text-center">Bids (Buy)</div>
          <div className="space-y-1">
            {orderBook.bids.slice(0, 10).map((bid, index) => (
              <div key={index} className="relative flex justify-between text-xs py-1 px-2 rounded">
                <div 
                  className="absolute inset-0 bg-green-500/10 rounded"
                  style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                />
                <span className="relative z-10 text-green-400">{formatPrice(bid.price)}</span>
                <span className="relative z-10 text-gray-300">{formatAmount(bid.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spread */}
      <div className="mt-4 pt-4 border-t border-gray-700 text-center">
        <div className="text-xs text-gray-400 mb-1">Spread</div>
        <div className="text-sm font-semibold text-white">
          ${(orderBook.asks[0]?.price - orderBook.bids[0]?.price || 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};