"use client";

import { useState } from 'react';
import { FiHelpCircle, FiX, FiBook, FiWifi, FiServer, FiBarChart2, FiStar } from 'react-icons/fi';

export default function HelpSection({ darkMode = false }) {
  const [isOpen, setIsOpen] = useState(false);

  const helpTopics = [
    {
      icon: <FiWifi className="text-blue-500" />,
      title: "How BDIX Testing Works",
      content: "BDIX testing checks connectivity to local content servers in Bangladesh. When servers show as 'Online', it means your ISP provides direct access to that content without using international bandwidth."
    },
    {
      icon: <FiServer className="text-green-500" />,
      title: "Understanding Server Status",
      content: "Online: Server is accessible via BDIX. Offline: Server is not accessible or your ISP doesn't provide access. Checking: Test in progress."
    },
    {
      icon: <FiBarChart2 className="text-purple-500" />,
      title: "Interpreting Results",
      content: "More online servers typically mean better BDIX connectivity. Online servers provide faster access to content and reduce international bandwidth usage."
    },
    {
      icon: <FiStar className="text-yellow-500" />,
      title: "Using Favorites",
      content: "Click the star icon next to any server to add it to your favorites. This allows quick access to your most important servers."
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 p-3 rounded-full shadow-lg z-30 ${
          darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        aria-label="Help"
      >
        <FiHelpCircle className="text-xl" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <FiBook />
                  BDIX Tester Help
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <FiX className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                </button>
              </div>

              <div className="space-y-6">
                {helpTopics.map((topic, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {topic.icon}
                      </div>
                      <div>
                        <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {topic.title}
                        </h3>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {topic.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`mt-8 p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tips for Better Testing
                </h3>
                <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Run tests during different times of day for varied results</li>
                  <li>• Use Quick Test for faster results with popular servers</li>
                  <li>• Bookmark this page for easy access to your BDIX tester</li>
                  <li>• Check results regularly to monitor your ISP's BDIX performance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}