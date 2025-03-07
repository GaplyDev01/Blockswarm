import React from 'react';
import { Bar } from 'react-chartjs-2';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';
import { BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Register Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

export const PerformanceCard: React.FC = () => {
  const { isDark } = useTheme();
  
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [5.2, -2.1, 4.3, -1.5, 3.8, 6.2],
        backgroundColor: [
          isDark ? 'rgba(22, 153, 118, 0.8)' : 'rgba(22, 153, 118, 0.8)', // Viridian
          isDark ? 'rgba(255, 99, 132, 0.8)' : 'rgba(220, 38, 38, 0.8)',
          isDark ? 'rgba(22, 153, 118, 0.8)' : 'rgba(22, 153, 118, 0.8)', // Viridian
          isDark ? 'rgba(255, 99, 132, 0.8)' : 'rgba(220, 38, 38, 0.8)',
          isDark ? 'rgba(22, 153, 118, 0.8)' : 'rgba(22, 153, 118, 0.8)', // Viridian
          isDark ? 'rgba(80, 200, 120, 0.8)' : 'rgba(80, 200, 120, 0.8)', // Smaragdine
        ],
        borderColor: [
          isDark ? 'rgba(22, 153, 118, 1)' : 'rgba(22, 153, 118, 1)', // Viridian
          isDark ? 'rgba(255, 99, 132, 1)' : 'rgba(220, 38, 38, 1)',
          isDark ? 'rgba(22, 153, 118, 1)' : 'rgba(22, 153, 118, 1)', // Viridian
          isDark ? 'rgba(255, 99, 132, 1)' : 'rgba(220, 38, 38, 1)',
          isDark ? 'rgba(22, 153, 118, 1)' : 'rgba(22, 153, 118, 1)', // Viridian
          isDark ? 'rgba(80, 200, 120, 1)' : 'rgba(80, 200, 120, 1)', // Smaragdine
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          callback: function(value: number) {
            return value + '%';
          },
          font: {
            size: 9
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 9
          }
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.parsed.y + '%';
          },
        },
      },
      legend: {
        display: false
      }
    },
  };

  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="card-title">Hedge Fund Performance</h3>
        <span className="card-label">
          STATS
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div>
          <p className="stat-label">AUM</p>
          <p className="text-smaragdine font-semibold">$8.50M</p>
        </div>
        <div>
          <p className="stat-label">Investors</p>
          <p className="text-smaragdine font-semibold">248</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div>
          <p className="stat-label">Monthly</p>
          <p className="text-smaragdine font-semibold">+9.80%</p>
        </div>
        <div>
          <p className="stat-label">YTD</p>
          <p className="text-smaragdine font-semibold">+34.50%</p>
        </div>
        <div>
          <p className="stat-label">Since Inception</p>
          <p className="text-smaragdine font-semibold">+142.30%</p>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-light-text dark:text-dark-text font-medium mb-1 text-xs">Historical Performance</p>
        <div className="h-28">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      
      <button className="secondary-btn w-full flex items-center justify-center gap-1.5 text-xs">
        <BarChart2 size={13} />
        DETAILED ANALYTICS
      </button>
    </div>
  );
};