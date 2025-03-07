import React from 'react';
import { MessageSquare, Award, Shield } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export const ProfileCard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const handleChatWithAgent = () => {
    navigate('/portal?tab=chat');
  };
  
  return (
    <div className="dashboard-card flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-emerald rounded-full flex items-center justify-center text-xl font-bold text-white">
          T
        </div>
        <div>
          <h3 className="card-title">TradesXBT</h3>
          <p className="text-light-subtext dark:text-dark-subtext">AI Trading Specialist</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-light-text dark:text-dark-text">Specialization:</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#9945FF] rounded-full flex items-center justify-center text-[8px] font-bold text-white">
            S
          </div>
          <span className="text-light-subtext dark:text-dark-subtext">Solana Token Analysis</span>
        </div>
      </div>
      
      <div className="space-y-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Award size={16} className="text-viridian" />
            <span className="text-light-subtext dark:text-dark-subtext">Performance Metrics</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-light-subtext dark:text-dark-subtext">Monthly Return:</span>
            <span className="text-lime dark:text-lime flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +{user.monthlyReturn}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-light-subtext dark:text-dark-subtext">All-Time Return:</span>
            <span className="text-lime dark:text-lime flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +{user.allTimeReturn}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-viridian/10 dark:bg-viridian/20 rounded-lg p-3 mb-4 border border-viridian/30 dark:border-viridian/40">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-viridian" />
          <p className="text-light-text dark:text-dark-text font-medium">Agent Status</p>
        </div>
        <p className="text-sm text-light-subtext dark:text-dark-subtext">
          TradesXBT is continuously monitoring the Solana ecosystem to identify trading opportunities and market insights.
        </p>
      </div>
      
      <button 
        className="primary-btn w-full flex items-center justify-center gap-2 mt-auto"
        onClick={handleChatWithAgent}
      >
        <MessageSquare size={18} />
        CHAT WITH AGENT
      </button>
    </div>
  );
};