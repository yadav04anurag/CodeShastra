// src/components/contests/ContestProblem.jsx
import React from 'react';

const ContestProblem = ({ problem, index, onSelect, disabled }) => {
  const getDifficultyColor = () => {
    switch (problem.difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div 
      onClick={!disabled ? onSelect : undefined}
      className={`grid grid-cols-12 gap-4 items-center bg-gray-900/50 hover:bg-gray-800/50 p-4 rounded-lg border border-gray-700 transition-all ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-cyan-500/50'
      }`}
    >
      <div className="col-span-1 flex justify-center">
        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
          {index + 1}
        </div>
      </div>
      
      <div className="col-span-6">
        <h3 className="font-medium text-white">{problem.title}</h3>
      </div>
      
      <div className="col-span-2">
        <span className={`${getDifficultyColor()} px-2 py-1 rounded-md text-xs font-medium border`}>
          {problem.difficulty}
        </span>
      </div>
      
      <div className="col-span-3">
        <div className="flex items-center">
          <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: '24%' }}
            ></div>
          </div>
          <span className="text-xs text-gray-400">24%</span>
        </div>
      </div>
    </div>
  );
};

export default ContestProblem;