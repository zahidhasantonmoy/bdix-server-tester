"use client";

import { FiInfo, FiGlobe, FiServer, FiMapPin, FiActivity } from 'react-icons/fi';

export default function ServerDetails({ server, darkMode }) {
  return (
    <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center mb-4">
        <FiInfo className={`text-xl mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Server Information
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Server Name</h4>
          <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{server.name}</p>
        </div>
        
        <div>
          <h4 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</h4>
          <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{server.category}</p>
        </div>
        
        <div>
          <h4 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>URLs</h4>
          <div className="mt-1 space-y-2">
            {server.urls.map((url, index) => (
              <div 
                key={index} 
                className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <FiGlobe className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {url}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {server.popularity && (
          <div>
            <h4 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Popularity</h4>
            <div className="mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-lg ${i < server.popularity ? (darkMode ? 'text-yellow-400' : 'text-yellow-500') : (darkMode ? 'text-gray-600' : 'text-gray-300')}`}
                  >
                    ★
                  </span>
                ))}
                <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({server.popularity}/10)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className={`mt-4 p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
        <strong>BDIX Information:</strong> This server is part of the Bangladesh Internet Exchange (BDIX), 
        which allows direct access to local content without using international bandwidth.
      </div>
    </div>
  );
}