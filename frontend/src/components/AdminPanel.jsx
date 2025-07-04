// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import axiosClient from '../utils/axiosClient';
// import { useNavigate } from 'react-router';

// // Zod schema matching the problem schema
// const problemSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   difficulty: z.enum(['easy', 'medium', 'hard']),
//   tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
//   visibleTestCases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required'),
//       explanation: z.string().min(1, 'Explanation is required')
//     })
//   ).min(1, 'At least one visible test case required'),
//   hiddenTestCases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required')
//     })
//   ).min(1, 'At least one hidden test case required'),
//   startCode: z.array(
//     z.object({
//       language: z.enum(['C++', 'Java', 'JavaScript']),
//       initialCode: z.string().min(1, 'Initial code is required')
//     })
//   ).length(3, 'All three languages required'),
//   referenceSolution: z.array(
//     z.object({
//       language: z.enum(['C++', 'Java', 'JavaScript']),
//       completeCode: z.string().min(1, 'Complete code is required')
//     })
//   ).length(3, 'All three languages required')
// });

// function AdminPanel() {
//   const navigate = useNavigate();
//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({
//     resolver: zodResolver(problemSchema),
//     defaultValues: {
//       startCode: [
//         { language: 'C++', initialCode: '' },
//         { language: 'Java', initialCode: '' },
//         { language: 'JavaScript', initialCode: '' }
//       ],
//       referenceSolution: [
//         { language: 'C++', completeCode: '' },
//         { language: 'Java', completeCode: '' },
//         { language: 'JavaScript', completeCode: '' }
//       ]
//     }
//   });

//   const {
//     fields: visibleFields,
//     append: appendVisible,
//     remove: removeVisible
//   } = useFieldArray({
//     control,
//     name: 'visibleTestCases'
//   });

//   const {
//     fields: hiddenFields,
//     append: appendHidden,
//     remove: removeHidden
//   } = useFieldArray({
//     control,
//     name: 'hiddenTestCases'
//   });

//   const onSubmit = async (data) => {
//     try {
//       await axiosClient.post('/problem/create', data);
//       alert('Problem created successfully!');
//       navigate('/');
//     } catch (error) {
//       alert(`Error: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>
      
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Basic Information */}
//         <div className="card bg-base-100 shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
//           <div className="space-y-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Title</span>
//               </label>
//               <input
//                 {...register('title')}
//                 className={`input input-bordered ${errors.title && 'input-error'}`}
//               />
//               {errors.title && (
//                 <span className="text-error">{errors.title.message}</span>
//               )}
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Description</span>
//               </label>
//               <textarea
//                 {...register('description')}
//                 className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`}
//               />
//               {errors.description && (
//                 <span className="text-error">{errors.description.message}</span>
//               )}
//             </div>

//             <div className="flex gap-4">
//               <div className="form-control w-1/2">
//                 <label className="label">
//                   <span className="label-text">Difficulty</span>
//                 </label>
//                 <select
//                   {...register('difficulty')}
//                   className={`select select-bordered ${errors.difficulty && 'select-error'}`}
//                 >
//                   <option value="easy">Easy</option>
//                   <option value="medium">Medium</option>
//                   <option value="hard">Hard</option>
//                 </select>
//               </div>

//               <div className="form-control w-1/2">
//                 <label className="label">
//                   <span className="label-text">Tag</span>
//                 </label>
//                 <select
//                   {...register('tags')}
//                   className={`select select-bordered ${errors.tags && 'select-error'}`}
//                 >
//                   <option value="array">Array</option>
//                   <option value="linkedList">Linked List</option>
//                   <option value="graph">Graph</option>
//                   <option value="dp">DP</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Test Cases */}
//         <div className="card bg-base-100 shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
          
//           {/* Visible Test Cases */}
//           <div className="space-y-4 mb-6">
//             <div className="flex justify-between items-center">
//               <h3 className="font-medium">Visible Test Cases</h3>
//               <button
//                 type="button"
//                 onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
//                 className="btn btn-sm btn-primary"
//               >
//                 Add Visible Case
//               </button>
//             </div>
            
