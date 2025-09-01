"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiWifi, FiWifiOff, FiClock, FiExternalLink, FiRefreshCw, FiChevronLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function TestResultsPage() {
  const router = useRouter();
  const [testResults, setTestResults] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState('status'); // status, name

  useEffect(() => {
    // Load test results from localStorage
    const savedResults = localStorage.getItem('lastTestResults');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedResults) {
      setTestResults(JSON.parse(savedResults));
    } else {
      // If no results, redirect to home
      router.push('/');
    }
    
    if (savedDarkMode === 'true') {
      setDarkMode(true);
    }
  }, [router]);

  const openUrlInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Online':
        return <FiWifi className="text-green-500" />;
      case 'Offline':
        return <FiWifiOff className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Offline':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusOrder = (status) => {
    switch (status) {
      case 'Online': return 1;
      case 'Checking...': return 2;
      default: return 3;
    }
  };

  const sortedResults = testResults ? [...testResults].sort((a, b) => {
    if (sortBy === 'status') {
      const statusOrderA = getStatusOrder(a.status);
      const statusOrderB = getStatusOrder(b.status);
      if (statusOrderA !== statusOrderB) {
        return statusOrderA - statusOrderB;
      }
      return a.server.name.localeCompare(b.server.name);
    } else {
      return a.server.name.localeCompare(b.server.name);
    }
  }) : [];

  const onlineCount = testResults ? testResults.filter(result => result.status === 'Online').length : 0;
  const offlineCount = testResults ? testResults.filter(result => result.status === 'Offline').length : 0;
  const checkingCount = testResults ? testResults.filter(result => result.status === 'Checking...').length : 0;

  if (!testResults) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <button
              onClick={() => router.push('/')}
              className={`flex items-center gap-2 mb-4 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              <FiChevronLeft />
              <span className="sm:inline">Back to Tester</span>
            </button>
            <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Test Results</h1>
            <p className={`mt-2 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              BDIX Connectivity Test Results
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-4">
            <div className={`rounded-lg p-3 sm:p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Online</p>
              <p className="text-lg sm:text-2xl font-bold text-green-500">{onlineCount}</p>
            </div>
            <div className={`rounded-lg p-3 sm:p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Offline</p>
              <p className="text-lg sm:text-2xl font-bold text-red-500">{offlineCount}</p>
            </div>
            <div className={`rounded-lg p-3 sm:p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-500">{testResults.length}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={`rounded-xl p-4 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Test Results Summary
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Sorted by {sortBy === 'status' ? 'Status' : 'Server Name'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
              >
                <option value="status">Sort by Status</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results List - Mobile Responsive */}
        <div className={`rounded-xl overflow-hidden shadow ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-8`}>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left p-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Server</th>
                  <th className={`text-left p-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Address</th>
                  <th className={`text-left p-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th className={`text-left p-4 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((result, index) => (
                  <motion.tr
                    key={`${result.server.name}-${result.urlIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} cursor-pointer`}
                    onClick={() => openUrlInNewTab(result.url)}
                  >
                    <td className={`p-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div className="font-medium">{result.server.name}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {result.server.category}
                      </div>
                    </td>
                    <td className={`p-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-mono text-sm`}>
                      {result.url.replace('http://', '').replace('https://', '')}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(result.status)}`}>
                        {getStatusIcon(result.status)}
                        <span className="ml-2">{result.status}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openUrlInNewTab(result.url);
                        }}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                      >
                        <FiExternalLink />
                        <span>Open</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedResults.map((result, index) => (
                <motion.div
                  key={`${result.server.name}-${result.urlIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`p-4 ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} cursor-pointer`}
                  onClick={() => openUrlInNewTab(result.url)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {result.server.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {result.server.category}
                      </div>
                      <div className={`mt-2 text-xs font-mono ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {result.url.replace('http://', '').replace('https://', '')}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(result.status)}`}>
                        {getStatusIcon(result.status)}
                        <span className="ml-1">{result.status}</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openUrlInNewTab(result.url);
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                      >
                        <FiExternalLink />
                        <span>Open</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className={`flex items-center justify-center gap-2 mx-auto px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all shadow-lg text-sm sm:text-base ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <FiRefreshCw />
            <span>Run Another Test</span>
          </button>
        </div>
      </div>
    </div>
  );
}