// // src/components/contests/ContestEditor.jsx
// import { useState, useEffect } from 'react';
// import { runContestCode, submitContestSolution } from '../../services/contestService';
// import { useSelector } from 'react-redux';
// import AceEditor from 'react-ace';
// import 'ace-builds/src-noconflict/mode-javascript';
// import 'ace-builds/src-noconflict/mode-python';
// import 'ace-builds/src-noconflict/mode-java';
// import 'ace-builds/src-noconflict/mode-c_cpp';
// import 'ace-builds/src-noconflict/theme-monokai';
// import LoadingSpinner from '../ui/LoadingSpinner';

// const ContestEditor = ({ contest, problem, onProblemChange, problems, contestId }) => {
//   const { user } = useSelector(state => state.auth);
//   const [code, setCode] = useState('');
//   const [language, setLanguage] = useState('javascript');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [runResult, setRunResult] = useState(null);
//   const [finalSubmitResult, setFinalSubmitResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [isSolved, setIsSolved] = useState(false);

//   useEffect(() => {
//     if (problem) {
//       // Try to get saved code from localStorage
//       const savedCode = localStorage.getItem(`contest-${contestId}-problem-${problem._id}-code`);
//       const savedLanguage = localStorage.getItem(`contest-${contestId}-problem-${problem._id}-lang`);
      
//       setCode(savedCode || 
//         (problem.starterCode && problem.starterCode[language]) || 
//         `function solution(input) {\n  // Your code here\n  return input;\n}`
//       );
      
//       if (savedLanguage) setLanguage(savedLanguage);
//       setRunResult(null);
//       setFinalSubmitResult(null);
//       setError(null);
      
//       // Check if problem is already solved
//       if (user && contest && contest.leaderboard) {
//         const userEntry = contest.leaderboard.find(entry => 
//           entry.user._id === user._id
//         );
        
//         if (userEntry && userEntry.problems[problem._id]?.solved) {
//           setIsSolved(true);
//         } else {
//           setIsSolved(false);
//         }
//       }
//     }
//   }, [problem, contest, contestId, user]);

//   const handleRunCode = async () => {
//     if (!problem || !code.trim()) return;
    
//     try {
//       setIsSubmitting(true);
//       setRunResult(null);
//       setError(null);
      
//       // Save code to localStorage
//       localStorage.setItem(`contest-${contestId}-problem-${problem._id}-code`, code);
//       localStorage.setItem(`contest-${contestId}-problem-${problem._id}-lang`, language);
      
//       const result = await runContestCode(
//         contestId,
//         problem._id,
//         code,
//         language
//       );
      
//       setRunResult(result);
//     } catch (error) {
//       console.error('Code execution failed:', error);
//       setError('Failed to execute code. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSubmitCode = async () => {
//     if (!problem || !code.trim()) return;
    
//     try {
//       setIsSubmitting(true);
//       setFinalSubmitResult(null);
//       setError(null);
      
//       // Save code to localStorage
//       localStorage.setItem(`contest-${contestId}-problem-${problem._id}-code`, code);
//       localStorage.setItem(`contest-${contestId}-problem-${problem._id}-lang`, language);
      
//       const result = await submitContestSolution(
//         contestId,
//         problem._id,
//         code,
//         language
//       );
      
//       setFinalSubmitResult(result);
      
//       // If submission is accepted, mark as solved
//       if (result.status === 'accepted') {
//         setIsSolved(true);
//       }
//     } catch (error) {
//       console.error('Submission failed:', error);
//       setError('Failed to submit solution. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     if (!status) return '';
//     switch (status.toLowerCase()) {
//       case 'accepted': return 'bg-green-500/20 text-green-400 border border-green-500/30';
//       case 'wrong answer': return 'bg-red-500/20 text-red-400 border border-red-500/30';
//       case 'time limit exceeded': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
//       case 'runtime error': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
//       case 'error': return 'bg-red-500/20 text-red-400 border border-red-500/30';
//       default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
//     }
//   };

//   const formatExecutionTime = (time) => {
//     if (!time) return 'N/A';
//     return `${time} ms`;
//   };

//   const formatMemoryUsage = (memory) => {
//     if (!memory) return 'N/A';
//     if (memory < 1024) return `${memory} KB`;
//     return `${(memory / 1024).toFixed(2)} MB`;
//   };

