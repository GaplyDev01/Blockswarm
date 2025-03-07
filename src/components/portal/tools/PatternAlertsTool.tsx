import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface PatternAlert {
  id: string;
  pattern: string;
  token: string;
  confidence: number;
  timeframe: string;
  type: 'bullish' | 'bearish';
  time: string;
  description: string;
}

const mockAlerts: PatternAlert[] = [
  {
    id: '1',
    pattern: 'Bull Flag',
    token: 'SOL',
    confidence: 85,
    timeframe: '4H',
    type: 'bullish',
    time: '2h ago',
    description: 'Consolidation after strong upward movement suggests continuation'
  },
  {
    id: '2',
    pattern: 'Double Bottom',
    token: 'RAY',
    confidence: 78,
    timeframe: '1D',
    type: 'bullish',
    time: '4h ago',
    description: 'Strong support level tested twice with increasing volume'
  },
  {
    id: '3',
    pattern: 'Head & Shoulders',
    token: 'BONK',
    confidence: 82,
    timeframe: '1H',
    type: 'bearish',
    time: '1h ago',
    description: 'Classic reversal pattern forming at resistance level'
  },
  {
    id: '4',
    pattern: 'Rising Wedge',
    token: 'JTO',
    confidence: 75,
    timeframe: '2H',
    type: 'bearish',
    time: '30m ago',
    description: 'Price approaching apex with declining volume'
  }
];

export const PatternAlertsTool: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-viridian" size={18} />
          <h4 className="text-sm text-gray-400">Pattern Alerts</h4>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Active Alerts</p>
          <p className="text-sm text-white font-medium">{mockAlerts.length}</p>
        </div>
      </div>
      
      <div className="space-y-3 h-[300px] overflow-y-auto">
        {mockAlerts.map(alert => (
          <div 
            key={alert.id}
            className={`p-4 rounded-lg ${
              alert.type === 'bullish'
                ? 'bg-emerald/10 border border-emerald/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{alert.token}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-viridian/20 text-viridian">
                    {alert.timeframe}
                  </span>
                </div>
                <p className="text-lg font-semibold text-white">{alert.pattern}</p>
              </div>
              <div className={`flex items-center gap-1 ${
                alert.type === 'bullish' ? 'text-emerald' : 'text-red-500'
              }`}>
                {alert.type === 'bullish' ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span>{alert.confidence}%</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-2">{alert.description}</p>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} />
              <span>{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};