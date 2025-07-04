// import { useEffect, useState } from 'react';
// import { Edit, Search, X, Loader2, Code, AlertTriangle, Plus, Trash2 } from 'lucide-react';
// import { toast } from 'react-toastify';
// import axiosClient from '../utils/axiosClient';
// import { useNavigate } from 'react-router';
// import LoadingSpinner from './ui/LoadingSpinner';
// import Editor from '@monaco-editor/react'; 


// const SUPPORTED_LANGUAGES = ['JavaScript', 'Java', 'C++'];

// const MONACO_LANGUAGE_MAP = {
//   'JavaScript': 'javascript',
//   'Java': 'java',
//   'C++': 'cpp',
// };

// const AdminProblems = () => {
//   const navigate = useNavigate();
//   const [problems, setProblems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProblem, setSelectedProblem] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [fetchingId, setFetchingId] = useState(null);
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

//   // In your frontend AdminProblems.jsx
// const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!selectedProblem) return;
//     setIsSubmitting(true);
//     setApiError(null);
//     try {
//       const response = await axiosClient.put(`/problem/update/${selectedProblem._id}`, formData);
      
//       const updatedProblem = response.data; 

//       setProblems(prevProblems => 
//         prevProblems.map(p => 
//           p._id === selectedProblem._id ? updatedProblem : p
//         )
//       );

//       toast.success('Problem updated successfully!');
//       document.getElementById('edit_problem_modal').close();
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || 'Failed to update problem';
//       setApiError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setIsSubmitting(false);
//     }
// };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleArrayItemChange = (arrayName, index, field, value) => {
//     setFormData(prev => {
//       const newArray = [...(prev[arrayName] || [])];
//       newArray[index] = { ...newArray[index], [field]: value };
//       return { ...prev, [arrayName]: newArray };
//     });
//   };

//   const addArrayItem = (arrayName, itemStructure) => {
//     setFormData(prev => ({ ...prev, [arrayName]: [...(prev[arrayName] || []), itemStructure] }));
//   };

//   const removeArrayItem = (arrayName, index) => {
//     setFormData(prev => ({ ...prev, [arrayName]: prev[arrayName]?.filter((_, i) => i !== index) }));
//   };

//   // The 'onChange' for Monaco Editor provides the value directly.
//   const handleCodeChange = (arrayName, codeField, newCode) => {
//     setFormData(prev => {
//       const newArray = [...(prev[arrayName] || [])];
//       const index = newArray.findIndex(c => c.language === activeLanguage);
//       if (index > -1) {
//         newArray[index] = { ...newArray[index], [codeField]: newCode };
//       } else {
//         newArray.push({ language: activeLanguage, [codeField]: newCode });
//       }
//       return { ...prev, [arrayName]: newArray };
//     });
//   };

//   const getActiveCode = (arrayName, codeField) => {
//     if (!formData[arrayName]) return '';
//     const codeObj = formData[arrayName].find(c => c.language === activeLanguage);
//     return codeObj ? codeObj[codeField] : '';
//   };

//   const filteredProblems = problems?.filter(problem =>
//     problem.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getDifficultyBadge = (difficulty) => {
//     switch (difficulty?.toLowerCase()) {
//       case 'easy': return <div className="badge badge-success badge-outline">Easy</div>;
//       case 'medium': return <div className="badge badge-warning badge-outline">Medium</div>;
//       case 'hard': return <div className="badge badge-error badge-outline">Hard</div>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-900">
//         <LoadingSpinner size="lg"></LoadingSpinner>
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
//           <button onClick={() => navigate('/admin')} className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white">
//             Back to Admin
//           </button>
//         </div>

//         {/* Problems Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProblems?.map((problem) => (
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
//               {/* ... (Basic Info and Test Case sections remain the same) ... */}
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

