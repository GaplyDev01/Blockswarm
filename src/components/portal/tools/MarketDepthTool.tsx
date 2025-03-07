import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../../context/ThemeContext';

interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
  side: 'bid' | 'ask';
}

const generateMockOrderBook = (currentPrice: number, levels: number = 10): OrderBookLevel[] => {
  const orderBook: OrderBookLevel[] = [];
  const spreadPercentage = 0.002; // 0.2% spread
  const spread = currentPrice * spreadPercentage;
  const midPrice = currentPrice;
  const bidStart = midPrice - spread / 2;
  const askStart = midPrice + spread / 2;
  
  // Generate bids
  for (let i = 0; i < levels; i++) {
    const price = bidStart - (i * currentPrice * 0.001);
    const size = Math.random() * 1000 + 500;
    const total = i === 0 ? size : orderBook[i - 1].total + size;
    orderBook.push({ price, size, total, side: 'bid' });
  }
  
  // Generate asks
  for (let i = 0; i < levels; i++) {
    const price = askStart + (i * currentPrice * 0.001);
    const size = Math.random() * 1000 + 500;
    const total = i === 0 ? size : orderBook[levels + i - 1].total + size;
    orderBook.push({ price, size, total, side: 'ask' });
  }
  
  return orderBook;
};

export const MarketDepthTool: React.FC = () => {
  const { isDark } = useTheme();
  const currentPrice = 122.45; // Mock current price
  const orderBook = generateMockOrderBook(currentPrice);
  
  const chartData = {
    labels: orderBook.map(level => level.price.toFixed(2)),
    datasets: [
      {
        label: 'Bids',
        data: orderBook.filter(level => level.side === 'bid').map(level => level.total),
        backgroundColor: isDark ? 'rgba(22, 153, 118, 0.3)' : 'rgba(22, 153, 118, 0.3)',
        borderColor: isDark ? 'rgba(22, 153, 118, 1)' : 'rgba(22, 153, 118, 1)',
        borderWidth: 1,
        fill: true
      },
      {
        label: 'Asks',
        data: orderBook.filter(level => level.side === 'ask').map(level => level.total),
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.3)',
        borderColor: isDark ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        fill: true
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
            return `Volume: ${context.raw.toFixed(2)}`;
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
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm text-gray-400">Current Price</h4>
          <p className="text-xl font-semibold text-white">${currentPrice}</p>
        </div>
        <div className="text-right">
          <h4 className="text-sm text-gray-400">Spread</h4>
          <p className="text-xl font-semibold text-viridian">0.20%</p>
        </div>
      </div>
      
      <div className="h-[200px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};