import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../../context/ThemeContext';

interface LiquidityLevel {
  price: number;
  liquidity: number;
  type: 'add' | 'remove';
}

const generateMockLiquidity = (currentPrice: number, points: number = 50): LiquidityLevel[] => {
  const levels: LiquidityLevel[] = [];
  const range = currentPrice * 0.1;
  
  for (let i = 0; i < points; i++) {
    const price = currentPrice - (range / 2) + ((range / points) * i);
    const liquidity = Math.random() * 1000000 + 500000;
    const type = Math.random() > 0.5 ? 'add' : 'remove';
    levels.push({ price, liquidity, type });
  }
  
  return levels;
};

export const LiquidityTool: React.FC = () => {
  const { isDark } = useTheme();
  const currentPrice = 122.45;
  const liquidityLevels = generateMockLiquidity(currentPrice);
  
  const chartData = {
    labels: liquidityLevels.map(level => level.price.toFixed(2)),
    datasets: [
      {
        label: 'Added Liquidity',
        data: liquidityLevels
          .filter(level => level.type === 'add')
          .map(level => level.liquidity),
        borderColor: isDark ? 'rgba(22, 153, 118, 1)' : 'rgba(22, 153, 118, 1)',
        backgroundColor: isDark ? 'rgba(22, 153, 118, 0.1)' : 'rgba(22, 153, 118, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Removed Liquidity',
        data: liquidityLevels
          .filter(level => level.type === 'remove')
          .map(level => level.liquidity),
        borderColor: isDark ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 1)',
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: isDark ? '#fff' : '#000'
        }
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? 'rgba(22, 153, 118, 0.3)' : 'rgba(22, 153, 118, 0.3)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `$${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          maxRotation: 0,
          callback: function(value: any) {
            return `$${value}`;
          }
        }
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          callback: function(value: any) {
            return `$${(value / 1000000).toFixed(1)}M`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm text-gray-400">Liquidity Analysis</h4>
          <p className="text-xl font-semibold text-white">Pool Depth</p>
        </div>
        <div className="text-right">
          <h4 className="text-sm text-gray-400">Total Liquidity</h4>
          <p className="text-xl font-semibold text-viridian">$24.5M</p>
        </div>
      </div>
      
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};