import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import PromptCard from './PromptCard';
import HistoryCarousel from './HistoryCarousel';
import { analyzePrompt } from '../utils/promptAnalyzer';

/**
 * HomePage Component - Main dashboard with enhanced PromptCard and user status
 * 
 * Shows the comprehensive prompt evaluation tool and user credit information
 */
const HomePage = () => {
  const { user, useCredit } = useAuth();
  const { promptHistory } = useHistory();
  const [prompt, setPrompt] = React.useState('');
  const [analysis, setAnalysis] = React.useState(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleAnalyzeClick = async () => {
    // Check if user has credits (if logged in)
    if (user && user.plan === 'free' && !useCredit()) {
      toast.error('No credits remaining. Please upgrade to Pro for unlimited evaluations.');
      return;
    }

    setIsAnalyzing(true);
    
    // Show analyzing toast
    const analyzingToast = toast.loading('Analyzing prompt quality...');
    
    // Simulate API processing time for better UX
    setTimeout(() => {
      const promptAnalysis = analyzePrompt(prompt);
      setAnalysis(promptAnalysis);
      setIsAnalyzing(false);
      
      // Dismiss loading toast and show success
      toast.dismiss(analyzingToast);
      toast.success('Analysis complete!');
      
      // Show credits remaining if user is on free plan
      if (user && user.plan === 'free') {
        toast(`${user.credits} of 15 free evaluations left`, {
          icon: '📊',
          duration: 3000,
        });
      }
    }, 1500);
  };

  const handlePromptChange = (newPrompt) => {
    setPrompt(newPrompt);
    // Reset analysis when prompt changes significantly
    if (analysis && Math.abs(newPrompt.length - prompt.length) > 10) {
      setAnalysis(null);
    }
  };

  const handleHistorySelect = (historicPrompt, historicAnalysis) => {
    setPrompt(historicPrompt);
    setAnalysis(historicAnalysis);
    toast.success('Prompt loaded from history');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Main PromptCard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <PromptCard
            prompt={prompt}
            onPromptChange={handlePromptChange}
            onScoreClick={handleAnalyzeClick}
            analysis={analysis}
            isAnalyzing={isAnalyzing}
          />
        </motion.div>

        {/* History Carousel */}
        {promptHistory.length > 0 && (
          <HistoryCarousel
            onSelectPrompt={handleHistorySelect}
            isLoading={false}
          />
        )}

        {/* User Status Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-center mt-12"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-6 max-w-md w-full shadow-lg">
            {user ? (
              // Logged in user status
              <div className="text-center">
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-3">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Plan:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium capitalize">
                      {user.plan === 'free' ? 'Free' : 'Pro'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Evaluations:</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {user.plan === 'free' ? `${user.credits} remaining` : 'Unlimited'}
                    </span>
                  </div>
                  {user.plan === 'free' && user.credits <= 5 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-500/30 rounded-md"
                    >
                      <p className="text-yellow-800 dark:text-yellow-200 text-xs text-center">
                        Running low on credits! 
                        <Link to="/account" className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 dark:hover:text-yellow-300 ml-1 underline">
                          Upgrade to Pro
                        </Link>
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              // Not logged in
              <div className="text-center">
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-3">Get Started</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Create an account to track your evaluations and get 15 free comprehensive analyses.
                </p>
                <Link
                  to="/auth"
                  className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-md font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                >
                  Create Account
                </Link>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-3">
                  No credit card required
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Feature Highlights */}
        {!analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors duration-300 shadow-sm">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Quality Scoring</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Get detailed scores across 6 quality criteria with actionable insights.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors duration-300 shadow-sm">
              <div className="text-3xl mb-3">✨</div>
              <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Refined Versions</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Receive optimized versions of your prompts with better structure and clarity.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors duration-300 shadow-sm">
              <div className="text-3xl mb-3">🎭</div>
              <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Tone Variations</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Explore different tones and styles to match your specific use case.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;