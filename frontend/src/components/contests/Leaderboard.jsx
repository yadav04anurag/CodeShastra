const Leaderboard = ({ leaderboard, problems }) => {
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
        <h3 className="text-xl font-medium text-gray-300">Leaderboard not available</h3>
        <p className="text-gray-500 mt-2">
          The contest may not be completed yet or no submissions have been made.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Participant
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Solved
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total Time
              </th>
              {problems.map(problem => (
                <th key={problem._id} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {problem.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800/50 divide-y divide-gray-700">
            {leaderboard.map((entry, index) => (
              <tr key={entry.user._id} className={index < 3 ? "bg-gradient-to-r from-amber-900/20 to-orange-900/20" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index === 0 && (
                      <span className="text-yellow-400 text-lg mr-2">🥇</span>
                    )}
                    {index === 1 && (
                      <span className="text-gray-300 text-lg mr-2">🥈</span>
                    )}
                    {index === 2 && (
                      <span className="text-amber-700 text-lg mr-2">🥉</span>
                    )}
                    <span className="text-white font-medium">{index + 1}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black mr-3">
                      {entry.user.firstName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{entry.user.firstName} {entry.user.lastName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white font-bold">
                  {entry.solved}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-cyan-400">
                  {entry.totalTime} min
                </td>
                {problems.map(problem => {
                  const problemData = entry.problems[problem._id];
                  return (
                    <td key={problem._id} className="px-6 py-4 whitespace-nowrap text-center">
                      {problemData ? (
                        <div>
                          <div className="text-green-400">{problemData.time} min</div>
                          <div className="text-xs text-gray-400">{problemData.attempts} {problemData.attempts === 1 ? 'try' : 'tries'}</div>
                        </div>
                      ) : (
                        <div className="text-gray-500">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;