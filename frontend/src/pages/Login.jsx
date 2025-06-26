// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, NavLink } from 'react-router';
// import { loginUser } from "../authSlice";
// import { useEffect, useState } from 'react';

// const loginSchema = z.object({
//   emailId: z.string().email("Invalid Email"),
//   password: z.string().min(8, "Password is too weak")
// });

// function Login() {
//   const [showPassword, setShowPassword] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(loginSchema) }); // Using renamed schema

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/');
//     }
//   }, [isAuthenticated, navigate]);

//   const onSubmit = (data) => {
//     dispatch(loginUser(data));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-base-200"> {/* Added bg for contrast */}
//       <div className="card w-96 bg-base-100 shadow-xl">
//         <div className="card-body">
//           <h2 className="card-title justify-center text-3xl mb-6">Leetcode</h2> {/* Added mb-6 */}

//           <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="form-control"> {/* Removed mt-4 from first form-control for tighter spacing to title or global error */}
//               <label className="label"> {/* Removed mb-1, default spacing should be fine */}
//                 <span className="label-text">Email</span>
//               </label>
//               <input
//                 type="email"
//                 placeholder="john@example.com"
//                 className={`input input-bordered w-full ${errors.emailId ? 'input-error' : ''}`}
//                 {...register('emailId')}
//               />
//               {errors.emailId && (
//                 <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
//               )}
//             </div>

//             <div className="form-control mt-4">
//               <label className="label">
//                 <span className="label-text">Password</span>
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
//                   {...register('password')}
//                 />
//                 <button
//                   type="button"
//                   className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   onClick={() => setShowPassword(!showPassword)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? (
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <span className="text-error text-sm mt-1">{errors.password.message}</span>
//               )}
//             </div>

//             <div className="form-control mt-8 flex justify-center">
//               <button
//                 type="submit"
//                 className={`btn btn-primary ${loading ? 'loading btn-disabled' : ''}`} // Added btn-disabled for better UX with loading
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <span className="loading loading-spinner"></span>
//                     Logging in...
//                   </>
//                 ) : 'Login'}
//               </button>
//             </div>
//           </form>
//           <div className="text-center mt-6">
//             <span className="text-sm">
//               Don't have an account?{' '} {/* Adjusted text slightly */}
//               <NavLink to="/signup" className="link link-primary">
//                 Sign Up
//               </NavLink>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { loginUser } from "../authSlice";
import { useEffect, useState } from "react";
const loginSchema = z.object({
  emailId: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] p-4">
      <div className="w-full max-w-md bg-[#1e1e2f] backdrop-blur-lg bg-opacity-90 shadow-2xl rounded-2xl border border-gray-700">
        <div className="bg-gradient-to-r from-indigo-700 to-purple-800 py-6 px-8 rounded-t-2xl border-b border-gray-700">
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="LeetCode Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-white text-center mt-4">
            CodeShastra
          </h2>
          <p className="text-indigo-200 text-center mt-2">
            Master the Art of Coding
          </p>
        </div>

        <div className="px-8 py-10">
          <h3 className="text-2xl font-semibold text-white text-center mb-6">
            Welcome Back
          </h3>

          {error && (
            <div className="bg-red-900/70 border border-red-600 text-red-200 rounded-lg py-3 px-4 mb-6 flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`w-full rounded-lg px-4 py-3 bg-[#2a2a3b] text-white border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.emailId
                    ? "border-red-500 ring-1 ring-red-500 bg-red-900/20"
                    : "border-gray-600"
                }`}
                {...register("emailId")}
              />
              {errors.emailId && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.emailId.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full rounded-lg px-4 py-3 pr-10 bg-[#2a2a3b] text-white border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.password
                      ? "border-red-500 ring-1 ring-red-500 bg-red-900/20"
                      : "border-gray-600"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-indigo-400"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243m-7.532-7.532l4.242 4.242m-4.242-4.242l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-60"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login to Your Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <NavLink
              to="/signup"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Create Account
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
