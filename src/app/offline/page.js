"use client";

import { FiWifiOff, FiRefreshCw, FiHome } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const router = useRouter();

  const handleRetry = () => {
    // Check if online, then reload
    if (navigator.onLine) {
      router.refresh();
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 pt-16\">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mx-auto bg-red-100 p-4 rounded-full w-24 h-24 flex items-center justify-center mb-6">
          <FiWifiOff className="text-red-500 text-4xl" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">You're Offline</h1>
        <p className="text-gray-600 mb-6">
          This application requires an internet connection to test BDIX server connectivity.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw />
            Retry Connection
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            <FiHome />
            Go to Home
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">BDIX Testing Tip</h3>
          <p className="text-sm text-blue-700">
            Remember to connect to a BDIX-enabled ISP for the best local content access experience.
          </p>
        </div>
      </div>
    </div>
  );
}