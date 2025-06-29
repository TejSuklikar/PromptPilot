import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

/**
 * AnalysisChart Component - Animated charts for prompt analysis visualization
 * 
 * Displays quality criteria in both radar and bar chart formats
 */
const AnalysisChart = ({ analysis, type = 'radar' }) => {
  if (!analysis) return null;

  // Transform criteria data for charts
  const chartData = Object.entries(analysis.criteria).map(([key, value]) => ({
    criteria: key.charAt(0).toUpperCase() + key.slice(1),
    score: value,
    fullMark: 100
  }));

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // green-500
    if (score >= 60) return '#f59e0b'; // yellow-500
    return '#ef4444'; // red-500
  };

  if (type === 'radar') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid 
              stroke="#374151" 
              className="dark:stroke-gray-600" 
            />
            <PolarAngleAxis 
              dataKey="criteria" 
              tick={{ 
                fill: '#9ca3af', 
                fontSize: 12,
                fontWeight: 500
              }}
              className="dark:fill-gray-400"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ 
                fill: '#6b7280', 
                fontSize: 10 
              }}
              className="dark:fill-gray-500"
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  if (type === 'bar') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#374151"
              className="dark:stroke-gray-600"
            />
            <XAxis 
              dataKey="criteria" 
              tick={{ 
                fill: '#9ca3af', 
                fontSize: 11,
                fontWeight: 500
              }}
              className="dark:fill-gray-400"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ 
                fill: '#6b7280', 
                fontSize: 11 
              }}
              className="dark:fill-gray-500"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f9fafb'
              }}
              labelStyle={{ color: '#d1d5db' }}
            />
            <Bar 
              dataKey="score" 
              fill={(entry) => getScoreColor(entry.score)}
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <motion.rect
                  key={`cell-${index}`}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  fill={getScoreColor(entry.score)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  return null;
};

export default AnalysisChart;