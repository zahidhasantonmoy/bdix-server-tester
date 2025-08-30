"use client";

import { useState } from 'react';

export default function BDIXConnectivityTest() {
  const [testUrl, setTestUrl] = useState('');
  const [results, setResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);

  // Common paths to test on BDIX servers
  const testPaths = [
    '',                    // Root path
    '/favicon.ico',        // Favicon
    '/index.html',         // Index file
    '/index.php',          // PHP index
    '/robots.txt'          // Robots file
  ];

  const normalizeUrl = (url) => {
    let normalized = url.trim();
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = `http://${normalized}`;
    }
    // Remove trailing slash
    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  };

  const testSinglePath = async (baseUrl, path) => {
    const fullUrl = path ? `${baseUrl}${path}` : baseUrl;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(fullUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
        redirect: 'follow'
      });
      
      clearTimeout(timeoutId);
      return { path, status: 'success', url: fullUrl };
    } catch (error) {
      return { path, status: 'failed', url: fullUrl, error: error.message };
    }
  };

  const testServer = async () => {
    if (!testUrl) {
      alert('Please enter a URL');
      return;
    }

    const normalizedUrl = normalizeUrl(testUrl);
    setIsTesting(true);
    setResults([]);

    try {
      const testPromises = testPaths.map(path => testSinglePath(normalizedUrl, path));
      const testResults = await Promise.all(testPromises);
      
      // Check if any test was successful
      const hasSuccess = testResults.some(result => result.status === 'success');
      
      setResults([
        {
          server: normalizedUrl,
          overall: hasSuccess ? 'ACCESSIBLE' : 'NOT ACCESSIBLE',
          details: testResults
        }
      ]);
    } catch (error) {
      setResults([{
        server: normalizedUrl,
        overall: 'ERROR',
        error: error.message
      }]);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>BDIX Server Connectivity Test</h1>
      <p>Test if BDIX servers are accessible from your network.</p>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          placeholder="Enter server URL (e.g., http://172.16.50.4)"
          style={{ 
            padding: '10px', 
            flex: 1,
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={testServer} 
          disabled={isTesting}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isTesting ? 'not-allowed' : 'pointer'
          }}
        >
          {isTesting ? 'Testing...' : 'Test Server'}
        </button>
      </div>
      
      {results.length > 0 && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <h3>Test Results:</h3>
          {results.map((result, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <div style={{ 
                padding: '10px',
                backgroundColor: result.overall === 'ACCESSIBLE' ? '#d4edda' : 
                               result.overall === 'NOT ACCESSIBLE' ? '#f8d7da' : '#fff3cd',
                border: `1px solid ${
                  result.overall === 'ACCESSIBLE' ? '#c3e6cb' : 
                  result.overall === 'NOT ACCESSIBLE' ? '#f5c6cb' : '#ffeaa7'
                }`,
                borderRadius: '4px'
              }}>
                <strong>Server:</strong> {result.server}<br/>
                <strong>Status:</strong> {result.overall}
              </div>
              
              {result.details && (
                <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
                  <h4>Detailed Path Tests:</h4>
                  {result.details.map((detail, detailIndex) => (
                    <div 
                      key={detailIndex} 
                      style={{ 
                        padding: '5px',
                        backgroundColor: detail.status === 'success' ? '#e8f5e9' : '#ffebee',
                        marginBottom: '5px',
                        borderRadius: '3px'
                      }}
                    >
                      <strong>Path:</strong> {detail.path || '/'} → 
                      <strong style={{ 
                        color: detail.status === 'success' ? 'green' : 'red',
                        marginLeft: '5px'
                      }}>
                        {detail.status === 'success' ? 'SUCCESS' : 'FAILED'}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Enter a BDIX server URL in the format shown below</li>
          <li>Click "Test Server" to check connectivity</li>
          <li>"ACCESSIBLE" means you can reach the server</li>
          <li>"NOT ACCESSIBLE" means the server is blocked or unreachable</li>
        </ol>
        
        <h3>Sample BDIX Servers:</h3>
        <ul>
          <li><strong>SAMONLINE:</strong> http://172.16.50.4</li>
          <li><strong>DISCOVERY FTP:</strong> http://discoveryftp.net</li>
          <li><strong>ICC COMMUNICATION:</strong> http://10.16.100.244</li>
          <li><strong>WOW MOVIE ZONE:</strong> http://172.27.27.84</li>
        </ul>
        <p><strong>Important:</strong> These tests only work correctly when you're on a BDIX-enabled network.</p>
      </div>
    </div>
  );
}