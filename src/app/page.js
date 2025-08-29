"use client";

import { useState, useEffect, useCallback } from 'react';
import { bdixServers } from './data/servers';

export default function Home() {
  const [serverStatus, setServerStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const checkServer = useCallback(async (server, url) => {
    try {
      // We use 'no-cors' mode to avoid CORS issues.
      // This means we won't be able to read the response body,
      // but we can still check if the server is reachable.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      await fetch(url, { 
        mode: 'no-cors', 
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      return 'Online';
    } catch (error) {
      return 'Offline';
    }
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
    
    // Check each server URL
    let checkedUrls = 0;
    for (const server of bdixServers) {
      for (let i = 0; i < server.urls.length; i++) {
        const status = await checkServer(server, server.urls[i]);
        setServerStatus(prevStatus => ({
          ...prevStatus,
          [`${server.name}-${i}`]: status
        }));
        
        checkedUrls++;
        setProgress(Math.round((checkedUrls / totalUrls) * 100));
      }
    }
    
    setIsLoading(false);
  }, [checkServer]);

  useEffect(() => {
    checkAllServers();
  }, [checkAllServers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-4 md:mb-0">
            BDIX Connectivity Tester
          </h1>
          <button 
            onClick={checkAllServers}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-105'
            }`}
          >
            {isLoading ? 'Testing...' : 'Test All Servers'}
          </button>
        </div>
      </header>
      
      <main className="p-4">
        <div className="max-w-6xl mx-auto">
          {isLoading && (
            <div className="mb-6 bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Testing servers...</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bdixServers.map((server) => (
              <div 
                key={server.name} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800 truncate">{server.name}</h2>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {server.urls.map((url, urlIndex) => {
                      const status = serverStatus[`${server.name}-${urlIndex}`] || 'Unknown';
                      return (
                        <li 
                          key={urlIndex} 
                          className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-600 truncate mr-2">{url}</span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                              status === 'Online'
                                ? 'bg-green-100 text-green-800'
                                : status === 'Offline'
                                ? 'bg-red-100 text-red-800'
                                : status === 'Checking...'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {status}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="max-w-6xl mx-auto text-center text-sm">
          <p>BDIX Connectivity Tester &copy; {new Date().getFullYear()} - Test your BDIX server connectivity</p>
        </div>
      </footer>
    </div>
  );
}