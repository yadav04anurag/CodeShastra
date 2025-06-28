// // // import { useState, useEffect } from 'react';
// // // import { useForm } from 'react-hook-form';
// // // import { zodResolver } from '@hookform/resolvers/zod';
// // // import { z } from 'zod';
// // // import { useDispatch, useSelector } from 'react-redux';
// // // import { useNavigate, NavLink } from 'react-router';
// // // import { registerUser } from '../authSlice';

// // // const signupSchema = z.object({
// // //   firstName: z.string().min(3, "Minimum character should be 3"),
// // //   emailId: z.string().email("Invalid Email"),
// // //   password: z.string().min(8, "Password is too weak")
// // // });

// // // function Signup() {
// // //   const [showPassword, setShowPassword] = useState(false);
// // //   const dispatch = useDispatch();
// // //   const navigate = useNavigate();
// // //   const { isAuthenticated, loading } = useSelector((state) => state.auth); // Removed error as it wasn't used

// // //   const {
// // //     register,
// // //     handleSubmit,
// // //     formState: { errors },
// // //   } = useForm({ resolver: zodResolver(signupSchema) });

// // //   useEffect(() => {
// // //     if (isAuthenticated) {
// // //       navigate('/');
// // //     }
// // //   }, [isAuthenticated, navigate]);

// // //   const onSubmit = (data) => {
// // //     dispatch(registerUser(data));
// // //   };

// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center p-4 bg-base-200"> {/* Added a light bg for contrast */}
// // //       <div className="card w-96 bg-base-100 shadow-xl">
// // //         <div className="card-body">
// // //           <h2 className="card-title justify-center text-3xl mb-6">Leetcode</h2> {/* Added mb-6 for spacing */}
// // //           <form onSubmit={handleSubmit(onSubmit)}>
// // //             {/* First Name Field */}
// // //             <div className="form-control">
// // //               <label className="label">
// // //                 <span className="label-text">First Name</span>
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 placeholder="John"
// // //                 className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
// // //                 {...register('firstName')}
// // //               />
// // //               {errors.firstName && (
// // //                 <span className="text-error text-sm mt-1">{errors.firstName.message}</span>
// // //               )}
// // //             </div>

// // //             {/* Email Field */}
// // //             <div className="form-control mt-4">
// // //               <label className="label">
// // //                 <span className="label-text">Email</span>
// // //               </label>
// // //               <input
// // //                 type="email"
// // //                 placeholder="john@example.com"
// // //                 className={`input input-bordered w-full ${errors.emailId ? 'input-error' : ''}`} // Ensure w-full for consistency
// // //                 {...register('emailId')}
// // //               />
// // //               {errors.emailId && (
// // //                 <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
// // //               )}
// // //             </div>

// // //             {/* Password Field with Toggle */}
// // //             <div className="form-control mt-4">
// // //               <label className="label">
// // //                 <span className="label-text">Password</span>
// // //               </label>
// // //               <div className="relative">
// // //                 <input
// // //                   type={showPassword ? "text" : "password"}
// // //                   placeholder="••••••••"
// // //                   // Added pr-10 (padding-right) to make space for the button
// // //                   className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
// // //                   {...register('password')}
// // //                 />
// // //                 <button
// // //                   type="button"
// // //                   className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" // Added transform for better centering, styling
// // //                   onClick={() => setShowPassword(!showPassword)}
// // //                   aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
// // //                 >
// // //                   {showPassword ? (
// // //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
// // //                     </svg>
// // //                   ) : (
// // //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// // //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// // //                     </svg>
// // //                   )}
// // //                 </button>
// // //               </div>
// // //               {errors.password && (
// // //                 <span className="text-error text-sm mt-1">{errors.password.message}</span>
// // //               )}
// // //             </div>

// // //             {/* Submit Button */}
// // //             <div className="form-control mt-8 flex justify-center">
// // //               <button
// // //                 type="submit"
// // //                 className={`btn btn-primary ${loading ? 'loading' : ''}`}
// // //                 disabled={loading}
// // //               >
// // //                 {loading ? 'Signing Up...' : 'Sign Up'}
// // //               </button>
// // //             </div>
// // //           </form>

// // //           {/* Login Redirect */}
// // //           <div className="text-center mt-6"> {/* Increased mt for spacing */}
// // //             <span className="text-sm">
// // //               Already have an account?{' '}
// // //               <NavLink to="/login" className="link link-primary">
// // //                 Login
// // //               </NavLink>
// // //             </span>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default Signup;

// // import { useState, useEffect } from "react";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { z } from "zod";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate, NavLink } from "react-router";
// // import { registerUser } from "../authSlice";

// // const signupSchema = z.object({
// //   firstName: z.string().min(3, "Minimum character should be 3"),
// //   emailId: z.string().email("Invalid Email"),
// //   password: z.string().min(8, "Password is too weak"),
// // });

// // function Signup() {
// //   const [showPassword, setShowPassword] = useState(false);
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const { isAuthenticated, loading, error } = useSelector(
// //     (state) => state.auth
// //   );

// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors },
// //   } = useForm({ resolver: zodResolver(signupSchema) });

// //   useEffect(() => {
// //     if (isAuthenticated) {
// //       navigate("/");
// //     }
// //   }, [isAuthenticated, navigate]);

// //   const onSubmit = (data) => {
// //     dispatch(registerUser(data));
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
// //       <div className="card w-full max-w-md bg-gray-800 shadow-2xl rounded-xl overflow-hidden border border-gray-700">
// //         <div className="bg-gradient-to-r from-indigo-700 to-purple-800 py-6 px-8 border-b border-gray-700">
// //           <div className="flex justify-center">
// //             <img
// //               src="/logo.png"
// //               alt="LeetCode Logo"
// //               className="w-16 h-16 object-contain"
// //             />
// //           </div>
// //           <h2 className="text-3xl font-bold text-white text-center mt-4">
// //             CodeShastra
// //           </h2>
// //           <p className="text-indigo-200 text-center mt-2">
// //             Master the Art of Coding
// //           </p>
// //         </div>

// //         <div className="card-body p-8">
// //           <h3 className="text-2xl font-semibold text-white mb-6 text-center">
// //             Create Account
// //           </h3>

// //           {error && (
// //             <div className="alert bg-red-900 border border-red-700 text-red-100 rounded-lg py-3 px-4 mb-6 flex items-center">
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className="stroke-current shrink-0 h-6 w-6 mr-2"
// //                 fill="none"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth="2"
// //                   d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
// //                 />
// //               </svg>
// //               <span className="text-sm">{error}</span>
// //             </div>
// //           )}

// //           <form onSubmit={handleSubmit(onSubmit)}>
// //             {/* First Name Field */}
// //             <div className="form-control mb-5">
// //               <label className="label mb-1">
// //                 <span className="label-text font-medium text-gray-300">
// //                   First Name
// //                 </span>
// //               </label>
// //               <input
// //                 type="text"
// //                 placeholder="John"
// //                 className={`input w-full rounded-lg py-3 px-4 bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
// //                   errors.firstName ? "border-red-500 bg-red-900/20" : ""
// //                 }`}
// //                 {...register("firstName")}
// //               />
// //               {errors.firstName && (
// //                 <span className="text-red-400 text-sm mt-1 flex items-center">
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     className="h-4 w-4 mr-1"
// //                     fill="none"
// //                     viewBox="0 0 24 24"
// //                     stroke="currentColor"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={2}
// //                       d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
// //                     />
// //                   </svg>
// //                   {errors.firstName.message}
// //                 </span>
// //               )}
// //             </div>

// //             {/* Email Field */}
// //             <div className="form-control mb-5">
// //               <label className="label mb-1">
// //                 <span className="label-text font-medium text-gray-300">
// //                   Email
// //                 </span>
// //               </label>
// //               <input
// //                 type="email"
// //                 placeholder="john@example.com"
// //                 className={`input w-full rounded-lg py-3 px-4 bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
// //                   errors.emailId ? "border-red-500 bg-red-900/20" : ""
// //                 }`}
// //                 {...register("emailId")}
// //               />
// //               {errors.emailId && (
// //                 <span className="text-red-400 text-sm mt-1 flex items-center">
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     className="h-4 w-4 mr-1"
// //                     fill="none"
// //                     viewBox="0 0 24 24"
// //                     stroke="currentColor"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={2}
// //                       d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
// //                     />
// //                   </svg>
// //                   {errors.emailId.message}
// //                 </span>
// //               )}
// //             </div>

// //             {/* Password Field with Toggle */}
// //             <div className="form-control mb-6">
// //               <label className="label mb-1">
// //                 <span className="label-text font-medium text-gray-300">
// //                   Password
// //                 </span>
// //               </label>
// //               <div className="relative">
// //                 <input
// //                   type={showPassword ? "text" : "password"}
// //                   placeholder="••••••••"
// //                   className={`input w-full rounded-lg py-3 px-4 pr-10 bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
// //                     errors.password ? "border-red-500 bg-red-900/20" : ""
// //                   }`}
// //                   {...register("password")}
// //                 />
// //                 <button
// //                   type="button"
// //                   className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   aria-label={showPassword ? "Hide password" : "Show password"}
// //                 >
// //                   {showPassword ? (
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       className="h-5 w-5"
// //                       fill="none"
// //                       viewBox="0 0 24 24"
// //                       stroke="currentColor"
// //                     >
// //                       <path
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         strokeWidth={2}
// //                         d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
// //                       />
// //                     </svg>
// //                   ) : (
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       className="h-5 w-5"
// //                       fill="none"
// //                       viewBox="0 0 24 24"
// //                       stroke="currentColor"
// //                     >
// //                       <path
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         strokeWidth={2}
// //                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
// //                       />
// //                       <path
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         strokeWidth={2}
// //                         d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
// //                       />
// //                     </svg>
// //                   )}
// //                 </button>
// //               </div>
// //               {errors.password && (
// //                 <span className="text-red-400 text-sm mt-1 flex items-center">
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     className="h-4 w-4 mr-1"
// //                     fill="none"
// //                     viewBox="0 0 24 24"
// //                     stroke="currentColor"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={2}
// //                       d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
// //                     />
// //                   </svg>
// //                   {errors.password.message}
// //                 </span>
// //               )}
// //             </div>

// //             {/* Submit Button */}
// //             <div className="form-control mt-8">
// //               <button
// //                 type="submit"
// //                 className={`btn w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none text-white font-medium text-base ${
// //                   loading ? "opacity-80 cursor-not-allowed" : ""
// //                 }`}
// //                 disabled={loading}
// //               >
// //                 {loading ? (
// //                   <>
// //                     <span className="loading loading-spinner loading-sm"></span>
// //                     <span className="ml-2">Creating Account...</span>
// //                   </>
// //                 ) : (
// //                   "Sign Up"
// //                 )}
// //               </button>
// //             </div>
// //           </form>

// //           {/* Login Redirect */}
// //           <div className="mt-6 text-center">
// //             <span className="text-gray-400 text-sm">
// //               Already have an account?{" "}
// //               <NavLink
// //                 to="/login"
// //                 className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
// //               >
// //                 Login
// //               </NavLink>
// //             </span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Signup;


// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, NavLink } from "react-router";
// import { registerUser } from "../authSlice";
// import { 
//   User, 
//   Mail, 
//   Lock, 
//   Eye, 
//   EyeOff, 
//   AlertCircle,
//   ArrowRight
// } from "lucide-react";
// import LoadingSpinner from "../components/ui/LoadingSpinner";

// const signupSchema = z.object({
//   firstName: z.string().min(3, "Name must be at least 3 characters"),
//   emailId: z.string().email("Please enter a valid email"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
// });

// function Signup() {
//   const [showPassword, setShowPassword] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAuthenticated, loading, error } = useSelector(
//     (state) => state.auth
//   );

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(signupSchema) });

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/");
//     }
//   }, [isAuthenticated, navigate]);

//   const onSubmit = (data) => {
//     dispatch(registerUser(data));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] p-4">
//       <div className="w-full max-w-md bg-[#1e1e2f] backdrop-blur-lg bg-opacity-90 shadow-2xl rounded-2xl border border-gray-700 overflow-hidden">
//         <div className="bg-gradient-to-r from-indigo-700 to-purple-800 py-6 px-8 border-b border-gray-700">
//           <div className="flex flex-col items-center">
//             <div className="bg-indigo-900/30 p-3 rounded-full border border-indigo-500">
//               <User className="h-10 w-10 text-white" />
//             </div>
//             <h2 className="text-3xl font-bold text-white text-center mt-4">
//               CodeShastra
//             </h2>
//             <p className="text-indigo-200 text-center mt-2">
//               Join our coding community
//             </p>
//           </div>
//         </div>

//         <div className="px-6 py-8 sm:px-8 sm:py-10">
//           <h3 className="text-2xl font-semibold text-white text-center mb-6">
//             Create Your Account
//           </h3>

//           {error && (
//             <div className="bg-red-900/70 border border-red-600 text-red-200 rounded-lg py-3 px-4 mb-6 flex items-start gap-3">
//               <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
//               <span className="text-sm">{error}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* First Name Field */}
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-300 flex items-center">
//                 <User className="h-4 w-4 mr-2" />
//                 Full Name
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="John Doe"
//                   className={`w-full rounded-lg px-4 pl-11 py-3 bg-[#2a2a3b] text-white border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                     errors.firstName
//                       ? "border-red-500 ring-1 ring-red-500 bg-red-900/20"
//                       : "border-gray-600"
//                   }`}
//                   {...register("firstName")}
//                 />
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               </div>
//               {errors.firstName && (
//                 <p className="text-red-400 text-xs mt-1 flex items-center">
//                   <AlertCircle className="h-3.5 w-3.5 mr-1" />
//                   {errors.firstName.message}
//                 </p>
//               )}
//             </div>

//             {/* Email Field */}
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-300 flex items-center">
//                 <Mail className="h-4 w-4 mr-2" />
//                 Email Address
//               </label>
//               <div className="relative">
//                 <input
//                   type="email"
//                   placeholder="john@example.com"
//                   className={`w-full rounded-lg px-4 pl-11 py-3 bg-[#2a2a3b] text-white border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                     errors.emailId
//                       ? "border-red-500 ring-1 ring-red-500 bg-red-900/20"
//                       : "border-gray-600"
//                   }`}
//                   {...register("emailId")}
//                 />
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               </div>
//               {errors.emailId && (
//                 <p className="text-red-400 text-xs mt-1 flex items-center">
//                   <AlertCircle className="h-3.5 w-3.5 mr-1" />
//                   {errors.emailId.message}
//                 </p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-300 flex items-center">
//                 <Lock className="h-4 w-4 mr-2" />
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   className={`w-full rounded-lg px-4 pl-11 py-3 bg-[#2a2a3b] text-white border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                     errors.password
//                       ? "border-red-500 ring-1 ring-red-500 bg-red-900/20"
//                       : "border-gray-600"
//                   }`}
//                   {...register("password")}
//                 />
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-indigo-400"
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-400 text-xs mt-1 flex items-center">
//                   <AlertCircle className="h-3.5 w-3.5 mr-1" />
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-60 flex justify-center items-center gap-2 group"
//             >
//               {loading ? (
//                 <>
//                   <LoadingSpinner size="sm" className="text-white" />
//                   <span>Creating Account...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Get Started</span>
//                   <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="mt-8 pt-5 border-t border-gray-700">
//             <p className="text-center text-sm text-gray-400">
//               Already have an account?{" "}
//               <NavLink
//                 to="/login"
//                 className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center gap-1"
//               >
//                 Sign In Now
//                 <ArrowRight className="h-4 w-4" />
//               </NavLink>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Signup;



// src/components/auth/Signup.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { registerUser} from "../authSlice";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { motion } from "framer-motion";
import { AuthLayout } from "./AuthLayout";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const signupSchema = z.object({
  firstName: z.string().min(3, "Name must be at least 3 characters"),
  emailId: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function Signup() {
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
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };
  return (
    <AuthLayout 
      title="Create Your Account" 
      subtitle="Join our coding community - Start your journey to mastery"
    >
      {error && (
    <motion.div 
      className="bg-red-900/70 border border-red-600 text-red-200 rounded-lg py-3 px-4 mb-6 flex items-start gap-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <svg
        className="h-5 w-5 mt-0.5 flex-shrink-0"
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
    </motion.div>
  )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Name Field */}
        <div>
          <label className="mb-2 text-sm font-medium text-gray-300 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="John Doe"
              className={`w-full rounded-lg px-4 pl-11 py-3 bg-[#2a2a3b] text-white border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                errors.firstName
                  ? "border-red-500 ring-1 ring-red-500 bg-red-900/20"
                  : "border-gray-700 hover:border-gray-500"
              }`}
              {...register("firstName")}
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.firstName && (
            <motion.p 
              className="text-red-400 text-xs mt-1 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg
                className="h-3.5 w-3.5 mr-1"
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
              {errors.firstName.message}
            </motion.p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="john@example.com"
              className={`w-full rounded-lg px-4 pl-11 py-3 bg-[#2a2a3b] text-white border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                errors.emailId
                  ? "border-red-500 ring-1 ring-red-500 bg-red-900/20"
                  : "border-gray-700 hover:border-gray-500"
              }`}
              {...register("emailId")}
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.emailId && (
            <motion.p 
              className="text-red-400 text-xs mt-1 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg
                className="h-3.5 w-3.5 mr-1"
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
              {errors.emailId.message}
            </motion.p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300 flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full rounded-lg px-4 pl-11 py-3 bg-[#2a2a3b] text-white border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                errors.password
                  ? "border-red-500 ring-1 ring-red-500 bg-red-900/20"
                  : "border-gray-700 hover:border-gray-500"
              }`}
              {...register("password")}
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p 
              className="text-red-400 text-xs mt-1 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg
                className="h-3.5 w-3.5 mr-1"
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
              {errors.password.message}
            </motion.p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
            I agree to the <a href="#" className="text-indigo-400 hover:text-indigo-300">Terms and Conditions</a>
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-60 flex justify-center items-center gap-2 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" variant="light" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <svg 
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 pt-5 border-t border-gray-800">
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Signup;