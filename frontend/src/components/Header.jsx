import { NavLink } from "react-router";
import { useSelector, useDispatch} from "react-redux";
import { logoutUser } from "../authSlice"; 
import { useNavigate } from "react-router";
const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
let navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logoutUser());
    // Optionally, redirect the user after logout
    navigate('/login');
  };

  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 w-10 h-10 rounded-xl flex items-center justify-center">
            <span className="text-black font-bold text-xl">C</span>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            CodeShastra
          </span>
        </NavLink>

        {user && (
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
              <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-gray-800 rounded-box w-52 border border-gray-700">
                {user.role === "admin" && (
                  <li>
                    <NavLink
                      to="/admin"
                      className="text-white hover:bg-gray-700 rounded-lg py-2 px-4 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.029-.693-.084-1.024A5 5 0 0010 11z" clipRule="evenodd" /></svg>
                      Admin Dashboard
                    </NavLink>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:bg-gray-700 rounded-lg py-2 px-4 flex items-center w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;