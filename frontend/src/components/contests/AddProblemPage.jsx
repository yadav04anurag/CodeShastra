import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { createContestProblem } from '../../services/contestService';
import { useSelector } from 'react-redux';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

const AddProblemPage = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [problem, setProblem] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    constraints: [''],
    sampleTestCases: [{ input: '', output: '', explanation: '' }],
    testCases: [{ input: '', output: '' }],
    starterCode: {
      javascript: `function solution(input) {\n  // Your code here\n  return input;\n}`,
      python: `def solution(input):\n  # Your code here\n  return input`,
      java: `public class Solution {\n  public static Object solution(Object input) {\n    // Your code here\n    return input;\n  }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\n// Your solution here\n`
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/contests');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConstraintChange = (index, value) => {
    const newConstraints = [...problem.constraints];
    newConstraints[index] = value;
    setProblem(prev => ({
      ...prev,
      constraints: newConstraints
    }));
  };

  const addConstraint = () => {
    setProblem(prev => ({
      ...prev,
      constraints: [...prev.constraints, '']
    }));
  };

  const removeConstraint = (index) => {
    if (problem.constraints.length <= 1) return;
    const newConstraints = problem.constraints.filter((_, i) => i !== index);
    setProblem(prev => ({
      ...prev,
      constraints: newConstraints
    }));
  };

  const handleSampleTestCaseChange = (index, field, value) => {
    const newSampleTestCases = [...problem.sampleTestCases];
    newSampleTestCases[index][field] = value;
    setProblem(prev => ({
      ...prev,
      sampleTestCases: newSampleTestCases
    }));
  };

  const addSampleTestCase = () => {
    setProblem(prev => ({
      ...prev,
      sampleTestCases: [...prev.sampleTestCases, { input: '', output: '', explanation: '' }]
    }));
  };

  const removeSampleTestCase = (index) => {
    if (problem.sampleTestCases.length <= 1) return;
    const newSampleTestCases = problem.sampleTestCases.filter((_, i) => i !== index);
    setProblem(prev => ({
      ...prev,
      sampleTestCases: newSampleTestCases
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...problem.testCases];
    newTestCases[index][field] = value;
    setProblem(prev => ({
      ...prev,
      testCases: newTestCases
    }));
  };

  const addTestCase = () => {
    setProblem(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', output: '' }]
    }));
  };

  const removeTestCase = (index) => {
    if (problem.testCases.length <= 1) return;
    const newTestCases = problem.testCases.filter((_, i) => i !== index);
    setProblem(prev => ({
      ...prev,
      testCases: newTestCases
    }));
  };

  const handleStarterCodeChange = (language, value) => {
    setProblem(prev => ({
      ...prev,
      starterCode: {
        ...prev.starterCode,
        [language]: value
      }
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!problem.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!problem.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (problem.constraints.some(c => !c.trim())) {
      newErrors.constraints = 'All constraints must be filled';
    }
    
    if (problem.sampleTestCases.some(tc => !tc.input.trim() || !tc.output.trim())) {
      newErrors.sampleTestCases = 'Sample test cases require input and output';
    }
    
    if (problem.testCases.some(tc => !tc.input.trim() || !tc.output.trim())) {
      newErrors.testCases = 'Test cases require input and output';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setIsSubmitting(true);
      setErrors({});
      
      const problemData = {
        ...problem,
        contest: contestId,
        creator: user._id
      };
      
      await createContestProblem(problemData);
      
      setSuccessMessage('Problem created successfully!');
      setTimeout(() => {
        navigate(`/contests/${contestId}`);
      }, 1500);
    } catch (error) {
      console.error('Failed to create problem:', error);
      setErrors({ submit: error.message || 'Failed to create problem' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 md:p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Create New Problem</h1>
            <button 
              onClick={() => navigate(`/contests/${contestId}`)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Contest
            </button>
          </div>
          
          {successMessage && (
            <div className="bg-green-500/20 text-green-400 p-3 rounded-lg mb-6">
              {successMessage}
            </div>
          )}
          
          {errors.submit && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-6">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Problem Title */}
            <div>
              <label className="block text-gray-300 mb-2">Problem Title</label>
              <input
                type="text"
                name="title"
                value={problem.title}
                onChange={handleChange}
                className={`w-full bg-gray-800 border ${
                  errors.title ? 'border-red-500' : 'border-gray-700'
                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                placeholder="Enter problem title"
              />
              {errors.title && <p className="text-red-500 mt-1">{errors.title}</p>}
            </div>
            
            {/* Problem Description */}
            <div>
              <label className="block text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={problem.description}
                onChange={handleChange}
                rows={8}
                className={`w-full bg-gray-800 border ${
                  errors.description ? 'border-red-500' : 'border-gray-700'
                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                placeholder="Describe the problem in detail, including examples and explanations"
              />
              {errors.description && <p className="text-red-500 mt-1">{errors.description}</p>}
            </div>
            
            {/* Difficulty */}
            <div>
              <label className="block text-gray-300 mb-2">Difficulty</label>
              <select
                name="difficulty"
                value={problem.difficulty}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            {/* Constraints */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-300">Constraints</label>
                <button
                  type="button"
                  onClick={addConstraint}
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  + Add Constraint
                </button>
              </div>
              
              {problem.constraints.map((constraint, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={constraint}
                    onChange={(e) => handleConstraintChange(index, e.target.value)}
                    className={`flex-1 bg-gray-800 border ${
                      errors.constraints ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    placeholder={`Constraint ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeConstraint(index)}
                    className="ml-2 text-red-500 hover:text-red-400 p-2"
                    disabled={problem.constraints.length <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {errors.constraints && <p className="text-red-500 mt-1">{errors.constraints}</p>}
            </div>
            
            {/* Sample Test Cases */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-300">Sample Test Cases</label>
                <button
                  type="button"
                  onClick={addSampleTestCase}
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  + Add Sample Test Case
                </button>
              </div>
              
              {problem.sampleTestCases.map((testCase, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 mb-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-gray-300 font-medium">Sample Test Case {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeSampleTestCase(index)}
                      className="text-red-500 hover:text-red-400"
                      disabled={problem.sampleTestCases.length <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-1">Input</label>
                      <textarea
                        value={testCase.input}
                        onChange={(e) => handleSampleTestCaseChange(index, 'input', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        rows={3}
                        placeholder="Input value or data"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Output</label>
                      <textarea
                        value={testCase.output}
                        onChange={(e) => handleSampleTestCaseChange(index, 'output', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        rows={3}
                        placeholder="Expected output"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-gray-400 mb-1">Explanation (Optional)</label>
                    <textarea
                      value={testCase.explanation}
                      onChange={(e) => handleSampleTestCaseChange(index, 'explanation', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      rows={2}
                      placeholder="Explanation of the test case"
                    />
                  </div>
                </div>
              ))}
              
              {errors.sampleTestCases && <p className="text-red-500">{errors.sampleTestCases}</p>}
            </div>
            
            {/* Test Cases (Hidden) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-300">Test Cases (Hidden)</label>
                <button
                  type="button"
                  onClick={addTestCase}
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  + Add Test Case
                </button>
              </div>
              
              {problem.testCases.map((testCase, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4 mb-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-gray-300 font-medium">Test Case {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeTestCase(index)}
                      className="text-red-500 hover:text-red-400"
                      disabled={problem.testCases.length <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-1">Input</label>
                      <textarea
                        value={testCase.input}
                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        rows={3}
                        placeholder="Input value or data"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Output</label>
                      <textarea
                        value={testCase.output}
                        onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        rows={3}
                        placeholder="Expected output"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {errors.testCases && <p className="text-red-500">{errors.testCases}</p>}
            </div>
            
            {/* Starter Code */}
            <div>
              <label className="block text-gray-300 mb-2">Starter Code</label>
              
              <div className="mb-4">
                <h3 className="text-gray-400 mb-2">JavaScript</h3>
                <AceEditor
                  mode="javascript"
                  theme="monokai"
                  value={problem.starterCode.javascript}
                  onChange={(value) => handleStarterCodeChange('javascript', value)}
                  name="javascript_editor"
                  editorProps={{ $blockScrolling: true }}
                  height="200px"
                  width="100%"
                  fontSize={14}
                  showPrintMargin={false}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              </div>
              
              <div className="mb-4">
                <h3 className="text-gray-400 mb-2">Python</h3>
                <AceEditor
                  mode="python"
                  theme="monokai"
                  value={problem.starterCode.python}
                  onChange={(value) => handleStarterCodeChange('python', value)}
                  name="python_editor"
                  editorProps={{ $blockScrolling: true }}
                  height="200px"
                  width="100%"
                  fontSize={14}
                  showPrintMargin={false}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              </div>
              
              <div className="mb-4">
                <h3 className="text-gray-400 mb-2">Java</h3>
                <AceEditor
                  mode="java"
                  theme="monokai"
                  value={problem.starterCode.java}
                  onChange={(value) => handleStarterCodeChange('java', value)}
                  name="java_editor"
                  editorProps={{ $blockScrolling: true }}
                  height="200px"
                  width="100%"
                  fontSize={14}
                  showPrintMargin={false}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              </div>
              
              <div>
                <h3 className="text-gray-400 mb-2">C++</h3>
                <AceEditor
                  mode="c_cpp"
                  theme="monokai"
                  value={problem.starterCode.cpp}
                  onChange={(value) => handleStarterCodeChange('cpp', value)}
                  name="cpp_editor"
                  editorProps={{ $blockScrolling: true }}
                  height="200px"
                  width="100%"
                  fontSize={14}
                  showPrintMargin={false}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold px-8 py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Problem...' : 'Create Problem'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProblemPage;