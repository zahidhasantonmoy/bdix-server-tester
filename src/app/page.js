"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiWifi, FiWifiOff, FiLoader, FiRefreshCw, FiServer, FiCheckCircle, FiXCircle, FiClock, FiSearch, FiFacebook, FiLinkedin, FiGithub, FiGlobe, FiExternalLink, FiFilter, FiStar, FiSun, FiMoon, FiBarChart2, FiDownload, FiShare2, FiHeart, FiInfo, FiTrendingUp, FiMapPin, FiActivity, FiAlertTriangle, FiX, FiBook, FiChevronDown, FiChevronUp, FiTrendingDown } from 'react-icons/fi';

import NetworkInfo from './components/NetworkInfo';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ServerDetails from './components/ServerDetails';
import { ErrorHandling } from './components/ErrorHandling';
import SpeedTest from './components/SpeedTest';
import BDIXGuide from './components/BDIXGuide';
import ServerComparison from './components/ServerComparison';

// Categorized BDIX servers
const categorizedServers = {
  "FTP Servers": [
    { name: "SAMONLINE FTP SERVER", urls: ["http://172.16.50.4", "http://172.16.50.5", "https://samftp.com"], popularity: 10 },
    { name: "DISCOVERY FTP SERVER", urls: ["http://discoveryftp.net"], popularity: 9 },
    { name: "WOW MOVIE ZONE FTP SERVER", urls: ["http://172.27.27.84"], popularity: 8 },
    { name: "BUSINESS NETWORK(B.NET) FTP SERVER", urls: ["http://ftpbd.net", "http://103.58.73.9", "http://media.ftpbd.net", "http://server1.ftpbd.net", "http://server4.ftpbd.net"], popularity: 9 },
    { name: "ICC COMMUNICATION FTP SERVER", urls: ["http://10.16.100.244"], popularity: 7 },
    { name: "EBOX FTP SERVER", urls: ["http://fs.ebox.live", "http://103.49.168.107", "http://fileserver.ebox.live"], popularity: 7 },
    { name: "POLLyFLIX & AMRBD FTP SERVER", urls: ["http://12.1.1.2", "http://12.1.1.3/flix", "http://pollyflix.com", "http://fs.amrbd.com", "http://fs2.amrbd.com"], popularity: 8 },
    { name: "CIRCLE NET FTP SERVER", urls: ["http://15.1.1.1", "http://circleftp.net", "http://ftp2.circleftp.net", "http://hd.circleftp.net"], popularity: 6 },
    { name: "MAZEDA NETWORK FTP SERVER", urls: ["http://172.22.22.101", "http://ftpweb.mazedanetworks.net"], popularity: 7 },
    { name: "CINEBIOSCOPE FTP SERVER", urls: ["http://www.cinebioscope.com"], popularity: 6 },
    { name: "MIDIPLEX FTP SERVER", urls: ["http://midiplex.net", "http://cdn.midiplex.net"], popularity: 6 },
    { name: "SEBAIT FTP SERVER", urls: ["http://103.195.1.50"], popularity: 5 },
    { name: "TAJPATA FTP SERVER", urls: ["http://www.tajpata.com", "http://file.tajpata.com"], popularity: 5 },
    { name: "BITFLIXBD FTP SERVER", urls: ["http://bitflixbd.com"], popularity: 5 },
    { name: "KHULNAFLIX FTP SERVER", urls: ["http://khulnaflix.net", "http://file.khulnaflix.net"], popularity: 5 }
  ],
  "Media Servers": [
    { name: "NATURALBD FTP SERVER", urls: ["http://www.naturalbd.com", "http://new.naturalbd.com"], popularity: 8 },
    { name: "DHAKAMOVIE FTP SERVER", urls: ["http://dhakamovie.com"], popularity: 7 },
    { name: "CTGMOVIES FTP SERVER", urls: ["http://ctgmovies.com", "http://crazyctg.com", "http://www.ctgflix.com", "http://media.ctgfun.com", "http://fs.evillagectg.com", "http://www.ctghall.com", "http://www.ctgstream.com", "https://www.ctghub.com"], popularity: 8 },
    { name: "MOVIEHAAT FTP SERVER", urls: ["http://moviehaat.net"], popularity: 7 },
    { name: "BOSSBD FTP SERVER", urls: ["http://www.bossbd.net", "http://bossbd.live", "http://cdn.bossbd.net", "http://cdn1.bossbd.net", "http://cdn2.bossbd.net"], popularity: 8 },
    { name: "MOVIEBAZER FTP SERVER", urls: ["http://mymoviebazar.com"], popularity: 7 },
    { name: "BDPLEX FTP SERVER", urls: ["http://bdplex.net"], popularity: 6 },
    { name: "TIMEPASSBD FTP SERVER", urls: ["http://103.200.36.242", "http://www.timepassbd.live", "http://ftp.timepassbd.live"], popularity: 6 },
    { name: "CITYCLOUDBD FTP SERVER", urls: ["http://103.102.253.250"], popularity: 6 },
    { name: "ABCMOVIES FTP SERVER", urls: ["http://103.103.239.66", "http://abcflixbd.com"], popularity: 6 },
    { name: "DEKHVHAI FTP SERVER", urls: ["http://dekhvhai.com"], popularity: 5 },
    { name: "ASIAN NET FTP SERVER", urls: ["http://asianftp.com"], popularity: 5 },
    { name: "MOJALOSS FTP SERVER", urls: ["https://mojaloss.net"], popularity: 5 },
    { name: "ELAACH FTP SERVER", urls: ["http://www.elaach.com"], popularity: 4 },
    { name: "DHAKA FTP SERVER", urls: ["http://dhakaftp.com"], popularity: 4 }
  ],
  "Software & Applications": [
    { name: "ALPHAMEDIAZONE FTP SERVER", urls: ["http://www.alphabroadway.com", "http://ftp.alphamediazone.com"], popularity: 7 },
    { name: "FREEDOWNLOADBD FTP SERVER", urls: ["http://www.freedownloadbd.com"], popularity: 6 },
    { name: "CINEMABAZER FTP SERVER", urls: ["http://cinemabazar.net", "http://103.81.104.98", "http://cinemabazar.net/DATA/NAS1"], popularity: 6 },
    { name: "INFOLINK FTP SERVER", urls: ["https://infolinkbd.com"], popularity: 5 },
    { name: "DNETBD FTP SERVER", urls: ["http://103.76.196.90", "https://dnetdrive.com"], popularity: 5 },
    { name: "VDOMELA FTP SERVER", urls: ["http://vdomela.com"], popularity: 4 },
    { name: "SUNPLEX FTP SERVER", urls: ["https://sunplex.net"], popularity: 5 },
    { name: "MOVIEMELA FTP SERVER", urls: ["http://www.moviemela.live"], popularity: 5 },
    { name: "MOVIEBOXBD FTP SERVER", urls: ["http://movieboxbd.com"], popularity: 4 }
  ],
  "ISP Specific": [
    { name: "LINK3 INTERNET FTP SERVER", urls: ["http://www.cinehub24.com"], popularity: 7 },
    { name: "DHAKA FIBER NET FTP SERVER", urls: ["http://media.dfnbd.net"], popularity: 6 },
    { name: "EKUSHE NET FTP SERVER", urls: ["http://10.100.100.2"], popularity: 5 },
    { name: "EVOLUTION FTP SERVER", urls: ["http://www.evonetbd.com"], popularity: 5 },
    { name: "DREAMNETBD FTP SERVER", urls: ["https://dreamnetbd.com", "http://bddreamnet.blogspot.com"], popularity: 5 },
    { name: "BDLAN FTP SERVER", urls: ["http://www.bdlan.net"], popularity: 4 },
    { name: "LINK71 FTP SERVER", urls: ["http://103.102.27.170"], popularity: 4 },
    { name: "SURZOMAMA FTP SERVER", urls: ["http://103.85.235.254"], popularity: 4 },
    { name: "AFTAB NAGAR ONLINE SERVICE FTP SERVER", urls: ["https://www.anosbd.com", "https://www.anosbd.com/ftp"], popularity: 4 },
    { name: "BDSPEED FTP SERVER", urls: ["http://www.bdspeed.com"], popularity: 4 }
  ],
  "Miscellaneous": [
    { name: "MOVIECOUNTER FTP SERVER", urls: ["https://moviescounterhd.club"], popularity: 5 },
    { name: "NETMATRIX FTP SERVER", urls: ["http://www.netmatrixbd.com"], popularity: 4 },
    { name: "BOLMOVIES FTP SERVER", urls: ["http://www.bolmovies.com"], popularity: 4 },
    { name: "FURIOUS INTERNET FTP SERVER", urls: ["http://www.furiousnet.net", "http://media.furiousnet.net"], popularity: 4 },
    { name: "TETRASOFT FTP SERVER", urls: ["https://www.tetrasoftbd.com", "http://tetraplex.net.bd"], popularity: 4 },
    { name: "SKNETCITY FTP SERVER", urls: ["https://www.sknetcity.com"], popularity: 3 },
    { name: "UNIVISION FTP SERVER", urls: ["http://www.univisionbd.net"], popularity: 3 },
    { name: "IFLIX FTP SERVER", urls: ["https://www.iflix.com"], popularity: 3 },
    { name: "LEADTECHNOLOGY FTP SERVER", urls: ["http://leadtechnologybd.com/bdix-server"], popularity: 3 },
    { name: "QUICKONLINE FTP SERVER", urls: ["http://quickonlineftp.com"], popularity: 3 }
  ]
};

