"use client";

import { useState } from 'react';

export default function BDIXTest() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testServer = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setResult('');
    
    try {
      // Simple BDIX test
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setResult('Online - Server is accessible');
    } catch (error) {
      setResult('Offline - Server is not accessible');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>BDIX Server Test</h1>
      <div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter server URL (e.g., http://172.16.50.4)"
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button 
          onClick={testServer} 
          disabled={isLoading}
          style={{ padding: '10px 20px' }}
        >
          {isLoading ? 'Testing...' : 'Test Server'}
        </button>
      </div>
      {result && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <strong>Result:</strong> {result}
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <h3>Test URLs:</h3>
        <ul>
          <li>http://172.16.50.4 (SAMONLINE)</li>
          <li>http://discoveryftp.net (DISCOVERY FTP)</li>
          <li>http://172.27.27.84 (WOW MOVIE ZONE)</li>
        </ul>
      </div>
    </div>
  );
}