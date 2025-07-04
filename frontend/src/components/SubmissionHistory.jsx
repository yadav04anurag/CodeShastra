// import { useState, useEffect } from "react";
// import axiosClient from "../utils/axiosClient";
// import LoadingSpinner from "./ui/LoadingSpinner";
// const SubmissionHistory = ({ problemId }) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosClient.get(
//           `/problem/submittedProblem/${problemId}`
//         );
//         // Sort submissions by date (newest first)
//         const sortedSubmissions = response.data.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setSubmissions(sortedSubmissions);
//         setError(null);
//       } catch (err) {
//         setError(
//           err.response?.data?.message || "Failed to fetch submission history"
//         );
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubmissions();
//   }, [problemId]);

//   const getStatusColor = (status) => {
//     const statusLower = status.toLowerCase();
//     switch (statusLower) {
//       case "accepted":
//         return "badge-success";
//       case "wrong":
//         return "badge-error";
//       case "error":
//         return "badge-warning";
//       case "pending":
//         return "badge-info";
//       default:
//         return "badge-neutral";
//     }
//   };

//   const formatMemory = (memory) => {
//     if (memory < 1024) return `${memory} kB`;
//     return `${(memory / 1024).toFixed(2)} MB`;
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <LoadingSpinner size="md" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-error shadow-lg my-4">
//         <div>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="stroke-current flex-shrink-0 h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <span>{error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-6 text-center">
//         Submission History
//       </h2>

//       {submissions.length === 0 ? (
//         <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-12 w-12 mx-auto text-gray-500 mb-3"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={1.5}
//               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//             />
//           </svg>
//           <p className="text-gray-500">No submissions till date</p>
//         </div>
//       ) : (
//         <>
//           <div className="overflow-x-auto">
//             <table className="table table-zebra w-full">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Language</th>
//                   <th>Status</th>
//                   <th>Runtime</th>
//                   <th>Memory</th>
//                   <th>Test Cases</th>
//                   <th>Submitted</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {submissions.map((sub, index) => (
//                   <tr key={sub._id}>
//                     <td>{index + 1}</td>
//                     <td className="font-mono">{sub.language}</td>
//                     <td>
//                       <span className={`badge ${getStatusColor(sub.status)}`}>
//                         {sub.status.charAt(0).toUpperCase() +
//                           sub.status.slice(1)}
//                       </span>
//                     </td>

//                     <td className="font-mono">{sub.runtime} sec</td>
//                     <td className="font-mono">{formatMemory(sub.memory)}</td>
//                     <td className="font-mono">
//                       {sub.testCasesPassed}/{sub.testCasesTotal}
//                     </td>
//                     <td>{formatDate(sub.createdAt)}</td>
//                     <td>
//                       <button
//                         className="btn btn-xs sm:btn-sm btn-outline"
//                         onClick={() => setSelectedSubmission(sub)}
//                       >
//                         View Code
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <p className="mt-4 text-sm text-gray-500">
//             Showing {submissions.length} submissions
//           </p>
//         </>
//       )}

//       {/* Code View Modal */}
//       {selectedSubmission && (
//         <div className="modal modal-open">
//           <div className="modal-box w-11/12 max-w-5xl">
//             <h3 className="font-bold text-lg mb-4">
//               Submission Details: {selectedSubmission.language}
//             </h3>

//             <div className="mb-4">
//               <div className="flex flex-wrap gap-2 mb-2">
//                 <span
//                   className={`badge ${getStatusColor(
//                     selectedSubmission.status
//                   )}`}
//                 >
//                   {selectedSubmission.status.charAt(0).toUpperCase() +
//                     selectedSubmission.status.slice(1)}
//                 </span>
//                 <span className="badge badge-outline">
//                   Runtime: {selectedSubmission.runtime}s
//                 </span>
//                 <span className="badge badge-outline">
//                   Memory: {formatMemory(selectedSubmission.memory)}
//                 </span>
//                 <span className="badge badge-outline">
//                   Passed: {selectedSubmission.testCasesPassed}/
//                   {selectedSubmission.testCasesTotal}
//                 </span>
//               </div>

//               {selectedSubmission.errorMessage && (
//                 <div className="alert alert-error mt-2 whitespace-pre-wrap">
//                   <div>
//                     <span>{selectedSubmission.errorMessage}</span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <pre className="p-4 bg-gray-900 text-gray-100 rounded overflow-x-auto max-h-96 overflow-y-auto">
//               <code>{selectedSubmission.code}</code>
//             </pre>

