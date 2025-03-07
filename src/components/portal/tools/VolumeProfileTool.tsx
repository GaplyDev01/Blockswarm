import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../../context/ThemeContext';

interface VolumeBar {
  price: number;
  volume: number;
  type: 'buy' | 'sell';
}

const generateMockVolumeProfile = (currentPrice: number, bars: number = 20): VolumeBar[] => {
  const profile: VolumeBar[] = [];
  const range = currentPrice * 0.1; // 10% range
  const step = range / bars;
  
  for (let i = 0; i < bars; i++) {
    const price = currentPrice - (range / 2) + (i * step);
    const volume = Math.random() * 1000 + 200;
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    profile.push({ price, volume, type });
  }
  
  return profile;
};

export const VolumeProfileTool: React.FC = () => {
  const { isDark } = useTheme();
  const currentPrice = 122.45;
  const volumeProfile = generateMockVolumeProfile(currentPrice);
  
  const chartData = {
    labels: volumeProfile.map(bar => bar.price.toFixed(2)),
    datasets: [
      {
        label: 'Buy Volume',
        data: volumeProfile.map(bar => bar.type === 'buy' ? bar.volume : 0),
        backgroundColor: isDark ? 'rgba(22, 153, 118, 0.8)' : 'rgba(22, 153, 118, 0.8)',
        borderColor: isDark ? 'rgba(22, 153, 118, 1)' : 'rgba(22, 153, 118, 1)',
        borderWidth: 1,
        barPercentage: 1,
        categoryPercentage: 1
      },
      {
        label: 'Sell Volume',
        data: volumeProfile.map(bar => bar.type === 'sell' ? bar.volume : 0),
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.8)',
        borderColor: isDark ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        barPercentage: 1,
        categoryPercentage: 1
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: isDark ? '#fff' : '#000'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? 'rgba(22, 153, 118, 0.3)' : 'rgba(22, 153, 118, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          callback: function(value: any) {
            return `$${value}`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm text-gray-400">Volume Profile</h4>
          <p className="text-xl font-semibold text-white">Price Distribution</p>
        </div>
        <div className="text-right">
          <h4 className="text-sm text-gray-400">POC</h4>
          <p className="text-xl font-semibold text-viridian">${currentPrice}</p>
        </div>
      </div>
      
      <div className="h-[300px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};