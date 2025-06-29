// import { useEffect, useState } from 'react';
// import { Edit, Search, X, Loader2, Code, AlertTriangle, Plus, Trash2 } from 'lucide-react';
// import { toast } from 'react-toastify';
// import axiosClient from '../utils/axiosClient';

// // Initial state for the form, matching your Mongoose schema
// const initialFormData = {
//   title: '',
//   description: '',
//   difficulty: 'easy',
//   tags: 'array',
//   visibleTestCases: [],
//   hiddenTestCases: [],
//   starterCode: [],
//   referenceSolution: [],
//   problemCreator: '',
// };

// const AdminProblems = () => {
//   const [problems, setProblems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProblem, setSelectedProblem] = useState(null);
//   const [formData, setFormData] = useState(initialFormData);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState(null);
  
//   // --- NEW: State to track which problem is being fetched for editing ---
//   const [fetchingId, setFetchingId] = useState(null);

//   // --- 1. Fetch all problems on initial load ---
//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosClient.get('/problem/getAllProblem');
//         setProblems(response.data);
//         setApiError(null);
//       } catch (err) {
//         setApiError('Failed to fetch problems. Please try again later.');
//         toast.error('Failed to fetch problems.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblems();
//   }, []);

//   // --- 2. REFACTORED: Fetch specific problem data on edit click ---
//   const handleSelectForEdit = async (problemId) => {
//     setFetchingId(problemId); // Show loading spinner on the specific button
//     try {
//       // Fetch the latest data for the selected problem
//       const response = await axiosClient.get(`/problem/problemById/${problemId}`);
//       const problemDetails = response.data; // Assuming the response directly contains the problem object

//       // Set the selected problem and pre-fill the form with fresh data
//       setSelectedProblem(problemDetails);
//       setFormData({
//         title: problemDetails.title || '',
//         description: problemDetails.description || '',
//         difficulty: problemDetails.difficulty || 'easy',
//         tags: problemDetails.tags || 'array',
//         visibleTestCases: problemDetails.visibleTestCases || [],
//         hiddenTestCases: problemDetails.hiddenTestCases || [],
//         starterCode: problemDetails.starterCode || [],
//         referenceSolution: problemDetails.referenceSolution || [],
//         problemCreator: problemDetails.problemCreator || '',
//       });

//       // Show the modal
//       document.getElementById('edit_problem_modal').showModal();
//     } catch (error) {
//       console.error("Failed to fetch problem details:", error);
//       toast.error("Could not fetch the latest problem details. Please try again.");
//     } finally {
//       setFetchingId(null); // Hide loading spinner
//     }
//   };

//   // --- 3. Handle form submission for updates (No changes needed here) ---
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!selectedProblem) return;

//     setIsSubmitting(true);
//     setApiError(null);

//     try {
//       const response = await axiosClient.put(`/problem/update/${selectedProblem._id}`, formData);
//       // Assuming the updated problem is returned under a 'problem' key
//       setProblems(problems.map(p => p._id === selectedProblem._id ? response.data.problem : p));
//       toast.success('Problem updated successfully!');
//       document.getElementById('edit_problem_modal').close();
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Failed to update problem';
//       setApiError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // --- 4. Generic handlers for form state changes (No changes needed) ---
//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleArrayItemChange = (arrayName, index, field, value) => {
//     setFormData(prev => {
//       const newArray = [...prev[arrayName]];
//       newArray[index] = { ...newArray[index], [field]: value };
//       return { ...prev, [arrayName]: newArray };
//     });
//   };

//   const addArrayItem = (arrayName, itemStructure) => {
//     setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], itemStructure] }));
//   };

//   const removeArrayItem = (arrayName, index) => {
//     setFormData(prev => ({ ...prev, [arrayName]: prev[arrayName].filter((_, i) => i !== index) }));
//   };

//   // --- Helper functions and filtered data for rendering ---
//   const filteredProblems = problems.filter(problem =>
//     problem.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getDifficultyBadge = (difficulty) => {
//     switch (difficulty?.toLowerCase()) {
//       case 'easy': return <div className="badge badge-success badge-outline">Easy</div>;
//       case 'medium': return <div className="badge badge-warning badge-outline">Medium</div>;
//       case 'hard': return <div className="badge badge-error badge-outline">Hard</div>;
//       default: return <div className="badge badge-info badge-outline">Unknown</div>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-base-300">
//         <div className="flex flex-col items-center gap-4">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//           <p className="text-lg">Loading Problems...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-base-200 text-base-content p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold">Problems Management</h1>
//             <p className="text-base-content/70 mt-1">View and edit coding problems.</p>
//           </div>
//           <div className="form-control w-full md:w-64">
//             <label className="input input-bordered flex items-center gap-2">
//               <Search className="h-5 w-5" />
//               <input type="text" className="grow" placeholder="Search by title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             </label>
//           </div>
//         </div>

