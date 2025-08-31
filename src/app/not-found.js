"use client";

import { FiHome, FiSearch, FiFrown, FiExternalLink } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  const goHome = () => {
    router.push('/');
  };

  const searchBDIX = () => {
    router.push('/#search');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 pt-16">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <FiFrown className="text-red-500 text-5xl" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">Page Not Found</h2>
            
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={goHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg transform hover:scale-105"
              >
                <FiHome className="text-xl" />
                Go Home
              </button>
              
              <button
                onClick={searchBDIX}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all shadow transform hover:scale-105"
              >
                <FiSearch className="text-xl" />
                Test BDIX Servers
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 max-w-lg mx-auto">
              <h3 className="font-bold text-gray-800 mb-3">Looking for BDIX Testing?</h3>
              <p className="text-gray-600 mb-4">
                Test your BDIX server connectivity directly from our homepage.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start BDIX Testing
                <FiExternalLink className="text-sm" />
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