//   return (
//     <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Problem Selector */}
//         <div className="md:w-1/3">
//           <div className="bg-gray-800/50 rounded-xl p-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-medium text-white">Select Problem</h3>
//               {isSolved && (
//                 <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
//                   Solved
//                 </span>
//               )}
//             </div>
//             <div className="space-y-2 max-h-96 overflow-y-auto">
//               {problems.map(p => (
//                 <div 
//                   key={p._id}
//                   onClick={() => onProblemChange(p)}
//                   className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                     problem?._id === p._id
//                       ? 'bg-cyan-600/30 border border-cyan-500/50'
//                       : 'bg-gray-700/50 hover:bg-gray-700'
//                   }`}
//                 >
//                   <div className="flex justify-between items-center">
//                     <span className="font-medium">{p.title}</span>
//                     <span className={`text-xs px-2 py-1 rounded-full ${
//                       p.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
//                       p.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
//                       'bg-red-500/20 text-red-400'
//                     }`}>
//                       {p.difficulty}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
        
//         {/* Editor Area */}
//         <div className="md:w-2/3">
//           {problem ? (
//             <div className="space-y-6">
//               <div className="bg-gray-800/50 rounded-xl p-4">
//                 <div className="flex justify-between items-start mb-2">
//                   <h3 className="text-lg font-medium text-white">{problem.title}</h3>
//                   <span className={`text-xs px-2 py-1 rounded-full ${
//                     problem.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
//                     problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
//                     'bg-red-500/20 text-red-400'
//                   }`}>
//                     {problem.difficulty}
//                   </span>
//                 </div>
//                 <p className="text-gray-300">{problem.description}</p>
                
//                 {problem.constraints?.length > 0 && (
//                   <div className="mt-4">
//                     <h4 className="text-gray-400 font-medium mb-2">Constraints:</h4>
//                     <ul className="list-disc list-inside text-gray-400">
//                       {problem.constraints.map((c, i) => (
//                         <li key={i}>{c}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
                
//                 {problem.sampleTestCases?.length > 0 && (
//                   <div className="mt-4">
//                     <h4 className="text-gray-400 font-medium mb-2">Sample Test Cases:</h4>
//                     {problem.sampleTestCases.map((testCase, i) => (
//                       <div key={i} className="bg-gray-900 p-3 rounded-lg mb-3">
//                         <p className="text-gray-300"><span className="text-gray-500">Input:</span> {testCase.input}</p>
//                         <p className="text-gray-300"><span className="text-gray-500">Output:</span> {testCase.output}</p>
//                         {testCase.explanation && (
//                           <p className="text-gray-400 mt-1"><span className="text-gray-500">Explanation:</span> {testCase.explanation}</p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               <div className="bg-gray-800/50 rounded-xl p-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-medium text-white">Code Editor</h3>
//                   <div className="flex items-center gap-2">
//                     <select
//                       value={language}
//                       onChange={(e) => setLanguage(e.target.value)}
//                       className="bg-gray-700 text-white rounded px-3 py-1"
//                     >
//                       <option value="javascript">JavaScript</option>
//                       <option value="python">Python</option>
//                       <option value="java">Java</option>
//                       <option value="cpp">C++</option>
//                     </select>
                    
//                     <button
//                       onClick={() => {
//                         setCode(problem.starterCode?.[language] || '');
//                       }}
//                       className="text-cyan-400 hover:text-cyan-300 text-sm"
//                     >
//                       Reset Code
//                     </button>
//                   </div>
//                 </div>
                
//                 <AceEditor
//                   mode={language}
//                   theme="monokai"
//                   value={code}
//                   onChange={setCode}
//                   name="code-editor"
//                   editorProps={{ $blockScrolling: true }}
//                   height="300px"
//                   width="100%"
//                   fontSize={14}
//                   showPrintMargin={false}
//                   setOptions={{
//                     enableBasicAutocompletion: true,
//                     enableLiveAutocompletion: true,
//                     enableSnippets: true,
//                     showLineNumbers: true,
//                     tabSize: 2,
//                   }}
//                   className="rounded-lg overflow-hidden"
//                 />
                
