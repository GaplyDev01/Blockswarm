import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Trade {
  id: string;
  price: number;
  size: number;
  type: 'buy' | 'sell';
  time: string;
  exchange: string;
}

const mockTrades: Trade[] = [
  {
    id: '1',
    price: 122.45,
    size: 1250,
    type: 'buy',
    time: '12:30:45',
    exchange: 'Raydium'
  },
  {
    id: '2',
    price: 122.43,
    size: 850,
    type: 'sell',
    time: '12:30:42',
    exchange: 'Jupiter'
  },
  {
    id: '3',
    price: 122.47,
    size: 2100,
    type: 'buy',
    time: '12:30:38',
    exchange: 'Orca'
  },
  {
    id: '4',
    price: 122.41,
    size: 1500,
    type: 'sell',
    time: '12:30:35',
    exchange: 'Raydium'
  },
  {
    id: '5',
    price: 122.44,
    size: 950,
    type: 'buy',
    time: '12:30:31',
    exchange: 'Jupiter'
  }
];

export const OrderFlowTool: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm text-gray-400">Live Order Flow</h4>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-400">Buy Volume</p>
            <p className="text-sm text-emerald">4,300</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Sell Volume</p>
            <p className="text-sm text-red-500">2,350</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 h-[300px] overflow-y-auto">
        {mockTrades.map(trade => (
          <div 
            key={trade.id}
            className={`p-3 rounded-lg ${
              trade.type === 'buy' 
                ? 'bg-emerald/10 border border-emerald/30' 
                : 'bg-red-500/10 border border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {trade.type === 'buy' ? (
                  <ArrowUp className="text-emerald" size={16} />
                ) : (
                  <ArrowDown className="text-red-500" size={16} />
                )}
                <span className={`font-medium ${
                  trade.type === 'buy' ? 'text-emerald' : 'text-red-500'
                }`}>
                  ${trade.price.toFixed(2)}
                </span>
              </div>
              <span className="text-white font-medium">{trade.size.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>{trade.exchange}</span>
              <span>{trade.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};