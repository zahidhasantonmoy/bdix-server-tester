"use client";

import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiSearch, FiSend, FiCheckCircle } from 'react-icons/fi';

export default function ServerSuggestions({ darkMode, onSuggestionSubmit }) {
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    name: '',
    urls: '',
    category: 'FTP Servers',
    description: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fetch suggestions from API
  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await fetch(`/api/servers?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitStatus('submitting');
      
      const response = await fetch('/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSuggestion,
          urls: newSuggestion.urls.split(',').map(url => url.trim()).filter(url => url)
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        setNewSuggestion({
          name: '',
          urls: '',
          category: 'FTP Servers',
          description: ''
        });
        
        // Refresh suggestions
        fetchSuggestions();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSubmitStatus(null);
          setShowForm(false);
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setSubmitStatus('error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSuggestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FiPlus className={`text-xl mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Server Suggestions
          </h3>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showForm
              ? darkMode
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
              : darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {showForm ? 'Cancel' : 'Suggest Server'}
        </button>
      </div>
      
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search suggested servers..."
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'border-gray-300'
            }`}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {/* Suggestion Form */}
      {showForm && (
        <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Suggest a New Server
          </h4>
          
          {submitStatus === 'success' && (
            <div className={`p-3 rounded-lg mb-4 flex items-center ${darkMode ? 'bg-green-900/30 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
              <FiCheckCircle className={`mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={darkMode ? 'text-green-300' : 'text-green-800'}>
                Server suggestion submitted successfully!
              </span>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
              <span className={darkMode ? 'text-red-300' : 'text-red-800'}>
                Error submitting suggestion. Please try again.
              </span>
            </div>
          )}
          
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Server Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={newSuggestion.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'border-gray-300'
                }`}
                placeholder="Enter server name"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                URLs (comma separated) *
              </label>
              <input
                type="text"
                name="urls"
                required
                value={newSuggestion.urls}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'border-gray-300'
                }`}
                placeholder="http://example.com, http://192.168.1.1"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                name="category"
                value={newSuggestion.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'border-gray-300'
                }`}
              >
                <option value="FTP Servers">FTP Servers</option>
                <option value="Media Servers">Media Servers</option>
                <option value="Software & Applications">Software & Applications</option>
                <option value="ISP Specific">ISP Specific</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                name="description"
                value={newSuggestion.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'border-gray-300'
                }`}
                placeholder="Brief description of the server and its content"
              />
            </div>
            
            <button
              type="submit"
              disabled={submitStatus === 'submitting'}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                submitStatus === 'submitting'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {submitStatus === 'submitting' ? (
                <>
                  <FiSend className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="mr-2" />
                  Submit Suggestion
                </>
              )}
            </button>
          </form>
        </div>
      )}
      
      {/* Suggestions List */}
      <div>
        <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {searchQuery ? 'Search Results' : 'Popular Suggestions'}
        </h4>
        
        {suggestions.length > 0 ? (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {suggestion.name}
                    </h5>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {suggestion.category}
                    </p>
                    {suggestion.description && (
                      <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {suggestion.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onSuggestionSubmit && onSuggestionSubmit(suggestion)}
                    className={`p-2 rounded-lg ${
                      darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    title="Add to servers"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center p-8 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <FiSearch className={`mx-auto text-4xl mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {searchQuery ? 'No suggestions found' : 'No suggestions available'}
            </p>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchQuery ? 'Try a different search term' : 'Check back later for new suggestions'}
            </p>
          </div>
        )}
      </div>
      
      <div className={`mt-4 p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
        <strong>Community Driven:</strong> Help improve this tool by suggesting new servers. 
        Your contributions help other users discover more BDIX content.
      </div>
    </div>
  );
}