//             {visibleFields.map((field, index) => (
//               <div key={field.id} className="border p-4 rounded-lg space-y-2">
//                 <div className="flex justify-end">
//                   <button
//                     type="button"
//                     onClick={() => removeVisible(index)}
//                     className="btn btn-xs btn-error"
//                   >
//                     Remove
//                   </button>
//                 </div>
                
//                 <input
//                   {...register(`visibleTestCases.${index}.input`)}
//                   placeholder="Input"
//                   className="input input-bordered w-full"
//                 />
                
//                 <input
//                   {...register(`visibleTestCases.${index}.output`)}
//                   placeholder="Output"
//                   className="input input-bordered w-full"
//                 />
                
//                 <textarea
//                   {...register(`visibleTestCases.${index}.explanation`)}
//                   placeholder="Explanation"
//                   className="textarea textarea-bordered w-full"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Hidden Test Cases */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="font-medium">Hidden Test Cases</h3>
//               <button
//                 type="button"
//                 onClick={() => appendHidden({ input: '', output: '' })}
//                 className="btn btn-sm btn-primary"
//               >
//                 Add Hidden Case
//               </button>
//             </div>
            
//             {hiddenFields.map((field, index) => (
//               <div key={field.id} className="border p-4 rounded-lg space-y-2">
//                 <div className="flex justify-end">
//                   <button
//                     type="button"
//                     onClick={() => removeHidden(index)}
//                     className="btn btn-xs btn-error"
//                   >
//                     Remove
//                   </button>
//                 </div>
                
//                 <input
//                   {...register(`hiddenTestCases.${index}.input`)}
//                   placeholder="Input"
//                   className="input input-bordered w-full"
//                 />
                
//                 <input
//                   {...register(`hiddenTestCases.${index}.output`)}
//                   placeholder="Output"
//                   className="input input-bordered w-full"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Code Templates */}
//         <div className="card bg-base-100 shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
          
//           <div className="space-y-6">
//             {[0, 1, 2].map((index) => (
//               <div key={index} className="space-y-2">
//                 <h3 className="font-medium">
//                   {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
//                 </h3>
                
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Initial Code</span>
//                   </label>
//                   <pre className="bg-base-300 p-4 rounded-lg">
//                     <textarea
//                       {...register(`startCode.${index}.initialCode`)}
//                       className="w-full bg-transparent font-mono"
//                       rows={6}
//                     />
//                   </pre>
//                 </div>
                
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Reference Solution</span>
//                   </label>
//                   <pre className="bg-base-300 p-4 rounded-lg">
//                     <textarea
//                       {...register(`referenceSolution.${index}.completeCode`)}
//                       className="w-full bg-transparent font-mono"
//                       rows={6}
//                     />
//                   </pre>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <button type="submit" className="btn btn-primary w-full">
//           Create Problem
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AdminPanel;



