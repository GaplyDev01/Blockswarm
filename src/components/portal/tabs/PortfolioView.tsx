import React from 'react';
import { useUser } from '../../../context/UserContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { InvestmentCard } from '../InvestmentCard';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, RefreshCw } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PortfolioToken {
  name: string;
  symbol: string;
  amount: number;
  price: number;
  value: number;
  allocation: number;
  change24h: number;
}

export const PortfolioView: React.FC = () => {
  const { user } = useUser();
  const { isDark } = useTheme();
  
  // Mock portfolio data
  const portfolioTokens: PortfolioToken[] = [
    {
      name: 'Solana',
      symbol: 'SOL',
      amount: 125.45,
      price: 122.37,
      value: 15351.31,
      allocation: 47.3,
      change24h: 2.5
    },
    {
      name: 'Raydium',
      symbol: 'RAY',
      amount: 982.5,
      price: 0.874,
      value: 858.7,
      allocation: 2.6,
      change24h: -1.2
    },
    {
      name: 'Bonk',
      symbol: 'BONK',
      amount: 54000000,
      price: 0.00002953,
      value: 1594.62,
      allocation: 4.9,
      change24h: 5.7
    },
    {
      name: 'Jito',
      symbol: 'JTO',
      amount: 423.7,
      price: 8.24,
      value: 3491.29,
      allocation: 10.8,
      change24h: -0.8
    },
    {
      name: 'Kamino',
      symbol: 'KMNO',
      amount: 2450.3,
      price: 4.52,
      value: 11075.36,
      allocation: 34.1,
      change24h: 1.3
    }
  ];
  
  // Calculate totals
  const totalValue = portfolioTokens.reduce((sum, token) => sum + token.value, 0);
  const totalChange24h = portfolioTokens.reduce((sum, token) => sum + (token.value * token.change24h / 100), 0);
  const percentChange24h = (totalChange24h / totalValue) * 100;
  
  // Portfolio history data for chart
  const portfolioHistory = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [21500, 24500, 23800, 25600, 28900, 32450],
        borderColor: isDark ? 'rgba(22, 153, 118, 1)' : 'rgba(22, 153, 118, 1)',
        backgroundColor: isDark ? 'rgba(22, 153, 118, 0.1)' : 'rgba(22, 153, 118, 0.1)',
        borderWidth: 2,
        pointRadius: 1,
        pointHoverRadius: 5,
        tension: 0.4,
        fill: true
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? 'rgba(22, 153, 118, 0.3)' : 'rgba(22, 153, 118, 0.3)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return '$' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          maxRotation: 0,
        }
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          padding: 10,
          callback: function(value: number) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - Portfolio overview */}
      <div className="lg:col-span-2 space-y-6">
        <div className="dashboard-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title">Social and Market Analysis AI Chat</h3>
            <div className="flex items-center gap-2">
              <span className="text-light-subtext dark:text-dark-subtext">Last updated</span>
              <span className="flex items-center text-light-text dark:text-dark-text">
                <Clock size={14} className="mr-1" />
                5m ago
              </span>
              <button className="theme-btn p-1">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="stat-label">Portfolio Value</p>
              <p className="text-2xl stat-value">${totalValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="stat-label">24h Change</p>
              <p className={`text-xl flex items-center ${percentChange24h >= 0 ? 'text-lime dark:text-lime' : 'text-red-500 dark:text-red-400'}`}>
                {percentChange24h >= 0 ? (
                  <ArrowUpRight size={20} className="mr-1" />
                ) : (
                  <ArrowDownRight size={20} className="mr-1" />
                )}
                ${Math.abs(totalChange24h).toFixed(2)} ({percentChange24h >= 0 ? '+' : ''}{percentChange24h.toFixed(2)}%)
              </p>
            </div>
            <div>
              <p className="stat-label">Total Tokens</p>
              <p className="text-xl stat-value">{portfolioTokens.length}</p>
            </div>
          </div>
          
          <div className="h-64 mb-6">
            <Line data={portfolioHistory} options={chartOptions} />
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3 className="card-title mb-6">Portfolio Allocation</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-light-border/10 dark:border-viridian/20">
                  <th className="py-2 text-left text-light-subtext dark:text-dark-subtext font-medium">Token</th>
                  <th className="py-2 text-right text-light-subtext dark:text-dark-subtext font-medium">Amount</th>
                  <th className="py-2 text-right text-light-subtext dark:text-dark-subtext font-medium">Price</th>
                  <th className="py-2 text-right text-light-subtext dark:text-dark-subtext font-medium">Value</th>
                  <th className="py-2 text-right text-light-subtext dark:text-dark-subtext font-medium">Allocation</th>
                  <th className="py-2 text-right text-light-subtext dark:text-dark-subtext font-medium">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {portfolioTokens.map((token, index) => (
                  <tr key={index} className="border-b border-light-border/10 dark:border-viridian/20 hover:bg-light-bg/50 dark:hover:bg-viridian/5">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-viridian/20 flex items-center justify-center text-xs font-bold text-viridian">
                          {token.symbol.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-light-text dark:text-dark-text">{token.symbol}</p>
                          <p className="text-xs text-light-subtext dark:text-dark-subtext">{token.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right text-light-text dark:text-dark-text">
                      {token.symbol === 'BONK' 
                        ? token.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })
                        : token.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 text-right text-light-text dark:text-dark-text">
                      ${token.price < 0.01 ? token.price.toFixed(8) : token.price.toFixed(2)}
                    </td>
                    <td className="py-4 text-right font-medium text-light-text dark:text-dark-text">
                      ${token.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 text-right text-light-text dark:text-dark-text">
                      {token.allocation.toFixed(1)}%
                    </td>
                    <td className={`py-4 text-right ${token.change24h >= 0 ? 'text-lime dark:text-lime' : 'text-red-500 dark:text-red-400'}`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Right column - Investment card and actions */}
      <div className="space-y-6">
        <InvestmentCard />
        
        <div className="dashboard-card">
          <h3 className="card-title mb-6">Quick Actions</h3>
          
          <div className="space-y-4">
            <button className="primary-btn w-full flex items-center justify-center gap-2">
              <Wallet size={18} />
              DEPOSIT FUNDS
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="secondary-btn flex items-center justify-center gap-1">
                BUY TOKENS
              </button>
              <button className="secondary-btn flex items-center justify-center gap-1">
                SELL TOKENS
              </button>
            </div>
            
            <div className="p-4 bg-viridian/10 dark:bg-viridian/20 rounded-lg border border-viridian/30">
              <p className="text-sm text-light-text dark:text-dark-text">
                Trading with TradesXBT AI gives you access to advanced market analysis and high-confidence signals to maximize your returns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};