import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('promptpilot_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('promptpilot_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('promptpilot_user');
    }
  }, [user]);

  const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = {
          id: Date.now(),
          email,
          credits: 15,
          plan: 'free',
          createdAt: new Date().toISOString()
        };
        setUser(userData);
        resolve(userData);
      }, 1000);
    });
  };

  const signup = async (email, password) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = {
          id: Date.now(),
          email,
          credits: 15,
          plan: 'free',
          createdAt: new Date().toISOString()
        };
        setUser(userData);
        resolve(userData);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const useCredit = () => {
    if (user && user.credits > 0) {
      setUser(prev => ({
        ...prev,
        credits: prev.credits - 1
      }));
      return true;
    }
    return false;
  };

  const subscribe = async (plan) => {
    // Simulate Stripe checkout - in real app this would redirect to Stripe
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(prev => ({
          ...prev,
          plan: plan,
          credits: plan === 'pro_monthly' || plan === 'pro_yearly' ? 999 : prev.credits
        }));
        resolve();
      }, 2000);
    });
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    useCredit,
    subscribe
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};