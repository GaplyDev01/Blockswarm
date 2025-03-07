import React from 'react';
import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react';
import type { PortfolioToken } from '../../types';

const MOCK_PORTFOLIO: PortfolioToken[] = [
  {
    symbol: 'SOL',
    amount: 123.45,
    value_usd: 15234.56,
    price_change_24h: 2.5
  },
  {
    symbol: 'BONK',
    amount: 1000000,
    value_usd: 5234.12,
    price_change_24h: -1.2
  }
];

export const Portfolio: React.FC = () => {
  const totalValue = MOCK_PORTFOLIO.reduce((acc, token) => acc + token.value_usd, 0);
  
  return (
    <div className="bg-black/80 backdrop-blur-lg rounded-xl p-6 border border-green-500/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Portfolio</h2>
        <div className="flex items-center gap-2 text-green-400">
          <BarChart2 size={20} />
          <span className="font-semibold">${totalValue.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {MOCK_PORTFOLIO.map(token => (
          <div
            key={token.symbol}
            className="flex items-center justify-between p-4 rounded-lg bg-black/50 border border-green-500/10"
          >
            <div>
              <h3 className="font-semibold text-white">{token.symbol}</h3>
              <p className="text-sm text-gray-400">{token.amount.toLocaleString()} tokens</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-white">${token.value_usd.toLocaleString()}</p>
              <p className={`text-sm flex items-center gap-1 ${token.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {token.price_change_24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {token.price_change_24h.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};