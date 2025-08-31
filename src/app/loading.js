"use client";

import { FiLoader, FiWifi, FiServer } from 'react-icons/fi';

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 pt-16">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <FiWifi className="text-blue-500 text-6xl animate-pulse" />
              <FiLoader className="absolute -top-2 -right-2 text-indigo-500 text-2xl animate-spin" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading BDIX Tester</h1>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FiServer className="text-gray-500 mr-3" />
                <span className="text-gray-700">Initializing application</span>
              </div>
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FiWifi className="text-gray-500 mr-3" />
                <span className="text-gray-700">Loading server data</span>
              </div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FiLoader className="text-gray-500 mr-3" />
                <span className="text-gray-700">Preparing interface</span>
              </div>
              <div className="w-4 h-4 bg-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
            <p className="text-gray-600 text-sm mt-2">Loading... 75%</p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Did you know?</strong> BDIX allows faster access to local content by routing traffic directly within Bangladesh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}