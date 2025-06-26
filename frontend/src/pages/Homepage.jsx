import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

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
      {/* Navigation Bar - Enhanced */}
      <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 shadow-xl px-6 py-3 border-b border-indigo-700">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 w-10 h-10 rounded-xl flex items-center justify-center">
              <span className="text-black font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              CodeShastra
            </span>
          </NavLink>

          <div className="flex items-center gap-6">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <div className="avatar placeholder">
                  <div className="bg-gradient-to-r pl-3.75 pt-2.5 from-amber-400 to-orange-500 text-sm text-black font-extrabold rounded-full w-10 h-10 flex items-center justify-center">
                    <span>{user?.firstName?.charAt(0)}</span>
                  </div>
                </div>
                <div className="group-hover:text-cyan-300 transition-colors">
                  <p className="font-medium">{user?.firstName}</p>
                  <p className="text-xs text-gray-300 group-hover:text-cyan-200">
                    {user?.role === "admin" ? "Admin" : "Member"}
                  </p>
                </div>
              </div>
              <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-gray-800 rounded-box w-52 border border-gray-700 z-50">
                {user?.role === "admin" && (
                  <li>
                    <NavLink
                      to="/admin"
                      className="text-white hover:bg-gray-700 rounded-lg py-2 px-4 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.029-.693-.084-1.024A5 5 0 0010 11z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Admin Dashboard
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink
                    to="/user"
                    className="text-white hover:bg-gray-700 rounded-lg py-2 px-4 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.029-.693-.084-1.024A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                    User Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contests"
                    className="text-white hover:bg-gray-700 rounded-lg py-2 px-4 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.029-.693-.084-1.024A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Contests
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:bg-gray-700 rounded-lg py-2 px-4 flex items-center w-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

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
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-800 pt-12 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold">C</span>
                </div>
                <span className="text-xl font-bold text-cyan-400">
                  CodeShastra
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Master coding skills with curated challenges and real-world
                problems.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">
                Platform
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    All Problems
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Contests
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Discuss
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Interview Prep
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} CodeShastra. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
