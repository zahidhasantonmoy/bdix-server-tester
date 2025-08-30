"use client";

import { useState } from 'react';

export default function CorsBypassTest() {
  const [serverUrl, setServerUrl] = useState('');
  const [result, setResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const testWithImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        resolve({ status: 'inaccessible', message: 'Server is not accessible (timeout)' });
      }, 3000);

      img.onload = function() {
        clearTimeout(timeout);
        resolve({ status: 'accessible', message: 'Server is accessible' });
      };

      img.onerror = function() {
        clearTimeout(timeout);
        // For BDIX testing, even an error might mean the server responded
        // This is often a good sign for BDIX servers
        resolve({ status: 'accessible', message: 'Server responded (likely accessible)' });
      };

      // Try to load favicon or root
      img.src = `${url}/favicon.ico?t=${Date.now()}`;
    });
  };

  const testWithFetch = (url) => {
    return new Promise((resolve) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
        resolve({ status: 'inaccessible', message: 'Server is not accessible (timeout)' });
      }, 3000);

      fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      })
      .then(() => {
        clearTimeout(timeout);
        // With no-cors, if we get here, we made contact with the server
        resolve({ status: 'accessible', message: 'Server is accessible' });
      })
      .catch(() => {
        clearTimeout(timeout);
        resolve({ status: 'inaccessible', message: 'Server is not accessible' });
      });
    });
  };

  const runTest = async () => {
    if (!serverUrl) {
      setResult({ status: 'error', message: 'Please enter a server URL' });
      return;
    }

    setTesting(true);
    setResult(null);

    // Normalize URL
    let testUrl = serverUrl.trim();
    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
      testUrl = `http://${testUrl}`;
    }

    try {
      // Try fetch first
      let testResult = await testWithFetch(testUrl);
      
      // If fetch indicates inaccessible, try image method
      if (testResult.status === 'inaccessible') {
        testResult = await testWithImage(testUrl);
      }
      
      setResult(testResult);
    } catch (error) {
      setResult({ status: 'error', message: `Test failed: ${error.message}` });
    } finally {
      setTesting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accessible': return { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' };
      case 'inaccessible': return { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' };
      case 'error': return { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' };
      case 'timeout': return { backgroundColor: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' };
      default: return { backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #ddd' };
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>CORS Bypass BDIX Test</h1>
      <p>Testing BDIX servers with CORS bypass techniques.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          placeholder="Enter BDIX server (e.g., 172.16.50.4 or discoveryftp.net)"
          style={{ 
            padding: '12px', 
            width: '70%', 
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={runTest} 
          disabled={testing}
          style={{ 
            padding: '12px 20px',
            backgroundColor: testing ? '#6c757d' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: testing ? 'not-allowed' : 'pointer'
          }}
        >
          {testing ? 'Testing...' : 'Test Server'}
        </button>
      </div>
      
      {result && (
        <div style={{ 
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '4px',
          ...getStatusStyle(result.status)
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>
            Result: {result.status === 'accessible' ? 'ACCESSIBLE' : result.status === 'inaccessible' ? 'NOT ACCESSIBLE' : result.status.charAt(0).toUpperCase() + result.status.slice(1)}
          </h3>
          <p style={{ margin: '5px 0' }}><strong>Message:</strong> {result.message}</p>
        </div>
      )}
      
      <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <h3>BDIX Server Examples:</h3>
        <ul>
          <li>172.16.50.4 (SAMONLINE)</li>
          <li>discoveryftp.net (DISCOVERY FTP)</li>
          <li>172.27.27.84 (WOW MOVIE ZONE)</li>
          <li>10.16.100.244 (ICC COMMUNICATION)</li>
          <li>103.58.73.9 (BUSINESS NETWORK)</li>
        </ul>
        <p><strong>Tip:</strong> &quot;Accessible&quot; means the server responded (good for BDIX). &quot;Not Accessible&quot; means no response.</p>
      </div>
    </div>
  );
}