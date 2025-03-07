import React, { useState, useEffect, useCallback } from 'react';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { ChevronDown, TrendingUp, TrendingDown, AlertCircle, Settings, Layout, Eye, EyeOff, X, Move } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { coinGeckoAPI } from '../../../services/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartCard {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  dataType: 'price' | 'volume' | 'marketCap' | 'sentiment';
  timeframe: '24H' | '7D' | '1M' | '3M';
  visible: boolean;
  w: number;
  h: number;
}

export const ChartsView: React.FC = () => {
  const { isDark } = useTheme();
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [chartCards, setChartCards] = useState<ChartCard[]>([
    {
      id: 'price-line',
      title: 'Price History',
      type: 'line',
      dataType: 'price',
      timeframe: '7D',
      visible: true,
      w: 2,
      h: 2
    },
    {
      id: 'volume-bar',
      title: 'Volume Analysis',
      type: 'bar',
      dataType: 'volume',
      timeframe: '24H',
      visible: true,
      w: 1,
      h: 2
    },
    {
      id: 'market-pie',
      title: 'Market Distribution',
      type: 'pie',
      dataType: 'marketCap',
      timeframe: '24H',
      visible: true,
      w: 1,
      h: 2
    },
    {
      id: 'sentiment-scatter',
      title: 'Social Sentiment',
      type: 'scatter',
      dataType: 'sentiment',
      timeframe: '7D',
      visible: true,
      w: 2,
      h: 2
    }
  ]);

  const generateChartData = (card: ChartCard) => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    switch (card.type) {
      case 'line':
        return {
          labels,
          datasets: [{
            label: 'Price',
            data: [65, 59, 80, 81, 56, 55],
            borderColor: isDark ? 'rgba(22, 153, 118, 1)' : 'rgba(22, 153, 118, 1)',
            backgroundColor: isDark ? 'rgba(22, 153, 118, 0.1)' : 'rgba(22, 153, 118, 0.1)',
            borderWidth: 2,
            pointRadius: 1,
            pointHoverRadius: 5,
            tension: 0.4,
            fill: true
          }]
        };
      
      case 'bar':
        return {
          labels,
          datasets: [{
            label: 'Volume',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: isDark ? 'rgba(22, 153, 118, 0.8)' : 'rgba(22, 153, 118, 0.8)',
            borderColor: isDark ? 'rgba(22, 153, 118, 1)' : 'rgba(22, 153, 118, 1)',
            borderWidth: 1
          }]
        };
      
      case 'pie':
        return {
          labels: ['SOL', 'RAY', 'BONK', 'JTO', 'PYTH'],
          datasets: [{
            data: [30, 20, 15, 25, 10],
            backgroundColor: [
              'rgba(22, 153, 118, 0.8)',
              'rgba(80, 200, 120, 0.8)',
              'rgba(161, 206, 63, 0.8)',
              'rgba(0, 150, 136, 0.8)',
              'rgba(0, 200, 83, 0.8)'
            ],
            borderColor: isDark ? 'rgba(12, 16, 22, 1)' : 'rgba(255, 255, 255, 1)',
            borderWidth: 2
          }]
        };
      
      case 'scatter':
        return {
          datasets: [{
            label: 'Sentiment vs Price',
            data: Array.from({ length: 50 }, () => ({
              x: Math.random() * 100,
              y: Math.random() * 100
            })),
            backgroundColor: isDark ? 'rgba(22, 153, 118, 0.8)' : 'rgba(22, 153, 118, 0.8)',
          }]
        };
      
      default:
        return {
          labels,
          datasets: [{
            label: 'Data',
            data: [65, 59, 80, 81, 56, 55],
            borderColor: isDark ? 'rgba(22, 153, 118, 1)' : 'rgba(22, 153, 118, 1)',
            backgroundColor: isDark ? 'rgba(22, 153, 118, 0.1)' : 'rgba(22, 153, 118, 0.1)',
          }]
        };
    }
  };

  const chartOptions = {
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
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        }
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        }
      }
    }
  };

  const toggleCardVisibility = (cardId: string) => {
    setChartCards(prev =>
      prev.map(card =>
        card.id === cardId ? { ...card, visible: !card.visible } : card
      )
    );
  };

  const renderChart = (card: ChartCard) => {
    const data = generateChartData(card);
    
    switch (card.type) {
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      case 'scatter':
        return <Scatter data={data} options={chartOptions} />;
      default:
        return <Line data={data} options={chartOptions} />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Chart Analysis</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              editMode
                ? 'bg-viridian text-white'
                : 'bg-viridian/20 text-viridian'
            }`}
          >
            {editMode ? 'Save Layout' : 'Edit Layout'}
          </button>
          <button 
            onClick={() => setShowCustomizeModal(true)}
            className="px-4 py-2 bg-viridian/20 text-viridian rounded-lg text-sm hover:bg-viridian/30 transition-colors flex items-center gap-2"
          >
            <Settings size={16} />
            Customize Charts
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-3 gap-6">
        {chartCards.filter(card => card.visible).map(card => (
          <div
            key={card.id}
            className={`col-span-${card.w} row-span-${card.h} dashboard-card group relative`}
          >
            {editMode && (
              <div className="absolute top-0 left-0 right-0 p-1 z-10 flex items-center justify-between bg-viridian/10 dark:bg-viridian/20 dark:border-t dark:border-l dark:border-r dark:border-viridian/70 rounded-t-xl drag-handle cursor-move">
                <div className="text-xs font-medium text-viridian dark:text-viridian px-2">
                  {card.title}
                </div>
                <button 
                  className="p-1 text-gray-500 hover:text-red-500 rounded"
                  onClick={() => toggleCardVisibility(card.id)}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className={`h-full ${editMode ? 'pt-8' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">{card.title}</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={card.timeframe}
                    onChange={(e) => {
                      setChartCards(prev =>
                        prev.map(c =>
                          c.id === card.id ? { ...c, timeframe: e.target.value as ChartCard['timeframe'] } : c
                        )
                      );
                    }}
                    className="bg-light-bg/90 dark:bg-dark-bg/90 border border-light-border/20 dark:border-viridian/40 rounded px-2 py-1 text-sm text-light-text dark:text-dark-text"
                  >
                    <option value="24H">24H</option>
                    <option value="7D">7D</option>
                    <option value="1M">1M</option>
                    <option value="3M">3M</option>
                  </select>
                </div>
              </div>
              <div className="h-[300px]">
                {renderChart(card)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customize Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0C1016] border border-viridian/30 rounded-xl p-6 w-[480px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Customize Charts</h3>
              <button 
                onClick={() => setShowCustomizeModal(false)}
                className="p-2 hover:bg-viridian/10 rounded-lg"
              >
                <X size={20} className="text-viridian" />
              </button>
            </div>

            <div className="space-y-4">
              {chartCards.map(card => (
                <div
                  key={card.id}
                  className="p-4 rounded-lg bg-black/30 border border-viridian/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-white">{card.title}</h4>
                    <button
                      onClick={() => toggleCardVisibility(card.id)}
                      className="p-2 rounded-lg bg-viridian/10 hover:bg-viridian/20 transition-colors"
                    >
                      {card.visible ? (
                        <Eye size={18} className="text-viridian" />
                      ) : (
                        <EyeOff size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Chart Type</label>
                      <select
                        value={card.type}
                        onChange={(e) => {
                          setChartCards(prev =>
                            prev.map(c =>
                              c.id === card.id ? { ...c, type: e.target.value as ChartCard['type'] } : c
                            )
                          );
                        }}
                        className="w-full bg-black/30 border border-viridian/40 rounded px-3 py-2 text-white"
                      >
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="pie">Pie Chart</option>
                        <option value="scatter">Scatter Plot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Data Type</label>
                      <select
                        value={card.dataType}
                        onChange={(e) => {
                          setChartCards(prev =>
                            prev.map(c =>
                              c.id === card.id ? { ...c, dataType: e.target.value as ChartCard['dataType'] } : c
                            )
                          );
                        }}
                        className="w-full bg-black/30 border border-viridian/40 rounded px-3 py-2 text-white"
                      >
                        <option value="price">Price</option>
                        <option value="volume">Volume</option>
                        <option value="marketCap">Market Cap</option>
                        <option value="sentiment">Sentiment</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};