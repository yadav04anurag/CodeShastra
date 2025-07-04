import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo";
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload";
import UpdateProblem from "./components/UpdateProblem";
import UserProfilePage from "./pages/UserProfilePage";

import ContestListPage from './pages/ContestListPage';
import ContestPage from './pages/ContestPage';
import CreateContestPage from './pages/CreateContestPage';
import AddProblemPage from './components/contests/AddProblemPage';

import LoadingSpinner from "./components/ui/LoadingSpinner";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Homepage></Homepage> : <Navigate to="/signup" />
          }
        ></Route>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login></Login>}
        ></Route>
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup></Signup>}
        ></Route>
        <Route
        path="/user"
          element={!isAuthenticated ? <Navigate to="/signup" /> :<UserProfilePage></UserProfilePage> }
        >
        </Route>
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Admin />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/create"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/delete"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminDelete />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/update"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <UpdateProblem></UpdateProblem>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/video"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminVideo />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/upload/:problemId"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUpload />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/problem/:problemId" element={<ProblemPage />}></Route>
           <Route
          path="/contests"
          element={<ContestListPage />}
        />
        
        <Route
          path="/contests/create"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <CreateContestPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        
        <Route
          path="/contests/:contestId"
          element={<ContestPage />}
        />
        
        <Route
          path="/contests/:contestId/add-problem"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AddProblemPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
      
    </>
  );
}

export default App;


