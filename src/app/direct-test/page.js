"use client";

import { useState } from 'react';

export default function DirectTest() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    if (!url) {
      setResult('Please enter a URL');
      return;
    }

    setTesting(true);
    setResult('');

    // Normalize URL
    let testUrl = url.trim();
    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
      testUrl = `http://${testUrl}`;
    }

    try {
      // Very simple direct test
      const startTime = Date.now();
      
      await fetch(testUrl, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      setResult(`SUCCESS: Connected in ${duration}ms`);
    } catch (error) {
      setResult(`FAILED: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Direct Connection Test</h1>
      
      <div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter server URL"
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button 
          onClick={testConnection} 
          disabled={testing}
          style={{ padding: '10px 20px' }}
        >
          {testing ? 'Testing...' : 'Test'}
        </button>
      </div>
      
      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px',
          backgroundColor: result.startsWith('SUCCESS') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.startsWith('SUCCESS') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          <strong>{result}</strong>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h3>Test these BDIX servers:</h3>
        <ul>
          <li>http://172.16.50.4 (SAMONLINE)</li>
          <li>http://discoveryftp.net (DISCOVERY)</li>
          <li>http://172.27.27.84 (WOW MOVIE)</li>
        </ul>
      </div>
    </div>
  );
}