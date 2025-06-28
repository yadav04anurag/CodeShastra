// src/pages/admin/UpdateProblem.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import axiosClient from '../utils/axiosClient';
import { Trash2, Edit, Save, X, Plus, Code, TestTube, Tag, ChevronLeft } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const UpdateProblem = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { problemId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    tags: [],
    visibleTestCases: [{ input: '', output: '' }],
    hiddenTestCases: [{ input: '', output: '' }],
    starterCode: [{ language: 'javascript', code: '' }],
    referenceSolution: [{ language: 'javascript', code: '' }],
    problemCreator: '',
  });

  // Fetch all problems on component mount
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/problem/getAllProblem');
        setProblems(response.data);
        setError('');
        
        // If URL has problemId param, select that problem after problems are loaded
        if (problemId) {
          const problem = response.data.find(p => p._id === problemId);
          if (problem) {
            setSelectedProblem(problem);
            fetchProblemDetails(problem._id);
          } else {
            setError('Problem not found');
          }
        }
      } catch (err) {
        setError('Failed to fetch problems');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [problemId]);

  // Fetch details for a specific problem
  const fetchProblemDetails = async (id) => {
    try {
      setLoadingDetails(true);
      const response = await axiosClient.get(`/problem/problemById/${id}`);
      const problemData = response.data;
      
      setFormData({
        title: problemData.title,
        description: problemData.description,
        difficulty: problemData.difficulty,
        tags: problemData.tags || [],
        visibleTestCases: problemData.visibleTestCases || [{ input: '', output: '' }],
        hiddenTestCases: problemData.hiddenTestCases || [{ input: '', output: '' }],
        starterCode: problemData.starterCode || [{ language: 'javascript', code: '' }],
        referenceSolution: problemData.referenceSolution || [{ language: 'javascript', code: '' }],
        problemCreator: problemData.problemCreator || '',
      });
      
      setIsEditing(false); // Reset editing state
      setError('');
    } catch (err) {
      setError(`Failed to fetch problem details: ${err.message}`);
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle problem selection
  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    fetchProblemDetails(problem._id);
    navigate(`/admin/update/${problem._id}`);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle tags input
  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({ ...prev, tags }));
  };

  // Handle test case changes
  const handleTestCaseChange = (type, index, field, value) => {
    setFormData(prev => {
      const newTestCases = [...prev[type]];
      newTestCases[index][field] = value;
      return { ...prev, [type]: newTestCases };
    });
  };

  // Add a new test case
  const addTestCase = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], { input: '', output: '' }]
    }));
  };

  // Remove a test case
  const removeTestCase = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  // Handle code changes
  const handleCodeChange = (type, index, value) => {
    setFormData(prev => {
      const newCode = [...prev[type]];
      newCode[index] = { ...newCode[index], code: value };
      return { ...prev, [type]: newCode };
    });
  };

  // Handle language changes
  const handleLanguageChange = (type, index, value) => {
    setFormData(prev => {
      const newCode = [...prev[type]];
      newCode[index] = { ...newCode[index], language: value };
      return { ...prev, [type]: newCode };
    });
  };

  // Add a new code block
  const addCodeBlock = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], { language: 'javascript', code: '' }]
    }));
  };

  // Remove a code block
  const removeCodeBlock = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  // Submit the updated problem
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosClient.put(`/problem/update/${selectedProblem._id}`, formData);
      toast.success('Problem updated successfully!');
      setIsEditing(false);
      
      // Refresh problem list
      const response = await axiosClient.get('/problem/getAllProblem');
      setProblems(response.data);
      
      // Refresh the problem details
      fetchProblemDetails(selectedProblem._id);
    } catch (err) {
      toast.error(`Error updating problem: ${err.response?.data || err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Difficulty badge styling
  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-error';
      default: return 'badge-info';
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => navigate('/admin')}
              className="btn btn-ghost flex items-center gap-2"
            >
              <ChevronLeft size={20} />
              Back to Admin Panel
            </button>
            <h1 className="text-3xl font-bold mt-2">Update Problems</h1>
            <p className="text-base-content/70">Select and update coding problems</p>
          </div>
          
          {selectedProblem && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="btn btn-outline btn-error"
                  >
                    <X size={18} className="mr-2" /> Cancel
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" variant="light" />
                    ) : (
                      <>
                        <Save size={18} className="mr-2" /> Save Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-warning"
                >
                  <Edit size={18} className="mr-2" /> Edit Problem
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Problem List */}
          <div className="lg:col-span-1 bg-base-100 rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Code size={20} /> All Problems
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" variant="primary" />
              </div>
            ) : problems.length === 0 ? (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>No problems found. Create some first!</span>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[70vh]">
                {problems.map(problem => (
                  <div 
                    key={problem._id}
                    className={`card cursor-pointer mb-4 transition-all ${
                      selectedProblem?._id === problem._id 
                        ? 'bg-primary/10 border-l-4 border-primary' 
                        : 'bg-base-100 hover:bg-base-200'
                    }`}
                    onClick={() => handleSelectProblem(problem)}
                  >
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="card-title text-lg">{problem.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className={`badge ${getDifficultyClass(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                            {problem.tags?.slice(0, 3).map((tag, index) => (
                              <span key={index} className="badge badge-outline">
                                {tag}
                              </span>
                            ))}
                            {problem.tags?.length > 3 && (
                              <span className="badge badge-ghost">
                                +{problem.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectProblem(problem);
                            }}
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Problem Details */}
          <div className="lg:col-span-2">
            {loadingDetails ? (
              <div className="bg-base-100 rounded-xl shadow-lg p-8 flex justify-center items-center h-full">
                <LoadingSpinner size="lg" variant="primary" />
                <span className="ml-4">Loading problem details...</span>
              </div>
            ) : selectedProblem ? (
              <div className="bg-base-100 rounded-xl shadow-lg p-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Problem Title */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Problem Title</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Description</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full h-40"
                        required
                      />
                    </div>

                    {/* Difficulty and Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Difficulty</span>
                        </label>
                        <select
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleChange}
                          className="select select-bordered w-full"
                          required
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Tags (comma separated)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.tags.join(', ')}
                          onChange={handleTagsChange}
                          className="input input-bordered w-full"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.tags.map((tag, index) => (
                            <span key={index} className="badge badge-outline">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Visible Test Cases */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <TestTube size={18} /> Visible Test Cases
                        </h3>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-success"
                          onClick={() => addTestCase('visibleTestCases')}
                        >
                          <Plus size={16} /> Add Test Case
                        </button>
                      </div>
                      
                      {formData.visibleTestCases.map((testCase, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="label">
                              <span className="label-text">Input</span>
                            </label>
                            <textarea
                              value={testCase.input}
                              onChange={(e) => handleTestCaseChange('visibleTestCases', index, 'input', e.target.value)}
                              className="textarea textarea-bordered w-full"
                              required
                            />
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text">Output</span>
                            </label>
                            <textarea
                              value={testCase.output}
                              onChange={(e) => handleTestCaseChange('visibleTestCases', index, 'output', e.target.value)}
                              className="textarea textarea-bordered w-full"
                              required
                            />
                          </div>
                          <div className="md:col-span-2 flex justify-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-error"
                              onClick={() => removeTestCase('visibleTestCases', index)}
                            >
                              <Trash2 size={16} /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Hidden Test Cases */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <TestTube size={18} /> Hidden Test Cases
                        </h3>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-success"
                          onClick={() => addTestCase('hiddenTestCases')}
                        >
                          <Plus size={16} /> Add Test Case
                        </button>
                      </div>
                      
                      {formData.hiddenTestCases.map((testCase, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="label">
                              <span className="label-text">Input</span>
                            </label>
                            <textarea
                              value={testCase.input}
                              onChange={(e) => handleTestCaseChange('hiddenTestCases', index, 'input', e.target.value)}
                              className="textarea textarea-bordered w-full"
                              required
                            />
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text">Output</span>
                            </label>
                            <textarea
                              value={testCase.output}
                              onChange={(e) => handleTestCaseChange('hiddenTestCases', index, 'output', e.target.value)}
                              className="textarea textarea-bordered w-full"
                              required
                            />
                          </div>
                          <div className="md:col-span-2 flex justify-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-error"
                              onClick={() => removeTestCase('hiddenTestCases', index)}
                            >
                              <Trash2 size={16} /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Starter Code */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Code size={18} /> Starter Code
                        </h3>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-success"
                          onClick={() => addCodeBlock('starterCode')}
                        >
                          <Plus size={16} /> Add Language
                        </button>
                      </div>
                      
                      {formData.starterCode.map((codeBlock, index) => (
                        <div key={index} className="mb-6">
                          <div className="flex justify-between mb-2">
                            <select
                              value={codeBlock.language}
                              onChange={(e) => handleLanguageChange('starterCode', index, e.target.value)}
                              className="select select-bordered"
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="python">Python</option>
                              <option value="java">Java</option>
                              <option value="c++">C++</option>
                            </select>
                            <button
                              type="button"
                              className="btn btn-sm btn-error"
                              onClick={() => removeCodeBlock('starterCode', index)}
                            >
                              <Trash2 size={16} /> Remove
                            </button>
                          </div>
                          <textarea
                            value={codeBlock.code}
                            onChange={(e) => handleCodeChange('starterCode', index, e.target.value)}
                            className="textarea textarea-bordered w-full h-40 font-mono"
                            required
                          />
                        </div>
                      ))}
                    </div>

                    {/* Reference Solution */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Code size={18} /> Reference Solution
                        </h3>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-success"
                          onClick={() => addCodeBlock('referenceSolution')}
                        >
                          <Plus size={16} /> Add Language
                        </button>
                      </div>
                      
                      {formData.referenceSolution.map((codeBlock, index) => (
                        <div key={index} className="mb-6">
                          <div className="flex justify-between mb-2">
                            <select
                              value={codeBlock.language}
                              onChange={(e) => handleLanguageChange('referenceSolution', index, e.target.value)}
                              className="select select-bordered"
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="python">Python</option>
                              <option value="java">Java</option>
                              <option value="c++">C++</option>
                            </select>
                            <button
                              type="button"
                              className="btn btn-sm btn-error"
                              onClick={() => removeCodeBlock('referenceSolution', index)}
                            >
                              <Trash2 size={16} /> Remove
                            </button>
                          </div>
                          <textarea
                            value={codeBlock.code}
                            onChange={(e) => handleCodeChange('referenceSolution', index, e.target.value)}
                            className="textarea textarea-bordered w-full h-40 font-mono"
                            required
                          />
                        </div>
                      ))}
                    </div>

                    {/* Problem Creator */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Problem Creator</span>
                      </label>
                      <input
                        type="text"
                        name="problemCreator"
                        value={formData.problemCreator}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                      <button 
                        type="button" 
                        className="btn btn-outline btn-error"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <LoadingSpinner size="sm" variant="light" />
                        ) : (
                          'Update Problem'
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Problem Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold">{formData.title}</h2>
                        <div className="flex items-center gap-4 mt-2">
                          <span className={`badge ${getDifficultyClass(formData.difficulty)}`}>
                            {formData.difficulty}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                              <span key={index} className="badge badge-outline">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="prose max-w-none">
                      <h3 className="font-semibold">Description</h3>
                      <p className="whitespace-pre-wrap">{formData.description}</p>
                    </div>

                    {/* Visible Test Cases */}
                    <div>
                      <h3 className="font-semibold mb-2">Visible Test Cases</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.visibleTestCases.map((testCase, index) => (
                          <div key={index} className="bg-base-200 rounded-lg p-4">
                            <div className="mb-3">
                              <span className="font-medium">Input:</span>
                              <pre className="bg-base-300 p-2 rounded mt-1 overflow-x-auto">{testCase.input}</pre>
                            </div>
                            <div>
                              <span className="font-medium">Output:</span>
                              <pre className="bg-base-300 p-2 rounded mt-1 overflow-x-auto">{testCase.output}</pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Starter Code */}
                    <div>
                      <h3 className="font-semibold mb-2">Starter Code</h3>
                      {formData.starterCode.map((codeBlock, index) => (
                        <div key={index} className="mb-4">
                          <div className="badge badge-info mb-2">{codeBlock.language}</div>
                          <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto">
                            <code>{codeBlock.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>

                    {/* Reference Solution */}
                    <div>
                      <h3 className="font-semibold mb-2">Reference Solution</h3>
                      {formData.referenceSolution.map((codeBlock, index) => (
                        <div key={index} className="mb-4">
                          <div className="badge badge-success mb-2">{codeBlock.language}</div>
                          <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto">
                            <code>{codeBlock.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-base-100 rounded-xl shadow-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-base-200 p-4 rounded-full">
                    <Code size={48} className="text-base-content/70" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">Select a Problem</h2>
                <p className="text-base-content/70 mb-6">
                  Choose a problem from the list to view and edit its details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProblem;