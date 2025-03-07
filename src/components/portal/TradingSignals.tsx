import React from 'react';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import type { Signal } from '../../types';

const MOCK_SIGNALS: Signal[] = [
  {
    id: '1',
    type: 'BULLISH',
    token: 'SOL',
    message: 'Strong buy signal detected based on increasing volume and positive momentum',
    timestamp: new Date().toISOString(),
    confidence: 85
  },
  {
    id: '2',
    type: 'BEARISH',
    token: 'BONK',
    message: 'Potential downtrend forming, consider taking profits',
    timestamp: new Date().toISOString(),
    confidence: 75
  }
];

export const TradingSignals: React.FC = () => {
  return (
    <div className="bg-black/80 backdrop-blur-lg rounded-xl p-6 border border-green-500/20">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="text-green-400" size={24} />
        <h2 className="text-xl font-bold text-white">Live Signals</h2>
      </div>
      
      <div className="space-y-4">
        {MOCK_SIGNALS.map(signal => (
          <div
            key={signal.id}
            className="p-4 rounded-lg bg-black/50 border border-green-500/10"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {signal.type === 'BULLISH' ? (
                  <TrendingUp className="text-green-400" size={20} />
                ) : (
                  <TrendingDown className="text-red-400" size={20} />
                )}
                <span className="font-semibold text-white">{signal.token}</span>
              </div>
              <span className={`text-sm ${signal.type === 'BULLISH' ? 'text-green-400' : 'text-red-400'}`}>
                {signal.type}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2">{signal.message}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {new Date(signal.timestamp).toLocaleTimeString()}
              </span>
              <span className="text-green-400">
                {signal.confidence}% confidence
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};