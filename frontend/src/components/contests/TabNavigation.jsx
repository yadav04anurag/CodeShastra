// src/components/contests/TabNavigation.jsx
import React from 'react';

const TabNavigation = ({ 
  activeTab, 
  setActiveTab, 
  showEditor, 
  contestStatus,
  isRegistered
}) => {
  const tabs = [
    { id: 'problems', label: 'Problems' },
    ...(showEditor ? [{ id: 'editor', label: 'Editor' }] : []),
    { id: 'leaderboard', label: 'Leaderboard', disabled: contestStatus !== 'completed' },
    { id: 'rules', label: 'Rules' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && setActiveTab(tab.id)}
          disabled={tab.disabled}
          className={`px-4 py-2 rounded-lg transition-all relative ${
            activeTab === tab.id 
              ? 'text-white bg-cyan-600/30 border-b-2 border-cyan-500' 
              : 'text-gray-400 hover:text-white'
          } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {tab.label}
          {tab.disabled && (
            <span className="absolute -top-1 -right-1 bg-gray-700 rounded-full w-2 h-2"></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;