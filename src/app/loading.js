"use client";

import { motion } from 'framer-motion';
import { FiWifi, FiLoader } from 'react-icons/fi';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="inline-block mb-6"
        >
          <div className="bg-white rounded-full p-6 shadow-xl border-4 border-blue-100">
            <FiWifi className="text-blue-500 text-6xl mx-auto" />
          </div>
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-semibold text-gray-700 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Testing BDIX Servers
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Please wait while we check your connectivity...
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <FiLoader className="text-blue-500 text-2xl mx-auto animate-spin" />
        </motion.div>
      </div>
    </div>
  );
}