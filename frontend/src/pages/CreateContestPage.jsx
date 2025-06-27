// src/pages/CreateContestPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { createContest } from '../services/contestService';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateContestPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [contestData, setContestData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '', // Default 2 hours
    duration: 0,
    rules: '',
    prizes: '',
    participants: [],
    problems: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date, field) => {
    setContestData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!contestData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!contestData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (contestData.startDate >= contestData.endDate) {
      newErrors.dates = 'End date must be after start date';
    }
    
    if (contestData.duration < 5 || contestData.duration > 600) {
      newErrors.duration = 'Duration must be between 5 and 600 minutes';
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
      
      const contest = {
        ...contestData,
        creator: user._id,
        startDate: contestData.startDate.toISOString(),
        endDate: contestData.endDate.toISOString(),
      };
      
      const createdContest = await createContest(contest);
      
      setSuccessMessage('Contest created successfully!');
      setTimeout(() => {
        navigate(`/contests/${createdContest._id}/add-problem`);
      }, 1500);
    } catch (error) {
      console.error('Failed to create contest:', error);
      setErrors({ submit: error.message || 'Failed to create contest' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 md:p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Create New Contest</h1>
            <button 
              onClick={() => navigate('/admin')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Admin
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contest Title */}
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Contest Title</label>
                <input
                  type="text"
                  name="title"
                  value={contestData.title}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${
                    errors.title ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="Enter contest title"
                />
                {errors.title && <p className="text-red-500 mt-1">{errors.title}</p>}
              </div>
              
              {/* Contest Description */}
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={contestData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full bg-gray-800 border ${
                    errors.description ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="Describe the contest, its purpose, and any important details"
                />
                {errors.description && <p className="text-red-500 mt-1">{errors.description}</p>}
              </div>
              
              {/* Start Date */}
              <div>
                <label className="block text-gray-300 mb-2">Start Date & Time</label>
                <DatePicker
                  selected={contestData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className={`w-full bg-gray-800 border ${
                    errors.dates ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                />
              </div>
              
              {/* End Date */}
              <div>
                <label className="block text-gray-300 mb-2">End Date & Time</label>
                <DatePicker
                  selected={contestData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className={`w-full bg-gray-800 border ${
                    errors.dates ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                />
                {errors.dates && <p className="text-red-500 mt-1">{errors.dates}</p>}
              </div>
              
              {/* Duration */}
              <div>
                <label className="block text-gray-300 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={contestData.duration}
                  onChange={handleChange}
                  min="10"
                  max="600"
                  className={`w-full bg-gray-800 border ${
                    errors.duration ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                />
                {errors.duration && <p className="text-red-500 mt-1">{errors.duration}</p>}
              </div>
              
              {/* Rules */}
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Rules</label>
                <textarea
                  name="rules"
                  value={contestData.rules}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="List contest rules and guidelines"
                />
              </div>
              
              {/* Prizes */}
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Prizes</label>
                <textarea
                  name="prizes"
                  value={contestData.prizes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Describe prizes for winners"
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold px-8 py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Contest...' : 'Create Contest'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateContestPage;