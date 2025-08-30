"use client";

import { useState } from 'react';

export default function CategorizedBDIXTest() {
  // Categorized BDIX servers
  const categorizedServers = {
    "FTP Servers": [
      { name: "SAMONLINE FTP", ip: "172.16.50.4" },
      { name: "DISCOVERY FTP", ip: "discoveryftp.net" },
      { name: "WOW MOVIE ZONE FTP", ip: "172.27.27.84" },
      { name: "BUSINESS NETWORK FTP", ip: "103.58.73.9" },
      { name: "ICC COMMUNICATION FTP", ip: "10.16.100.244" }
    ],
    "Media Servers": [
      { name: "NATURALBD", ip: "www.naturalbd.com" },
      { name: "DHAKAMOVIE", ip: "dhakamovie.com" },
      { name: "CTGMOVIES", ip: "ctgmovies.com" },
      { name: "MOVIEHAAT", ip: "moviehaat.net" },
      { name: "BOSSBD", ip: "www.bossbd.net" }
    ],
    "Software Repositories": [
      { name: "ALPHAMEDIAZONE", ip: "www.alphabroadway.com" },
      { name: "BDPLEX", ip: "bdplex.net" },
      { name: "FREEDOWNLOADBD", ip: "www.freedownloadbd.com" }
    ],
    "ISP Specific": [
      { name: "LINK3 INTERNET", ip: "www.cinehub24.com" },
      { name: "DHAKA FIBER NET", ip: "media.dfnbd.net" },
      { name: "GPISP", ip: "gpisp.net" }
    ],
    "Miscellaneous": [
      { name: "UNIQUE NET", ip: "103.91.144.230" },
      { name: "CITY CLOUD BD", ip: "103.102.253.250" },
      { name: "TIMEPASSBD", ip: "www.timepassbd.live" }
    ]
  };

  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

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

  // Test all servers in a category
  const testCategory = async (category) => {
    const servers = categorizedServers[category];
    for (const server of servers) {
      const result = await testServer(server);
      setTestResults(prev => ({
        ...prev,
        [`${category}-${server.name}`]: result.status
      }));
    }
  };

  // Test all servers
  const testAllServers = async () => {
    setIsTesting(true);
    setTestResults({});
    
    for (const category in categorizedServers) {
      await testCategory(category);
    }
    
    setIsTesting(false);
  };

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Categorized BDIX Server Test</h1>
        <p>Test BDIX servers organized by category</p>
      </header>

      {/* Test Controls */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <button 
          onClick={testAllServers}
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
          {isTesting ? 'Testing All Servers...' : 'Test All Servers'}
        </button>
      </div>

      {/* Categorized Server List */}
      <div style={{ marginBottom: '30px' }}>
        {Object.entries(categorizedServers).map(([category, servers]) => (
          <div key={category} style={{ marginBottom: '20px' }}>
            <div 
              onClick={() => toggleCategory(category)}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '15px',
                backgroundColor: '#e9ecef',
                borderRadius: '4px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <h2 style={{ margin: 0, fontSize: '20px' }}>{category}</h2>
              <span style={{ fontSize: '20px' }}>
                {expandedCategories[category] ? '▼' : '▶'}
              </span>
            </div>
            
            {expandedCategories[category] && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '15px',
                marginTop: '15px',
                padding: '15px',
                border: '1px solid #dee2e6',
                borderRadius: '4px'
              }}>
                {servers.map((server, index) => (
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
                      </div>
                      <span style={{ 
                        padding: '3px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        backgroundColor: testResults[`${category}-${server.name}`] === 'online' ? '#d4edda' : '#f8d7da',
                        color: testResults[`${category}-${server.name}`] === 'online' ? '#155724' : '#721c24'
                      }}>
                        {testResults[`${category}-${server.name}`] 
                          ? getStatusText(testResults[`${category}-${server.name}`])
                          : 'Not Tested'
                        }
                      </span>
                    </div>
                    
                    <button
                      onClick={() => testServer(server).then(result => {
                        setTestResults(prev => ({
                          ...prev,
                          [`${category}-${server.name}`]: result.status
                        }));
                      })}
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
            )}
          </div>
        ))}
      </div>

      {/* Category Summary */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '8px'
      }}>
        <h3>Category Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {Object.entries(categorizedServers).map(([category, servers]) => {
            const onlineCount = servers.filter(server => 
              testResults[`${category}-${server.name}`] === 'online'
            ).length;
            const testedCount = servers.filter(server => 
              testResults[`${category}-${server.name}`] !== undefined
            ).length;
            
            return (
              <div 
                key={`summary-${category}`}
                style={{ 
                  padding: '10px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{category}</h4>
                <p style={{ margin: '0', fontSize: '12px' }}>
                  {onlineCount}/{servers.length} Online
                  {testedCount > 0 && testedCount < servers.length && ` (${testedCount} tested)`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}