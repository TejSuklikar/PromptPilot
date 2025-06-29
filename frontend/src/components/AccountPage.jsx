import React, { useState } from 'react';
import BillingTab from './BillingTab';
import PreferencesTab from './PreferencesTab';

/**
 * AccountPage Component - Account management with tabs
 * 
 * Contains billing and preferences sections
 */
const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('billing');

  const tabs = [
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            <span className="dark:text-shadow-glow">ACCOUNT MANAGEMENT</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your subscription and account preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700 border-b-2 border-blue-500 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-750'
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
            {activeTab === 'billing' && <BillingTab />}
            {activeTab === 'preferences' && <PreferencesTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;