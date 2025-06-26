// import { useState, useEffect, useRef } from "react";
// import { useForm } from "react-hook-form";
// import Editor from "@monaco-editor/react";
// import { useParams } from "react-router";
// import axiosClient from "../utils/axiosClient";
// import SubmissionHistory from "../components/SubmissionHistory";
// import ChatAi from "../components/ChatAi";
// import Editorial from "../components/Editorial";
// const langMap = {
//   cpp: "C++",
//   java: "Java",
//   javascript: "JavaScript",
// };
// const ProblemPage = () => {
//   const [problem, setProblem] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState("javascript");
//   const [code, setCode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [runResult, setRunResult] = useState(null);
//   const [submitResult, setSubmitResult] = useState(null);
//   const [activeLeftTab, setActiveLeftTab] = useState("description");
//   const [activeRightTab, setActiveRightTab] = useState("code");
//   const editorRef = useRef(null);
//   let { problemId } = useParams();

//   const { handleSubmit } = useForm();

//   //     _id: '507f1f77bcf86cd799439011',
//   //     title: 'Two Sum',
//   //     description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

//   // You may assume that each input would have exactly one solution, and you may not use the same element twice.

//   // You can return the answer in any order.

//   // Example 1:
//   // Input: nums = [2,7,11,15], target = 9
//   // Output: [0,1]
//   // Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

//   // Example 2:
//   // Input: nums = [3,2,4], target = 6
//   // Output: [1,2]

//   // Example 3:
//   // Input: nums = [3,3], target = 6
//   // Output: [0,1]

//   // Constraints:
//   // - 2 <= nums.length <= 10^4
//   // - -10^9 <= nums[i] <= 10^9
//   // - -10^9 <= target <= 10^9
//   // - Only one valid answer exists.`,
//   //     difficulty: 'easy',
//   //     tags: 'array',
//   //     visibleTestCases: [
//   //       {
//   //         input: 'nums = [2,7,11,15], target = 9',
//   //         output: '[0,1]',
//   //         explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
//   //       },
//   //       {
//   //         input: 'nums = [3,2,4], target = 6',
//   //         output: '[1,2]',
//   //         explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
//   //       }
//   //     ],
//   //     startCode: [
//   //       {
//   //         language: 'javascript',
//   //         initialCode: `/**
//   //  * @param {number[]} nums
//   //  * @param {number} target
//   //  * @return {number[]}
//   //  */
//   // var twoSum = function(nums, target) {

//   // };`
//   //       },
//   //       {
//   //         language: 'java',
//   //         initialCode: `class Solution {
//   //     public int[] twoSum(int[] nums, int target) {

//   //     }
//   // }`
//   //       },
//   //       {
//   //         language: 'cpp',
//   //         initialCode: `class Solution {
//   // public:
//   //     vector<int> twoSum(vector<int>& nums, int target) {

//   //     }
//   // };`
//   //       }
//   //     ],
//   //     editorial: {
//   //       content: `## Approach 1: Brute Force

//   // The brute force approach is simple. Loop through each element x and find if there is another value that equals to target - x.

//   // **Algorithm:**
//   // 1. For each element in the array
//   // 2. Check if target - current element exists in the rest of the array
//   // 3. If found, return the indices

//   // **Complexity Analysis:**
//   // - Time complexity: O(n²)
//   // - Space complexity: O(1)

//   // ## Approach 2: Hash Table

//   // To improve our runtime complexity, we need a more efficient way to check if the complement exists in the array. If the complement exists, we need to get its index. What is the best way to maintain a mapping of each element in the array to its index? A hash table.

//   // **Algorithm:**
//   // 1. Create a hash table to store elements and their indices
//   // 2. For each element, calculate complement = target - current element
//   // 3. If complement exists in hash table, return indices
//   // 4. Otherwise, add current element to hash table

//   // **Complexity Analysis:**
//   // - Time complexity: O(n)
//   // - Space complexity: O(n)`
//   //     },
//   //     solutions: [
//   //       {
//   //         language: 'javascript',
//   //         title: 'Hash Table Approach',
//   //         code: `var twoSum = function(nums, target) {
//   //     const map = new Map();

//   //     for (let i = 0; i < nums.length; i++) {
//   //         const complement = target - nums[i];

//   //         if (map.has(complement)) {
//   //             return [map.get(complement), i];
//   //         }

//   //         map.set(nums[i], i);
//   //     }

//   //     return [];
//   // };`
//   //       },
//   //       {
//   //         language: 'java',
//   //         title: 'Hash Table Approach',
//   //         code: `class Solution {
//   //     public int[] twoSum(int[] nums, int target) {
//   //         Map<Integer, Integer> map = new HashMap<>();

//   //         for (int i = 0; i < nums.length; i++) {
//   //             int complement = target - nums[i];

//   //             if (map.containsKey(complement)) {
//   //                 return new int[] { map.get(complement), i };
//   //             }

//   //             map.put(nums[i], i);
//   //         }

//   //         return new int[0];
//   //     }
//   // }`
//   //       }
//   //     ]
//   //   };

//   // Fetch problem data
//   // useEffect(() => {
//   //   const fetchProblem = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const response = await axiosClient.get(
//   //         `/problem/problemById/${problemId}`
//   //       );

//   //       const initialCode =
//   //         response.data.startCode.find((sc) => {
//   //           if (sc.language == "C++" && selectedLanguage == "cpp") return true;
//   //           else if (sc.language == "Java" && selectedLanguage == "java")
//   //             return true;
//   //           else if (
//   //             sc.language == "Javascript" &&
//   //             selectedLanguage == "javascript"
//   //           )
//   //             return true;

//   //           return false;
//   //         })?.initialCode;

//   //       //console.log(initialCode);
//   //       setProblem(response.data);
//   //       // console.log(response.data.startCode);

//   //      // console.log(initialCode);
//   //       setCode(initialCode);
//   //       setLoading(false);
//   //     } catch (error) {
//   //       console.error("Error fetching problem:", error);
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchProblem();
//   // }, [problemId]);

//   useEffect(() => {
//     const fetchProblem = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosClient.get(
//           `/problem/problemById/${problemId}`
//         );

//         // Fixed the language comparison logic
//         const initialCode = response.data.startCode.find((sc) => {
//           if (sc.language === "C++" && selectedLanguage === "cpp") return true;
//           else if (sc.language === "Java" && selectedLanguage === "java")
//             return true;
//           else if (
//             sc.language === "JavaScript" &&
//             selectedLanguage === "javascript"
//           )
//             return true;
//           return false;
//         })?.initialCode;

//         setProblem(response.data);
//         setCode(initialCode || "");
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching problem:", error);
//         setLoading(false);
//       }
//     };

//     fetchProblem();
//   }, [problemId]);

//   // Update code when language changes
//   // useEffect(() => {
//   //   if (problem) {
//   //     const initialCode =
//   //       problem.startCode.find((sc) => sc.language === selectedLanguage)
//   //         ?.initialCode || "";
//   //     setCode(initialCode);
//   //   }
//   // }, [selectedLanguage, problem]);

//   useEffect(() => {
//     if (problem) {
//       const initialCode =
//         problem.startCode.find((sc) => {
//           if (sc.language === "C++" && selectedLanguage === "cpp") return true;
//           else if (sc.language === "Java" && selectedLanguage === "java")
//             return true;
//           else if (
//             sc.language === "JavaScript" &&
//             selectedLanguage === "javascript"
//           )
//             return true;
//           return false;
//         })?.initialCode || "";
//       setCode(initialCode);
//     }
//   }, [selectedLanguage, problem]);

//   const handleEditorChange = (value) => {
//     setCode(value || "");
//   };

//   const handleEditorDidMount = (editor) => {
//     editorRef.current = editor;
//   };

//   const handleLanguageChange = (language) => {
//     setSelectedLanguage(language);
//   };

//   const handleRun = async () => {
//     setLoading(true);
//     setRunResult(null);

//     try {
//       const response = await axiosClient.post(`/submission/run/${problemId}`, {
//         code,
//         language: selectedLanguage,
//       });

//       setRunResult(response.data);
//       setLoading(false);
//       setActiveRightTab("testcase");
//     } catch (error) {
//       console.error("Error running code:", error);
//       setRunResult({
//         success: false,
//         error: "Internal server error",
//       });
//       setLoading(false);
//       setActiveRightTab("testcase");
//     }
//   };

//   const handleSubmitCode = async () => {
//     setLoading(true);
//     setSubmitResult(null);

//     try {
//       const response = await axiosClient.post(
//         `/submission/submit/${problemId}`,
//         {
//           code: code,
//           language: selectedLanguage,
//         }
//       );

//       setSubmitResult(response.data);
//       setLoading(false);
//       setActiveRightTab("result");
//     } catch (error) {
//       console.error("Error submitting code:", error);
//       setSubmitResult(null);
//       setLoading(false);
//       setActiveRightTab("result");
//     }
//   };

//   const getLanguageForMonaco = (lang) => {
//     switch (lang) {
//       case "javascript":
//         return "javascript";
//       case "java":
//         return "java";
//       case "cpp":
//         return "cpp";
//       default:
//         return "javascript";
//     }
//   };

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case "easy":
//         return "text-green-500";
//       case "medium":
//         return "text-yellow-500";
//       case "hard":
//         return "text-red-500";
//       default:
//         return "text-gray-500";
//     }
//   };

//   if (loading && !problem) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   return (
//     // <div className="h-screen flex bg-base-100">
//     //   {/* Left Panel */}
//     //   <div className="w-1/2 flex flex-col border-r border-base-300">
//     //     {/* Left Tabs */}
//     //     <div className="tabs tabs-bordered bg-base-200 px-4">
//     //       <button
//     //         className={`tab ${activeLeftTab === 'description' ? 'tab-active' : ''}`}
//     //         onClick={() => setActiveLeftTab('description')}
//     //       >
//     //         Description
//     //       </button>
//     //       <button
//     //         className={`tab ${activeLeftTab === 'editorial' ? 'tab-active' : ''}`}
//     //         onClick={() => setActiveLeftTab('editorial')}
//     //       >
//     //         Editorial
//     //       </button>
//     //       <button
//     //         className={`tab ${activeLeftTab === 'solutions' ? 'tab-active' : ''}`}
//     //         onClick={() => setActiveLeftTab('solutions')}
//     //       >
//     //         Solutions
//     //       </button>
//     //       <button
//     //         className={`tab ${activeLeftTab === 'submissions' ? 'tab-active' : ''}`}
//     //         onClick={() => setActiveLeftTab('submissions')}
//     //       >
//     //         Submissions
//     //       </button>
//     //     </div>

//     //     {/* Left Content */}
//     //     <div className="flex-1 overflow-y-auto p-6">
//     //       {problem && (
//     //         <>
//     //           {activeLeftTab === 'description' && (
//     //             <div>
//     //               <div className="flex items-center gap-4 mb-6">
//     //                 <h1 className="text-2xl font-bold">{problem.title}</h1>
//     //                 <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
//     //                   {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
//     //                 </div>
//     //                 <div className="badge badge-primary">{problem.tags}</div>
//     //               </div>

//     //               <div className="prose max-w-none">
//     //                 <div className="whitespace-pre-wrap text-sm leading-relaxed">
//     //                   {problem.description}
//     //                 </div>
//     //               </div>

//     //               <div className="mt-8">
//     //                 <h3 className="text-lg font-semibold mb-4">Examples:</h3>
//     //                 <div className="space-y-4">
//     //                   {problem.visibleTestCases.map((example, index) => (
//     //                     <div key={index} className="bg-base-200 p-4 rounded-lg">
//     //                       <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
//     //                       <div className="space-y-2 text-sm font-mono">
//     //                         <div><strong>Input:</strong> {example.input}</div>
//     //                         <div><strong>Output:</strong> {example.output}</div>
//     //                         <div><strong>Explanation:</strong> {example.explanation}</div>
//     //                       </div>
//     //                     </div>
//     //                   ))}
//     //                 </div>
//     //               </div>
//     //             </div>
//     //           )}

//     //           {activeLeftTab === 'editorial' && (
//     //             <div className="prose max-w-none">
//     //               <h2 className="text-xl font-bold mb-4">Editorial</h2>
//     //               <div className="whitespace-pre-wrap text-sm leading-relaxed">
//     //                 {'Editorial is here for the problem'}
//     //               </div>
//     //             </div>
//     //           )}

//     //           {activeLeftTab === 'solutions' && (
//     //             <div>
//     //               <h2 className="text-xl font-bold mb-4">Solutions</h2>
//     //               <div className="space-y-6">
//     //                 {problem.referenceSolution?.map((solution, index) => (
//     //                   <div key={index} className="border border-base-300 rounded-lg">
//     //                     <div className="bg-base-200 px-4 py-2 rounded-t-lg">
//     //                       <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
//     //                     </div>
//     //                     <div className="p-4">
//     //                       <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
//     //                         <code>{solution?.completeCode}</code>
//     //                       </pre>
//     //                     </div>
//     //                   </div>
//     //                 )) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
//     //               </div>
//     //             </div>
//     //           )}

//     //           {activeLeftTab === 'submissions' && (
//     //             <div>
//     //               <h2 className="text-xl font-bold mb-4">My Submissions</h2>
//     //               <div className="text-gray-500">
//     //                 Your submission history will appear here.
//     //               </div>
//     //             </div>
//     //           )}
//     //         </>
//     //       )}
//     //     </div>
//     //   </div>

//     //   {/* Right Panel */}
//     //   <div className="w-1/2 flex flex-col">
//     //     {/* Right Tabs */}
//     //     <div className="tabs tabs-bordered bg-base-200 px-4">
//     //       <button
//     //         className={`tab ${activeRightTab === 'code' ? 'tab-active' : ''}`}
//     //         onClick={() => setActiveRightTab('code')}
//     //       >
//     //         Code
//     //       </button>
//     //       <button
//     //         className={`tab ${activeRightTab === 'testcase' ? 'tab-active' : ''}`}
//     //         onClick={() => setActiveRightTab('testcase')}
//     //       >
//     //         Testcase
//     //       </button>
//     //       <button
//     //         className={`tab ${activeRightTab === 'result' ? 'tab-active' : ''}`}
//     //         onClick={() => setActiveRightTab('result')}
//     //       >
//     //         Result
//     //       </button>
//     //     </div>

//     //     {/* Right Content */}
//     //     <div className="flex-1 flex flex-col">
//     //       {activeRightTab === 'code' && (
//     //         <div className="flex-1 flex flex-col">
//     //           {/* Language Selector */}
//     //           <div className="flex justify-between items-center p-4 border-b border-base-300">
//     //             <div className="flex gap-2">
//     //               {['javascript', 'java', 'cpp'].map((lang) => (
//     //                 <button
//     //                   key={lang}
//     //                   className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'}`}
//     //                   onClick={() => handleLanguageChange(lang)}
//     //                 >
//     //                   {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
//     //                 </button>
//     //               ))}
//     //             </div>
//     //           </div>

//     //           {/* Monaco Editor */}
//     //           <div className="flex-1">
//     //             <Editor
//     //               height="100%"
//     //               language={getLanguageForMonaco(selectedLanguage)}
//     //               value={code}
//     //               onChange={handleEditorChange}
//     //               onMount={handleEditorDidMount}
//     //               theme="vs-dark"
//     //               options={{
//     //                 fontSize: 14,
//     //                 minimap: { enabled: false },
//     //                 scrollBeyondLastLine: false,
//     //                 automaticLayout: true,
//     //                 tabSize: 2,
//     //                 insertSpaces: true,
//     //                 wordWrap: 'on',
//     //                 lineNumbers: 'on',
//     //                 glyphMargin: false,
//     //                 folding: true,
//     //                 lineDecorationsWidth: 10,
//     //                 lineNumbersMinChars: 3,
//     //                 renderLineHighlight: 'line',
//     //                 selectOnLineNumbers: true,
//     //                 roundedSelection: false,
//     //                 readOnly: false,
//     //                 cursorStyle: 'line',
//     //                 mouseWheelZoom: true,
//     //               }}
//     //             />
//     //           </div>

//     //           {/* Action Buttons */}
//     //           <div className="p-4 border-t border-base-300 flex justify-between">
//     //             <div className="flex gap-2">
//     //               <button
//     //                 className="btn btn-ghost btn-sm"
//     //                 onClick={() => setActiveRightTab('testcase')}
//     //               >
//     //                 Console
//     //               </button>
//     //             </div>
//     //             <div className="flex gap-2">
//     //               <button
//     //                 className={`btn btn-outline btn-sm ${loading ? 'loading' : ''}`}
//     //                 onClick={handleRun}
//     //                 disabled={loading}
//     //               >
//     //                 Run
//     //               </button>
//     //               <button
//     //                 className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`}
//     //                 onClick={handleSubmitCode}
//     //                 disabled={loading}
//     //               >
//     //                 Submit
//     //               </button>
//     //             </div>
//     //           </div>
//     //         </div>
//     //       )}

//     //       {activeRightTab === 'testcase' && (
//     //         <div className="flex-1 p-4 overflow-y-auto">
//     //           <h3 className="font-semibold mb-4">Test Results</h3>
//     //           {runResult ? (
//     //             <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'} mb-4`}>
//     //               <div>
//     //                 {runResult.success ? (
//     //                   <div>
//     //                     <h4 className="font-bold">✅ All test cases passed!</h4>
//     //                     <p className="text-sm mt-2">Runtime: {runResult.runtime+" sec"}</p>
//     //                     <p className="text-sm">Memory: {runResult.memory+" KB"}</p>

//     //                     <div className="mt-4 space-y-2">
//     //                       {runResult.testCases.map((tc, i) => (
//     //                         <div key={i} className="bg-base-100 p-3 rounded text-xs">
//     //                           <div className="font-mono">
//     //                             <div><strong>Input:</strong> {tc.stdin}</div>
//     //                             <div><strong>Expected:</strong> {tc.expected_output}</div>
//     //                             <div><strong>Output:</strong> {tc.stdout}</div>
//     //                             <div className={'text-green-600'}>
//     //                               {'✓ Passed'}
//     //                             </div>
//     //                           </div>
//     //                         </div>
//     //                       ))}
//     //                     </div>
//     //                   </div>
//     //                 ) : (
//     //                   <div>
//     //                     <h4 className="font-bold">❌ Error</h4>
//     //                     <div className="mt-4 space-y-2">
//     //                       {runResult.testCases.map((tc, i) => (
//     //                         <div key={i} className="bg-base-100 p-3 rounded text-xs">
//     //                           <div className="font-mono">
//     //                             <div><strong>Input:</strong> {tc.stdin}</div>
//     //                             <div><strong>Expected:</strong> {tc.expected_output}</div>
//     //                             <div><strong>Output:</strong> {tc.stdout}</div>
//     //                             <div className={tc.status_id==3 ? 'text-green-600' : 'text-red-600'}>
//     //                               {tc.status_id==3 ? '✓ Passed' : '✗ Failed'}
//     //                             </div>
//     //                           </div>
//     //                         </div>
//     //                       ))}
//     //                     </div>
//     //                   </div>
//     //                 )}
//     //               </div>
//     //             </div>
//     //           ) : (
//     //             <div className="text-gray-500">
//     //               Click "Run" to test your code with the example test cases.
//     //             </div>
//     //           )}
//     //         </div>
//     //       )}

//     //       {activeRightTab === 'result' && (
//     //         <div className="flex-1 p-4 overflow-y-auto">
//     //           <h3 className="font-semibold mb-4">Submission Result</h3>
//     //           {submitResult ? (
//     //             <div className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'}`}>
//     //               <div>
//     //                 {submitResult.accepted ? (
//     //                   <div>
//     //                     <h4 className="font-bold text-lg">🎉 Accepted</h4>
//     //                     <div className="mt-4 space-y-2">
//     //                       <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
//     //                       <p>Runtime: {submitResult.runtime + " sec"}</p>
//     //                       <p>Memory: {submitResult.memory + "KB"} </p>
//     //                     </div>
//     //                   </div>
//     //                 ) : (
//     //                   <div>
//     //                     <h4 className="font-bold text-lg">❌ {submitResult.error}</h4>
//     //                     <div className="mt-4 space-y-2">
//     //                       <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
//     //                     </div>
//     //                   </div>
//     //                 )}
//     //               </div>
//     //             </div>
//     //           ) : (
//     //             <div className="text-gray-500">
//     //               Click "Submit" to submit your solution for evaluation.
//     //             </div>
//     //           )}
//     //         </div>
//     //       )}
//     //     </div>
//     //   </div>
//     // </div>
//     <div className="h-screen flex bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
//       {/* Left Panel */}
//       <div className="w-1/2 flex flex-col border-r border-gray-700">
//         {/* Left Tabs */}
//         <div className="flex bg-gray-800/70 backdrop-blur-sm px-4 border-b border-gray-700">
//           <button
//             className={`px-4 py-3 font-medium text-sm relative transition-all duration-200 ${
//               activeLeftTab === "description"
//                 ? "text-blue-400"
//                 : "text-gray-400 hover:text-gray-200"
//             }`}
//             onClick={() => setActiveLeftTab("description")}
//           >
//             Description
//             {activeLeftTab === "description" && (
//               <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></div>
//             )}
//           </button>
//           <button
//             className={`px-4 py-3 font-medium text-sm relative transition-all duration-200 ${
//               activeLeftTab === "editorial"
//                 ? "text-purple-400"
//                 : "text-gray-400 hover:text-gray-200"
//             }`}
//             onClick={() => setActiveLeftTab("editorial")}
//           >
//             Editorial
//             {activeLeftTab === "editorial" && (
//               <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>
//             )}
//           </button>
//           <button
//             className={`px-4 py-3 font-medium text-sm relative transition-all duration-200 ${
//               activeLeftTab === "solutions"
//                 ? "text-green-400"
//                 : "text-gray-400 hover:text-gray-200"
//             }`}
//             onClick={() => setActiveLeftTab("solutions")}
//           >
//             Solutions
//             {activeLeftTab === "solutions" && (
//               <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-full"></div>
//             )}
//           </button>
//           <button
//             className={`px-4 py-3 font-medium text-sm relative transition-all duration-200 ${
//               activeLeftTab === "submissions"
//                 ? "text-yellow-400"
//                 : "text-gray-400 hover:text-gray-200"
//             }`}
//             onClick={() => setActiveLeftTab("submissions")}
//           >
//             Submissions
//             {activeLeftTab === "submissions" && (
//               <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 rounded-full"></div>
//             )}
//           </button>

//           <button
//             className={`px-4 py-3 font-medium text-sm relative transition-all duration-200 ${
//               activeLeftTab === "chatai"
//                 ? "text-cyan-400"
//                 : "text-gray-400 hover:text-gray-200"
//             }`}
//             onClick={() => setActiveLeftTab("chatai")}
//           >
//             Chat with AI
//             {activeLeftTab === "chatai" && (
//               <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 rounded-full"></div>
//             )}
//           </button>
//         </div>

//         {/* Left Content */}
//         <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
//           {problem && (
//             <>
//               {activeLeftTab === "description" && (
//                 <div>
//                   <div className="flex flex-wrap items-center gap-3 mb-6">
//                     <h1 className="text-2xl font-bold text-white">
//                       {problem.title}
//                     </h1>
//                     <div
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         problem.difficulty === "easy"
//                           ? "bg-green-900/40 text-green-300"
//                           : problem.difficulty === "medium"
//                           ? "bg-yellow-900/40 text-yellow-300"
//                           : "bg-red-900/40 text-red-300"
//                       }`}
//                     >
//                       {problem.difficulty.charAt(0).toUpperCase() +
//                         problem.difficulty.slice(1)}
//                     </div>
//                     <div className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
//                       {problem.tags}
//                     </div>
//                   </div>

//                   <div className="prose prose-invert max-w-none text-gray-300">
//                     <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                       {problem.description}
//                     </div>
//                   </div>

