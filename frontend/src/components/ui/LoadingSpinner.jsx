// // src/components/ui/LoadingSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  className = '',
  variant = 'primary'
}) => {
  const sizes = {
    xs: 'h-4 w-4',
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
  };
  
  const variants = {
    primary: 'text-indigo-500',
    secondary: 'text-gray-400',
    light: 'text-white',
    danger: 'text-red-500',
    success: 'text-green-500',
  };

  return (
    <Loader2 
      className={`${sizes[size]} ${variants[variant]} ${className} animate-spin`} 
    />
  );
};

export default LoadingSpinner;