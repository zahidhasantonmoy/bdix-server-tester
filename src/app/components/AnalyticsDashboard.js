"use client";

import { useState, useEffect } from 'react';
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';

export default function AnalyticsDashboard({ serverStatus, testHistory, darkMode }) {
  // Calculate statistics
  const onlineServers = Object.values(serverStatus).filter(status => status === 'Online').length;
  const offlineServers = Object.values(serverStatus).filter(status => status === 'Offline').length;
  const totalServers = Object.values(serverStatus).length;
  const onlinePercentage = totalServers > 0 ? Math.round((onlineServers / totalServers) * 100) : 0;
  
  // Get recent tests
  const recentTests = testHistory.slice(-5);
  
  // Calculate uptime trend
  const uptimeTrend = recentTests.length > 1 
    ? (recentTests[recentTests.length - 1].onlineCount || 0) - (recentTests[0].onlineCount || 0)
    : 0;

  return (
    <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <FiBarChart2 className="inline mr-2" />
        Analytics Dashboard
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Online Servers</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-600'}`}>{onlineServers}</p>
            </div>
            <FiTrendingUp className={`text-green-500 text-xl ${onlineServers > 0 ? '' : 'opacity-50'}`} />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Offline Servers</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-red-600'}`}>{offlineServers}</p>
            </div>
            <FiTrendingDown className={`text-red-500 text-xl ${offlineServers > 0 ? '' : 'opacity-50'}`} />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-green-600'}`}>{onlinePercentage}%</p>
            </div>
            <FiActivity className={`text-green-500 text-xl`} />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Tests</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-purple-600'}`}>{testHistory.length}</p>
            </div>
            <FiBarChart2 className={`text-purple-500 text-xl`} />
          </div>
        </div>
      </div>
      
      {recentTests.length > 0 && (
        <div>
          <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Recent Test History</h4>
          <div className="space-y-2">
            {recentTests.map((test, index) => (
              <div 
                key={test.id || index} 
                className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(test.timestamp).toLocaleString()}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    {test.onlineCount} online, {test.offlineCount} offline
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {test.duration ? `${test.duration.toFixed(1)}s` : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className={`mt-4 p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
        <strong>Tip:</strong> Higher online server count indicates better BDIX connectivity. 
        Track your connection quality over time.
      </div>
    </div>
  );
}