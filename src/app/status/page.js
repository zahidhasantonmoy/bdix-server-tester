"use client";

import { useState, useEffect } from 'react';
import { FiWifi, FiCheckCircle, FiXCircle, FiClock, FiActivity, FiServer, FiBarChart2 } from 'react-icons/fi';

export default function StatusPage() {
  const [status, setStatus] = useState('loading');
  const [lastChecked, setLastChecked] = useState(null);
  const [uptime, setUptime] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setStatus('operational');
        } else {
          setStatus('degraded');
        }
      } catch (error) {
        setStatus('outage');
      }
      
      setLastChecked(new Date());
      
      // Mock uptime data
      setUptime({
        day: 100,
        week: 99.9,
        month: 99.5,
        year: 99.8
      });
    };

    checkStatus();
    
    // Check status every 5 minutes
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'outage':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return 'All Systems Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'outage':
        return 'Service Outage';
      default:
        return 'Checking Status...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center md:justify-start gap-3">
                <FiActivity className="text-yellow-300" />
                BDIX Tester Status
              </h1>
              <p className="mt-2 text-blue-100">
                Service status and uptime monitoring
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className={`text-5xl mb-2 ${getStatusColor(status)}`}>
                {status === 'operational' && <FiCheckCircle />}
                {status === 'degraded' && <FiClock />}
                {status === 'outage' && <FiXCircle />}
                {status === 'loading' && <FiActivity className="animate-spin" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {getStatusText(status)}
              </h2>
              <p className="text-gray-600 mt-1">
                Last checked: {lastChecked ? lastChecked.toLocaleString() : 'Never'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{uptime?.day || '--'}%</p>
                <p className="text-sm text-gray-600">24h</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{uptime?.week || '--'}%</p>
                <p className="text-sm text-gray-600">7d</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{uptime?.month || '--'}%</p>
                <p className="text-sm text-gray-600">30d</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-600">{uptime?.year || '--'}%</p>
                <p className="text-sm text-gray-600">1y</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FiServer className="text-blue-500 text-xl mr-2" />
              <h3 className="text-lg font-bold text-gray-800">Web Application</h3>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${status === 'operational' ? 'bg-green-500' : status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-700">
                {status === 'operational' ? 'Operational' : status === 'degraded' ? 'Degraded' : 'Outage'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FiWifi className="text-green-500 text-xl mr-2" />
              <h3 className="text-lg font-bold text-gray-800">API Endpoints</h3>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${status === 'operational' ? 'bg-green-500' : status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-700">
                {status === 'operational' ? 'Operational' : status === 'degraded' ? 'Degraded' : 'Outage'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FiBarChart2 className="text-purple-500 text-xl mr-2" />
              <h3 className="text-lg font-bold text-gray-800">Database</h3>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 bg-green-500`}></div>
              <span className="text-gray-700">Operational</span>
            </div>
          </div>
        </div>

        {/* Incident History */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Incidents</h3>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-800">Scheduled Maintenance</h4>
                <span className="text-sm text-gray-600">Aug 25, 2025</span>
              </div>
              <p className="text-gray-700 mt-2">
                Routine maintenance completed successfully. No downtime experienced.
              </p>
              <div className="flex items-center mt-2">
                <FiCheckCircle className="text-green-500 mr-2" />
                <span className="text-sm text-green-600">Resolved</span>
              </div>
            </div>
            
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-800">Performance Degradation</h4>
                <span className="text-sm text-gray-600">Aug 15, 2025</span>
              </div>
              <p className="text-gray-700 mt-2">
                Some users experienced slower response times. Issue resolved after CDN optimization.
              </p>
              <div className="flex items-center mt-2">
                <FiCheckCircle className="text-green-500 mr-2" />
                <span className="text-sm text-green-600">Resolved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-blue-50 rounded-2xl shadow-lg p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
          <p className="text-gray-700 mb-4">
            If you're experiencing issues with the BDIX Tester, please check our documentation 
            or contact support.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="/docs" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Documentation
            </a>
            <a 
              href="mailto:support@bdixtester.com" 
              className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                BDIX Connectivity Tester Status &copy; {new Date().getFullYear()}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Monitoring service availability and performance
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}