//               {/* Visible Test Cases Section */}
//               <div className="collapse collapse-arrow bg-base-200">
//                 <input type="checkbox" />
//                 <div className="collapse-title text-xl font-medium">Visible Test Cases</div>
//                 <div className="collapse-content space-y-4 p-4">
//                   {formData.visibleTestCases?.map((tc, index) => (
//                     <div key={index} className="p-4 bg-base-100 rounded-lg space-y-2 border border-base-300">
//                       <label className="label"><span className="label-text font-bold">Test Case #{index + 1}</span></label>
//                       <textarea value={tc.input} onChange={(e) => handleArrayItemChange('visibleTestCases', index, 'input', e.target.value)} placeholder="Input" className="textarea textarea-bordered w-full" required />
//                       <textarea value={tc.output} onChange={(e) => handleArrayItemChange('visibleTestCases', index, 'output', e.target.value)} placeholder="Output" className="textarea textarea-bordered w-full" required />
//                       <textarea value={tc.explanation} onChange={(e) => handleArrayItemChange('visibleTestCases', index, 'explanation', e.target.value)} placeholder="Explanation" className="textarea textarea-bordered w-full" required />
//                       <button type="button" onClick={() => removeArrayItem('visibleTestCases', index)} className="btn btn-xs btn-ghost text-error"><Trash2 size={14}/> Remove</button>
//                     </div>
//                   ))}
//                   <button type="button" onClick={() => addArrayItem('visibleTestCases', { input: '', output: '', explanation: '' })} className="btn btn-sm btn-outline btn-accent w-full"><Plus size={16}/> Add Visible Test Case</button>
//                 </div>
//               </div>

//               {/* Hidden Test Cases Section */}
//               <div className="collapse collapse-arrow bg-base-200">
//                 <input type="checkbox" />
//                 <div className="collapse-title text-xl font-medium">Hidden Test Cases</div>
//                 <div className="collapse-content space-y-4 p-4">
//                   {formData.hiddenTestCases?.map((tc, index) => (
//                     <div key={index} className="p-4 bg-base-100 rounded-lg space-y-2 border border-base-300">
//                       <label className="label"><span className="label-text font-bold">Test Case #{index + 1}</span></label>
//                       <textarea value={tc.input} onChange={(e) => handleArrayItemChange('hiddenTestCases', index, 'input', e.target.value)} placeholder="Input" className="textarea textarea-bordered w-full" required />
//                       <textarea value={tc.output} onChange={(e) => handleArrayItemChange('hiddenTestCases', index, 'output', e.target.value)} placeholder="Output" className="textarea textarea-bordered w-full" required />
//                       <button type="button" onClick={() => removeArrayItem('hiddenTestCases', index)} className="btn btn-xs btn-ghost text-error"><Trash2 size={14}/> Remove</button>
//                     </div>
//                   ))}
//                   <button type="button" onClick={() => addArrayItem('hiddenTestCases', { input: '', output: '' })} className="btn btn-sm btn-outline btn-accent w-full"><Plus size={16}/> Add Hidden Test Case</button>
//                 </div>
//               </div>

//               {/* <-- 2. MONACO EDITOR INTEGRATION --> */}
//               <div className="space-y-2 p-4 bg-base-200 rounded-box">
//                 <h3 className="text-xl font-medium">Code & Solutions</h3>
//                 <div role="tablist" className="tabs tabs-boxed">
//                   {SUPPORTED_LANGUAGES.map(lang => (
//                     <a key={lang} role="tab" className={`tab ${activeLanguage === lang ? 'tab-active' : ''}`} onClick={() => setActiveLanguage(lang)}>{lang}</a>
//                   ))}
//                 </div>

//                 {/* Starter Code Editor */}
//                 <div className="form-control border border-base-300 rounded-md p-2">
//                   <label className="label"><span className="label-text">Starter Code for <span className="font-bold">{activeLanguage}</span></span></label>
//                   <Editor
//                     height="16rem"
//                     language={MONACO_LANGUAGE_MAP[activeLanguage]}
//                     theme="vs-dark"
//                     value={getActiveCode('starterCode', 'initialCode')}
//                     onChange={(newValue) => handleCodeChange('starterCode', 'initialCode', newValue)}
//                     options={{ minimap: { enabled: false }, scrollbar: { vertical: 'auto' } }}
//                   />
//                 </div>

