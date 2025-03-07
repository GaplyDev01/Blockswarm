import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface SocialPost {
  content: string;
  time: string;
  likes: number;
  comments: number;
  shares: number;
}

const MOCK_POSTS: SocialPost[] = [
  {
    content: "Bullish movement predicted for SOL in next 24h based on on-chain data and social media",
    time: "2h ago",
    likes: 152,
    comments: 24,
    shares: 38
  },
  {
    content: "New trading signal for RAY with 73% confidence, check it on the dashboard",
    time: "3h ago",
    likes: 98,
    comments: 12,
    shares: 25
  }
];

export const SocialCard: React.FC = () => {
  return (
    <div className="dashboard-card flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="card-title">Social Presence</h3>
        <span className="px-1.5 py-0.5 bg-lime/20 text-lime text-[0.65rem] font-medium rounded-full flex items-center gap-1">
          <Heart size={10} className="fill-lime stroke-lime" />
          CONNECTED
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <p className="text-base font-semibold text-light-text dark:text-dark-text">12.5K</p>
          <p className="text-light-subtext dark:text-dark-subtext text-xs">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-light-text dark:text-dark-text">347</p>
          <p className="text-light-subtext dark:text-dark-subtext text-xs">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-light-text dark:text-dark-text">4.8%</p>
          <p className="text-light-subtext dark:text-dark-subtext text-xs">Engagement</p>
        </div>
      </div>
      
      <h4 className="text-light-text dark:text-dark-text font-medium mb-2 text-xs">Recent Updates</h4>
      
      <div className="space-y-2 flex-grow dashboard-card-content">
        {MOCK_POSTS.map((post, index) => (
          <div 
            key={index}
            className="p-2.5 rounded-lg bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20"
          >
            <p className="text-xs text-light-subtext dark:text-dark-subtext mb-2">{post.content}</p>
            <div className="flex justify-between items-center">
              <span className="text-light-subtext dark:text-dark-subtext text-[0.65rem]">{post.time}</span>
              <div className="flex items-center gap-2 text-[0.65rem] text-light-subtext dark:text-dark-subtext">
                <div className="flex items-center gap-0.5">
                  <Heart size={10} />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <MessageCircle size={10} />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Share2 size={10} />
                  <span>{post.shares}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};