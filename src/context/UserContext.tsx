import React, { createContext, useContext, useState } from 'react';

interface UserState {
  balance: number;
  investedAmount: number;
  portfolioValue: number;
  joinDate: string;
  nextDistribution: string;
  monthlyReturn: number;
  allTimeReturn: number;
}

type UserContextType = {
  user: UserState;
  updatePortfolioValue: (newValue: number) => void;
  updateInvestedAmount: (amount: number) => void;
};

const initialUserState: UserState = {
  balance: 25000,
  investedAmount: 25000,
  portfolioValue: 32450,
  joinDate: 'Jan 10, 2024',
  nextDistribution: 'March 15, 2025',
  monthlyReturn: 18.7,
  allTimeReturn: 142.3,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState>(initialUserState);

  const updatePortfolioValue = (newValue: number) => {
    setUser(prev => ({
      ...prev,
      portfolioValue: newValue
    }));
  };

  const updateInvestedAmount = (amount: number) => {
    setUser(prev => ({
      ...prev,
      investedAmount: prev.investedAmount + amount,
      balance: prev.balance - amount
    }));
  };

  return (
    <UserContext.Provider value={{ user, updatePortfolioValue, updateInvestedAmount }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};