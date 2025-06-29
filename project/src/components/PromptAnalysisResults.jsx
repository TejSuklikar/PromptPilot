import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalysisChart from './AnalysisChart';

/**
 * PromptAnalysisResults Component - Comprehensive prompt evaluation display
 * 
 * Shows detailed analysis including score, suggestions, refined prompt, and tone variations
 */
const PromptAnalysisResults = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [chartType, setChartType] = useState('radar');

  if (!analysis) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 border-green-400';
    if (score >= 60) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  const getScoreStatus = (score) => {
    if (score >= 80) return { label: 'EXCELLENT', color: 'bg-green-900/50 text-green-200 border-green-500/30' };
    if (score >= 60) return { label: 'GOOD', color: 'bg-yellow-900/50 text-yellow-200 border-yellow-500/30' };
    return { label: 'NEEDS IMPROVEMENT', color: 'bg-red-900/50 text-red-200 border-red-500/30' };
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'suggestions', label: 'Suggestions', icon: '💡' },
    { id: 'refined', label: 'Refined Version', icon: '✨' },
    { id: 'variations', label: 'Tone Variations', icon: '🎭' }
  ];

  const status = getScoreStatus(analysis.score);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-t border-gray-700 dark:border-gray-600 pt-8 space-y-6"
    >
      
      {/* Score Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
        className="text-center"
      >
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-900 dark:bg-gray-800 border-2 shadow-lg ${getScoreColor(analysis.score)}`}>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`font-bold text-2xl ${getScoreColor(analysis.score).split(' ')[0]}`}
          >
            {analysis.score}
          </motion.span>
        </div>
        <p className="mt-3 text-xs text-gray-300 dark:text-gray-400 font-medium uppercase tracking-widest">
          Prompt Quality Score
        </p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-2"
        >
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
            <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${status.color.includes('green') ? 'bg-green-400' : status.color.includes('yellow') ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
            {status.label}
          </span>
        </motion.div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg overflow-hidden">
        <div className="border-b border-gray-700 dark:border-gray-600">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                  activeTab === tab.id
                    ? 'text-blue-400 bg-gray-700 dark:bg-gray-800 border-b-2 border-blue-400'
                    : 'text-gray-300 dark:text-gray-400 hover:text-white hover:bg-gray-750 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                
                {/* Chart Type Toggle */}
                <div className="flex items-center justify-between">
                  <h4 className="text-white dark:text-gray-100 font-semibold">Quality Breakdown</h4>
                  <div className="flex bg-gray-700 dark:bg-gray-600 rounded-lg p-1">
                    <button
                      onClick={() => setChartType('radar')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                        chartType === 'radar'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Radar
                    </button>
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                        chartType === 'bar'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Bar
                    </button>
                  </div>
                </div>

                {/* Analysis Chart */}
                <div className="bg-gray-900/50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-600 dark:border-gray-500">
                  <AnalysisChart analysis={analysis} type={chartType} />
                </div>

                {/* Criteria Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(analysis.criteria).map(([key, score], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gray-900/50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-600 dark:border-gray-500"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-200 dark:text-gray-300 text-sm font-medium capitalize">{key}</span>
                        <span className={`text-sm font-bold ${getScoreColor(score).split(' ')[0]}`}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 dark:bg-gray-600 rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className={`h-2 rounded-full ${
                            score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Strengths and Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                  {analysis.strengths.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="bg-green-900/20 border border-green-500/30 rounded-lg p-4"
                    >
                      <h4 className="text-green-400 font-semibold mb-3 flex items-center">
                        <span className="mr-2">✅</span>
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="text-green-200 text-sm"
                          >
                            • {strength}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                  
                  {analysis.improvements.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4"
                    >
                      <h4 className="text-orange-400 font-semibold mb-3 flex items-center">
                        <span className="mr-2">🎯</span>
                        Areas to Improve
                      </h4>
                      <ul className="space-y-2">
                        {analysis.improvements.map((improvement, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="text-orange-200 text-sm"
                          >
                            • {improvement.area} ({improvement.score}%)
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h4 className="text-white dark:text-gray-100 font-semibold mb-4">Improvement Recommendations</h4>
                {analysis.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-900/50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-600 dark:border-gray-500"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        suggestion.priority === 'high' ? 'bg-red-400' : 
                        suggestion.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-blue-400 font-medium">{suggestion.category}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            suggestion.priority === 'high' ? 'bg-red-900/50 text-red-200' :
                            suggestion.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-200' :
                            'bg-blue-900/50 text-blue-200'
                          }`}>
                            {suggestion.priority} priority
                          </span>
                        </div>
                        <p className="text-gray-200 dark:text-gray-300 text-sm leading-relaxed">{suggestion.suggestion}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Refined Version Tab */}
            {activeTab === 'refined' && (
              <motion.div
                key="refined"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h4 className="text-white dark:text-gray-100 font-semibold mb-4">Enhanced Prompt Version</h4>
                <div className="bg-gray-900/50 dark:bg-gray-800/50 rounded-lg p-6 border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-cyan-400 font-medium">Optimized Prompt</h5>
                    <button 
                      onClick={() => copyToClipboard(analysis.refinedPrompt)}
                      className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-800 dark:bg-gray-700 rounded-md p-4 border border-gray-600 dark:border-gray-500">
                    <pre className="text-gray-200 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-normal">
                      {analysis.refinedPrompt}
                    </pre>
                  </div>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">
                    <strong>💡 Tip:</strong> This refined version includes better structure, context, and formatting specifications to improve AI response quality.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Tone Variations Tab */}
            {activeTab === 'variations' && (
              <motion.div
                key="variations"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-white dark:text-gray-100 font-semibold mb-4">Tone-Based Variations</h4>
                  <p className="text-gray-300 dark:text-gray-400 text-sm mb-6">
                    Different tones can significantly impact the AI's response style and content. Choose the tone that best fits your needs.
                  </p>
                </div>

                {/* Tone Selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.entries(analysis.toneVariations).map(([key, variation]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTone(key)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        selectedTone === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 dark:bg-gray-600 text-gray-300 hover:bg-gray-600 dark:hover:bg-gray-500'
                      }`}
                    >
                      {variation.name}
                    </button>
                  ))}
                </div>

                {/* Selected Tone Variation */}
                {analysis.toneVariations[selectedTone] && (
                  <motion.div
                    key={selectedTone}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-900/50 dark:bg-gray-800/50 rounded-lg p-6 border border-purple-500/30"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h5 className="text-purple-400 font-medium">
                          {analysis.toneVariations[selectedTone].name} Tone
                        </h5>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                          {analysis.toneVariations[selectedTone].description}
                        </p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(analysis.toneVariations[selectedTone].prompt)}
                        className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="bg-gray-800 dark:bg-gray-700 rounded-md p-4 border border-gray-600 dark:border-gray-500">
                      <pre className="text-gray-200 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-normal">
                        {analysis.toneVariations[selectedTone].prompt}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PromptAnalysisResults;