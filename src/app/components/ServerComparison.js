"use client";

import { useState, useEffect } from 'react';
import { FiBarChart2, FiTrendingUp, FiServer, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function ServerComparison({ serverStatus, allServers, darkMode }) {
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedServers, setSelectedServers] = useState([]);
  const [sortBy, setSortBy] = useState('name');

  const toggleServerSelection = (serverName) => {
    setSelectedServers(prev => {
      if (prev.includes(serverName)) {
        return prev.filter(name => name !== serverName);
      } else {
        return [...prev, serverName];
      }
    });
  };

  const selectAllServers = () => {
    const allServerNames = allServers.map(server => server.name);
    setSelectedServers(allServerNames);
  };

  const clearSelection = () => {
    setSelectedServers([]);
  };

  // Get comparison data for selected servers
  const comparisonData = selectedServers.map(serverName => {
    const server = allServers.find(s => s.name === serverName);
    if (!server) return null;
    
    const onlineUrls = server.urls.filter((_, index) => 
      serverStatus[`${server.name}-${index}`] === 'Online'
    ).length;
    
    const offlineUrls = server.urls.filter((_, index) => 
      serverStatus[`${server.name}-${index}`] === 'Offline'
    ).length;
    
    return {
      name: server.name,
      category: server.category,
      totalUrls: server.urls.length,
      onlineUrls,
      offlineUrls,
      successRate: server.urls.length > 0 
        ? Math.round((onlineUrls / server.urls.length) * 100) 
        : 0
    };
  }).filter(Boolean);

  // Sort comparison data
  const sortedComparisonData = [...comparisonData].sort((a, b) => {
    switch (sortBy) {
      case 'successRate':
        return b.successRate - a.successRate;
      case 'onlineUrls':
        return b.onlineUrls - a.onlineUrls;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center">
          <FiBarChart2 className={`text-xl mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Server Comparison
          </h3>
        </div>
        
        <button
          onClick={() => setComparisonMode(!comparisonMode)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            comparisonMode
              ? darkMode
                ? 'bg-blue-600 text-white'
                : 'bg-blue-600 text-white'
              : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {comparisonMode ? 'Exit Comparison' : 'Compare Servers'}
        </button>
      </div>
      
      {comparisonMode ? (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={selectAllServers}
                className={`px-3 py-1 rounded text-sm ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className={`px-3 py-1 rounded text-sm ${
                  darkMode
                    ? 'bg-gray-600 hover:bg-gray-500 text-white'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                }`}
              >
                Clear Selection
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-1 rounded text-sm ${
                  darkMode
                    ? 'bg-gray-600 text-white border-gray-500'
                    : 'bg-white text-gray-800 border-gray-300'
                } border`}
              >
                <option value="name">Sort by Name</option>
                <option value="successRate">Sort by Success Rate</option>
                <option value="onlineUrls">Sort by Online URLs</option>
              </select>
            </div>
            
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {selectedServers.length} server{selectedServers.length !== 1 ? 's' : ''} selected for comparison
            </p>
          </div>
          
          {selectedServers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className={`min-w-full rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <thead>
                  <tr className={darkMode ? 'bg-gray-600' : 'bg-gray-100'}>
                    <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Server
                    </th>
                    <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Category
                    </th>
                    <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      URLs
                    </th>
                    <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Online
                    </th>
                    <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Success Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedComparisonData.map((server, index) => (
                    <tr 
                      key={server.name} 
                      className={`${index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-gray-50') : (darkMode ? 'bg-gray-800' : 'bg-white')}`}
                    >
                      <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {server.name}
                      </td>
                      <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {server.category}
                      </td>
                      <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {server.totalUrls}
                      </td>
                      <td className={`px-4 py-3 text-sm ${server.onlineUrls > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {server.onlineUrls}
                      </td>
                      <td className={`px-4 py-3 text-sm font-medium ${server.successRate >= 80 ? 'text-green-500' : server.successRate >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {server.successRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`text-center p-8 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <FiServer className={`mx-auto text-4xl mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                No servers selected
              </p>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Select servers above to compare their performance
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className={`text-center p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <FiBarChart2 className={`mx-auto text-4xl mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Compare multiple servers side by side
          </p>
          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter comparison mode to analyze server performance
          </p>
        </div>
      )}
      
      <div className={`mt-4 p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
        <strong>Insight:</strong> Compare servers to identify the most reliable content providers 
        and optimize your BDIX experience.
      </div>
    </div>
  );
}