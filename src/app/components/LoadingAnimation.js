"use client";

import { motion } from 'framer-motion';
import { FiWifi, FiLoader, FiActivity } from 'react-icons/fi';

// Inline loading animation for buttons
export function InlineLoadingSpinner({ size = "md" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  
  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full border-2 border-blue-500 border-t-transparent`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

// Modal loading animation
export default function LoadingAnimation({ darkMode = false, message = "Testing Connectivity..." }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
      <div className={`rounded-2xl p-8 flex flex-col items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
        <div className="relative mb-6">
          {/* Pulsing circle */}
          <motion.div
            className="w-20 h-20 rounded-full border-4 border-blue-500 opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Main circle */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-lg`}>
              <FiWifi className="text-blue-500 text-2xl" />
            </div>
          </motion.div>
          
          {/* Orbiting elements */}
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <FiActivity className="text-white text-xs" />
            </div>
          </motion.div>
        </div>
        
        <motion.p 
          className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}