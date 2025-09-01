"use client";

import { useState, useCallback } from 'react';
import { FiDownload, FiUpload, FiRefreshCw, FiLoader, FiStopCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function SpeedTest({ darkMode = false }) {
  const [isTesting, setIsTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [ping, setPing] = useState(null);
  const [progress, setProgress] = useState(0);
  const [testPhase, setTestPhase] = useState(''); // ping, download, upload
  const [abortController, setAbortController] = useState(null);

  // Function to measure ping/latency
  const measurePing = useCallback(async (signal) => {
    setTestPhase('Measuring ping...');
    const results = [];
    
    // Measure ping 3 times and take average
    for (let i = 0; i < 3; i++) {
      if (signal.aborted) throw new Error('Aborted');
      
      const start = performance.now();
      try {
        // Using a simple CORS-enabled endpoint
        await fetch('https://httpbin.org/get', { 
          method: 'HEAD', // HEAD request is faster
          signal: signal,
          cache: 'no-cache'
        });
        const end = performance.now();
        results.push(end - start);
      } catch (error) {
        if (error.name === 'AbortError') throw new Error('Aborted');
        // Even if request fails, we count the time
        const end = performance.now();
        results.push(end - start);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Return average ping
    const averagePing = results.reduce((a, b) => a + b, 0) / results.length;
    return Math.round(averagePing);
  }, []);

  // Simple image-based download test (more compatible)
  const measureDownloadWithImage = useCallback(async (signal) => {
    setTestPhase('Testing download speed...');
    setProgress(33);
    
    return new Promise((resolve) => {
      if (signal.aborted) {
        resolve(0);
        return;
      }
      
      const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg'; // ~5MB image
      const image = new Image();
      
      const start = performance.now();
      
      // Set up abort handling
      const abortHandler = () => {
        image.src = '';
        resolve(0);
      };
      
      if (signal) {
        signal.addEventListener('abort', abortHandler);
      }
      
      image.onload = function() {
        if (signal) {
          signal.removeEventListener('abort', abortHandler);
        }
        const end = performance.now();
        const duration = (end - start) / 1000; // seconds
        const bitsLoaded = 5 * 8 * 1000000; // 5MB in bits
        const speedMbps = (bitsLoaded / duration / 1000000).toFixed(2);
        resolve(parseFloat(speedMbps));
      };
      
      image.onerror = function() {
        if (signal) {
          signal.removeEventListener('abort', abortHandler);
        }
        resolve(0);
      };
      
      image.src = `${imageUrl}?t=${Date.now()}`;
    });
  }, []);

  // Function to measure upload speed (simplified)
  const measureUpload = useCallback(async (signal) => {
    setTestPhase('Testing upload speed...');
    setProgress(66);
    
    try {
      // Create smaller data (200KB) for better compatibility
      const data = new Uint8Array(200000);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.floor(Math.random() * 256);
      }
      
      const start = performance.now();
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        signal: signal,
        body: data,
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });
      
      if (!response.ok) throw new Error('Upload test failed');
      
      const end = performance.now();
      
      // Calculate speed in Mbps
      const duration = (end - start) / 1000; // seconds
      const bitsLoaded = data.length * 8;
      const speedMbps = (bitsLoaded / duration / 1000000).toFixed(2);
      
      return parseFloat(speedMbps);
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Aborted');
      console.error('Upload test error:', error);
      return 0; // Return 0 if test fails
    }
  }, []);

  // Main speed test function
  const runSpeedTest = useCallback(async () => {
    setIsTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    setProgress(0);
    setTestPhase('Starting speed test...');

    // Create abort controller
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // Measure ping
      const pingResult = await measurePing(controller.signal);
      setPing(pingResult);
      setProgress(33);

      // Measure download using image method (more reliable)
      const downloadResult = await measureDownloadWithImage(controller.signal);
      setDownloadSpeed(downloadResult);
      setProgress(66);

      // Measure upload
      const uploadResult = await measureUpload(controller.signal);
      setUploadSpeed(uploadResult);
      setProgress(100);

      setTestPhase('Test completed');
    } catch (error) {
      if (error.message !== 'Aborted') {
        console.error('Speed test error:', error);
        setTestPhase('Test failed - check console for details');
      } else {
        setTestPhase('Test cancelled');
      }
    } finally {
      setIsTesting(false);
      setAbortController(null);
    }
  }, [measurePing, measureDownloadWithImage, measureUpload]);

  const stopTest = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setIsTesting(false);
      setTestPhase('Test cancelled');
      setAbortController(null);
    }
  }, [abortController]);

  return (
    <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
      <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Speed Test
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <FiDownload className={`mx-auto text-2xl mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Download</p>
          {downloadSpeed !== null ? (
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{downloadSpeed} Mbps</p>
          ) : (
            <p className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>--</p>
          )}
        </div>
        
        <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
          <FiUpload className={`mx-auto text-2xl mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload</p>
          {uploadSpeed !== null ? (
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{uploadSpeed} Mbps</p>
          ) : (
            <p className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>--</p>
          )}
        </div>
        
        <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <FiLoader className={`mx-auto text-2xl mb-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ping</p>
          {ping !== null ? (
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ping} ms</p>
          ) : (
            <p className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>--</p>
          )}
        </div>
      </div>
      
      {/* Progress bar and test phase */}
      {isTesting && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{testPhase}</span>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={isTesting ? stopTest : runSpeedTest}
          disabled={isTesting && !abortController}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
            isTesting
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isTesting ? (
            <>
              <FiStopCircle />
              Stop Test
            </>
          ) : (
            <>
              <FiRefreshCw />
              Run Speed Test
            </>
          )}
        </button>
      </div>
      
      {isTesting && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Testing your connection speed... This may take a moment.
          </p>
        </motion.div>
      )}
      
      {!isTesting && testPhase.includes('failed') && (
        <motion.div 
          className="mt-4 p-3 rounded-lg bg-red-100 text-red-800 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>Speed test failed. This might be due to network restrictions or CORS policies.</p>
          <p className="mt-1">Try refreshing the page and running the test again.</p>
        </motion.div>
      )}
    </div>
  );
}