import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate,NavLink } from 'react-router';
import { Home } from 'lucide-react';
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
     const response= await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      console.log(response);
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    // <div className="container mx-auto px-4 py-8 bg-base-100 min-h-screen" data-theme="dark">
    //   <div className="max-w-5xl mx-auto">
    //     <h1 className="text-3xl font-bold mb-8 text-primary">Create New Problem</h1>
        
    //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
    //       {/* Basic Information */}
    //       <div className="card bg-base-200 shadow-lg">
    //         <div className="card-body p-6">
    //           <h2 className="text-xl font-semibold mb-6 text-secondary pb-2 border-b border-base-300">
    //             Basic Information
    //           </h2>
    //           <div className="space-y-6">
    //             <div className="form-control">
    //               <label className="label">
    //                 <span className="label-text text-base-content font-medium">Title</span>
    //               </label>
    //               <input
    //                 {...register('title')}
    //                 className={`input input-bordered w-full ${errors.title ? 'input-error' : 'bg-base-300'}`}
    //               />
    //               {errors.title && (
    //                 <span className="text-error text-sm mt-1">{errors.title.message}</span>
    //               )}
    //             </div>

    //             <div className="form-control">
    //               <label className="label">
    //                 <span className="label-text text-base-content font-medium">Description</span>
    //               </label>
    //               <textarea
    //                 {...register('description')}
    //                 className={`textarea textarea-bordered w-full h-40 ${errors.description ? 'textarea-error' : 'bg-base-300'}`}
    //               />
    //               {errors.description && (
    //                 <span className="text-error text-sm mt-1">{errors.description.message}</span>
    //               )}
    //             </div>

    //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //               <div className="form-control">
    //                 <label className="label">
    //                   <span className="label-text text-base-content font-medium">Difficulty</span>
    //                 </label>
    //                 <select
    //                   {...register('difficulty')}
    //                   className={`select select-bordered w-full ${errors.difficulty ? 'select-error' : 'bg-base-300'}`}
    //                 >
    //                   <option value="easy">Easy</option>
    //                   <option value="medium">Medium</option>
    //                   <option value="hard">Hard</option>
    //                 </select>
    //               </div>

    //               <div className="form-control">
    //                 <label className="label">
    //                   <span className="label-text text-base-content font-medium">Tag</span>
    //                 </label>
    //                 <select
    //                   {...register('tags')}
    //                   className={`select select-bordered w-full ${errors.tags ? 'select-error' : 'bg-base-300'}`}
    //                 >
    //                   <option value="array">Array</option>
    //                   <option value="linkedList">Linked List</option>
    //                   <option value="graph">Graph</option>
    //                   <option value="dp">DP</option>
    //                 </select>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Test Cases */}
    //       <div className="card bg-base-200 shadow-lg">
    //         <div className="card-body p-6">
    //           <h2 className="text-xl font-semibold mb-6 text-secondary pb-2 border-b border-base-300">
    //             Test Cases
    //           </h2>
              
    //           {/* Visible Test Cases */}
    //           <div className="mb-10">
    //             <div className="flex justify-between items-center mb-4">
    //               <h3 className="font-medium text-lg text-base-content">Visible Test Cases</h3>
    //               <button
    //                 type="button"
    //                 onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
    //                 className="btn btn-sm btn-primary"
    //               >
    //                 Add Visible Case
    //               </button>
    //             </div>
                
    //             <div className="space-y-4">
    //               {visibleFields.map((field, index) => (
    //                 <div key={field.id} className="border border-base-300 p-5 rounded-lg bg-base-300">
    //                   <div className="flex justify-between items-center mb-3">
    //                     <h4 className="font-medium text-base-content">Test Case {index + 1}</h4>
    //                     <button
    //                       type="button"
    //                       onClick={() => removeVisible(index)}
    //                       className="btn btn-xs btn-error"
    //                     >
    //                       Remove
    //                     </button>
    //                   </div>
                      
    //                   <div className="space-y-3">
    //                     <div className="form-control">
    //                       <label className="label py-1">
    //                         <span className="label-text text-base-content">Input</span>
    //                       </label>
    //                       <input
    //                         {...register(`visibleTestCases.${index}.input`)}
    //                         className="input input-bordered w-full bg-base-200"
    //                       />
    //                     </div>
                        
    //                     <div className="form-control">
    //                       <label className="label py-1">
    //                         <span className="label-text text-base-content">Output</span>
    //                       </label>
    //                       <input
    //                         {...register(`visibleTestCases.${index}.output`)}
    //                         className="input input-bordered w-full bg-base-200"
    //                       />
    //                     </div>
                        
    //                     <div className="form-control">
    //                       <label className="label py-1">
    //                         <span className="label-text text-base-content">Explanation</span>
    //                       </label>
    //                       <textarea
    //                         {...register(`visibleTestCases.${index}.explanation`)}
    //                         className="textarea textarea-bordered w-full bg-base-200"
    //                         rows={3}
    //                       />
    //                     </div>
    //                   </div>
    //                 </div>
    //               ))}
    //             </div>
    //           </div>

    //           {/* Hidden Test Cases */}
    //           <div>
    //             <div className="flex justify-between items-center mb-4">
    //               <h3 className="font-medium text-lg text-base-content">Hidden Test Cases</h3>
    //               <button
    //                 type="button"
    //                 onClick={() => appendHidden({ input: '', output: '' })}
    //                 className="btn btn-sm btn-primary"
    //               >
    //                 Add Hidden Case
    //               </button>
    //             </div>
                
    //             <div className="space-y-4">
    //               {hiddenFields.map((field, index) => (
    //                 <div key={field.id} className="border border-base-300 p-5 rounded-lg bg-base-300">
    //                   <div className="flex justify-between items-center mb-3">
    //                     <h4 className="font-medium text-base-content">Test Case {index + 1}</h4>
    //                     <button
    //                       type="button"
    //                       onClick={() => removeHidden(index)}
    //                       className="btn btn-xs btn-error"
    //                     >
    //                       Remove
    //                     </button>
    //                   </div>
                      
    //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //                     <div className="form-control">
    //                       <label className="label py-1">
    //                         <span className="label-text text-base-content">Input</span>
    //                       </label>
    //                       <input
    //                         {...register(`hiddenTestCases.${index}.input`)}
    //                         className="input input-bordered w-full bg-base-200"
    //                       />
    //                     </div>
                        
    //                     <div className="form-control">
    //                       <label className="label py-1">
    //                         <span className="label-text text-base-content">Output</span>
    //                       </label>
    //                       <input
    //                         {...register(`hiddenTestCases.${index}.output`)}
    //                         className="input input-bordered w-full bg-base-200"
    //                       />
    //                     </div>
    //                   </div>
    //                 </div>
    //               ))}
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Code Templates */}
    //       <div className="card bg-base-200 shadow-lg">
    //         <div className="card-body p-6">
    //           <h2 className="text-xl font-semibold mb-6 text-secondary pb-2 border-b border-base-300">
    //             Code Templates
    //           </h2>
              
    //           <div className="space-y-8">
    //             {[0, 1, 2].map((index) => (
    //               <div key={index} className="space-y-4">
    //                 <h3 className="font-medium text-lg text-base-content">
    //                   {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'} Templates
    //                 </h3>
                    
    //                 <div className="grid grid-cols-1 gap-6">
    //                   <div className="form-control">
    //                     <label className="label">
    //                       <span className="label-text text-base-content font-medium">Initial Code</span>
    //                     </label>
    //                     <div className="border border-base-300 rounded-lg bg-base-300 p-3">
    //                       <textarea
    //                         {...register(`startCode.${index}.initialCode`)}
    //                         className="w-full bg-base-300 font-mono text-base-content text-sm h-40 p-2 focus:outline-none"
    //                         spellCheck="false"
    //                       />
    //                     </div>
    //                   </div>
                      
    //                   <div className="form-control">
    //                     <label className="label">
    //                       <span className="label-text text-base-content font-medium">Reference Solution</span>
    //                     </label>
    //                     <div className="border border-base-300 rounded-lg bg-base-300 p-3">
    //                       <textarea
    //                         {...register(`referenceSolution.${index}.completeCode`)}
    //                         className="w-full bg-base-300 font-mono text-base-content text-sm h-40 p-2 focus:outline-none"
    //                         spellCheck="false"
    //                       />
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       </div>

    //       <div className="flex justify-end">
    //         <button type="submit" className="btn btn-primary px-8">
    //           Create Problem
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>

    <div className="container mx-auto px-4 py-10 bg-base-100 min-h-screen" data-theme="dark">
      <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-primary text-center flex-1">Create New Problem</h1>
        <NavLink 
        to="/admin" 
        className="btn btn-outline btn-primary flex items-center gap-2 ml-6"
        >
        <Home size={20} />
        Go to Admin
        </NavLink>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Basic Information */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-8">
              <h2 className="text-xl font-bold mb-8 text-secondary pb-3 border-b-2 border-primary">
                Basic Information
              </h2>
              <div className="space-y-7">
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text text-lg text-base-content font-semibold">Title</span>
                  </label>
                  <input
                    {...register('title')}
                    className={`input input-bordered w-full text-lg ${errors.title ? 'input-error' : 'bg-base-300'}`}
                    placeholder="Problem title"
                  />
                  {errors.title && (
                    <span className="text-error text-sm mt-2">{errors.title.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text text-lg text-base-content font-semibold">Description</span>
                  </label>
                  <textarea
                    {...register('description')}
                    className={`textarea textarea-bordered w-full min-h-[180px] text-base ${errors.description ? 'textarea-error' : 'bg-base-300'}`}
                    placeholder="Detailed problem description"
                  />
                  {errors.description && (
                    <span className="text-error text-sm mt-2">{errors.description.message}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="form-control">
                    <label className="label pb-2">
                      <span className="label-text text-lg text-base-content font-semibold">Difficulty</span>
                    </label>
                    <select
                      {...register('difficulty')}
                      className={`select select-bordered w-full text-lg ${errors.difficulty ? 'select-error' : 'bg-base-300'}`}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label pb-2">
                      <span className="label-text text-lg text-base-content font-semibold">Tag</span>
                    </label>
                    <select
                      {...register('tags')}
                      className={`select select-bordered w-full text-lg ${errors.tags ? 'select-error' : 'bg-base-300'}`}
                    >
                      <option value="array">Array</option>
                      <option value="linkedList">Linked List</option>
                      <option value="graph">Graph</option>
                      <option value="dp">DP</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-8">
              <h2 className="text-xl font-bold mb-8 text-secondary pb-3 border-b-2 border-primary">
                Test Cases
              </h2>
              
              {/* Visible Test Cases */}
              <div className="mb-12">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-base-content mb-1">Visible Test Cases</h3>
                    {errors.visibleTestCases && (
                      <span className="text-error text-sm">{errors.visibleTestCases.message}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                    className="btn btn-primary btn-md"
                  >
                    + Add Visible Case
                  </button>
                </div>
                
                <div className="space-y-7">
                  {visibleFields.map((field, index) => (
                    <div key={field.id} className="border-2 border-base-300 p-7 rounded-xl bg-base-300">
                      <div className="flex justify-between items-center mb-5">
                        <h4 className="font-bold text-base-content text-md">Test Case #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeVisible(index)}
                          className="btn btn-error btn-sm"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="space-y-5">
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text text-base-content font-medium">Input</span>
                          </label>
                          <textarea
                            {...register(`visibleTestCases.${index}.input`)}
                            className="textarea textarea-bordered w-full bg-base-200 min-h-[100px] font-mono text-sm p-4"
                            placeholder="Input values (e.g., [1,2,3])"
                          />
                          {errors.visibleTestCases?.[index]?.input && (
                            <span className="text-error text-sm mt-2">
                              {errors.visibleTestCases[index].input.message}
                            </span>
                          )}
                        </div>
                        
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text text-base-content font-medium">Output</span>
                          </label>
                          <textarea
                            {...register(`visibleTestCases.${index}.output`)}
                            className="textarea textarea-bordered w-full bg-base-200 min-h-[100px] font-mono text-sm p-4"
                            placeholder="Expected output (e.g., 6)"
                          />
                          {errors.visibleTestCases?.[index]?.output && (
                            <span className="text-error text-sm mt-2">
                              {errors.visibleTestCases[index].output.message}
                            </span>
                          )}
                        </div>
                        
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text text-base-content font-medium">Explanation</span>
                          </label>
                          <textarea
                            {...register(`visibleTestCases.${index}.explanation`)}
                            className="textarea textarea-bordered w-full bg-base-200 min-h-[100px] p-4"
                            placeholder="Explanation of test case"
                          />
                          {errors.visibleTestCases?.[index]?.explanation && (
                            <span className="text-error text-sm mt-2">
                              {errors.visibleTestCases[index].explanation.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden Test Cases */}
              <div>
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-base-content mb-1">Hidden Test Cases</h3>
                    {errors.hiddenTestCases && (
                      <span className="text-error text-sm">{errors.hiddenTestCases.message}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => appendHidden({ input: '', output: '' })}
                    className="btn btn-primary btn-md"
                  >
                    + Add Hidden Case
                  </button>
                </div>
                
                <div className="space-y-7">
                  {hiddenFields.map((field, index) => (
                    <div key={field.id} className="border-2 border-base-300 p-7 rounded-xl bg-base-300">
                      <div className="flex justify-between items-center mb-5">
                        <h4 className="font-bold text-base-content text-md">Test Case #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeHidden(index)}
                          className="btn btn-error btn-sm"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text text-base-content font-medium">Input</span>
                          </label>
                          <textarea
                            {...register(`hiddenTestCases.${index}.input`)}
                            className="textarea textarea-bordered w-full bg-base-200 min-h-[100px] font-mono text-sm p-4"
                            placeholder="Input values"
                          />
                          {errors.hiddenTestCases?.[index]?.input && (
                            <span className="text-error text-sm mt-2">
                              {errors.hiddenTestCases[index].input.message}
                            </span>
                          )}
                        </div>
                        
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text text-base-content font-medium">Output</span>
                          </label>
                          <textarea
                            {...register(`hiddenTestCases.${index}.output`)}
                            className="textarea textarea-bordered w-full bg-base-200 min-h-[100px] font-mono text-sm p-4"
                            placeholder="Expected output"
                          />
                          {errors.hiddenTestCases?.[index]?.output && (
                            <span className="text-error text-sm mt-2">
                              {errors.hiddenTestCases[index].output.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Code Templates */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-8">
              <h2 className="text-xl font-bold mb-8 text-secondary pb-3 border-b-2 border-primary">
                Code Templates
              </h2>
              
              <div className="space-y-12">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="space-y-8">
                    <h3 className="font-bold text-lg text-base-content pb-2 border-b border-base-300">
                      {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'} Templates
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-10">
                      <div className="form-control">
                        <div className="flex justify-between items-center mb-3">
                          <label className="label p-0">
                            <span className="label-text text-lg text-base-content font-semibold">Initial Code</span>
                          </label>
                          {errors.startCode?.[index]?.initialCode && (
                            <span className="text-error text-sm">
                              {errors.startCode[index].initialCode.message}
                            </span>
                          )}
                        </div>
                        <div className="border-2 border-base-300 rounded-xl bg-base-300 p-5">
                          <textarea
                            {...register(`startCode.${index}.initialCode`)}
                            className="w-full bg-base-300 font-mono text-base-content text-base min-h-[200px] p-4 focus:outline-none"
                            spellCheck="false"
                            placeholder={`${index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'} starter code template`}
                          />
                        </div>
                      </div>
                      
                      <div className="form-control">
                        <div className="flex justify-between items-center mb-3">
                          <label className="label p-0">
                            <span className="label-text text-lg text-base-content font-semibold">Reference Solution</span>
                          </label>
                          {errors.referenceSolution?.[index]?.completeCode && (
                            <span className="text-error text-sm">
                              {errors.referenceSolution[index].completeCode.message}
                            </span>
                          )}
                        </div>
                        <div className="border-2 border-base-300 rounded-xl bg-base-300 p-5">
                          <textarea
                            {...register(`referenceSolution.${index}.completeCode`)}
                            className="w-full bg-base-300 font-mono text-base-content text-base min-h-[200px] p-4 focus:outline-none"
                            spellCheck="false"
                            placeholder={`Complete ${index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'} solution`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button type="submit" className="btn btn-primary px-12 py-4 text-lg font-bold w-full max-w-xs">
              Create Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;