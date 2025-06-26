import { useState, useEffect } from 'react';
import ContestCard from './ContestCard';
import { getContests } from '../../services/contestService';

const ContestList = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getContests();
        setContests(data);
      } catch (error) {
        console.error('Failed to fetch contests:', error);
        setError('Failed to load contests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContests();
  }, []);

  const filteredContests = contests.filter(contest => {
    const now = new Date();
    if (filter === 'upcoming') return new Date(contest.startDate) > now;
    if (filter === 'ongoing') return new Date(contest.startDate) <= now && new Date(contest.endDate) > now;
    if (filter === 'completed') return new Date(contest.endDate) <= now;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
        <div className="text-red-400 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all' 
              ? 'bg-cyan-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All Contests
        </button>
        <button 
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'upcoming' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setFilter('ongoing')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'ongoing' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Ongoing
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'completed' 
              ? 'bg-gray-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Completed
        </button>
      </div>

      {filteredContests.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
          <h3 className="text-xl font-medium text-gray-300">No contests found</h3>
          <p className="text-gray-500 mt-2">
            {filter === 'all' 
              ? 'There are no contests available' 
              : `There are no ${filter} contests`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredContests.map(contest => (
            <ContestCard key={contest._id} contest={contest} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContestList;