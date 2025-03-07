import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Indicator {
  name: string;
  value: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  description: string;
}

const indicators: Indicator[] = [
  {
    name: 'RSI (14)',
    value: 65.8,
    signal: 'BUY',
    description: 'Momentum is strong but not overbought'
  },
  {
    name: 'MACD',
    value: 1.23,
    signal: 'BUY',
    description: 'Bullish crossover detected'
  },
  {
    name: 'Stochastic',
    value: 82.5,
    signal: 'SELL',
    description: 'Approaching overbought territory'
  },
  {
    name: 'Moving Average (50)',
    value: 122.45,
    signal: 'BUY',
    description: 'Price above MA, uptrend confirmed'
  }
];

export const TechnicalIndicatorsTool: React.FC = () => {
  return (
    <div className="space-y-4 h-[400px] overflow-y-auto">
      {indicators.map((indicator, index) => (
        <div 
          key={index}
          className="p-4 rounded-lg bg-black/20 border border-viridian/30"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium text-white">{indicator.name}</h4>
              <p className="text-2xl font-semibold text-viridian">{indicator.value}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              indicator.signal === 'BUY' 
                ? 'bg-emerald/20 text-emerald' 
                : indicator.signal === 'SELL'
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-gray-500/20 text-gray-400'
            }`}>
              {indicator.signal}
            </span>
          </div>
          <p className="text-sm text-gray-400">{indicator.description}</p>
        </div>
      ))}
    </div>
  );
};