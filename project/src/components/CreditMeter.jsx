import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * CreditMeter Component - Radial progress indicator for remaining credits
 * 
 * Shows visual representation of remaining evaluation credits
 */
const CreditMeter = () => {
  const { user } = useAuth();

  if (!user || user.plan !== 'free') return null;

  const totalCredits = 15;
  const remainingCredits = user.credits;
  const usedCredits = totalCredits - remainingCredits;
  const percentage = (remainingCredits / totalCredits) * 100;
  
  // Calculate stroke-dasharray for circular progress
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColorClass = () => {
    if (remainingCredits > 10) return 'text-green-500 dark:text-green-400';
    if (remainingCredits > 5) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-8 h-8">
        {/* Background circle */}
        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            className="stroke-gray-300 dark:stroke-gray-700"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            className={`transition-all duration-500 ease-out ${getColorClass()}`}
            strokeWidth="3"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${getColorClass()}`}>
            {remainingCredits}
          </span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-500">
        <div>Credits</div>
        <div className="text-gray-400 dark:text-gray-600">left</div>
      </div>
    </div>
  );
};

export default CreditMeter;