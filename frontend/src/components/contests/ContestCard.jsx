import { NavLink } from 'react-router';
import { format } from 'date-fns';

const ContestCard = ({ contest }) => {
  const getStatus = () => {
    const now = new Date();
    if (now < new Date(contest.startDate)) return 'upcoming';
    if (now > new Date(contest.endDate)) return 'completed';
    return 'ongoing';
  };

  const status = getStatus();
  const statusColors = {
    upcoming: 'bg-blue-500',
    ongoing: 'bg-green-500',
    completed: 'bg-gray-500',
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 transition-all duration-300 hover:shadow-xl hover:border-cyan-500/30">
      <div className="flex justify-between items-start">
        <div>
          <NavLink to={`/contests/${contest._id}`} className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">
            {contest.title}
          </NavLink>
          <p className="text-gray-400 mt-2">{contest.description}</p>
        </div>
        <span className={`${statusColors[status]} text-white text-xs px-2 py-1 rounded-full`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Start</p>
          <p className="text-white">{format(new Date(contest.startDate), 'MMM dd, yyyy HH:mm')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">End</p>
          <p className="text-white">{format(new Date(contest.endDate), 'MMM dd, yyyy HH:mm')}</p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-gray-700 rounded-full p-1 mr-2">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black">
              {contest.creator.firstName.charAt(0)}
            </div>
          </div>
          <span className="text-gray-400 text-sm">
            {contest.creator.firstName} {contest.creator.lastName}
          </span>
        </div>
        
        <NavLink 
          to={`/contests/${contest._id}`} 
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          View Contest
        </NavLink>
      </div>
    </div>
  );
};

export default ContestCard;