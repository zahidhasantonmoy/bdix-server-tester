"use client";

import { FiAlertTriangle, FiRefreshCw, FiHome, FiMail } from 'react-icons/fi';
import { useEffect } from 'react';

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 pt-16">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <FiAlertTriangle className="text-red-500 text-5xl" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Something Went Wrong</h1>
            
            <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
              We're sorry, but something unexpected happened. Our team has been notified.
            </p>
            
            <div className="bg-red-50 rounded-2xl p-6 mb-8 text-left max-w-lg mx-auto">
              <h3 className="font-bold text-red-800 mb-2 flex items-center">
                <FiAlertTriangle className="mr-2" />
                Error Details
              </h3>
              <p className="text-red-700 text-sm font-mono bg-red-100 p-3 rounded-lg">
                {error?.message || 'An unknown error occurred'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-700 transition-all shadow-lg transform hover:scale-105"
              >
                <FiRefreshCw className="text-xl" />
                Try Again
              </button>
              
              <a
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all shadow transform hover:scale-105"
              >
                <FiHome className="text-xl" />
                Go Home
              </a>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 max-w-lg mx-auto">
              <h3 className="font-bold text-gray-800 mb-3">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If this problem persists, please contact our support team.
              </p>
              <a
                href="mailto:support@bdixtester.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiMail className="text-sm" />
                Contact Support
              </a>
            </div>
          </div>
          
          <div className="bg-gray-800 text-white p-6 text-center">
            <p className="text-gray-400">
              BDIX Connectivity Tester &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}