//                   <div className="mt-8">
//                     <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-blue-400"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       Examples
//                     </h3>
//                     <div className="space-y-4">
//                       {problem.visibleTestCases.map((example, index) => (
//                         <div
//                           key={index}
//                           className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 shadow-lg"
//                         >
//                           <h4 className="font-semibold mb-2 text-gray-200 flex items-center gap-2">
//                             <span className="bg-gray-700 text-gray-300 h-6 w-6 rounded-full flex items-center justify-center text-xs">
//                               {index + 1}
//                             </span>
//                             Example {index + 1}
//                           </h4>
//                           <div className="space-y-2 text-sm font-mono">
//                             <div className="flex gap-2">
//                               <span className="text-gray-400 flex-shrink-0">
//                                 Input:
//                               </span>
//                               <span className="text-gray-200">
//                                 {example.input}
//                               </span>
//                             </div>
//                             <div className="flex gap-2">
//                               <span className="text-gray-400 flex-shrink-0">
//                                 Output:
//                               </span>
//                               <span className="text-gray-200">
//                                 {example.output}
//                               </span>
//                             </div>
//                             <div className="flex gap-2">
//                               <span className="text-gray-400 flex-shrink-0">
//                                 Explanation:
//                               </span>
//                               <span className="text-gray-200">
//                                 {example.explanation}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeLeftTab === "editorial" && (
//                 <div className="prose prose-invert max-w-none">
//                   <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 text-purple-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
//                     </svg>
//                     Editorial
//                   </h2>
//                   <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 shadow-lg">
//                     <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                       {problem?.secureUrl &&
//                       problem?.thumbnailUrl &&
//                       problem?.duration ? (
//                         <Editorial
//                           secureUrl={problem.secureUrl}
//                           thumbnailUrl={problem.thumbnailUrl}
//                           duration={problem.duration}
//                         />
//                       ) : (
//                         "Editorial is here for the problem"
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeLeftTab === "solutions" && (
//                 <div>
//                   <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 text-green-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     Solutions
//                   </h2>
//                   <div className="space-y-6">
//                     {problem.referenceSolution?.map((solution, index) => (
//                       <div
//                         key={index}
//                         className="bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg overflow-hidden"
//                       >
//                         <div className="bg-gray-700/50 px-4 py-3 flex items-center justify-between">
//                           <h3 className="font-semibold text-gray-200">
//                             {problem?.title} - {solution?.language}
//                           </h3>
//                           <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
//                             Accepted
//                           </span>
//                         </div>
//                         <div className="p-4">
//                           <pre className="bg-gray-900 p-4 rounded text-sm overflow-x-auto font-mono">
//                             <code className="text-gray-300">
//                               {solution?.completeCode}
//                             </code>
//                           </pre>
//                         </div>
//                       </div>
//                     )) || (
//                       <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-12 w-12 mx-auto text-gray-500 mb-3"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={1.5}
//                             d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
//                           />
//                         </svg>
//                         <p className="text-gray-500">
//                           Solutions will be available after you solve the
//                           problem
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* {activeLeftTab === 'submissions' && (
//                 <div>
//                   <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                     </svg>
//                     My Submissions
//                   </h2>
//                   <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     <p className="text-gray-500">Your submission history will appear here</p>
//                   </div>
//                 </div>
//               )} */}
//               {activeLeftTab === "submissions" && (
//                 <div>
//                   <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 text-yellow-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     My Submissions
//                   </h2>
//                   <SubmissionHistory problemId={problemId} />
//                 </div>
//               )}

//               {activeLeftTab === "chatai" && (
//                 <div>
//                   <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5 text-cyan-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     Chat with AI
//                   </h2>
//                   <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 shadow-lg">
//                     <ChatAi problem={problem} />
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Right Panel */}
//       <div className="w-1/2 flex flex-col bg-gray-900/80 backdrop-blur-sm">
//         {/* Right Tabs */}
//         <div className="flex bg-gray-800/70 backdrop-blur-sm px-4 border-b border-gray-700">
//           <button
//             className={`px-4 py-3 font-medium text-sm relative transition-all duration-200 ${
//               activeRightTab === "code"
//                 ? "text-blue-400"
//                 : "text-gray-400 hover:text-gray-200"
//             }`}
//             onClick={() => setActiveRightTab("code")}
//           >
//             Code
//             {activeRightTab === "code" && (
//               <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></div>
//             )}
//           </button>
//           <button
//             className={`px-4 py-3 font-medium text-sm relative transition-all duration-200 ${
//               activeRightTab === "testcase"
//                 ? "text-purple-400"
//                 : "text-gray-400 hover:text-gray-200"
//             }`}
//             onClick={() => setActiveRightTab("testcase")}
//           >
//             Testcase
//             {activeRightTab === "testcase" && (
//               <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></div>
//             )}
//           </button>
//           <button
//             className={`px-4 py-3 font-medium text-sm relative transition-all duration-200 ${
//               activeRightTab === "result"
//                 ? "text-green-400"
//                 : "text-gray-400 hover:text-gray-200"
//             }`}
//             onClick={() => setActiveRightTab("result")}
//           >
//             Result
//             {activeRightTab === "result" && (
//               <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-full"></div>
//             )}
//           </button>
//         </div>

//         {/* Right Content */}
//         <div className="flex-1 flex flex-col">
//           {activeRightTab === "code" && (
//             <div className="flex-1 flex flex-col">
//               {/* Language Selector */}
//               <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800/50">
//                 <div className="flex gap-2">
//                   {["javascript", "java", "cpp"].map((lang) => (
//                     <button
//                       key={lang}
//                       className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
//                         selectedLanguage === lang
//                           ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
//                           : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                       }`}
//                       onClick={() => handleLanguageChange(lang)}
//                     >
//                       {lang === "cpp"
//                         ? "C++"
//                         : lang === "javascript"
//                         ? "JavaScript"
//                         : "Java"}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="flex items-center gap-2 text-xs text-gray-400">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                   Press Ctrl+Space for autocomplete
//                 </div>
//               </div>

//               {/* Monaco Editor */}
//               <div className="flex-1">
//                 <Editor
//                   height="100%"
//                   language={getLanguageForMonaco(selectedLanguage)}
//                   value={code}
//                   onChange={handleEditorChange}
//                   onMount={handleEditorDidMount}
//                   theme="vs-dark"
//                   options={{
//                     fontSize: 14,
//                     minimap: { enabled: false },
//                     scrollBeyondLastLine: false,
//                     automaticLayout: true,
//                     tabSize: 2,
//                     insertSpaces: true,
//                     wordWrap: "on",
//                     lineNumbers: "on",
//                     glyphMargin: false,
//                     folding: true,
//                     lineDecorationsWidth: 10,
//                     lineNumbersMinChars: 3,
//                     renderLineHighlight: "line",
//                     selectOnLineNumbers: true,
//                     roundedSelection: false,
//                     readOnly: false,
//                     cursorStyle: "line",
//                     mouseWheelZoom: true,
//                   }}
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="p-4 border-t border-gray-700 flex justify-between bg-gray-800/50">
//                 <div className="flex gap-2">
//                   <button
//                     className="px-4 py-2 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center gap-2"
//                     onClick={() => setActiveRightTab("testcase")}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                       />
//                     </svg>
//                     Console
//                   </button>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-all ${
//                       loading
//                         ? "bg-gray-700 text-gray-400"
//                         : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
//                     }`}
//                     onClick={handleRun}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <span className="loading loading-spinner loading-xs"></span>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     )}
//                     Run
//                   </button>
//                   <button
//                     className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-all ${
//                       loading
//                         ? "bg-gray-700 text-gray-400"
//                         : "bg-gradient-to-r from-green-600 to-teal-500 text-white hover:opacity-90 shadow-lg shadow-green-500/20"
//                     }`}
//                     onClick={handleSubmitCode}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <span className="loading loading-spinner loading-xs"></span>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     )}
//                     Submit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeRightTab === "testcase" && (
//             <div className="flex-1 p-4 overflow-y-auto">
//               <h3 className="font-semibold mb-4 text-white flex items-center gap-2">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 text-purple-400"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                   />
//                 </svg>
//                 Test Results
//               </h3>
//               {runResult ? (
//                 <div
//                   className={`p-5 rounded-xl border ${
//                     runResult.success
//                       ? "border-green-500/30 bg-green-900/20"
//                       : "border-red-500/30 bg-red-900/20"
//                   } mb-6 shadow-lg`}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div
//                       className={`mt-1 p-2 rounded-full ${
//                         runResult.success
//                           ? "bg-green-900/40 text-green-400"
//                           : "bg-red-900/40 text-red-400"
//                       }`}
//                     >
//                       {runResult.success ? (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-6 w-6"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       ) : (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-6 w-6"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       )}
//                     </div>
//                     <div>
//                       {runResult.success ? (
//                         <div>
//                           <h4 className="font-bold text-lg text-green-300">
//                             {" "}
//                             All test cases passed!
//                           </h4>
//                           <div className="mt-4 space-y-3">
//                             <div className="flex gap-4">
//                               <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
//                                 <div className="text-xs text-gray-400">
//                                   Runtime
//                                 </div>
//                                 <div className="font-mono text-green-300">
//                                   {runResult.runtime + " sec"}
//                                 </div>
//                               </div>
//                               <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
//                                 <div className="text-xs text-gray-400">
//                                   Memory
//                                 </div>
//                                 <div className="font-mono text-green-300">
//                                   {runResult.memory + " KB"}
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="mt-4 space-y-3">
//                               {runResult.testCases.map((tc, i) => (
//                                 <div
//                                   key={i}
//                                   className="bg-gray-800/30 p-3 rounded-lg border border-gray-700"
//                                 >
//                                   <div className="text-xs text-gray-400 mb-2">
//                                     Test Case #{i + 1}
//                                   </div>
//                                   <div className="font-mono text-sm">
//                                     <div className="flex gap-2">
//                                       <span className="text-gray-400">
//                                         Input:
//                                       </span>
//                                       <span className="text-gray-200">
//                                         {tc.stdin}
//                                       </span>
//                                     </div>
//                                     <div className="flex gap-2">
//                                       <span className="text-gray-400">
//                                         Expected:
//                                       </span>
//                                       <span className="text-gray-200">
//                                         {tc.expected_output}
//                                       </span>
//                                     </div>
//                                     <div className="flex gap-2">
//                                       <span className="text-gray-400">
//                                         Output:
//                                       </span>
//                                       <span className="text-gray-200">
//                                         {tc.stdout}
//                                       </span>
//                                     </div>
//                                     <div className="mt-2 flex items-center gap-1 text-green-500">
//                                       <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="h-4 w-4"
//                                         viewBox="0 0 20 20"
//                                         fill="currentColor"
//                                       >
//                                         <path
//                                           fillRule="evenodd"
//                                           d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                                           clipRule="evenodd"
//                                         />
//                                       </svg>
//                                       Passed
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       ) : (
//                         <div>
//                           <h4 className="font-bold text-lg text-red-300">
//                             {" "}
//                             Error
//                           </h4>
//                           <div className="mt-4 space-y-3">
//                             {runResult.testCases.map((tc, i) => (
//                               <div
//                                 key={i}
//                                 className="bg-gray-800/30 p-3 rounded-lg border border-gray-700"
//                               >
//                                 <div className="text-xs text-gray-400 mb-2">
//                                   Test Case #{i + 1}
//                                 </div>
//                                 <div className="font-mono text-sm">
//                                   <div className="flex gap-2">
//                                     <span className="text-gray-400">
//                                       Input:
//                                     </span>
//                                     <span className="text-gray-200">
//                                       {tc.stdin}
//                                     </span>
//                                   </div>
//                                   <div className="flex gap-2">
//                                     <span className="text-gray-400">
//                                       Expected:
//                                     </span>
//                                     <span className="text-gray-200">
//                                       {tc.expected_output}
//                                     </span>
//                                   </div>
//                                   <div className="flex gap-2">
//                                     <span className="text-gray-400">
//                                       Output:
//                                     </span>
//                                     <span className="text-gray-200">
//                                       {tc.stdout}
//                                     </span>
//                                   </div>
//                                   <div
//                                     className={`mt-2 flex items-center gap-1 ${
//                                       tc.status_id == 3
//                                         ? "text-green-500"
//                                         : "text-red-500"
//                                     }`}
//                                   >
//                                     {tc.status_id == 3 ? (
//                                       <>
//                                         <svg
//                                           xmlns="http://www.w3.org/2000/svg"
//                                           className="h-4 w-4"
//                                           viewBox="0 0 20 20"
//                                           fill="currentColor"
//                                         >
//                                           <path
//                                             fillRule="evenodd"
//                                             d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                                             clipRule="evenodd"
//                                           />
//                                         </svg>
//                                         Passed
//                                       </>
//                                     ) : (
//                                       <>
//                                         <svg
//                                           xmlns="http://www.w3.org/2000/svg"
//                                           className="h-4 w-4"
//                                           viewBox="0 0 20 20"
//                                           fill="currentColor"
//                                         >
//                                           <path
//                                             fillRule="evenodd"
//                                             d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                                             clipRule="evenodd"
//                                           />
//                                         </svg>
//                                         Failed
//                                       </>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 text-center">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-12 w-12 mx-auto text-gray-500 mb-3"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
//                     />
//                   </svg>
//                   <p className="text-gray-500">
//                     Click "Run" to test your code with the example test cases
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {activeRightTab === "result" && (
//             <div className="flex-1 p-4 overflow-y-auto">
//               <h3 className="font-semibold mb-4 text-white flex items-center gap-2">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 text-green-400"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 Submission Result
//               </h3>
//               {submitResult ? (
//                 <div
//                   className={`p-5 rounded-xl border ${
//                     submitResult.accepted
//                       ? "border-green-500/30 bg-green-900/20"
//                       : "border-red-500/30 bg-red-900/20"
//                   } mb-6 shadow-lg`}
//                 >
//                   <div className="flex items-start gap-3">
//                     <div
//                       className={`mt-1 p-2 rounded-full ${
//                         submitResult.accepted
//                           ? "bg-green-900/40 text-green-400"
//                           : "bg-red-900/40 text-red-400"
//                       }`}
//                     >
//                       {submitResult.accepted ? (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-6 w-6"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       ) : (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-6 w-6"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       )}
//                     </div>
//                     <div>
//                       {submitResult.accepted ? (
//                         <div>
//                           <h4 className="font-bold text-lg text-green-300">
//                             {" "}
//                             Accepted
//                           </h4>
//                           <div className="mt-4 space-y-3">
//                             <div className="flex gap-4">
//                               <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
//                                 <div className="text-xs text-gray-400">
//                                   Test Cases
//                                 </div>
//                                 <div className="font-mono text-green-300">
//                                   {submitResult.passedTestCases}/
//                                   {submitResult.totalTestCases}
//                                 </div>
//                               </div>
//                               <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
//                                 <div className="text-xs text-gray-400">
//                                   Runtime
//                                 </div>
//                                 <div className="font-mono text-green-300">
//                                   {submitResult.runtime + " sec"}
//                                 </div>
//                               </div>
//                               <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
//                                 <div className="text-xs text-gray-400">
//                                   Memory
//                                 </div>
//                                 <div className="font-mono text-green-300">
//                                   {submitResult.memory + "KB"}
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="mt-4 bg-gray-800/30 p-4 rounded-lg border border-gray-700">
//                               <div className="text-sm text-gray-300">
//                                 Congratulations! Your solution passed all test
//                                 cases.
//                               </div>
//                               <button className="mt-3 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white flex items-center gap-2 w-max">
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   className="h-4 w-4"
//                                   viewBox="0 0 20 20"
//                                   fill="currentColor"
//                                 >
//                                   <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                                   <path
//                                     fillRule="evenodd"
//                                     d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
//                                     clipRule="evenodd"
//                                   />
//                                 </svg>
//                                 View Solutions
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       ) : (
//                         <div>
//                           <h4 className="font-bold text-lg text-red-300">
//                             {" "}
//                             {submitResult.error}
//                           </h4>
//                           <div className="mt-4 space-y-3">
//                             <div className="flex gap-4">
//                               <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
//                                 <div className="text-xs text-gray-400">
//                                   Test Cases
//                                 </div>
//                                 <div className="font-mono text-red-300">
//                                   {submitResult.passedTestCases}/
//                                   {submitResult.totalTestCases}
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="mt-4 bg-gray-800/30 p-4 rounded-lg border border-gray-700">
//                               <div className="text-sm text-gray-300">
//                                 Try to debug your solution with the provided
//                                 test cases.
//                               </div>
//                               <button className="mt-3 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center gap-2 w-max">
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   className="h-4 w-4"
//                                   viewBox="0 0 20 20"
//                                   fill="currentColor"
//                                 >
//                                   <path
//                                     fillRule="evenodd"
//                                     d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
//                                     clipRule="evenodd"
//                                   />
//                                 </svg>
//                                 Debug Solution
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 text-center">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-12 w-12 mx-auto text-gray-500 mb-3"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                     />
//                   </svg>
//                   <p className="text-gray-500">
//                     Click "Submit" to submit your solution for evaluation
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProblemPage;

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/ChatAi";
import Editorial from "../components/Editorial";
import Header from "../components/Header"; 
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");
  const editorRef = useRef(null);
  const { problemId } = useParams();

  const { handleSubmit } = useForm();

  // A map to make language selection logic cleaner
  const languageMap = {
    cpp: "C++",
    java: "Java",
    javascript: "JavaScript",
  };

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );
        setProblem(response.data);
        // Set initial code after fetching problem
        const initialCode =
          response.data.starterCode.find(
            (sc) => sc.language === selectedLanguage
          )?.initialCode;
          
        setCode(initialCode);
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code editor when language changes
  useEffect(() => {
    if (problem) {
      const newCode =
        problem.starterCode.find(
          (sc) => sc.language === languageMap[selectedLanguage]
        )?.initialCode;
      setCode(newCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setRunResult(response.data);
      setActiveRightTab("testcase");
    } catch (error) {
      console.error("Error running code:", error);
      setRunResult({ success: false, error: "Internal server error" });
      setActiveRightTab("testcase");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        { code, language: selectedLanguage }
      );
      setSubmitResult(response.data);
      setActiveRightTab("result");
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmitResult({ accepted: false, error: "Submission Failed" });
      setActiveRightTab("result");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <span className="loading loading-spinner loading-lg text-cyan-400"></span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 overflow-hidden">
      <Header />
      <PanelGroup direction="horizontal" className="flex-grow">
        {/* Left Panel */}
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col border-r border-gray-700">
            {/* Left Tabs */}
            <div className="flex bg-gray-800/70 backdrop-blur-sm px-4 border-b border-gray-700 shrink-0">
              <TabButton
                isActive={activeLeftTab === "description"}
                onClick={() => setActiveLeftTab("description")}
                color="blue"
              >
                Description
              </TabButton>
              <TabButton
                isActive={activeLeftTab === "editorial"}
                onClick={() => setActiveLeftTab("editorial")}
                color="purple"
              >
                Editorial
              </TabButton>
              <TabButton
                isActive={activeLeftTab === "solutions"}
                onClick={() => setActiveLeftTab("solutions")}
                color="green"
              >
                Solutions
              </TabButton>
              <TabButton
                isActive={activeLeftTab === "submissions"}
                onClick={() => setActiveLeftTab("submissions")}
                color="yellow"
              >
                Submissions
              </TabButton>
              <TabButton
                isActive={activeLeftTab === "chatai"}
                onClick={() => setActiveLeftTab("chatai")}
                color="cyan"
              >
                Chat with AI
              </TabButton>
            </div>

            {/* Left Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {problem && (
                <>
                  {activeLeftTab === "description" && (
                    <ProblemDescription problem={problem} />
                  )}
                  {activeLeftTab === "editorial" && (
                    <ProblemEditorial problem={problem} />
                  )}
                  {activeLeftTab === "solutions" && (
                    <ProblemSolutions problem={problem} />
                  )}
                  {activeLeftTab === "submissions" && (
                    <SubmissionHistory problemId={problemId} />
                  )}
                  {activeLeftTab === "chatai" && <ChatAi problem={problem} />}
                </>
              )}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-800 hover:bg-cyan-500 transition-colors duration-200 cursor-col-resize" />

        {/* Right Panel */}
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col bg-gray-900/80 backdrop-blur-sm">
            {/* Right Tabs */}
            <div className="flex bg-gray-800/70 backdrop-blur-sm px-4 border-b border-gray-700 shrink-0">
              <TabButton
                isActive={activeRightTab === "code"}
                onClick={() => setActiveRightTab("code")}
                color="blue"
              >
                Code
              </TabButton>
              <TabButton
                isActive={activeRightTab === "testcase"}
                onClick={() => setActiveRightTab("testcase")}
                color="purple"
              >
                Testcase
              </TabButton>
              <TabButton
                isActive={activeRightTab === "result"}
                onClick={() => setActiveRightTab("result")}
                color="green"
              >
                Result
              </TabButton>
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col">
              {activeRightTab === "code" && (
                <div className="flex-1 flex flex-col">
                  {/* Language Selector */}
                  <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800/50">
                    <div className="flex gap-2">
                      {Object.keys(languageMap).map((lang) => (
                        <button
                          key={lang}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            selectedLanguage === lang
                              ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                          onClick={() => setSelectedLanguage(lang)}
                        >
                          {languageMap[lang]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monaco Editor */}
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      language={selectedLanguage}
                      value={code}
                      onChange={handleEditorChange}
                      theme="vs-dark"
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 border-t border-gray-700 flex justify-between bg-gray-800/50">
                    <button
                      className="px-4 py-2 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center gap-2"
                      onClick={() => setActiveRightTab("testcase")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      Console
                    </button>
                    <div className="flex gap-2">
                      <button
                        className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-all ${loading ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"}`}
                        onClick={handleRun}
                        disabled={loading}
                      >
                        {loading ? <span className="loading loading-spinner loading-xs"></span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>}
                        Run
                      </button>
                      <button
                        className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-all ${loading ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-green-600 to-teal-500 text-white hover:opacity-90 shadow-lg shadow-green-500/20"}`}
                        onClick={handleSubmitCode}
                        disabled={loading}
                      >
                        {loading ? <span className="loading loading-spinner loading-xs"></span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeRightTab === "testcase" && <RunResultPanel result={runResult} />}
              {activeRightTab === "result" && <SubmitResultPanel result={submitResult} />}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

// Helper components for cleaner JSX
const TabButton = ({ isActive, onClick, color, children }) => {
  const colorClasses = {
    blue: "text-blue-400 border-blue-500",
    purple: "text-purple-400 border-purple-500",
    green: "text-green-400 border-green-500",
    yellow: "text-yellow-400 border-yellow-500",
    cyan: "text-cyan-400 border-cyan-500",
  };
  return (
    <button
      className={`px-4 py-3 font-medium text-sm relative transition-colors duration-200 ${
        isActive ? colorClasses[color] : "text-gray-400 hover:text-gray-200"
      }`}
      onClick={onClick}
    >
      {children}
      {isActive && (
        <div className={`absolute bottom-0 left-0 w-full h-0.5 ${colorClasses[color].split(' ')[1]} rounded-full`}></div>
      )}
    </button>
  );
};

const ProblemDescription = ({ problem }) => (
  <div>
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${problem.difficulty === 'easy' ? 'bg-green-900/40 text-green-300' : problem.difficulty === 'medium' ? 'bg-yellow-900/40 text-yellow-300' : 'bg-red-900/40 text-red-300'}`}>
        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
      </div>
      <div className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">{problem.tags}</div>
    </div>
    <div className="prose prose-invert max-w-none text-gray-300">
      <div className="whitespace-pre-wrap text-sm leading-relaxed">{problem.description}</div>
    </div>
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">Examples</h3>
      <div className="space-y-4">
        {problem.visibleTestCases.map((example, index) => (
          <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 shadow-lg">
            <h4 className="font-semibold mb-2 text-gray-200 flex items-center gap-2">
              <span className="bg-gray-700 text-gray-300 h-6 w-6 rounded-full flex items-center justify-center text-xs">{index + 1}</span>
              Example {index + 1}
            </h4>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex gap-2"><span className="text-gray-400 flex-shrink-0">Input:</span><span className="text-gray-200">{example.input}</span></div>
              <div className="flex gap-2"><span className="text-gray-400 flex-shrink-0">Output:</span><span className="text-gray-200">{example.output}</span></div>
              <div className="flex gap-2"><span className="text-gray-400 flex-shrink-0">Explanation:</span><span className="text-gray-200">{example.explanation}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProblemEditorial = ({ problem }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-white">Editorial</h2>
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 shadow-lg">
      {problem?.secureUrl && problem?.thumbnailUrl && problem?.duration ? (
        <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
      ) : (
        <p className="text-gray-400">The editorial for this problem is not yet available.</p>
      )}
    </div>
  </div>
);

const ProblemSolutions = ({ problem }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-white">Solutions</h2>
    <div className="space-y-6">
      {problem.referenceSolution?.length > 0 ? (
        problem.referenceSolution.map((solution, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
            <div className="bg-gray-700/50 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-200">{problem?.title} - {solution?.language}</h3>
            </div>
            <div className="p-4">
              <pre className="bg-gray-900 p-4 rounded text-sm overflow-x-auto font-mono"><code className="text-gray-300">{solution?.completeCode}</code></pre>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-500">Solutions will be available after you solve the problem.</p>
        </div>
      )}
    </div>
  </div>
);

const RunResultPanel = ({ result }) => {
  if (!result) {
    return <div className="p-4 text-gray-500">Click "Run" to test your code.</div>;
  }
  return (
    <div className="p-4 overflow-y-auto">
      <div className={`p-5 rounded-xl border ${result.success ? 'border-green-500/30 bg-green-900/20' : 'border-red-500/30 bg-red-900/20'} shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className={`mt-1 p-2 rounded-full ${result.success ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
            {result.success ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
          </div>
          <div>
            <h4 className={`font-bold text-lg ${result.success ? 'text-green-300' : 'text-red-300'}`}>{result.success ? 'All test cases passed!' : 'Error'}</h4>
            <div className="mt-4 space-y-3">
              {result.testCases?.map((tc, i) => (
                <div key={i} className="bg-gray-800/30 p-3 rounded-lg border border-gray-700">
                  <div className="font-mono text-sm">
                    <div className={`mt-2 flex items-center gap-1 ${tc.status_id === 3 ? 'text-green-500' : 'text-red-500'}`}>
                      {tc.status_id === 3 ? '✓ Passed' : '✗ Failed'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubmitResultPanel = ({ result }) => {
  if (!result) {
    return <div className="p-4 text-gray-500">Click "Submit" to evaluate your solution.</div>;
  }
  return (
    <div className="p-4 overflow-y-auto">
      <div className={`p-5 rounded-xl border ${result.accepted ? 'border-green-500/30 bg-green-900/20' : 'border-red-500/30 bg-red-900/20'} shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className={`mt-1 p-2 rounded-full ${result.accepted ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
            {result.accepted ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
          </div>
          <div>
            <h4 className={`font-bold text-lg ${result.accepted ? 'text-green-300' : 'text-red-300'}`}>{result.accepted ? 'Accepted' : result.error}</h4>
            <div className="mt-4 space-y-3">
              <div className="flex gap-4">
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700"><div className="text-xs text-gray-400">Test Cases</div><div className={`font-mono ${result.accepted ? 'text-green-300' : 'text-red-300'}`}>{result.passedTestCases}/{result.totalTestCases}</div></div>
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700"><div className="text-xs text-gray-400">Runtime</div><div className="font-mono text-gray-200">{result.runtime} sec</div></div>
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700"><div className="text-xs text-gray-400">Memory</div><div className="font-mono text-gray-200">{result.memory} KB</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