//         {/* Problems Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProblems.length > 0 ? (
//             filteredProblems.map((problem) => (
//               <div key={problem._id} className="card bg-base-100 shadow-xl border border-base-300 transition-all hover:border-primary">
//                 <div className="card-body">
//                   <div className="flex justify-between items-start gap-4">
//                     <h2 className="card-title">{problem.title}</h2>
//                     {getDifficultyBadge(problem.difficulty)}
//                   </div>
//                   <div className="mt-2">
//                     <div className="badge badge-neutral">{problem.tags}</div>
//                   </div>
//                   <div className="card-actions justify-end mt-4">
//                     {/* --- UPDATED: Edit button now shows a loading state --- */}
//                     <button
//                       className="btn btn-primary"
//                       onClick={() => handleSelectForEdit(problem._id)}
//                       disabled={fetchingId === problem._id}
//                     >
//                       {fetchingId === problem._id ? (
//                         <span className="loading loading-spinner loading-xs"></span>
//                       ) : (
//                         <Edit className="h-4 w-4" />
//                       )}
//                       Edit
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center p-12 bg-base-100 rounded-box">
//               <h3 className="text-xl font-semibold">No Problems Found</h3>
//               <p className="text-base-content/70 mt-2">Try adjusting your search criteria.</p>
//             </div>
//           )}
//         </div>

//         {/* DaisyUI Modal for Editing (No changes to the modal's internal structure) */}
//         <dialog id="edit_problem_modal" className="modal">
//           <div className="modal-box w-11/12 max-w-4xl">
//             <form method="dialog">
//               <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//             </form>
//             <h3 className="font-bold text-2xl mb-4">Edit: {selectedProblem?.title}</h3>
            
//             <form onSubmit={handleUpdate} className="space-y-4">
//               {/* Basic Info */}
//               <input type="text" name="title" value={formData.title} onChange={handleFormChange} placeholder="Problem Title" className="input input-bordered w-full" required />
//               <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Problem Description" className="textarea textarea-bordered w-full h-32" required />
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <select name="difficulty" value={formData.difficulty} onChange={handleFormChange} className="select select-bordered w-full" required>
//                   <option value="easy">Easy</option>
//                   <option value="medium">Medium</option>
//                   <option value="hard">Hard</option>
//                 </select>
//                 <select name="tags" value={formData.tags} onChange={handleFormChange} className="select select-bordered w-full" required>
//                   <option value="array">Array</option>
//                   <option value="linkedList">Linked List</option>
//                   <option value="graph">Graph</option>
//                   <option value="dp">DP</option>
//                 </select>
//               </div>

//               {/* Collapsible Sections for Arrays */}
//               <div className="collapse collapse-arrow bg-base-200">
//                 <input type="checkbox" />
//                 <div className="collapse-title text-xl font-medium">Visible Test Cases</div>
//                 <div className="collapse-content space-y-4">
//                   {formData.visibleTestCases.map((tc, index) => (
//                     <div key={index} className="p-4 bg-base-100 rounded-lg space-y-2">
//                       <textarea value={tc.input} onChange={(e) => handleArrayItemChange('visibleTestCases', index, 'input', e.target.value)} placeholder="Input" className="textarea textarea-bordered w-full" required />
//                       <textarea value={tc.output} onChange={(e) => handleArrayItemChange('visibleTestCases', index, 'output', e.target.value)} placeholder="Output" className="textarea textarea-bordered w-full" required />
//                       <textarea value={tc.explanation} onChange={(e) => handleArrayItemChange('visibleTestCases', index, 'explanation', e.target.value)} placeholder="Explanation" className="textarea textarea-bordered w-full" required />
//                       <button type="button" onClick={() => removeArrayItem('visibleTestCases', index)} className="btn btn-xs btn-ghost text-error"><Trash2 size={14}/> Remove</button>
//                     </div>
//                   ))}
//                   <button type="button" onClick={() => addArrayItem('visibleTestCases', { input: '', output: '', explanation: '' })} className="btn btn-sm btn-outline btn-accent w-full"><Plus size={16}/> Add Visible Test Case</button>
//                 </div>
//               </div>

//               <div className="collapse collapse-arrow bg-base-200">
//                 <input type="checkbox" />
//                 <div className="collapse-title text-xl font-medium">Starter Code</div>
//                 <div className="collapse-content space-y-4">
//                   {formData.starterCode.map((sc, index) => (
//                     <div key={index} className="p-4 bg-base-100 rounded-lg space-y-2">
//                       <select value={sc.language} onChange={(e) => handleArrayItemChange('starterCode', index, 'language', e.target.value)} className="select select-bordered w-full">
//                         <option value="javascript">JavaScript</option>
//                         <option value="python">Python</option>
//                         <option value="java">Java</option>
//                         <option value="c++">C++</option>
//                       </select>
//                       <textarea value={sc.initialCode} onChange={(e) => handleArrayItemChange('starterCode', index, 'initialCode', e.target.value)} placeholder="Starter Code Snippet" className="textarea textarea-bordered w-full h-40 font-mono" required />
//                       <button type="button" onClick={() => removeArrayItem('starterCode', index)} className="btn btn-xs btn-ghost text-error"><Trash2 size={14}/> Remove</button>
//                     </div>
//                   ))}
//                   <button type="button" onClick={() => addArrayItem('starterCode', { language: 'javascript', initialCode: '' })} className="btn btn-sm btn-outline btn-accent w-full"><Plus size={16}/> Add Starter Code</button>
//                 </div>
//               </div>

//               <div className="collapse collapse-arrow bg-base-200">
//                 <input type="checkbox" />
//                 <div className="collapse-title text-xl font-medium">Reference Solution</div>
//                 <div className="collapse-content space-y-4">
//                   {formData.referenceSolution.map((rs, index) => (
//                     <div key={index} className="p-4 bg-base-100 rounded-lg space-y-2">
//                       <select value={rs.language} onChange={(e) => handleArrayItemChange('referenceSolution', index, 'language', e.target.value)} className="select select-bordered w-full">
//                         <option value="javascript">JavaScript</option>
//                         <option value="python">Python</option>
//                         <option value="java">Java</option>
//                         <option value="c++">C++</option>
//                       </select>
//                       <textarea value={rs.completeCode} onChange={(e) => handleArrayItemChange('referenceSolution', index, 'completeCode', e.target.value)} placeholder="Complete Reference Solution" className="textarea textarea-bordered w-full h-40 font-mono" required />
//                       <button type="button" onClick={() => removeArrayItem('referenceSolution', index)} className="btn btn-xs btn-ghost text-error"><Trash2 size={14}/> Remove</button>
//                     </div>
//                   ))}
//                   <button type="button" onClick={() => addArrayItem('referenceSolution', { language: 'javascript', completeCode: '' })} className="btn btn-sm btn-outline btn-accent w-full"><Plus size={16}/> Add Solution</button>
//                 </div>
//               </div>

//               {apiError && (
//                 <div role="alert" className="alert alert-error">
//                   <AlertTriangle />
//                   <span>{apiError}</span>
//                 </div>
//               )}

//               <div className="modal-action">
//                 <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
//                   {isSubmitting && <span className="loading loading-spinner"></span>}
//                   {isSubmitting ? 'Updating...' : 'Update Problem'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </dialog>
//       </div>
//     </div>
//   );
// };

// export default AdminProblems;


// import { useEffect, useState } from 'react';
// import { Edit, Search, X, Loader2, Code, AlertTriangle, Plus, Trash2 } from 'lucide-react';
// import { toast } from 'react-toastify';
// import axiosClient from '../utils/axiosClient';

// // Define the supported languages in one place
// const SUPPORTED_LANGUAGES = ['javascript', 'java', 'c++'];

// const AdminProblems = () => {
//   const [problems, setProblems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProblem, setSelectedProblem] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [fetchingId, setFetchingId] = useState(null);

//   // --- NEW: State to manage the currently selected language in the form ---
//   const [activeLanguage, setActiveLanguage] = useState(SUPPORTED_LANGUAGES[0]);

//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosClient.get('/problem/getAllProblem');
//         setProblems(response.data);
//       } catch (err) {
//         toast.error('Failed to fetch problems.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblems();
//   }, []);

//   const handleSelectForEdit = async (problemId) => {
//     setFetchingId(problemId);
//     try {
//       const response = await axiosClient.get(`/problem/problemById/${problemId}`);
//       const problemDetails = response.data;
//       console.log(problemDetails);
      
//       // Reset active language to default when opening a new problem
//       setActiveLanguage(SUPPORTED_LANGUAGES[0]);

//       setSelectedProblem(problemDetails);
//       setFormData({
//         title: problemDetails.title || '',
//         description: problemDetails.description || '',
//         difficulty: problemDetails.difficulty || 'easy',
//         tags: problemDetails.tags || 'array',
//         visibleTestCases: problemDetails.visibleTestCases || [],
//         hiddenTestCases: problemDetails.hiddenTestCases || [],
//         starterCode: problemDetails.starterCode || [],
//         referenceSolution: problemDetails.referenceSolution || [],
//       });
//       document.getElementById('edit_problem_modal').showModal();
//     } catch (error) {
//       toast.error("Could not fetch problem details.");
//     } finally {
//       setFetchingId(null);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!selectedProblem) return;
//     setIsSubmitting(true);
//     setApiError(null);
//     try {
//       const response = await axiosClient.put(`/problem/update/${selectedProblem._id}`, formData);
//       setProblems(problems.map(p => p._id === selectedProblem._id ? response.data.problem : p));
//       toast.success('Problem updated successfully!');
//       document.getElementById('edit_problem_modal').close();
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Failed to update problem';
//       setApiError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // --- REFACTORED: Smarter handler for language-specific code changes ---
//   const handleCodeChange = (arrayName, codeField, newCode) => {
//     setFormData(prev => {
//       const newArray = [...(prev[arrayName] || [])];
//       const index = newArray.findIndex(c => c.language === activeLanguage);

//       if (index > -1) {
//         // Update existing language entry
//         newArray[index] = { ...newArray[index], [codeField]: newCode };
//       } else {
//         // Add new language entry if it doesn't exist
//         newArray.push({ language: activeLanguage, [codeField]: newCode });
//       }
//       return { ...prev, [arrayName]: newArray };
//     });
//   };
  
//   // --- NEW: Handler to remove code for the active language ---
//   const removeCodeForActiveLanguage = (arrayName) => {
//     setFormData(prev => ({
//       ...prev,
//       [arrayName]: prev[arrayName].filter(c => c.language !== activeLanguage)
//     }));
//   };

//   // Helper to get the code for the active language
//   const getActiveCode = (arrayName, codeField) => {
//     if (!formData[arrayName]) return '';
//     const codeObj = formData[arrayName].find(c => c.language === activeLanguage);
//     return codeObj ? codeObj[codeField] : '';
//   };

//   const filteredProblems = problems.filter(problem =>
//     problem.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getDifficultyBadge = (difficulty) => {
//     switch (difficulty?.toLowerCase()) {
//       case 'easy': return <div className="badge badge-success badge-outline">Easy</div>;
//       case 'medium': return <div className="badge badge-warning badge-outline">Medium</div>;
//       case 'hard': return <div className="badge badge-error badge-outline">Hard</div>;
//       default: return <div className="badge badge-info badge-outline">Unknown</div>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-base-300">
//         <span className="loading loading-spinner loading-lg text-primary"></span>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-base-200 text-base-content p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header and Search */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//           <h1 className="text-3xl font-bold">Problems Management</h1>
//           <div className="form-control w-full md:w-64">
//             <label className="input input-bordered flex items-center gap-2">
//               <Search className="h-5 w-5" />
//               <input type="text" className="grow" placeholder="Search by title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             </label>
//           </div>
//         </div>

//         {/* Problems Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProblems.map((problem) => (
//             <div key={problem._id} className="card bg-base-100 shadow-xl border border-base-300 transition-all hover:border-primary">
//               <div className="card-body">
//                 <div className="flex justify-between items-start gap-4">
//                   <h2 className="card-title">{problem.title}</h2>
//                   {getDifficultyBadge(problem.difficulty)}
//                 </div>
//                 <div className="mt-2"><div className="badge badge-neutral">{problem.tags}</div></div>
//                 <div className="card-actions justify-end mt-4">
//                   <button className="btn btn-primary" onClick={() => handleSelectForEdit(problem._id)} disabled={fetchingId === problem._id}>
//                     {fetchingId === problem._id ? <span className="loading loading-spinner loading-xs"></span> : <Edit className="h-4 w-4" />}
//                     Edit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* DaisyUI Modal for Editing */}
//         <dialog id="edit_problem_modal" className="modal">
//           <div className="modal-box w-11/12 max-w-4xl">
//             <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>
//             <h3 className="font-bold text-2xl mb-4">Edit: {selectedProblem?.title}</h3>
            
