import React from 'react';
import { MessageSquare, Share2, Heart } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  likes: number;
  comments: number;
  shares: number;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Solana TVL reaches new all-time high as DeFi activity surges',
    source: 'CryptoNews',
    time: '2h ago',
    likes: 245,
    comments: 42,
    shares: 86
  },
  {
    id: '2',
    title: 'Major protocol upgrade scheduled for next week',
    source: 'SolanaDaily',
    time: '4h ago',
    likes: 189,
    comments: 31,
    shares: 54
  },
  {
    id: '3',
    title: 'New DEX launches with innovative AMM model',
    source: 'DeFiPulse',
    time: '6h ago',
    likes: 156,
    comments: 28,
    shares: 42
  }
];

export const NewsFeedTool: React.FC = () => {
  return (
    <div className="space-y-4 h-[400px] overflow-y-auto">
      {mockNews.map(item => (
        <div 
          key={item.id}
          className="p-4 rounded-lg bg-black/20 border border-viridian/30 hover:border-viridian/50 transition-colors"
        >
          <h4 className="font-medium text-white mb-2">{item.title}</h4>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <span>{item.source}</span>
              <span>•</span>
              <span>{item.time}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <button className="flex items-center gap-1 hover:text-viridian">
                <Heart size={14} />
                <span>{item.likes}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-viridian">
                <MessageSquare size={14} />
                <span>{item.comments}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-viridian">
                <Share2 size={14} />
                <span>{item.shares}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};