//                 <div className="mt-4 flex flex-wrap gap-4">
//                   <button
//                     onClick={handleRunCode}
//                     disabled={isSubmitting}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <LoadingSpinner size="sm" className="mr-2" />
//                         Running...
//                       </>
//                     ) : 'Run Code'}
//                   </button>
//                   <button
//                     onClick={handleSubmitCode}
//                     disabled={isSubmitting || isSolved}
//                     className={`${
//                       isSolved 
//                         ? 'bg-green-600 text-white' 
//                         : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black'
//                     } font-bold px-6 py-2 rounded-lg transition-all disabled:opacity-50 flex items-center`}
//                   >
//                     {isSolved ? 'Solved ✓' : isSubmitting ? (
//                       <>
//                         <LoadingSpinner size="sm" className="mr-2" />
//                         Submitting...
//                       </>
//                     ) : 'Submit Solution'}
//                   </button>
//                 </div>
                
//                 {error && (
//                   <div className="mt-4 bg-red-500/20 text-red-400 p-3 rounded-lg">
//                     {error}
//                   </div>
//                 )}
                
//                 {(runResult || finalSubmitResult) && (
//                   <div className="mt-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
//                     <h4 className="text-white font-medium mb-2">
//                       {runResult ? 'Test Results' : 'Submission Result'}
//                     </h4>
                    
//                     {runResult && runResult.results?.map((result, i) => (
//                       <div key={i} className="mb-3 last:mb-0">
//                         <div className="flex justify-between items-center mb-1">
//                           <span className="text-sm text-gray-400">Test Case {i + 1}</span>
//                           <span className={`text-xs px-2 py-1 rounded-full ${
//                             result.status_id === 3 
//                               ? 'bg-green-500/20 text-green-400' 
//                               : 'bg-red-500/20 text-red-400'
//                           }`}>
//                             {result.status_id === 3 ? 'Passed' : 'Failed'}
//                           </span>
//                         </div>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
//                           <div className="bg-gray-900 p-2 rounded">
//                             <div className="text-gray-500">Input</div>
//                             <div className="truncate">{result.input || 'N/A'}</div>
//                           </div>
//                           <div className="bg-gray-900 p-2 rounded">
//                             <div className="text-gray-500">Expected</div>
//                             <div className="truncate">{result.expected || 'N/A'}</div>
//                           </div>
//                           <div className="bg-gray-900 p-2 rounded">
//                             <div className="text-gray-500">Output</div>
//                             <div className="truncate">{result.output || 'N/A'}</div>
//                           </div>
//                         </div>
                        
//                         {result.stderr && (
//                           <div className="mt-2 bg-red-900/30 p-2 rounded text-red-400 text-xs">
//                             <pre>{result.stderr}</pre>
//                           </div>
//                         )}
//                       </div>
//                     ))}
                    
//                     {finalSubmitResult && (
//                       <div className={`${getStatusColor(finalSubmitResult.status)} p-4 rounded-lg`}>
//                         <div className="flex items-center">
//                           <span className="text-xl mr-2">
//                             {finalSubmitResult.status === 'accepted' ? '✓' : '✗'}
//                           </span>
//                           <span className="font-bold">
//                             {finalSubmitResult.status === 'accepted' 
//                               ? 'Accepted!' 
//                               : finalSubmitResult.status || 'Submission Failed'}
//                           </span>
//                         </div>
                        
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
//                           <div>
//                             <div className="text-sm text-gray-400">Test Cases</div>
//                             <div className="font-bold">
//                               {finalSubmitResult.testCasesPassed || 0} / {finalSubmitResult.testCasesTotal || 0}
//                             </div>
//                           </div>
                          
//                           <div>
//                             <div className="text-sm text-gray-400">Time</div>
//                             <div className="font-bold">
//                               {formatExecutionTime(finalSubmitResult.executionTime)}
//                             </div>
//                           </div>
                          
//                           <div>
//                             <div className="text-sm text-gray-400">Memory</div>
//                             <div className="font-bold">
//                               {formatMemoryUsage(finalSubmitResult.memory)}
//                             </div>
//                           </div>
                          
//                           <div>
//                             <div className="text-sm text-gray-400">Score</div>
//                             <div className="font-bold">
//                               {finalSubmitResult.score || 0} pts
//                             </div>
//                           </div>
//                         </div>
                        
//                         {finalSubmitResult.errorMessage && (
//                           <div className="mt-3 bg-black/20 p-3 rounded">
//                             <pre className="text-sm overflow-auto">{finalSubmitResult.errorMessage}</pre>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-12 bg-gray-800/50 rounded-xl">
//               <h3 className="text-xl font-medium text-gray-300">Select a problem to solve</h3>
//               <p className="text-gray-500 mt-2">
//                 Choose a problem from the list to start coding
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContestEditor;


