"use client";

import { useState, useMemo } from 'react';

export default function FilterableBDIXTest() {
  // Complete BDIX server list with categories
  const allServers = [
    { name: "SAMONLINE FTP", ip: "172.16.50.4", category: "FTP Servers" },
    { name: "DISCOVERY FTP", ip: "discoveryftp.net", category: "FTP Servers" },
    { name: "WOW MOVIE ZONE FTP", ip: "172.27.27.84", category: "FTP Servers" },
    { name: "BUSINESS NETWORK FTP", ip: "103.58.73.9", category: "FTP Servers" },
    { name: "ICC COMMUNICATION FTP", ip: "10.16.100.244", category: "FTP Servers" },
    { name: "NATURALBD", ip: "www.naturalbd.com", category: "Media Servers" },
    { name: "DHAKAMOVIE", ip: "dhakamovie.com", category: "Media Servers" },
    { name: "CTGMOVIES", ip: "ctgmovies.com", category: "Media Servers" },
    { name: "MOVIEHAAT", ip: "moviehaat.net", category: "Media Servers" },
    { name: "BOSSBD", ip: "www.bossbd.net", category: "Media Servers" },
    { name: "ALPHAMEDIAZONE", ip: "www.alphabroadway.com", category: "Software Repositories" },
    { name: "BDPLEX", ip: "bdplex.net", category: "Software Repositories" },
    { name: "FREEDOWNLOADBD", ip: "www.freedownloadbd.com", category: "Software Repositories" },
    { name: "LINK3 INTERNET", ip: "www.cinehub24.com", category: "ISP Specific" },
    { name: "DHAKA FIBER NET", ip: "media.dfnbd.net", category: "ISP Specific" },
    { name: "GPISP", ip: "gpisp.net", category: "ISP Specific" },
    { name: "UNIQUE NET", ip: "103.91.144.230", category: "Miscellaneous" },
    { name: "CITY CLOUD BD", ip: "103.102.253.250", category: "Miscellaneous" },
    { name: "TIMEPASSBD", ip: "www.timepassbd.live", category: "Miscellaneous" },
    { name: "EBOX", ip: "fs.ebox.live", category: "FTP Servers" },
    { name: "POLLyFLIX", ip: "pollyflix.com", category: "Media Servers" },
    { name: "CIRCLE NET", ip: "15.1.1.1", category: "FTP Servers" },
    { name: "MAZEDA NETWORK", ip: "172.22.22.101", category: "FTP Servers" },
    { name: "IHUB", ip: "ihub.live", category: "Media Servers" }
  ];

  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('name');

  // Get unique categories
  const categories = ['All', ...new Set(allServers.map(server => server.category))];

  // Filter and sort servers
  const filteredAndSortedServers = useMemo(() => {
    let filtered = allServers;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(server => 
        server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.ip.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(server => server.category === selectedCategory);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'ip':
        filtered.sort((a, b) => a.ip.localeCompare(b.ip));
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'status':
        filtered.sort((a, b) => {
          const statusA = testResults[`${a.category}-${a.name}`] || 'unknown';
          const statusB = testResults[`${b.category}-${b.name}`] || 'unknown';
          return statusB.localeCompare(statusA); // Online first
        });
        break;
    }
    
    return filtered;
  }, [searchTerm, selectedCategory, sortOption, testResults]);

  // Test server using the working image approach
  const testServer = (server) => {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        resolve({ status: 'offline' });
      }, 3000);

      img.onload = function() {
        clearTimeout(timeout);
        resolve({ status: 'online' });
      };

      img.onerror = function() {
        clearTimeout(timeout);
        resolve({ status: 'online' });
      };

      img.src = `http://${server.ip}/favicon.ico?t=${Date.now()}`;
    });
  };

  // Test all visible servers
  const testVisibleServers = async () => {
    setIsTesting(true);
    
    for (const server of filteredAndSortedServers) {
      const result = await testServer(server);
      setTestResults(prev => ({
        ...prev,
        [`${server.category}-${server.name}`]: result.status
      }));
    }
    
    setIsTesting(false);
  };

  // Test single server
  const testSingleServer = async (server) => {
    const result = await testServer(server);
    setTestResults(prev => ({
      ...prev,
      [`${server.category}-${server.name}`]: result.status
    }));
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === 'online' ? 'green' : 'red';
  };

  // Get status text
  const getStatusText = (status) => {
    return status === 'online' ? 'Online' : 'Offline';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Filterable BDIX Server Test</h1>
        <p>Test BDIX servers with filtering and sorting capabilities</p>
      </header>

      {/* Controls */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
          {/* Search */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }}
            />
          </div>
          
          {/* Category Filter */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Sort */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }}
            >
              <option value="name">Sort by Name</option>
              <option value="ip">Sort by IP</option>
              <option value="category">Sort by Category</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
        
        {/* Test Button */}
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={testVisibleServers}
            disabled={isTesting}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: isTesting ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isTesting ? 'not-allowed' : 'pointer'
            }}
          >
            {isTesting ? 'Testing Servers...' : `Test ${filteredAndSortedServers.length} Visible Servers`}
          </button>
        </div>
      </div>

      {/* Server List */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {filteredAndSortedServers.map((server, index) => (
          <div 
            key={index}
            style={{ 
              border: '1px solid #dee2e6', 
              borderRadius: '8px', 
              padding: '15px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '10px'
            }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{server.name}</h3>
                <p style={{ margin: '0', color: '#6c757d', fontSize: '14px' }}>{server.ip}</p>
                <span style={{ 
                  fontSize: '12px',
                  backgroundColor: '#e9ecef',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginTop: '5px',
                  display: 'inline-block'
                }}>
                  {server.category}
                </span>
              </div>
              <span style={{ 
                padding: '3px 8px', 
                borderRadius: '12px', 
                fontSize: '12px',
                backgroundColor: testResults[`${server.category}-${server.name}`] === 'online' ? '#d4edda' : '#f8d7da',
                color: testResults[`${server.category}-${server.name}`] === 'online' ? '#155724' : '#721c24'
              }}>
                {testResults[`${server.category}-${server.name}`] 
                  ? getStatusText(testResults[`${server.category}-${server.name}`])
                  : 'Not Tested'
                }
              </span>
            </div>
            
            <button
              onClick={() => testSingleServer(server)}
              disabled={isTesting}
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isTesting ? 'not-allowed' : 'pointer'
              }}
            >
              Test
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '8px'
      }}>
        <h3>Test Summary</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <strong>Total Servers:</strong> {allServers.length}
          </div>
          <div>
            <strong>Visible Servers:</strong> {filteredAndSortedServers.length}
          </div>
          <div>
            <strong>Online:</strong> {
              Object.values(testResults).filter(status => status === 'online').length
            }
          </div>
          <div>
            <strong>Offline:</strong> {
              Object.values(testResults).filter(status => status === 'offline').length
            }
          </div>
          <div>
            <strong>Not Tested:</strong> {
              filteredAndSortedServers.length - 
              filteredAndSortedServers.filter(server => 
                testResults[`${server.category}-${server.name}`] !== undefined
              ).length
            }
          </div>
        </div>
      </div>
    </div>
  );
}