import axios from 'axios';

const API_URL = '/getcontests';

// // Get all contests
// export const getContests = async () => {
//   const response = await axios.get(API_URL);
//   return response.data;
// };

// // Get contest by ID
// export const getContestById = async (id) => {
//   const response = await axios.get(`${API_URL}/${id}`);
//   return response.data;
// };

// // Create a new contest
// export const createContest = async (contestData, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   const response = await axios.post(API_URL, contestData, config);
//   return response.data;
// };

// // Register for a contest
// export const registerForContest = async (contestId, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   const response = await axios.post(`${API_URL}/register/${contestId}`, {}, config);
//   return response.data;
// };

// // Run code against sample test cases
// export const runContestCode = async (contestId, problemId, code, language, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   const response = await axios.post(
//     `${API_URL}/${contestId}/submit/run/${problemId}`,
//     { code, language },
//     config
//   );
//   return response.data;
// };

// // Submit final solution
// export const submitContestSolution = async (contestId, problemId, code, language, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
//   const response = await axios.post(
//     `${API_URL}/${contestId}/submit/submit_final/${problemId}`,
//     { code, language },
//     config
//   );
//   return response.data;
// };

// // Get contest leaderboard
// export const getContestLeaderboard = async (contestId) => {
//   const response = await axios.get(`${API_URL}/${contestId}/leaderboard`);
//   return response.data;
// };


import axiosClient from '../utils/axiosClient'; // Import your configured axios client

const CONTEST_API_URL = '/getcontests'; // Base URL for contest endpoints

// Get all contests
export const getContests = async () => {
  try {
    const response = await axiosClient.get(CONTEST_API_URL);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch contests:', error);
    throw error;
  }
};

// Get contest by ID
export const getContestById = async (id) => {
  try {
    const response = await axiosClient.get(`${CONTEST_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch contest ${id}:`, error);
    throw error;
  }
};

// Create a new contest
export const createContest = async (contestData) => {
  try {
    const response = await axiosClient.post(CONTEST_API_URL, contestData);
    return response.data;
  } catch (error) {
    console.error('Failed to create contest:', error);
    throw error;
  }
};

// Register for a contest
export const registerForContest = async (contestId) => {
  try {
    const response = await axiosClient.post(`${CONTEST_API_URL}/register/${contestId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to register for contest ${contestId}:`, error);
    throw error;
  }
};

// Run code against sample test cases
export const runContestCode = async (contestId, problemId, code, language) => {
  try {
    const response = await axiosClient.post(
      `${CONTEST_API_URL}/${contestId}/submit/run/${problemId}`,
      { code, language }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to run contest code:', error);
    throw error;
  }
};

// Submit final solution
export const submitContestSolution = async (contestId, problemId, code, language) => {
  try {
    const response = await axiosClient.post(
      `${CONTEST_API_URL}/${contestId}/submit/submit_final/${problemId}`,
      { code, language }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to submit contest solution:', error);
    throw error;
  }
};

// Get contest leaderboard
export const getContestLeaderboard = async (contestId) => {
  try {
    const response = await axiosClient.get(`${CONTEST_API_URL}/${contestId}/leaderboard`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get leaderboard for contest ${contestId}:`, error);
    throw error;
  }
};


export const createContestProblem = async (problemData) => {
  try {
    const response = await axiosClient.post(
      `${CONTEST_API_URL}/${problemData.contest}/problems`,
      problemData
    );
    return response.data;
  } catch (error) {
    console.error('Failed to create contest problem:', error);
    throw error;
  }
};