//             <form onSubmit={handleUpdate} className="space-y-4">
//               {/* Basic Info */}
//               <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} placeholder="Problem Title" className="input input-bordered w-full" required />
//               <textarea name="description" value={formData.description || ''} onChange={handleFormChange} placeholder="Problem Description" className="textarea textarea-bordered w-full h-32" required />
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <select name="difficulty" value={formData.difficulty || 'easy'} onChange={handleFormChange} className="select select-bordered w-full" required>
//                   <option value="easy">Easy</option>
//                   <option value="medium">Medium</option>
//                   <option value="hard">Hard</option>
//                 </select>
//                 <select name="tags" value={formData.tags || 'array'} onChange={handleFormChange} className="select select-bordered w-full" required>
//                   <option value="array">Array</option>
//                   <option value="linkedList">Linked List</option>
//                   <option value="graph">Graph</option>
//                   <option value="dp">DP</option>
//                 </select>
//               </div>

//               {/* --- REFACTORED: Language-aware code sections --- */}
//               <div className="space-y-2 p-4 bg-base-200 rounded-box">
//                 <h3 className="text-xl font-medium">Code & Solutions</h3>
//                 <div role="tablist" className="tabs tabs-boxed">
//                   {SUPPORTED_LANGUAGES.map(lang => (
//                     <a key={lang} role="tab" className={`tab ${activeLanguage === lang ? 'tab-active' : ''}`} onClick={() => setActiveLanguage(lang)}>
//                       {lang}
//                     </a>
//                   ))}
//                 </div>

//                 {/* Starter Code Section */}
//                 <div className="form-control">
//                   <label className="label"><span className="label-text">Starter Code for <span className="font-bold">{activeLanguage}</span></span></label>
//                   <textarea
//                     value={getActiveCode('starterCode', 'initialCode')}
//                     onChange={(e) => handleCodeChange('starterCode', 'initialCode', e.target.value)}
//                     placeholder={`function solve() {\n  // Your ${activeLanguage} starter code here\n}`}
//                     className="textarea textarea-bordered w-full h-40 font-mono"
//                   />
//                   {getActiveCode('starterCode', 'initialCode') && (
//                      <button type="button" onClick={() => removeCodeForActiveLanguage('starterCode')} className="btn btn-xs btn-ghost text-error mt-1 self-end"><Trash2 size={14}/> Remove Starter Code</button>
//                   )}
//                 </div>

//                 {/* Reference Solution Section */}
//                 <div className="form-control">
//                   <label className="label"><span className="label-text">Reference Solution for <span className="font-bold">{activeLanguage}</span></span></label>
//                   <textarea
//                     value={getActiveCode('referenceSolution', 'completeCode')}
//                     onChange={(e) => handleCodeChange('referenceSolution', 'completeCode', e.target.value)}
//                     placeholder={`// Your ${activeLanguage} complete solution here`}
//                     className="textarea textarea-bordered w-full h-40 font-mono"
//                   />
//                    {getActiveCode('referenceSolution', 'completeCode') && (
//                      <button type="button" onClick={() => removeCodeForActiveLanguage('referenceSolution')} className="btn btn-xs btn-ghost text-error mt-1 self-end"><Trash2 size={14}/> Remove Solution</button>
//                   )}
//                 </div>
//               </div>

//               {apiError && <div role="alert" className="alert alert-error"><AlertTriangle /><span>{apiError}</span></div>}
//               <div className="modal-action">
//                 <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
//                   {isSubmitting && <span className="loading loading-spinner"></span>}
//                   {isSubmitting ? 'Updating...' : 'Update Problem'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </dialog>
//       </div>
//     </div>
//   );
// };

// export default AdminProblems;


