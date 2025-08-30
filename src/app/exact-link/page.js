"use client";

import { useState } from 'react';

export default function ExactLinkTest() {
  const [testResults, setTestResults] = useState([]);
  const [currentTest, setCurrentTest] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // BDIX servers list (similar to bdix.link)
  const servers = [
    "172.16.50.4",           // SAMONLINE
    "discoveryftp.net",      // DISCOVERY FTP
    "172.27.27.84",          // WOW MOVIE ZONE
    "10.16.100.244",         // ICC COMMUNICATION
    "103.58.73.9",           // BUSINESS NETWORK
    "www.naturalbd.com",     // NATURALBD
    "dhakamovie.com",        // DHAKAMOVIE
    "103.91.144.230",        // UNIQUE NET
    "ctgmovies.com",         // CTGMOVIES
    "ftpbd.net"              // B.NET
  ];

  // Test server using XMLHttpRequest (similar to bdix.link approach)
  const testServer = (server) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      let completed = false;
      
      // Timeout handler
      const timeout = setTimeout(() => {
        if (!completed) {
          completed = true;
          xhr.abort();
          resolve({ server, status: 'inaccessible', time: 3000 });
        }
      }, 3000);
      
      // Success handler
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && !completed) {
          completed = true;
          clearTimeout(timeout);
          
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          
          // For BDIX, any response means accessible
          if (xhr.status > 0) {
            resolve({ server, status: 'accessible', time: responseTime });
          } else {
            resolve({ server, status: 'inaccessible', time: responseTime });
          }
        }
      };
      
      // Error handler
      xhr.onerror = function() {
        if (!completed) {
          completed = true;
          clearTimeout(timeout);
          const endTime = Date.now();
          resolve({ server, status: 'inaccessible', time: endTime - startTime });
        }
      };
      
      const startTime = Date.now();
      try {
        xhr.open('GET', `http://${server}`, true);
        xhr.timeout = 3000;
        xhr.send();
      } catch (e) {
        if (!completed) {
          completed = true;
          clearTimeout(timeout);
          resolve({ server, status: 'error', time: 0 });
        }
      }
    });
  };

  // Run all tests
  const runAllTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    for (const server of servers) {
      setCurrentTest(server);
      
      const result = await testServer(server);
      setTestResults(prev => [...prev, result]);
    }
    
    setIsTesting(false);
    setCurrentTest('');
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'accessible': return '#28a745';
      case 'inaccessible': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'accessible': return 'Accessible';
      case 'inaccessible': return 'Not Accessible';
      default: return 'Not Tested';
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>BDIX Test - Exact Link Style</h1>
        <p>Testing BDIX servers similar to bdix.link approach</p>
      </div>

      {/* Test Button */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={runAllTests}
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
          {isTesting ? 'Testing Servers...' : 'Test All BDIX Servers'}
        </button>
        
        {isTesting && (
          <div style={{ marginTop: '15px' }}>
            <p>Testing: {currentTest}</p>
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Test Results:</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '15px' 
        }}>
          {testResults.map((result, index) => (
            <div 
              key={index}
              style={{ 
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '15px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis' 
                }}>
                  {result.server}
                </h3>
                <span style={{ 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  backgroundColor: `${getStatusColor(result.status)}20`,
                  color: getStatusColor(result.status),
                  border: `1px solid ${getStatusColor(result.status)}`
                }}>
                  {getStatusText(result.status)}
                </span>
              </div>
              {result.time && (
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                  Response: {result.time}ms
                </p>
              )}
            </div>
          ))}
          
          {/* Show untested servers */}
          {servers.filter(s => !testResults.some(r => r.server === s)).map((server, index) => (
            <div 
              key={`untouched-${index}`}
              style={{ 
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '15px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis' 
                }}>
                  {server}
                </h3>
                <span style={{ 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  backgroundColor: '#6c757d20',
                  color: '#6c757d',
                  border: '1px solid #6c757d'
                }}>
                  Not Tested
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <h3>How BDIX Testing Works:</h3>
        <ul>
          <li><strong>Accessible:</strong> Server is accessible from your network</li>
          <li><strong>Not Accessible:</strong> Server is blocked or unreachable</li>
        </ul>
        <p><strong>Important:</strong> These results show if you can connect to BDIX servers from your current network.</p>
      </div>
    </div>
  );
}