import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * BillingTab Component - Subscription management with Stripe integration
 * 
 * Handles plan display and subscription upgrades
 */
const BillingTab = () => {
  const { user, subscribe } = useAuth();
  const [loading, setLoading] = useState(null);

  // Stripe integration placeholder - replace with actual Stripe implementation
  const createCheckoutSession = async (plan) => {
    setLoading(plan);
    
    try {
      // TODO: Replace with actual Stripe checkout session creation
      // const stripe = await loadStripe('pk_test_...');
      // const { error } = await stripe.redirectToCheckout({
      //   sessionId: sessionId
      // });
      
      // For demo purposes, simulate subscription
      await subscribe(plan);
      alert(`Successfully subscribed to ${plan}!`);
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const getPlanDisplay = () => {
    if (!user) return 'Not logged in';
    
    switch (user.plan) {
      case 'free':
        return `Free (${user.credits} evaluations remaining)`;
      case 'pro_monthly':
        return 'Pro Monthly ($9.99/mo)';
      case 'pro_yearly':
        return 'Pro Yearly ($99.99/yr)';
      default:
        return 'Unknown plan';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Current Plan */}
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600">
        <h3 className="text-white font-semibold text-lg mb-4">Current Plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-200 font-medium">{getPlanDisplay()}</p>
            <p className="text-gray-400 text-sm mt-1">
              {user?.plan === 'free' 
                ? 'Upgrade for unlimited evaluations and priority support'
                : 'Unlimited prompt evaluations with advanced features'
              }
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              user?.plan === 'free' 
                ? 'bg-gray-700 text-gray-300' 
                : 'bg-green-900/50 text-green-300 border border-green-500/30'
            }`}>
              {user?.plan === 'free' ? 'FREE' : 'PRO'}
            </span>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      {user?.plan === 'free' && (
        <div className="space-y-6">
          <h3 className="text-white font-semibold text-lg">Upgrade to Pro</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Monthly Plan */}
            <div className="bg-gray-800 border-2 border-blue-500/30 rounded-lg p-6 hover:border-blue-500/50 transition-colors duration-300">
              <div className="text-center">
                <h4 className="text-white font-semibold text-xl mb-2">Pro Monthly</h4>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-blue-400">$9.99</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="text-gray-300 text-sm space-y-2 mb-6">
                  <li>✓ Unlimited evaluations</li>
                  <li>✓ Advanced AI analysis</li>
                  <li>✓ Priority support</li>
                  <li>✓ Export results</li>
                </ul>
                <button
                  onClick={() => createCheckoutSession('pro_monthly')}
                  disabled={loading === 'pro_monthly'}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-md font-semibold hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {loading === 'pro_monthly' ? 'Processing...' : 'Subscribe Monthly'}
                </button>
              </div>
            </div>

            {/* Yearly Plan */}
            <div className="bg-gray-800 border-2 border-green-500/30 rounded-lg p-6 hover:border-green-500/50 transition-colors duration-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  SAVE 17%
                </span>
              </div>
              <div className="text-center">
                <h4 className="text-white font-semibold text-xl mb-2">Pro Yearly</h4>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-green-400">$99.99</span>
                  <span className="text-gray-400">/year</span>
                  <p className="text-gray-400 text-sm">($8.33/month)</p>
                </div>
                <ul className="text-gray-300 text-sm space-y-2 mb-6">
                  <li>✓ Unlimited evaluations</li>
                  <li>✓ Advanced AI analysis</li>
                  <li>✓ Priority support</li>
                  <li>✓ Export results</li>
                  <li>✓ 2 months free</li>
                </ul>
                <button
                  onClick={() => createCheckoutSession('pro_yearly')}
                  disabled={loading === 'pro_yearly'}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-white py-3 rounded-md font-semibold hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {loading === 'pro_yearly' ? 'Processing...' : 'Subscribe Yearly'}
                </button>
              </div>
            </div>
          </div>

          {/* Stripe Notice */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              <strong>Secure Payment:</strong> All payments are processed securely through Stripe. 
              You can cancel your subscription at any time.
            </p>
          </div>
        </div>
      )}

      {/* Pro Plan Management */}
      {user?.plan !== 'free' && (
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-600">
          <h3 className="text-white font-semibold text-lg mb-4">Subscription Management</h3>
          <p className="text-gray-300 mb-4">
            Your Pro subscription is active. You have unlimited prompt evaluations.
          </p>
          <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200">
            Cancel Subscription
          </button>
        </div>
      )}
    </div>
  );
};

export default BillingTab;