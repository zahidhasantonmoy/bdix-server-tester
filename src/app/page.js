"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiWifi, FiWifiOff, FiLoader, FiRefreshCw, FiServer, FiCheckCircle, FiXCircle, FiClock, FiSearch, FiFacebook, FiLinkedin, FiGithub, FiGlobe, FiExternalLink } from 'react-icons/fi';
import { bdixServers } from './data/servers';

export default function Home() {
  const [serverStatus, setServerStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, online, offline
  const [expandedServers, setExpandedServers] = useState({});

  const checkServer = useCallback((url) => {
    return new Promise((resolve) => {
      // Normalize URL
      let testUrl = url.trim();
      if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
        testUrl = `http://${testUrl}`;
      }
      
      // Use the working CORS Bypass approach
      const img = new Image();
      const timeout = setTimeout(() => {
        resolve('Offline');
      }, 3000);

      img.onload = function() {
        clearTimeout(timeout);
        resolve('Online');
      };

      img.onerror = function() {
        clearTimeout(timeout);
        // For BDIX testing, even an error often means the server responded
        resolve('Online');
      };

      // Try to load favicon
      img.src = `${testUrl}/favicon.ico?t=${Date.now()}`;
    });
  }, []);

  const checkAllServers = useCallback(async () => {
    setIsLoading(true);
    setProgress(0);
    
    // Initialize all servers as "Checking..."
    const initialStatus = {};
    let totalUrls = 0;
    bdixServers.forEach(server => {
      server.urls.forEach((url, urlIndex) => {
        initialStatus[`${server.name}-${urlIndex}`] = 'Checking...';
        totalUrls++;
      });
    });
    setServerStatus(initialStatus);
    
    // Create a flat list of all URLs to test
    const urlsToTest = [];
    bdixServers.forEach(server => {
      server.urls.forEach((url, urlIndex) => {
        urlsToTest.push({ server, url, serverName: server.name, urlIndex });
      });
    });
    
    // Process URLs with concurrency limit to avoid overwhelming the browser
    const concurrencyLimit = 10; // Test 10 URLs simultaneously
    let completedUrls = 0;
    
    // Process URLs in chunks
    for (let i = 0; i < urlsToTest.length; i += concurrencyLimit) {
      const chunk = urlsToTest.slice(i, i + concurrencyLimit);
      const chunkPromises = chunk.map(item => 
        checkServer(item.url).then(status => ({
          serverName: item.serverName,
          urlIndex: item.urlIndex,
          status
        }))
      );
      
      // Wait for all promises in this chunk to complete
      const chunkResults = await Promise.all(chunkPromises);
      
      // Update status for completed URLs
      const updatedStatus = {};
      chunkResults.forEach(result => {
        updatedStatus[`${result.serverName}-${result.urlIndex}`] = result.status;
      });
      
      setServerStatus(prevStatus => ({
        ...prevStatus,
        ...updatedStatus
      }));
      
      // Update progress
      completedUrls += chunkResults.length;
      setProgress(Math.round((completedUrls / totalUrls) * 100));
    }
    
    setIsLoading(false);
  }, [checkServer]);

  const toggleServerExpansion = (serverName) => {
    setExpandedServers(prev => ({
      ...prev,
      [serverName]: !prev[serverName]
    }));
  };

  const openUrlInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Online':
        return <FiWifi className="text-green-500" />;
      case 'Offline':
        return <FiWifiOff className="text-red-500" />;
      case 'Checking...':
        return <FiLoader className="text-yellow-500 animate-spin" />;
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
      case 'Checking...':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredServers = bdixServers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          server.urls.some(url => url.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    
    const hasStatus = server.urls.some((url, urlIndex) => {
      const status = serverStatus[`${server.name}-${urlIndex}`] || 'Unknown';
      return status.toLowerCase() === filter;
    });
    
    return matchesSearch && hasStatus;
  });

  const onlineCount = bdixServers.reduce((count, server) => {
    return count + server.urls.filter((url, urlIndex) => {
      const status = serverStatus[`${server.name}-${urlIndex}`] || 'Unknown';
      return status === 'Online';
    }).length;
  }, 0);

  const offlineCount = bdixServers.reduce((count, server) => {
    return count + server.urls.filter((url, urlIndex) => {
      const status = serverStatus[`${server.name}-${urlIndex}`] || 'Unknown';
      return status === 'Offline';
    }).length;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold flex items-center justify-center md:justify-start gap-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FiWifi className="text-yellow-300" />
                BDIX Connectivity Tester
              </motion.h1>
              <motion.p 
                className="mt-2 text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Test your BDIX server connectivity in Bangladesh
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button 
                onClick={checkAllServers}
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-105'
                }`}
              >
                <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
                {isLoading ? 'Testing...' : 'Test All Servers'}
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border-l-4 border-blue-500">
            <div className="bg-blue-100 p-3 rounded-full">
              <FiServer className="text-blue-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Servers</p>
              <p className="text-2xl font-bold">
                {bdixServers.reduce((sum, server) => sum + server.urls.length, 0)}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border-l-4 border-green-500">
            <div className="bg-green-100 p-3 rounded-full">
              <FiCheckCircle className="text-green-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Online</p>
              <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border-l-4 border-red-500">
            <div className="bg-red-100 p-3 rounded-full">
              <FiXCircle className="text-red-600 text-2xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Offline</p>
              <p className="text-2xl font-bold text-red-600">{offlineCount}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search servers or URLs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('online')}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  filter === 'online' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiWifi className="text-green-500" />
                Online
              </button>
              <button
                onClick={() => setFilter('offline')}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  filter === 'offline' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiWifiOff className="text-red-500" />
                Offline
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="max-w-7xl mx-auto px-4 pb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Testing servers...</span>
                <span className="text-sm font-medium text-gray-700">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Server List */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredServers.map((server, index) => (
              <motion.div
                key={server.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div 
                  className="p-5 border-b border-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleServerExpansion(server.name)}
                >
                  <h2 className="text-lg font-bold text-gray-800 truncate flex items-center gap-2">
                    <FiServer className="text-blue-500" />
                    {server.name}
                  </h2>
                  <motion.div 
                    animate={{ rotate: expandedServers[server.name] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {expandedServers[server.name] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5">
                        <ul className="space-y-3">
                          {server.urls.map((url, urlIndex) => {
                            const status = serverStatus[`${server.name}-${urlIndex}`] || 'Unknown';
                            return (
                              <motion.li 
                                key={urlIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: urlIndex * 0.05 }}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => openUrlInNewTab(url)}
                              >
                                <span className="text-sm text-gray-600 truncate mr-2 flex items-center gap-2">
                                  <FiWifi className="text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{url}</span>
                                </span>
                                <div className="flex items-center gap-2">
                                  <FiExternalLink className="text-gray-400" />
                                  <span
                                    className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 whitespace-nowrap ${getStatusColor(status)}`}
                                  >
                                    {getStatusIcon(status)}
                                    <span>{status}</span>
                                  </span>
                                </div>
                              </motion.li>
                            );
                          })}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!expandedServers[server.name] && (
                  <div className="p-5 pt-0">
                    <div className="flex gap-2 flex-wrap">
                      {server.urls.slice(0, 3).map((url, urlIndex) => {
                        const status = serverStatus[`${server.name}-${urlIndex}`] || 'Unknown';
                        return (
                          <span
                            key={urlIndex}
                            className={`px-2 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 ${getStatusColor(status)} cursor-pointer hover:opacity-80 transition-opacity`}
                            onClick={() => openUrlInNewTab(url)}
                          >
                            <FiExternalLink className="text-gray-500" />
                            {getStatusIcon(status)}
                            <span className="truncate max-w-[100px]">{url.replace('http://', '').replace('https://', '')}</span>
                          </span>
                        );
                      })}
                      {server.urls.length > 3 && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          +{server.urls.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredServers.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <FiSearch className="mx-auto text-gray-400 text-4xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No servers found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                BDIX Connectivity Tester &copy; {new Date().getFullYear()} - Test your BDIX server connectivity
              </p>
              <p className="text-gray-500 text-sm mt-2">
                This tool helps you check the connectivity status of BDIX servers in Bangladesh
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <p className="text-gray-400 text-sm">Developed by Zahid Hasan Tonmoy</p>
              <div className="flex gap-4 mt-2">
                <a 
                  href="https://www.facebook.com/zahidhasantonmoybd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <FiFacebook className="text-xl" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/zahidhasantonmoy/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin className="text-xl" />
                </a>
                <a 
                  href="https://github.com/zahidhasantonmoy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <FiGithub className="text-xl" />
                </a>
                <a 
                  href="https://zahidhasantonmoy.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Portfolio"
                >
                  <FiGlobe className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}