// src/components/contests/ContestEditor.jsx
import { useState, useEffect, useRef } from 'react';
import { runContestCode, submitContestSolution } from '../../services/contestService';
import { useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import LoadingSpinner from '../ui/LoadingSpinner';

const ContestEditor = ({ contest, problem, onProblemChange, problems, contestId }) => {
  const { user } = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [finalSubmitResult, setFinalSubmitResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (problem) {
      // Try to get saved code from localStorage
      const savedCode = localStorage.getItem(`contest-${contestId}-problem-${problem._id}-code`);
      const savedLanguage = localStorage.getItem(`contest-${contestId}-problem-${problem._id}-lang`);
      
      setCode(savedCode || 
        (problem.starterCode && problem.starterCode[language]) || 
        getDefaultCode(language)
      );
      
      if (savedLanguage) setLanguage(savedLanguage);
      setRunResult(null);
      setFinalSubmitResult(null);
      setError(null);
      
      // Check if problem is already solved
      if (user && contest && contest.leaderboard) {
        const userEntry = contest.leaderboard.find(entry => 
          entry.user._id === user._id
        );
        
        if (userEntry && userEntry.problems[problem._id]?.solved) {
          setIsSolved(true);
        } else {
          setIsSolved(false);
        }
      }
    }
  }, [problem, contest, contestId, user]);

  const getDefaultCode = (lang) => {
    switch (lang) {
      case 'javascript':
        return `function solution(input) {\n  // Your code here\n  return input;\n}`;
      case 'cpp':
        return `#include <iostream>\nusing namespace std;\n\nint main() {\n  // Your code here\n  return 0;\n}`;
      case 'python':
        return `def solution(input):\n  # Your code here\n  return input`;
      case 'java':
        return `public class Solution {\n  public static Object solution(Object input) {\n    // Your code here\n    return input;\n  }\n}`;
      default:
        return `// Write your solution here`;
    }
  };

  const handleRunCode = async () => {
    if (!problem || !code.trim()) return;
    
    try {
      setIsSubmitting(true);
      setRunResult(null);
      setError(null);
      
      // Save code to localStorage
      localStorage.setItem(`contest-${contestId}-problem-${problem._id}-code`, code);
      localStorage.setItem(`contest-${contestId}-problem-${problem._id}-lang`, language);
      
      const result = await runContestCode(
        contestId,
        problem._id,
        code,
        language
      );
      
      setRunResult(result);
    } catch (error) {
      console.error('Code execution failed:', error);
      setError('Failed to execute code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!problem || !code.trim()) return;
    
    try {
      setIsSubmitting(true);
      setFinalSubmitResult(null);
      setError(null);
      
      // Save code to localStorage
      localStorage.setItem(`contest-${contestId}-problem-${problem._id}-code`, code);
      localStorage.setItem(`contest-${contestId}-problem-${problem._id}-lang`, language);
      
      const result = await submitContestSolution(
        contestId,
        problem._id,
        code,
        language
      );
      
      setFinalSubmitResult(result);
      
      // If submission is accepted, mark as solved
      if (result.status === 'accepted') {
        setIsSolved(true);
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setError('Failed to submit solution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'wrong answer': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'time limit exceeded': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'runtime error': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const formatExecutionTime = (time) => {
    if (!time) return 'N/A';
    return `${time} ms`;
  };

  const formatMemoryUsage = (memory) => {
    if (!memory) return 'N/A';
    if (memory < 1024) return `${memory} KB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    
    // Reset code to default for new language
    if (problem && problem.starterCode && problem.starterCode[newLang]) {
      setCode(problem.starterCode[newLang]);
    } else {
      setCode(getDefaultCode(newLang));
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Problem Selector */}
        <div className="md:w-1/3">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Select Problem</h3>
              {isSolved && (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                  Solved
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {problems.map(p => (
                <div 
                  key={p._id}
                  onClick={() => onProblemChange(p)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    problem?._id === p._id
                      ? 'bg-cyan-600/30 border border-cyan-500/50'
                      : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{p.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      p.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      p.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {p.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Editor Area */}
        <div className="md:w-2/3">
          {problem ? (
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-white">{problem.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    problem.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p className="text-gray-300">{problem.description}</p>
                
                {problem.constraints?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-gray-400 font-medium mb-2">Constraints:</h4>
                    <ul className="list-disc list-inside text-gray-400">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {problem.sampleTestCases?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-gray-400 font-medium mb-2">Sample Test Cases:</h4>
                    {problem.sampleTestCases.map((testCase, i) => (
                      <div key={i} className="bg-gray-900 p-3 rounded-lg mb-3">
                        <p className="text-gray-300"><span className="text-gray-500">Input:</span> {testCase.input}</p>
                        <p className="text-gray-300"><span className="text-gray-500">Output:</span> {testCase.output}</p>
                        {testCase.explanation && (
                          <p className="text-gray-400 mt-1"><span className="text-gray-500">Explanation:</span> {testCase.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Code Editor</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={language}
                      onChange={handleLanguageChange}
                      className="bg-gray-700 text-white rounded px-3 py-1"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="cpp">C++</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                    </select>
                    
                    <button
                      onClick={() => {
                        if (problem.starterCode?.[language]) {
                          setCode(problem.starterCode[language]);
                        } else {
                          setCode(getDefaultCode(language));
                        }
                      }}
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      Reset Code
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-700 rounded-lg overflow-hidden mb-4" style={{ height: '300px' }}>
                  <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={setCode}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      scrollbar: {
                        vertical: 'auto',
                        horizontal: 'auto'
                      },
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: 'on',
                    }}
                  />
                </div>
                
                <div className="mt-4 flex flex-wrap gap-4">
                  <button
                    onClick={handleRunCode}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Running...
                      </>
                    ) : 'Run Code'}
                  </button>
                  <button
                    onClick={handleSubmitCode}
                    disabled={isSubmitting || isSolved}
                    className={`${
                      isSolved 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black'
                    } font-bold px-6 py-2 rounded-lg transition-all disabled:opacity-50 flex items-center`}
                  >
                    {isSolved ? 'Solved ✓' : isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Submitting...
                      </>
                    ) : 'Submit Solution'}
                  </button>
                </div>
                
                {error && (
                  <div className="mt-4 bg-red-500/20 text-red-400 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                {(runResult || finalSubmitResult) && (
                  <div className="mt-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-white font-medium mb-2">
                      {runResult ? 'Test Results' : 'Submission Result'}
                    </h4>
                    
                    {runResult && runResult.results?.map((result, i) => (
                      <div key={i} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-400">Test Case {i + 1}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            result.status_id === 3 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {result.status_id === 3 ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                          <div className="bg-gray-900 p-2 rounded">
                            <div className="text-gray-500">Input</div>
                            <div className="truncate">{result.input || 'N/A'}</div>
                          </div>
                          <div className="bg-gray-900 p-2 rounded">
                            <div className="text-gray-500">Expected</div>
                            <div className="truncate">{result.expected || 'N/A'}</div>
                          </div>
                          <div className="bg-gray-900 p-2 rounded">
                            <div className="text-gray-500">Output</div>
                            <div className="truncate">{result.output || 'N/A'}</div>
                          </div>
                        </div>
                        
                        {result.stderr && (
                          <div className="mt-2 bg-red-900/30 p-2 rounded text-red-400 text-xs">
                            <pre>{result.stderr}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {finalSubmitResult && (
                      <div className={`${getStatusColor(finalSubmitResult.status)} p-4 rounded-lg`}>
                        <div className="flex items-center">
                          <span className="text-xl mr-2">
                            {finalSubmitResult.status === 'accepted' ? '✓' : '✗'}
                          </span>
                          <span className="font-bold">
                            {finalSubmitResult.status === 'accepted' 
                              ? 'Accepted!' 
                              : finalSubmitResult.status || 'Submission Failed'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <div className="text-sm text-gray-400">Test Cases</div>
                            <div className="font-bold">
                              {finalSubmitResult.testCasesPassed || 0} / {finalSubmitResult.testCasesTotal || 0}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-400">Time</div>
                            <div className="font-bold">
                              {formatExecutionTime(finalSubmitResult.executionTime)}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-400">Memory</div>
                            <div className="font-bold">
                              {formatMemoryUsage(finalSubmitResult.memory)}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-400">Score</div>
                            <div className="font-bold">
                              {finalSubmitResult.score || 0} pts
                            </div>
                          </div>
                        </div>
                        
                        {finalSubmitResult.errorMessage && (
                          <div className="mt-3 bg-black/20 p-3 rounded">
                            <pre className="text-sm overflow-auto">{finalSubmitResult.errorMessage}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl">
              <h3 className="text-xl font-medium text-gray-300">Select a problem to solve</h3>
              <p className="text-gray-500 mt-2">
                Choose a problem from the list to start coding
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestEditor;