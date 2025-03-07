import React from 'react';
import { ProfileCard } from '../ProfileCard';
import { useUser } from '../../../context/UserContext';
import { Settings, Shield, Award, Clock, Calendar, CreditCard } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user } = useUser();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile information column */}
      <div className="dashboard-card">
        <ProfileCard />
      </div>
      
      {/* Account statistics column */}
      <div className="dashboard-card">
        <h3 className="card-title mb-6">Account Information</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-light-text dark:text-dark-text mb-3 flex items-center gap-2">
              <Calendar size={18} className="text-viridian" />
              Account Timeline
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-light-subtext dark:text-dark-subtext">Account Created:</span>
                <span className="text-light-text dark:text-dark-text">{user.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-subtext dark:text-dark-subtext">Next Distribution:</span>
                <span className="text-light-text dark:text-dark-text">{user.nextDistribution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-subtext dark:text-dark-subtext">Total Distributions:</span>
                <span className="text-light-text dark:text-dark-text">3</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-light-border/10 dark:border-viridian/20">
            <h4 className="font-medium text-light-text dark:text-dark-text mb-3 flex items-center gap-2">
              <Award size={18} className="text-viridian" />
              Investment Performance
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-light-subtext dark:text-dark-subtext">Current Value:</span>
                <span className="text-light-text dark:text-dark-text">${user.portfolioValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-subtext dark:text-dark-subtext">Invested Amount:</span>
                <span className="text-light-text dark:text-dark-text">${user.investedAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-subtext dark:text-dark-subtext">Monthly Return:</span>
                <span className="text-lime dark:text-lime">+{user.monthlyReturn}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-subtext dark:text-dark-subtext">All-Time Return:</span>
                <span className="text-lime dark:text-lime">+{user.allTimeReturn}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings and security column */}
      <div className="space-y-6">
        <div className="dashboard-card">
          <h3 className="card-title mb-4 flex items-center gap-2">
            <Settings size={20} className="text-viridian" />
            Account Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20">
              <span className="text-light-text dark:text-dark-text">Email Notifications</span>
              <div className="relative inline-block w-10 h-6 rounded-full bg-viridian/30">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-viridian transition-all"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20">
              <span className="text-light-text dark:text-dark-text">Trading Signals</span>
              <div className="relative inline-block w-10 h-6 rounded-full bg-viridian/30">
                <div className="absolute left-5 top-1 w-4 h-4 rounded-full bg-viridian transition-all"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-light-bg/80 dark:bg-forest/60 border border-emerald/10 dark:border-emerald/20">
              <span className="text-light-text dark:text-dark-text">Distribution Alerts</span>
              <div className="relative inline-block w-10 h-6 rounded-full bg-viridian/30">
                <div className="absolute left-5 top-1 w-4 h-4 rounded-full bg-viridian transition-all"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3 className="card-title mb-4 flex items-center gap-2">
            <Shield size={20} className="text-viridian" />
            Security
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-light-text dark:text-dark-text">Two-Factor Authentication</span>
              <button className="text-sm bg-viridian/20 text-viridian px-3 py-1 rounded">
                Enable
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-light-text dark:text-dark-text">Password</span>
              <button className="text-sm bg-viridian/20 text-viridian px-3 py-1 rounded">
                Change
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-light-border/10 dark:border-viridian/20">
              <button className="secondary-btn w-full">
                Manage Payment Methods
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};