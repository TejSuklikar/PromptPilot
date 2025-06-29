import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import AccountPage from './components/AccountPage';
import AuthModal from './components/AuthModal';
import './index.css';

/**
 * Main App Component - PromptPilot Dashboard
 * 
 * Handles routing and provides authentication, theme, and history context
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HistoryProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
              <NavBar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/auth" element={<AuthModal />} />
              </Routes>
              
              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    border: '1px solid var(--toast-border)',
                    borderRadius: '8px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#ffffff',
                    },
                  },
                  loading: {
                    iconTheme: {
                      primary: '#3b82f6',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
              
              {/* CSS Variables for Toast Theming */}
              <style jsx global>{`
                :root {
                  --toast-bg: #ffffff;
                  --toast-color: #1f2937;
                  --toast-border: #e5e7eb;
                }
                
                .dark {
                  --toast-bg: #1f2937;
                  --toast-color: #f9fafb;
                  --toast-border: #374151;
                }
              `}</style>
            </div>
          </Router>
        </HistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;