import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  // --- 1. Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 5; // Display 5 problems per page

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      if (!user) return;
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    fetchSolvedProblems();
  }, [user]);

  // --- 2. Reset to page 1 whenever filters change ---
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  // This is your original filtering logic, unchanged as requested.
  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === "all" || problem.tags === filters.tag;
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" &&
        solvedProblems.some((sp) => sp._id === problem._id));
    return difficultyMatch && tagMatch && statusMatch;
  });

  // --- 3. Pagination Logic ---
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0); // Scroll to top on page change
    }
  };

  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 border border-green-400/30 text-green-300";
      case "medium":
        return "bg-yellow-500/10 border border-yellow-400/30 text-yellow-300";
      case "hard":
        return "bg-red-500/10 border border-red-400/30 text-red-300";
      default:
        return "bg-gray-700 border-gray-600 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      <Header></Header>

      {/* Main Content - Enhanced */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 pb-5">
            Coding Challenges
          </h1>
          <p className="text-gray-400 mb-8">
            Sharpen your skills with our curated collection of problems
          </p>

          {/* Filters - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div>
              <label className="block text-gray-300 font-medium mb-3 text-sm uppercase tracking-wider">
                Status
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl py-3 pl-4 pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="all">All Problems</option>
                  <option value="solved">Solved Problems</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-3 text-sm uppercase tracking-wider">
                Difficulty
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl py-3 pl-4 pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
                  value={filters.difficulty}
                  onChange={(e) =>
                    setFilters({ ...filters, difficulty: e.target.value })
                  }
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-3 text-sm uppercase tracking-wider">
                Category
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl py-3 pl-4 pr-10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
                  value={filters.tag}
                  onChange={(e) =>
                    setFilters({ ...filters, tag: e.target.value })
                  }
                >
                  <option value="all">All Tags</option>
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Problems List - Enhanced */}
          <div className="grid gap-5">
            {currentProblems.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-300 mb-2">
                    No problems found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              </div>
            ) : (
              // --- 4. Map over `currentProblems` ---
              currentProblems.map((problem) => (
                <div
                  key={problem._id}
                  className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-cyan-500/30"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold mb-1.5">
                          <NavLink
                            to={`/problem/${problem._id}`}
                            className="hover:text-cyan-400 transition-colors"
                          >
                            {problem.title}
                          </NavLink>
                        </h2>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <div
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${getDifficultyBadgeColor(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </div>
                          <div className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 border border-blue-400/30 text-blue-300">
                            {problem.tags}
                          </div>
                        </div>
                      </div>

                      {solvedProblems.some((sp) => sp._id === problem._id) && (
                        <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-full shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 flex-shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">Solved</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* --- 5. Pagination Component --- */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`flex items-center justify-center w-10 h-10 text-base font-medium rounded-lg transition-colors border ${
                        currentPage === page
                          ? "bg-cyan-500 text-gray-900 font-bold border-cyan-400"
                          : "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modern Footer */}
      <Footer></Footer>
    </div>
  );
}

export default Homepage;
