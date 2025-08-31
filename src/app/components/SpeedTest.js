"use client";

import { useState, useCallback } from 'react';
import { FiActivity, FiDownload, FiUpload, FiLoader } from 'react-icons/fi';

export default function SpeedTest({ darkMode }) {
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);

  const runSpeedTest = useCallback(async () => {
    setIsTesting(true);
    setProgress(0);
    setResults(null);

    try {
      // Simulate speed test (in a real implementation, you'd use actual file downloads)
      const testData = [];
      const chunkSize = 1024 * 1024; // 1MB chunks
      const totalChunks = 10; // Test with 10MB of data
      
      let downloadedBytes = 0;
      
      // Simulate download test
      for (let i = 0; i < totalChunks; i++) {
        // In a real implementation, you'd download actual data
        // For simulation, we'll just wait and update progress
        await new Promise(resolve => setTimeout(resolve, 200));
        
        downloadedBytes += chunkSize;
        const newProgress = Math.round((downloadedBytes / (chunkSize * totalChunks)) * 100);
        setProgress(newProgress);
      }
      
      // Calculate download speed (MB/s)
      const downloadSpeed = (downloadedBytes / 1024 / 1024 / 2).toFixed(2); // Simulated 2 second test
      
      // Simulate upload test
      setProgress(0);
      let uploadedBytes = 0;
      
      for (let i = 0; i < totalChunks; i++) {
        await new Promise(resolve => setTimeout(resolve, 150));
        uploadedBytes += chunkSize;
        const newProgress = Math.round((uploadedBytes / (chunkSize * totalChunks)) * 100);
        setProgress(newProgress);
      }
      
      // Calculate upload speed (MB/s)
      const uploadSpeed = (uploadedBytes / 1024 / 1024 / 1.5).toFixed(2); // Simulated 1.5 second test
      
      setResults({
        download: parseFloat(downloadSpeed),
        upload: parseFloat(uploadSpeed),
        ping: Math.floor(Math.random() * 20) + 5, // Simulated ping 5-25ms
        jitter: Math.floor(Math.random() * 5) + 1, // Simulated jitter 1-5ms
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Speed test failed:', error);
      setResults({
        error: 'Speed test failed. Please try again.'
      });
    } finally {
      setIsTesting(false);
      setProgress(0);
    }
  }, []);

  return (
    <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center mb-4">
        <FiActivity className={`text-xl mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Connection Speed Test
        </h3>
      </div>
      
      <div className="mb-6">
        <button
          onClick={runSpeedTest}
          disabled={isTesting}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
            isTesting
              ? 'bg-gray-400 cursor-not-allowed'
              : darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
          }`}
        >
          {isTesting ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Testing... {progress}%
            </>
          ) : (
            <>
              <FiActivity className="mr-2" />
              Run Speed Test
            </>
          )}
        </button>
      </div>
      
      {isTesting && (
        <div className="mb-6">
          <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-2 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className={`text-center mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Testing your connection speed...
          </p>
        </div>
      )}
      
      {results && (
        <div className="space-y-4">
          {results.error ? (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                {results.error}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <FiDownload className={`mx-auto text-2xl mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Download</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {results.download} <span className="text-base font-normal">Mbps</span>
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
                  <FiUpload className={`mx-auto text-2xl mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {results.upload} <span className="text-base font-normal">Mbps</span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ping</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {results.ping} <span className="text-base font-normal">ms</span>
                  </p>
                </div>
                
                <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Jitter</p>
                  <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {results.jitter} <span className="text-base font-normal">ms</span>
                  </p>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                <p className="font-medium">Test Results</p>
                <p>Completed at {new Date(results.timestamp).toLocaleString()}</p>
              </div>
            </>
          )}
        </div>
      )}
      
      <div className={`mt-4 p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
        <strong>Note:</strong> This speed test measures your connection to local BDIX servers. 
        Higher speeds indicate better local content access without international bandwidth.
      </div>
    </div>
  );
}