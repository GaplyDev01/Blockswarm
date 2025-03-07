import React from 'react';
import { MessageSquare, Award, Shield } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export const ProfileCard: React.FC = () => {
  const { user } = useUser();
  
  return (
    <div className="dashboard-card flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-emerald rounded-full flex items-center justify-center text-lg font-bold text-white">
          T
        </div>
        <div>
          <h3 className="card-title">TradesXBT</h3>
          <p className="text-light-subtext dark:text-dark-subtext text-xs">AI Trading Specialist</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-3 text-xs">
        <span className="text-light-text dark:text-dark-text">Specialization:</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[#9945FF] rounded-full flex items-center justify-center text-[6px] font-bold text-white">
            S
          </div>
          <span className="text-light-subtext dark:text-dark-subtext">Solana Token Analysis</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Award size={14} className="text-viridian" />
            <span className="text-light-subtext dark:text-dark-subtext text-xs">Performance Metrics</span>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-light-subtext dark:text-dark-subtext text-xs">Monthly Return:</span>
            <span className="text-lime dark:text-lime flex items-center text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +{user.monthlyReturn}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-light-subtext dark:text-dark-subtext text-xs">All-Time Return:</span>
            <span className="text-lime dark:text-lime flex items-center text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +{user.allTimeReturn}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-viridian/10 dark:bg-viridian/20 rounded-lg p-2 mb-3 border border-viridian/30 dark:border-viridian/40 text-xs">
        <div className="flex items-center gap-1.5 mb-1">
          <Shield size={14} className="text-viridian" />
          <p className="text-light-text dark:text-dark-text font-medium">Agent Status</p>
        </div>
        <p className="text-light-subtext dark:text-dark-subtext">
          TradesXBT is continuously monitoring the Solana ecosystem to identify trading opportunities and market insights.
        </p>
      </div>
      
      <button className="primary-btn w-full flex items-center justify-center gap-1.5 mt-auto text-xs">
        <MessageSquare size={14} />
        CHAT WITH AGENT
      </button>
    </div>
  );
};