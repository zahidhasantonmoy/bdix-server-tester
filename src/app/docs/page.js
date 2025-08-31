"use client";

import { useState } from 'react';
import { FiBook, FiGlobe, FiWifi, FiInfo, FiChevronDown, FiChevronUp, FiStar, FiBarChart2, FiDownload, FiSun, FiMoon } from 'react-icons/fi';

export default function Documentation() {
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const docSections = [
    {
      id: 'introduction',
      title: 'Introduction to BDIX Tester',
      icon: <FiInfo className="text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p>
            The BDIX Tester is a comprehensive tool designed to help users in Bangladesh 
            test their connectivity to BDIX (Bangladesh Internet Exchange) servers. 
            This tool allows you to determine which local content servers are accessible 
            from your network connection.
          </p>
          <p>
            BDIX enables ISPs to exchange local internet traffic directly without using 
            international bandwidth, resulting in faster access to local content like 
            movies, software, and other digital services hosted within Bangladesh.
          </p>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Key Features',
      icon: <FiStar className="text-yellow-500" />,
      content: (
        <div className="space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Categorized Server Testing:</strong> Organized testing by server type (FTP, Media, Software, etc.)</li>
            <li><strong>Real-time Connectivity Testing:</strong> Instant results showing which servers are accessible</li>
            <li><strong>Favorites System:</strong> Save frequently used servers for quick access</li>
            <li><strong>Test History:</strong> Keep track of previous test results</li>
            <li><strong>Quick Test Mode:</strong> Test only the most popular servers for faster results</li>
            <li><strong>Dark/Light Mode:</strong> Choose your preferred viewing theme</li>
            <li><strong>Search & Filter:</strong> Easily find specific servers or categories</li>
            <li><strong>Export Results:</strong> Save test results for future reference</li>
            <li><strong>Network Information:</strong> View your connection details</li>
            <li><strong>Analytics Dashboard:</strong> Detailed statistics and trends</li>
          </ul>
        </div>
      )
    },
    {
      id: 'how-to-use',
      title: 'How to Use the BDIX Tester',
      icon: <FiBook className="text-green-500" />,
      content: (
        <div className="space-y-4">
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong>Basic Testing:</strong> Click "Test All Servers" to check connectivity to all BDIX servers
            </li>
            <li>
              <strong>Quick Test:</strong> Enable Quick Test mode to test only the most popular servers
            </li>
            <li>
              <strong>Filter Servers:</strong> Use the category filter to test specific types of servers
            </li>
            <li>
              <strong>Search:</strong> Use the search bar to find specific servers by name or URL
            </li>
            <li>
              <strong>View Results:</strong> Servers will show as "Online" (accessible) or "Offline" (inaccessible)
            </li>
            <li>
              <strong>Save Favorites:</strong> Click the star icon on any server to add it to your favorites
            </li>
            <li>
              <strong>Check History:</strong> Switch to the History tab to view previous test results
            </li>
          </ol>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className="font-medium">Tip:</p>
            <p>If a server shows as "Online", you can access that content directly through BDIX. 
            "Offline" means the content is not accessible via BDIX from your current network.</p>
          </div>
        </div>
      )
    },
    {
      id: 'understanding-results',
      title: 'Understanding Test Results',
      icon: <FiBarChart2 className="text-purple-500" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start">
              <FiWifi className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Online (Green)</p>
                <p>The server is accessible via BDIX from your network. You can access this content at local speeds.</p>
              </div>
            </div>
            <div className="flex items-start">
              <FiWifiOff className="text-red-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Offline (Red)</p>
                <p>The server is not accessible via BDIX from your network. Content access will use international bandwidth.</p>
              </div>
            </div>
            <div className="flex items-start">
              <FiLoader className="text-yellow-500 mt-1 mr-2 flex-shrink-0 animate-spin" />
              <div>
                <p className="font-medium">Checking... (Yellow)</p>
                <p>The server is currently being tested. Please wait for the result.</p>
              </div>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
            <p className="font-medium">Important:</p>
            <p>Results depend on your current network connection and ISP. Different ISPs have different BDIX connectivity.</p>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting Common Issues',
      icon: <FiInfo className="text-red-500" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="font-medium">All servers show as Offline</p>
              <ul className="list-disc pl-5 mt-1">
                <li>You may not be on a BDIX-enabled ISP</li>
                <li>Check your internet connection</li>
                <li>Try testing again later</li>
                <li>Clear your browser cache and try again</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Some servers show as Offline</p>
              <ul className="list-disc pl-5 mt-1">
                <li>The specific server may be temporarily down</li>
                <li>Your ISP may not have connectivity to that specific server</li>
                <li>Try testing individual URLs for that server</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Tests are taking too long</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Enable Quick Test mode to test fewer servers</li>
                <li>Check your internet connection speed</li>
                <li>Try again during off-peak hours</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'technical-details',
      title: 'Technical Implementation Details',
      icon: <FiGlobe className="text-indigo-500" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <p>
              The BDIX Tester uses client-side JavaScript to test server connectivity directly 
              from your browser. This ensures that tests reflect your actual network conditions.
            </p>
            <div>
              <p className="font-medium">Testing Methodology:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Image-based connectivity testing for reliable results</li>
                <li>Concurrent testing with controlled request limits</li>
                <li>Timeout handling for unresponsive servers</li>
                <li>Client-side only - no server-side processing of your data</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Data Privacy:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>All testing happens in your browser</li>
                <li>No personal data is collected or stored</li>
                <li>Test results are stored locally in your browser</li>
                <li>You can clear all data at any time</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-600 to-indigo-700'} text-white shadow-xl`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center md:justify-start gap-3">
                <FiBook className="text-yellow-300" />
                BDIX Tester Documentation
              </h1>
              <p className="mt-2 text-blue-100">
                Comprehensive guide to using the BDIX Connectivity Tester
              </p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white text-blue-600'}`}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <FiSun /> : <FiMoon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className={`lg:col-span-1 rounded-xl shadow-md p-6 h-fit sticky top-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Table of Contents
            </h2>
            <nav className="space-y-2">
              {docSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Documentation Content */}
          <div className="lg:col-span-3 space-y-6">
            {docSections.map((section) => (
              <div 
                key={section.id}
                id={section.id}
                className={`rounded-xl shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full p-6 text-left flex justify-between items-center ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">{section.icon}</span>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {section.title}
                    </h2>
                  </div>
                  {expandedSection === section.id ? (
                    <FiChevronUp className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  ) : (
                    <FiChevronDown className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                </button>
                
                {(expandedSection === section.id || section.id === 'introduction') && (
                  <div className={`px-6 pb-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className={`pt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {section.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-800'} text-white py-8 mt-12`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                BDIX Connectivity Tester Documentation &copy; {new Date().getFullYear()}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Help users understand and utilize BDIX technology effectively
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}