import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

export const HistoryProvider = ({ children }) => {
  const [promptHistory, setPromptHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('promptpilot_history');
    if (savedHistory) {
      setPromptHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('promptpilot_history', JSON.stringify(promptHistory));
  }, [promptHistory]);

  const addToHistory = (prompt, analysis) => {
    const historyItem = {
      id: Date.now(),
      prompt: prompt.substring(0, 100), // Store first 100 chars
      fullPrompt: prompt,
      score: analysis.score,
      timestamp: new Date().toISOString(),
      analysis
    };

    setPromptHistory(prev => {
      const newHistory = [historyItem, ...prev.filter(item => item.fullPrompt !== prompt)];
      return newHistory.slice(0, 5); // Keep only last 5
    });
  };

  const clearHistory = () => {
    setPromptHistory([]);
  };

  const value = {
    promptHistory,
    addToHistory,
    clearHistory
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};