// import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { NavLink } from 'react-router';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// import axiosClient from '../utils/axiosClient';
// import Header from '../components/Header'; 
// import { format } from 'date-fns'; // For better date formatting

// const UserProfilePage = () => {
//   const { user } = useSelector((state) => state.auth);
//   const [stats, setStats] = useState(null);
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user) return;
//       setLoading(true);
//       setError(null);
//       try {
//         // Fetch stats and submissions in parallel
//         const [statsRes, submissionsRes] = await Promise.all([
//           axiosClient.get('/collect/stats'), // Assumes you have this endpoint
//           axiosClient.get('/collect/allsubmissions') // Assumes you have this endpoint
//         ]);
//         setStats(statsRes.data);
//         setSubmissions(submissionsRes.data);
//       } catch (err) {
//         console.error("Failed to fetch profile data:", err);
//         setError("Could not load profile data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
//         <Header />
//         <div className="flex justify-center items-center h-[calc(100vh-80px)]">
//           <span className="loading loading-spinner loading-lg text-cyan-400"></span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
//         <Header />
//         <div className="flex justify-center items-center h-[calc(100vh-80px)] text-red-400">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
//       <Header />
//       <main className="container mx-auto px-4 py-10 max-w-7xl">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column */}
//           <div className="lg:col-span-1 space-y-8">
//             <ProfileHeaderCard user={user} stats={stats} />
//             <DifficultyChart stats={stats} />
//           </div>

//           {/* Right Column */}
//           <div className="lg:col-span-2">
//             <RecentSubmissionsTable submissions={submissions} />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// // Sub-component for the main profile card
// const ProfileHeaderCard = ({ user, stats }) => (
//   <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl text-center">
//     <div className="avatar placeholder mx-auto mb-4">
//       <div className="bg-gradient-to-r pt-6 from-amber-400 to-orange-500 text-black rounded-full w-24 h-24 ring-4 ring-gray-700 ring-offset-4 ring-offset-gray-800">
//         <span className="text-4xl font-extrabold">{user?.firstName?.charAt(0)}</span>
//       </div>
//     </div>
//     <h1 className="text-3xl font-bold text-white mt-4">{user?.firstName} {user?.lastName}</h1>
//     <p className="text-cyan-400 mb-6">{user?.email}</p>

//     <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-700">
//       <div className="text-center">
//         <p className="text-sm text-gray-400 uppercase tracking-wider">Solved</p>
//         <p className="text-3xl font-bold text-green-400">{stats?.solvedCount || 0}</p>
//       </div>
//       <div className="text-center">
//         <p className="text-sm text-gray-400 uppercase tracking-wider">Submissions</p>
//         <p className="text-3xl font-bold text-blue-400">{stats?.totalSubmissions || 0}</p>
//       </div>
//       <div className="text-center">
//         <p className="text-sm text-gray-400 uppercase tracking-wider">Accuracy</p>
//         <p className="text-3xl font-bold text-yellow-400">{stats?.accuracy || '0.00'}%</p>
//       </div>
//        <div className="text-center">
//         <p className="text-sm text-gray-400 uppercase tracking-wider">Role</p>
//         <p className="text-3xl font-bold text-purple-400">{user?.role}</p>
//       </div>
//     </div>
//   </div>
// );

// // Sub-component for the difficulty chart
// const DifficultyChart = ({ stats }) => {
//   const data = [
//     { name: 'Easy', solved: stats?.easySolved || 0 },
//     { name: 'Medium', solved: stats?.mediumSolved || 0 },
//     { name: 'Hard', solved: stats?.hardSolved || 0 },
//   ];

//   const colors = ['#22c55e', '#eab308', '#ef4444']; // Green, Yellow, Red

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
//           <p className="label text-white">{`${label} : ${payload[0].value}`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-2xl">
//       <h2 className="text-xl font-bold mb-4 text-white">Difficulty Breakdown</h2>
//       <div style={{ width: '100%', height: 250 }}>
//         <ResponsiveContainer>
//           <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
//             <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
//             <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
//             <Bar dataKey="solved" radius={[4, 4, 0, 0]}>
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// // Sub-component for the recent submissions table
// const RecentSubmissionsTable = ({ submissions }) => {
//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'Accepted':
//         return <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500"></div><span className="text-green-400">{status}</span></div>;
//       case 'Wrong Answer':
//         return <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500"></div><span className="text-red-400">{status}</span></div>;
//       case 'Time Limit Exceeded':
//         return <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-yellow-500"></div><span className="text-yellow-400">TLE</span></div>;
//       default:
//         return <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-gray-500"></div><span className="text-gray-400">{status}</span></div>;
//     }
//   };