export default function Home() {
  const [serverStatus, setServerStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, online, offline
  const [expandedServers, setExpandedServers] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [testHistory, setTestHistory] = useState([]);
  const [sortBy, setSortBy] = useState('popularity'); // popularity, name, status
  const [viewMode, setViewMode] = useState('categories'); // categories, favorites, history
  const [quickTestMode, setQuickTestMode] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bdixFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
    }
    
    const savedHistory = localStorage.getItem('testHistory');
    if (savedHistory) {
      setTestHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('bdixFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
  }, [testHistory]);

  // Flatten servers for easier processing
  const allServers = useMemo(() => {
    const servers = [];
    Object.entries(categorizedServers).forEach(([category, categoryServers]) => {
      categoryServers.forEach(server => {
        servers.push({ ...server, category });
      });
    });
    return servers;
  }, []);

  // Get top 10 most popular servers for quick test
  const quickTestServers = useMemo(() => {
    return allServers
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);
  }, [allServers]);

  // Get unique categories
  const categories = ['All', ...Object.keys(categorizedServers)];

  // Filter servers based on search and category
  const filteredServers = useMemo(() => {
    let filtered = viewMode === 'favorites' 
      ? allServers.filter(server => favorites.includes(server.name))
      : allServers;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(server => 
        server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.urls.some(url => url.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'All' && viewMode !== 'favorites') {
      filtered = filtered.filter(server => server.category === selectedCategory);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popularity':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'status':
        filtered.sort((a, b) => {
          const statusA = serverStatus[`${a.name}-0`] || 'Unknown';
          const statusB = serverStatus[`${b.name}-0`] || 'Unknown';
          return statusB.localeCompare(statusA);
        });
        break;
      default:
        if (viewMode !== 'favorites') {
          filtered.sort((a, b) => b.popularity - a.popularity);
        }
        break;
    }
    
    return filtered;
  }, [allServers, searchTerm, selectedCategory, serverStatus, viewMode, favorites, sortBy]);

  const checkServer = useCallback((url) => {
    return new Promise((resolve) => {
      // Use the working CORS Bypass approach
      const img = new Image();
      const timeout = setTimeout(() => {
        resolve({ status: 'Offline', responseTime: 3000 });
      }, 3000);

      const startTime = Date.now();

      img.onload = function() {
        clearTimeout(timeout);
        const responseTime = Date.now() - startTime;
        resolve({ status: 'Online', responseTime });
      };

      img.onerror = function() {
        clearTimeout(timeout);
        const responseTime = Date.now() - startTime;
        // For BDIX testing, even an error often means the server responded
        resolve({ status: 'Online', responseTime });
      };

      // Try to load favicon
      img.src = `${url}/favicon.ico?t=${Date.now()}`;
    });
  }, []);

  const checkAllServers = useCallback(async () => {
    const serversToTest = quickTestMode ? quickTestServers : filteredServers;
    
    setIsLoading(true);
    setProgress(0);
    
    // Initialize all servers as "Checking..."
    const initialStatus = {};
    let totalUrls = 0;
    serversToTest.forEach(server => {
      server.urls.forEach((url, urlIndex) => {
        initialStatus[`${server.name}-${urlIndex}`] = 'Checking...';
        totalUrls++;
      });
    });
    setServerStatus(initialStatus);
    
    // Create a flat list of all URLs to test
    const urlsToTest = [];
    serversToTest.forEach(server => {
      server.urls.forEach((url, urlIndex) => {
        urlsToTest.push({ server, url, serverName: server.name, urlIndex });
      });
    });
    
    // Process URLs with concurrency limit to avoid overwhelming the browser
    const concurrencyLimit = 10; // Test 10 URLs simultaneously
    let completedUrls = 0;
    
    // Record test start time
    const testStartTime = new Date().toISOString();
    
    // Process URLs in chunks
    for (let i = 0; i < urlsToTest.length; i += concurrencyLimit) {
      const chunk = urlsToTest.slice(i, i + concurrencyLimit);
      const chunkPromises = chunk.map(item => 
        checkServer(item.url).then(result => ({
          serverName: item.serverName,
          urlIndex: item.urlIndex,
          status: result.status,
          responseTime: result.responseTime
        }))
      );
      
      // Wait for all promises in this chunk to complete
      const chunkResults = await Promise.all(chunkPromises);
      
      // Update status for completed URLs
      const updatedStatus = {};
      chunkResults.forEach(result => {
        updatedStatus[`${result.serverName}-${result.urlIndex}`] = result.status;
      });
      
      setServerStatus(prevStatus => ({
        ...prevStatus,
        ...updatedStatus
      }));
      
      // Update progress
      completedUrls += chunkResults.length;
      setProgress(Math.round((completedUrls / totalUrls) * 100));
    }
    
    // Record test completion
    const testEndTime = new Date().toISOString();
    
    // Calculate online/offline counts for this specific test
    let onlineCount = 0;
    let offlineCount = 0;
    Object.values(serverStatus).forEach(status => {
      if (status === 'Online') onlineCount++;
      else if (status === 'Offline') offlineCount++;
    });
    
    // Update test history
    const testResult = {
      id: Date.now(),
      timestamp: testEndTime,
      serversTested: serversToTest.length,
      onlineCount: onlineCount,
      offlineCount: offlineCount,
      duration: (new Date(testEndTime) - new Date(testStartTime)) / 1000
    };
    
    setTestHistory(prev => [testResult, ...prev.slice(0, 9)]); // Keep last 10 tests
    
    setIsLoading(false);
  }, [checkServer, filteredServers, quickTestMode, quickTestServers, serverStatus]);

  const toggleServerExpansion = (serverName) => {
    setExpandedServers(prev => ({
      ...prev,
      [serverName]: !prev[serverName]
    }));
  };

  const toggleCategoryExpansion = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleFavorite = (serverName) => {
    setFavorites(prev => 
      prev.includes(serverName) 
        ? prev.filter(name => name !== serverName)
        : [...prev, serverName]
    );
  };

  const openUrlInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const exportResults = () => {
    const results = filteredServers.map(server => ({
      name: server.name,
      category: server.category,
      urls: server.urls.map((url, index) => ({
        url,
        status: serverStatus[`${server.name}-${index}`] || 'Not Tested'
      }))
    }));
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `bdix-test-results-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const shareResults = async () => {
    const onlineCount = Object.values(serverStatus).filter(status => status === 'Online').length;
    const text = `BDIX Connectivity Test Results:
${onlineCount} servers accessible
Tested on ${new Date().toLocaleString()}

Check your BDIX connectivity at bdix-tester.vercel.app`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BDIX Connectivity Test Results',
          text: text,
          url: window.location.href
        });
      } catch (err) {
        console.log('Sharing failed', err);
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(text);
        alert('Results copied to clipboard!');
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Online':
        return <FiWifi className="text-green-500" />;
      case 'Offline':
        return <FiWifiOff className="text-red-500" />;
      case 'Checking...':
        return <FiLoader className="text-yellow-500 animate-spin" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Checking...':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredCategorizedServers = useMemo(() => {
    if (viewMode === 'favorites') {
      return { "Favorite Servers": filteredServers };
    }
    
    const result = {};
    Object.entries(categorizedServers).forEach(([category, servers]) => {
      const filtered = servers.filter(server => 
        filteredServers.some(fs => fs.name === server.name)
      );
      if (filtered.length > 0) {
        result[category] = filtered;
      }
    });
    return result;
  }, [filteredServers, viewMode]);

  const onlineCount = Object.values(serverStatus).filter(status => status === 'Online').length;
  const offlineCount = Object.values(serverStatus).filter(status => status === 'Offline').length;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-600 to-indigo-700'} text-white shadow-xl`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold flex items-center justify-center md:justify-start gap-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FiWifi className="text-yellow-300" />
                BDIX Connectivity Tester
              </motion.h1>
              <motion.p 
                className="mt-2 text-blue-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Test your BDIX server connectivity in Bangladesh
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex gap-2">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white text-blue-600'}`}
                  title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? <FiSun /> : <FiMoon />}
                </button>
                
                <button 
                  onClick={() => setViewMode(viewMode === 'favorites' ? 'categories' : 'favorites')}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white text-blue-600'}`}
                  title={viewMode === 'favorites' ? "View all servers" : "View favorites"}
                >
                  <FiStar className={viewMode === 'favorites' ? 'text-yellow-400' : ''} />
                </button>
              </div>
              
              <button 
                onClick={checkAllServers}
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-105'
                }`}
              >
                <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
                {isLoading ? 'Testing...' : quickTestMode ? 'Quick Test' : 'Test All Servers'}
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className={`rounded-xl shadow-md p-6 flex items-center gap-4 border-l-4 border-blue-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiServer className="text-blue-600 text-2xl" />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Servers</p>
              <p className="text-2xl font-bold">
                {allServers.reduce((sum, server) => sum + server.urls.length, 0)}
              </p>
            </div>
          </div>
          
          <div className={`rounded-xl shadow-md p-6 flex items-center gap-4 border-l-4 border-green-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="bg-green-100 p-3 rounded-full">
              <FiCheckCircle className="text-green-600 text-2xl" />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Online</p>
              <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
            </div>
          </div>
          
          <div className={`rounded-xl shadow-md p-6 flex items-center gap-4 border-l-4 border-red-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="bg-red-100 p-3 rounded-full">
              <FiXCircle className="text-red-600 text-2xl" />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Offline</p>
              <p className="text-2xl font-bold text-red-600">{offlineCount}</p>
            </div>
          </div>
          
          <div className={`rounded-xl shadow-md p-6 flex items-center gap-4 border-l-4 border-purple-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiFilter className="text-purple-600 text-2xl" />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Categories</p>
              <p className="text-2xl font-bold text-purple-600">{Object.keys(categorizedServers).length}</p>
            </div>
          </div>
          
          <div className={`rounded-xl shadow-md p-6 flex items-center gap-4 border-l-4 border-yellow-500 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiHeart className="text-yellow-600 text-2xl" />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Favorites</p>
              <p className="text-2xl font-bold text-yellow-600">{favorites.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* View Mode Tabs */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className={`rounded-xl shadow-md p-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode('categories')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'categories' 
                  ? darkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-600 text-white'
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Servers
            </button>
            <button
              onClick={() => setViewMode('favorites')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'favorites' 
                  ? darkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-600 text-white'
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiStar className={viewMode === 'favorites' ? 'text-yellow-400' : ''} />
              Favorites
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'history' 
                  ? darkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-600 text-white'
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiBarChart2 />
              Test History
            </button>
            <button
              onClick={() => setQuickTestMode(!quickTestMode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                quickTestMode 
                  ? darkMode 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-600 text-white'
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Quick Test {quickTestMode ? '(On)' : '(Off)'}
            </button>\n          </div>\n        </div>\n      </motion.div>\n\n      {/* Network Information and Analytics */}\n      {viewMode !== 'history' && (\n        <motion.div \n          className=\"max-w-7xl mx-auto px-4 py-6\"\n          initial={{ opacity: 0, y: 20 }}\n          animate={{ opacity: 1, y: 0 }}\n          transition={{ delay: 0.9, duration: 0.5 }}\n        >\n          <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">\n            <NetworkInfo darkMode={darkMode} />\n            <AnalyticsDashboard \n              serverStatus={serverStatus} \n              testHistory={testHistory} \n              darkMode={darkMode} \n            />\n          </div>\n        </motion.div>\n      )}\n\n      {/* Controls */}
      {viewMode !== 'history' && (
        <motion.div 
          className="max-w-7xl mx-auto px-4 pb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search servers or URLs..."
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="popularity">Sort by Popularity</option>
                  <option value="name">Sort by Name</option>
                  <option value="status">Sort by Status</option>
                </select>
                
                <button
                  onClick={exportResults}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Export Results"
                >
                  <FiDownload />
                </button>
                
                <button
                  onClick={shareResults}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Share Results"
                >
                  <FiShare2 />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="max-w-7xl mx-auto px-4 pb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Testing servers...</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {/* History View */}
        {viewMode === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Test History</h2>
            {testHistory.length === 0 ? (
              <div className={`rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <FiBarChart2 className={`mx-auto text-4xl mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>No test history</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Run some tests to see your history here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testHistory.map((test) => (
                  <div 
                    key={test.id} 
                    className={`rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Test #{test.id.toString().slice(-6)}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Date:</span>
                        <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                          {new Date(test.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Servers:</span>
                        <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                          {test.serversTested}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-500">Online:</span>
                        <span className="text-green-500 font-semibold">
                          {test.onlineCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-500">Offline:</span>
                        <span className="text-red-500 font-semibold">
                          {test.offlineCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Duration:</span>
                        <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                          {test.duration.toFixed(1)}s
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Server List by Category or Favorites */}
        {viewMode !== 'history' && (
          <>
            {Object.entries(filteredCategorizedServers).map(([category, servers]) => (
              <motion.div
                key={category}
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div 
                  className={`flex justify-between items-center rounded-t-xl shadow-md p-4 cursor-pointer border-t-4 border-blue-500 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                  onClick={() => toggleCategoryExpansion(category)}
                >
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {category} ({servers.length})
                  </h2>
                  <div className="flex items-center gap-2">
                    <motion.div 
                      animate={{ rotate: expandedCategories[category] ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedCategories[category] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        <AnimatePresence>
                          {servers.map((server, index) => (
                            <motion.div
                              key={server.name}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.05 }}
                              className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border ${
                                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                              }`}
                            >
                              <div 
                                className={`p-5 border-b ${
                                  darkMode ? 'border-gray-700' : 'border-gray-100'
                                } cursor-pointer flex justify-between items-center`}
                                onClick={() => toggleServerExpansion(server.name)}
                              >
                                <h2 className={`text-lg font-bold truncate flex items-center gap-2 ${
                                  darkMode ? 'text-white' : 'text-gray-800'
                                }`}>
                                  <FiServer className="text-blue-500" />
                                  {server.name}
                                  {favorites.includes(server.name) && (
                                    <FiStar className="text-yellow-400 text-sm" />
                                  )}
                                </h2>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavorite(server.name);
                                    }}
                                    className={`p-1 rounded ${
                                      favorites.includes(server.name) 
                                        ? 'text-yellow-400' 
                                        : darkMode 
                                          ? 'text-gray-500 hover:text-yellow-400' 
                                          : 'text-gray-400 hover:text-yellow-500'
                                    }`}
                                    title={favorites.includes(server.name) ? "Remove from favorites" : "Add to favorites"}
                                  >
                                    <FiStar />
                                  </button>
                                  <motion.div 
                                    animate={{ rotate: expandedServers[server.name] ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </motion.div>
                                </div>
                              </div>
                              
                              <AnimatePresence>
                                {expandedServers[server.name] && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-5">
                                      <ul className="space-y-3">
                                        {server.urls.map((url, urlIndex) => {
                                          const status = serverStatus[`${server.name}-${urlIndex}`] || 'Unknown';
                                          return (
                                            <motion.li 
                                              key={urlIndex}
                                              initial={{ opacity: 0, x: -10 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{ delay: urlIndex * 0.05 }}
                                              className={`flex justify-between items-center p-3 rounded-lg border hover:bg-opacity-50 transition-colors cursor-pointer ${
                                                darkMode 
                                                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                              }`}
                                              onClick={() => openUrlInNewTab(url)}
                                            >
                                              <span className={`text-sm truncate mr-2 flex items-center gap-2 ${
                                                darkMode ? 'text-gray-300' : 'text-gray-600'
                                              }`}>
                                                <FiWifi className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                                                <span className="truncate">{url}</span>
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <FiExternalLink className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                                                <span
                                                  className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 whitespace-nowrap ${
                                                    getStatusColor(status)
                                                  }`}
                                                >
                                                  {getStatusIcon(status)}
                                                  <span>{status}</span>
                                                </span>
                                              </div>
                                            </motion.li>
                                          );
                                        })}
                                      </ul>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              {!expandedServers[server.name] && (
                                <div className="p-5 pt-0">
                                  <div className="flex gap-2 flex-wrap">
                                    {server.urls.slice(0, 3).map((url, urlIndex) => {
                                      const status = serverStatus[`${server.name}-${urlIndex}`] || 'Unknown';
                                      return (
                                        <span
                                          key={urlIndex}
                                          className={`px-2 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 ${
                                            getStatusColor(status)
                                          } cursor-pointer hover:opacity-80 transition-opacity`}
                                          onClick={() => openUrlInNewTab(url)}
                                        >
                                          <FiExternalLink className="text-gray-500" />
                                          {getStatusIcon(status)}
                                          <span className="truncate max-w-[100px]">{url.replace('http://', '').replace('https://', '')}</span>
                                        </span>
                                      );
                                    })}
                                    {server.urls.length > 3 && (
                                      <span 
                                        className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                                          darkMode 
                                            ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                                        }`}
                                        onClick={() => toggleServerExpansion(server.name)}
                                      >
                                        +{server.urls.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            
            {Object.keys(filteredCategorizedServers).length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`rounded-2xl shadow-lg p-8 max-w-md mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <FiSearch className={`mx-auto text-4xl mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {viewMode === 'favorites' ? 'No favorite servers' : 'No servers found'}
                  </h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {viewMode === 'favorites' 
                      ? 'Add some servers to your favorites to see them here' 
                      : 'Try adjusting your search or filter criteria'}
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-800'} text-white py-8`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                BDIX Connectivity Tester &copy; {new Date().getFullYear()} - Test your BDIX server connectivity
              </p>
              <p className="text-gray-500 text-sm mt-2">
                This tool helps you check the connectivity status of BDIX servers in Bangladesh
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <p className="text-gray-400 text-sm">Developed by Zahid Hasan Tonmoy</p>
              <div className="flex gap-4 mt-2">
                <a 
                  href="https://www.facebook.com/zahidhasantonmoybd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <FiFacebook className="text-xl" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/zahidhasantonmoy/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin className="text-xl" />
                </a>
                <a 
                  href="https://github.com/zahidhasantonmoy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <FiGithub className="text-xl" />
                </a>
                <a 
                  href="https://zahidhasantonmoy.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Portfolio"
                >
                  <FiGlobe className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ErrorHandling darkMode={darkMode} />
    </div>
  );
}