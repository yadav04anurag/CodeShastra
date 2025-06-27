// src/components/contests/ContestProblems.jsx
import React from 'react';
import ContestProblem from './ContestProblem';
import { motion } from 'framer-motion';

const ContestProblems = ({ problems, onProblemSelect, contestStatus, isRegistered }) => {
  if (!problems || problems.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
        <h3 className="text-xl font-medium text-gray-300">No problems available</h3>
        <p className="text-gray-500 mt-2">
          This contest doesn't have any problems yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
        <div className="grid grid-cols-12 gap-4 text-gray-400 text-sm mb-2 px-4">
          <div className="col-span-1">Status</div>
          <div className="col-span-6">Problem</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-3">Solved By</div>
        </div>
        
        <div className="space-y-2">
          {problems.map((problem, index) => (
            <motion.div
              key={problem._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ContestProblem 
                problem={problem} 
                index={index}
                onSelect={() => {
                  if (contestStatus === 'ongoing' && isRegistered) {
                    onProblemSelect(problem);
                  }
                }}
                disabled={contestStatus !== 'ongoing' || !isRegistered}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {contestStatus === 'upcoming' && (
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-cyan-700/50 rounded-xl p-4 text-center">
          <p className="text-cyan-300">
            Problems will be available when the contest starts
          </p>
        </div>
      )}
    </div>
  );
};

export default ContestProblems;