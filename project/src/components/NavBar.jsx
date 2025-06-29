import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import CreditMeter from './CreditMeter';
import MobileDrawer from './MobileDrawer';

/**
 * NavBar Component - Sticky navigation with blur effect and mobile drawer
 * 
 * Features responsive design, theme toggle, and credit meter
 */
const NavBar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Handle scroll effect for blur background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 dark:border-gray-600/50 shadow-lg' 
          : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="text-gray-900 dark:text-white font-bold text-xl tracking-wide hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200"
                style={{ textShadow: 'none' }}
              >
                <span className="dark:text-shadow-glow">PROMPTPILOT</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
                  isActive('/') 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800 shadow-md border border-blue-200 dark:border-gray-700' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Home
              </Link>
              
              {user && (
                <Link
                  to="/account"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
                    isActive('/account') 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800 shadow-md border border-blue-200 dark:border-gray-700' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  Account
                </Link>
              )}

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    {/* Credit Meter */}
                    <CreditMeter />
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {user.email}
                      </span>
                      <button
                        onClick={logout}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 rounded px-2 py-1"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                  >
                    Sign In
                  </Link>
                )}

                {/* Theme Toggle */}
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <MobileDrawer 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default NavBar;