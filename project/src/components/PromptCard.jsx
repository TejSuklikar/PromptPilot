import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHistory } from '../context/HistoryContext';
import PromptAnalysisResults from './PromptAnalysisResults';
import LoadingSkeleton, { ButtonSpinner } from './LoadingSkeleton';

/**
 * PromptCard Component - Enhanced with loading states and keyboard shortcuts
 * 
 * A modern card component for prompt evaluation with comprehensive analysis results.
 */
const PromptCard = ({ 
  prompt, 
  onPromptChange, 
  onScoreClick, 
  analysis,
  isAnalyzing = false
}) => {
  const { addToHistory } = useHistory();

  // Add keyboard shortcut for analysis
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (prompt && prompt.trim().length > 0 && !isAnalyzing) {
          onScoreClick();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [prompt, onScoreClick, isAnalyzing]);

  // Add to history when analysis completes
  useEffect(() => {
    if (analysis && prompt) {
      addToHistory(prompt, analysis);
    }
  }, [analysis, prompt, addToHistory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Main Card Container - Light/Dark theme with distinct styling */}
      <div className="bg-white dark:bg-gray-900 border-2 border-blue-500 dark:border-blue-400 rounded-lg shadow-2xl shadow-blue-500/20 dark:shadow-blue-900/50 p-8 space-y-8">
        
        {/* Card Header - Enhanced typography with better readability */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-wide">
            <span className="dark:text-shadow-glow">PROMPTPILOT</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium uppercase tracking-wider">
            AI-Powered Prompt Analysis System
          </p>
        </motion.div>

        {/* Prompt Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-4"
        >
          <label 
            htmlFor="prompt-input" 
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide"
          >
            Enter Prompt Sequence:
          </label>
          <div className="relative">
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Enter your prompt here for comprehensive analysis. Be as detailed as possible - include context, desired output format, and any specific requirements..."
              className="w-full min-h-32 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md 
                       text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-normal leading-relaxed
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
                       resize-vertical transition-all duration-300
                       hover:border-gray-400 dark:hover:border-gray-400
                       disabled:opacity-50 disabled:cursor-not-allowed"
              rows={4}
              disabled={isAnalyzing}
              aria-describedby="prompt-help"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-gray-50/80 dark:bg-gray-800/50 rounded-md flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  Analysis in progress...
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
            <span>{prompt.length} characters</span>
            <div className="flex items-center space-x-4">
              <span>{prompt.split(/\s+/).filter(word => word.length > 0).length} words</span>
              <span className="text-gray-400 dark:text-gray-600">
                Press Ctrl+Enter to analyze
              </span>
            </div>
          </div>
          <p id="prompt-help" className="text-xs text-gray-400 dark:text-gray-600">
            Tip: Include specific requirements, context, and desired output format for better analysis results.
          </p>
        </motion.div>

        {/* Score Button - Enhanced styling for light mode */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex justify-center"
        >
          <button
            onClick={onScoreClick}
            disabled={!prompt || prompt.trim().length === 0 || isAnalyzing}
            className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white 
                     font-semibold rounded-md tracking-wide uppercase text-sm
                     hover:shadow-lg hover:shadow-cyan-500/30 
                     focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
                     disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none
                     transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100
                     min-w-48 h-12"
            aria-describedby="analyze-help"
          >
            {isAnalyzing ? (
              <>
                <ButtonSpinner className="mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                {analysis ? 'Re-Analyze Prompt' : 'Analyze Prompt Quality'}
              </>
            )}
          </button>
        </motion.div>

        {/* Loading Skeleton or Analysis Results */}
        {isAnalyzing ? (
          <LoadingSkeleton type="analysis" />
        ) : (
          <PromptAnalysisResults analysis={analysis} />
        )}

        {/* Tech-style footer accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex justify-center pt-4"
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-400 dark:bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PromptCard;