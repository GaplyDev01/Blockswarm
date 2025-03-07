import React from 'react';
import { Home, BarChart2, Briefcase, User, Settings, AlertCircle, MessageSquare } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

interface NavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
        active 
          ? 'text-viridian dark:text-viridian border-b-2 border-viridian' 
          : 'text-light-text dark:text-dark-subtext hover:text-viridian dark:hover:text-viridian'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const NavBar: React.FC<NavBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-dark-border/20">
      <NavItem 
        icon={<Home size={16} />} 
        label="Dashboard" 
        active={activeTab === 'dashboard'} 
        onClick={() => onTabChange('dashboard')} 
      />
      <NavItem 
        icon={<BarChart2 size={16} />} 
        label="Charts" 
        active={activeTab === 'charts'} 
        onClick={() => onTabChange('charts')} 
      />
      <NavItem 
        icon={<Briefcase size={16} />} 
        label="Portfolio" 
        active={activeTab === 'portfolio'} 
        onClick={() => onTabChange('portfolio')} 
      />
      <NavItem 
        icon={<AlertCircle size={16} />} 
        label="Signals" 
        active={activeTab === 'signals'} 
        onClick={() => onTabChange('signals')} 
      />
      <NavItem 
        icon={<MessageSquare size={16} />} 
        label="AI Chat" 
        active={activeTab === 'chat'} 
        onClick={() => onTabChange('chat')} 
      />
      <NavItem 
        icon={<User size={16} />} 
        label="Profile" 
        active={activeTab === 'profile'} 
        onClick={() => onTabChange('profile')} 
      />
    </div>
  );
};