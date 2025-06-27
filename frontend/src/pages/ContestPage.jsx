// src/pages/ContestPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  getContestById, 
  registerForContest, 
  getContestLeaderboard 
} from '../services/contestService';
import { useSelector } from 'react-redux';
import ContestDetails from '../components/contests/ContestDetails';
import ContestProblems from '../components/contests/ContestProblems';
import ContestEditor from '../components/contests/ContestEditor';
import Leaderboard from '../components/contests/Leaderboard';
import TabNavigation from '../components/contests/TabNavigation';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { format } from 'date-fns';

const ContestPage = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('problems');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        setError('');
        const contestData = await getContestById(contestId);
        setContest(contestData);
        
        // Check if user is registered
        if (user && contestData.participants) {
          setIsRegistered(contestData.participants.some(p => p._id === user._id));
        }
        
        // Fetch leaderboard if contest is completed
        if (new Date(contestData.endDate) < new Date()) {
          const leaderboardData = await getContestLeaderboard(contestId);
          setLeaderboard(leaderboardData);
        }
      } catch (err) {
        console.error('Failed to fetch contest:', err);
        setError('Failed to load contest. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId, user]);

  useEffect(() => {
    if (!contest) return;
    
    const timer = setInterval(() => {
      const now = new Date();
      const startDate = new Date(contest.startDate);
      const endDate = new Date(contest.endDate);
      
      if (now < startDate) {
        // Contest hasn't started yet
        const diff = startDate - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`Starts in ${hours}h ${minutes}m`);
      } else if (now < endDate) {
        // Contest is ongoing
        const diff = endDate - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else {
        // Contest has ended
        setTimeRemaining('Contest ended');
        clearInterval(timer);
      }
    }, 60000);
    
    // Initial call
    const now = new Date();
    const startDate = new Date(contest.startDate);
    const endDate = new Date(contest.endDate);
    
    if (now < startDate) {
      const diff = startDate - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`Starts in ${hours}h ${minutes}m`);
    } else if (now < endDate) {
      const diff = endDate - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    } else {
      setTimeRemaining('Contest ended');
    }
    
    return () => clearInterval(timer);
  }, [contest]);

  const handleRegister = async () => {
    try {
      setRegisterLoading(true);
      await registerForContest(contestId, user.token);
      setIsRegistered(true);
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Failed to register for contest. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
    setActiveTab('editor');
  };

  const getContestStatus = () => {
    if (!contest) return 'loading';
    const now = new Date();
    const startDate = new Date(contest.startDate);
    const endDate = new Date(contest.endDate);
    
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'ongoing';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl max-w-md w-full text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button 
            onClick={() => navigate('/contests')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Contests
          </button>
        </div>
      </div>
    );
  }

  const contestStatus = getContestStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <ContestDetails 
        contest={contest} 
        timeRemaining={timeRemaining} 
        status={contestStatus}
      />
      
      <div className="container mx-auto px-4 py-8">
        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          showEditor={selectedProblem !== null}
          contestStatus={contestStatus}
          isRegistered={isRegistered}
        />
        
        {!isRegistered && contestStatus !== 'completed' && (
          <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/50 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-amber-300 mb-2">Registration Required</h3>
              <p className="text-amber-200/80">
                You must register to participate in this contest
              </p>
            </div>
            <button
              onClick={handleRegister}
              disabled={registerLoading}
              className="mt-4 md:mt-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold px-6 py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {registerLoading ? 'Registering...' : 'Register Now'}
            </button>
          </div>
        )}

        <div className="mt-6">
          {activeTab === 'problems' && (
            <ContestProblems 
              problems={contest.problems} 
              onProblemSelect={handleProblemSelect}
              contestStatus={contestStatus}
              isRegistered={isRegistered}
            />
          )}
          
          {activeTab === 'editor' && selectedProblem && (
            <ContestEditor 
              contest={contest} 
              problem={selectedProblem} 
              onProblemChange={setSelectedProblem}
              problems={contest.problems}
              contestId={contestId}
            />
          )}
          
          {activeTab === 'leaderboard' && (
            <Leaderboard 
              leaderboard={leaderboard} 
              problems={contest.problems} 
            />
          )}
          
          {activeTab === 'rules' && (
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6">
              <h2 className="text-2xl font-bold mb-6">Contest Rules</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">General Rules</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300">
                    <li>All participants must register before the contest starts</li>
                    <li>Participants may only use one account</li>
                    <li>Any form of cheating will result in disqualification</li>
                    <li>Discussion of problems during the contest is prohibited</li>
                  </ul>
                </div>
                
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">Submission Rules</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300">
                    <li>Each problem has a specific time limit per test case</li>
                    <li>Memory limits are enforced per problem</li>
                    <li>You can submit solutions multiple times</li>
                    <li>The last submission for each problem will be considered</li>
                  </ul>
                </div>
                
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">Scoring</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300">
                    <li>Points are awarded for each solved problem</li>
                    <li>Tie-breakers are determined by total time taken</li>
                    <li>Time penalty of 10 minutes per incorrect submission</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestPage;