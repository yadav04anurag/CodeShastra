// import { useEffect, useState } from 'react';
// import axiosClient from '../utils/axiosClient'
// import { NavLink } from 'react-router';

// const AdminVideo = () => {
//   const [problems, setProblems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);


//   useEffect(() => {
//     fetchProblems();
//   }, []);

//   const fetchProblems = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axiosClient.get('/problem/getAllProblem');
//       setProblems(data);
//     } catch (err) {
//       setError('Failed to fetch problems');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this problem?')) return;
    
//     try {
//       await axiosClient.delete(`/video/delete/${id}`);
//       setProblems(problems.filter(problem => problem._id !== id));
//     } catch (err) {
//       setError(err);
//       console.log(err);
//     }
//   };


//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-error shadow-lg my-4">
//         <div>
//           <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <span>{error.response.data.error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Video Upload and Delete</h1>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="table table-zebra w-full">
//           <thead>
//             <tr>
//               <th className="w-1/12">#</th>
//               <th className="w-4/12">Title</th>
//               <th className="w-2/12">Difficulty</th>
//               <th className="w-3/12">Tags</th>
//               <th className="w-2/12">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {problems.map((problem, index) => (
//               <tr key={problem._id}>
//                 <th>{index + 1}</th>
//                 <td>{problem.title}</td>
//                 <td>
//                   <span className={`badge ${
//                     problem.difficulty === 'Easy' 
//                       ? 'badge-success' 
//                       : problem.difficulty === 'Medium' 
//                         ? 'badge-warning' 
//                         : 'badge-error'
//                   }`}>
//                     {problem.difficulty}
//                   </span>
//                 </td>
//                 <td>
//                   <span className="badge badge-outline">
//                     {problem.tags}
//                   </span>
//                 </td>
//                 <td>
//                   <div className="flex space-x-1">
//                      <NavLink 
//                         to={`/admin/upload/${problem._id}`}
//                         className={`btn bg-blue-600`}
//                         >
//                         Upload
//                     </NavLink>
//                   </div>
//                 </td>
//                 <td>
//                   <div className="flex space-x-2">
//                     <button 
//                       onClick={() => handleDelete(problem._id)}
//                       className="btn btn-sm btn-error"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminVideo;


import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { Trash2, Upload, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import LoadingSpinner from './ui/LoadingSpinner';
const AdminVideo = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    try {
      setDeletingId(id);
      await axiosClient.delete(`/video/delete/${id}`);
      toast.success('Video deleted successfully!');
      // Refetch or update state as needed
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete video';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return <div className="badge badge-success text-white">Easy</div>;
      case 'medium': return <div className="badge badge-warning text-white">Medium</div>;
      case 'hard': return <div className="badge badge-error text-white">Hard</div>;
      default: return <div className="badge badge-info text-white">Unknown</div>;
    }
  };

  const filteredProblems = problems?.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
              <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4 max-w-4xl mx-auto">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className="btn btn-ghost hover:bg-gray-800 text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-white">Video Management</h1>
          </div>
          
          <div className="flex gap-4">
            <div className="form-control">
              <label className="input input-bordered bg-gray-800 text-white flex items-center gap-2">
                <input 
                  type="text" 
                  className="grow bg-transparent" 
                  placeholder="Search by title" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                </svg>
              </label>
            </div>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems?.map((problem) => (
            <div key={problem._id} className="card bg-gray-800 shadow-xl border border-gray-700 transition-all hover:border-blue-500">
              <div className="card-body">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="card-title text-white">{problem.title}</h2>
                  {getDifficultyBadge(problem.difficulty)}
                </div>
                <div className="mt-2">
                  <div className="badge badge-outline border-gray-600 text-gray-300">
                    {problem.tags}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-4">
                  <button 
                    onClick={() => navigate(`/admin/upload/${problem._id}`)}
                    className="btn btn-info bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload/Edit Video
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(problem._id)}
                    className="btn btn-error bg-red-600 hover:bg-red-700 text-white"
                    disabled={deletingId === problem._id}
                  >
                    {deletingId === problem._id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Delete Video
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No problems found matching your search</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideo;