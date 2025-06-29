import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { registerUser } from "../authSlice";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"; // Added AlertCircle
import { motion } from "framer-motion";
import { AuthLayout } from "./AuthLayout";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const signupSchema = z.object({
  firstName: z.string().min(3, "Name must be at least 3 characters"),
  emailId: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
  .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must include at least one uppercase letter, one lowercase letter, and one number"
    ),
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


  // Show toast notification when there's an error
    useEffect(() => {
      if (error) {
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          style: {
            background: '#2a0e39',
            border: '1px solid #6d28d9',
            color: '#f0abfc',
          }
        });
      }
    }, [error]);
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join our coding community - Start your journey to mastery"
    >
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
              <AlertCircle className="h-3.5 w-3.5 mr-1" /> {/* Replaced SVG */}
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
              <AlertCircle className="h-3.5 w-3.5 mr-1" /> {/* Replaced SVG */}
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
              <AlertCircle className="h-3.5 w-3.5 mr-1" /> {/* Replaced SVG */}
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
            I agree to the{" "}
            <a href="#" className="text-indigo-400 hover:text-indigo-300">
              Terms and Conditions
            </a>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
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