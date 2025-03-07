import React, { useState } from 'react';
import { Clock, Plus, Minus } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export const InvestmentCard: React.FC = () => {
  const { user, updateInvestedAmount } = useUser();
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [amount, setAmount] = useState('1000');
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };
  
  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (!isNaN(depositAmount) && depositAmount > 0) {
      updateInvestedAmount(depositAmount);
      setShowDepositForm(false);
      setAmount('1000');
    }
  };
  
  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (!isNaN(withdrawAmount) && withdrawAmount > 0) {
      updateInvestedAmount(-withdrawAmount);
      setShowWithdrawForm(false);
      setAmount('1000');
    }
  };
  
  // Calculate return percentage
  const returnPercentage = ((user.portfolioValue - user.investedAmount) / user.investedAmount) * 100;
  
  return (
    <div className="dashboard-card flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="card-title">Investment Portfolio</h3>
        <span className="card-label">
          INVESTOR
        </span>
      </div>
      
      {!showDepositForm && !showWithdrawForm ? (
        <>
          <div className="space-y-3 mb-3">
            <div>
              <p className="stat-label">Invested</p>
              <p className="text-lg stat-value">${user.investedAmount.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="stat-label">Current Value</p>
              <div className="flex items-center gap-1.5">
                <span className="text-lg stat-value">${user.portfolioValue.toLocaleString()}</span>
                <span className={`${returnPercentage >= 0 ? 'text-lime dark:text-lime' : 'text-red-500 dark:text-red-400'} text-xs flex items-center`}>
                  {returnPercentage >= 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {returnPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-1.5 mb-3 flex-grow text-xs">
            <div className="flex justify-between">
              <span className="text-light-subtext dark:text-dark-subtext">Next Distribution:</span>
              <span className="text-light-text dark:text-dark-text">{user.nextDistribution}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-light-subtext dark:text-dark-subtext">Investing Since:</span>
              <span className="text-light-text dark:text-dark-text flex items-center">
                <Clock size={12} className="mr-1 text-light-subtext dark:text-dark-subtext" />
                {user.joinDate}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <button 
              className="secondary-btn flex items-center justify-center gap-1 text-xs py-1"
              onClick={() => setShowDepositForm(true)}
            >
              <Plus size={14} />
              DEPOSIT
            </button>
            <button 
              className="secondary-btn flex items-center justify-center gap-1 text-xs py-1"
              onClick={() => setShowWithdrawForm(true)}
            >
              <Minus size={14} />
              WITHDRAW
            </button>
          </div>
        </>
      ) : showDepositForm ? (
        <div className="flex-grow flex flex-col">
          <p className="text-light-subtext dark:text-dark-subtext mb-2 text-xs">Enter deposit amount:</p>
          
          <div className="relative mb-3">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-light-subtext dark:text-dark-subtext">$</div>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="w-full bg-light-bg/90 dark:bg-dark-bg/90 border border-light-border/20 dark:border-viridian/40 rounded-lg py-1.5 pl-7 pr-3 text-light-text dark:text-dark-text focus:outline-none focus:border-viridian/40 dark:focus:border-viridian/70 text-sm"
            />
          </div>
          
          <p className="text-xs text-light-subtext dark:text-dark-subtext mb-3">
            Current balance: <span className="text-light-text dark:text-dark-text">${user.balance.toLocaleString()}</span>
          </p>
          
          <div className="mt-auto grid grid-cols-2 gap-2">
            <button 
              className="secondary-btn text-xs py-1"
              onClick={() => setShowDepositForm(false)}
            >
              CANCEL
            </button>
            <button 
              className="primary-btn text-xs py-1"
              onClick={handleDeposit}
              disabled={parseFloat(amount) > user.balance}
            >
              CONFIRM
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col">
          <p className="text-light-subtext dark:text-dark-subtext mb-2 text-xs">Enter withdraw amount:</p>
          
          <div className="relative mb-3">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-light-subtext dark:text-dark-subtext">$</div>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="w-full bg-light-bg/90 dark:bg-dark-bg/90 border border-light-border/20 dark:border-viridian/40 rounded-lg py-1.5 pl-7 pr-3 text-light-text dark:text-dark-text focus:outline-none focus:border-viridian/40 dark:focus:border-viridian/70 text-sm"
            />
          </div>
          
          <p className="text-xs text-light-subtext dark:text-dark-subtext mb-3">
            Available to withdraw: <span className="text-light-text dark:text-dark-text">${user.portfolioValue.toLocaleString()}</span>
          </p>
          
          <div className="mt-auto grid grid-cols-2 gap-2">
            <button 
              className="secondary-btn text-xs py-1"
              onClick={() => setShowWithdrawForm(false)}
            >
              CANCEL
            </button>
            <button 
              className="primary-btn text-xs py-1"
              onClick={handleWithdraw}
              disabled={parseFloat(amount) > user.portfolioValue}
            >
              CONFIRM
            </button>
          </div>
        </div>
      )}
    </div>
  );
};