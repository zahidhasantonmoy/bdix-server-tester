"use client";

import { useState, useCallback } from 'react';
import { FiDownload, FiUpload, FiRefreshCw, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function SpeedTest({ darkMode = false }) {
  const [isTesting, setIsTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [ping, setPing] = useState(null);

  // Mock speed test function (in a real app, this would connect to actual speed test servers)
  const runSpeedTest = useCallback(async () => {
    setIsTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);

    // Simulate ping test
    const pingStart = Date.now();
    // In a real implementation, we would ping a BDIX server
    await new Promise(resolve => setTimeout(resolve, 500));
    const pingEnd = Date.now();
    setPing(pingEnd - pingStart);

    // Simulate download test
    await new Promise(resolve => setTimeout(resolve, 1000));
    const download = Math.floor(Math.random() * 100) + 10; // Mock download speed in Mbps
    setDownloadSpeed(download);

    // Simulate upload test
    await new Promise(resolve => setTimeout(resolve, 1000));
    const upload = Math.floor(Math.random() * 50) + 5; // Mock upload speed in Mbps
    setUploadSpeed(upload);

    setIsTesting(false);
  }, []);

  return (
    <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
      <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Speed Test
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <FiDownload className={`mx-auto text-2xl mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Download</p>
          {downloadSpeed ? (
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{downloadSpeed} Mbps</p>
          ) : (
            <p className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>--</p>
          )}
        </div>
        
        <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
          <FiUpload className={`mx-auto text-2xl mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload</p>
          {uploadSpeed ? (
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{uploadSpeed} Mbps</p>
          ) : (
            <p className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>--</p>
          )}
        </div>
        
        <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <FiLoader className={`mx-auto text-2xl mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ping</p>
          {ping ? (
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ping} ms</p>
          ) : (
            <p className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>--</p>
          )}
        </div>
      </div>
      
      <button
        onClick={runSpeedTest}
        disabled={isTesting}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
          isTesting
            ? 'bg-gray-400 cursor-not-allowed'
            : darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isTesting ? (
          <>
            <FiRefreshCw className="animate-spin" />
            Testing Speed...
          </>
        ) : (
          <>
            <FiRefreshCw />
            Run Speed Test
          </>
        )}
      </button>
      
      {isTesting && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Testing your connection speed...
          </p>
        </motion.div>
      )}
    </div>
  );
}