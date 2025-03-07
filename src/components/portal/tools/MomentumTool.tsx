import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../../context/ThemeContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MomentumIndicator {
  name: string;
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  change: number;
}

const mockIndicators: MomentumIndicator[] = [
  {
    name: 'RSI',
    value: 65.8,
    signal: 'bullish',
    change: 2.3
  },
  {
    name: 'MACD',
    value: 1.23,
    signal: 'bullish',
    change: 0.45
  },
  {
    name: 'Stochastic',
    value: 82.5,
    signal: 'bearish',
    change: -1.8
  },
  {
    name: 'ADX',
    value: 28.4,
    signal: 'neutral',
    change: 0.2
  }
];

const generateMockMomentumData = (points: number = 50) => {
  const momentum: number[] = [];
  let value = 50;
  
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.5) * 5;
    value = Math.max(0, Math.min(100, value));
    momentum.push(value);
  }
  
  return momentum;
};

export const MomentumTool: React.FC = () => {
  const { isDark } = useTheme();
  const momentumData = generateMockMomentumData();
  
  const chartData = {
    labels: Array.from({ length: momentumData.length }, (_, i) => i),
    datasets: [
      {
        label: 'Momentum',
        data: momentumData,
        borderColor: isDark ? 'rgba(22, 153, 118, 1)' : 'rgba(22, 153, 118, 1)',
        backgroundColor: isDark ? 'rgba(22, 153, 118, 0.1)' : 'rgba(22, 153, 118, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? 'rgba(22, 153, 118, 0.3)' : 'rgba(22, 153, 118, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm text-gray-400">Momentum Scanner</h4>
        <div className="text-right">
          <p className="text-xs text-gray-400">Overall Signal</p>
          <p className="text-sm text-emerald font-medium">BULLISH</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {mockIndicators.map(indicator => (
          <div 
            key={indicator.name}
            className={`p-3 rounded-lg ${
              indicator.signal === 'bullish'
                ? 'bg-emerald/10 border border-emerald/30'
                : indicator.signal === 'bearish'
                  ? 'bg-red-500/10 border border-red-500/30'
                  : 'bg-gray-500/10 border border-gray-500/30'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400">{indicator.name}</span>
              <span className={`flex items-center gap-1 ${
                indicator.change >= 0 ? 'text-emerald' : 'text-red-500'
              }`}>
                {indicator.change >= 0 ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {Math.abs(indicator.change).toFixed(1)}%
              </span>
            </div>
            <p className={`text-lg font-semibold ${
              indicator.signal === 'bullish'
                ? 'text-emerald'
                : indicator.signal === 'bearish'
                  ? 'text-red-500'
                  : 'text-gray-400'
            }`}>
              {indicator.value.toFixed(1)}
            </p>
          </div>
        ))}
      </div>
      
      <div className="h-[150px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};