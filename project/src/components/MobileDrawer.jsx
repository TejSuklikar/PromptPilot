import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MobileDrawer Component - Slide-in navigation for mobile devices
 * 
 * Responsive drawer with backdrop and smooth animations
 */
const MobileDrawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-600 z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <Link 
                  to="/" 
                  onClick={handleLinkClick}
                  className="text-gray-900 dark:text-white font-bold text-xl tracking-wide"
                >
                  <span className="dark:text-shadow-glow">PROMPTPILOT</span>
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-6 py-4">
                <div className="space-y-2">
                  <Link
                    to="/"
                    onClick={handleLinkClick}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive('/') 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700' 
                        : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                  
                  {user && (
                    <Link
                      to="/account"
                      onClick={handleLinkClick}
                      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive('/account') 
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700' 
                          : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Account
                    </Link>
                  )}
                </div>
              </nav>

              {/* User Section */}
              <div className="border-t border-gray-200 dark:border-gray-600 p-6">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-gray-200 text-sm font-medium truncate">
                          {user.email}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {user.plan === 'free' ? `${user.credits} credits left` : 'Pro Plan'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        handleLinkClick();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={handleLinkClick}
                    className="block w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium text-center hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;