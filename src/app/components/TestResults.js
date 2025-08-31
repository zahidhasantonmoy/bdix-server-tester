"use client";

import { useState } from 'react';
import { FiWifi, FiWifiOff, FiLoader, FiExternalLink, FiServer, FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function TestResults({ 
  servers, 
  serverStatus, 
  favorites, 
  toggleFavorite, 
  openUrlInNewTab, 
  darkMode,
  expandedServers,
  toggleServerExpansion
}) {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategoryExpansion = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Online':
        return <FiWifi className="text-green-500" />;
      case 'Offline':
        return <FiWifiOff className="text-red-500" />;
      case 'Checking...':
        return <FiLoader className="text-yellow-500 animate-spin" />;
      default:
        return <FiLoader className="text-gray-500" />;
    }
  };

  // Group servers by category
  const categorizedServers = {};
  servers.forEach(server => {
    if (!categorizedServers[server.category]) {
      categorizedServers[server.category] = [];
    }
    categorizedServers[server.category].push(server);
  });

  return (
    <div className="space-y-6">
      {Object.entries(categorizedServers).map(([category, categoryServers]) => (
        <div key={category} className="rounded-xl overflow-hidden shadow-md">
          <div 
            className={`flex justify-between items-center p-4 cursor-pointer ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t-4 border-blue-500`}
            onClick={() => toggleCategoryExpansion(category)}
          >
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {category} ({categoryServers.length} servers)
            </h3>
            <div className="flex items-center">
              <span className={`mr-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {expandedCategories[category] ? 'Collapse' : 'Expand'}
              </span>
              <div className={`transform transition-transform ${expandedCategories[category] ? 'rotate-180' : ''}`}>
                <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {expandedCategories[category] && (
            <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryServers.map((server) => {
                  const isExpanded = expandedServers[server.name];
                  
                  return (
                    <div 
                      key={server.name} 
                      className={`rounded-lg overflow-hidden border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                    >
                      <div 
                        className={`p-3 flex justify-between items-center cursor-pointer ${darkMode ? 'border-gray-600' : 'border-gray-200'} border-b`}
                        onClick={() => toggleServerExpansion(server.name)}
                      >
                        <div className="flex items-center">
                          <FiServer className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          <h4 className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {server.name}
                          </h4>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(server.name);
                            }}
                            className={`p-1 rounded ${favorites.includes(server.name) ? 'text-yellow-400' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                            title={favorites.includes(server.name) ? "Remove from favorites" : "Add to favorites"}
                          >
                            <FiStar />
                          </button>
                          <div className={`ml-2 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="p-3">
                          <ul className="space-y-2">
                            {server.urls.map((url, urlIndex) => {
                              const status = serverStatus[`${server.name}-${urlIndex}`] || 'Unknown';
                              return (
                                <li 
                                  key={urlIndex}
                                  className={`flex justify-between items-center p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-50'} cursor-pointer hover:opacity-90 transition-opacity`}
                                  onClick={() => openUrlInNewTab(url)}
                                >
                                  <div className="flex items-center min-w-0">
                                    <FiExternalLink className={`mr-2 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`text-sm truncate ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                      {url.replace('http://', '').replace('https://', '')}
                                    </span>
                                  </div>
                                  <div className="flex items-center ml-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border flex items-center ${getStatusColor(status)}`}>
                                      {getStatusIcon(status)}
                                      <span className="ml-1">{status}</span>
                                    </span>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}