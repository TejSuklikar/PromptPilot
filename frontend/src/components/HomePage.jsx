import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import PromptCard from './PromptCard';
import PromptAnalysisResults from './PromptAnalysisResults';
import HistoryCarousel from './HistoryCarousel';

const HomePage = () => {
  const { user, useCredit } = useAuth();
  const { promptHistory, addToHistory } = useHistory(); 
  const [prompt, setPrompt] = React.useState('');
  const [analysis, setAnalysis] = React.useState(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleAnalyzeClick = async () => {
    if (user && user.plan === 'free' && !useCredit()) {
      toast.error('No credits remaining. Please upgrade to Pro for unlimited evaluations.');
      return;
    }

    setIsAnalyzing(true);
    const loadingToast = toast.loading('Analyzing prompt quality...');

    try {
      // Call the actual backend API
      const response = await fetch('http://localhost:8000/api/api/analyze-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const analysisData = await response.json();
      
      // The backend already returns the correct format, just use it directly
      setAnalysis(analysisData);
      addToHistory(prompt, analysisData); 
      toast.success('Analysis complete!');
      
    } catch (err) {
      console.error('❌ Analysis Error:', err);
      toast.error('Failed to analyze prompt. Please try again.');
    } finally {
      setIsAnalyzing(false);
      toast.dismiss(loadingToast);
      if (user && user.plan === 'free') {
        toast(`${user.credits} of 15 free evaluations left`, {
          icon: '📊',
          duration: 3000,
        });
      }
    }
  };

  const handlePromptChange = (newPrompt) => {
    setPrompt(newPrompt);
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

        {/* Prompt input + Analyze button */}
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

        {/* Render the analysis results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            <PromptAnalysisResults analysis={analysis} />
          </motion.div>
        )}

        {/* History Carousel */}
        {promptHistory.length > 0 && (
          <HistoryCarousel
            onSelectPrompt={handleHistorySelect}
            isLoading={false}
          />
        )}

        {/* User Status / Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-center mt-12"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-6 max-w-md w-full shadow-lg">
            {user ? (
              <div className="text-center">
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-3">
                  Account Status
                </h3>
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
                        <Link
                          to="/account"
                          className="text-yellow-600 dark:text-yellow-400 ml-1 underline"
                        >
                          Upgrade to Pro
                        </Link>
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-3">
                  Get Started
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Create an account to track your evaluations and get 15 free analyses.
                </p>
                <Link
                  to="/auth"
                  className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-md font-medium hover:shadow-lg transition-all duration-300"
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

        {/* Feature Highlights (only when no analysis is shown) */}
        {!analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center shadow-sm hover:border-blue-300">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Quality Scoring
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get detailed scores across 6 quality criteria with actionable insights.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center shadow-sm hover:border-blue-300">
              <div className="text-3xl mb-3">✨</div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Refined Versions
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Receive optimized versions of your prompts with better structure and clarity.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center shadow-sm hover:border-blue-300">
              <div className="text-3xl mb-3">🎭</div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Tone Variations
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Explore different tones and styles to match your use case.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;