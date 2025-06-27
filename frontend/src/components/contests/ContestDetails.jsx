// src/components/contests/ContestDetails.jsx
import React from 'react';
import { format } from 'date-fns';

const ContestDetails = ({ contest, timeRemaining, status }) => {
  if (!contest) return null;

  const statusColors = {
    upcoming: 'bg-blue-500',
    ongoing: 'bg-green-500',
    completed: 'bg-gray-500',
  };

  const statusText = {
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    completed: 'Completed',
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/0 via-gray-900/10 to-gray-950/80"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`${statusColors[status]} text-white text-sm px-3 py-1 rounded-full`}>
                  {statusText[status]}
                </span>
                {timeRemaining && (
                  <span className="bg-amber-500/20 text-amber-400 text-sm px-3 py-1 rounded-full">
                    {timeRemaining}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {contest.title}
              </h1>
              
              <p className="text-gray-300 text-lg mb-6 max-w-3xl">
                {contest.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800/30 backdrop-blur-sm p-4 rounded-xl border border-gray-700">
                <div>
                  <p className="text-sm text-gray-400">Start Date</p>
                  <p className="text-white font-medium">
                    {format(new Date(contest.startDate), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">End Date</p>
                  <p className="text-white font-medium">
                    {format(new Date(contest.endDate), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-white font-medium">
                    {contest.duration} minutes
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 w-full md:w-auto">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black mr-3">
                  {contest.creator.firstName.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Contest Host</p>
                  <p className="text-white font-medium">
                    {contest.creator.firstName} {contest.creator.lastName}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Problems</p>
                  <p className="text-white text-xl font-bold">
                    {contest.problems.length}
                  </p>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Participants</p>
                  <p className="text-white text-xl font-bold">
                    {contest.participants.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestDetails;