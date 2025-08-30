"use client";

import { useState, useCallback } from 'react';

export default function ProperBDIXTest() {
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);
  const [selectedServers, setSelectedServers] = useState([]);

  // BDIX servers with known accessible paths
  const bdixServers = [
    { name: 'SAMONLINE', ip: '172.16.50.4', paths: ['/'] },
    { name: 'DISCOVERY FTP', ip: 'discoveryftp.net', paths: ['/'] },
    { name: 'WOW MOVIE ZONE', ip: '172.27.27.84', paths: ['/'] },
    { name: 'ICC COMMUNICATION', ip: '10.16.100.244', paths: ['/'] },
    { name: 'BUSINESS NET', ip: '103.58.73.9', paths: ['/'] }
  ];

  const testServerConnectivity = useCallback(async (server) => {
    return new Promise((resolve) => {
      // For BDIX testing, we need to be very specific
      const testUrls = server.paths.map(path => 
        `http://${server.ip}${path}`
      );

      // Test each URL
      let testIndex = 0;
      
      const testNextUrl = () => {
        if (testIndex >= testUrls.length) {
          resolve({ 
            server: server.name, 
            ip: server.ip, 
            status: 'inaccessible', 
            message: 'No accessible paths found' 
          });
          return;
        }

        const url = testUrls[testIndex];
        testIndex++;

        // Create a new XMLHttpRequest
        const xhr = new XMLHttpRequest();
        let completed = false;

        // Set up timeout
        const timeout = setTimeout(() => {
          if (!completed) {
            completed = true;
            xhr.abort();
            testNextUrl();
          }
        }, 2000);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && !completed) {
            completed = true;
            clearTimeout(timeout);
            
            // For BDIX, ANY response means accessible
            if (xhr.status > 0) {
              resolve({ 
                server: server.name, 
                ip: server.ip, 
                status: 'accessible', 
                message: `Accessible via ${url}`,
                responseTime: Date.now() - startTime
              });
            } else {
              testNextUrl();
            }
          }
        };

        xhr.onerror = function() {
          if (!completed) {
            completed = true;
            clearTimeout(timeout);
            testNextUrl();
          }
        };

        const startTime = Date.now();
        try {
          xhr.open('GET', url, true);
          xhr.timeout = 2000;
          xhr.send();
        } catch (e) {
          if (!completed) {
            completed = true;
            clearTimeout(timeout);
            testNextUrl();
          }
        }
      };

      testNextUrl();
    });
  }, []);

  const runTests = async () => {
    if (selectedServers.length === 0) {
      alert('Please select at least one server to test');
      return;
    }

    setIsTesting(true);
    setTestResults([]);

    try {
      // Test selected servers
      const serversToTest = bdixServers.filter(server => 
        selectedServers.includes(server.name)
      );

      const results = [];
      for (const server of serversToTest) {
        const result = await testServerConnectivity(server);
        results.push(result);
      }

      setTestResults(results);
    } catch (error) {
      console.error('Testing error:', error);
      setTestResults([{
        server: 'Error',
        status: 'error',
        message: 'Failed to run tests'
      }]);
    } finally {
      setIsTesting(false);
    }
  };

  const toggleServerSelection = (serverName) => {
    setSelectedServers(prev => {
      if (prev.includes(serverName)) {
        return prev.filter(name => name !== serverName);
      } else {
        return [...prev, serverName];
      }
    });
  };

  const selectAllServers = () => {
    setSelectedServers(bdixServers.map(server => server.name));
  };

  const clearSelection = () => {
    setSelectedServers([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Proper BDIX Connectivity Tester</h1>
      <p>This tool tests actual BDIX server connectivity from your network.</p>

      {/* Server Selection */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Select Servers to Test:</h3>
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={selectAllServers}
            style={{ marginRight: '10px', padding: '5px 10px' }}
          >
            Select All
          </button>
          <button 
            onClick={clearSelection}
            style={{ padding: '5px 10px' }}
          >
            Clear Selection
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {bdixServers.map(server => (
            <div 
              key={server.name}
              onClick={() => toggleServerSelection(server.name)}
              style={{ 
                padding: '10px',
                border: selectedServers.includes(server.name) 
                  ? '2px solid #0070f3' 
                  : '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: selectedServers.includes(server.name) 
                  ? '#e3f2fd' 
                  : 'white'
              }}
            >
              <strong>{server.name}</strong><br/>
              <small>{server.ip}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Test Button */}
      <button 
        onClick={runTests} 
        disabled={isTesting || selectedServers.length === 0}
        style={{ 
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isTesting || selectedServers.length === 0 ? 'not-allowed' : 'pointer',
          opacity: isTesting || selectedServers.length === 0 ? 0.6 : 1
        }}
      >
        {isTesting ? 'Testing Servers...' : `Test ${selectedServers.length} Server(s)`}
      </button>

      {/* Results */}
      {testResults.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2>Test Results:</h2>
          {testResults.map((result, index) => (
            <div 
              key={index}
              style={{ 
                padding: '15px',
                margin: '10px 0',
                borderRadius: '4px',
                border: '1px solid #ddd',
                backgroundColor: result.status === 'accessible' 
                  ? '#d4edda' 
                  : result.status === 'inaccessible' 
                    ? '#f8d7da' 
                    : '#fff3cd'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{result.server}</h3>
              <p style={{ margin: '5px 0' }}><strong>IP:</strong> {result.ip}</p>
              <p style={{ margin: '5px 0' }}>
                <strong>Status:</strong> 
                <span style={{ 
                  color: result.status === 'accessible' 
                    ? 'green' 
                    : result.status === 'inaccessible' 
                      ? 'red' 
                      : 'orange',
                  marginLeft: '5px'
                }}>
                  {result.status.toUpperCase()}
                </span>
              </p>
              <p style={{ margin: '5px 0' }}><strong>Message:</strong> {result.message}</p>
              {result.responseTime && (
                <p style={{ margin: '5px 0' }}><strong>Response Time:</strong> {result.responseTime}ms</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <h3>How BDIX Testing Works:</h3>
        <ul>
          <li>This tool tests connectivity to BDIX servers from your current network</li>
          <li>If you&apos;re on a BDIX-enabled ISP, you should see &quot;ACCESSIBLE&quot; results</li>
          <li>If you&apos;re not on BDIX, servers will show as &quot;INACCESSIBLE&quot;</li>
          <li>Tests are performed directly from your browser using your network connection</li>
        </ul>
        <p><strong>Note:</strong> Results depend on your current network connection and ISP.</p>
      </div>
    </div>
  );
}