import { useEffect, useState } from 'react';
import { Edit, Search, X, Loader2, Code, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosClient from '../utils/axiosClient';

// Define the supported languages in one place
const SUPPORTED_LANGUAGES = ['JavaScript', 'Java', 'C++'];

const AdminProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [fetchingId, setFetchingId] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState(SUPPORTED_LANGUAGES[0]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/problem/getAllProblem');
        setProblems(response.data);
      } catch (err) {
        toast.error('Failed to fetch problems.');
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleSelectForEdit = async (problemId) => {
    setFetchingId(problemId);
    try {
      const response = await axiosClient.get(`/problem/problemById/${problemId}`);
      const problemDetails = response.data;
      
      setActiveLanguage(SUPPORTED_LANGUAGES[0]);
      setSelectedProblem(problemDetails);
      
      // This now correctly populates ALL fields from your API response
      setFormData({
        title: problemDetails.title || '',
        description: problemDetails.description || '',
        difficulty: problemDetails.difficulty || 'easy',
        tags: problemDetails.tags || 'array',
        visibleTestCases: problemDetails.visibleTestCases || [],
        hiddenTestCases: problemDetails.hiddenTestCases || [],
        starterCode: problemDetails.starterCode || [],
        referenceSolution: problemDetails.referenceSolution || [],
      });
      document.getElementById('edit_problem_modal').showModal();
    } catch (error) {
      toast.error("Could not fetch problem details.");
    } finally {
      setFetchingId(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProblem) return;
    setIsSubmitting(true);
    setApiError(null);
    try {
      const response = await axiosClient.put(`/problem/update/${selectedProblem._id}`, formData);
      console.log(response);
      setProblems(problems.map(p => p._id === selectedProblem._id ? response.data.problem : p));
      toast.success('Problem updated successfully!');
      document.getElementById('edit_problem_modal').close();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update problem';
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Generic Handlers (No changes needed, they already support this) ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayItemChange = (arrayName, index, field, value) => {
    setFormData(prev => {
      const newArray = [...(prev[arrayName] || [])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName, itemStructure) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...(prev[arrayName] || []), itemStructure] }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({ ...prev, [arrayName]: prev[arrayName]?.filter((_, i) => i !== index) }));
  };

  const handleCodeChange = (arrayName, codeField, newCode) => {
    setFormData(prev => {
      const newArray = [...(prev[arrayName] || [])];
      const index = newArray.findIndex(c => c.language === activeLanguage);
      if (index > -1) {
        newArray[index] = { ...newArray[index], [codeField]: newCode };
      } else {
        newArray.push({ language: activeLanguage, [codeField]: newCode });
      }
      return { ...prev, [arrayName]: newArray };
    });
  };

  const getActiveCode = (arrayName, codeField) => {
    if (!formData[arrayName]) return '';
    const codeObj = formData[arrayName].find(c => c.language === activeLanguage);
    return codeObj ? codeObj[codeField] : '';
  };

  const filteredProblems = problems?.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return <div className="badge badge-success badge-outline">Easy</div>;
      case 'medium': return <div className="badge badge-warning badge-outline">Medium</div>;
      case 'hard': return <div className="badge badge-error badge-outline">Hard</div>;
      default: return <div className="badge badge-info badge-outline">Unknown</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-300">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Problems Management</h1>
          <div className="form-control w-full md:w-64">
            <label className="input input-bordered flex items-center gap-2">
              <Search className="h-5 w-5" />
              <input type="text" className="grow" placeholder="Search by title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </label>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems?.map((problem) => (
            <div key={problem._id} className="card bg-base-100 shadow-xl border border-base-300 transition-all hover:border-primary">
              <div className="card-body">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="card-title">{problem.title}</h2>
                  {getDifficultyBadge(problem.difficulty)}
                </div>
                <div className="mt-2"><div className="badge badge-neutral">{problem.tags}</div></div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary" onClick={() => handleSelectForEdit(problem._id)} disabled={fetchingId === problem._id}>
                    {fetchingId === problem._id ? <span className="loading loading-spinner loading-xs"></span> : <Edit className="h-4 w-4" />}
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DaisyUI Modal for Editing */}
        <dialog id="edit_problem_modal" className="modal">
          <div className="modal-box w-11/12 max-w-4xl">
            <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>
            <h3 className="font-bold text-2xl mb-4">Edit: {selectedProblem?.title}</h3>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Basic Info */}
              <input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} placeholder="Problem Title" className="input input-bordered w-full" required />
              <textarea name="description" value={formData.description || ''} onChange={handleFormChange} placeholder="Problem Description" className="textarea textarea-bordered w-full h-32" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="difficulty" value={formData.difficulty || 'easy'} onChange={handleFormChange} className="select select-bordered w-full" required>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select name="tags" value={formData.tags || 'array'} onChange={handleFormChange} className="select select-bordered w-full" required>
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>

              {/* --- NEW: Visible Test Cases Section --- */}
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">Visible Test Cases</div>
                <div className="collapse-content space-y-4 p-4">
                  {formData.visibleTestCases?.map((tc, index) => (
                    <div key={index} className="p-4 bg-base-100 rounded-lg space-y-2 border border-base-300">
                      <label className="label"><span className="label-text font-bold">Test Case #{index + 1}</span></label>
                      <textarea value={tc.input} onChange={(e) => handleArrayItemChange('visibleTestCases', index, 'input', e.target.value)} placeholder="Input" className="textarea textarea-bordered w-full" required />
                      <textarea value={tc.output} onChange={(e) => handleArrayItemChange('visibleTestCases', index, 'output', e.target.value)} placeholder="Output" className="textarea textarea-bordered w-full" required />
                      <textarea value={tc.explanation} onChange={(e) => handleArrayItemChange('visibleTestCases', index, 'explanation', e.target.value)} placeholder="Explanation" className="textarea textarea-bordered w-full" required />
                      <button type="button" onClick={() => removeArrayItem('visibleTestCases', index)} className="btn btn-xs btn-ghost text-error"><Trash2 size={14}/> Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('visibleTestCases', { input: '', output: '', explanation: '' })} className="btn btn-sm btn-outline btn-accent w-full"><Plus size={16}/> Add Visible Test Case</button>
                </div>
              </div>

              {/* --- NEW: Hidden Test Cases Section --- */}
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">Hidden Test Cases</div>
                <div className="collapse-content space-y-4 p-4">
                  {formData.hiddenTestCases?.map((tc, index) => (
                    <div key={index} className="p-4 bg-base-100 rounded-lg space-y-2 border border-base-300">
                      <label className="label"><span className="label-text font-bold">Test Case #{index + 1}</span></label>
                      <textarea value={tc.input} onChange={(e) => handleArrayItemChange('hiddenTestCases', index, 'input', e.target.value)} placeholder="Input" className="textarea textarea-bordered w-full" required />
                      <textarea value={tc.output} onChange={(e) => handleArrayItemChange('hiddenTestCases', index, 'output', e.target.value)} placeholder="Output" className="textarea textarea-bordered w-full" required />
                      <button type="button" onClick={() => removeArrayItem('hiddenTestCases', index)} className="btn btn-xs btn-ghost text-error"><Trash2 size={14}/> Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('hiddenTestCases', { input: '', output: '' })} className="btn btn-sm btn-outline btn-accent w-full"><Plus size={16}/> Add Hidden Test Case</button>
                </div>
              </div>

              {/* Language-aware code sections */}
              <div className="space-y-2 p-4 bg-base-200 rounded-box">
                <h3 className="text-xl font-medium">Code & Solutions</h3>
                <div role="tablist" className="tabs tabs-boxed">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <a key={lang} role="tab" className={`tab ${activeLanguage === lang ? 'tab-active' : ''}`} onClick={() => setActiveLanguage(lang)}>{lang}</a>
                  ))}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Starter Code for <span className="font-bold">{activeLanguage}</span></span></label>
                  <textarea value={getActiveCode('starterCode', 'initialCode')} onChange={(e) => handleCodeChange('starterCode', 'initialCode', e.target.value)} placeholder={`// ${activeLanguage} starter code`} className="textarea textarea-bordered w-full h-40 font-mono" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Reference Solution for <span className="font-bold">{activeLanguage}</span></span></label>
                  <textarea value={getActiveCode('referenceSolution', 'completeCode')} onChange={(e) => handleCodeChange('referenceSolution', 'completeCode', e.target.value)} placeholder={`// ${activeLanguage} complete solution`} className="textarea textarea-bordered w-full h-40 font-mono" />
                </div>
              </div>

              {apiError && <div role="alert" className="alert alert-error"><AlertTriangle /><span>{apiError}</span></div>}
              <div className="modal-action">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting && <span className="loading loading-spinner"></span>}
                  {isSubmitting ? 'Updating...' : 'Update Problem'}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default AdminProblems;