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
  const { promptHistory } = useHistory();
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
      // Call our new 3-stage API
      const response = await fetch('/api/analyze-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}` // if using auth
        },
        body: JSON.stringify({
          prompt: prompt,
          user_id: user?.id,
          options: {
            include_refinement: true,
            target_models: ['gpt-4', 'claude-sonnet', 'gpt-3.5-turbo', 'llama-70b']
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const analysisData = await response.json();
      
      // Transform API response to match current frontend expectations
      const transformedAnalysis = {
        overall_score: analysisData.summary?.overall_score || 75,
        criteria_scores: analysisData.classification || {
          clarity: 75,
          specificity: 80,
          context: 70,
          structure: 85,
          actionability: 78,
          completeness: 82
        },
        feedback: {
          strengths: analysisData.analysis?.strengths || [
            "Clear and well-structured prompt",
            "Good use of specific examples"
          ],
          improvements: analysisData.analysis?.improvements || [
            "Consider adding more specific constraints",
            "Could benefit from clearer output format specification"
          ]
        },
        refined_versions: analysisData.refinements || [
          {
            version: "GPT-3.5 Optimized",
            prompt: prompt + " Please provide a detailed and well-structured response.",
            predicted_score: 88,
            improvements: "+15 points"
          },
          {
            version: "Universal Best Practice",
            prompt: prompt + " Please provide a comprehensive response with clear examples.",
            predicted_score: 92,
            improvements: "+12 points"
          }
        ],
        // New fields from our 3-stage pipeline
        model_predictions: analysisData.predictions || [],
        processing_metadata: analysisData.metadata || {},
        analysis_id: analysisData.analysis_id
      };

      setAnalysis(transformedAnalysis);
      toast.success('Analysis complete!');
    } catch (err) {
      console.error('❌ Analysis Error:', err);
      
      // Fallback to mock data for development
      console.log('🔄 Falling back to mock data for development');
      const mockAnalysis = {
        overall_score: Math.floor(Math.random() * 40) + 60,
        criteria_scores: {
          clarity: Math.floor(Math.random() * 40) + 60,
          specificity: Math.floor(Math.random() * 40) + 60,
          context: Math.floor(Math.random() * 40) + 60,
          structure: Math.floor(Math.random() * 40) + 60,
          actionability: Math.floor(Math.random() * 40) + 60,
          completeness: Math.floor(Math.random() * 40) + 60
        },
        feedback: {
          strengths: [
            "Clear and well-structured prompt",
            "Good use of specific examples",
            "Appropriate context provided"
          ],
          improvements: [
            "Consider adding more specific constraints",
            "Could benefit from clearer output format specification",
            "Add more context about the intended use case"
          ]
        },
        refined_versions: [
          {
            version: "GPT-3.5 Optimized",
            prompt: `**STRUCTURED REQUEST**

${prompt}

**Required Format:**
- Use clear headings and bullet points
- Provide specific examples where relevant
- Keep language accessible but comprehensive
- Target length: appropriate for the request complexity

**Quality Guidelines:**
- Ensure factual accuracy
- Maintain logical flow between points
- Include practical applications where applicable`,
            predicted_score: 88,
            improvements: "+15 points"
          },
          {
            version: "Universal Best Practice", 
            prompt: `${prompt}

Please provide a comprehensive response that:
• Addresses all aspects of the request systematically
• Uses clear, well-structured formatting with headings
• Includes specific, relevant examples to illustrate key points
• Maintains an appropriate tone for the intended audience
• Ensures factual accuracy and logical coherence throughout`,
            predicted_score: 92,
            improvements: "+12 points"
          },
          {
            version: "Llama Optimized",
            prompt: `Follow these steps to respond to this request:

1. **First**, read this carefully: ${prompt}

2. **Then**, structure your response with:
   - Clear introduction explaining what you'll cover
   - Main content organized with numbered or bulleted sections
   - Specific examples for each major point
   - Summary or conclusion

3. **Important rules**:
   - Use simple, direct language
   - Explain technical terms if needed
   - Keep paragraphs focused and concise
   - Double-check facts and logic

4. **Quality check**: Before finishing, ensure your response fully addresses the original request.`,
            predicted_score: 80,
            improvements: "+22 points"
          }
        ],
        // Mock model predictions based on our new pipeline
        model_predictions: [
          { model: 'GPT-4', score: 92, confidence: 0.95, status: 'excellent' },
          { model: 'Claude Sonnet', score: 87, confidence: 0.92, status: 'good' },
          { model: 'GPT-3.5 Turbo', score: 73, confidence: 0.88, status: 'decent' },
          { model: 'Llama 70B', score: 58, confidence: 0.82, status: 'poor' }
        ]
      };
      
      setAnalysis(mockAnalysis);
      toast.error('Using mock data - backend not connected yet');
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

        {/* Model Predictions Section (NEW) */}
        {analysis?.model_predictions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">🎯</span>Model Performance Predictions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysis.model_predictions.map((prediction, index) => (
                  <div key={index} className={`border-2 rounded-lg p-4 text-center ${
                    prediction.status === 'excellent' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                    prediction.status === 'good' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                    prediction.status === 'decent' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-red-500 bg-red-50 dark:bg-red-900/20'
                  }`}>
                    <div className={`text-2xl font-bold mb-1 ${
                      prediction.status === 'excellent' ? 'text-green-600 dark:text-green-400' :
                      prediction.status === 'good' ? 'text-blue-600 dark:text-blue-400' :
                      prediction.status === 'decent' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {prediction.score}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {prediction.model}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {prediction.confidence * 100}% confidence
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-500/30">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>💡 Recommendation:</strong> Based on these predictions, we suggest optimizing your prompt for better performance across different models.
                </p>
              </div>
            </div>
          </motion.div>
        )}

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
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center shadow-sm hover:border-blue-300 transition-colors duration-200">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Smart Model Predictions
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                AI predicts how your prompt will perform across 15+ different language models.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center shadow-sm hover:border-blue-300 transition-colors duration-200">
              <div className="text-3xl mb-3">🔧</div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Model-Specific Optimization
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get optimized prompt versions tailored for GPT-3.5, Llama, or universal compatibility.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center shadow-sm hover:border-blue-300 transition-colors duration-200">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                3-Stage Analysis
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Classification → Performance Prediction → Smart Refinement for comprehensive insights.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;