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
  const [selectedRefinedVersion, setSelectedRefinedVersion] = useState(0);
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
    { id: 'suggestions', label: 'Feedback', icon: '💡' },
    { id: 'refined', label: 'Refined Versions', icon: '✨' }
  ];

  const status = getScoreStatus(analysis.overall_score);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
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
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-900 dark:bg-gray-800 border-2 shadow-lg ${getScoreColor(analysis.overall_score)}`}>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`font-bold text-2xl ${getScoreColor(analysis.overall_score).split(' ')[0]}`}
          >
            {analysis.overall_score}
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
            <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
              status.color.includes('green')
                ? 'bg-green-400'
                : status.color.includes('yellow')
                  ? 'bg-yellow-400'
                  : 'bg-red-400'
            }`}></div>
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
                  {Object.entries(analysis?.criteria_scores || {}).map(([key, score], idx) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="bg-gray-900/50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-600 dark:border-gray-500"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-200 dark:text-gray-300 text-sm font-medium capitalize">{key}</span>
                        <span className={`text-sm font-bold ${getScoreColor(score).split(' ')[0]}`}>
                          {score}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 dark:bg-gray-600 rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className={`h-2 rounded-full ${
                            score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'suggestions' && (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Strengths */}
                {analysis.feedback?.strengths && analysis.feedback.strengths.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-green-900/20 border border-green-500/30 rounded-lg p-4"
                  >
                    <h4 className="text-green-400 font-semibold mb-3 flex items-center">
                      <span className="mr-2">✅</span>Strengths
                    </h4>
                    <ul className="space-y-2">
                      {analysis.feedback.strengths.map((strength, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.1 }}
                          className="text-green-200 text-sm"
                        >
                          • {strength}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Improvements */}
                {analysis.feedback?.improvements && analysis.feedback.improvements.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4"
                  >
                    <h4 className="text-orange-400 font-semibold mb-3 flex items-center">
                      <span className="mr-2">🎯</span>Areas to Improve
                    </h4>
                    <ul className="space-y-2">
                      {analysis.feedback.improvements.map((improvement, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.1 }}
                          className="text-orange-200 text-sm"
                        >
                          • {improvement}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Refined Versions Tab */}
            {activeTab === 'refined' && (
              <motion.div
                key="refined"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h4 className="text-white dark:text-gray-100 font-semibold mb-4">
                  Enhanced Prompt Versions
                </h4>
                
                {/* Version Selector */}
                {analysis.refined_versions && analysis.refined_versions.length > 0 && (
                  <>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {analysis.refined_versions.map((version, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedRefinedVersion(index)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            selectedRefinedVersion === index
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 dark:bg-gray-600 text-gray-300 hover:bg-gray-600 dark:hover:bg-gray-500'
                          }`}
                        >
                          {version.version}
                        </button>
                      ))}
                    </div>

                    {/* Selected Version */}
                    <motion.div
                      key={selectedRefinedVersion}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-900/50 dark:bg-gray-800/50 rounded-lg p-6 border border-cyan-500/30"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-cyan-400 font-medium">
                          {analysis.refined_versions[selectedRefinedVersion].version} Version
                        </h5>
                        <button
                          onClick={() => copyToClipboard(analysis.refined_versions[selectedRefinedVersion].prompt)}
                          className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="text-gray-200 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-normal bg-gray-800 dark:bg-gray-700 rounded-md p-4 border border-gray-600 dark:border-gray-500">
                        {analysis.refined_versions[selectedRefinedVersion].prompt}
                      </pre>
                    </motion.div>
                  </>
                )}

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4"> 
                  <p className="text-blue-200 text-sm">
                    <strong>💡 Tip:</strong> These refined versions are tailored for different use cases. Choose the one that best matches your intended purpose.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default PromptAnalysisResults;