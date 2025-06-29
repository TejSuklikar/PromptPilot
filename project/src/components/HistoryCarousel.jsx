import React, { useState } from 'react';
import { useHistory } from '../context/HistoryContext';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSkeleton from './LoadingSkeleton';

/**
 * HistoryCarousel Component - Horizontal scrollable prompt history
 * 
 * Shows last 5 prompts with scores and allows reloading
 */
const HistoryCarousel = ({ onSelectPrompt, isLoading }) => {
  const { promptHistory, clearHistory } = useHistory();
  const [hoveredItem, setHoveredItem] = useState(null);

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Recent Prompts</h3>
        </div>
        <LoadingSkeleton type="history" />
      </div>
    );
  }

  if (promptHistory.length === 0) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 border-green-400';
    if (score >= 60) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-900/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-900/20 border-yellow-500/30';
    return 'bg-red-900/20 border-red-500/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">Recent Prompts</h3>
        <button
          onClick={clearHistory}
          className="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
          aria-label="Clear history"
        >
          Clear All
        </button>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <AnimatePresence>
          {promptHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex-shrink-0 w-64"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                onClick={() => onSelectPrompt(item.fullPrompt, item.analysis)}
                className="w-full text-left bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg p-4 hover:border-blue-500/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 group"
              >
                {/* Score Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getScoreBg(item.score)}`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${getScoreColor(item.score).split(' ')[0].replace('text-', 'bg-')}`}></div>
                    {item.score}
                  </span>
                  <div className="text-gray-500 text-xs">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>

                {/* Prompt Preview */}
                <div className="space-y-2">
                  <p className="text-gray-200 text-sm line-clamp-3 group-hover:text-white transition-colors duration-200">
                    {item.prompt.length > 80 ? `${item.prompt.substring(0, 80)}...` : item.prompt}
                  </p>
                  
                  {/* Hover Tooltip */}
                  <AnimatePresence>
                    {hoveredItem === item.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute z-10 bg-gray-900 border border-gray-600 rounded-lg p-3 shadow-xl max-w-xs -mt-2"
                        style={{ 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          bottom: '100%',
                          marginBottom: '8px'
                        }}
                      >
                        <p className="text-gray-200 text-xs leading-relaxed">
                          {item.fullPrompt.length > 200 
                            ? `${item.fullPrompt.substring(0, 200)}...` 
                            : item.fullPrompt
                          }
                        </p>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-600"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Indicator */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700 dark:border-gray-600">
                  <span className="text-gray-400 text-xs">Click to reload</span>
                  <svg 
                    className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HistoryCarousel;