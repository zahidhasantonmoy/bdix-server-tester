"use client";

import { useState, useEffect } from 'react';
import { FiAlertTriangle, FiInfo, FiRefreshCw, FiX } from 'react-icons/fi';

export default function ErrorHandling({ darkMode }) {
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);

  // Add error function (to be used by main app)
  const addError = (error) => {
    const newError = {
      id: Date.now(),
      message: error.message || error,
      type: error.type || 'unknown',
      timestamp: new Date().toISOString(),
      url: error.url || 'Unknown'
    };
    
    setErrors(prev => [...prev, newError].slice(-10)); // Keep only last 10 errors
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const getErrorIcon = (type) => {
    switch (type) {
      case 'timeout':
        return <FiAlertTriangle className="text-yellow-500" />;
      case 'network':
        return <FiAlertTriangle className="text-red-500" />;
      case 'dns':
        return <FiAlertTriangle className="text-orange-500" />;
      default:
        return <FiAlertTriangle className="text-gray-500" />;
    }
  };

  const getErrorDescription = (type) => {
    switch (type) {
      case 'timeout':
        return 'Connection timed out - server may be slow or unreachable';
      case 'network':
        return 'Network error - check your internet connection';
      case 'dns':
        return 'DNS resolution failed - domain name may be incorrect';
      default:
        return 'An unknown error occurred';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {errors.length > 0 && (
        <div className={`rounded-lg shadow-lg max-w-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className={`flex justify-between items-center p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center">
              <FiAlertTriangle className="text-red-500 mr-2" />
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {errors.length} Error{errors.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowErrors(!showErrors)}
                className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <FiInfo className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
              <button 
                onClick={clearErrors}
                className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <FiX className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>
          </div>
          
          {showErrors && (
            <div className="max-h-60 overflow-y-auto">
              {errors.map((error) => (
                <div 
                  key={error.id} 
                  className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex items-start">
                    <div className="mr-2 mt-1">
                      {getErrorIcon(error.type)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {error.message}
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {getErrorDescription(error.type)}
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {error.url} • {new Date(error.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className={`p-3 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <button 
              onClick={clearErrors}
              className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              Clear All Errors
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export the addError function to be used by other components
export { ErrorHandling };