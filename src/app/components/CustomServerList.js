"use client";

import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiUpload, FiDownload, FiServer } from 'react-icons/fi';

export default function CustomServerList({ darkMode = false }) {
  const [customServers, setCustomServers] = useState([]);
  const [newServer, setNewServer] = useState({ name: '', url: '' });
  const [isImporting, setIsImporting] = useState(false);

  // Load custom servers from localStorage
  useEffect(() => {
    const savedServers = localStorage.getItem('customServers');
    if (savedServers) {
      setCustomServers(JSON.parse(savedServers));
    }
  }, []);

  // Save custom servers to localStorage
  useEffect(() => {
    localStorage.setItem('customServers', JSON.stringify(customServers));
  }, [customServers]);

  const addServer = () => {
    if (newServer.name && newServer.url) {
      const server = {
        id: Date.now(),
        name: newServer.name,
        url: newServer.url,
        category: 'Custom'
      };
      setCustomServers([...customServers, server]);
      setNewServer({ name: '', url: '' });
    }
  };

  const removeServer = (id) => {
    setCustomServers(customServers.filter(server => server.id !== id));
  };

  const exportServers = () => {
    const dataStr = JSON.stringify(customServers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `bdix-custom-servers-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importServers = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedServers = JSON.parse(e.target.result);
          if (Array.isArray(importedServers)) {
            // Add imported servers with new IDs
            const serversWithIds = importedServers.map(server => ({
              ...server,
              id: Date.now() + Math.random()
            }));
            setCustomServers([...customServers, ...serversWithIds]);
          }
        } catch (error) {
          console.error('Error importing servers:', error);
          alert('Error importing servers. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = ''; // Reset file input
  };

  return (
    <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
      <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <FiServer />
        Custom Servers
      </h3>
      
      <div className="mb-4">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Server name"
            value={newServer.name}
            onChange={(e) => setNewServer({...newServer, name: e.target.value})}
            className={`flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
            }`}
          />
          <input
            type="text"
            placeholder="http://server-url.com"
            value={newServer.url}
            onChange={(e) => setNewServer({...newServer, url: e.target.value})}
            className={`flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
            }`}
          />
          <button
            onClick={addServer}
            className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            <FiPlus />
          </button>
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={exportServers}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          <FiDownload />
          Export
        </button>
        
        <label className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}>
          <FiUpload />
          Import
          <input
            type="file"
            accept=".json"
            onChange={importServers}
            className="hidden"
          />
        </label>
      </div>
      
      {customServers.length > 0 ? (
        <div className={`rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} max-h-60 overflow-y-auto`}>
          {customServers.map((server) => (
            <div 
              key={server.id} 
              className={`flex justify-between items-center p-3 border-b ${
                darkMode ? 'border-gray-600' : 'border-gray-200'
              }`}
            >
              <div>
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {server.name}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {server.url}
                </div>
              </div>
              <button
                onClick={() => removeServer(server.id)}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                }`}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <FiServer className={`mx-auto text-3xl mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            No custom servers added yet
          </p>
        </div>
      )}
    </div>
  );
}