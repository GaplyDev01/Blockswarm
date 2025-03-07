import React from 'react';
import { MessageSquare, Share2, Heart, BarChart2 } from 'lucide-react';

interface SocialPost {
  id: string;
  type: 'tweet' | 'discord' | 'telegram';
  content: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  timestamp: string;
  metrics: {
    likes: number;
    comments: number;
    shares: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
}

const mockPosts: SocialPost[] = [
  {
    id: '1',
    type: 'tweet',
    content: 'Solana TVL just hit a new ATH! 🚀 The ecosystem is growing faster than ever. $SOL',
    author: {
      name: 'Crypto Analyst',
      handle: '@cryptoanalyst',
      avatar: 'https://avatars.githubusercontent.com/u/1?v=4'
    },
    timestamp: '1h ago',
    metrics: {
      likes: 1243,
      comments: 89,
      shares: 312
    },
    sentiment: 'positive'
  },
  {
    id: '2',
    type: 'discord',
    content: 'New protocol upgrade coming next week. Make sure to update your validators! 🔧',
    author: {
      name: 'Solana Core',
      handle: '@solana_core',
      avatar: 'https://avatars.githubusercontent.com/u/2?v=4'
    },
    timestamp: '2h ago',
    metrics: {
      likes: 567,
      comments: 45,
      shares: 123
    },
    sentiment: 'neutral'
  },
  {
    id: '3',
    type: 'telegram',
    content: 'BONK just announced a major partnership! Check the official channel for details 👀',
    author: {
      name: 'SOL News',
      handle: '@solana_news',
      avatar: 'https://avatars.githubusercontent.com/u/3?v=4'
    },
    timestamp: '3h ago',
    metrics: {
      likes: 892,
      comments: 156,
      shares: 278
    },
    sentiment: 'positive'
  }
];

export const SocialFeedTool: React.FC = () => {
  return (
    <div className="space-y-4 h-[300px] overflow-y-auto">
      {mockPosts.map(post => (
        <div 
          key={post.id}
          className="p-4 rounded-lg bg-black/20 border border-viridian/30 hover:border-viridian/50 transition-colors"
        >
          <div className="flex items-start gap-3 mb-3">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{post.author.name}</span>
                <span className="text-gray-400">{post.author.handle}</span>
              </div>
              <span className="text-sm text-gray-400">
                {post.timestamp}
              </span>
            </div>
            <div className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
              post.sentiment === 'positive' 
                ? 'bg-emerald/20 text-emerald' 
                : post.sentiment === 'negative'
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-gray-500/20 text-gray-400'
            }`}>
              {post.sentiment.toUpperCase()}
            </div>
          </div>

          <p className="text-white mb-4">{post.content}</p>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <button className="flex items-center gap-1 hover:text-viridian transition-colors">
              <Heart size={16} />
              <span>{post.metrics.likes}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-viridian transition-colors">
              <MessageSquare size={16} />
              <span>{post.metrics.comments}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-viridian transition-colors">
              <Share2 size={16} />
              <span>{post.metrics.shares}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-viridian transition-colors">
              <BarChart2 size={16} />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};