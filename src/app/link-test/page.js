"use client";

import { useState, useEffect } from 'react';

export default function LinkStyleTest() {
  const [servers] = useState([
    { id: 1, name: "SAMONLINE FTP SERVER", ip: "172.16.50.4", port: 80 },
    { id: 2, name: "DISCOVERY FTP SERVER", ip: "discoveryftp.net", port: 80 },
    { id: 3, name: "WOW MOVIE ZONE FTP SERVER", ip: "172.27.27.84", port: 80 },
    { id: 4, name: "ICC COMMUNICATION FTP SERVER", ip: "10.16.100.244", port: 80 },
    { id: 5, name: "BUSINESS NETWORK FTP SERVER", ip: "103.58.73.9", port: 80 },
    { id: 6, name: "NATURALBD FTP SERVER", ip: "www.naturalbd.com", port: 80 },
    { id: 7, name: "DHAKAMOVIE FTP SERVER", ip: "dhakamovie.com", port: 80 },
    { id: 8, name: "UNIQUE NET FTP SERVER", ip: "103.91.144.230", port: 80 }
  ]);

  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Function to test a single server
  const testServer = (server) => {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        resolve({ id: server.id, status: 'timeout' });
      }, 3000);

      img.onload = function() {
        clearTimeout(timeout);
        resolve({ id: server.id, status: 'online' });
      };

      img.onerror = function() {
        clearTimeout(timeout);
        resolve({ id: server.id, status: 'offline' });
      };

      // Try to load favicon or a simple resource
      img.src = `http://${server.ip}/favicon.ico?t=${new Date().getTime()}`;
    });
  };

  // Function to test all servers
  const testAllServers = async () => {
    setIsTesting(true);
    setProgress(0);
    setTestResults({});

    // Test servers one by one
    for (let i = 0; i < servers.length; i++) {
      const server = servers[i];
      const result = await testServer(server);
      
      setTestResults(prev => ({
        ...prev,
        [server.id]: result.status
      }));
      
      setProgress(Math.round(((i + 1) / servers.length) * 100));
    }

    setIsTesting(false);
  };

  // Function to test a single server
  const testSingleServer = async (server) => {
    const result = await testServer(server);
    setTestResults(prev => ({
      ...prev,
      [server.id]: result.status
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'green';
      case 'offline': return 'red';
      case 'timeout': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'timeout': return 'Timeout';
      default: return 'Not Tested';
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>BDIX Server Test (Link-Style)</h1>
        <p>Test BDIX server connectivity similar to bdix.link</p>
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
            cursor: isTesting ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {isTesting ? 'Testing...' : 'Test All Servers'}
        </button>
        
        {isTesting && (
          <div style={{ marginTop: '15px' }}>
            <div style={{ 
              width: '100%', 
              backgroundColor: '#e9ecef', 
              borderRadius: '4px',
              height: '20px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${progress}%`, 
                backgroundColor: '#007bff', 
                height: '100%',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <p style={{ marginTop: '5px', fontSize: '14px' }}>{progress}% Complete</p>
          </div>
        )}
      </div>

      {/* Server List */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '15px' 
      }}>
        {servers.map(server => (
          <div 
            key={server.id}
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
                backgroundColor: getStatusColor(testResults[server.id]) === 'green' ? '#d4edda' : 
                               getStatusColor(testResults[server.id]) === 'red' ? '#f8d7da' : 
                               getStatusColor(testResults[server.id]) === 'orange' ? '#fff3cd' : '#e2e3e5',
                color: getStatusColor(testResults[server.id]) === 'green' ? '#155724' : 
                      getStatusColor(testResults[server.id]) === 'red' ? '#721c24' : 
                      getStatusColor(testResults[server.id]) === 'orange' ? '#856404' : '#6c757d'
              }}>
                {getStatusText(testResults[server.id])}
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

      {/* Instructions */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '8px'
      }}>
        <h3>How This Works:</h3>
        <ul>
          <li>This tool tests BDIX server connectivity from your browser</li>
          <li>Green = Server is accessible (you can likely access content)</li>
          <li>Red = Server is not accessible (blocked or not on BDIX)</li>
          <li>Orange = Test timed out (slow connection or server issue)</li>
        </ul>
        <p><strong>Note:</strong> Results depend on your current network connection and ISP.</p>
      </div>
    </div>
  );
}