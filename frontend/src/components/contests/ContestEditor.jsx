import { useState, useEffect } from 'react';
import { runContestCode, submitContestSolution } from '../../services/contestService';
import { useSelector } from 'react-redux';

const ContestEditor = ({ contest, problem, onProblemChange, problems, contestId }) => {
  const { user } = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [finalSubmitResult, setFinalSubmitResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (problem) {
      setCode(`function solution(input) {
  // Your code here
  return input;
}`);
      setRunResult(null);
      setFinalSubmitResult(null);
    }
  }, [problem]);

  const handleRunCode = async () => {
    if (!problem || !code.trim()) return;
    
    try {
      setIsSubmitting(true);
      setRunResult(null);
      setError(null);
      
      const result = await runContestCode(
        contestId,
        problem._id,
        code,
        language,
        user.token
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
      
      const result = await submitContestSolution(
        contestId,
        problem._id,
        code,
        language,
        user.token
      );
      
      setFinalSubmitResult(result);
    } catch (error) {
      console.error('Submission failed:', error);
      setError('Failed to submit solution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '';
    switch (status) {
      case 'accepted': return 'bg-green-500/20 text-green-400';
      case 'wrong answer': return 'bg-red-500/20 text-red-400';
      case 'time limit exceeded': return 'bg-yellow-500/20 text-yellow-400';
      case 'runtime error': return 'bg-orange-500/20 text-orange-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Problem Selector */}
        <div className="md:w-1/3">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h3 className="text-lg font-medium text-white mb-4">Select Problem</h3>
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
                <h3 className="text-lg font-medium text-white mb-2">{problem.title}</h3>
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
                  <div>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-gray-700 text-white rounded px-3 py-1"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                </div>
                
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 bg-gray-900 text-white font-mono p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  spellCheck="false"
                ></textarea>
                
                <div className="mt-4 flex flex-wrap gap-4">
                  <button
                    onClick={handleRunCode}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Running...' : 'Run Code'}
                  </button>
                  <button
                    onClick={handleSubmitCode}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold px-6 py-2 rounded-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                  </button>
                </div>
                
                {error && (
                  <div className="mt-4 bg-red-500/20 text-red-400 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                {runResult && (
                  <div className="mt-4 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Execution Results</h4>
                    <div className="space-y-2">
                      {runResult.results?.map((result, i) => (
                        <div key={i} className="bg-gray-900 p-3 rounded">
                          <p className="text-sm text-gray-400">Test Case {i + 1}</p>
                          <p className={`${result.status_id === 3 ? 'text-green-400' : 'text-red-400'}`}>
                            {result.status_id === 3 ? '✓ Passed' : '✗ Failed'}
                          </p>
                          {result.stderr && (
                            <pre className="text-red-400 text-sm mt-1">{result.stderr}</pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {finalSubmitResult && (
                  <div className="mt-4 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Submission Result</h4>
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
                      <p className="mt-2">
                        Test Cases: {finalSubmitResult.testCasesPassed || 0} / {finalSubmitResult.testCasesTotal || 0}
                      </p>
                      {finalSubmitResult.executionTime && (
                        <p>Execution Time: {finalSubmitResult.executionTime} ms</p>
                      )}
                      {finalSubmitResult.memory && (
                        <p>Memory Used: {finalSubmitResult.memory} KB</p>
                      )}
                      {finalSubmitResult.errorMessage && (
                        <pre className="text-sm mt-2">{finalSubmitResult.errorMessage}</pre>
                      )}
                    </div>
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