//   return (
//     <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-2xl h-full">
//       <h2 className="text-xl font-bold mb-4 text-white">Recent Submissions</h2>
//       {submissions.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="table w-full">
//             <thead>
//               <tr className="border-b border-gray-700">
//                 <th className="text-left text-xs uppercase tracking-wider text-gray-400 p-4 bg-transparent">Problem</th>
//                 <th className="text-left text-xs uppercase tracking-wider text-gray-400 p-4 bg-transparent">Status</th>
//                 <th className="text-left text-xs uppercase tracking-wider text-gray-400 p-4 bg-transparent">Language</th>
//                 <th className="text-left text-xs uppercase tracking-wider text-gray-400 p-4 bg-transparent">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {submissions.map((sub) => (
//                 <tr key={sub._id} className="border-b border-gray-800 hover:bg-gray-700/30 transition-colors">
//                   <td className="p-4">
//                     <NavLink to={`/problem/${sub.problemId}`} className="hover:text-cyan-400 transition-colors">
//                       {sub.problemTitle}
//                     </NavLink>
//                   </td>
//                   <td className="p-4 font-medium">{getStatusBadge(sub.status)}</td>
//                   <td className="p-4">
//                     <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-xs">{sub.language}</span>
//                   </td>
//                   <td className="p-4 text-gray-400 text-sm">{new Date(sub.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="text-center py-16">
//           <p className="text-gray-500">No submissions yet.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfilePage;





// Excellent question. For the UserProfilePage component to work perfectly, your backend needs to provide data in a specific format for those two API endpoints.
// Here is a detailed breakdown of the data structure required for each API call.
// 1. API Endpoint: GET /user/stats
// This endpoint should calculate and return the user's aggregated performance statistics.
// Purpose: To provide the data for the main profile card and the difficulty breakdown chart.
// Authentication: Required. The backend must identify the logged-in user to calculate their specific stats.
// Required Response Body (JSON):
// Generated json
// {
//   "solvedCount": 25,
//   "totalSubmissions": 80,
//   "accuracy": "31.25",
//   "easySolved": 12,
//   "mediumSolved": 10,
//   "hardSolved": 3
// }
// Use code with caution.
// Json
// Field-by-Field Explanation:
// solvedCount (Number): The total number of unique problems the user has successfully solved (i.e., had at least one "Accepted" submission for).
// totalSubmissions (Number): The total count of all submissions the user has ever made, regardless of status.
// accuracy (String): The percentage of submissions that were "Accepted". It's calculated as (totalAcceptedSubmissions / totalSubmissions) * 100. Returning it as a string allows you to format it to two decimal places on the backend.
// easySolved (Number): The count of unique easy problems the user has solved.
// mediumSolved (Number): The count of unique medium problems the user has solved.
// hardSolved (Number): The count of unique hard problems the user has solved.
// 2. API Endpoint: GET /submission/userSubmissions
// This endpoint should return a list of the user's most recent submissions.
// Purpose: To populate the "Recent Submissions" table.
// Authentication: Required.
// Required Response Body (JSON):
// The API should return an array of submission objects. The backend should sort these by date in descending order (most recent first).
// Generated json
// [
//   {
//     "_id": "64f8c123a4b5c6d7e8f9a0b1",
//     "problemId": "60d5ec49f2b8a40015d3e8e1",
//     "problemTitle": "Two Sum",
//     "status": "Accepted",
//     "language": "JavaScript",
//     "submittedAt": "2023-10-27T10:30:00.000Z"
//   },
//   {
//     "_id": "64f8c110a4b5c6d7e8f9a0a5",
//     "problemId": "60d5ec49f2b8a40015d3e8e2",
//     "problemTitle": "Longest Substring Without Repeating Characters",
//     "status": "Wrong Answer",
//     "language": "C++",
//     "submittedAt": "2023-10-27T09:15:00.000Z"
//   },
//   {
//     "_id": "64f8b999a4b5c6d7e8f9a099",
//     "problemId": "60d5ec49f2b8a40015d3e8e3",
//     "problemTitle": "Longest Palindromic Substring",
//     "status": "Time Limit Exceeded",
//     "language": "Java",
//     "submittedAt": "2023-10-26T18:00:00.000Z"
//   }
// ]
// Use code with caution.
// Json
// Field-by-Field Explanation (for each object in the array):
// _id (String): The unique ID of the submission document.
// problemId (String): The ID of the problem that was submitted. This is crucial for the NavLink to link back to the correct problem page.
// problemTitle (String): The title of the problem. Your backend will likely need to perform a lookup or $lookup (in a MongoDB aggregation) from the submissions collection to the problems collection to get this title.
// status (String): The final verdict of the submission. The frontend is designed to handle "Accepted", "Wrong Answer", and "Time Limit Exceeded".
// language (String): The programming language used for the submission (e.g., "JavaScript", "C++", "Java").
// submittedAt (String): The timestamp of when the submission was made, preferably in ISO 8601 format. This is the standard and works perfectly with new Date() in JavaScript.



import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axiosClient from '../utils/axiosClient';
import Header from '../components/Header';
import { format } from 'date-fns';
import Footer from '../components/Footer';

const UserProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const [statsRes, submissionsRes] = await Promise.all([
          axiosClient.get('/collect/stats'),
          axiosClient.get('/collect/allsubmissions')
        ]);
        setStats(statsRes.data);
        setSubmissions(submissionsRes.data);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError("Could not load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <span className="loading loading-spinner loading-lg text-cyan-400"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-80px)] text-red-400">
          {error}
        </div>
        <Footer></Footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <ProfileHeaderCard user={user} stats={stats} />
            <DifficultyChart stats={stats} />
          </div>

          <div className="lg:col-span-2">
            <RecentSubmissionsTable submissions={submissions} />
          </div>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
};

const ProfileHeaderCard = ({ user, stats }) => (
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl text-center transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/30">
    <div className="avatar placeholder mx-auto mb-4 group">
      <div className="bg-gradient-to-r pt-6 from-amber-400 to-orange-500 text-black rounded-full w-24 h-24 ring-4 ring-gray-700 ring-offset-4 ring-offset-gray-800 transition-transform duration-300 group-hover:scale-110">
        <span className="text-4xl font-extrabold">{user?.firstName?.charAt(0)}</span>
      </div>
    </div>
    <h1 className="text-3xl font-bold text-white mt-4">{user?.firstName} {user?.lastName}</h1>
    <p className="text-cyan-400 mb-6">{user?.email}</p>

    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-700">
      <div className="text-center">
        <p className="text-sm text-gray-400 uppercase tracking-wider">Solved</p>
        <p className="text-3xl font-bold text-green-400">{stats?.solvedCount || 0}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-400 uppercase tracking-wider">Submissions</p>
        <p className="text-3xl font-bold text-blue-400">{stats?.totalSubmissions || 0}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-400 uppercase tracking-wider">Accuracy</p>
        <p className="text-3xl font-bold text-yellow-400">{stats?.accuracy || '0.00'}%</p>
      </div>
       <div className="text-center">
        <p className="text-sm text-gray-400 uppercase tracking-wider">Role</p>
        <p className="text-3xl font-bold text-purple-400">{user?.role}</p>
      </div>
    </div>
  </div>
);

const DifficultyChart = ({ stats }) => {
  const data = [
    { name: 'Easy', solved: stats?.easySolved || 0 },
    { name: 'Medium', solved: stats?.mediumSolved || 0 },
    { name: 'Hard', solved: stats?.hardSolved || 0 },
  ];

  const colors = ['#22c55e', '#eab308', '#ef4444'];

  const CustomBar = (props) => {
    const { fill, x, y, width, height } = props;
    const [isHovering, setIsHovering] = useState(false);
    
    return (
      <g>
        <rect
          x={x}
          y={isHovering ? y - 5 : y}
          width={width}
          height={isHovering ? height + 5 : height}
          fill={isHovering ? `${fill}CC` : fill}
          rx={4}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="transition-all duration-200"
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 shadow-lg">
          <p className="label text-white font-medium">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-2xl transition-all duration-300 hover:shadow-purple-500/10 hover:border-purple-500/30">
      <h2 className="text-xl font-bold mb-4 text-white">Difficulty Breakdown</h2>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
            <Bar 
              dataKey="solved" 
              shape={<CustomBar />} 
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const RecentSubmissionsTable = ({ submissions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(submissions.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSubmissions = submissions.slice(indexOfFirst, indexOfLast);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500"></div><span className="text-green-400">{status}</span></div>;
      case 'wrong':
        return <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500"></div><span className="text-red-400">{status}</span></div>;
      case 'error':
        return <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-yellow-500"></div><span className="text-yellow-400">error</span></div>;
      default:
        return <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-gray-500"></div><span className="text-gray-400">{status}</span></div>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-2xl h-full transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/30">
      <h2 className="text-xl font-bold mb-4 text-white">Recent Submissions</h2>
      {currentSubmissions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-xs uppercase tracking-wider text-gray-400 p-4 bg-transparent">Problem</th>
                <th className="text-left text-xs uppercase tracking-wider text-gray-400 p-4 bg-transparent">Status</th>
                <th className="text-left text-xs uppercase tracking-wider text-gray-400 p-4 bg-transparent">Language</th>
                <th className="text-left text-xs uppercase tracking-wider text-gray-400 p-4 bg-transparent">Date</th>
              </tr>
            </thead>
            <tbody>
              {currentSubmissions.map((sub) => (
                <tr 
                  key={sub._id} 
                  className="border-b border-gray-800 hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="p-4">
                    <NavLink 
                      to={`/problem/${sub.problemId}`} 
                      className="hover:text-cyan-400 transition-colors duration-200 block"
                    >
                      {sub.problemTitle}
                    </NavLink>
                  </td>
                  <td className="p-4 font-medium">{getStatusBadge(sub.status)}</td>
                  <td className="p-4">
                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-xs hover:bg-gray-600 transition-colors duration-200">
                      {sub.language}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm hover:text-white transition-colors duration-200">
                    {format(new Date(sub.createdAt), 'MMM dd, yyyy HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-between items-center mt-6 px-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md flex items-center ${
                currentPage === 1 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-cyan-600 text-white'
              } transition-colors duration-200`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentPage === page
                      ? 'bg-cyan-500 text-white shadow-cyan-500/20 shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  } transition-all duration-200`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md flex items-center ${
                currentPage === totalPages
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-cyan-600 text-white'
              } transition-colors duration-200`}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">No submissions yet.</p>
        </div>
      )}
      
    </div>
    
  );
};

export default UserProfilePage;