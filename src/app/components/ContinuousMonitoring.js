"use client";

import { useState, useEffect, useCallback } from 'react';
import { FiActivity, FiClock, FiPause, FiPlay } from 'react-icons/fi';

export default function ContinuousMonitoring({ darkMode = false, servers = [] }) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringInterval, setMonitoringInterval] = useState(30); // seconds
  const [monitoringResults, setMonitoringResults] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  // Function to check server status (simplified version)
  const checkServer = useCallback((url) => {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        resolve({ status: 'Offline', responseTime: 3000 });
      }, 3000);

      const startTime = Date.now();

      img.onload = function() {
        clearTimeout(timeout);
        const responseTime = Date.now() - startTime;
        resolve({ status: 'Online', responseTime });
      };

      img.onerror = function() {
        clearTimeout(timeout);
        const responseTime = Date.now() - startTime;
        resolve({ status: 'Online', responseTime });
      };

      img.src = `${url}/favicon.ico?t=${Date.now()}`;
    });
  }, []);

  // Function to run monitoring tests
  const runMonitoringTests = useCallback(async () => {
    if (servers.length === 0) return;

    const testResults = [];
    for (const server of servers.slice(0, 5)) { // Test only top 5 servers for demo
      for (const url of server.urls.slice(0, 1)) { // Test only first URL for demo
        const result = await checkServer(url);
        testResults.push({
          serverName: server.name,
          url,
          ...result,
          timestamp: new Date().toISOString()
        });
      }
    }

    setMonitoringResults(prev => [testResults, ...prev.slice(0, 9)]); // Keep last 10 tests
  }, [servers, checkServer]);

  // Start/stop monitoring
  const toggleMonitoring = useCallback(() => {
    if (isMonitoring) {
      // Stop monitoring
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsMonitoring(false);
    } else {
      // Start monitoring
      setIsMonitoring(true);
      runMonitoringTests(); // Run immediately
      const id = setInterval(runMonitoringTests, monitoringInterval * 1000);
      setIntervalId(id);
    }
  }, [isMonitoring, intervalId, monitoringInterval, runMonitoringTests]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
      <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <FiActivity />
        Continuous Monitoring
      </h3>
      
      <div className="mb-4">
        <label className={`block mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Test Interval: {monitoringInterval} seconds
        </label>
        <input
          type="range"
          min="10"
          max="300"
          value={monitoringInterval}
          onChange={(e) => setMonitoringInterval(Number(e.target.value))}
          disabled={isMonitoring}
          className="w-full"
        />
        <div className="flex justify-between text-xs mt-1">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>10s</span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>300s</span>
        </div>
      </div>
      
      <button
        onClick={toggleMonitoring}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all mb-4 ${
          isMonitoring
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : darkMode
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isMonitoring ? (
          <>
            <FiPause />
            Stop Monitoring
          </>
        ) : (
          <>
            <FiPlay />
            Start Monitoring
          </>
        )}
      </button>
      
      {monitoringResults.length > 0 && (
        <div className="mt-6">
          <h4 className={`font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Recent Results
          </h4>
          <div className={`rounded-lg p-3 max-h-40 overflow-y-auto ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            {monitoringResults[0].map((result, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                <div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {result.serverName}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  result.status === 'Online' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {result.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}