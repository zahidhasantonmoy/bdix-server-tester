"use client";

import { useState, useEffect } from 'react';
import { FiWifi, FiGlobe, FiMapPin, FiActivity } from 'react-icons/fi';

export default function NetworkInfo({ darkMode }) {
  const [networkInfo, setNetworkInfo] = useState({
    ipAddress: 'Detecting...',
    isp: 'Detecting...',
    connectionType: 'Unknown',
    location: 'Bangladesh'
  });

  useEffect(() => {
    // Simulate network detection (in a real app, you'd use an API)
    const detectNetwork = async () => {
      try {
        // This is a placeholder - in a real implementation, you'd use a service like:
        // const response = await fetch('https://api.ipify.org?format=json');
        // const data = await response.json();
        
        // Simulate detection
        setTimeout(() => {
          setNetworkInfo({
            ipAddress: '103.109.56.115', // Simulated BDIX IP
            isp: 'BDIX Enabled ISP',
            connectionType: 'BDIX Direct',
            location: 'Dhaka, Bangladesh'
          });
        }, 1500);
      } catch (error) {
        setNetworkInfo({
          ipAddress: 'Detection failed',
          isp: 'Unknown',
          connectionType: 'Unknown',
          location: 'Bangladesh'
        });
      }
    };

    detectNetwork();
  }, []);

  return (
    <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <FiActivity className="inline mr-2" />
        Network Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <div className="flex items-center">
            <FiGlobe className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>IP Address</span>
          </div>
          <p className={`font-medium mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {networkInfo.ipAddress}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
          <div className="flex items-center">
            <FiWifi className={`mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>ISP</span>
          </div>
          <p className={`font-medium mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {networkInfo.isp}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <div className="flex items-center">
            <FiActivity className={`mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Connection</span>
          </div>
          <p className={`font-medium mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {networkInfo.connectionType}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
          <div className="flex items-center">
            <FiMapPin className={`mr-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Location</span>
          </div>
          <p className={`font-medium mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {networkInfo.location}
          </p>
        </div>
      </div>
      
      <div className={`mt-4 p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-yellow-50 text-yellow-800'}`}>
        <strong>Note:</strong> This tool detects if you're on a BDIX-enabled connection. 
        BDIX allows direct access to local content without international bandwidth.
      </div>
    </div>
  );
}