//             <div className="modal-action">
//               <button
//                 className="btn"
//                 onClick={() => setSelectedSubmission(null)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SubmissionHistory;


import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import LoadingSpinner from "./ui/LoadingSpinner";

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(
          `/problem/submittedProblem/${problemId}`
        );
        if (!Array.isArray(response.data)) {
          setError("No submission history exists");
          setLoading(false);
          return;
        }
        const sortedSubmissions = response.data?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSubmissions(sortedSubmissions);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message 
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "accepted":
        return "bg-green-500/20 text-green-500";
      case "wrong":
        return "bg-red-500/20 text-red-500";
      case "error":
        return "bg-yellow-500/20 text-yellow-500";
      case "pending":
        return "bg-blue-500/20 text-blue-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedSubmission?.code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 bg-clip-text text-transparent">
          Submission History
        </h2>
        <p className="text-gray-500 mt-2">
          Review your previous solutions and their results
        </p>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center max-w-md mx-auto">
          <div className="text-red-500 font-medium">{error}</div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-500/10 p-5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-200 mb-2">No Submissions Yet</h3>
          <p className="text-gray-400 mb-6">
            You haven't submitted any solutions for this problem. Be the first to solve it!
          </p>
          <button 
            className="btn btn-primary px-6"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Solve Problem
          </button>
        </div>
      ) : (
        <>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-800/80">
                  <tr>
                    <th className="py-4">#</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Runtime</th>
                    <th>Memory</th>
                    <th>Test Cases</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, index) => (
                    <tr key={sub._id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="font-medium text-gray-400">{index + 1}</td>
                      <td className="font-mono text-cyan-400">{sub.language}</td>
                      <td>
                        <span className={`py-1.5 px-3 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </span>
                      </td>
                      <td className="font-mono">{sub.runtime}s</td>
                      <td className="font-mono">{formatMemory(sub.memory)}</td>
                      <td className="font-mono">
                        <span className="bg-gray-800/50 py-1 px-2.5 rounded">
                          {sub.testCasesPassed}/{sub.testCasesTotal}
                        </span>
                      </td>
                      <td className="text-gray-400 text-sm">{formatDate(sub.createdAt)}</td>
                      <td>
                        <button
                          className="btn btn-outline btn-sm hover:bg-indigo-500/20 hover:border-indigo-500 hover:text-indigo-400 transition-all"
                          onClick={() => setSelectedSubmission(sub)}
                        >
                          View Code
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm">
            <div className="text-gray-500">
              Showing <span className="text-gray-300">{submissions.length}</span> submissions
            </div>
            <div className="text-gray-500">
              Sorted by most recent
            </div>
          </div>
        </>
      )}

      {/* Code View Modal */}
      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl bg-gray-900 border border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl mb-1">
                  Submission Details
                </h3>
                <div className="text-sm text-gray-400">
                  {new Date(selectedSubmission.createdAt).toLocaleString()}
                </div>
              </div>
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => setSelectedSubmission(null)}
              >
                ✕
              </button>
            </div>

            <div className="mb-6 mt-4">
              <div className="flex flex-wrap gap-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status}
                </div>
                <div className="bg-gray-800/50 px-3 py-1 rounded-full text-sm">
                  <span className="text-gray-400">Language: </span>
                  <span className="text-cyan-400">{selectedSubmission.language}</span>
                </div>
                <div className="bg-gray-800/50 px-3 py-1 rounded-full text-sm">
                  <span className="text-gray-400">Runtime: </span>
                  <span className="text-gray-200">{selectedSubmission.runtime}s</span>
                </div>
                <div className="bg-gray-800/50 px-3 py-1 rounded-full text-sm">
                  <span className="text-gray-400">Memory: </span>
                  <span className="text-gray-200">{formatMemory(selectedSubmission.memory)}</span>
                </div>
              </div>

              {selectedSubmission.errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <div className="font-medium text-red-400 mb-1">Error Output:</div>
                  <pre className="text-red-300 whitespace-pre-wrap text-sm overflow-x-auto">
                    {selectedSubmission.errorMessage}
                  </pre>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute top-3 right-3 flex gap-2">
                <button 
                  className="btn btn-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300"
                  onClick={copyToClipboard}
                >
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="p-4 bg-gray-950 text-gray-100 rounded-lg overflow-x-auto max-h-[60vh]">
                <code className="font-mono text-sm">{selectedSubmission.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;