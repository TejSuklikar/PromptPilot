import React from 'react';

/**
 * LoadingSkeleton Component - Animated loading placeholders
 * 
 * Provides skeleton screens for different content types
 */
const LoadingSkeleton = ({ type = 'default', className = '' }) => {
  const baseClasses = 'animate-pulse bg-gray-300 dark:bg-gray-600 rounded';

  if (type === 'analysis') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Score Circle Skeleton */}
        <div className="text-center">
          <div className={`${baseClasses} w-24 h-24 rounded-full mx-auto mb-4`} />
          <div className={`${baseClasses} h-4 w-32 mx-auto mb-2`} />
          <div className={`${baseClasses} h-6 w-40 mx-auto`} />
        </div>

        {/* Tab Navigation Skeleton */}
        <div className="bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg overflow-hidden">
          <div className="border-b border-gray-700 dark:border-gray-600">
            <div className="flex">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 px-4 py-3">
                  <div className={`${baseClasses} h-5 w-20`} />
                </div>
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            <div className={`${baseClasses} h-6 w-48`} />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-900/50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-600 dark:border-gray-500">
                  <div className="flex justify-between items-center mb-2">
                    <div className={`${baseClasses} h-4 w-20`} />
                    <div className={`${baseClasses} h-4 w-8`} />
                  </div>
                  <div className={`${baseClasses} h-2 w-full`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className={`${baseClasses} h-6 w-32`} />
        <div className={`${baseClasses} h-64 w-full`} />
      </div>
    );
  }

  if (type === 'history') {
    return (
      <div className={`flex space-x-4 ${className}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-shrink-0 w-48">
            <div className={`${baseClasses} h-20 w-full mb-2`} />
            <div className={`${baseClasses} h-4 w-32 mb-1`} />
            <div className={`${baseClasses} h-3 w-16`} />
          </div>
        ))}
      </div>
    );
  }

  // Default skeleton
  return (
    <div className={`space-y-3 ${className}`}>
      <div className={`${baseClasses} h-4 w-full`} />
      <div className={`${baseClasses} h-4 w-5/6`} />
      <div className={`${baseClasses} h-4 w-4/6`} />
    </div>
  );
};

/**
 * ButtonSpinner Component - Loading spinner for buttons
 */
export const ButtonSpinner = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export default LoadingSkeleton;