//                 {/* Reference Solution Editor */}
//                 <div className="form-control border border-base-300 rounded-md p-2">
//                   <label className="label"><span className="label-text">Reference Solution for <span className="font-bold">{activeLanguage}</span></span></label>
//                    <Editor
//                     height="16rem"
//                     language={MONACO_LANGUAGE_MAP[activeLanguage]}
//                     theme="vs-dark"
//                     value={getActiveCode('referenceSolution', 'completeCode')}
//                     onChange={(newValue) => handleCodeChange('referenceSolution', 'completeCode', newValue)}
//                     options={{ minimap: { enabled: false }, scrollbar: { vertical: 'auto' } }}
//                   />
//                 </div>
//               </div>
//               {/* <-- END EDITOR INTEGRATION --> */}

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
import { useNavigate } from 'react-router';
import LoadingSpinner from './ui/LoadingSpinner';
import Editor from '@monaco-editor/react'; 


const SUPPORTED_LANGUAGES = ['JavaScript', 'Java', 'C++'];

const MONACO_LANGUAGE_MAP = {
  'JavaScript': 'javascript',
  'Java': 'java',
  'C++': 'cpp',
};

const AdminProblems = () => {
  const navigate = useNavigate();
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
      const response = await axiosClient.get(`/problem/admin/problemById/${problemId}`);
      const problemDetails = response.data;
      
      setActiveLanguage(SUPPORTED_LANGUAGES[0]);
      setSelectedProblem(problemDetails);
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
      
      const updatedProblem = response.data; 

      setProblems(prevProblems => 
        prevProblems.map(p => 
          p._id === selectedProblem._id ? updatedProblem : p
        )
      );

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
      default: return <div className="badge badge-ghost">Unknown</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <LoadingSpinner size="lg"></LoadingSpinner>
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
          <button onClick={() => navigate('/admin')} className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white">
            Back to Admin
          </button>
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

              {/* Visible Test Cases Section */}
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
              {/* --- END: Hidden Test Cases Section --- */}

              {/* Code & Solutions Section */}
              <div className="space-y-2 p-4 bg-base-200 rounded-box">
                <h3 className="text-xl font-medium">Code & Solutions</h3>
                <div role="tablist" className="tabs tabs-boxed">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <a key={lang} role="tab" className={`tab ${activeLanguage === lang ? 'tab-active' : ''}`} onClick={() => setActiveLanguage(lang)}>{lang}</a>
                  ))}
                </div>

                {/* Starter Code Editor */}
                <div className="form-control border border-base-300 rounded-md p-2">
                  <label className="label"><span className="label-text">Starter Code for <span className="font-bold">{activeLanguage}</span></span></label>
                  <Editor
                    height="16rem"
                    language={MONACO_LANGUAGE_MAP[activeLanguage]}
                    theme="vs-dark"
                    value={getActiveCode('starterCode', 'initialCode')}
                    onChange={(newValue) => handleCodeChange('starterCode', 'initialCode', newValue)}
                    options={{ minimap: { enabled: false }, scrollbar: { vertical: 'auto' } }}
                  />
                </div>

                {/* Reference Solution Editor */}
                <div className="form-control border border-base-300 rounded-md p-2">
                  <label className="label"><span className="label-text">Reference Solution for <span className="font-bold">{activeLanguage}</span></span></label>
                   <Editor
                    height="16rem"
                    language={MONACO_LANGUAGE_MAP[activeLanguage]}
                    theme="vs-dark"
                    value={getActiveCode('referenceSolution', 'completeCode')}
                    onChange={(newValue) => handleCodeChange('referenceSolution', 'completeCode', newValue)}
                    options={{ minimap: { enabled: false }, scrollbar: { vertical: 'auto' } }}
                  />
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