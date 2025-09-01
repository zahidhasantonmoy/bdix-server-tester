"use client";

import { motion } from 'framer-motion';
import { FiWifi, FiLoader, FiActivity } from 'react-icons/fi';

export default function LoadingAnimation({ darkMode = false }) {
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <div className="relative">
        {/* Pulsing circle */}
        <motion.div
          className="w-32 h-32 rounded-full border-4 border-blue-500 opacity-20"
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
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
            <FiWifi className="text-blue-500 text-4xl" />
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
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <FiActivity className="text-white text-sm" />
          </div>
        </motion.div>
        
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
          animate={{
            rotate: -360
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
            <FiLoader className="text-white text-xs" />
          </div>
        </motion.div>
        
        {/* Status text */}
        <motion.div 
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Testing Connectivity...
          </p>
        </motion.div>
      </div>
    </div>
  );
}