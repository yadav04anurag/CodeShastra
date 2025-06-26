import React from 'react';
import { NavLink } from 'react-router';

const ContestProblem = ({ problem, onSelect }) => {
  // Determine difficulty color
  const getDifficultyColor = () => {
    switch (problem.difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Format problem title
  const formatTitle = (title) => {
    if (!title) return "Untitled Problem";
    if (title.length > 60) return title.substring(0, 57) + '...';
    return title;
  };

  return (
    <div 
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5 
                 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg cursor-pointer"
      onClick={() => onSelect && onSelect(problem)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-white truncate">
            {formatTitle(problem.title)}
          </h3>
          <div className="flex items-center mt-2 gap-2 flex-wrap">
            <span className={`${getDifficultyColor()} px-2 py-1 rounded-md text-xs font-medium border`}>
              {problem.difficulty || 'Unknown'}
            </span>
            {problem.tags && problem.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-md text-xs border border-cyan-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-end ml-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-400">Solved by 24%</span>
          </div>
          <button 
            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium mt-2"
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect(problem);
            }}
          >
            View Problem
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Time limit: 1s
          </span>
        </div>
        <div className="text-sm text-gray-400">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Memory limit: 256MB
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContestProblem;